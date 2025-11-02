const btnGeneratorColors = document.getElementById("js-btn-generator-color");
const newCard = document.getElementById("js-btn-new-card");
const cards = document.getElementById("js-cards");
const variationsContainer = document.getElementById("js-color-variations");

const generateRandomHex = () => {
  return `#${Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, "0")}`;
};

const createCard = () => {
  const randomHex = generateRandomHex();

  const card = document.createElement("li");
  card.classList.add("card");
  card.setAttribute("tabindex", "0");

  card.innerHTML = `
   <header 
      class="color-box" 
      aria-label="Cor hexadecimal ${randomHex}" 
      style="background-color: ${randomHex};">
    </header>
    <span class="text" aria-live="polite">${randomHex}</span>
  `;

  card.addEventListener("click", () => copyColor(randomHex, card));

  card.addEventListener("keypress", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      copyColor(randomHex, card);
    }
  });

  cards.appendChild(card);
};

const generatePalette = () => {
  const allCards = cards.querySelectorAll(".card");

  allCards.forEach((card) => {
    const newColor = generateRandomHex();
    const colorBox = card.querySelector(".color-box");
    const text = card.querySelector(".text");

    colorBox.style.backgroundColor = newColor;
    colorBox.setAttribute("aria-label", `Cor hexadecimal ${newColor}`);
    text.textContent = newColor;

    card.onclick = () => copyColor(newColor, card);
  });
  document.getElementById("feedback").textContent = "Novas cores geradas.";
};

const copyColor = async (color, card) => {
  try {
    await navigator.clipboard.writeText(color);

    showColorOKLCH(color);

    const feedback = document.createElement("div");
    feedback.classList.add("copied-message");
    feedback.textContent = "Copiado!";
    card.appendChild(feedback);

    setTimeout(() => feedback.remove(), 2000);
  } catch (error) {
    console.error("Falha ao copiar cor:", error);
  }
};

// **************** gerar oklch*******************
// Converte HEX → RGB
function hexToRgb(colorHex) {
  colorHex = colorHex.replace("#", "");
  if (colorHex.length === 3)
    (colorHex = colorHex.split("").map((ch) => ch + ch)), join("");
  const bigint = parseInt(colorHex, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

// Tenta usar API nativa Color (moderna)
function rgbToOklch(r, g, b) {
  try {
    const color = new Color(`rgb(${r}, ${g}, ${b})`);
    const { l, c, h } = color.to("oklch");
    return [l, c, h];
  } catch {
    return rgbToOklchOld(r, g, b);
  }
}

function rgbToOklchOld(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  r = r <= 0.04045 ? r / 12.92 : ((r + 0.055) / 1.055) ** 2.4;
  g = g <= 0.04045 ? g / 12.92 : ((g + 0.055) / 1.055) ** 2.4;
  b = b <= 0.04045 ? b / 12.92 : ((b + 0.055) / 1.055) ** 2.4;

  const X = r * 0.4122214708 + g * 0.5363325363 + b * 0.0514459929;
  const Y = r * 0.2119034982 + g * 0.6806995451 + b * 0.1073969566;
  const Z = r * 0.0883024619 + g * 0.2817188376 + b * 0.6299787005;

  const l_ = Math.cbrt(0.8189330101 * X + 0.3618667424 * Y - 0.1288597137 * Z);
  const m_ = Math.cbrt(0.0329845436 * X + 0.9293118715 * Y + 0.0361456387 * Z);
  const s_ = Math.cbrt(0.0482003018 * X + 0.2643662691 * Y + 0.633851707 * Z);

  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const b2 = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

  const C = Math.sqrt(a * a + b2 * b2);
  const H = (Math.atan2(b2, a) * 180) / Math.PI;
  const Hdeg = (H + 360) % 360;

  return [L, C, Hdeg];
}

// Gera variações de luminosidade
function gerarVariacoeOKLCH(hex) {
  const [r, g, b] = hexToRgb(hex);
  const [lBase, cBase, hBase] = rgbToOklch(r, g, b);
  const steps = [0.95, 0.85, 0.75, 0.65, 0.55, 0.45, 0.35, 0.25, 0.15, 0.05];
  return steps.map(
    (l) =>
      `oklch(${(l * 100).toFixed(1)}% ${cBase.toFixed(3)} ${hBase.toFixed(1)})`,
  );
}

function showColorOKLCH(color) {
  variationsContainer.innerHTML = "";
  const colors = gerarVariacoeOKLCH(color);
  colors.forEach((c) => {
    const div = document.createElement("div");
    div.classList.add("color-swatch");
    div.style.backgroundColor = c;

    const lightness = parseFloat(c.match(/oklch\(([\d.]+)/)[1]);
    div.style.color = lightness > 60 ? "#000" : "#fff";

    div.title = c;
    div.textContent = c.replace("oklch(", "").replace(")", "");
    div.addEventListener("click", () => navigator.clipboard.writeText(c));
    variationsContainer.appendChild(div);
  });
}

newCard.addEventListener("click", createCard);
btnGeneratorColors.addEventListener("click", generatePalette);
