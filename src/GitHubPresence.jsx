import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { readLocalProgress, readLocalSession } from "./supabaseRest";
import "./githubPresence.css";

const weekDays = ["Mon", "Wed", "Fri"];

function toDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getMonthLabel(date) {
  return new Intl.DateTimeFormat("pt-BR", { month: "short" })
    .format(date)
    .replace(".", "")
    .replace(/^./, (letter) => letter.toUpperCase());
}

function readStudyActivity() {
  const progress = readLocalProgress();
  const activity = {};

  Object.values(progress || {}).forEach((lesson) => {
    if (!lesson?.completedAt) return;

    const date = new Date(lesson.completedAt);
    if (Number.isNaN(date.getTime())) return;

    const key = toDateKey(date);
    activity[key] = (activity[key] || 0) + 1;
  });

  return activity;
}

function buildPresence(activity) {
  const today = startOfDay(new Date());
  const start = new Date(today);
  start.setDate(today.getDate() - 363);
  start.setDate(start.getDate() - start.getDay());

  const cells = Array.from({ length: 52 * 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const key = toDateKey(date);
    const count = activity[key] || 0;

    return {
      id: key,
      date,
      count,
      level: count >= 4 ? 4 : count,
    };
  });

  const monthLabels = [];
  let lastMonth = "";

  for (let weekIndex = 0; weekIndex < 52; weekIndex += 1) {
    const cell = cells[weekIndex * 7];
    const month = getMonthLabel(cell.date);
    const shouldShow = month !== lastMonth;
    monthLabels.push({ id: `${cell.id}-${month}`, label: shouldShow ? month : "" });
    if (shouldShow) lastMonth = month;
  }

  const activeDays = Object.values(activity).filter(Boolean).length;
  const totalLessons = Object.values(activity).reduce((sum, count) => sum + count, 0);

  return { cells, monthLabels, activeDays, totalLessons };
}

function getUserLabel() {
  const session = readLocalSession();
  return session?.user?.email || "Visitante";
}

export default function GitHubPresence() {
  const [mountNode, setMountNode] = useState(null);
  const [activity, setActivity] = useState(() => readStudyActivity());
  const [userLabel, setUserLabel] = useState(() => getUserLabel());

  const presence = useMemo(() => buildPresence(activity), [activity]);

  useEffect(() => {
    const syncPresence = () => {
      setActivity(readStudyActivity());
      setUserLabel(getUserLabel());
    };

    const timer = window.setInterval(syncPresence, 2500);
    window.addEventListener("focus", syncPresence);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", syncPresence);
    };
  }, []);

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
    <section className="github-presence-card" aria-label="Presença de estudo vinculada à conta">
      <div className="github-presence-header">
        <div>
          <span className="panel-caption">Study Presence</span>
          <h2>Presença de evolução</h2>
          <p>Atividade real da trilha salva na conta: cada quadrado representa lições concluídas naquele dia.</p>
        </div>
        <span className="github-presence-user">{userLabel}</span>
      </div>

      <div className="github-presence-board">
        <div className="github-months" aria-hidden="true">
          {presence.monthLabels.map((month) => (
            <span key={month.id}>{month.label}</span>
          ))}
        </div>

        <div className="github-grid-wrap">
          <div className="github-weekdays" aria-hidden="true">
            {weekDays.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          <div className="github-contribution-grid">
            {presence.cells.map((cell) => (
              <span
                key={cell.id}
                className={`github-cell level-${cell.level}`}
                title={`${cell.count} lição(ões) concluída(s) em ${cell.date.toLocaleDateString("pt-BR")}`}
                aria-label={`${cell.count} lição(ões) concluída(s) em ${cell.date.toLocaleDateString("pt-BR")}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="github-presence-footer">
        <span>
          {presence.activeDays} dia(s) com estudo • {presence.totalLessons} lição(ões) concluída(s)
        </span>
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
