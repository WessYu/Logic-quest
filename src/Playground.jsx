import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import "./playground.css";

const starterCode = `// Playground Logic Quest
// Use console.log() para testar ideias simples do curso.

const idade = 18;
const temPermissao = idade >= 18;

if (temPermissao) {
  console.log("Pode continuar");
} else {
  console.log("Precisa revisar a regra");
}`;

const templates = [
  {
    id: "condition",
    label: "Condição",
    code: `const nota = 8;

if (nota >= 7) {
  console.log("Aprovado");
} else {
  console.log("Revisar conteúdo");
}`,
  },
  {
    id: "loop",
    label: "Repetição",
    code: `for (let passo = 1; passo <= 5; passo++) {
  console.log("Passo " + passo);
}`,
  },
  {
    id: "function",
    label: "Função",
    code: `function calcularDobro(numero) {
  return numero * 2;
}

console.log(calcularDobro(6));`,
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
  const [code, setCode] = useState(starterCode);
  const [result, setResult] = useState({ status: "idle", lines: ["Clique em Executar para testar seu código."] });

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

    const observer = new MutationObserver(attach);
    observer.observe(document.getElementById("root"), { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      slot.remove();
    };
  }, []);

  const lineNumbers = useMemo(() => code.split("\n").map((_, index) => index + 1), [code]);

  function executeCode() {
    try {
      const lines = runUserCode(code);
      setResult({
        status: "success",
        lines: lines.length ? lines : ["Funcionou: o código executou sem erros, mas não mostrou saída."],
      });
    } catch (error) {
      setResult({
        status: "error",
        lines: [`Não funcionou ainda: ${error.message}`],
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
                <span className="panel-caption">SNIPPETS</span>
                {templates.map((template) => (
                  <button key={template.id} type="button" onClick={() => setCode(template.code)}>
                    <strong>{template.label}</strong>
                    <small>{template.id}.js</small>
                  </button>
                ))}
              </aside>

              <main className="playground-editor-shell">
                <div className="playground-tabs">
                  <span className="active">playground.js</span>
                  <button type="button" onClick={executeCode}>Executar</button>
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
                  <strong>{result.status === "success" ? "Funcionou" : result.status === "error" ? "Revisar" : "Aguardando"}</strong>
                </div>
                <div className="terminal-output">
                  {result.lines.map((line, index) => (
                    <p key={`${line}-${index}`}>
                      <span>$</span> {line}
                    </p>
                  ))}
                </div>
              </aside>
            </div>
          </div>
        </section>,
        document.body,
      ) : null}
    </>
  );
}
