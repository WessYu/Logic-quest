import { useEffect, useMemo, useState } from "react";
import "./pwaInstallPrompt.css";

const dismissedKey = "logic-quest-install-dismissed";

function isStandaloneMode() {
  return window.matchMedia?.("(display-mode: standalone)")?.matches || window.navigator.standalone === true;
}

function isIosDevice() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

export default function PwaInstallPrompt() {
  const [installEvent, setInstallEvent] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const isIos = useMemo(() => isIosDevice(), []);

  useEffect(() => {
    const dismissed = window.localStorage.getItem(dismissedKey) === "true";
    const standalone = isStandaloneMode();

    setIsInstalled(standalone);

    if (!dismissed && !standalone && isIos) {
      setIsVisible(true);
    }

    function handleBeforeInstallPrompt(event) {
      event.preventDefault();
      setInstallEvent(event);
      if (!dismissed && !isStandaloneMode()) {
        setIsVisible(true);
      }
    }

    function handleInstalled() {
      setIsInstalled(true);
      setIsVisible(false);
      window.localStorage.setItem(dismissedKey, "true");
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, [isIos]);

  async function installApp() {
    if (!installEvent) return;

    installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
    setIsVisible(false);
  }

  function dismiss() {
    window.localStorage.setItem(dismissedKey, "true");
    setIsVisible(false);
  }

  if (!isVisible || isInstalled) return null;

  return (
    <aside className="pwa-install-card" aria-label="Instalar Logic Quest">
      <div className="pwa-install-icon">LQ</div>
      <div className="pwa-install-copy">
        <strong>Instalar Logic Quest</strong>
        {installEvent ? (
          <span>Use como app no Android, com tela cheia e acesso rápido.</span>
        ) : (
          <span>No iPhone: toque em Compartilhar e depois em Adicionar à Tela de Início.</span>
        )}
      </div>
      <div className="pwa-install-actions">
        {installEvent ? (
          <button type="button" onClick={installApp}>Instalar</button>
        ) : null}
        <button type="button" className="ghost" onClick={dismiss}>Depois</button>
      </div>
    </aside>
  );
}
