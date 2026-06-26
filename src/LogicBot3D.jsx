import { useEffect, useRef, useState } from "react";
import "./logicBot3D.css";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const lerp = (start, end, amount) => start + (end - start) * amount;

export default function LogicBot3D({ compact = false }) {
  const rootRef = useRef(null);
  const frameRef = useRef(null);
  const currentLook = useRef({ x: 0, y: 0, energy: 0 });
  const targetLook = useRef({ x: 0, y: 0, energy: 0 });
  const [isTurned, setIsTurned] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (prefersReducedMotion) return undefined;

    function updateTarget(event) {
      const rect = root.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = event.clientX - centerX;
      const deltaY = event.clientY - centerY;
      const distance = Math.hypot(deltaX, deltaY);
      const curiosity = clamp(1 - distance / 560, 0, 1);

      targetLook.current = {
        x: clamp(deltaX / 180, -1, 1) * curiosity,
        y: clamp(deltaY / 180, -1, 1) * curiosity,
        energy: curiosity,
      };
    }

    function animate() {
      const current = currentLook.current;
      const target = targetLook.current;
      current.x = lerp(current.x, target.x, 0.105);
      current.y = lerp(current.y, target.y, 0.105);
      current.energy = lerp(current.energy, target.energy, 0.09);

      root.style.setProperty("--bot-rotate-x", `${8 - current.y * 5}deg`);
      root.style.setProperty("--bot-rotate-y", `${current.x * 18}deg`);
      root.style.setProperty("--bot-roll", `${current.x * -3.6}deg`);
      root.style.setProperty("--bot-lift", `${current.energy * -7}px`);
      root.style.setProperty("--head-rotate-x", `${current.y * -8}deg`);
      root.style.setProperty("--head-rotate-y", `${current.x * 11}deg`);
      root.style.setProperty("--head-tilt", `${current.x * 4}deg`);
      root.style.setProperty("--eye-x", `${current.x * 5}px`);
      root.style.setProperty("--eye-y", `${current.y * 3}px`);
      root.style.setProperty("--smile-x", `${current.x * 2}px`);
      root.style.setProperty("--smile-y", `${current.y * 1.4}px`);
      root.style.setProperty("--glow-x", `${current.x * 12}px`);
      root.style.setProperty("--glow-y", `${current.y * 8}px`);
      root.style.setProperty("--arm-sway", `${current.x * 7}deg`);
      root.style.setProperty("--curiosity", current.energy.toFixed(3));

      frameRef.current = window.requestAnimationFrame(animate);
    }

    window.addEventListener("pointermove", updateTarget, { passive: true });
    frameRef.current = window.requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("pointermove", updateTarget);
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <button
      ref={rootRef}
      type="button"
      className={`logic-bot-3d ${compact ? "compact" : ""} ${isTurned ? "turned" : ""}`}
      onClick={() => setIsTurned((current) => !current)}
      aria-label="Girar mascote 3D Logic Bot"
    >
      <span className="logic-bot-glow" aria-hidden="true" />

      <span className="logic-bot-scene" aria-hidden="true">
        <span className="logic-bot-model">
          <span className="logic-bot-antenna">
            <span />
          </span>

          <span className="logic-bot-head">
            <span className="logic-bot-side left" />
            <span className="logic-bot-side right" />
            <span className="logic-bot-face">
              <span className="logic-bot-eye left" />
              <span className="logic-bot-eye right" />
              <span className="logic-bot-smile" />
              <span className="logic-bot-corner top-left" />
              <span className="logic-bot-corner top-right" />
              <span className="logic-bot-corner bottom-left" />
              <span className="logic-bot-corner bottom-right" />
            </span>
          </span>

          <span className="logic-bot-body">
            <span className="logic-bot-chest">&lt;/&gt;</span>
          </span>

          <span className="logic-bot-arm left">
            <span />
          </span>
          <span className="logic-bot-arm right">
            <span />
          </span>

          <span className="logic-bot-leg left" />
          <span className="logic-bot-leg right" />
        </span>
      </span>
    </button>
  );
}
