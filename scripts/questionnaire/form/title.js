import { SELECTORS } from "../dom/selectors.js";

export function getFormTitleInput() {
    return document.getElementById(SELECTORS.formTitleId) || document.querySelector(SELECTORS.formTitleFallback);
}

export function getFormTitleValue(defaultValue = "") {
    const titleInput = getFormTitleInput();
    const titleValue = titleInput ? titleInput.value.trim() : "";
    return titleValue || defaultValue;
}
