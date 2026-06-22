import "./mobileDock.css";
import "./mimoMobile.css";

function scrollToSelector(selector) {
  const element = document.querySelector(selector);
  if (!element) return;
  element.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function MobileDock() {
  return (
    <nav className="mobile-study-dock" aria-label="Navegação mobile Logic Quest">
      <button type="button" onClick={() => scrollToSelector(".titlebar")}>Início</button>
      <button type="button" onClick={() => scrollToSelector(".explorer-panel")}>Lições</button>
      <button type="button" onClick={() => document.querySelector(".playground-top-button")?.click()}>Praticar</button>
      <button type="button" onClick={() => document.querySelector(".account-trigger")?.click()}>Conta</button>
    </nav>
  );
}
