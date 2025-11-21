import { palette } from "../app/domElements.js";
import { history } from "../app/main.js";

import { generateRandomHex, getBestTextColor } from "../core/colorUtils.js";

function createElementLi(hex) {
  const li = document.createElement("li");

  li.classList.add("color-column", "shadow");
  li.setAttribute("tabindex", "0");
  li.setAttribute("aria-label", `Cor hexadecimal ${hex}`);
  li.dataset.locked = "false";
  const textColor = getBestTextColor(hex);

  const spanHex = document.createElement("span");
  spanHex.classList.add("text");
  spanHex.setAttribute("aria-live", `polite`);
  spanHex.style.color = textColor;
  spanHex.textContent = hex;

  // Criação do botão de remover
  const removeButton = document.createElement("button");
  removeButton.id = "remove-color";
  removeButton.classList.add("btn");
  removeButton.title = "remover-cor";
  removeButton.style.color = textColor;

  removeButton.innerHTML = '<i class="ph ph-x"></i>'; // Ícone de "x" para remover
  removeButton.addEventListener("click", () => {
    li.remove();
    history.execute(getCurrentPaletteState());
  });

  // Criação do botão de bloquear
  // const lockButton = document.createElement("button");
  // lockButton.id = "lock-color";
  // lockButton.classList.add("btn");
  // lockButton.title = "bloquear-cor";
  // lockButton.style.color = textColor;

  // lockButton.innerHTML = '<i class="ph ph-lock-simple-open"></i>'; // Ícone de "cadeado aberto"
  // lockButton.addEventListener("click", () => {
  //   const locked = li.dataset.locked === "true";
  //   li.dataset.locked = locked ? "false" : "true"; // Alterna o estado do bloqueio
  //   lockButton.innerHTML = locked
  //     ? '<i class="ph ph-lock-simple-open"></i>'
  //     : '<i class="ph ph-lock"></i>';
  //   history.execute(getCurrentPaletteState());
  // });

  // Criação do botão de copiar
  const copyButton = document.createElement("button");
  copyButton.id = "copy-color";
  copyButton.classList.add("btn");
  copyButton.title = "copiar-cor";
  copyButton.style.color = textColor;

  copyButton.innerHTML = '<i class="ph ph-copy"></i>'; // Ícone de "copiar"
  copyButton.addEventListener("click", () => copyColor(hex, li));

  // Adicionando os botões ao <li>
  li.appendChild(removeButton);
  // li.appendChild(lockButton);
  li.appendChild(copyButton);
  li.appendChild(spanHex);

  // Definindo a cor de fundo do <li>
  li.style.backgroundColor = hex;
  li.addEventListener("keypress", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      copyColor(hex, li);
    }
  });

  return li;
}

export function createColorColumn() {
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
    const feedback = document.createElement("div");
    feedback.classList.add("copied-message");
    feedback.textContent = "Copiado!";
    card.appendChild(feedback);
    card.style.position = "relative";
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
