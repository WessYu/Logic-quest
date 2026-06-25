import { useMemo, useState } from "react";
import "./mobileDock.css";
import "./mimoMobile.css";
import "./mobileEmergencyFix.css";
import "./mimoAppLayout.css";

function scrollToSelector(selector) {
  const element = document.querySelector(selector);
  if (!element) return;
  element.scrollIntoView({ behavior: "smooth", block: "start" });
}

const tabs = [
  {
    id: "home",
    label: "Início",
    icon: "⌂",
    title: "Voltar ao início",
    description: "README, progresso e visão geral da trilha.",
    action: () => scrollToSelector(".titlebar"),
  },
  {
    id: "lessons",
    label: "Lições",
    icon: "◉",
    title: "Abrir lições",
    description: "Explorer com módulos, aulas e arquivos abertos.",
    action: () => scrollToSelector(".explorer-panel"),
  },
  {
    id: "practice",
    label: "Praticar",
    icon: "⌘",
    title: "Modo prática",
    description: "Playground e exercícios para testar lógica.",
    action: () => document.querySelector(".playground-top-button")?.click(),
  },
  {
    id: "account",
    label: "Conta",
    icon: "○",
    title: "Sua conta",
    description: "Perfil, progresso salvo e preferências.",
    action: () => document.querySelector(".account-trigger")?.click(),
  },
];

export default function MobileDock() {
  const [activeTab, setActiveTab] = useState("home");
  const activeIndex = Math.max(
    tabs.findIndex((tab) => tab.id === activeTab),
    0,
  );
  const active = useMemo(() => tabs[activeIndex] ?? tabs[0], [activeIndex]);

  function handleTabClick(tab) {
    setActiveTab(tab.id);
    tab.action();
  }

  return (
    <nav
      className="mobile-study-dock motion-tabs"
      style={{ "--active-index": activeIndex }}
      aria-label="Navegação mobile Logic Quest"
    >
      <div className="motion-tab-popup" aria-live="polite">
        <span className="motion-popup-icon">{active.icon}</span>
        <div>
          <strong>{active.title}</strong>
          <small>{active.description}</small>
        </div>
      </div>

      <div className="motion-tab-bar">
        <span className="motion-tab-indicator" aria-hidden="true" />
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`motion-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => handleTabClick(tab)}
          >
            <span className="motion-tab-icon">{tab.icon}</span>
            <span className="motion-tab-label">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
