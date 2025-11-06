// js/oklchGenerator.js
import { hexToRgb, rgbToOklch } from './colorUtils.js';
import { variationsContainer } from './domElements.js';

export function gerarVariacoesOKLCH(hex) {
  const [r, g, b] = hexToRgb(hex);
  const [lBase, cBase, hBase] = rgbToOklch(r, g, b);
  const steps = [0.95, 0.85, 0.75, 0.65, 0.55, 0.45, 0.35, 0.25, 0.15, 0.05];
  return steps.map(
    (l) => `oklch(${(l * 100).toFixed(1)}% ${cBase.toFixed(3)} ${hBase.toFixed(1)})`
  );
}

export function showColorOKLCH(color) {
  variationsContainer.innerHTML = '';
  const colors = gerarVariacoesOKLCH(color);

  colors.forEach((c) => {
    const article = document.createElement('article');
    article.classList.add('color-swatch', 'shadow');
    article.style.backgroundColor = c;
    const lightness = parseFloat(c.match(/oklch\(([\d.]+)/)[1]);
    article.style.color = lightness > 60 ? '#000' : '#fff';
    article.title = c;
    article.textContent = c.replace('oklch(', '').replace(')', '');
    article.addEventListener('click', () => navigator.clipboard.writeText(c));
    variationsContainer.appendChild(article);
  });
}
