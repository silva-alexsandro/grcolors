import { palette } from "../app/domElements.js";
import { history } from "../app/main.js";

import { generateRandomHex } from "../core/colorUtils.js";
// import { showColorOKLCH } from "../variations.js";

function createElementLi(hex) {
  const li = document.createElement("li");
  li.classList.add("color-column", "shadow");
  li.setAttribute("tabindex", "0");
  li.setAttribute("aria-label", `Cor hexadecimal ${hex}`);

  li.style.backgroundColor = hex;

  li.innerHTML = `<span class="text" aria-live="polite">${hex}</span>`;

  li.addEventListener("click", () => copyColor(hex, li));

  li.addEventListener("keypress", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      copyColor(hex, li);
    }
  });
  return li;
}

export function createCard() {
  if (palette.children.length >= 15) return;

  const randomHex = generateRandomHex();
  palette.appendChild(createElementLi(randomHex));
  history.execute(getCurrentPaletteState());
}

export function generatePalette() {
  const cards = palette.querySelectorAll(".color-column");
  cards.forEach((card) => {
    const newColor = generateRandomHex();
    card.style.backgroundColor = newColor;
    card.querySelector(".text").textContent = newColor;
    card.onclick = () => copyColor(newColor, card);
  });
  document.getElementById("feedback").textContent = "Novas cores geradas.";
  history.execute(getCurrentPaletteState());
}

export async function copyColor(color, card) {
  try {
    await navigator.clipboard.writeText(color);
    showColorOKLCH(color);
    const feedback = document.createElement("div");
    feedback.classList.add("copied-message");
    feedback.textContent = "Copiado!";
    card.appendChild(feedback);
    setTimeout(() => feedback.remove(), 2000);
  } catch (e) {
    console.error("Falha ao copiar cor:", e);
  }
}

export function getCurrentPaletteState() {
  return Array.from(palette.children).map(
    (card) => card.querySelector(".text").textContent,
  );
}

export function restorePaletteState(state) {
  palette.innerHTML = "";
  state.forEach((hex) => palette.appendChild(createElementLi(hex)));
}
