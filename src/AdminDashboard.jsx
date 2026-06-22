import { useEffect, useState } from "react";
import { readLocalSession, refreshSession, saveLocalSession } from "./supabaseRest";
import "./adminDashboard.css";

const rawUrl = import.meta.env.VITE_SUPABASE_URL || "";
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

function clean(value) {
  return String(value || "").trim().replace(/^['\"]|['\"]$/g, "");
}

function getUrl() {
  const value = clean(rawUrl).replace(/\/$/, "");
  return value.startsWith("http") ? value : `https://${value}`;
}

function formatDate(value) {
  if (!value) return "sem data";
  return new Date(value).toLocaleString("pt-BR");
}

function looksLikeExpiredSession(error) {
  const text = String(error?.message || "").toLowerCase();
  return text.includes("expired") || text.includes("sessão venceu") || text.includes("token");
}

async function loadDashboard(session) {
  const response = await fetch(`${getUrl()}/rest/v1/rpc/get_admin_dashboard`, {
    method: "POST",
    headers: {
      apikey: clean(rawKey),
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || data?.error || "Painel indisponível para esta conta.");
  }

  return data;
}

async function refreshLocalSession(session) {
  if (!session?.refresh_token) return session;

  try {
    const updated = await refreshSession(session.refresh_token);
    if (updated?.access_token) {
      saveLocalSession(updated);
      return updated;
    }
  } catch {
    return session;
  }

  return session;
}

export default function AdminDashboard({ session: externalSession }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [sessionOverride, setSessionOverride] = useState(null);
  const session = sessionOverride || externalSession || readLocalSession();

  async function refresh() {
    if (!session?.access_token) {
      setMessage("Entre na sua conta de criador para carregar o painel.");
      return;
    }

    setBusy(true);
    setMessage("");

    try {
      let activeSession = await refreshLocalSession(session);
      setSessionOverride(activeSession);

      try {
        const dashboard = await loadDashboard(activeSession);
        setData(dashboard);
        return;
      } catch (firstError) {
        if (!looksLikeExpiredSession(firstError)) throw firstError;

        activeSession = await refreshLocalSession(activeSession);
        setSessionOverride(activeSession);
        const dashboard = await loadDashboard(activeSession);
        setData(dashboard);
      }
    } catch (error) {
      setMessage(
        error.message === "not_authorized"
          ? "Essa conta ainda não está cadastrada como admin no Supabase."
          : looksLikeExpiredSession(error)
            ? "Sua sessão venceu. Saia da conta e entre novamente."
            : error.message,
      );
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (open && !data && !busy) refresh();
  }, [open]);

  if (!session) return null;

  return (
    <section className="admin-dashboard">
      <button className="admin-dashboard-trigger" type="button" onClick={() => setOpen((value) => !value)}>
        Painel do criador
      </button>

      {open ? (
        <div className="admin-dashboard-panel">
          <div className="admin-dashboard-head">
            <div>
              <span className="account-eyebrow">Creator analytics</span>
              <strong>Visão geral do Logic Quest</strong>
            </div>
            <button type="button" onClick={refresh} disabled={busy}>
              {busy ? "..." : "Atualizar"}
            </button>
          </div>

          {message ? <p className="admin-dashboard-message">{message}</p> : null}

          {data ? (
            <>
              <div className="admin-metrics-grid">
                <article><span>Contas criadas</span><strong>{data.total_users || 0}</strong></article>
                <article><span>Com progresso</span><strong>{data.users_with_progress || 0}</strong></article>
                <article><span>Média do curso</span><strong>{data.avg_completion || 0}%</strong></article>
                <article><span>Domínio médio</span><strong>{data.avg_mastery || 0}%</strong></article>
                <article><span>Lições concluídas</span><strong>{data.total_completed || 0}</strong></article>
                <article><span>XP total</span><strong>{data.total_xp || 0}</strong></article>
              </div>

              <div className="admin-progress-card">
                <div>
                  <span>Ativos nas últimas 24h</span>
                  <strong>{data.active_today || 0}</strong>
                </div>
                <div className="admin-meter">
                  <i style={{ width: `${Math.min(100, data.avg_completion || 0)}%` }} />
                </div>
              </div>

              <div className="admin-recent-card">
                <span className="account-eyebrow">Atividade recente</span>
                {(data.recent_activity || []).length ? (
                  data.recent_activity.map((item, index) => (
                    <div className="admin-recent-item" key={`${item.email}-${index}`}>
                      <strong>{item.email || "usuário sem email"}</strong>
                      <span>{item.completed || 0} lições • {item.xp || 0} XP</span>
                      <small>{formatDate(item.updated_at)}</small>
                    </div>
                  ))
                ) : (
                  <p className="admin-dashboard-message">Ainda não há progresso salvo.</p>
                )}
              </div>
            </>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
