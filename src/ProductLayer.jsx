import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { readLocalProgress, readLocalSession } from "./supabaseRest";
import "./productLayer.css";

const onboardingKey = "logic-quest-onboarding-v1";
const lessonsTotal = 28;

const achievementRules = [
  { id: "first", title: "Primeira conquista", text: "Concluiu a primeira lição.", test: (s) => s.completed >= 1 },
  { id: "xp100", title: "100 XP", text: "Acumulou pelo menos 100 XP.", test: (s) => s.xp >= 100 },
  { id: "half", title: "Meio caminho", text: "Passou de 50% da trilha.", test: (s) => s.completion >= 50 },
  { id: "master", title: "Domínio forte", text: "Média de domínio acima de 80%.", test: (s) => s.mastery >= 80 },
  { id: "finish", title: "Trilha concluída", text: "Finalizou todas as lições disponíveis.", test: (s) => s.completed >= lessonsTotal },
];

function safeGetItem(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // navegador bloqueou armazenamento local
  }
}

function getStats() {
  const progress = readLocalProgress();
  const lessons = Object.values(progress || {}).filter((item) => item && typeof item === "object");
  const completed = lessons.filter((lesson) => lesson.completed).length;
  const xp = lessons.reduce((sum, lesson) => sum + (lesson.xpEarned || 0), 0);
  const scored = lessons.filter((lesson) => Number.isFinite(lesson.bestScore));
  const mastery = scored.length ? Math.round(scored.reduce((sum, lesson) => sum + lesson.bestScore, 0) / scored.length) : 0;
  const completion = Math.min(100, Math.round((completed / lessonsTotal) * 100));

  return { completed, completion, xp, mastery };
}

function LandingModal({ onClose, onOpenPlayground }) {
  return (
    <section className="product-modal-overlay" aria-label="Boas-vindas ao Logic Quest">
      <div className="product-landing-card">
        <button className="product-close" type="button" onClick={onClose}>×</button>
        <span className="panel-caption">LOGIC QUEST</span>
        <h1>Aprenda lógica de programação em uma trilha visual.</h1>
        <p>
          Um ambiente inspirado em editor de código para estudar lógica do zero, praticar com checkpoints,
          testar ideias no playground e acompanhar sua evolução.
        </p>
        <div className="landing-actions">
          <button type="button" onClick={onClose}>Começar trilha</button>
          <button type="button" onClick={onOpenPlayground}>Abrir playground</button>
          <a href="https://github.com/WessYu/Logic-quest" target="_blank" rel="noreferrer">Ver GitHub</a>
        </div>
        <div className="landing-features">
          <article><strong>28</strong><span>lições guiadas</span></article>
          <article><strong>XP</strong><span>score e progresso</span></article>
          <article><strong>IDE</strong><span>interface estilo VS Code</span></article>
        </div>
      </div>
    </section>
  );
}

function OnboardingModal({ onClose }) {
  return (
    <section className="product-modal-overlay" aria-label="Guia inicial Logic Quest">
      <div className="onboarding-card">
        <button className="product-close" type="button" onClick={onClose}>×</button>
        <span className="panel-caption">GUIA RÁPIDO</span>
        <h2>Como estudar no Logic Quest</h2>
        <div className="onboarding-steps">
          <article><strong>1</strong><span>Escolha uma lição na lateral Explorer.</span></article>
          <article><strong>2</strong><span>Leia o conteúdo e marque a leitura.</span></article>
          <article><strong>3</strong><span>Faça a prática guiada e teste no Playground.</span></article>
          <article><strong>4</strong><span>Responda o checkpoint para liberar XP.</span></article>
          <article><strong>5</strong><span>Acompanhe score, frequência e conquistas.</span></article>
        </div>
        <button className="primary-product-button" type="button" onClick={onClose}>Entendi, começar</button>
      </div>
    </section>
  );
}

function AchievementPanel({ stats, onClose }) {
  const unlocked = achievementRules.filter((rule) => rule.test(stats));

  return (
    <section className="product-modal-overlay" aria-label="Conquistas Logic Quest">
      <div className="achievement-card">
        <button className="product-close" type="button" onClick={onClose}>×</button>
        <span className="panel-caption">CONQUISTAS</span>
        <h2>Seu progresso virou medalha.</h2>
        <div className="achievement-grid">
          {achievementRules.map((rule) => {
            const active = unlocked.some((item) => item.id === rule.id);
            return (
              <article key={rule.id} className={active ? "unlocked" : "locked"}>
                <strong>{active ? "◆" : "◇"}</strong>
                <span>{rule.title}</span>
                <small>{rule.text}</small>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CertificateModal({ stats, onClose }) {
  const session = readLocalSession();
  const name = session?.user?.email?.split("@")[0] || "Aluno Logic Quest";
  const completed = stats.completed >= lessonsTotal;

  return (
    <section className="product-modal-overlay" aria-label="Certificado Logic Quest">
      <div className="certificate-card">
        <button className="product-close" type="button" onClick={onClose}>×</button>
        <span>Certificado Logic Quest</span>
        <h2>{completed ? "Trilha concluída" : "Certificado em preparação"}</h2>
        <p>Concedido a</p>
        <strong>{name}</strong>
        <small>
          {completed
            ? `Fundamentos de Lógica • ${stats.xp} XP • ${stats.mastery}% domínio médio`
            : `Complete ${lessonsTotal - stats.completed} lições restantes para liberar o certificado final.`}
        </small>
        <button type="button" onClick={() => window.print()}>Imprimir / salvar PDF</button>
      </div>
    </section>
  );
}

export default function ProductLayer() {
  const [mounted, setMounted] = useState(false);
  const [statsTick, setStatsTick] = useState(0);
  const [modal, setModal] = useState(null);
  const stats = useMemo(() => getStats(), [statsTick]);

  useEffect(() => {
    setMounted(true);
    if (!safeGetItem(onboardingKey)) {
      setModal("landing");
    }
  }, []);

  function closeIntro() {
    safeSetItem(onboardingKey, "true");
    setModal(null);
  }

  function openPlayground() {
    closeIntro();
    window.setTimeout(() => document.querySelector(".playground-top-button")?.click(), 50);
  }

  function refreshStatsAndOpen(nextModal) {
    setStatsTick((value) => value + 1);
    setModal(nextModal);
  }

  if (!mounted) return null;

  return (
    <>
      <div className="product-floating-actions">
        <button type="button" onClick={() => setModal("onboarding")}>Guia</button>
        <button type="button" onClick={() => refreshStatsAndOpen("achievements")}>Conquistas</button>
        <button type="button" onClick={() => refreshStatsAndOpen("certificate")}>Certificado</button>
      </div>

      {modal === "landing" ? createPortal(<LandingModal onClose={closeIntro} onOpenPlayground={openPlayground} />, document.body) : null}
      {modal === "onboarding" ? createPortal(<OnboardingModal onClose={closeIntro} />, document.body) : null}
      {modal === "achievements" ? createPortal(<AchievementPanel stats={stats} onClose={() => setModal(null)} />, document.body) : null}
      {modal === "certificate" ? createPortal(<CertificateModal stats={stats} onClose={() => setModal(null)} />, document.body) : null}
    </>
  );
}
