import { btnClose, modal, form, palette } from "../app/domElements.js";
import { getCurrentTheme } from "./views.js";

export function handleModal() {
  const themeSelect = form.querySelector('select[name="theme"]');
  themeSelect.value = getCurrentTheme();

  const fullmodeCheckbox = form.querySelector('input[name="fullmode"]');
  const gapColumnsCheckbox = form.querySelector('input[name="gapColumns"]');

  fullmodeCheckbox.checked = !!document.fullscreenElement;
  gapColumnsCheckbox.checked = palette.classList.contains("gapped");

  modal.style.display = "block";

  btnClose.onclick = () => (modal.style.display = "none");

  window.onclick = (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  };
}
