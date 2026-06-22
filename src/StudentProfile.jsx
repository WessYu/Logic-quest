import { useEffect, useMemo, useState } from "react";
import { readLocalProgress, readLocalSession } from "./supabaseRest";
import "./studentProfile.css";

const profileKey = "logic-quest-student-profile";
const openProfileEvent = "logic-quest-open-student-profile";
const dayMs = 1000 * 60 * 60 * 24;
const weekDays = ["S", "T", "Q", "Q", "S"];

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

function toDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function monthLabel(date) {
  return new Intl.DateTimeFormat("pt-BR", { month: "short" })
    .format(date)
    .replace(".", "")
    .replace(/^./, (letter) => letter.toUpperCase());
}

function getGithubUrl(username) {
  if (!username) return "";
  return `https://github.com/${username.replace("@", "")}`;
}

function getGithubAvatar(username) {
  if (!username) return "";
  return `${getGithubUrl(username)}.png?size=240`;
}

function getRank(score) {
  if (score >= 5000) return "Arquiteto Lógico";
  if (score >= 3000) return "Dev em Ascensão";
  if (score >= 1500) return "Resolvedor";
  if (score >= 600) return "Aprendiz Forte";
  return "Aprendiz Lógico";
}

function buildActivity(progress) {
  const activity = {};
  const events = [];

  Object.entries(progress || {}).forEach(([lessonId, lesson]) => {
    if (!lesson || typeof lesson !== "object") return;
    if (!lesson.completedAt) return;

    const date = new Date(lesson.completedAt);
    if (Number.isNaN(date.getTime())) return;

    const key = toDateKey(date);
    activity[key] = (activity[key] || 0) + 1;
    events.push({
      id: lessonId,
      date,
      score: Number.isFinite(lesson.bestScore) ? lesson.bestScore : null,
      xp: lesson.xpEarned || 0,
    });
  });

  return {
    activity,
    events: events.sort((a, b) => b.date.getTime() - a.date.getTime()),
  };
}

function getCurrentStreak(activity) {
  let streak = 0;
  const today = startOfDay(new Date());

  for (let index = 0; index < 365; index += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - index);
    const key = toDateKey(date);

    if (!activity[key]) break;
    streak += 1;
  }

  return streak;
}

function buildFrequency(activity) {
  const today = startOfDay(new Date());
  const start = new Date(today);
  start.setDate(today.getDate() - 181);
  start.setDate(start.getDate() - start.getDay());

  const cells = Array.from({ length: 26 * 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const count = activity[toDateKey(date)] || 0;

    return {
      id: toDateKey(date),
      date,
      count,
      level: count >= 4 ? 4 : count,
    };
  });

  const months = [];
  let last = "";

  for (let week = 0; week < 26; week += 1) {
    const cell = cells[week * 7];
    const label = monthLabel(cell.date);
    const shouldShow = label !== last;
    months.push({ id: `${cell.id}-${label}`, label: shouldShow ? label : "" });
    if (shouldShow) last = label;
  }

  return { cells, months };
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
  const { activity, events } = buildActivity(progress);
  const activeDays = Object.values(activity).filter(Boolean).length;
  const streak = getCurrentStreak(activity);
  const score = xp + completed * 25 + mastery * 5 + streak * 15;

  return {
    activeDays,
    activity,
    completed,
    events,
    frequency: buildFrequency(activity),
    mastery,
    rank: getRank(score),
    score,
    streak,
    xp,
  };
}

export default function StudentProfile() {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState(() => readProfile());
  const [stats, setStats] = useState(() => getStats());
  const session = readLocalSession();
  const githubUsername = profile.githubUsername?.replace("@", "") || "";
  const avatar = profile.avatarUrl || getGithubAvatar(githubUsername);
  const displayName = profile.displayName || session?.user?.email?.split("@")[0] || "Estudante Logic Quest";
  const fallbackInitial = displayName.slice(0, 2).toUpperCase();
  const githubUrl = useMemo(() => getGithubUrl(githubUsername), [githubUsername]);
  const completionRate = Math.min(100, Math.round((stats.completed / 28) * 100));

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
            <button className="student-profile-close" type="button" onClick={() => setOpen(false)}>
              ×
            </button>

            <header className="student-profile-hero">
              <div className="student-avatar-wrap">
                {avatar ? <img src={avatar} alt="Foto do aluno" /> : <span>{fallbackInitial}</span>}
              </div>

              <div className="student-identity-block">
                <span className="panel-caption">ÁREA DO ALUNO</span>
                <h2>{displayName}</h2>
                <p>{profile.bio || "Trilha ativa de lógica, programação e resolução de problemas."}</p>
                <div className="student-profile-tags">
                  <span>{stats.rank}</span>
                  {githubUsername ? <span>@{githubUsername}</span> : <span>GitHub não vinculado</span>}
                  <span>{stats.streak} dia(s) de sequência</span>
                </div>
              </div>

              <div className="student-score-card">
                <small>Score</small>
                <strong>{stats.score}</strong>
                <span>{completionRate}% da trilha</span>
              </div>
            </header>

            <div className="student-dashboard-grid">
              <aside className="student-profile-panel student-editor-panel">
                <span className="panel-caption">PERFIL</span>
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
                <label>
                  URL da foto
                  <input
                    value={profile.avatarUrl || ""}
                    onChange={(event) => updateField("avatarUrl", event.target.value)}
                    placeholder="Cole a URL da imagem"
                  />
                </label>
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
                      <small>Perfil vinculado ao GitHub</small>
                    </span>
                  </a>
                ) : null}
              </aside>

              <main className="student-profile-main">
                <section className="student-metrics-row" aria-label="Estatísticas do aluno">
                  <div className="student-metric-card">
                    <span>XP</span>
                    <strong>{stats.xp}</strong>
                    <small>acumulado</small>
                  </div>
                  <div className="student-metric-card">
                    <span>Lições</span>
                    <strong>{stats.completed}</strong>
                    <small>de 28</small>
                  </div>
                  <div className="student-metric-card">
                    <span>Domínio</span>
                    <strong>{stats.mastery}%</strong>
                    <small>média</small>
                  </div>
                  <div className="student-metric-card">
                    <span>Frequência</span>
                    <strong>{stats.activeDays}</strong>
                    <small>dias ativos</small>
                  </div>
                </section>

                <section className="student-frequency-card">
                  <div className="student-section-heading">
                    <div>
                      <span className="panel-caption">FREQUÊNCIA</span>
                      <h3>Marcador de estudos</h3>
                    </div>
                    <strong>{stats.streak} dia(s) seguidos</strong>
                  </div>

                  <div className="student-frequency-board">
                    <div className="student-frequency-months" aria-hidden="true">
                      {stats.frequency.months.map((month) => (
                        <span key={month.id}>{month.label}</span>
                      ))}
                    </div>
                    <div className="student-frequency-wrap">
                      <div className="student-frequency-days" aria-hidden="true">
                        {weekDays.map((day, index) => (
                          <span key={`${day}-${index}`}>{day}</span>
                        ))}
                      </div>
                      <div className="student-frequency-grid">
                        {stats.frequency.cells.map((cell) => (
                          <span
                            key={cell.id}
                            className={`student-frequency-cell level-${cell.level}`}
                            title={`${cell.count} lição(ões) em ${cell.date.toLocaleDateString("pt-BR")}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="student-frequency-footer">
                    <span>{stats.activeDays} dias ativos nos últimos meses</span>
                    <div className="student-frequency-legend">
                      <span>Less</span>
                      {[0, 1, 2, 3, 4].map((level) => (
                        <i key={level} className={`student-frequency-cell level-${level}`} />
                      ))}
                      <span>More</span>
                    </div>
                  </div>
                </section>

                <section className="student-activity-card">
                  <div className="student-section-heading">
                    <div>
                      <span className="panel-caption">ATIVIDADE</span>
                      <h3>Últimos movimentos</h3>
                    </div>
                  </div>

                  <div className="student-activity-list">
                    {stats.events.length ? (
                      stats.events.slice(0, 4).map((event) => (
                        <div key={`${event.id}-${event.date.toISOString()}`} className="student-activity-item">
                          <span>+{event.xp || 25} XP</span>
                          <strong>{event.id.replaceAll("-", " ")}</strong>
                          <small>{event.date.toLocaleDateString("pt-BR")} {event.score !== null ? `• score ${event.score}%` : ""}</small>
                        </div>
                      ))
                    ) : (
                      <p className="student-muted">Conclua a primeira lição para preencher sua atividade, score e frequência.</p>
                    )}
                  </div>
                </section>
              </main>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
