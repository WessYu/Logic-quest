import { useEffect, useState } from "react";
import "./splashScreen.css";

const splashSeenKey = "logic-quest-splash-seen-v2";

export default function SplashScreen() {
  const [visible, setVisible] = useState(() => window.sessionStorage.getItem(splashSeenKey) !== "true");
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!visible) return undefined;

    const leaveTimer = window.setTimeout(() => setLeaving(true), 900);
    const removeTimer = window.setTimeout(() => {
      window.sessionStorage.setItem(splashSeenKey, "true");
      setVisible(false);
    }, 1250);

    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(removeTimer);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <section className={`splash-screen ${leaving ? "is-leaving" : ""}`} aria-label="Carregando Logic Quest">
      <div className="splash-brand">
        <div className="splash-mark" aria-hidden="true">
          <strong>LQ</strong>
          <span className="splash-cursor" />
        </div>

        <div className="splash-copy">
          <span>Logic Quest</span>
          <p>iniciando trilha</p>
        </div>
      </div>
    </section>
  );
}
