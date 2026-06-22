const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const progressStorageKey = "logic-quest-progress-v4";
export const authStorageKey = "logic-quest-supabase-session";

export function isSupabaseConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

function getBaseUrl() {
  return String(SUPABASE_URL || "").replace(/\/$/, "");
}

function getHeaders(token) {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${token || SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
  };
}

async function request(path, options = {}) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase ainda não foi configurado no .env.");
  }

  const response = await fetch(`${getBaseUrl()}${path}`, {
    ...options,
    headers: {
      ...getHeaders(options.token),
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

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
