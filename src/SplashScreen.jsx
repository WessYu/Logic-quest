import { useEffect, useState } from "react";
import "./splashScreen.css";

const splashSeenKey = "logic-quest-splash-seen-v1";

export default function SplashScreen() {
  const [visible, setVisible] = useState(() => window.sessionStorage.getItem(splashSeenKey) !== "true");
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!visible) return undefined;

    const leaveTimer = window.setTimeout(() => setLeaving(true), 1550);
    const removeTimer = window.setTimeout(() => {
      window.sessionStorage.setItem(splashSeenKey, "true");
      setVisible(false);
    }, 2050);

    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(removeTimer);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <section className={`splash-screen ${leaving ? "is-leaving" : ""}`} aria-label="Carregando Logic Quest">
      <div className="splash-grid" aria-hidden="true" />
      <div className="splash-orb splash-orb-a" aria-hidden="true" />
      <div className="splash-orb splash-orb-b" aria-hidden="true" />

      <div className="splash-brand">
        <div className="splash-mark" aria-hidden="true">
          <span className="splash-corner top-left" />
          <span className="splash-corner top-right" />
          <strong>LQ</strong>
          <span className="splash-cursor" />
          <span className="splash-corner bottom-left" />
          <span className="splash-corner bottom-right" />
        </div>

        <div className="splash-copy">
          <span>booting learning path</span>
          <h1>Logic Quest</h1>
          <p>lógica de programação em uma trilha visual</p>
        </div>

        <div className="splash-loader" aria-hidden="true">
          <i />
        </div>
      </div>
    </section>
  );
}
