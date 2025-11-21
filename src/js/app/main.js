import { btnUndo, btnRedo, palette } from "./domElements.js";
import { setupEvents } from "./events.js";
import { createHistoryManager } from "../core/historyManager.js";
import { createColorColumn, restorePaletteState } from "../domain/cardManager.js";
import { applyTheme } from "../ui/views.js";

export const history = createHistoryManager([], {
  onChange: (state) => restorePaletteState(state),
  onStackChange: ({ canUndo, canRedo }) => {
    btnUndo.disabled = !canUndo;
    btnRedo.disabled = !canRedo;
  },
});

document.addEventListener("DOMContentLoaded", () => {
  setupEvents();
  applyTheme("sistema");
  while (palette.children.length < 3) {
    createColorColumn();
  }
  document.getElementById("js-btn-new-card").focus();
});
