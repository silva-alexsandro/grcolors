import { palette, btnGeneratorColors } from './domElements.js';
import { generateRandomHex } from './colorUtils.js';
import { showColorOKLCH } from './variations.js';
import { history } from './main.js';

export function createCard() {
  if (palette.children.length >= 15) return;

  const randomHex = generateRandomHex();
  const li = document.createElement('li');
  li.classList.add('color-column', 'shadow');
  li.tabIndex = 0;
  li.setAttribute('aria-label', `Cor hexadecimal ${randomHex}`);
  li.style.backgroundColor = randomHex;
  li.innerHTML = `<span class="text">${randomHex}</span>`;

  li.addEventListener('click', () => copyColor(randomHex, li));
  li.addEventListener('keypress', e => {
    if (['Enter', ' '].includes(e.key)) {
      e.preventDefault();
      copyColor(randomHex, li);
    }
  });

  palette.appendChild(li);

  history.execute(getCurrentPaletteState());
}

export function generatePalette() {
  const cards = palette.querySelectorAll('.color-column');
  cards.forEach(card => {
    const newColor = generateRandomHex();
    card.style.backgroundColor = newColor;
    card.querySelector('.text').textContent = newColor;
    card.onclick = () => copyColor(newColor, card);
  });
  document.getElementById('feedback').textContent = 'Novas cores geradas.';
  history.execute(getCurrentPaletteState());
}

export async function copyColor(color, card) {
  try {
    await navigator.clipboard.writeText(color);
    showColorOKLCH(color);
    const feedback = document.createElement('div');
    feedback.classList.add('copied-message');
    feedback.textContent = 'Copiado!';
    card.appendChild(feedback);
    setTimeout(() => feedback.remove(), 2000);
  } catch (e) {
    console.error('Falha ao copiar cor:', e);
  }
}

export function getCurrentPaletteState() {
  return Array.from(palette.children).map(card => card.querySelector('.text').textContent);
}

export function restorePaletteState(state) {
  palette.innerHTML = '';
  state.forEach(hex => {
    const li = document.createElement('li');
    li.classList.add('color-column', 'shadow');
    li.style.backgroundColor = hex;
    li.innerHTML = `<span class="text">${hex}</span>`;
    li.onclick = () => copyColor(hex, li);
    palette.appendChild(li);
  });
}
