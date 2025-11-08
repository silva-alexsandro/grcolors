import {
  newCard,
  btnGeneratorColors,
  btnUndo,
  btnRedo,
  btnConfig,
  form,
  btnInfo,
  blockInfo
} from "./domElements.js";
import { history } from "./main.js";
import { createCard, generatePalette } from "../domain/cardManager.js";
import { handleModal } from "../ui/handleModal.js";
import { toggleFullscreen, togglePaletteGap, applyTheme } from "../ui/views.js";

function getInputValue(input) {
  return input.type === "checkbox" ? input.checked : input.value;
}

export function setupEvents() {
  // Botão para cores
  newCard.addEventListener("click", createCard);
  btnGeneratorColors.addEventListener("click", generatePalette);

  window.addEventListener("keydown", (e) => {
    if (e.key === " ") {
      e.preventDefault();
      generatePalette();
    }
  });

  //informationa
  btnInfo.addEventListener("click", () => {
    console.log('info')
    blockInfo.classList.toggle("active");
  });

  // Botao para desfazer
  btnUndo.addEventListener("click", () => history.undo());
  btnRedo.addEventListener("click", () => history.redo());

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
