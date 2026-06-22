import { useEffect } from "react";

export default function ExplorerAutoClose() {
  useEffect(() => {
    const closeInitialExplorerState = () => {
      const sectionButtons = Array.from(document.querySelectorAll(".section-toggle"));
      const openEditorsButton = sectionButtons.find((button) => button.textContent?.includes("OPEN EDITORS"));
      const modulesButton = sectionButtons.find((button) => button.textContent?.includes("MODULES"));

      [openEditorsButton, modulesButton].forEach((button) => {
        const expanded = button?.querySelector("span")?.textContent === "▾";
        if (expanded && !button.dataset.autoClosed) {
          button.dataset.autoClosed = "true";
          button.click();
        }
      });

      const moduleButtons = Array.from(document.querySelectorAll(".module-heading"));
      moduleButtons.forEach((button) => {
        const expanded = button.querySelector("span")?.textContent === "▾";
        if (expanded && !button.dataset.autoCollapsed) {
          button.dataset.autoCollapsed = "true";
          button.click();
        }
      });
    };

    const timers = [80, 240, 520, 1000].map((delay) => window.setTimeout(closeInitialExplorerState, delay));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  return null;
}
