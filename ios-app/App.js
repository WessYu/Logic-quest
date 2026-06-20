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

const accentMap = {
  sunrise: '#ffb454',
  ocean: '#64b5ff',
  forest: '#5ee29a',
  ember: '#ff8a65',
  violet: '#9b8cff',
  cobalt: '#59b5ff',
  coral: '#ff7d95',
};

const replacements = [
  ['ÃƒÂ³', 'ó'], ['ÃƒÂ§', 'ç'], ['ÃƒÂ£', 'ã'], ['ÃƒÂ¡', 'á'], ['ÃƒÂ©', 'é'],
  ['ÃƒÂ­', 'í'], ['ÃƒÂº', 'ú'], ['ÃƒÂª', 'ê'], ['ÃƒÂ´', 'ô'], ['Ãƒâ€°', 'É'],
  ['Ãƒâ€¡', 'Ç'], ['Ãƒ', 'à'], ['Ã¢â‚¬Â¢', '•'], ['Ã¢â‚¬â€', '—'], ['Ã³', 'ó'],
  ['Ã§', 'ç'], ['Ã£', 'ã'], ['Ã¡', 'á'], ['Ã©', 'é'], ['Ã­', 'í'], ['Ãº', 'ú'],
  ['Ãª', 'ê'], ['Ã´', 'ô'], ['Ã‰', 'É'], ['Ã‡', 'Ç'], ['Ã', 'à'], ['â€¢', '•'], ['â€”', '—'],
];

const regexFixes = [
  [/\bL\?gica\b/g, 'Lógica'], [/\bl\?gica\b/g, 'lógica'], [/\bm\?dulo\b/g, 'módulo'],
  [/\bli\?\?o\b/g, 'lição'], [/\bprograma\?\?o\b/g, 'programação'], [/\bracioc\?nio\b/g, 'raciocínio'],
  [/\bsa\?da\b/g, 'saída'], [/\bc\?digo\b/g, 'código'], [/\bquest\?es\b/g, 'questões'],
  [/\bpr\?xima\b/g, 'próxima'], [/\bpr\?ximo\b/g, 'próximo'], [/\bN\?o\b/g, 'Não'],
  [/\bn\?o\b/g, 'não'], [/\bm\?nimo\b/g, 'mínimo'], [/\bVis\?o\b/g, 'Visão'],
  [/\bvis\?o\b/g, 'visão'], [/\ba\?\?o\b/g, 'ação'], [/\ba\?\?es\b/g, 'ações'],
  [/\bfun\?\?o\b/g, 'função'], [/\bfun\?\?es\b/g, 'funções'], [/\bcondi\?\?o\b/g, 'condição'],
  [/\bcondi\?\?es\b/g, 'condições'], [/\bvalida\?\?o\b/g, 'validação'], [/\btransi\?\?o\b/g, 'transição'],
  [/\bconte\?do\b/g, 'conteúdo'], [/\bhip\?tese\b/g, 'hipótese'], [/\bt\?cnica\b/g, 'técnica'],
  [/\bdif\?cil\b/g, 'difícil'], [/\bnum\?rico\b/g, 'numérico'], [/\bexpress\?es\b/g, 'expressões'],
];

function normalizeText(value) {
  let result = value;
  replacements.forEach(([from, to]) => {
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

export default function App() {
  const modules = useMemo(() => normalizeNode(courseModules), []);
  const [activeModuleId, setActiveModuleId] = useState(modules[0]?.id);
  const activeModule = modules.find((module) => module.id === activeModuleId) ?? modules[0];
  const [activeLessonId, setActiveLessonId] = useState(activeModule?.lessons[0]?.id);
  const activeLesson = activeModule.lessons.find((lesson) => lesson.id === activeLessonId) ?? activeModule.lessons[0];
  const [answers, setAnswers] = useState({});

  const accent = accentMap[activeModule.accent] ?? '#64b5ff';
  const selectedCount = Object.keys(answers).length;

  function openModule(moduleId) {
    const nextModule = modules.find((module) => module.id === moduleId);
    setActiveModuleId(moduleId);
    setActiveLessonId(nextModule?.lessons[0]?.id);
    setAnswers({});
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ExpoStatusBar style="light" />
      <ScrollView contentContainerStyle={styles.screen}>
        <View style={styles.hero}>
          <Text style={styles.kicker}>Logic Quest iOS</Text>
          <Text style={styles.title}>Estude lógica no iPhone com uma jornada real do zero ao profissional.</Text>
          <Text style={styles.subtitle}>
            Companion app com módulos, leitura, prática e checkpoint para continuar a trilha fora do desktop.
          </Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.moduleRail}>
          {modules.map((module) => {
            const active = module.id === activeModule.id;
            return (
              <TouchableOpacity
                key={module.id}
                style={[styles.moduleChip, active && { borderColor: accent, backgroundColor: '#111b2d' }]}
                onPress={() => openModule(module.id)}
              >
                <Text style={[styles.moduleChipText, active && { color: '#f3f7ff' }]}>{module.title}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.panel}>
          <Text style={styles.panelLabel}>Módulo ativo</Text>
          <Text style={styles.panelTitle}>{activeModule.title}</Text>
          <Text style={styles.panelText}>{activeModule.outcome}</Text>
          <View style={[styles.progressBar, { backgroundColor: '#162235' }]}>
            <View style={[styles.progressFill, { width: `${Math.min((selectedCount / Math.max(activeLesson.quiz.length, 1)) * 100, 100)}%`, backgroundColor: accent }]} />
          </View>
          <Text style={styles.panelHint}>{selectedCount}/{activeLesson.quiz.length} respostas marcadas na lição atual.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lições do módulo</Text>
          {activeModule.lessons.map((lesson) => {
            const active = lesson.id === activeLesson.id;
            return (
              <TouchableOpacity
                key={lesson.id}
                style={[styles.lessonCard, active && { borderColor: accent, backgroundColor: '#121c2b' }]}
                onPress={() => {
                  setActiveLessonId(lesson.id);
                  setAnswers({});
                }}
              >
                <View>
                  <Text style={styles.lessonTitle}>{lesson.title}</Text>
                  <Text style={styles.lessonMeta}>{lesson.time} • {lesson.difficulty}</Text>
                </View>
                <Text style={[styles.lessonMeta, { color: accent }]}>{lesson.xp} XP</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lição atual</Text>
          <View style={styles.contentCard}>
            <Text style={styles.contentTitle}>{activeLesson.title}</Text>
            <Text style={styles.contentText}>{activeLesson.objective}</Text>
            <Text style={styles.contentLabel}>Leitura guiada</Text>
            {activeLesson.reading.map((paragraph) => (
              <Text key={paragraph} style={styles.contentText}>{paragraph}</Text>
            ))}
            <Text style={styles.contentLabel}>Prática</Text>
            <Text style={styles.contentText}>{activeLesson.drill.prompt}</Text>
            <Text style={styles.contentHint}>{activeLesson.drill.expected}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Checkpoint</Text>
          {activeLesson.quiz.map((question, index) => (
            <View key={question.id} style={styles.questionCard}>
              <Text style={styles.questionLabel}>Questão {index + 1}</Text>
              <Text style={styles.questionText}>{question.question}</Text>
              {question.options.map((option, optionIndex) => {
                const selected = answers[question.id] === optionIndex;
                return (
                  <TouchableOpacity
                    key={option}
                    style={[styles.optionButton, selected && { borderColor: accent, backgroundColor: '#13253e' }]}
                    onPress={() => setAnswers((current) => ({ ...current, [question.id]: optionIndex }))}
                  >
                    <Text style={[styles.optionText, selected && { color: '#f7fbff' }]}>{option}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#060a12' },
  screen: { padding: 20, gap: 18, paddingBottom: 40 },
  hero: { gap: 10, paddingTop: 8 },
  kicker: { color: '#7ea5ff', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.4 },
  title: { color: '#f7fbff', fontSize: 28, lineHeight: 34, fontWeight: '800' },
  subtitle: { color: '#95a8c8', fontSize: 15, lineHeight: 22 },
  moduleRail: { gap: 10 },
  moduleChip: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 999, borderWidth: 1, borderColor: '#223149', backgroundColor: '#0d1420' },
  moduleChipText: { color: '#9cb1d1', fontWeight: '600' },
  panel: { padding: 18, borderRadius: 22, backgroundColor: '#0d1522', borderWidth: 1, borderColor: '#20304b', gap: 10 },
  panelLabel: { color: '#7ea5ff', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.1, fontWeight: '700' },
  panelTitle: { color: '#f3f8ff', fontSize: 22, fontWeight: '800' },
  panelText: { color: '#9cb1d1', lineHeight: 21 },
  panelHint: { color: '#7f93b2', fontSize: 13 },
  progressBar: { height: 10, borderRadius: 999, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 999 },
  section: { gap: 12 },
  sectionTitle: { color: '#f3f8ff', fontSize: 20, fontWeight: '800' },
  lessonCard: { padding: 16, borderRadius: 18, borderWidth: 1, borderColor: '#1e2d45', backgroundColor: '#0b111d', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  lessonTitle: { color: '#edf4ff', fontSize: 16, fontWeight: '700' },
  lessonMeta: { color: '#8ba0c1', fontSize: 13 },
  contentCard: { padding: 18, borderRadius: 22, borderWidth: 1, borderColor: '#20304b', backgroundColor: '#0d1522', gap: 10 },
  contentTitle: { color: '#f7fbff', fontSize: 22, fontWeight: '800' },
  contentLabel: { color: '#7ea5ff', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.1, fontWeight: '700', marginTop: 8 },
  contentText: { color: '#d6e1f3', lineHeight: 22 },
  contentHint: { color: '#9cb1d1', lineHeight: 21 },
  questionCard: { padding: 18, borderRadius: 22, borderWidth: 1, borderColor: '#20304b', backgroundColor: '#0d1522', gap: 12 },
  questionLabel: { color: '#7ea5ff', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.1, fontWeight: '700' },
  questionText: { color: '#f2f7ff', fontSize: 17, lineHeight: 24, fontWeight: '700' },
  optionButton: { padding: 14, borderRadius: 16, borderWidth: 1, borderColor: '#23334e', backgroundColor: '#0a101a' },
  optionText: { color: '#c7d5ec', lineHeight: 20, fontWeight: '600' },
});
