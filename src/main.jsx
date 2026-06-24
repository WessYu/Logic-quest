import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import GitHubPresence from "./GitHubPresence";
import AccountManager from "./AccountManager";
import PwaInstallPrompt from "./PwaInstallPrompt";
import StudentProfile from "./StudentProfile";
import AboutLogicQuest from "./AboutLogicQuest";
import Playground from "./Playground";
import ExplorerAutoClose from "./ExplorerAutoClose";
import RegisterServiceWorker from "./RegisterServiceWorker";
import MobileDock from "./MobileDock";
import LogicQuestEnhancements from "./LogicQuestEnhancements";
import "./styles.css";
import "./stepAlignment.css";
import "./compactLayout.css";
import "./lessonReadability.css";
import "./sidebarPolish.css";
import "./mobilePolish.css";
import "./finalMobilePolish.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <GitHubPresence />
    <AccountManager />
    <PwaInstallPrompt />
    <StudentProfile />
    <AboutLogicQuest />
    <Playground />
    <ExplorerAutoClose />
    <RegisterServiceWorker />
    <LogicQuestEnhancements />
    <MobileDock />
  </React.StrictMode>,
);
