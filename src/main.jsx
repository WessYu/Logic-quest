import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import GitHubPresence from "./GitHubPresence";
import AccountManager from "./AccountManager";
import PwaInstallPrompt from "./PwaInstallPrompt";
import StudentProfile from "./StudentProfile";
import RegisterServiceWorker from "./RegisterServiceWorker";
import "./styles.css";
import "./stepAlignment.css";
import "./compactLayout.css";
import "./lessonReadability.css";
import "./sidebarPolish.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <GitHubPresence />
    <AccountManager />
    <PwaInstallPrompt />
    <StudentProfile />
    <RegisterServiceWorker />
  </React.StrictMode>,
);
