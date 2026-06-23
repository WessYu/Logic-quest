import { useEffect, useMemo, useState } from "react";
import { courseModules } from "./courseData";
import "./logicQuestEnhancements.css";

const progressKey = "logic-quest-progress-v4";
const onboardingKey = "logic-quest-onboarding-seen-v1";

function readProgress() {
  try {
    return JSON.parse(window.localStorage.getItem(progressKey) ?? "{}");
  } catch {
    return {};
  }
}

function flattenLessons() {
  return courseModules.flatMap((module) =>
    module.lessons.map((lesson) => ({ ...lesson, moduleTitle: module.title })),
  );
}

function getDateKey(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

function getCurrentStreak(dateKeys) {
  const completedDays = new Set(dateKeys.filter(Boolean));
  if (!completedDays.size) return 0;

  let streak = 0;
  const cursor = new Date();

  for (;;) {
    const key = cursor.toISOString().slice(0, 10);
    if (!completedDays.has(key)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function getRank(xp, completed) {
  if (completed >= 18 || xp >= 1200) return "Dev Júnior";
  if (completed >= 8 || xp >= 450) return "Aprendiz";
  return "Iniciante";
}

function buildStats(progress, lessons) {
  const completedLessons = lessons.filter((lesson) => progress[lesson.id]?.completed);
  const totalXp = lessons.reduce((sum, lesson) => sum + (progress[lesson.id]?.xpEarned ?? 0), 0);
  const dates = completedLessons.map((lesson) => getDateKey(progress[lesson.id]?.completedAt));
  const perfect = lessons.some((lesson) => (progress[lesson.id]?.bestScore ?? 0) >= 100);
  const completion = lessons.length ? Math.round((completedLessons.length / lessons.length) * 100) : 0;

  const achievements = [
    {
      id: "first",
      title: "Primeira lição",
      description: "Conclua sua primeira lição.",
      unlocked: completedLessons.length >= 1,
    },
    {
      id: "streak3",
      title: "3 dias estudando",
      description: "Estude por três dias seguidos.",
      unlocked: getCurrentStreak(dates) >= 3,
    },
    {
      id: "perfect",
      title: "Checkpoint perfeito",
      description: "Acerte 100% em um checkpoint.",
      unlocked: perfect,
    },
    {
      id: "five",
      title: "Ritmo de dev",
      description: "Complete cinco lições.",
      unlocked: completedLessons.length >= 5,
    },
  ];

  return {
    completed: completedLessons.length,
    total: lessons.length,
    totalXp,
    completion,
    rank: getRank(totalXp, completedLessons.length),
    streak: getCurrentStreak(dates),
    achievements,
  };
}

function scrollToStart() {
  document.querySelector(".explorer-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function installHomeCta() {
  const heroCopy = document.querySelector(".hero-copy");
  if (!heroCopy || heroCopy.querySelector(".lq-start-cta")) return;

  const actions = document.createElement("div");
  actions.className = "lq-home-actions";

  const start = document.createElement("button");
  start.type = "button";
  start.className = "lq-start-cta";
  start.textContent = "Começar agora";
  start.addEventListener("click", scrollToStart);

  const hint = document.createElement("span");
  hint.textContent = "Escolha uma lição, pratique e passe pelo checkpoint.";

  actions.append(start, hint);
  heroCopy.append(actions);
}

function installPortfolioCase() {
  const hero = document.querySelector(".hero-card");
  if (!hero || document.querySelector(".lq-portfolio-case")) return;

  const panel = document.createElement("section");
  panel.className = "lq-portfolio-case";
  panel.innerHTML = `
    <span class="panel-caption">CASE DE PORTFÓLIO</span>
    <div class="lq-case-grid">
      <article><strong>Problema</strong><p>Iniciantes travam em lógica porque estudam conceitos soltos e sem feedback.</p></article>
      <article><strong>Solução</strong><p>Plataforma gamificada com lições guiadas, prática, checkpoints e progresso salvo.</p></article>
      <article><strong>Funcionalidades</strong><p>Módulos, XP, streak, conquistas, playground, conta local e PWA.</p></article>
      <article><strong>Stack</strong><p>React, Vite, CSS, localStorage, PWA e GitHub Pages.</p></article>
    </div>
  `;

  hero.insertAdjacentElement("afterend", panel);
}

export default function LogicQuestEnhancements() {
  const lessons = useMemo(() => flattenLessons(), []);
  const [progress, setProgress] = useState(() => readProgress());
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return window.localStorage.getItem(onboardingKey) !== "true";
  });

  useEffect(() => {
    installHomeCta();
    installPortfolioCase();

    const observer = new MutationObserver(() => {
      installHomeCta();
      installPortfolioCase();
    });

    const root = document.getElementById("root");
    if (root) observer.observe(root, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setProgress(readProgress()), 900);
    const onStorage = () => setProgress(readProgress());
    window.addEventListener("storage", onStorage);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const stats = useMemo(() => buildStats(progress, lessons), [progress, lessons]);

  function closeOnboarding() {
    window.localStorage.setItem(onboardingKey, "true");
    setShowOnboarding(false);
  }

  function startTrail() {
    closeOnboarding();
    window.setTimeout(scrollToStart, 80);
  }

  return (
    <>
      {showOnboarding ? (
        <section className="lq-onboarding" aria-label="Bem-vindo ao Logic Quest">
          <div className="lq-onboarding-card">
            <span className="panel-caption">BEM-VINDO AO LOGIC QUEST</span>
            <h2>Aprenda lógica em missões curtas.</h2>
            <p>
              Escolha uma lição, leia o raciocínio, pratique no playground e passe pelo checkpoint
              para ganhar XP, subir de nível e manter sua sequência diária.
            </p>
            <div className="lq-onboarding-steps">
              <span>01 Escolha uma lição</span>
              <span>02 Pratique</span>
              <span>03 Passe no checkpoint</span>
            </div>
            <div className="lq-onboarding-actions">
              <button type="button" onClick={startTrail}>Começar agora</button>
              <button type="button" onClick={closeOnboarding}>Ver depois</button>
            </div>
          </div>
        </section>
      ) : null}

      <aside className="lq-gamification-panel" aria-label="Gamificação Logic Quest">
        <div className="lq-level-row">
          <span>Nível</span>
          <strong>{stats.rank}</strong>
        </div>
        <div className="lq-xp-row">
          <strong>{stats.totalXp} XP</strong>
          <span>{stats.streak} dia(s) de streak</span>
        </div>
        <div className="lq-progress-track" aria-label={`Progresso da trilha ${stats.completion}%`}>
          <span style={{ width: `${stats.completion}%` }} />
        </div>
        <small>{stats.completed}/{stats.total} lições concluídas</small>
        <div className="lq-achievements">
          {stats.achievements.map((achievement) => (
            <span
              key={achievement.id}
              className={achievement.unlocked ? "unlocked" : "locked"}
              title={achievement.description}
            >
              {achievement.title}
            </span>
          ))}
        </div>
      </aside>
    </>
  );
}
