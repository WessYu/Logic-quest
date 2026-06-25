import { useEffect, useMemo, useState } from "react";
import { courseModules } from "./courseData";
import "./mimoStandalone.css";

const storageKey = "logic-quest-progress-v4";

function getStoredProgress() {
  try {
    return JSON.parse(window.localStorage.getItem(storageKey) ?? "{}") ?? {};
  } catch {
    return {};
  }
}

function flattenLessons(modules) {
  return modules.flatMap((module, moduleIndex) =>
    module.lessons.map((lesson, lessonIndex) => ({
      ...lesson,
      moduleId: module.id,
      moduleTitle: module.title,
      moduleLevel: module.level,
      moduleNumber: moduleIndex + 1,
      lessonNumber: lessonIndex + 1,
    })),
  );
}

function isLessonUnlocked(lessonId, lessons, progress) {
  const lessonIndex = lessons.findIndex((lesson) => lesson.id === lessonId);
  if (lessonIndex <= 0) return true;
  return Boolean(progress[lessons[lessonIndex - 1].id]?.completed);
}

function formatPercent(value) {
  if (!Number.isFinite(value)) return 0;
  return Math.round(value);
}

export default function MimoMobileExperience() {
  const modules = useMemo(() => courseModules, []);
  const lessons = useMemo(() => flattenLessons(modules), [modules]);
  const [progress, setProgress] = useState(() => getStoredProgress());
  const firstPending = lessons.find((lesson) => !progress[lesson.id]?.completed) ?? lessons[0];
  const [activeView, setActiveView] = useState("home");
  const [activeLessonId, setActiveLessonId] = useState(firstPending?.id ?? lessons[0]?.id);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const activeLesson = lessons.find((lesson) => lesson.id === activeLessonId) ?? lessons[0];
  const activeModule = modules.find((module) => module.id === activeLesson?.moduleId) ?? modules[0];
  const completedCount = lessons.filter((lesson) => progress[lesson.id]?.completed).length;
  const totalXp = lessons.reduce((sum, lesson) => sum + (progress[lesson.id]?.xpEarned ?? 0), 0);
  const overallProgress = formatPercent((completedCount / lessons.length) * 100);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(progress));
  }, [progress]);

  function openLesson(lessonId) {
    if (!isLessonUnlocked(lessonId, lessons, progress)) return;
    setActiveLessonId(lessonId);
    setActiveView("lesson");
    setAnswers({});
    setResult(null);
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  function markLessonDone(lesson = activeLesson, score = 100) {
    setProgress((current) => ({
      ...current,
      [lesson.id]: {
        ...(current[lesson.id] ?? {}),
        completed: true,
        completedAt: new Date().toISOString(),
        bestScore: Math.max(current[lesson.id]?.bestScore ?? 0, score),
        xpEarned: Math.max(current[lesson.id]?.xpEarned ?? 0, lesson.xp),
      },
    }));
  }

  function submitQuiz() {
    const unanswered = activeLesson.quiz.filter((question) => answers[question.id] === undefined);
    if (unanswered.length > 0) {
      setResult({ status: "warning", message: `Faltam ${unanswered.length} resposta(s).` });
      return;
    }

    const correct = activeLesson.quiz.filter((question) => answers[question.id] === question.answer).length;
    const score = formatPercent((correct / activeLesson.quiz.length) * 100);
    const passed = score >= 70;

    if (passed) markLessonDone(activeLesson, score);

    setResult({
      status: passed ? "success" : "retry",
      message: passed ? `Boa. Você fez ${score}% e liberou XP.` : `Você fez ${score}%. Revise e tenta de novo.`,
    });
  }

  function renderHome() {
    return (
      <>
        <section className="mimo-hero">
          <span className="mimo-eyebrow">IA Programação</span>
          <h1>Aprender lógica ficou simples.</h1>
          <p>De lições curtas a prática real em JavaScript, com progresso salvo no seu ritmo.</p>

          <div className="mimo-tags" aria-label="Tecnologias do curso">
            <span>JavaScript</span>
            <span>HTML</span>
            <span>CSS</span>
            <span>React</span>
            <span>Node</span>
          </div>
        </section>

        <section className="mimo-continue-card">
          <div>
            <span className="mimo-eyebrow">Continue agora</span>
            <h2>{firstPending.title}</h2>
            <p>{firstPending.objective}</p>
          </div>
          <button type="button" onClick={() => openLesson(firstPending.id)}>
            Estudar agora
          </button>
        </section>

        <section className="mimo-section-head">
          <div>
            <span className="mimo-eyebrow">Trilha</span>
            <h2>Módulos do curso</h2>
          </div>
          <span>{lessons.length} lições</span>
        </section>

        <div className="mimo-module-stack">
          {modules.map((module, moduleIndex) => (
            <article className="mimo-module-card" key={module.id}>
              <div className="mimo-module-top">
                <span>Módulo {moduleIndex + 1}</span>
                <strong>{module.level}</strong>
              </div>
              <h3>{module.title}</h3>
              <p>{module.summary}</p>

              <div className="mimo-lesson-list">
                {module.lessons.map((lesson, lessonIndex) => {
                  const unlocked = isLessonUnlocked(lesson.id, lessons, progress);
                  const done = progress[lesson.id]?.completed;

                  return (
                    <button
                      key={lesson.id}
                      type="button"
                      className={done ? "done" : unlocked ? "" : "locked"}
                      disabled={!unlocked}
                      onClick={() => openLesson(lesson.id)}
                    >
                      <span>{done ? "✓" : unlocked ? lessonIndex + 1 : "•"}</span>
                      <div>
                        <strong>{lesson.title}</strong>
                        <small>{done ? "Concluída" : unlocked ? lesson.time : "Bloqueada"}</small>
                      </div>
                    </button>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      </>
    );
  }

  function renderLesson() {
    return (
      <section className="mimo-lesson-screen">
        <button type="button" className="mimo-back" onClick={() => setActiveView("home")}>
          Voltar para trilha
        </button>

        <article className="mimo-lesson-hero">
          <span className="mimo-eyebrow">{activeModule.title}</span>
          <h1>{activeLesson.title}</h1>
          <p>{activeLesson.objective}</p>
          <div className="mimo-lesson-meta">
            <span>{activeLesson.time}</span>
            <span>{activeLesson.difficulty}</span>
            <span>{activeLesson.xp} XP</span>
          </div>
        </article>

        <article className="mimo-content-card">
          <h2>Leitura guiada</h2>
          {activeLesson.reading.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <div className="mimo-tags">
            {activeLesson.concepts.map((concept) => (
              <span key={concept}>{concept}</span>
            ))}
          </div>
        </article>

        <div className="mimo-step-strip">
          {activeLesson.steps.map((step, index) => (
            <article key={step.title}>
              <span>Etapa {index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>

        <article className="mimo-code-card">
          <span>{activeLesson.example.label}</span>
          <pre>{activeLesson.example.code}</pre>
        </article>

        <article className="mimo-content-card">
          <h2>Checkpoint</h2>
          <p>Responda e faça pelo menos 70% para concluir a lição.</p>

          <div className="mimo-quiz-stack">
            {activeLesson.quiz.map((question, questionIndex) => (
              <div className="mimo-question" key={question.id}>
                <strong>Questão {questionIndex + 1}</strong>
                <h3>{question.question}</h3>
                <div className="mimo-options">
                  {question.options.map((option, optionIndex) => (
                    <button
                      key={option}
                      type="button"
                      className={answers[question.id] === optionIndex ? "selected" : ""}
                      onClick={() => setAnswers((current) => ({ ...current, [question.id]: optionIndex }))}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button type="button" className="mimo-primary" onClick={submitQuiz}>
            Corrigir lição
          </button>

          {result ? <div className={`mimo-result ${result.status}`}>{result.message}</div> : null}
        </article>
      </section>
    );
  }

  return (
    <main className="mimo-mobile-root">
      <header className="mimo-app-header">
        <div className="mimo-logo">LQ</div>
        <div>
          <h1>Logic Quest</h1>
          <p>Code JavaScript, CSS e lógica</p>
        </div>
        <span>{overallProgress}%</span>
      </header>

      <section className="mimo-stats-row">
        <article>
          <strong>{completedCount}</strong>
          <span>feitas</span>
        </article>
        <article>
          <strong>{lessons.length}</strong>
          <span>lições</span>
        </article>
        <article>
          <strong>{totalXp}</strong>
          <span>XP</span>
        </article>
      </section>

      {activeView === "lesson" ? renderLesson() : renderHome()}

      <nav className="mimo-bottom-nav" aria-label="Navegação mobile">
        <button type="button" className={activeView === "home" ? "active" : ""} onClick={() => setActiveView("home")}>
          <span>⌂</span>
          Início
        </button>
        <button type="button" onClick={() => window.scrollTo({ top: 320, behavior: "smooth" })}>
          <span>◉</span>
          Trilha
        </button>
        <button type="button" className={activeView === "lesson" ? "active" : ""} onClick={() => openLesson(activeLesson.id)}>
          <span>JS</span>
          Aula
        </button>
        <button type="button">
          <span>○</span>
          Perfil
        </button>
      </nav>
    </main>
  );
}
