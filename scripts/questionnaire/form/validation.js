import { SELECTORS } from "../dom/selectors.js";

export function hasQuestions() {
    const container = document.getElementById(SELECTORS.questionsContainer);
    return !!(container && container.children.length > 0);
}

export function affichemessage() {
    const hint = document.querySelector(SELECTORS.hint);
    if (!hint) return;
    hint.textContent = hasQuestions() ? "" : "Cliquez sur un type de question pour commencer";
}

export function answersValidation() {
    const textAreasToValidate = document.querySelectorAll(SELECTORS.validationTextareas);

    for (const element of textAreasToValidate) {
        if (element.value.trim().length === 0) {
            element.style.border = "1px solid red";
            return false;
        }
        element.style.border = "";
    }

    return true;
}
