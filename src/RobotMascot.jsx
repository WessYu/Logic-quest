import { useEffect, useState } from "react";
import "./robotMascot.css";

const robotSrc = `${import.meta.env.BASE_URL}mascots/logic_quest_mascote_3_cube_robot.glb`;

export default function RobotMascot() {
  const [spinSeed, setSpinSeed] = useState(0);

  useEffect(() => {
    import("@google/model-viewer");
  }, []);

  function spinRobot() {
    setSpinSeed((value) => value + 1);
  }

  return (
    <aside className="robot-mascot" aria-label="Mascote Logic Quest">
      <button type="button" className="robot-mascot-button" onClick={spinRobot}>
        <span className="robot-mascot-stage">
          <model-viewer
            key={spinSeed}
            className={`robot-mascot-model ${spinSeed ? "spin" : ""}`}
            src={robotSrc}
            alt="Mascote robô do Logic Quest"
            camera-orbit="30deg 70deg 3.1m"
            field-of-view="32deg"
            interaction-prompt="none"
            shadow-intensity="0.55"
            exposure="1"
            autoplay
          >
            <span className="robot-mascot-fallback">LQ</span>
          </model-viewer>
        </span>
        <span className="robot-mascot-copy">
          <strong>Logic Bot</strong>
          <small>Clique para girar</small>
        </span>
      </button>
    </aside>
  );
}
