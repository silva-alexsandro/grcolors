import {
  newCard,
  btnGeneratorColors,
  btnUndo,
  btnRedo,
  btnConfig,
  form,
  btnInfo,
  blockInfo,
} from "./domElements.js";
import { createColorColumn, generatePalette } from "../domain/cardManager.js";
import { handleModal } from "../ui/handleModal.js";
import { history } from "./main.js";
import { toggleFullscreen, togglePaletteGap, applyTheme } from "../ui/views.js";

function getInputValue(input) {
  return input.type === "checkbox" ? input.checked : input.value;
}

export function setupEvents() {
  newCard.addEventListener("click", createColorColumn);
  btnGeneratorColors.addEventListener("click", generatePalette);
  window.addEventListener("keydown", (e) => {
    if (e.key === " ") {
      e.preventDefault();
      generatePalette();
    }
  });

  // Botao para desfazer
  btnUndo.addEventListener("click", () => history.undo());
  btnRedo.addEventListener("click", () => history.redo());

  //informationa
  btnInfo.addEventListener("click", () => {
  blockInfo.classList.toggle("active");
  document.body.classList.toggle("info-open");
});

  // Modal e Forms de configuração
  btnConfig.addEventListener("click", handleModal);
  form.addEventListener("change", (event) => {
    const { name } = event.target;
    const value = getInputValue(event.target);

    switch (name) {
      case "fullmode":
        toggleFullscreen(value);
        break;
      case "gapColumns":
        togglePaletteGap(value);
        break;
      case "theme":
        applyTheme(value);
        break;
    }
  });
}
