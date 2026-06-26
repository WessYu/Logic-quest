import { useState } from "react";
import LogicBot3D from "./LogicBot3D";
import "./robotMascot.css";

export default function RobotMascot() {
  const [isActive, setIsActive] = useState(false);

  return (
    <aside className={`robot-mascot ${isActive ? "active" : ""}`} aria-label="Mascote 3D Logic Quest">
      <button
        type="button"
        className="robot-mascot-button"
        onClick={() => setIsActive((current) => !current)}
        aria-label="Girar Logic Bot 3D"
      >
        <LogicBot3D compact />
      </button>
    </aside>
  );
}
