import { SELECTORS } from "../dom/selectors.js";

export function bindTimeLimitListeners() {
    const timeLimitToggle = document.getElementById("time-limit-toggle");
    const timeLimitContent = document.getElementById("time-limit-content");
    const timeLimitDesc = document.getElementById("time-limit-desc-text");

    if (!timeLimitToggle) return;

    timeLimitToggle.addEventListener("change", (e) => {
        if (e.target.checked) {
            timeLimitContent.style.display = "flex";
            const val = document.querySelector(SELECTORS.timeInput).value;
            timeLimitDesc.textContent = `Les étudiants auront ${val} heures pour compléter ce questionnaire à partir de son envoi.`;
        } else {
            timeLimitContent.style.display = "none";
            timeLimitDesc.textContent = "Aucune limite de temps. Les étudiants pourront compléter le questionnaire à leur rythme.";
        }
    });

    const timeInput = document.querySelector(SELECTORS.timeInput);
    if (!timeInput) return;

    timeInput.addEventListener("input", (e) => {
        let val = parseInt(e.target.value, 10);

        if (val > 24) val = 24;
        if (val < 1) val = 1;
        if (val !== parseInt(e.target.value, 10)) e.target.value = val;

        timeLimitDesc.textContent = `Les étudiants auront ${val} heures pour compléter ce questionnaire à partir de son envoi.`;
    });
}
