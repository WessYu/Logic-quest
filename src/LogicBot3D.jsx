import { useState } from "react";
import "./logicBot3D.css";

export default function LogicBot3D({ compact = false }) {
  const [isTurned, setIsTurned] = useState(false);

  return (
    <button
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
