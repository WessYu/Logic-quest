import { startTransition, useEffect, useMemo, useRef, useState } from "react";
import { courseModules } from "./courseData";

const storageKey = "logic-quest-progress-v4";

const ui = {
  workspace: "logic-quest.workspace",
  title:
    "Aprenda l\u00f3gica em uma interface que parece um editor e funciona como uma plataforma de estudo real.",
  subtitle:
    "Explorer de m\u00f3dulos, editor com abas, checklist de estudo, painel de problemas e checkpoint clic\u00e1vel. Agora a experi\u00eancia n\u00e3o \u00e9 s\u00f3 visual.",
  explorer: "EXPLORER",
  workspaceLabel: "WORKSPACE",
  openEditors: "OPEN EDITORS",
  modules: "MODULES",
  outline: "OUTLINE",
  progress: "PROGRESS",
  problems: "PROBLEMS",
  search: "SEARCH",
  sourceControl: "SOURCE CONTROL",
  run: "RUN AND DEBUG",
  searchPlaceholder: "Buscar li\u00e7\u00f5es, m\u00f3dulos ou conceitos...",
  checkpointTitle: "Checkpoint final",
  checkpointSubtitle: "Responda para liberar a pr\u00f3xima etapa da trilha.",
  fixLesson: "Corrigir li\u00e7\u00e3o",
  nextLesson: "Avan\u00e7ar para a pr\u00f3xima",
  prevLesson: "Voltar uma li\u00e7\u00e3o",
  markReading: "Marcar leitura como conclu\u00edda",
  markPractice: "Marcar pr\u00e1tica como conclu\u00edda",
  answerPrompt: "Escolha uma op\u00e7\u00e3o",
  correct: "Correta",
  review: "Revise",
  done: "Conclu\u00eddo",
  pending: "Pendente",
  statusEncoding: "UTF-8",
  statusMode: "Study",
  statusBranch: "main",
};

const normalizeRules = [
  [/Ã³/g, "\u00f3"],
  [/Ã§/g, "\u00e7"],
  [/Ã£/g, "\u00e3"],
  [/Ã¡/g, "\u00e1"],
  [/Ã©/g, "\u00e9"],
  [/Ã­/g, "\u00ed"],
  [/Ãº/g, "\u00fa"],
  [/Ãª/g, "\u00ea"],
  [/Ã´/g, "\u00f4"],
  [/Ã‰/g, "\u00c9"],
  [/Ã‡/g, "\u00c7"],
  [/Ã/g, "\u00e0"],
  [/â€¢/g, "\u2022"],
  [/â€”/g, "\u2014"],
];

function normalizeText(value) {
  let result = value;
  for (const [pattern, replacement] of normalizeRules) {
    result = result.replace(pattern, replacement);
  }

  const plainReplacements = [
    [/\blogica\b/g, "l\u00f3gica"],
    [/\bLogica\b/g, "L\u00f3gica"],
    [/\bmodulo\b/g, "m\u00f3dulo"],
    [/\bModulo\b/g, "M\u00f3dulo"],
    [/\blicao\b/g, "li\u00e7\u00e3o"],
    [/\bLicao\b/g, "Li\u00e7\u00e3o"],
    [/\blicoes\b/g, "li\u00e7\u00f5es"],
    [/\bLicoes\b/g, "Li\u00e7\u00f5es"],
    [/\bquestao\b/g, "quest\u00e3o"],
    [/\bQuestao\b/g, "Quest\u00e3o"],
    [/\bquestoes\b/g, "quest\u00f5es"],
    [/\bQuestoes\b/g, "Quest\u00f5es"],
    [/\bprogramacao\b/g, "programa\u00e7\u00e3o"],
    [/\bProgramacao\b/g, "Programa\u00e7\u00e3o"],
    [/\bcodigo\b/g, "c\u00f3digo"],
    [/\bCodigo\b/g, "C\u00f3digo"],
    [/\bsaida\b/g, "sa\u00edda"],
    [/\bSaida\b/g, "Sa\u00edda"],
    [/\bproxima\b/g, "pr\u00f3xima"],
    [/\bProxima\b/g, "Pr\u00f3xima"],
    [/\bproximo\b/g, "pr\u00f3ximo"],
    [/\bProximo\b/g, "Pr\u00f3ximo"],
    [/\bnao\b/g, "n\u00e3o"],
    [/\bNao\b/g, "N\u00e3o"],
    [/\bvoce\b/g, "voc\u00ea"],
    [/\bVoce\b/g, "Voc\u00ea"],
    [/\bja\b/g, "j\u00e1"],
    [/\bJa\b/g, "J\u00e1"],
    [/\bate\b/g, "at\u00e9"],
    [/\bAte\b/g, "At\u00e9"],
    [/\btambem\b/g, "tamb\u00e9m"],
    [/\bTambem\b/g, "Tamb\u00e9m"],
    [/\bpratica\b/g, "pr\u00e1tica"],
    [/\bPratica\b/g, "Pr\u00e1tica"],
    [/\bminimo\b/g, "m\u00ednimo"],
    [/\bMinimo\b/g, "M\u00ednimo"],
    [/\busuario\b/g, "usu\u00e1rio"],
    [/\bUsuario\b/g, "Usu\u00e1rio"],
    [/\busuarios\b/g, "usu\u00e1rios"],
    [/\bUsuarios\b/g, "Usu\u00e1rios"],
    [/\bexperiencia\b/g, "experi\u00eancia"],
    [/\bExperiencia\b/g, "Experi\u00eancia"],
    [/\braciocinio\b/g, "racioc\u00ednio"],
    [/\bRaciocinio\b/g, "Racioc\u00ednio"],
    [/\bacao\b/g, "a\u00e7\u00e3o"],
    [/\bAcao\b/g, "A\u00e7\u00e3o"],
    [/\bacoes\b/g, "a\u00e7\u00f5es"],
    [/\bAcoes\b/g, "A\u00e7\u00f5es"],
    [/\bvalidacao\b/g, "valida\u00e7\u00e3o"],
    [/\bValidacao\b/g, "Valida\u00e7\u00e3o"],
    [/\bautorizacao\b/g, "autoriza\u00e7\u00e3o"],
    [/\bAutorizacao\b/g, "Autoriza\u00e7\u00e3o"],
    [/\bautenticacao\b/g, "autentica\u00e7\u00e3o"],
    [/\bAutenticacao\b/g, "Autentica\u00e7\u00e3o"],
    [/\bfuncao\b/g, "fun\u00e7\u00e3o"],
    [/\bFuncao\b/g, "Fun\u00e7\u00e3o"],
    [/\bfuncoes\b/g, "fun\u00e7\u00f5es"],
    [/\bFuncoes\b/g, "Fun\u00e7\u00f5es"],
    [/\bcomparacao\b/g, "compara\u00e7\u00e3o"],
    [/\bComparacao\b/g, "Compara\u00e7\u00e3o"],
    [/\bcomparacoes\b/g, "compara\u00e7\u00f5es"],
    [/\bComparacoes\b/g, "Compara\u00e7\u00f5es"],
    [/\btransicao\b/g, "transi\u00e7\u00e3o"],
    [/\bTransicao\b/g, "Transi\u00e7\u00e3o"],
    [/\boperacao\b/g, "opera\u00e7\u00e3o"],
    [/\boperacoes\b/g, "opera\u00e7\u00f5es"],
    [/\bvisao\b/g, "vis\u00e3o"],
    [/\bVisao\b/g, "Vis\u00e3o"],
    [/\bL\?gica\b/g, "L\u00f3gica"],
    [/\bl\?gica\b/g, "l\u00f3gica"],
    [/\bm\?dulo\b/g, "m\u00f3dulo"],
    [/\bli\?\?o\b/g, "li\u00e7\u00e3o"],
    [/\bprograma\?\?o\b/g, "programa\u00e7\u00e3o"],
    [/\bracioc\?nio\b/g, "racioc\u00ednio"],
    [/\bsa\?da\b/g, "sa\u00edda"],
    [/\bSa\?da\b/g, "Sa\u00edda"],
    [/\bc\?digo\b/g, "c\u00f3digo"],
    [/\bC\?digo\b/g, "C\u00f3digo"],
    [/\bquest\?es\b/g, "quest\u00f5es"],
    [/\bpr\?xima\b/g, "pr\u00f3xima"],
    [/\bpr\?ximo\b/g, "pr\u00f3ximo"],
    [/\bN\?o\b/g, "N\u00e3o"],
    [/\bn\?o\b/g, "n\u00e3o"],
    [/\bm\?nimo\b/g, "m\u00ednimo"],
    [/\bn\?mero\b/g, "n\u00famero"],
    [/\bVis\?o\b/g, "Vis\u00e3o"],
    [/\bvis\?o\b/g, "vis\u00e3o"],
    [/\bUsu\?rio\b/g, "Usu\u00e1rio"],
    [/\busu\?rio\b/g, "usu\u00e1rio"],
    [/\busu\?rios\b/g, "usu\u00e1rios"],
    [/\ba\?\?o\b/g, "a\u00e7\u00e3o"],
    [/\ba\?\?es\b/g, "a\u00e7\u00f5es"],
    [/\bfun\?\?o\b/g, "fun\u00e7\u00e3o"],
    [/\bfun\?\?es\b/g, "fun\u00e7\u00f5es"],
    [/\bcondi\?\?o\b/g, "condi\u00e7\u00e3o"],
    [/\bcondi\?\?es\b/g, "condi\u00e7\u00f5es"],
    [/\bcompara\?\?o\b/g, "compara\u00e7\u00e3o"],
    [/\bopera\?\?o\b/g, "opera\u00e7\u00e3o"],
    [/\bopera\?\?es\b/g, "opera\u00e7\u00f5es"],
    [/\bvalida\?\?o\b/g, "valida\u00e7\u00e3o"],
    [/\bautentica\?\?o\b/g, "autentica\u00e7\u00e3o"],
    [/\bautoriza\?\?o\b/g, "autoriza\u00e7\u00e3o"],
    [/\btransi\?\?o\b/g, "transi\u00e7\u00e3o"],
    [/\bitera\?\?o\b/g, "itera\u00e7\u00e3o"],
    [/\bexplica\?\?o\b/g, "explica\u00e7\u00e3o"],
    [/\binforma\?\?es\b/g, "informa\u00e7\u00f5es"],
    [/\brea\?\?o\b/g, "rea\u00e7\u00e3o"],
    [/\brea\?\?es\b/g, "rea\u00e7\u00f5es"],
    [/\breprodu\?\?o\b/g, "reprodu\u00e7\u00e3o"],
    [/\bObserva\?\?o\b/g, "Observa\u00e7\u00e3o"],
    [/\bconte\?do\b/g, "conte\u00fado"],
    [/\bconex\?o\b/g, "conex\u00e3o"],
    [/\bhip\?tese\b/g, "hip\u00f3tese"],
    [/\bhip\?teses\b/g, "hip\u00f3teses"],
    [/\bt\?cnica\b/g, "t\u00e9cnica"],
    [/\bdif\?cil\b/g, "dif\u00edcil"],
    [/\bcr\?tica\b/g, "cr\u00edtica"],
    [/\bnum\?rico\b/g, "num\u00e9rico"],
    [/\bexecut\?veis\b/g, "execut\u00e1veis"],
    [/\bexpress\?es\b/g, "express\u00f5es"],
  ];

  for (const [pattern, replacement] of plainReplacements) {
    result = result.replace(pattern, replacement);
  }

  return result;
}
function normalizeNode(node) {
  if (typeof node === "string") {
    return normalizeText(node);
  }

  if (Array.isArray(node)) {
    return node.map((item) => normalizeNode(item));
  }

  if (node && typeof node === "object") {
    return Object.fromEntries(
      Object.entries(node).map(([key, value]) => [key, normalizeNode(value)]),
    );
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
      moduleSummary: module.summary,
      moduleOutcome: module.outcome,
      accent: module.accent,
      moduleIndex,
      lessonIndex,
    })),
  );
}

function getStoredProgress() {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function getRank(totalXp) {
  if (totalXp >= 1800) return "Arquiteto de Sistemas";
  if (totalXp >= 1400) return "Engenheiro de Produto";
  if (totalXp >= 1000) return "Construtor de Fluxos";
  if (totalXp >= 600) return "Analista de L\u00f3gica";
  if (totalXp >= 250) return "Aprendiz de Algoritmos";
  return "Explorador Iniciante";
}

function getAccentLabel(accent) {
  const map = {
    sunrise: "Funda\u00e7\u00e3o",
    ocean: "Dados",
    forest: "Decis\u00e3o",
    ember: "Automa\u00e7\u00e3o",
    violet: "Algoritmos",
    cobalt: "JavaScript",
    coral: "Pro",
  };

  return map[accent] ?? "M\u00f3dulo";
}

function formatPercent(value) {
  return Number.isFinite(value) ? Math.round(value) : 0;
}

function formatDateTime(value) {
  if (!value) {
    return "Ainda sem conclusão";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function groupLessonsByModule(modules, query) {
  if (!query.trim()) {
    return modules;
  }

  const normalizedQuery = query.toLowerCase();

  return modules
    .map((module) => {
      const lessons = module.lessons.filter((lesson) => {
        const haystacks = [
          lesson.title,
          lesson.objective,
          lesson.moduleOutcome,
          ...(lesson.concepts ?? []),
        ];

        return haystacks.some((value) => value.toLowerCase().includes(normalizedQuery));
      });

      return lessons.length > 0 ? { ...module, lessons } : null;
    })
    .filter(Boolean);
}

function getLessonProblems(lesson, lessonState, selectedAnswers, submission) {
  const problems = [];

  if (!lessonState.readingDone) {
    problems.push({
      id: "reading",
      label: "Leitura ainda n\u00e3o foi marcada como conclu\u00edda.",
      action: "reading",
    });
  }

  const uncheckedSteps = lesson.steps.filter((_, index) => !lessonState.steps?.[index]);
  if (uncheckedSteps.length > 0) {
    problems.push({
      id: "steps",
      label: `${uncheckedSteps.length} etapa(s) da li\u00e7\u00e3o ainda n\u00e3o foram conclu\u00eddas.`,
      action: "steps",
    });
  }

  if (!lessonState.practiceDone) {
    problems.push({
      id: "practice",
      label: "A pr\u00e1tica guiada ainda n\u00e3o foi marcada como conclu\u00edda.",
      action: "practice",
    });
  }

  const unanswered = lesson.quiz.filter((question) => selectedAnswers[question.id] === undefined);
  if (unanswered.length > 0) {
    problems.push({
      id: "quiz-unanswered",
      label: `${unanswered.length} quest\u00e3o(\u00f5es) do checkpoint ainda est\u00e3o sem resposta.`,
      action: "checkpoint",
    });
  }

  if (submission?.status === "failed") {
    problems.push({
      id: "quiz-score",
      label: `A nota atual est\u00e1 abaixo de 70%. Revise as explica\u00e7\u00f5es antes de tentar novamente.`,
      action: "checkpoint",
    });
  }

  return problems;
}

function getStoredEditorHistory() {
  return ["README.md", "progress.json", "checkpoint.quiz"];
}

export default function App() {
  const normalizedModules = useMemo(() => normalizeNode(courseModules), []);
  const lessons = useMemo(() => flattenLessons(normalizedModules), [normalizedModules]);
  const [progress, setProgress] = useState(() => getStoredProgress());
  const [activeLessonId, setActiveLessonId] = useState(() => {
    const saved = getStoredProgress();
    const firstIncomplete = lessons.find((lesson) => !saved[lesson.id]?.completed);
    return firstIncomplete?.id ?? lessons[0]?.id;
  });
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submission, setSubmission] = useState(null);
  const [celebrationSeed, setCelebrationSeed] = useState(0);
  const [activeSidebar, setActiveSidebar] = useState("explorer");
  const [activeTab, setActiveTab] = useState("overview");
  const [inspectorView, setInspectorView] = useState("outline");
  const [searchTerm, setSearchTerm] = useState("");
  const [collapsedModules, setCollapsedModules] = useState({});
  const searchInputRef = useRef(null);
  const [sectionOpen, setSectionOpen] = useState({
    openEditors: true,
    modules: true,
  });

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    if (!celebrationSeed) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setCelebrationSeed(0);
    }, 1800);

    return () => window.clearTimeout(timeoutId);
  }, [celebrationSeed]);

  const activeLessonIndex = lessons.findIndex((lesson) => lesson.id === activeLessonId);
  const activeLesson = lessons[activeLessonIndex] ?? lessons[0];
  const currentModule =
    normalizedModules.find((module) => module.id === activeLesson.moduleId) ?? normalizedModules[0];
  const nextLesson = lessons[activeLessonIndex + 1] ?? null;
  const previousLesson = lessons[activeLessonIndex - 1] ?? null;
  const completedCount = lessons.filter((lesson) => progress[lesson.id]?.completed).length;
  const totalPossibleXp = lessons.reduce((sum, lesson) => sum + lesson.xp, 0);
  const totalXp = lessons.reduce((sum, lesson) => sum + (progress[lesson.id]?.xpEarned ?? 0), 0);
  const answeredLessons = lessons.filter((lesson) => progress[lesson.id]?.bestScore !== undefined).length;
  const overallProgress = formatPercent((completedCount / lessons.length) * 100);
  const mastery = formatPercent(
    lessons.reduce((sum, lesson) => sum + (progress[lesson.id]?.bestScore ?? 0), 0) /
      (lessons.length || 1),
  );
  const moduleCompletionCount = currentModule.lessons.filter(
    (lesson) => progress[lesson.id]?.completed,
  ).length;
  const moduleCompletionRate = formatPercent(
    (moduleCompletionCount / currentModule.lessons.length) * 100,
  );
  const answeredCount = Object.keys(selectedAnswers).length;
  const answerProgress = formatPercent((answeredCount / activeLesson.quiz.length) * 100);
  const completedModules = normalizedModules.filter((module) =>
    module.lessons.every((lesson) => progress[lesson.id]?.completed),
  ).length;
  const remainingLessons = Math.max(lessons.length - completedCount, 0);
  const completionEntries = lessons
    .filter((lesson) => progress[lesson.id]?.completedAt)
    .map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      completedAt: progress[lesson.id]?.completedAt,
    }))
    .sort((left, right) => new Date(right.completedAt).getTime() - new Date(left.completedAt).getTime());
  const lastCompletedEntry = completionEntries[0] ?? null;
  const completedToday = completionEntries.filter((entry) => {
    const completedAt = new Date(entry.completedAt);
    const today = new Date();

    return (
      completedAt.getFullYear() === today.getFullYear() &&
      completedAt.getMonth() === today.getMonth() &&
      completedAt.getDate() === today.getDate()
    );
  }).length;
  const nextLockedLesson = lessons.find((lesson) => !isLessonUnlocked(lesson.id, lessons, progress));
  const lessonState = progress[activeLesson.id] ?? {
    readingDone: false,
    practiceDone: false,
    steps: {},
  };
  const lessonProblems = getLessonProblems(activeLesson, lessonState, selectedAnswers, submission);
  const filteredModules = groupLessonsByModule(normalizedModules, searchTerm);
  const openEditors = [
    `${activeLesson.title}.md`,
    `${currentModule.title}.module`,
    ...getStoredEditorHistory(),
  ].filter((value, index, array) => array.indexOf(value) === index);

  function isLessonUnlocked(lessonId, sourceLessons = lessons, sourceProgress = progress) {
    const lessonIndex = sourceLessons.findIndex((lesson) => lesson.id === lessonId);

    if (lessonIndex <= 0) {
      return true;
    }

    const previous = sourceLessons[lessonIndex - 1];
    return Boolean(sourceProgress[previous.id]?.completed);
  }

  function updateLessonState(updater) {
    setProgress((current) => {
      const previous = current[activeLesson.id] ?? {};
      const nextPatch = typeof updater === "function" ? updater(previous) : updater;

      return {
        ...current,
        [activeLesson.id]: {
          ...previous,
          ...nextPatch,
        },
      };
    });
  }

  function toggleStep(index) {
    updateLessonState((previous) => ({
      steps: {
        ...(previous.steps ?? {}),
        [index]: !previous.steps?.[index],
      },
    }));
  }

  function markReadingDone() {
    updateLessonState((previous) => ({
      readingDone: !previous.readingDone,
    }));
  }

  function markPracticeDone() {
    updateLessonState((previous) => ({
      practiceDone: !previous.practiceDone,
    }));
  }

  function selectAnswer(questionId, optionIndex) {
    setSelectedAnswers((current) => ({
      ...current,
      [questionId]: optionIndex,
    }));
  }

  function clearCurrentAnswers() {
    setSelectedAnswers({});
    setSubmission(null);
  }

  function focusSearch() {
    setActiveSidebar("search");
    window.requestAnimationFrame(() => {
      searchInputRef.current?.focus();
    });
  }

  function resumeNextPendingLesson() {
    const target = lessons.find((lesson) => !progress[lesson.id]?.completed) ?? lessons[0];
    if (target) {
      openLesson(target.id);
    }
  }

  function resetAllProgress() {
    const shouldReset = window.confirm(
      "Tem certeza que deseja apagar todo o progresso salvo desta trilha?",
    );

    if (!shouldReset) {
      return;
    }

    setProgress({});
    setSelectedAnswers({});
    setSubmission(null);
    setCelebrationSeed(0);
    setActiveLessonId(lessons[0]?.id ?? activeLessonId);
    setActiveTab("overview");
    setInspectorView("outline");
  }

  function submitLesson() {
    const unanswered = activeLesson.quiz.filter((question) => selectedAnswers[question.id] === undefined);

    if (unanswered.length > 0) {
      setSubmission({
        status: "incomplete",
        message: `Faltam ${unanswered.length} resposta(s) antes de corrigir esta lição.`,
      });
      setActiveTab("checkpoint");
      setInspectorView("problems");
      return;
    }

    const correctAnswers = activeLesson.quiz.filter(
      (question) => selectedAnswers[question.id] === question.answer,
    ).length;
    const score = Math.round((correctAnswers / activeLesson.quiz.length) * 100);
    const passed = score >= 70;
    const xpEarned = Math.round((score / 100) * activeLesson.xp);

    setSubmission({
      status: passed ? "passed" : "failed",
      score,
      passed,
      correctAnswers,
      totalQuestions: activeLesson.quiz.length,
      xpEarned,
    });

    updateLessonState((previous) => ({
      attempts: (previous.attempts ?? 0) + 1,
      bestScore: Math.max(previous.bestScore ?? 0, score),
      completed: previous.completed || passed,
      completedAt: passed ? new Date().toISOString() : previous.completedAt,
      xpEarned: Math.max(previous.xpEarned ?? 0, xpEarned),
    }));

    setInspectorView(passed ? "progress" : "problems");

    if (passed) {
      setCelebrationSeed(Date.now());
    }
  }

  function openLesson(lessonId, nextTab = "overview") {
    if (!isLessonUnlocked(lessonId)) {
      return;
    }

    startTransition(() => {
      setActiveLessonId(lessonId);
      setActiveTab(nextTab);
      setSelectedAnswers({});
      setSubmission(null);
      setInspectorView("outline");
    });
  }

  function jumpToNextLesson() {
    if (nextLesson) {
      openLesson(nextLesson.id);
    }
  }

  function jumpToPreviousLesson() {
    if (previousLesson) {
      openLesson(previousLesson.id);
    }
  }

  function toggleModule(moduleId) {
    setCollapsedModules((current) => ({
      ...current,
      [moduleId]: !current[moduleId],
    }));
  }

  function toggleExplorerSection(section) {
    setSectionOpen((current) => ({
      ...current,
      [section]: !current[section],
    }));
  }

  function jumpToSection(section) {
    if (section === "checkpoint") {
      setActiveTab("checkpoint");
      setTimeout(() => {
        document.getElementById("checkpoint-section")?.scrollIntoView({ behavior: "smooth" });
      }, 0);
      return;
    }

    setActiveTab("lesson");
    setTimeout(() => {
      document.getElementById(`${section}-section`)?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  }

  useEffect(() => {
    function handleKeyDown(event) {
      const target = event.target;
      const isEditable =
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      const commandKey = event.ctrlKey || event.metaKey;

      if (commandKey && event.key.toLowerCase() === "k") {
        event.preventDefault();
        focusSearch();
        return;
      }

      if (commandKey && event.key === "1") {
        event.preventDefault();
        setActiveTab("overview");
        return;
      }

      if (commandKey && event.key === "2") {
        event.preventDefault();
        setActiveTab("lesson");
        return;
      }

      if (commandKey && event.key === "3") {
        event.preventDefault();
        setActiveTab("checkpoint");
        return;
      }

      if (commandKey && event.key === "Enter" && activeTab === "checkpoint") {
        event.preventDefault();
        submitLesson();
        return;
      }

      if (isEditable) {
        return;
      }

      if (event.altKey && event.key === "ArrowRight" && nextLesson) {
        event.preventDefault();
        jumpToNextLesson();
      }

      if (event.altKey && event.key === "ArrowLeft" && previousLesson) {
        event.preventDefault();
        jumpToPreviousLesson();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTab, nextLesson, previousLesson, progress, lessons]);

  function renderExplorer() {
    return (
      <>
        <div className="panel-caption">{ui.explorer}</div>
        <div className="workspace-badge">{ui.workspaceLabel}</div>
        <h2>Estrutura do curso</h2>
        <p>
          Cada módulo funciona como uma pasta. Cada lição abre no editor central e o checkpoint
          fica acessível pela aba de quiz.
        </p>

        <div className="explorer-section">
          <button
            type="button"
            className="section-toggle"
            onClick={() => toggleExplorerSection("openEditors")}
          >
            <span>{sectionOpen.openEditors ? "▾" : "▸"}</span>
            <span>{ui.openEditors}</span>
          </button>
          {sectionOpen.openEditors ? (
            <div className="editor-chip-list">
              {openEditors.map((fileName) => {
                const isQuiz = fileName === "checkpoint.quiz";
                const isModule = fileName.endsWith(".module");
                const active =
                  fileName === `${activeLesson.title}.md` ||
                  (isQuiz && activeTab === "checkpoint") ||
                  (isModule && activeTab === "lesson");

                return (
                  <button
                    key={fileName}
                    type="button"
                    className={`editor-chip ${active ? "active" : ""}`}
                    onClick={() =>
                      isQuiz
                        ? setActiveTab("checkpoint")
                        : isModule
                          ? setActiveTab("lesson")
                          : setActiveTab("overview")
                    }
                  >
                    <span className={`file-dot ${isQuiz ? "green" : isModule ? "amber" : "blue"}`} />
                    <span>{fileName}</span>
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        <div className="explorer-section">
          <button
            type="button"
            className="section-toggle"
            onClick={() => toggleExplorerSection("modules")}
          >
            <span>{sectionOpen.modules ? "▾" : "▸"}</span>
            <span>{ui.modules}</span>
          </button>

          {sectionOpen.modules ? (
            <div className="explorer-list">
              {normalizedModules.map((module, moduleIndex) => {
                const hidden = collapsedModules[module.id];

                return (
                  <section key={module.id} className={`module-card accent-${module.accent}`}>
                    <button
                      type="button"
                      className="module-heading"
                      onClick={() => toggleModule(module.id)}
                    >
                      <span>{hidden ? "▸" : "▾"}</span>
                      <div>
                        <span className="module-step">Módulo {moduleIndex + 1}</span>
                        <h3>{module.title}</h3>
                      </div>
                      <span className="module-level">{module.level}</span>
                    </button>

                    {!hidden ? (
                      <>
                        <p>{module.summary}</p>
                        <div className="lesson-tree">
                          {module.lessons.map((lessonItem, index) => {
                            const unlocked = isLessonUnlocked(lessonItem.id);
                            const done = progress[lessonItem.id]?.completed;
                            const isActive = lessonItem.id === activeLesson.id;

                            return (
                              <button
                                key={lessonItem.id}
                                type="button"
                                className={[
                                  "lesson-node",
                                  isActive ? "active" : "",
                                  done ? "done" : "",
                                  unlocked ? "unlocked" : "locked",
                                ].join(" ")}
                                onClick={() => openLesson(lessonItem.id)}
                                disabled={!unlocked}
                              >
                                <span className="node-marker">{index + 1}</span>
                                <div className="node-copy">
                                  <strong>{lessonItem.title}</strong>
                                  <small>
                                    {done ? "Concluída" : unlocked ? lessonItem.time : "Bloqueada"}
                                  </small>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </>
                    ) : null}
                  </section>
                );
              })}
            </div>
          ) : null}
        </div>
      </>
    );
  }

  function renderSearch() {
    return (
      <>
        <div className="panel-caption">{ui.search}</div>
        <h2>Buscar no curso</h2>
        <p>
          Digite um termo para encontrar lições por título, objetivo ou conceitos. O resultado
          já abre no editor.
        </p>

        <label className="search-field">
          <span className="panel-caption">QUERY</span>
          <input
            ref={searchInputRef}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={ui.searchPlaceholder}
          />
        </label>

        <div className="search-results">
          {filteredModules.map((module) =>
            module.lessons.map((lesson) => (
              <button
                key={lesson.id}
                type="button"
                className="search-result"
                onClick={() => openLesson(lesson.id)}
              >
                <strong>{lesson.title}</strong>
                <small>{module.title}</small>
              </button>
            )),
          )}
          {filteredModules.length === 0 ? (
            <div className="empty-panel">Nenhuma lição encontrada para essa busca.</div>
          ) : null}
        </div>
      </>
    );
  }

  function renderSourceControl() {
    return (
      <>
        <div className="panel-caption">{ui.sourceControl}</div>
        <h2>Estado do estudo</h2>
        <p>
          Em vez de arquivos alterados, aqui você acompanha o que já foi consolidado e o que
          ainda precisa de revisão antes de fechar a próxima lição.
        </p>

        <div className="source-list">
          <div className="source-item">
            <strong>Leituras concluídas</strong>
            <span>
              {lessons.filter((lesson) => progress[lesson.id]?.readingDone).length}/{lessons.length}
            </span>
          </div>
          <div className="source-item">
            <strong>Práticas concluídas</strong>
            <span>
              {lessons.filter((lesson) => progress[lesson.id]?.practiceDone).length}/{lessons.length}
            </span>
          </div>
          <div className="source-item">
            <strong>Checkpoint aprovados</strong>
            <span>{completedCount}/{lessons.length}</span>
          </div>
          <div className="source-item">
            <strong>Lições restantes</strong>
            <span>{remainingLessons}</span>
          </div>
        </div>

        <div className="run-actions">
          <button type="button" className="run-action" onClick={resumeNextPendingLesson}>
            Retomar próxima lição pendente
          </button>
          <button type="button" className="run-action" onClick={clearCurrentAnswers}>
            Limpar respostas da rodada
          </button>
          <button type="button" className="run-action" onClick={resetAllProgress}>
            Resetar todo o progresso
          </button>
        </div>
      </>
    );
  }

  function renderRunPanel() {
    return (
      <>
        <div className="panel-caption">{ui.run}</div>
        <h2>Atalhos de execução</h2>
        <p>
          Use estes atalhos para navegar rápido pela lição atual e executar o fluxo completo de
          estudo sem procurar cada bloco manualmente.
        </p>

        <div className="run-actions">
          <button type="button" className="run-action" onClick={() => setActiveTab("overview")}>
            Abrir visão geral
          </button>
          <button type="button" className="run-action" onClick={() => jumpToSection("steps")}>
            Ir para etapas
          </button>
          <button type="button" className="run-action" onClick={() => jumpToSection("reading")}>
            Ir para leitura
          </button>
          <button type="button" className="run-action" onClick={() => jumpToSection("practice")}>
            Ir para prática
          </button>
          <button type="button" className="run-action" onClick={() => jumpToSection("checkpoint")}>
            Ir para checkpoint
          </button>
          <button type="button" className="run-action" onClick={focusSearch}>
            Abrir busca rápida
          </button>
        </div>

        <div className="source-list">
          <div className="source-item">
            <strong>Ctrl/Cmd + K</strong>
            <span>Foca a busca do curso</span>
          </div>
          <div className="source-item">
            <strong>Ctrl/Cmd + 1, 2, 3</strong>
            <span>Alterna entre overview, lesson e checkpoint</span>
          </div>
          <div className="source-item">
            <strong>Alt + ← / →</strong>
            <span>Navega para a lição anterior ou próxima</span>
          </div>
          <div className="source-item">
            <strong>Ctrl/Cmd + Enter</strong>
            <span>Corrige o checkpoint quando a aba de quiz estiver aberta</span>
          </div>
        </div>
      </>
    );
  }

  function renderSidebar() {
    if (activeSidebar === "search") return renderSearch();
    if (activeSidebar === "git") return renderSourceControl();
    if (activeSidebar === "run") return renderRunPanel();
    return renderExplorer();
  }

  function renderInspector() {
    return (
      <>
        <div className="panel-caption">INSPECTOR</div>
        <h2>Status do workspace</h2>

        <div className="inspector-tabs">
          <button
            type="button"
            className={`inspector-tab ${inspectorView === "outline" ? "active" : ""}`}
            onClick={() => setInspectorView("outline")}
          >
            {ui.outline}
          </button>
          <button
            type="button"
            className={`inspector-tab ${inspectorView === "progress" ? "active" : ""}`}
            onClick={() => setInspectorView("progress")}
          >
            {ui.progress}
          </button>
          <button
            type="button"
            className={`inspector-tab ${inspectorView === "problems" ? "active" : ""}`}
            onClick={() => setInspectorView("problems")}
          >
            {ui.problems}
          </button>
        </div>

        {inspectorView === "outline" ? (
          <div className="inspector-stack">
            <article className="inspector-card primary">
              <span className="card-tag">{ui.outline}</span>
              <strong>{overallProgress}%</strong>
              <p>
                {completedCount} de {lessons.length} lições concluídas com {totalXp} de{" "}
                {totalPossibleXp} XP possíveis.
              </p>
            </article>

            <div className="outline-list">
              <button type="button" className="outline-item active" onClick={() => setActiveTab("overview")}>
                <span className="file-dot blue" />
                <span>Visão geral</span>
              </button>
              <button type="button" className="outline-item" onClick={() => jumpToSection("steps")}>
                <span className="file-dot amber" />
                <span>Etapas da lição</span>
              </button>
              <button type="button" className="outline-item" onClick={() => jumpToSection("reading")}>
                <span className="file-dot amber" />
                <span>Leitura guiada</span>
              </button>
              <button type="button" className="outline-item" onClick={() => jumpToSection("practice")}>
                <span className="file-dot amber" />
                <span>Prática guiada</span>
              </button>
              <button type="button" className="outline-item" onClick={() => jumpToSection("checkpoint")}>
                <span className="file-dot green" />
                <span>Checkpoint final</span>
              </button>
            </div>
          </div>
        ) : null}

        {inspectorView === "progress" ? (
          <div className="inspector-stack">
            <article className="inspector-card">
              <span className="card-tag">Média de domínio</span>
              <strong>{mastery}%</strong>
              <div className="meter">
                <div className="meter-fill" style={{ width: `${mastery}%` }} />
              </div>
              <p>{answeredLessons} lições já tiveram checkpoint respondido.</p>
            </article>

            <article className="inspector-card">
              <span className="card-tag">Rank atual</span>
              <strong>{getRank(totalXp)}</strong>
              <div className="mini-status-list">
                <div>
                  <span>Módulos fechados</span>
                  <strong>{completedModules}</strong>
                </div>
                <div>
                  <span>Próxima travada</span>
                  <strong>{nextLockedLesson ? nextLockedLesson.title : "Graduação"}</strong>
                </div>
              </div>
            </article>

            <article className="inspector-card">
              <span className="card-tag">Pulso da trilha</span>
              <strong>{lastCompletedEntry ? lastCompletedEntry.title : "Primeira conquista pendente"}</strong>
              <div className="mini-status-list">
                <div>
                  <span>Última conquista</span>
                  <strong>{formatDateTime(lastCompletedEntry?.completedAt)}</strong>
                </div>
                <div>
                  <span>Feitas hoje</span>
                  <strong>{completedToday}</strong>
                </div>
                <div>
                  <span>Restantes</span>
                  <strong>{remainingLessons}</strong>
                </div>
              </div>
            </article>
          </div>
        ) : null}

        {inspectorView === "problems" ? (
          <div className="inspector-stack">
            {lessonProblems.length > 0 ? (
              lessonProblems.map((problem) => (
                <button
                  key={problem.id}
                  type="button"
                  className="problem-card"
                  onClick={() => jumpToSection(problem.action)}
                >
                  <strong>{problem.id}</strong>
                  <span>{problem.label}</span>
                </button>
              ))
            ) : (
              <div className="empty-panel">Nenhum problema aberto na lição atual.</div>
            )}
          </div>
        ) : null}
      </>
    );
  }

  function renderOverview() {
    return (
      <>
        <section className="hero-card" id="overview-section">
          <div className="hero-copy">
            <span className="panel-caption">README</span>
            <h1>{ui.title}</h1>
            <p>{ui.subtitle}</p>

            <div className="metric-ribbon">
              <article>
                <strong>{lessons.length}</strong>
                <span>Lições</span>
              </article>
              <article>
                <strong>{overallProgress}%</strong>
                <span>Trilha</span>
              </article>
              <article>
                <strong>{totalXp}</strong>
                <span>XP</span>
              </article>
              <article>
                <strong>{mastery}%</strong>
                <span>Domínio</span>
              </article>
            </div>
          </div>

          <div className={`hero-terminal accent-${activeLesson.accent}`}>
            <div className="terminal-header">
              <span className="terminal-dot red" />
              <span className="terminal-dot yellow" />
              <span className="terminal-dot green" />
              <strong>{activeLesson.title}</strong>
            </div>

            <div className="terminal-body">
              <span className="terminal-label">{getAccentLabel(activeLesson.accent)}</span>
              <p>{activeLesson.objective}</p>

              <div className="terminal-stats">
                <div>
                  <span>Módulo</span>
                  <strong>{currentModule.title}</strong>
                </div>
                <div>
                  <span>Tempo</span>
                  <strong>{activeLesson.time}</strong>
                </div>
                <div>
                  <span>Questões</span>
                  <strong>{activeLesson.quiz.length}</strong>
                </div>
                <div>
                  <span>XP</span>
                  <strong>{activeLesson.xp}</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {renderLessonContent()}
      </>
    );
  }

  function renderLessonContent() {
    return (
      <>
        <section className="focus-card">
          <div className="focus-copy">
            <span className="panel-caption">Fluxo da lição</span>
            <h2>{activeLesson.title}</h2>
            <p>
              Leitura, raciocínio, prática e checkpoint. Você pode marcar cada bloco como
              concluído e acompanhar o que ainda falta no painel de problemas.
            </p>
          </div>
          <div className="focus-meter">
            <span>Andamento do módulo</span>
            <strong>{moduleCompletionRate}%</strong>
            <div className="meter">
              <div className="meter-fill" style={{ width: `${moduleCompletionRate}%` }} />
            </div>
          </div>
        </section>

        <section className="step-runway" id="steps-section">
          {activeLesson.steps.map((step, index) => (
            <button
              key={step.title}
              type="button"
              className={`step-card ${lessonState.steps?.[index] ? "done" : ""}`}
              onClick={() => toggleStep(index)}
            >
              <span className="step-card-index">etapa_{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
              <small>{lessonState.steps?.[index] ? ui.done : ui.pending}</small>
            </button>
          ))}
        </section>

        <div className="editor-columns">
          <article className="reading-card editor-document" id="reading-section">
            <div className="card-header">
              <span>Leitura guiada</span>
              <strong>{activeLesson.time}</strong>
            </div>

            <div className="section-actions">
              <button type="button" className="ghost-button" onClick={markReadingDone}>
                {lessonState.readingDone ? "Leitura concluída" : ui.markReading}
              </button>
            </div>

            <div className="document-lines">
              {activeLesson.reading.map((paragraph, index) => (
                <div key={paragraph} className="document-line">
                  <span className="line-number">{index + 1}</span>
                  <p>{paragraph}</p>
                </div>
              ))}
            </div>

            <div className="concept-pills">
              {activeLesson.concepts.map((concept) => (
                <span key={concept}>{concept}</span>
              ))}
            </div>
          </article>

          <article className="code-card editor-document">
            <div className="card-header">
              <span>{activeLesson.example.label}</span>
              <strong>Estrutura central</strong>
            </div>
            <div className="document-line code-block">
              <span className="line-number">01</span>
              <pre>{activeLesson.example.code}</pre>
            </div>
          </article>
        </div>

        <div className="editor-columns secondary" id="practice-section">
          <article className="practice-card">
            <div className="card-header">
              <span>{activeLesson.drill.title}</span>
              <strong>Prática guiada</strong>
            </div>

            <div className="section-actions">
              <button type="button" className="ghost-button" onClick={markPracticeDone}>
                {lessonState.practiceDone ? "Prática concluída" : ui.markPractice}
              </button>
            </div>

            <h3>{activeLesson.drill.prompt}</h3>
            <p>{activeLesson.drill.expected}</p>

            <ul className="practice-list">
              {activeLesson.drill.pitfalls.map((pitfall) => (
                <li key={pitfall}>{pitfall}</li>
              ))}
            </ul>
          </article>

          <article className="insight-card">
            <div className="card-header">
              <span>Ritmo da lição</span>
              <strong>Leitura, prática e correção em tempo real.</strong>
            </div>

            <div className="meter">
              <div className="meter-fill" style={{ width: `${answerProgress}%` }} />
            </div>

            <p>
              {answeredCount} de {activeLesson.quiz.length} respostas marcadas nesta rodada.
            </p>

            <div className="mini-status-list">
              <div>
                <span>Tentativas</span>
                <strong>{lessonState.attempts ?? 0}</strong>
              </div>
              <div>
                <span>Melhor nota</span>
                <strong>{lessonState.bestScore ?? "--"}%</strong>
              </div>
              <div>
                <span>Melhor XP</span>
                <strong>{lessonState.xpEarned ?? 0}</strong>
              </div>
            </div>
          </article>
        </div>
      </>
    );
  }

  function renderCheckpoint() {
    return (
      <section className="checkpoint-panel" id="checkpoint-section">
        <div className="quiz-header">
          <div>
            <span className="panel-caption">{ui.checkpointTitle}</span>
            <h2>{ui.checkpointSubtitle}</h2>
          </div>
          <span className="quiz-rule">Aproveitamento mínimo: 70%</span>
        </div>

        <div className="question-list">
          {activeLesson.quiz.map((question, questionIndex) => {
            const selected = selectedAnswers[question.id];
            const wasSubmitted =
              submission?.status === "passed" || submission?.status === "failed";
            const isCorrect = selected === question.answer;

            return (
              <article key={question.id} className="question-card">
                <div className="question-meta">
                  <span>Questão {questionIndex + 1}</span>
                  {wasSubmitted ? (
                    <strong className={isCorrect ? "status-ok" : "status-bad"}>
                      {isCorrect ? ui.correct : ui.review}
                    </strong>
                  ) : (
                    <strong className="status-neutral">{ui.answerPrompt}</strong>
                  )}
                </div>

                <h3>{question.question}</h3>

                <div className="options-grid">
                  {question.options.map((option, optionIndex) => {
                    const isSelected = selected === optionIndex;
                    const showCorrect = wasSubmitted && optionIndex === question.answer;
                    const showWrong = wasSubmitted && isSelected && optionIndex !== question.answer;

                    return (
                      <button
                        key={option}
                        type="button"
                        className={[
                          "option-button",
                          isSelected ? "selected" : "",
                          showCorrect ? "correct" : "",
                          showWrong ? "wrong" : "",
                        ].join(" ")}
                        onClick={() => selectAnswer(question.id, optionIndex)}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>

                {wasSubmitted ? <p className="explanation">{question.explanation}</p> : null}
              </article>
            );
          })}
        </div>

        <div className="quiz-actions">
          <button type="button" className="primary-button" onClick={submitLesson}>
            {ui.fixLesson}
          </button>

          {previousLesson ? (
            <button type="button" className="ghost-button" onClick={jumpToPreviousLesson}>
              {ui.prevLesson}
            </button>
          ) : null}

          {submission?.status === "passed" && nextLesson ? (
            <button type="button" className="secondary-button" onClick={jumpToNextLesson}>
              {ui.nextLesson}
            </button>
          ) : null}
        </div>

        {submission ? (
          <div
            className={[
              "result-banner",
              submission.status === "passed"
                ? "success"
                : submission.status === "failed"
                  ? "retry"
                  : "warning",
            ].join(" ")}
          >
            {submission.status === "passed" ? (
              <>
                <strong>Lição concluída. Progresso salvo e XP liberado.</strong>
                <span>
                  Você acertou {submission.correctAnswers} de {submission.totalQuestions}, fez{" "}
                  {submission.score}% e ganhou {submission.xpEarned} XP.
                </span>
              </>
            ) : null}

            {submission.status === "failed" ? (
              <>
                <strong>Quase lá. Revise a leitura e tente de novo.</strong>
                <span>
                  Sua nota foi {submission.score}%. Use o feedback acima para ajustar a lógica
                  antes de tentar novamente.
                </span>
              </>
            ) : null}

            {submission.status === "incomplete" ? (
              <>
                <strong>Checkpoint incompleto.</strong>
                <span>{submission.message}</span>
              </>
            ) : null}
          </div>
        ) : null}
      </section>
    );
  }

  return (
    <div className="app-shell">
      <div className="ambient-grid" />
      <div className="ambient-glow glow-a" />
      <div className="ambient-glow glow-b" />

      {celebrationSeed ? (
        <div className="celebration-layer" aria-hidden="true">
          {Array.from({ length: 16 }).map((_, index) => (
            <span key={`${celebrationSeed}-${index}`} style={{ "--particle": index }} />
          ))}
        </div>
      ) : null}

      <div className="window-shell">
        <header className="titlebar">
          <div className="titlebar-left">
            <span className="traffic red" />
            <span className="traffic yellow" />
            <span className="traffic green" />
          </div>
          <div className="titlebar-center">
            {ui.workspace} - {activeLesson.title}
          </div>
          <div className="titlebar-right">
            <span>{getRank(totalXp)}</span>
            <span>{overallProgress}%</span>
          </div>
        </header>

        <div className="ide-shell">
          <aside className="activity-bar">
            <button
              type="button"
              className={`activity-button ${activeSidebar === "explorer" ? "active" : ""}`}
              onClick={() => setActiveSidebar("explorer")}
            >
              files
            </button>
            <button
              type="button"
              className={`activity-button ${activeSidebar === "search" ? "active" : ""}`}
              onClick={() => setActiveSidebar("search")}
            >
              find
            </button>
            <button
              type="button"
              className={`activity-button ${activeSidebar === "git" ? "active" : ""}`}
              onClick={() => setActiveSidebar("git")}
            >
              git
            </button>
            <button
              type="button"
              className={`activity-button ${activeSidebar === "run" ? "active" : ""}`}
              onClick={() => setActiveSidebar("run")}
            >
              run
            </button>
          </aside>

          <aside className="explorer-panel">{renderSidebar()}</aside>

          <section className="editor-panel">
            <div className="tabbar">
              <button
                type="button"
                className={`tab ${activeTab === "overview" ? "active" : ""}`}
                onClick={() => setActiveTab("overview")}
              >
                <span className="tab-dot blue" />
                {activeLesson.title}.md
              </button>
              <button
                type="button"
                className={`tab ${activeTab === "lesson" ? "active" : ""}`}
                onClick={() => setActiveTab("lesson")}
              >
                <span className="tab-dot amber" />
                {currentModule.title}.module
              </button>
              <button
                type="button"
                className={`tab ${activeTab === "checkpoint" ? "active" : ""}`}
                onClick={() => setActiveTab("checkpoint")}
              >
                <span className="tab-dot green" />
                checkpoint.quiz
              </button>
            </div>

            <div className="editor-scroll">
              <div className="breadcrumbs">
                <span>src</span>
                <span>/</span>
                <span>course</span>
                <span>/</span>
                <span>{currentModule.id}</span>
                <span>/</span>
                <strong>
                  {activeTab === "checkpoint" ? "checkpoint.quiz" : `${activeLesson.id}.md`}
                </strong>
              </div>

              {activeTab === "overview" ? renderOverview() : null}
              {activeTab === "lesson" ? renderLessonContent() : null}
              {activeTab === "checkpoint" ? renderCheckpoint() : null}
            </div>
          </section>

          <aside className="inspector-panel">{renderInspector()}</aside>
        </div>

        <footer className="statusbar">
          <div className="statusbar-left">
            <span>Lógica Quest</span>
            <span>{ui.statusBranch}</span>
            <span>{currentModule.title}</span>
          </div>
          <div className="statusbar-right">
            <span>{ui.statusEncoding}</span>
            <span>{ui.statusMode}</span>
            <span>{activeLesson.time}</span>
            <span>{activeLesson.quiz.length} questões</span>
            <span>{totalXp} XP</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

