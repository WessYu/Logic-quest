import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import GitHubPresence from "./GitHubPresence";
import AccountManager from "./AccountManager";
import "./styles.css";
import "./stepAlignment.css";
import "./compactLayout.css";
import "./lessonReadability.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <GitHubPresence />
    <AccountManager />
  </React.StrictMode>,
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {});
  });
}
