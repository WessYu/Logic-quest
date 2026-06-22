import { useEffect } from "react";

export default function ExplorerAutoClose() {
  useEffect(() => {
    const closeOpenEditors = () => {
      const buttons = Array.from(document.querySelectorAll(".section-toggle"));
      const openEditorsButton = buttons.find((button) => button.textContent?.includes("OPEN EDITORS"));

      if (!openEditorsButton) return;
      const isExpanded = openEditorsButton.textContent?.includes("▾");

      if (isExpanded && !openEditorsButton.dataset.autoClosed) {
        openEditorsButton.dataset.autoClosed = "true";
        openEditorsButton.click();
      }
    };

    const timeout = window.setTimeout(closeOpenEditors, 250);
    return () => window.clearTimeout(timeout);
  }, []);

  return null;
}
