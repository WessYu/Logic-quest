import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import MobileDock from "./MobileDock";
import "./playground.css";

const challenges = [
  {
    id: "condition",
    label: "Condição",
    file: "condicao.js",
    description: "Crie uma variável idade. Se idade for maior ou igual a 18, mostre Pode entrar.",
    code: `const idade = 18;

if (idade >= 18) {
  console.log("Pode entrar");
} else {
  console.log("Entrada negada");
}`,
    validate: ({ code, output }) => [
      { ok: /\b(const|let|var)\s+idade\b/.test(code), label: "tem uma variável chamada idade" },
      { ok: /if\s*\(/.test(code), label: "usa uma condição if" },
      { ok: output.some((line) => line.includes("Pode entrar")), label: "mostra a saída esperada" },
    ],
  },
  {
    id: "loop",
    label: "Repetição",
    file: "repeticao.js",
    description: "Use uma repetição para mostrar Passo 1 até Passo 5 no terminal.",
    code: `for (let passo = 1; passo <= 5; passo++) {
  console.log("Passo " + passo);
}`,
    validate: ({ code, output }) => [
      { ok: /for\s*\(|while\s*\(/.test(code), label: "usa for ou while" },
      { ok: output.includes("Passo 1"), label: "mostra Passo 1" },
      { ok: output.includes("Passo 5"), label: "mostra Passo 5" },
    ],
  },
  {
    id: "function",
    label: "Função",
    file: "funcao.js",
    description: "Crie uma função calcularDobro que receba um número e retorne o dobro.",
    code: `function calcularDobro(numero) {
  return numero * 2;
}

console.log(calcularDobro(6));`,
    validate: ({ code, output }) => [
      { ok: /function\s+calcularDobro/.test(code) || /const\s+calcularDobro\s*=/.test(code), label: "cria calcularDobro" },
      { ok: /return\s+/.test(code), label: "usa return" },
      { ok: output.includes("12"), label: "retorna o dobro de 6" },
    ],
  },
];

function runUserCode(source) {
  const logs = [];
  const fakeConsole = {
    log: (...items) => logs.push(items.map(String).join(" ")),
    warn: (...items) => logs.push(`Aviso: ${items.map(String).join(" ")}`),
    error: (...items) => logs.push(`Erro: ${items.map(String).join(" ")}`),
  };

  const runner = new Function("console", `"use strict";\n${source}`);
  const returned = runner(fakeConsole);

  if (returned !== undefined) {
    logs.push(String(returned));
  }

  return logs;
}

export default function Playground() {
  const [mountNode, setMountNode] = useState(null);
  const [open, setOpen] = useState(false);
  const [activeChallengeId, setActiveChallengeId] = useState("condition");
  const activeChallenge = challenges.find((challenge) => challenge.id === activeChallengeId) ?? challenges[0];
  const [code, setCode] = useState(activeChallenge.code);
  const [result, setResult] = useState({ status: "idle", lines: ["Clique em Executar para testar seu código."], checks: [] });

  useEffect(() => {
    const slot = document.createElement("span");
    slot.className = "playground-titlebar-slot";

    const attach = () => {
      const target = document.querySelector(".titlebar-right");
      if (!target || slot.isConnected) return;
      target.prepend(slot);
      setMountNode(slot);
    };

    attach();

    const root = document.getElementById("root");
    const observer = new MutationObserver(attach);
    if (root) observer.observe(root, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      slot.remove();
    };
  }, []);

  const lineNumbers = useMemo(() => code.split("\n").map((_, index) => index + 1), [code]);

  function selectChallenge(challenge) {
    setActiveChallengeId(challenge.id);
    setCode(challenge.code);
    setResult({ status: "idle", lines: [`Desafio carregado: ${challenge.label}`], checks: [] });
  }

  function executeCode() {
    try {
      const lines = runUserCode(code);
      const checks = activeChallenge.validate({ code, output: lines });
      const passed = checks.every((check) => check.ok);

      setResult({
        status: passed ? "success" : "warning",
        lines: lines.length ? lines : ["O código executou, mas não mostrou saída no console.log."],
        checks,
      });
    } catch (error) {
      setResult({
        status: "error",
        lines: [`Não funcionou ainda: ${error.message}`],
        checks: [],
      });
    }
  }

  const button = (
    <button className="playground-top-button" type="button" onClick={() => setOpen(true)}>
      Playground
    </button>
  );

  return (
    <>
      <MobileDock />
      {mountNode ? createPortal(button, mountNode) : null}

      {open ? createPortal(
        <section className="playground-overlay" aria-label="Playground de código">
          <div className="playground-window">
            <header className="playground-header">
              <div className="playground-traffic" aria-hidden="true">
                <span className="red" />
                <span className="yellow" />
                <span className="green" />
              </div>
              <div>
                <span className="panel-caption">LOGIC QUEST PLAYGROUND</span>
                <h2>Teste códigos simples do curso</h2>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Fechar playground">×</button>
            </header>

            <div className="playground-layout">
              <aside className="playground-sidebar">
                <span className="panel-caption">DESAFIOS</span>
                {challenges.map((challenge) => (
                  <button
                    key={challenge.id}
                    type="button"
                    className={challenge.id === activeChallengeId ? "active" : ""}
                    onClick={() => selectChallenge(challenge)}
                  >
                    <strong>{challenge.label}</strong>
                    <small>{challenge.file}</small>
                  </button>
                ))}
              </aside>

              <main className="playground-editor-shell">
                <div className="playground-tabs">
                  <span className="active">{activeChallenge.file}</span>
                  <button type="button" onClick={executeCode}>Executar</button>
                </div>

                <div className="playground-challenge">
                  <strong>Desafio atual</strong>
                  <span>{activeChallenge.description}</span>
                </div>

                <div className="playground-editor">
                  <div className="playground-lines" aria-hidden="true">
                    {lineNumbers.map((line) => <span key={line}>{line}</span>)}
                  </div>
                  <textarea
                    value={code}
                    onChange={(event) => setCode(event.target.value)}
                    spellCheck="false"
                    aria-label="Editor de código JavaScript"
                  />
                </div>
              </main>

              <aside className={`playground-terminal ${result.status}`}>
                <div className="terminal-title">
                  <span>TERMINAL</span>
                  <strong>{result.status === "success" ? "Funcionou" : result.status === "error" ? "Revisar" : result.status === "warning" ? "Quase" : "Aguardando"}</strong>
                </div>
                <div className="terminal-output">
                  {result.lines.map((line, index) => (
                    <p key={`${line}-${index}`}>
                      <span>$</span> {line}
                    </p>
                  ))}
                </div>

                {result.checks.length ? (
                  <div className="playground-checks">
                    <span className="panel-caption">VALIDAÇÃO</span>
                    {result.checks.map((check) => (
                      <div key={check.label} className={check.ok ? "ok" : "bad"}>
                        <strong>{check.ok ? "✓" : "×"}</strong>
                        <span>{check.label}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </aside>
            </div>
          </div>
        </section>,
        document.body,
      ) : null}
    </>
  );
}
