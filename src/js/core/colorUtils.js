// -----------------------------
// Gera uma cor aleatória em HEX
// -----------------------------
export function generateRandomHex() {
  return `#${Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, "0")}`;
}

// -----------------------------
// Converte HEX → RGB
// Aceita "#abc" ou "#aabbcc"
// -----------------------------
export function hexToRgb(hex) {
  hex = hex.replace("#", "");

  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }

  return [
    parseInt(hex.slice(0, 2), 16),
    parseInt(hex.slice(2, 4), 16),
    parseInt(hex.slice(4, 6), 16),
  ];
}

// -----------------------------
// Converte um canal sRGB (0–255)
// para linear RGB (WCAG)
// -----------------------------
function toLinear(v) {
  v /= 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}

// -----------------------------
// Luminância relativa (WCAG)
// Fórmula oficial
// -----------------------------
export function getLuminance(hex) {
  const [r, g, b] = hexToRgb(hex);

  const R = toLinear(r);
  const G = toLinear(g);
  const B = toLinear(b);

  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

// -----------------------------
// Razão de contraste entre duas cores
// Retorna um valor entre 1 e 21
// -----------------------------
export function contrastRatio(colorA, colorB) {
  const L1 = getLuminance(colorA);
  const L2 = getLuminance(colorB);

  const light = Math.max(L1, L2);
  const dark = Math.min(L1, L2);

  return (light + 0.05) / (dark + 0.05);
}

// -----------------------------
// Verifica AA / AAA
// Para texto normal (não negrito)
// -----------------------------
export function getContrastLevel(bg, fg) {
  const ratio = contrastRatio(bg, fg);

  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  return "FAIL";
}

// -----------------------------
// Decide texto preto ou branco
// usando contraste REAL (WCAG)
// -----------------------------
export function getBestTextColor(bg) {
  const white = getContrastLevel(bg, "#FFFFFF");
  const black = getContrastLevel(bg, "#000000");

  // AAA > AA > FAIL
  const priority = { AAA: 3, AA: 2, FAIL: 1 };

  return priority[black] >= priority[white] ? "#000000" : "#FFFFFF";
}

/*

export function rgbToOklch(r, g, b) {
  try {
    const color = new Color(`rgb(${r}, ${g}, ${b})`);
    const { l, c, h } = color.to("oklch");
    return [l, c, h];
  } catch {
    return rgbToOklchOld(r, g, b);
  }
}

export function rgbToOklchOld(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  r = r <= 0.04045 ? r / 12.92 : ((r + 0.055) / 1.055) ** 2.4;
  g = g <= 0.04045 ? g / 12.92 : ((g + 0.055) / 1.055) ** 2.4;
  b = b <= 0.04045 ? b / 12.92 : ((b + 0.055) / 1.055) ** 2.4;

  const X = r * 0.4122 + g * 0.5363 + b * 0.0514;
  const Y = r * 0.2119 + g * 0.6807 + b * 0.1074;
  const Z = r * 0.0883 + g * 0.2817 + b * 0.63;

  const l_ = Math.cbrt(0.8189 * X + 0.3619 * Y - 0.1289 * Z);
  const m_ = Math.cbrt(0.033 * X + 0.9293 * Y + 0.0361 * Z);
  const s_ = Math.cbrt(0.0482 * X + 0.2644 * Y + 0.6339 * Z);

  const L = 0.2104 * l_ + 0.7936 * m_ - 0.0041 * s_;
  const a = 1.978 * l_ - 2.4286 * m_ + 0.4506 * s_;
  const b2 = 0.0259 * l_ + 0.7828 * m_ - 0.8087 * s_;

  const C = Math.sqrt(a * a + b2 * b2);
  const Hdeg = ((Math.atan2(b2, a) * 180) / Math.PI + 360) % 360;
  return [L, C, Hdeg];
}
*/
