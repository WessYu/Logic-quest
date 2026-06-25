import { useMemo, useState } from "react";
import { courseModules } from "./courseData";
import "./mimoStandalone.css";

function flattenLessons(modules) {
  return modules.flatMap((module, moduleIndex) =>
    module.lessons.map((lesson, lessonIndex) => ({
      ...lesson,
      moduleTitle: module.title,
      moduleLevel: module.level,
      moduleIndex,
      lessonIndex,
    })),
  );
}

function getLessonState(index) {
  if (index === 0) return "active";
  if (index < 3) return "open";
  return "locked";
}

const tabs = [
  { id: "learn", label: "Aprender", icon: "▣" },
  { id: "practice", label: "Prática", icon: "✦" },
  { id: "path", label: "Trilha", icon: "▥" },
  { id: "profile", label: "Perfil", icon: "○" },
];

export default function MimoMobileExperience() {
  const modules = useMemo(() => courseModules, []);
  const lessons = useMemo(() => flattenLessons(modules), [modules]);
  const [activeTab, setActiveTab] = useState("learn");
  const activeLesson = lessons[0];
  const nextLessons = lessons.slice(0, 5);
  const firstModule = modules[0];

  function renderLearn() {
    return (
      <>
        <section className="mimo-hero-card">
          <div className="mimo-hero-copy">
            <span>Continue aprendendo</span>
            <h2>{activeLesson.title}</h2>
            <p>{activeLesson.objective}</p>
            <button type="button" onClick={() => setActiveTab("path")}>Continuar</button>
          </div>

          <div className="mimo-hero-bot" aria-hidden="true">
            <span>LQ</span>
          </div>
        </section>

        <section className="mimo-daily-row" aria-label="Resumo do estudo">
          <article>
            <strong>0</strong>
            <span>dias</span>
          </article>
          <article>
            <strong>{lessons.length}</strong>
            <span>lições</span>
          </article>
          <article>
            <strong>120</strong>
            <span>XP por aula</span>
          </article>
        </section>

        <section className="mimo-section-block">
          <div className="mimo-section-heading">
            <div>
              <span>Hoje</span>
              <h2>Plano de aprendizado</h2>
            </div>
            <button type="button" onClick={() => setActiveTab("path")}>Ver tudo</button>
          </div>

          <div className="mimo-course-card large">
            <div className="mimo-course-icon">JS</div>
            <div>
              <h3>Fundamentos da lógica</h3>
              <p>Entrada, processamento, saída e decisões em JavaScript.</p>
              <div className="mimo-progress-track"><span style={{ width: "18%" }} /></div>
            </div>
          </div>
        </section>

        <section className="mimo-section-block">
          <div className="mimo-section-heading">
            <div>
              <span>Recomendado</span>
              <h2>Lições curtas</h2>
            </div>
          </div>

          <div className="mimo-horizontal-lessons">
            {nextLessons.map((lesson, index) => (
              <article key={lesson.id}>
                <span>{index + 1}</span>
                <h3>{lesson.title}</h3>
                <p>{lesson.time}</p>
              </article>
            ))}
          </div>
        </section>
      </>
    );
  }

  function renderPractice() {
    return (
      <section className="mimo-section-block">
        <div className="mimo-section-heading">
          <div>
            <span>Prática</span>
            <h2>Treine como no Mimo</h2>
          </div>
        </div>

        <div className="mimo-practice-card">
          <div className="mimo-code-editor">
            <div><i /> <i /> <i /></div>
            <pre>{`const nome = "Wess";\nconst foco = true;\nconsole.log(nome);`}</pre>
          </div>
          <h3>Complete o desafio</h3>
          <p>Resolva um exercício rápido e destrave a próxima lição.</p>
          <button type="button">Iniciar prática</button>
        </div>
      </section>
    );
  }

  function renderPath() {
    return (
      <section className="mimo-section-block path-view">
        <div className="mimo-section-heading">
          <div>
            <span>Trilha</span>
            <h2>{firstModule.title}</h2>
          </div>
          <strong>{firstModule.level}</strong>
        </div>

        <div className="mimo-path-map">
          {lessons.slice(0, 9).map((lesson, index) => {
            const state = getLessonState(index);
            return (
              <article className={`mimo-path-node ${state}`} key={lesson.id}>
                <div className="mimo-node-circle">{state === "locked" ? "•" : index + 1}</div>
                <div>
                  <span>{lesson.difficulty}</span>
                  <h3>{lesson.title}</h3>
                  <p>{state === "locked" ? "Bloqueada" : lesson.time}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    );
  }

  function renderProfile() {
    return (
      <section className="mimo-section-block">
        <div className="mimo-profile-card">
          <div className="mimo-profile-avatar">WY</div>
          <h2>WessYu</h2>
          <p>Trilha de lógica em andamento.</p>

          <div className="mimo-profile-grid">
            <article><strong>0</strong><span>concluídas</span></article>
            <article><strong>{lessons.length}</strong><span>lições</span></article>
          </div>
        </div>
      </section>
    );
  }

  return (
    <main className="mimo-mobile-root">
      <header className="mimo-app-topbar">
        <div>
          <span>Bom estudo, Wess</span>
          <h1>Logic Quest</h1>
        </div>
        <button type="button" className="mimo-profile-button" onClick={() => setActiveTab("profile")}>WY</button>
      </header>

      {activeTab === "learn" && renderLearn()}
      {activeTab === "practice" && renderPractice()}
      {activeTab === "path" && renderPath()}
      {activeTab === "profile" && renderProfile()}

      <nav className="mimo-app-tabbar" aria-label="Navegação do app">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={activeTab === tab.id ? "active" : ""}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>
    </main>
  );
}
