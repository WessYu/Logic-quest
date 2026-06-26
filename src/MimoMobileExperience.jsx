import { useEffect, useMemo, useState } from "react";
import { courseModules } from "./courseData";

const mobileStorageKey = "logic-quest-mimo-mobile-v1";

const tabs = [
  { id: "learn", label: "Inicio", icon: "01" },
  { id: "path", label: "Trilha", icon: "02" },
  { id: "practice", label: "Pratica", icon: "</>" },
  { id: "profile", label: "Perfil", icon: "ID" },
];

const codingMilestones = [
  {
    lessons: 4,
    label: "Escrever algoritmos",
    description: "Transforma um problema em entrada, regra e saida.",
  },
  {
    lessons: 8,
    label: "Criar regras em JS",
    description: "Usa variaveis, calculos, comparacoes e booleanos.",
  },
  {
    lessons: 12,
    label: "Controlar decisoes",
    description: "Monta validacoes, mensagens e fluxos com if e switch.",
  },
  {
    lessons: 16,
    label: "Trabalhar com listas",
    description: "Percorre, filtra, soma e transforma arrays reais.",
  },
  {
    lessons: 20,
    label: "Organizar funcoes",
    description: "Quebra regras em funcoes pequenas e reutilizaveis.",
  },
  {
    lessons: 24,
    label: "Construir no navegador",
    description: "Liga DOM, eventos, formularios e renderizacao.",
  },
  {
    lessons: 28,
    label: "Entregar um mini app",
    description: "Planeja, implementa, testa e melhora um projeto completo.",
  },
];

const capstoneProjects = [
  "To-do list com tarefas concluidas",
  "Calculadora de IMC com validacao",
  "Controle de gastos com total por categoria",
  "Quiz com pontuacao e feedback",
  "Carrinho simples com total e desconto",
];

const textReplacements = [
  ["ÃƒÂ³", "ó"],
  ["ÃƒÂ§", "ç"],
  ["ÃƒÂ£", "ã"],
  ["ÃƒÂ¡", "á"],
  ["ÃƒÂ©", "é"],
  ["ÃƒÂ­", "í"],
  ["ÃƒÂº", "ú"],
  ["ÃƒÂª", "ê"],
  ["ÃƒÂ´", "ô"],
  ["Ãƒâ€°", "É"],
  ["Ãƒâ€¡", "Ç"],
  ["Ãƒ", "à"],
  ["Ã¢â‚¬Â¢", "•"],
  ["Ã¢â‚¬â€", "—"],
  ["Ã³", "ó"],
  ["Ã§", "ç"],
  ["Ã£", "ã"],
  ["Ã¡", "á"],
  ["Ã©", "é"],
  ["Ã­", "í"],
  ["Ãº", "ú"],
  ["Ãª", "ê"],
  ["Ã´", "ô"],
  ["Ã‰", "É"],
  ["Ã‡", "Ç"],
  ["Ã", "à"],
  ["â€¢", "•"],
  ["â€”", "—"],
];

const regexFixes = [
  [/\blogica\b/gi, (value) => (value[0] === "L" ? "Lógica" : "lógica")],
  [/\bmodulo\b/gi, (value) => (value[0] === "M" ? "Módulo" : "módulo")],
  [/\blicao\b/gi, (value) => (value[0] === "L" ? "Lição" : "lição")],
  [/\blicoes\b/gi, (value) => (value[0] === "L" ? "Lições" : "lições")],
  [/\bquestao\b/gi, (value) => (value[0] === "Q" ? "Questão" : "questão")],
  [/\bquestoes\b/gi, (value) => (value[0] === "Q" ? "Questões" : "questões")],
  [/\bprogramacao\b/gi, (value) => (value[0] === "P" ? "Programação" : "programação")],
  [/\bcodigo\b/gi, (value) => (value[0] === "C" ? "Código" : "código")],
  [/\bsaida\b/gi, (value) => (value[0] === "S" ? "Saída" : "saída")],
  [/\bnao\b/gi, (value) => (value[0] === "N" ? "Não" : "não")],
  [/\bvoce\b/gi, (value) => (value[0] === "V" ? "Você" : "você")],
  [/\bpratica\b/gi, (value) => (value[0] === "P" ? "Prática" : "prática")],
  [/\bproxima\b/gi, (value) => (value[0] === "P" ? "Próxima" : "próxima")],
  [/\bproprio\b/gi, (value) => (value[0] === "P" ? "Próprio" : "próprio")],
  [/\busuario\b/gi, (value) => (value[0] === "U" ? "Usuário" : "usuário")],
  [/\busuario\b/gi, (value) => (value[0] === "U" ? "Usuário" : "usuário")],
  [/\busuaria\b/gi, (value) => (value[0] === "U" ? "Usuária" : "usuária")],
  [/\bexperiencia\b/gi, (value) => (value[0] === "E" ? "Experiência" : "experiência")],
  [/\bvalidacao\b/gi, (value) => (value[0] === "V" ? "Validação" : "validação")],
  [/\btransicao\b/gi, (value) => (value[0] === "T" ? "Transição" : "transição")],
  [/\boperacao\b/gi, (value) => (value[0] === "O" ? "Operação" : "operação")],
  [/\bvisao\b/gi, (value) => (value[0] === "V" ? "Visão" : "visão")],
  [/\bnumero\b/gi, (value) => (value[0] === "N" ? "Número" : "número")],
  [/\btecnica\b/gi, (value) => (value[0] === "T" ? "Técnica" : "técnica")],
  [/\bdificil\b/gi, (value) => (value[0] === "D" ? "Difícil" : "difícil")],
  [/\bcritica\b/gi, (value) => (value[0] === "C" ? "Crítica" : "crítica")],
  [/\bmanutencao\b/gi, (value) => (value[0] === "M" ? "Manutenção" : "manutenção")],
  [/\bseguranca\b/gi, (value) => (value[0] === "S" ? "Segurança" : "segurança")],
  [/\bL\?gica\b/g, "Lógica"],
  [/\bl\?gica\b/g, "lógica"],
  [/\bm\?dulo\b/g, "módulo"],
  [/\bM\?dulo\b/g, "Módulo"],
  [/\bli\?\?o\b/g, "lição"],
  [/\bLi\?\?o\b/g, "Lição"],
  [/\bli\?\?es\b/g, "lições"],
  [/\bprograma\?\?o\b/g, "programação"],
  [/\bracioc\?nio\b/g, "raciocínio"],
  [/\bsa\?da\b/g, "saída"],
  [/\bSa\?da\b/g, "Saída"],
  [/\bc\?digo\b/g, "código"],
  [/\bC\?digo\b/g, "Código"],
  [/\bquest\?o\b/g, "questão"],
  [/\bquest\?es\b/g, "questões"],
  [/\bpr\?xima\b/g, "próxima"],
  [/\bpr\?ximo\b/g, "próximo"],
  [/\bN\?o\b/g, "Não"],
  [/\bn\?o\b/g, "não"],
  [/\bm\?nimo\b/g, "mínimo"],
  [/\bn\?mero\b/g, "número"],
  [/\bVis\?o\b/g, "Visão"],
  [/\bvis\?o\b/g, "visão"],
  [/\bUsu\?rio\b/g, "Usuário"],
  [/\busu\?rio\b/g, "usuário"],
  [/\busu\?ria\b/g, "usuária"],
  [/\ba\?\?o\b/g, "ação"],
  [/\ba\?\?es\b/g, "ações"],
  [/\bfun\?\?o\b/g, "função"],
  [/\bfun\?\?es\b/g, "funções"],
  [/\bcondi\?\?o\b/g, "condição"],
  [/\bcondi\?\?es\b/g, "condições"],
  [/\bcompara\?\?o\b/g, "comparação"],
  [/\bopera\?\?o\b/g, "operação"],
  [/\bopera\?\?es\b/g, "operações"],
  [/\bvalida\?\?o\b/g, "validação"],
  [/\bautentica\?\?o\b/g, "autenticação"],
  [/\bautoriza\?\?o\b/g, "autorização"],
  [/\btransi\?\?o\b/g, "transição"],
  [/\bitera\?\?o\b/g, "iteração"],
  [/\bexplica\?\?o\b/g, "explicação"],
  [/\binforma\?\?es\b/g, "informações"],
  [/\brea\?\?o\b/g, "reação"],
  [/\brea\?\?es\b/g, "reações"],
  [/\bconte\?do\b/g, "conteúdo"],
  [/\bconex\?o\b/g, "conexão"],
  [/\bhip\?tese\b/g, "hipótese"],
  [/\bhip\?teses\b/g, "hipóteses"],
  [/\bt\?cnica\b/g, "técnica"],
  [/\bdif\?cil\b/g, "difícil"],
  [/\bcr\?tica\b/g, "crítica"],
  [/\bnum\?rico\b/g, "numérico"],
  [/\bexecut\?veis\b/g, "executáveis"],
  [/\bexpress\?es\b/g, "expressões"],
];

function normalizeText(value) {
  let result = value;
  textReplacements.forEach(([from, to]) => {
    result = result.split(from).join(to);
  });
  regexFixes.forEach(([pattern, replacement]) => {
    result = result.replace(pattern, replacement);
  });
  return result;
}

function normalizeNode(node) {
  if (typeof node === "string") return normalizeText(node);
  if (Array.isArray(node)) return node.map(normalizeNode);
  if (node && typeof node === "object") {
    return Object.fromEntries(Object.entries(node).map(([key, value]) => [key, normalizeNode(value)]));
  }
  return node;
}

function flattenLessons(modules) {
  return modules.flatMap((module, moduleIndex) =>
    module.lessons.map((lesson, lessonIndex) => ({
      ...lesson,
      moduleId: module.id,
      moduleTitle: module.title,
      moduleLevel: module.level,
      moduleAccent: module.accent,
      moduleIndex,
      lessonIndex,
    })),
  );
}

function getStoredProgress() {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(mobileStorageKey);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function formatPercent(value) {
  return Number.isFinite(value) ? Math.round(value) : 0;
}

function isSameDay(dateValue, referenceDate) {
  if (!dateValue) return false;
  const date = new Date(dateValue);
  return (
    date.getFullYear() === referenceDate.getFullYear() &&
    date.getMonth() === referenceDate.getMonth() &&
    date.getDate() === referenceDate.getDate()
  );
}

function getCurrentMilestone(completedCount) {
  return (
    [...codingMilestones]
      .reverse()
      .find((milestone) => completedCount >= milestone.lessons) ?? codingMilestones[0]
  );
}

function getNextMilestone(completedCount) {
  return codingMilestones.find((milestone) => completedCount < milestone.lessons) ?? null;
}

function getCodingChecklist(lesson) {
  return [
    `Reproduza o exemplo: ${lesson.example.label}.`,
    "Altere pelo menos dois valores e rode novamente.",
    `Resolva: ${lesson.drill.prompt}`,
    "Teste um caso normal, um caso vazio e um caso limite.",
  ];
}

export default function MimoMobileExperience() {
  const modules = useMemo(() => normalizeNode(courseModules), []);
  const lessons = useMemo(() => flattenLessons(modules), [modules]);
  const [progress, setProgress] = useState(() => getStoredProgress());
  const [activeTab, setActiveTab] = useState("learn");
  const [activeLessonId, setActiveLessonId] = useState(() => {
    const saved = getStoredProgress();
    return lessons.find((lesson) => !saved[lesson.id]?.completed)?.id ?? lessons[0]?.id;
  });
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    window.localStorage.setItem(mobileStorageKey, JSON.stringify(progress));
  }, [progress]);

  const activeLessonIndex = lessons.findIndex((lesson) => lesson.id === activeLessonId);
  const activeLesson = lessons[activeLessonIndex] ?? lessons[0];
  const activeModule = modules.find((module) => module.id === activeLesson.moduleId) ?? modules[0];
  const lessonProgress = progress[activeLesson.id] ?? {};
  const completedLessons = lessons.filter((lesson) => progress[lesson.id]?.completed);
  const completedCount = completedLessons.length;
  const totalXp = lessons.reduce((sum, lesson) => sum + (progress[lesson.id]?.xpEarned ?? 0), 0);
  const overallProgress = formatPercent((completedCount / Math.max(lessons.length, 1)) * 100);
  const answeredCount = Object.keys(selectedAnswers).length;
  const moduleDone = activeModule.lessons.filter((lesson) => progress[lesson.id]?.completed).length;
  const moduleProgress = formatPercent((moduleDone / Math.max(activeModule.lessons.length, 1)) * 100);
  const today = new Date();
  const completedToday = completedLessons.filter((lesson) => isSameDay(progress[lesson.id]?.completedAt, today)).length;
  const nextLesson = lessons[activeLessonIndex + 1] ?? null;
  const firstPendingLesson = lessons.find((lesson) => !progress[lesson.id]?.completed) ?? activeLesson;
  const recommendedLessons = lessons
    .slice(Math.max(activeLessonIndex, 0), Math.max(activeLessonIndex, 0) + 4)
    .filter(Boolean);
  const currentMilestone = getCurrentMilestone(completedCount);
  const nextMilestone = getNextMilestone(completedCount);
  const codingChecklist = getCodingChecklist(activeLesson);
  const capstoneLesson = lessons.find((lesson) => lesson.id === "projeto-final") ?? lessons[lessons.length - 1];

  function isLessonUnlocked(lessonId) {
    const lessonIndex = lessons.findIndex((lesson) => lesson.id === lessonId);
    if (lessonIndex <= 0) return true;
    const previous = lessons[lessonIndex - 1];
    return Boolean(progress[previous.id]?.completed);
  }

  function openLesson(lessonId, nextTab = "lesson") {
    if (!isLessonUnlocked(lessonId)) return;
    setActiveLessonId(lessonId);
    setSelectedAnswers({});
    setFeedback(null);
    setActiveTab(nextTab);
  }

  function selectAnswer(questionId, optionIndex) {
    setSelectedAnswers((current) => ({
      ...current,
      [questionId]: optionIndex,
    }));
  }

  function submitLesson() {
    const unanswered = activeLesson.quiz.filter((question) => selectedAnswers[question.id] === undefined);
    if (unanswered.length > 0) {
      setFeedback({
        status: "warning",
        title: "Faltam respostas",
        body: `Complete mais ${unanswered.length} questão(ões) para corrigir esta lição.`,
      });
      return;
    }

    const correctAnswers = activeLesson.quiz.filter(
      (question) => selectedAnswers[question.id] === question.answer,
    ).length;
    const score = Math.round((correctAnswers / activeLesson.quiz.length) * 100);
    const passed = score >= 70;
    const xpEarned = Math.round((score / 100) * activeLesson.xp);

    setProgress((current) => {
      const previous = current[activeLesson.id] ?? {};
      return {
        ...current,
        [activeLesson.id]: {
          ...previous,
          attempts: (previous.attempts ?? 0) + 1,
          bestScore: Math.max(previous.bestScore ?? 0, score),
          completed: previous.completed || passed,
          completedAt: passed ? new Date().toISOString() : previous.completedAt,
          xpEarned: Math.max(previous.xpEarned ?? 0, xpEarned),
        },
      };
    });

    setFeedback({
      status: passed ? "success" : "retry",
      title: passed ? "Lição concluída" : "Revise e tente de novo",
      body: passed
        ? `Você fez ${score}% e ganhou ${xpEarned} XP.`
        : `Sua nota foi ${score}%. A meta mínima é 70%.`,
    });
  }

  function renderTopbar() {
    return (
      <header className="mimo-topbar">
        <button type="button" className="mimo-avatar-button" onClick={() => setActiveTab("profile")}>
          LQ
        </button>
        <div>
          <span>Bom estudo, Wess</span>
          <h1>Logic Quest</h1>
        </div>
        <div className="mimo-top-stats" aria-label="Resumo">
          <strong>{completedToday}</strong>
          <span>dias</span>
        </div>
      </header>
    );
  }

  function renderLearn() {
    return (
      <div className="mimo-screen">
        <section className="mimo-continue-card">
          <div className="mimo-card-copy">
            <span>Continue de onde parou</span>
            <h2>{firstPendingLesson.title}</h2>
            <p>{firstPendingLesson.objective}</p>
            <button type="button" onClick={() => openLesson(firstPendingLesson.id, "lesson")}>
              Continuar lição
            </button>
          </div>
          <div className="mimo-mascot-tile" aria-hidden="true">
            <span>{overallProgress}%</span>
          </div>
        </section>

        <section className="mimo-stat-grid" aria-label="Progresso">
          <article>
            <strong>{completedCount}</strong>
            <span>concluídas</span>
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

        <section className="mimo-builder-card">
          <div className="mimo-block-title compact">
            <div>
              <span>Objetivo real</span>
              <h2>Sair programando</h2>
            </div>
            <strong>{overallProgress}%</strong>
          </div>

          <article className="mimo-milestone-current">
            <span>Você já consegue</span>
            <strong>{currentMilestone.label}</strong>
            <p>{currentMilestone.description}</p>
          </article>

          {nextMilestone ? (
            <div className="mimo-next-target">
              <span>Próximo marco</span>
              <strong>{nextMilestone.label}</strong>
              <small>
                Faltam {Math.max(nextMilestone.lessons - completedCount, 0)} lições para liberar esta habilidade.
              </small>
            </div>
          ) : (
            <div className="mimo-next-target ready">
              <span>Pronto para projeto</span>
              <strong>{capstoneLesson.title}</strong>
              <small>Agora é hora de abrir o editor e entregar um mini app completo.</small>
            </div>
          )}

          <div className="mimo-project-pills">
            {capstoneProjects.slice(0, 3).map((project) => (
              <button key={project} type="button" onClick={() => openLesson(capstoneLesson.id, "practice")}>
                {project}
              </button>
            ))}
          </div>
        </section>

        <section className="mimo-block">
          <div className="mimo-block-title">
            <div>
              <span>Curso atual</span>
              <h2>{activeModule.title}</h2>
            </div>
            <button type="button" onClick={() => setActiveTab("path")}>
              Ver trilha
            </button>
          </div>

          <article className="mimo-course-card">
            <div className={`mimo-course-badge accent-${activeModule.accent}`}>{activeModule.level}</div>
            <div>
              <h3>{activeModule.outcome}</h3>
              <p>{activeModule.summary}</p>
              <div className="mimo-progress-track">
                <span style={{ width: `${moduleProgress}%` }} />
              </div>
            </div>
          </article>
        </section>

        <section className="mimo-block">
          <div className="mimo-block-title">
            <div>
              <span>Agora</span>
              <h2>Lições curtas</h2>
            </div>
          </div>
          <div className="mimo-lesson-rail">
            {recommendedLessons.map((lesson) => (
              <button key={lesson.id} type="button" onClick={() => openLesson(lesson.id, "lesson")}>
                <span>{lesson.lessonIndex + 1}</span>
                <strong>{lesson.title}</strong>
                <small>{lesson.time} • {lesson.xp} XP</small>
              </button>
            ))}
          </div>
        </section>
      </div>
    );
  }

  function renderPath() {
    return (
      <div className="mimo-screen">
        <section className="mimo-path-header">
          <span>Trilha completa</span>
          <h2>Do zero ao profissional</h2>
          <p>{overallProgress}% concluído mantendo o mesmo conteúdo do curso principal.</p>
        </section>

        <div className="mimo-path-stack">
          {modules.map((module) => (
            <section key={module.id} className="mimo-path-module">
              <div className="mimo-module-heading">
                <span>{module.level}</span>
                <h3>{module.title}</h3>
              </div>

              <div className="mimo-path-list">
                {module.lessons.map((lesson, index) => {
                  const globalLesson = lessons.find((item) => item.id === lesson.id);
                  const locked = !isLessonUnlocked(lesson.id);
                  const done = progress[lesson.id]?.completed;
                  const active = lesson.id === activeLesson.id;

                  return (
                    <button
                      key={lesson.id}
                      type="button"
                      className={[
                        "mimo-path-node",
                        active ? "active" : "",
                        done ? "done" : "",
                        locked ? "locked" : "",
                      ].join(" ")}
                      onClick={() => openLesson(lesson.id, "lesson")}
                    >
                      <span className="mimo-node-number">{locked ? "lock" : globalLesson?.lessonIndex + 1 || index + 1}</span>
                      <span className="mimo-node-copy">
                        <strong>{lesson.title}</strong>
                        <small>{locked ? "Bloqueada" : `${lesson.time} • ${lesson.difficulty}`}</small>
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    );
  }

  function renderLesson() {
    return (
      <div className="mimo-screen">
        <section className="mimo-lesson-hero">
          <span>{activeModule.title}</span>
          <h2>{activeLesson.title}</h2>
          <p>{activeLesson.objective}</p>
          <div className="mimo-lesson-meta">
            <span>{activeLesson.time}</span>
            <span>{activeLesson.xp} XP</span>
            <span>{lessonProgress.bestScore ?? 0}% melhor nota</span>
          </div>
        </section>

        <section className="mimo-content-card">
          <div className="mimo-block-title compact">
            <div>
              <span>Leitura guiada</span>
              <h2>Entenda a ideia</h2>
            </div>
          </div>
          {activeLesson.reading.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <div className="mimo-chip-row">
            {activeLesson.concepts.map((concept) => (
              <span key={concept}>{concept}</span>
            ))}
          </div>
        </section>

        <section className="mimo-step-carousel" aria-label="Etapas da lição">
          {activeLesson.steps.map((step, index) => (
            <article key={step.title}>
              <span>Etapa {index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </section>

        <section className="mimo-build-card">
          <div className="mimo-block-title compact">
            <div>
              <span>Agora codifique</span>
              <h2>Transforme a ideia em JavaScript</h2>
            </div>
          </div>
          <p>{activeLesson.drill.prompt}</p>
          <div className="mimo-code-checklist">
            {codingChecklist.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <button type="button" className="mimo-secondary-action" onClick={() => setActiveTab("practice")}>
            Abrir prática guiada
          </button>
        </section>

        <section className="mimo-code-card">
          <div>
            <span>{activeLesson.example.label}</span>
            <strong>Exemplo central</strong>
          </div>
          <pre>{activeLesson.example.code}</pre>
        </section>

        <section className="mimo-quiz-card">
          <div className="mimo-block-title compact">
            <div>
              <span>Checkpoint</span>
              <h2>Meta mínima: 70%</h2>
            </div>
            <strong>{answeredCount}/{activeLesson.quiz.length}</strong>
          </div>

          {activeLesson.quiz.map((question, questionIndex) => {
            const selected = selectedAnswers[question.id];
            const showResult = feedback?.status === "success" || feedback?.status === "retry";

            return (
              <article key={question.id} className="mimo-question">
                <span>Questão {questionIndex + 1}</span>
                <h3>{question.question}</h3>
                <div className="mimo-option-list">
                  {question.options.map((option, optionIndex) => {
                    const selectedOption = selected === optionIndex;
                    const correctOption = showResult && optionIndex === question.answer;
                    const wrongOption = showResult && selectedOption && optionIndex !== question.answer;

                    return (
                      <button
                        key={option}
                        type="button"
                        className={[
                          selectedOption ? "selected" : "",
                          correctOption ? "correct" : "",
                          wrongOption ? "wrong" : "",
                        ].join(" ")}
                        onClick={() => selectAnswer(question.id, optionIndex)}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
                {showResult ? <p className="mimo-explanation">{question.explanation}</p> : null}
              </article>
            );
          })}

          {feedback ? (
            <div className={`mimo-feedback ${feedback.status}`}>
              <strong>{feedback.title}</strong>
              <span>{feedback.body}</span>
            </div>
          ) : null}

          <div className="mimo-action-row">
            <button type="button" className="mimo-primary-action" onClick={submitLesson}>
              Corrigir lição
            </button>
            {feedback?.status === "success" && nextLesson ? (
              <button type="button" className="mimo-secondary-action" onClick={() => openLesson(nextLesson.id, "lesson")}>
                Próxima
              </button>
            ) : null}
          </div>
        </section>
      </div>
    );
  }

  function renderPractice() {
    return (
      <div className="mimo-screen">
        <section className="mimo-practice-hero">
          <span>Prática rápida</span>
          <h2>{activeLesson.drill.title}</h2>
          <p>{activeLesson.drill.prompt}</p>
        </section>

        <section className="mimo-practice-plan">
          <div className="mimo-block-title compact">
            <div>
              <span>Plano de execução</span>
              <h2>Escreva, rode, ajuste</h2>
            </div>
          </div>
          <div className="mimo-practice-steps">
            <article>
              <strong>1</strong>
              <span>Copie o exemplo e rode no console.</span>
            </article>
            <article>
              <strong>2</strong>
              <span>Altere dados e crie uma variação própria.</span>
            </article>
            <article>
              <strong>3</strong>
              <span>Teste erro, vazio e limite antes de avançar.</span>
            </article>
          </div>
        </section>

        <section className="mimo-code-card practice">
          <div>
            <span>Desafio</span>
            <strong>Raciocínio antes da sintaxe</strong>
          </div>
          <pre>{activeLesson.example.code}</pre>
        </section>

        <section className="mimo-content-card">
          <div className="mimo-block-title compact">
            <div>
              <span>Resposta esperada</span>
              <h2>Critério de qualidade</h2>
            </div>
          </div>
          <p>{activeLesson.drill.expected}</p>
          <div className="mimo-warning-list">
            {activeLesson.drill.pitfalls.map((pitfall) => (
              <span key={pitfall}>{pitfall}</span>
            ))}
          </div>
          <div className="mimo-capstone-strip">
            <span>Projetos para provar domínio</span>
            {capstoneProjects.map((project) => (
              <button key={project} type="button" onClick={() => openLesson(capstoneLesson.id, "lesson")}>
                {project}
              </button>
            ))}
          </div>
          <button type="button" className="mimo-primary-action" onClick={() => setActiveTab("lesson")}>
            Ir para checkpoint
          </button>
        </section>
      </div>
    );
  }

  function renderProfile() {
    return (
      <div className="mimo-screen">
        <section className="mimo-profile-panel">
          <div className="mimo-profile-avatar">WY</div>
          <h2>WessYu</h2>
          <p>Trilha de lógica com progresso salvo neste dispositivo.</p>
          <div className="mimo-profile-grid">
            <article>
              <strong>{overallProgress}%</strong>
              <span>trilha</span>
            </article>
            <article>
              <strong>{totalXp}</strong>
              <span>XP total</span>
            </article>
            <article>
              <strong>{completedCount}</strong>
              <span>lições</span>
            </article>
            <article>
              <strong>{completedToday}</strong>
              <span>hoje</span>
            </article>
          </div>
          <div className="mimo-skill-map">
            {codingMilestones.map((milestone) => {
              const unlocked = completedCount >= milestone.lessons;
              return (
                <article key={milestone.label} className={unlocked ? "unlocked" : ""}>
                  <strong>{milestone.label}</strong>
                  <span>{unlocked ? "Liberado" : `${milestone.lessons} lições`}</span>
                  <p>{milestone.description}</p>
                </article>
              );
            })}
          </div>
          <button
            type="button"
            className="mimo-secondary-action"
            onClick={() => {
              setProgress({});
              setSelectedAnswers({});
              setFeedback(null);
              setActiveLessonId(lessons[0]?.id);
              setActiveTab("learn");
            }}
          >
            Reiniciar progresso
          </button>
        </section>
      </div>
    );
  }

  return (
    <main className="mimo-mobile-root">
      {renderTopbar()}
      {activeTab === "learn" ? renderLearn() : null}
      {activeTab === "path" ? renderPath() : null}
      {activeTab === "lesson" ? renderLesson() : null}
      {activeTab === "practice" ? renderPractice() : null}
      {activeTab === "profile" ? renderProfile() : null}

      <nav className="mimo-tabbar" aria-label="Navegação mobile">
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
