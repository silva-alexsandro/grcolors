import { body, palette } from "../app/domElements.js";

let userTheme = "sistema";

export function toggleFullscreen(enable) {
  if (enable && !document.fullscreenElement) {
    document.documentElement
      .requestFullscreen()
      .catch((err) =>
        console.error(`Erro ao ativar fullscreen: ${err.message}`),
      );
  } else if (!enable && document.fullscreenElement) {
    document.exitFullscreen();
  }
}

export function togglePaletteGap(enable) {
  if (!palette) return;
  palette.classList.toggle("gapped", enable);
}

export function getInputValue(input) {
  return input.type === "checkbox" ? input.checked : input.value;
}

export function getCurrentTheme() {
  return userTheme;
}

export function applyTheme(theme) {
  userTheme = theme;
  body.classList.remove("dark");

  if (theme === "escuro") {
    body.classList.add("dark");
  } else if (theme === "sistema") {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    if (prefersDark) body.classList.add("dark");
  }
}
