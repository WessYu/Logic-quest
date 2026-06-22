import { useEffect, useMemo, useRef, useState } from "react";
import {
  clearLocalSession,
  fetchCloudProgress,
  isSupabaseConfigured,
  readLocalProgress,
  readLocalSession,
  refreshSession,
  saveCloudProgress,
  saveLocalSession,
  signInWithPassword,
  signUpWithPassword,
  writeLocalProgress,
} from "./supabaseRest";
import "./accountManager.css";

function getProgressSignature(progress) {
  try {
    return JSON.stringify(progress || {});
  } catch {
    return "{}";
  }
}

function getCompletedCount(progress) {
  return Object.values(progress || {}).filter((lesson) => lesson?.completed).length;
}

function getUserLabel(session) {
  return session?.user?.email || "Conta conectada";
}

export default function AccountManager() {
  const configured = isSupabaseConfigured();
  const [session, setSession] = useState(() => readLocalSession());
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const lastUploadedRef = useRef(getProgressSignature(readLocalProgress()));

  const localProgress = useMemo(() => readLocalProgress(), [lastSync, session]);
  const completedCount = getCompletedCount(localProgress);

  useEffect(() => {
    if (!configured || !session?.refresh_token) return undefined;

    const refresh = async () => {
      try {
        const updated = await refreshSession(session.refresh_token);
        if (updated?.access_token) {
          saveLocalSession(updated);
          setSession(updated);
        }
      } catch {
        clearLocalSession();
        setSession(null);
      }
    };

    const timer = window.setInterval(refresh, 1000 * 60 * 45);
    return () => window.clearInterval(timer);
  }, [configured, session?.refresh_token]);

  useEffect(() => {
    if (!configured || !session?.access_token) return undefined;

    const timer = window.setInterval(async () => {
      const currentProgress = readLocalProgress();
      const currentSignature = getProgressSignature(currentProgress);

      if (currentSignature === lastUploadedRef.current) return;

      try {
        await saveCloudProgress(session, currentProgress);
        lastUploadedRef.current = currentSignature;
        setLastSync(new Date().toISOString());
        setMessage("Progresso salvo na nuvem.");
      } catch (error) {
        setMessage(error.message || "Não foi possível sincronizar agora.");
      }
    }, 2500);

    return () => window.clearInterval(timer);
  }, [configured, session]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!configured) {
      setMessage("Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY para ativar contas reais.");
      return;
    }

    if (!email || !password) {
      setMessage("Informe email e senha.");
      return;
    }

    setIsBusy(true);
    setMessage("");

    try {
      const result = mode === "login" ? await signInWithPassword(email, password) : await signUpWithPassword(email, password);

      if (!result?.access_token) {
        setMessage("Conta criada. Se o Supabase pedir confirmação de email, confirme antes de entrar.");
        setMode("login");
        return;
      }

      saveLocalSession(result);
      setSession(result);
      setEmail("");
      setPassword("");
      setIsOpen(false);

      const cloud = await fetchCloudProgress(result);
      const local = readLocalProgress();
      const hasCloudProgress = cloud?.progress && Object.keys(cloud.progress).length > 0;
      const hasLocalProgress = local && Object.keys(local).length > 0;

      if (hasCloudProgress) {
        writeLocalProgress(cloud.progress);
        lastUploadedRef.current = getProgressSignature(cloud.progress);
        setMessage("Progresso da nuvem carregado. Atualizando a trilha...");
        window.setTimeout(() => window.location.reload(), 500);
        return;
      }

      if (hasLocalProgress) {
        await saveCloudProgress(result, local);
        lastUploadedRef.current = getProgressSignature(local);
      }

      setLastSync(new Date().toISOString());
      setMessage("Conta conectada e progresso sincronizado.");
    } catch (error) {
      setMessage(error.message || "Não foi possível entrar.");
    } finally {
      setIsBusy(false);
    }
  }

  async function syncNow() {
    if (!session) return;

    setIsBusy(true);
    try {
      const progress = readLocalProgress();
      await saveCloudProgress(session, progress);
      lastUploadedRef.current = getProgressSignature(progress);
      setLastSync(new Date().toISOString());
      setMessage("Sincronizado agora.");
    } catch (error) {
      setMessage(error.message || "Falha ao sincronizar.");
    } finally {
      setIsBusy(false);
    }
  }

  function logout() {
    clearLocalSession();
    setSession(null);
    setIsOpen(false);
    setMessage("Você saiu da conta. O progresso local continua neste navegador.");
  }

  return (
    <div className="account-widget">
      <button className="account-trigger" type="button" onClick={() => setIsOpen((value) => !value)}>
        <span className={`account-dot ${session ? "online" : "offline"}`} />
        <span>{session ? getUserLabel(session) : "Entrar"}</span>
      </button>

      {isOpen ? (
        <div className="account-panel">
          <div className="account-panel-header">
            <div>
              <span className="account-eyebrow">Logic Quest Cloud</span>
              <strong>{session ? "Progresso na nuvem" : "Sistema de contas"}</strong>
            </div>
            <button type="button" onClick={() => setIsOpen(false)} aria-label="Fechar painel">
              ×
            </button>
          </div>

          {!configured ? (
            <div className="account-warning">
              Supabase ainda não configurado. Crie o projeto e adicione as variáveis do `.env`.
            </div>
          ) : null}

          {session ? (
            <div className="account-signed">
              <div className="account-stat">
                <span>Conta</span>
                <strong>{getUserLabel(session)}</strong>
              </div>
              <div className="account-stat">
                <span>Lições concluídas neste navegador</span>
                <strong>{completedCount}</strong>
              </div>
              <div className="account-stat">
                <span>Última sincronização</span>
                <strong>{lastSync ? new Date(lastSync).toLocaleString("pt-BR") : "Aguardando"}</strong>
              </div>
              <div className="account-actions">
                <button type="button" onClick={syncNow} disabled={isBusy}>
                  Sincronizar agora
                </button>
                <button type="button" className="danger" onClick={logout}>
                  Sair
                </button>
              </div>
            </div>
          ) : (
            <form className="account-form" onSubmit={handleSubmit}>
              <div className="account-tabs">
                <button type="button" className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>
                  Entrar
                </button>
                <button type="button" className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")}>
                  Criar conta
                </button>
              </div>

              <label>
                Email
                <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="voce@email.com" />
              </label>
              <label>
                Senha
                <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="mínimo 6 caracteres" />
              </label>
              <button type="submit" disabled={isBusy || !configured}>
                {isBusy ? "Processando..." : mode === "login" ? "Entrar e carregar trilha" : "Criar conta"}
              </button>
            </form>
          )}

          {message ? <p className="account-message">{message}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
