import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { courseModules } from './src/courseData';

const tabs = [
  { id: 'learn', label: 'Inicio', icon: '⌂' },
  { id: 'path', label: 'Trilha', icon: '◇' },
  { id: 'practice', label: 'Pratica', icon: '</>' },
  { id: 'profile', label: 'Perfil', icon: 'ID' },
];

const textReplacements = [
  ['ÃƒÂ³', 'ó'], ['ÃƒÂ§', 'ç'], ['ÃƒÂ£', 'ã'], ['ÃƒÂ¡', 'á'], ['ÃƒÂ©', 'é'],
  ['ÃƒÂ­', 'í'], ['ÃƒÂº', 'ú'], ['ÃƒÂª', 'ê'], ['ÃƒÂ´', 'ô'], ['Ãƒâ€°', 'É'],
  ['Ãƒâ€¡', 'Ç'], ['Ãƒ', 'à'], ['Ã¢â‚¬Â¢', '•'], ['Ã¢â‚¬â€', '—'], ['Ã³', 'ó'],
  ['Ã§', 'ç'], ['Ã£', 'ã'], ['Ã¡', 'á'], ['Ã©', 'é'], ['Ã­', 'í'], ['Ãº', 'ú'],
  ['Ãª', 'ê'], ['Ã´', 'ô'], ['Ã‰', 'É'], ['Ã‡', 'Ç'], ['Ã', 'à'], ['â€¢', '•'], ['â€”', '—'],
];

const regexFixes = [
  [/\blogica\b/gi, 'lógica'], [/\bLogica\b/g, 'Lógica'], [/\bmodulo\b/gi, 'módulo'],
  [/\bModulo\b/g, 'Módulo'], [/\blicao\b/gi, 'lição'], [/\bLicao\b/g, 'Lição'],
  [/\bprogramacao\b/gi, 'programação'], [/\bProgramacao\b/g, 'Programação'],
  [/\bcodigo\b/gi, 'código'], [/\bCodigo\b/g, 'Código'], [/\bsaida\b/gi, 'saída'],
  [/\bSaida\b/g, 'Saída'], [/\bnao\b/gi, 'não'], [/\bNao\b/g, 'Não'],
  [/\bpratica\b/gi, 'prática'], [/\bPratica\b/g, 'Prática'], [/\bproxima\b/gi, 'próxima'],
  [/\bL\?gica\b/g, 'Lógica'], [/\bl\?gica\b/g, 'lógica'], [/\bm\?dulo\b/g, 'módulo'],
  [/\bli\?\?o\b/g, 'lição'], [/\bprograma\?\?o\b/g, 'programação'], [/\bracioc\?nio\b/g, 'raciocínio'],
  [/\bsa\?da\b/g, 'saída'], [/\bc\?digo\b/g, 'código'], [/\bquest\?es\b/g, 'questões'],
  [/\bpr\?xima\b/g, 'próxima'], [/\bN\?o\b/g, 'Não'], [/\bn\?o\b/g, 'não'],
  [/\bm\?nimo\b/g, 'mínimo'], [/\bVis\?o\b/g, 'Visão'], [/\bvis\?o\b/g, 'visão'],
  [/\ba\?\?o\b/g, 'ação'], [/\ba\?\?es\b/g, 'ações'], [/\bfun\?\?o\b/g, 'função'],
  [/\bcondi\?\?o\b/g, 'condição'], [/\bvalida\?\?o\b/g, 'validação'], [/\btransi\?\?o\b/g, 'transição'],
  [/\bconte\?do\b/g, 'conteúdo'], [/\bt\?cnica\b/g, 'técnica'], [/\bdif\?cil\b/g, 'difícil'],
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
  if (typeof node === 'string') return normalizeText(node);
  if (Array.isArray(node)) return node.map(normalizeNode);
  if (node && typeof node === 'object') {
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
      moduleIndex,
      lessonIndex,
    })),
  );
}

export default function App() {
  const modules = useMemo(() => normalizeNode(courseModules), []);
  const lessons = useMemo(() => flattenLessons(modules), [modules]);
  const [activeTab, setActiveTab] = useState('learn');
  const [activeLessonId, setActiveLessonId] = useState(lessons[0]?.id);
  const [completed, setCompleted] = useState({});
  const [answers, setAnswers] = useState({});

  const activeLessonIndex = lessons.findIndex((lesson) => lesson.id === activeLessonId);
  const activeLesson = lessons[activeLessonIndex] ?? lessons[0];
  const activeModule = modules.find((module) => module.id === activeLesson.moduleId) ?? modules[0];
  const completedCount = lessons.filter((lesson) => completed[lesson.id]).length;
  const progress = Math.round((completedCount / Math.max(lessons.length, 1)) * 100);
  const totalXp = lessons.reduce((sum, lesson) => sum + (completed[lesson.id] ? lesson.xp : 0), 0);
  const selectedCount = Object.keys(answers).length;
  const moduleDone = activeModule.lessons.filter((lesson) => completed[lesson.id]).length;
  const moduleProgress = Math.round((moduleDone / Math.max(activeModule.lessons.length, 1)) * 100);

  function isUnlocked(lessonId) {
    const index = lessons.findIndex((lesson) => lesson.id === lessonId);
    if (index <= 0) return true;
    return Boolean(completed[lessons[index - 1].id]);
  }

  function openLesson(lessonId, tab = 'lesson') {
    if (!isUnlocked(lessonId)) return;
    setActiveLessonId(lessonId);
    setAnswers({});
    setActiveTab(tab);
  }

  function finishLesson() {
    if (selectedCount < activeLesson.quiz.length) return;
    setCompleted((current) => ({ ...current, [activeLesson.id]: true }));
  }

  function renderTopbar() {
    return (
      <View style={styles.topbar}>
        <View style={styles.logo}><Text style={styles.logoText}>LQ</Text></View>
        <View style={styles.topCopy}>
          <Text style={styles.kicker}>Bom estudo, Wess</Text>
          <Text style={styles.appTitle}>Logic Quest</Text>
        </View>
        <View style={styles.streakPill}>
          <Text style={styles.streakValue}>{completedCount}</Text>
          <Text style={styles.streakLabel}>dias</Text>
        </View>
      </View>
    );
  }

  function renderLearn() {
    const nextLessons = lessons.slice(Math.max(activeLessonIndex, 0), Math.max(activeLessonIndex, 0) + 4);

    return (
      <ScrollView contentContainerStyle={styles.screen} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View style={styles.heroCopy}>
            <Text style={styles.accentLabel}>Continue de onde parou</Text>
            <Text style={styles.heroTitle}>{activeLesson.title}</Text>
            <Text style={styles.bodyText}>{activeLesson.objective}</Text>
            <TouchableOpacity style={styles.primaryButton} onPress={() => setActiveTab('lesson')}>
              <Text style={styles.primaryButtonText}>Continuar lição</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.progressTile}><Text style={styles.progressTileText}>{progress}%</Text></View>
        </View>

        <View style={styles.statGrid}>
          <View style={styles.statCard}><Text style={styles.statValue}>{completedCount}</Text><Text style={styles.statLabel}>concluídas</Text></View>
          <View style={styles.statCard}><Text style={styles.statValue}>{lessons.length}</Text><Text style={styles.statLabel}>lições</Text></View>
          <View style={styles.statCard}><Text style={styles.statValue}>{totalXp}</Text><Text style={styles.statLabel}>XP</Text></View>
        </View>

        <View style={styles.sectionHeading}>
          <View>
            <Text style={styles.kicker}>Curso atual</Text>
            <Text style={styles.sectionTitle}>{activeModule.title}</Text>
          </View>
          <TouchableOpacity onPress={() => setActiveTab('path')}><Text style={styles.linkText}>Ver trilha</Text></TouchableOpacity>
        </View>

        <View style={styles.courseCard}>
          <View style={styles.courseBadge}><Text style={styles.courseBadgeText}>{activeModule.level}</Text></View>
          <View style={styles.flex}>
            <Text style={styles.cardTitle}>{activeModule.outcome}</Text>
            <Text style={styles.bodyText}>{activeModule.summary}</Text>
            <View style={styles.progressBar}><View style={[styles.progressFill, { width: `${moduleProgress}%` }]} /></View>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.lessonRail}>
          {nextLessons.map((lesson) => (
            <TouchableOpacity key={lesson.id} style={styles.railCard} onPress={() => openLesson(lesson.id)}>
              <Text style={styles.railNumber}>{lesson.lessonIndex + 1}</Text>
              <Text style={styles.railTitle}>{lesson.title}</Text>
              <Text style={styles.railMeta}>{lesson.time} • {lesson.xp} XP</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>
    );
  }

  function renderPath() {
    return (
      <ScrollView contentContainerStyle={styles.screen} showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <Text style={styles.kicker}>Trilha completa</Text>
          <Text style={styles.pageTitle}>Do zero ao profissional</Text>
          <Text style={styles.bodyText}>{progress}% concluído mantendo o conteúdo principal.</Text>
        </View>
        {modules.map((module) => (
          <View key={module.id} style={styles.pathModule}>
            <View style={styles.moduleHeading}>
              <Text style={styles.kicker}>{module.level}</Text>
              <Text style={styles.moduleTitle}>{module.title}</Text>
            </View>
            {module.lessons.map((lesson, index) => {
              const locked = !isUnlocked(lesson.id);
              return (
                <TouchableOpacity
                  key={lesson.id}
                  style={[
                    styles.pathNode,
                    lesson.id === activeLesson.id && styles.pathNodeActive,
                    completed[lesson.id] && styles.pathNodeDone,
                    locked && styles.pathNodeLocked,
                  ]}
                  onPress={() => openLesson(lesson.id)}
                >
                  <View style={styles.nodeNumber}><Text style={styles.nodeNumberText}>{locked ? 'lock' : index + 1}</Text></View>
                  <View style={styles.flex}>
                    <Text style={styles.nodeTitle}>{lesson.title}</Text>
                    <Text style={styles.nodeMeta}>{locked ? 'Bloqueada' : `${lesson.time} • ${lesson.difficulty}`}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </ScrollView>
    );
  }

  function renderLesson() {
    return (
      <ScrollView contentContainerStyle={styles.screen} showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <Text style={styles.kicker}>{activeModule.title}</Text>
          <Text style={styles.pageTitle}>{activeLesson.title}</Text>
          <Text style={styles.bodyText}>{activeLesson.objective}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaPill}>{activeLesson.time}</Text>
            <Text style={styles.metaPill}>{activeLesson.xp} XP</Text>
            <Text style={styles.metaPill}>{activeLesson.difficulty}</Text>
          </View>
        </View>

        <View style={styles.contentCard}>
          <Text style={styles.kicker}>Leitura guiada</Text>
          <Text style={styles.sectionTitle}>Entenda a ideia</Text>
          {activeLesson.reading.map((paragraph) => <Text key={paragraph} style={styles.bodyText}>{paragraph}</Text>)}
        </View>

        <View style={styles.codeCard}>
          <Text style={styles.kicker}>{activeLesson.example.label}</Text>
          <Text style={styles.codeText}>{activeLesson.example.code}</Text>
        </View>

        <View style={styles.contentCard}>
          <View style={styles.sectionHeadingInline}>
            <View>
              <Text style={styles.kicker}>Checkpoint</Text>
              <Text style={styles.sectionTitle}>Meta mínima: 70%</Text>
            </View>
            <Text style={styles.linkText}>{selectedCount}/{activeLesson.quiz.length}</Text>
          </View>
          {activeLesson.quiz.map((question, index) => (
            <View key={question.id} style={styles.questionCard}>
              <Text style={styles.kicker}>Questão {index + 1}</Text>
              <Text style={styles.questionText}>{question.question}</Text>
              {question.options.map((option, optionIndex) => {
                const selected = answers[question.id] === optionIndex;
                return (
                  <TouchableOpacity
                    key={option}
                    style={[styles.optionButton, selected && styles.optionSelected]}
                    onPress={() => setAnswers((current) => ({ ...current, [question.id]: optionIndex }))}
                  >
                    <Text style={styles.optionText}>{option}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
          <TouchableOpacity style={styles.primaryButton} onPress={finishLesson}>
            <Text style={styles.primaryButtonText}>Concluir lição</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  function renderPractice() {
    return (
      <ScrollView contentContainerStyle={styles.screen} showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <Text style={styles.kicker}>Prática rápida</Text>
          <Text style={styles.pageTitle}>{activeLesson.drill.title}</Text>
          <Text style={styles.bodyText}>{activeLesson.drill.prompt}</Text>
        </View>
        <View style={styles.codeCard}>
          <Text style={styles.kicker}>Desafio</Text>
          <Text style={styles.codeText}>{activeLesson.example.code}</Text>
        </View>
        <View style={styles.contentCard}>
          <Text style={styles.kicker}>Resposta esperada</Text>
          <Text style={styles.sectionTitle}>Critério de qualidade</Text>
          <Text style={styles.bodyText}>{activeLesson.drill.expected}</Text>
          {activeLesson.drill.pitfalls.map((pitfall) => <Text key={pitfall} style={styles.warningPill}>{pitfall}</Text>)}
          <TouchableOpacity style={styles.primaryButton} onPress={() => setActiveTab('lesson')}>
            <Text style={styles.primaryButtonText}>Ir para checkpoint</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  function renderProfile() {
    return (
      <ScrollView contentContainerStyle={styles.screen} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}><Text style={styles.logoText}>WY</Text></View>
          <Text style={styles.profileTitle}>WessYu</Text>
          <Text style={styles.bodyText}>Trilha de lógica com ritmo de prática diária.</Text>
          <View style={styles.profileGrid}>
            <View style={styles.profileStat}><Text style={styles.statValue}>{progress}%</Text><Text style={styles.statLabel}>trilha</Text></View>
            <View style={styles.profileStat}><Text style={styles.statValue}>{totalXp}</Text><Text style={styles.statLabel}>XP</Text></View>
            <View style={styles.profileStat}><Text style={styles.statValue}>{completedCount}</Text><Text style={styles.statLabel}>lições</Text></View>
            <View style={styles.profileStat}><Text style={styles.statValue}>{lessons.length}</Text><Text style={styles.statLabel}>total</Text></View>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ExpoStatusBar style="light" />
      {renderTopbar()}
      {activeTab === 'learn' && renderLearn()}
      {activeTab === 'path' && renderPath()}
      {activeTab === 'lesson' && renderLesson()}
      {activeTab === 'practice' && renderPractice()}
      {activeTab === 'profile' && renderProfile()}
      <View style={styles.tabbar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tabButton, activeTab === tab.id && styles.tabActive]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={[styles.tabIcon, activeTab === tab.id && styles.tabTextActive]}>{tab.icon}</Text>
            <Text style={[styles.tabLabel, activeTab === tab.id && styles.tabTextActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const colors = {
  bg: '#07111f',
  bgSoft: '#0b1019',
  panel: '#111827',
  panelStrong: '#0a101c',
  line: '#243450',
  text: '#e8efff',
  muted: '#91a5c7',
  cyan: '#4de4c1',
  blue: '#5ea2ff',
  amber: '#f6c760',
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.bg },
  topbar: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 10, backgroundColor: colors.bg },
  logo: { width: 50, height: 50, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: '#123145', borderWidth: 1, borderColor: '#246b72' },
  logoText: { color: colors.cyan, fontWeight: '900' },
  topCopy: { flex: 1 },
  kicker: { color: colors.muted, fontSize: 11, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase' },
  appTitle: { color: colors.text, fontSize: 24, fontWeight: '900' },
  streakPill: { minWidth: 58, height: 42, borderRadius: 999, alignItems: 'center', justifyContent: 'center', backgroundColor: '#221f16', borderWidth: 1, borderColor: '#574927' },
  streakValue: { color: colors.amber, fontWeight: '900', lineHeight: 17 },
  streakLabel: { color: '#c6a95e', fontSize: 10, fontWeight: '700' },
  screen: { paddingHorizontal: 16, paddingBottom: 110, gap: 14 },
  heroCard: { flexDirection: 'row', gap: 12, minHeight: 188, padding: 18, borderRadius: 28, backgroundColor: '#111827', borderWidth: 1, borderColor: colors.line },
  heroCopy: { flex: 1 },
  accentLabel: { color: colors.cyan, fontSize: 11, fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase' },
  heroTitle: { color: colors.text, fontSize: 30, lineHeight: 32, fontWeight: '900', marginTop: 9 },
  bodyText: { color: colors.muted, fontSize: 14, lineHeight: 21, marginTop: 8 },
  progressTile: { width: 78, height: 78, alignSelf: 'flex-end', borderRadius: 28, alignItems: 'center', justifyContent: 'center', backgroundColor: '#10263a', borderWidth: 1, borderColor: '#2d5573' },
  progressTileText: { color: colors.cyan, fontWeight: '900' },
  primaryButton: { minHeight: 48, marginTop: 15, paddingHorizontal: 16, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cyan },
  primaryButtonText: { color: '#06111f', fontWeight: '900' },
  statGrid: { flexDirection: 'row', gap: 8 },
  statCard: { flex: 1, minHeight: 76, padding: 12, borderRadius: 20, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line },
  statValue: { color: colors.text, fontSize: 20, fontWeight: '900' },
  statLabel: { color: colors.muted, fontSize: 12, fontWeight: '700', marginTop: 4 },
  sectionHeading: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 },
  sectionHeadingInline: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  sectionTitle: { color: colors.text, fontSize: 20, fontWeight: '900', marginTop: 4 },
  linkText: { color: colors.cyan, fontWeight: '900' },
  courseCard: { flexDirection: 'row', gap: 13, padding: 14, borderRadius: 24, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line },
  courseBadge: { width: 68, height: 68, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: '#123145' },
  courseBadgeText: { color: colors.cyan, fontSize: 11, fontWeight: '900', textAlign: 'center' },
  cardTitle: { color: colors.text, fontSize: 16, fontWeight: '900' },
  flex: { flex: 1 },
  progressBar: { height: 10, marginTop: 12, borderRadius: 999, overflow: 'hidden', backgroundColor: colors.panelStrong },
  progressFill: { height: '100%', borderRadius: 999, backgroundColor: colors.cyan },
  lessonRail: { gap: 10, paddingBottom: 2 },
  railCard: { width: 250, minHeight: 122, padding: 14, borderRadius: 22, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line },
  railNumber: { width: 32, height: 32, borderRadius: 13, overflow: 'hidden', textAlign: 'center', textAlignVertical: 'center', backgroundColor: '#123145', color: colors.cyan, fontWeight: '900' },
  railTitle: { color: colors.text, fontSize: 16, fontWeight: '900', marginTop: 12 },
  railMeta: { color: colors.muted, fontSize: 12, marginTop: 6 },
  headerCard: { padding: 16, borderRadius: 26, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line },
  pageTitle: { color: colors.text, fontSize: 28, lineHeight: 31, fontWeight: '900', marginTop: 6 },
  pathModule: { padding: 14, borderRadius: 26, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, gap: 10 },
  moduleHeading: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 },
  moduleTitle: { color: colors.text, fontSize: 17, fontWeight: '900' },
  pathNode: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 74, padding: 11, borderRadius: 22, backgroundColor: colors.panelStrong, borderWidth: 1, borderColor: colors.line },
  pathNodeActive: { borderColor: colors.cyan, backgroundColor: '#102235' },
  pathNodeDone: { borderColor: '#2f756f' },
  pathNodeLocked: { opacity: 0.48 },
  nodeNumber: { width: 48, height: 48, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: '#123145' },
  nodeNumberText: { color: colors.text, fontSize: 11, fontWeight: '900' },
  nodeTitle: { color: colors.text, fontSize: 15, fontWeight: '900' },
  nodeMeta: { color: colors.muted, fontSize: 12, marginTop: 4 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  metaPill: { minHeight: 32, paddingHorizontal: 10, paddingTop: 7, borderRadius: 999, overflow: 'hidden', backgroundColor: colors.panelStrong, color: '#d3e2ff', fontSize: 12, fontWeight: '800' },
  contentCard: { padding: 16, borderRadius: 26, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, gap: 10 },
  codeCard: { padding: 16, borderRadius: 26, backgroundColor: colors.panelStrong, borderWidth: 1, borderColor: colors.line, gap: 12 },
  codeText: { padding: 14, borderRadius: 18, overflow: 'hidden', backgroundColor: '#070d16', color: '#ffe8a6', fontSize: 13, lineHeight: 21 },
  questionCard: { padding: 14, borderRadius: 22, backgroundColor: colors.panelStrong, borderWidth: 1, borderColor: colors.line, gap: 10 },
  questionText: { color: colors.text, fontSize: 16, lineHeight: 22, fontWeight: '900' },
  optionButton: { minHeight: 54, padding: 13, borderRadius: 18, backgroundColor: '#0a101c', borderWidth: 1, borderColor: colors.line },
  optionSelected: { borderColor: colors.blue, backgroundColor: '#13253e' },
  optionText: { color: colors.text, fontWeight: '800', lineHeight: 20 },
  warningPill: { alignSelf: 'flex-start', minHeight: 34, paddingHorizontal: 11, paddingTop: 8, borderRadius: 999, overflow: 'hidden', backgroundColor: '#123145', color: '#d7fff8', fontWeight: '800' },
  profileCard: { alignItems: 'center', padding: 18, borderRadius: 26, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line },
  profileAvatar: { width: 78, height: 78, borderRadius: 28, alignItems: 'center', justifyContent: 'center', backgroundColor: '#123145' },
  profileTitle: { color: colors.text, fontSize: 24, fontWeight: '900', marginTop: 13 },
  profileGrid: { width: '100%', flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 },
  profileStat: { width: '48%', padding: 13, borderRadius: 18, backgroundColor: colors.panelStrong, borderWidth: 1, borderColor: colors.line },
  tabbar: { position: 'absolute', left: 10, right: 10, bottom: 10, flexDirection: 'row', gap: 6, padding: 7, borderRadius: 28, backgroundColor: '#070b12', borderWidth: 1, borderColor: colors.line },
  tabButton: { flex: 1, minHeight: 52, borderRadius: 20, alignItems: 'center', justifyContent: 'center', gap: 4 },
  tabActive: { backgroundColor: '#123145' },
  tabIcon: { color: colors.muted, fontSize: 11, fontWeight: '900' },
  tabLabel: { color: colors.muted, fontSize: 11, fontWeight: '900' },
  tabTextActive: { color: colors.text },
});
