import { useMemo } from "react";
import { courseModules } from "./courseData";
import "./mimoStandalone.css";

function flattenLessons(modules) {
  return modules.flatMap((module) => module.lessons);
}

const previewCards = [
  {
    eyebrow: "Editors' Choice",
    title: "Aprender lógica",
    type: "phone-code",
  },
  {
    eyebrow: "Trilhas práticas",
    title: "Code JavaScript, CSS e React",
    type: "tech-stack",
  },
  {
    eyebrow: "Projetos reais",
    title: "De lições curtas a projetos completos",
    type: "lesson-phone",
  },
  {
    eyebrow: "Aprendizado guiado",
    title: "Explore um caminho personalizado",
    type: "path-phone",
  },
  {
    eyebrow: "Prática diária",
    title: "Dê impulso à sua carreira em poucos minutos",
    type: "career-path",
  },
];

function PreviewVisual({ type }) {
  if (type === "tech-stack") {
    return (
      <div className="mimo-preview-stack" aria-hidden="true">
        {["JavaScript", "HTML", "CSS", "TypeScript", "React", "Node.js", "Express", "SQL"].map((tech) => (
          <span key={tech}>{tech}</span>
        ))}
        <div className="mimo-keyboard-phone">
          <div className="mimo-keyboard-screen" />
          <div className="mimo-key-row" />
          <div className="mimo-key-row short" />
          <div className="mimo-mini-bot">LQ</div>
        </div>
      </div>
    );
  }

  if (type === "lesson-phone") {
    return (
      <div className="mimo-phone-wrap lesson" aria-hidden="true">
        <div className="mimo-floating-tag html">&lt;html&gt;</div>
        <div className="mimo-floating-tag head">&lt;head&gt;</div>
        <div className="mimo-floating-tag close">&lt;/html&gt;</div>
        <div className="mimo-phone-frame">
          <div className="mimo-phone-pill" />
          <div className="mimo-code-lines">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
          <div className="mimo-keyboard-grid" />
        </div>
      </div>
    );
  }

  if (type === "path-phone") {
    return (
      <div className="mimo-phone-wrap path" aria-hidden="true">
        <div className="mimo-phone-frame">
          <div className="mimo-phone-pill" />
          <div className="mimo-path-progress">Intro to JS <span>75%</span></div>
          <div className="mimo-path-map">
            <b />
            <b />
            <b />
            <b />
          </div>
        </div>
      </div>
    );
  }

  if (type === "career-path") {
    return (
      <div className="mimo-phone-wrap career" aria-hidden="true">
        <div className="mimo-badge-row"><span>JS</span><span>CSS</span><span>API</span></div>
        <div className="mimo-phone-frame">
          <div className="mimo-phone-pill" />
          <div className="mimo-career-card"><strong>Front-End</strong><em /></div>
          <div className="mimo-career-card"><strong>JavaScript</strong><em /></div>
          <div className="mimo-career-card"><strong>React</strong><em /></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mimo-phone-wrap code" aria-hidden="true">
      <div className="mimo-phone-frame tilted">
        <div className="mimo-phone-pill" />
        <div className="mimo-code-lines">
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
      </div>
    </div>
  );
}

export default function MimoMobileExperience() {
  const modules = useMemo(() => courseModules, []);
  const lessons = useMemo(() => flattenLessons(modules), [modules]);
  const firstLesson = lessons[0];

  function scrollToPath() {
    document.querySelector("#logic-path")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main className="mimo-mobile-root">
      <section className="mimo-store-header" aria-label="Logic Quest">
        <div className="mimo-store-icon">LQ</div>

        <div className="mimo-store-title">
          <h1>Logic Quest</h1>
          <p>Code JavaScript, CSS e lógica</p>
        </div>

        <button type="button" className="mimo-store-download" onClick={scrollToPath}>
          Abrir
        </button>
      </section>

      <section className="mimo-store-meta" aria-label="Informações do app">
        <div>
          <strong>★★★★★</strong>
          <span>Projeto dev</span>
        </div>
        <div>
          <strong>WessYu</strong>
          <span>Criador</span>
        </div>
        <div>
          <strong>Educação</strong>
          <span>Categoria</span>
        </div>
      </section>

      <section className="mimo-store-summary">
        <p>
          Aprenda lógica de programação com lições curtas, prática real e uma trilha feita para evoluir do zero ao código.
        </p>
      </section>

      <section className="mimo-preview-section" aria-label="Prévia do Logic Quest">
        <h2>Prévia</h2>

        <div className="mimo-preview-rail">
          {previewCards.map((card) => (
            <article className="mimo-preview-card" key={card.title}>
              <div className="mimo-preview-copy">
                <span>{card.eyebrow}</span>
                <h3>{card.title}</h3>
              </div>
              <PreviewVisual type={card.type} />
            </article>
          ))}
        </div>
      </section>

      <section className="mimo-store-description">
        <h2>Por que usar?</h2>
        <p>
          O Logic Quest transforma lógica, sequência, condições e prática em passos visuais. Você aprende lendo, testando e desbloqueando lições.
        </p>
      </section>

      <section className="mimo-path-section" id="logic-path">
        <div className="mimo-section-title">
          <div>
            <span>Trilha</span>
            <h2>Comece por aqui</h2>
          </div>
          <strong>{lessons.length} lições</strong>
        </div>

        <div className="mimo-path-card">
          <span>Módulo 1</span>
          <h3>{modules[0]?.title}</h3>
          <p>{firstLesson?.objective}</p>
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            Ver prévias
          </button>
        </div>
      </section>
    </main>
  );
}
