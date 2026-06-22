import { useEffect, useMemo, useState } from "react";
import { readLocalProgress, readLocalSession } from "./supabaseRest";
import "./studentProfile.css";

const profileKey = "logic-quest-student-profile";
const openProfileEvent = "logic-quest-open-student-profile";

function readProfile() {
  try {
    const raw = window.localStorage.getItem(profileKey);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProfile(profile) {
  window.localStorage.setItem(profileKey, JSON.stringify(profile));
}

function getStats() {
  const progress = readLocalProgress();
  const lessons = Object.values(progress || {}).filter((item) => item && typeof item === "object");
  const completed = lessons.filter((lesson) => lesson.completed).length;
  const xp = lessons.reduce((sum, lesson) => sum + (lesson.xpEarned || 0), 0);
  const bestScores = lessons.filter((lesson) => Number.isFinite(lesson.bestScore));
  const mastery = bestScores.length
    ? Math.round(bestScores.reduce((sum, lesson) => sum + lesson.bestScore, 0) / bestScores.length)
    : 0;

  return { completed, xp, mastery };
}

function getGithubUrl(username) {
  if (!username) return "";
  return `https://github.com/${username.replace("@", "")}`;
}

function getGithubAvatar(username) {
  if (!username) return "";
  return `${getGithubUrl(username)}.png?size=240`;
}

export default function StudentProfile() {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState(() => readProfile());
  const [stats, setStats] = useState(() => getStats());
  const session = readLocalSession();
  const githubUsername = profile.githubUsername?.replace("@", "") || "";
  const avatar = profile.avatarUrl || getGithubAvatar(githubUsername);
  const fallbackInitial = (profile.displayName || session?.user?.email || "LQ").slice(0, 2).toUpperCase();
  const githubUrl = useMemo(() => getGithubUrl(githubUsername), [githubUsername]);

  useEffect(() => {
    const timer = window.setInterval(() => setStats(getStats()), 2500);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const openProfile = () => setOpen(true);
    window.addEventListener(openProfileEvent, openProfile);
    return () => window.removeEventListener(openProfileEvent, openProfile);
  }, []);

  function updateField(field, value) {
    setProfile((current) => {
      const next = { ...current, [field]: value };
      saveProfile(next);
      return next;
    });
  }

  return (
    <>
      <button className="student-profile-trigger" type="button" onClick={() => setOpen(true)}>
        {avatar ? <img src={avatar} alt="Foto do aluno" /> : <span>{fallbackInitial}</span>}
        <strong>Área do aluno</strong>
      </button>

      {open ? (
        <section className="student-profile-overlay" aria-label="Área do aluno">
          <div className="student-profile-card">
            <header className="student-profile-hero">
              <button className="student-profile-close" type="button" onClick={() => setOpen(false)}>
                ×
              </button>
              <div className="student-avatar-wrap">
                {avatar ? <img src={avatar} alt="Foto do aluno" /> : <span>{fallbackInitial}</span>}
                <input
                  value={profile.avatarUrl || ""}
                  onChange={(event) => updateField("avatarUrl", event.target.value)}
                  placeholder="URL da foto"
                />
              </div>
              <div>
                <span className="panel-caption">PERFIL DO ALUNO</span>
                <h2>{profile.displayName || "Novo estudante Logic Quest"}</h2>
                <p>{profile.bio || "Organize sua trilha, acompanhe evolução e conecte seu GitHub ao perfil."}</p>
              </div>
            </header>

            <div className="student-profile-grid">
              <article className="student-profile-panel wide">
                <span className="panel-caption">IDENTIDADE</span>
                <label>
                  Nome exibido
                  <input
                    value={profile.displayName || ""}
                    onChange={(event) => updateField("displayName", event.target.value)}
                    placeholder="Ex: Wess"
                  />
                </label>
                <label>
                  Bio curta
                  <textarea
                    value={profile.bio || ""}
                    onChange={(event) => updateField("bio", event.target.value)}
                    placeholder="Front-end em evolução, estudando lógica e programação."
                  />
                </label>
              </article>

              <article className="student-profile-panel">
                <span className="panel-caption">GITHUB</span>
                <label>
                  Usuário do GitHub
                  <input
                    value={githubUsername}
                    onChange={(event) => updateField("githubUsername", event.target.value.replace("@", ""))}
                    placeholder="WessYu"
                  />
                </label>
                {githubUsername ? (
                  <a className="github-link-card" href={githubUrl} target="_blank" rel="noreferrer">
                    <img src={getGithubAvatar(githubUsername)} alt="Avatar do GitHub" />
                    <span>
                      <strong>@{githubUsername}</strong>
                      <small>Perfil vinculado</small>
                    </span>
                  </a>
                ) : (
                  <p className="student-muted">Digite seu usuário para vincular seu GitHub ao perfil.</p>
                )}
              </article>

              <article className="student-profile-panel stats-panel">
                <span className="panel-caption">PROGRESSO</span>
                <div><strong>{stats.completed}</strong><span>lições concluídas</span></div>
                <div><strong>{stats.xp}</strong><span>XP acumulado</span></div>
                <div><strong>{stats.mastery}%</strong><span>domínio médio</span></div>
              </article>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
