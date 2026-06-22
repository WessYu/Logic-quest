import { useEffect } from "react";

export default function ExplorerAutoClose() {
  useEffect(() => {
    const closeInitialExplorerState = () => {
      const sectionButtons = Array.from(document.querySelectorAll(".section-toggle"));
      const openEditorsButton = sectionButtons.find((button) => button.textContent?.includes("OPEN EDITORS"));

      if (openEditorsButton?.textContent?.includes("▾") && !openEditorsButton.dataset.autoClosed) {
        openEditorsButton.dataset.autoClosed = "true";
        openEditorsButton.click();
      }

      const moduleButtons = Array.from(document.querySelectorAll(".module-heading"));
      moduleButtons.forEach((button) => {
        const isExpanded = button.textContent?.includes("▾");
        if (isExpanded && !button.dataset.autoCollapsed) {
          button.dataset.autoCollapsed = "true";
          button.click();
        }
      });
    };

    const timers = [120, 420, 900].map((delay) => window.setTimeout(closeInitialExplorerState, delay));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  return null;
}
