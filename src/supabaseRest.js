const RAW_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const RAW_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const SUPABASE_URL = normalizeSupabaseUrl(RAW_SUPABASE_URL);
const SUPABASE_ANON_KEY = normalizeEnvValue(RAW_SUPABASE_ANON_KEY);

export const progressStorageKey = "logic-quest-progress-v4";
export const authStorageKey = "logic-quest-supabase-session";

function normalizeEnvValue(value) {
  return String(value || "").trim().replace(/^['\"]|['\"]$/g, "");
}

function normalizeSupabaseUrl(value) {
  const clean = normalizeEnvValue(value);
  if (!clean) return "";
  const withoutSlash = clean.replace(/\/$/, "");
  return withoutSlash.startsWith("http") ? withoutSlash : `https://${withoutSlash}`;
}

export function isSupabaseConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

export function getSupabaseDebugInfo() {
  return {
    configured: isSupabaseConfigured(),
    urlHost: SUPABASE_URL ? new URL(SUPABASE_URL).host : "não configurado",
    keyType: SUPABASE_ANON_KEY.startsWith("sb_publishable_") ? "publishable" : "anon",
  };
}

function getBaseUrl() {
  return SUPABASE_URL;
}

function getHeaders(token) {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${token || SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
  };
}

function friendlyNetworkError(error) {
  const info = getSupabaseDebugInfo();

  if (error?.name === "TypeError" || String(error?.message || "").includes("Failed to fetch")) {
    return new Error(
      `Não consegui conectar ao Supabase. Confira se a variável VITE_SUPABASE_URL está exatamente como https://seu-projeto.supabase.co e se VITE_SUPABASE_ANON_KEY está correta. URL atual: ${info.urlHost}.`,
    );
  }

  return error;
}

async function request(path, options = {}) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase ainda não foi configurado no GitHub Actions Variables.");
  }

  let response;

  try {
    response = await fetch(`${getBaseUrl()}${path}`, {
      ...options,
      headers: {
        ...getHeaders(options.token),
        ...(options.headers || {}),
      },
    });
  } catch (error) {
    throw friendlyNetworkError(error);
  }

  const text = await response.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text ? { message: text } : null;
  }

  if (!response.ok) {
    const message = data?.msg || data?.message || data?.error_description || data?.error || "Erro no Supabase.";
    throw new Error(message);
  }

  return data;
}

export function readLocalSession() {
  try {
    const raw = window.localStorage.getItem(authStorageKey);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveLocalSession(session) {
  window.localStorage.setItem(authStorageKey, JSON.stringify(session));
}

export function clearLocalSession() {
  window.localStorage.removeItem(authStorageKey);
}

export function readLocalProgress() {
  try {
    const raw = window.localStorage.getItem(progressStorageKey);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function writeLocalProgress(progress) {
  window.localStorage.setItem(progressStorageKey, JSON.stringify(progress || {}));
}

export async function signUpWithPassword(email, password) {
  return request("/auth/v1/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function signInWithPassword(email, password) {
  return request("/auth/v1/token?grant_type=password", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function refreshSession(refreshToken) {
  return request("/auth/v1/token?grant_type=refresh_token", {
    method: "POST",
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
}

export async function fetchCloudProgress(session) {
  const userId = session?.user?.id;
  if (!userId) return null;

  const rows = await request(`/rest/v1/user_progress?select=progress,updated_at&user_id=eq.${userId}&limit=1`, {
    method: "GET",
    token: session.access_token,
  });

  return rows?.[0] || null;
}

export async function saveCloudProgress(session, progress) {
  const userId = session?.user?.id;
  if (!userId) return null;

  const rows = await request("/rest/v1/user_progress?on_conflict=user_id", {
    method: "POST",
    token: session.access_token,
    headers: {
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify({
      user_id: userId,
      progress: progress || {},
      updated_at: new Date().toISOString(),
    }),
  });

  return rows?.[0] || null;
}
