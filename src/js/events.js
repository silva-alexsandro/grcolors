import { newCard, btnGeneratorColors, btnUndo, btnRedo } from './domElements.js';
import { createCard, generatePalette } from './cardManager.js';
import { history } from './main.js';

export function setupEvents() {
  newCard.addEventListener('click', createCard);
  btnGeneratorColors.addEventListener('click', generatePalette);

  window.addEventListener('keydown', e => {
    if (e.key === ' ') {
      e.preventDefault();
      generatePalette();
      btnGeneratorColors.classList.add('active');
      setTimeout(() => btnGeneratorColors.classList.remove('active'), 150);
    }
  });

  btnUndo.addEventListener('click', () => history.undo());
  btnRedo.addEventListener('click', () => history.redo());
}
