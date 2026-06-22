import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "./aboutLogicQuest.css";

const creator = {
  name: "Wess Yu",
  role: "Front-end Developer Junior & Designer",
  github: "WessYu",
  githubUrl: "https://github.com/WessYu",
  repoUrl: "https://github.com/WessYu/Logic-quest",
};

function AboutModal({ onClose }) {
  return createPortal(
    <section className="about-modal-overlay" aria-label="Sobre o Logic Quest">
      <article className="about-modal-card">
        <button className="about-close" type="button" onClick={onClose} aria-label="Fechar sobre">
          ×
        </button>

        <header className="about-hero">
          <span className="panel-caption">SOBRE O PROJETO</span>
          <h2>Programação precisa parecer possível.</h2>
          <p>
            O Logic Quest nasceu para distribuir o conhecimento da programação de um jeito mais acessível,
            cotidiano e menos intimidador. A ideia é transformar lógica em prática real: observar problemas,
            quebrar em etapas, testar caminhos e evoluir um pouco todos os dias.
          </p>
        </header>

        <div className="about-grid">
          <section className="about-panel mission-panel">
            <span className="panel-caption">MISSÃO</span>
            <h3>Conhecimento técnico sem distância.</h3>
            <p>
              Muita gente trava antes mesmo de começar porque programação parece distante, formal demais ou cheia
              de palavras difíceis. Este projeto tenta aproximar esse aprendizado do dia a dia: decisões, fluxos,
              tentativas, erros, revisão e consistência.
            </p>
            <p>
              Mais do que decorar comandos, o objetivo é ensinar a pensar como dev: entender entrada, processo,
              saída, condição, repetição, organização e clareza.
            </p>
          </section>

          <section className="about-panel creator-panel">
            <span className="panel-caption">CRIADOR</span>
            <div className="creator-card">
              <img src={`${creator.githubUrl}.png?size=180`} alt="Avatar do GitHub de Wess Yu" />
              <div>
                <h3>{creator.name}</h3>
                <p>{creator.role}</p>
                <a href={creator.githubUrl} target="_blank" rel="noreferrer">
                  @{creator.github}
                </a>
              </div>
            </div>

            <div className="creator-links">
              <a href={creator.githubUrl} target="_blank" rel="noreferrer">GitHub do criador</a>
              <a href={creator.repoUrl} target="_blank" rel="noreferrer">Repositório do projeto</a>
            </div>
          </section>

          <section className="about-panel principles-panel">
            <span className="panel-caption">PRINCÍPIOS</span>
            <div className="principle-list">
              <div>
                <strong>Aprender no ritmo real</strong>
                <span>Lições curtas, checkpoint e progresso salvo para voltar depois.</span>
              </div>
              <div>
                <strong>Lógica antes de ferramenta</strong>
                <span>O foco é raciocínio, não só sintaxe ou decorar código.</span>
              </div>
              <div>
                <strong>Constância visível</strong>
                <span>Frequência, score e evolução deixam o esforço concreto.</span>
              </div>
            </div>
          </section>
        </div>
      </article>
    </section>,
    document.body,
  );
}

export default function AboutLogicQuest() {
  const [mountNode, setMountNode] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const portalNode = document.createElement("span");
    portalNode.className = "about-statusbar-slot";

    const attachButton = () => {
      const statusbarLeft = document.querySelector(".statusbar-left");

      if (!statusbarLeft || portalNode.isConnected) return;

      statusbarLeft.appendChild(portalNode);
      setMountNode(portalNode);
    };

    attachButton();

    const observer = new MutationObserver(attachButton);
    observer.observe(document.getElementById("root"), {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      portalNode.remove();
    };
  }, []);

  return (
    <>
      {mountNode
        ? createPortal(
            <button className="about-statusbar-button" type="button" onClick={() => setOpen(true)}>
              Sobre
            </button>,
            mountNode,
          )
        : null}
      {open ? <AboutModal onClose={() => setOpen(false)} /> : null}
    </>
  );
}
