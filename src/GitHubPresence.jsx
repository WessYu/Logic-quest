import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import "./githubPresence.css";

const months = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"];
const weekDays = ["Mon", "Wed", "Fri"];

function getContributionLevel(index) {
  const signal = (index * 17 + Math.floor(index / 7) * 11) % 23;
  const pulse = index % 29 === 0 || index % 31 === 0 || index % 47 === 0;
  const sprint = index > 192 && index < 230 && index % 4 !== 0;

  if (sprint) return signal > 14 ? 4 : signal > 8 ? 3 : 2;
  if (pulse) return signal > 15 ? 4 : 3;
  if (signal > 20) return 3;
  if (signal > 17) return 2;
  if (signal > 14) return 1;
  return 0;
}

export default function GitHubPresence() {
  const [mountNode, setMountNode] = useState(null);

  const cells = useMemo(
    () =>
      Array.from({ length: 52 * 7 }, (_, index) => ({
        id: `contribution-${index}`,
        level: getContributionLevel(index),
      })),
    [],
  );

  useEffect(() => {
    const portalNode = document.createElement("div");
    portalNode.className = "github-presence-mount";

    const attachPresence = () => {
      const overview = document.querySelector("#overview-section");

      if (!overview || portalNode.isConnected) return;

      overview.insertAdjacentElement("afterend", portalNode);
      setMountNode(portalNode);
    };

    attachPresence();

    const observer = new MutationObserver(attachPresence);
    observer.observe(document.getElementById("root"), {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      portalNode.remove();
    };
  }, []);

  if (!mountNode) return null;

  return createPortal(
    <section className="github-presence-card" aria-label="Presença GitHub">
      <div className="github-presence-header">
        <div>
          <span className="panel-caption">GitHub Presence</span>
          <h2>Presença de evolução</h2>
          <p>Ritmo visual de estudos, commits e progresso do Logic Quest.</p>
        </div>
        <a href="https://github.com/WessYu" target="_blank" rel="noreferrer">
          @WessYu
        </a>
      </div>

      <div className="github-presence-board">
        <div className="github-months" aria-hidden="true">
          {months.map((month) => (
            <span key={month}>{month}</span>
          ))}
        </div>

        <div className="github-grid-wrap">
          <div className="github-weekdays" aria-hidden="true">
            {weekDays.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          <div className="github-contribution-grid">
            {cells.map((cell) => (
              <span
                key={cell.id}
                className={`github-cell level-${cell.level}`}
                aria-label={`Nível de presença ${cell.level}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="github-presence-footer">
        <span>365 dias de consistência visual</span>
        <div className="github-legend" aria-label="Legenda de intensidade">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <i key={level} className={`github-cell level-${level}`} />
          ))}
          <span>More</span>
        </div>
      </div>
    </section>,
    mountNode,
  );
}
