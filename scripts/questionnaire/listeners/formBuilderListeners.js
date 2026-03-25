import { apiFetch, sendFormToBDD, updateFormInBDD } from "../api.js";
import { addQCM, addRatingScale, addTexte } from "../questionBuilder.js";
import { getFullForm, hasQuestions, answersValidation, handleSubmitAttempt, affichemessage } from "../formUtils.js";
import { getCurrentFormId } from "../state.js";
import { SELECTORS } from "../dom/selectors.js";

export function bindFormBuilderListeners() {
    const btnQCM = document.getElementById("btn-qcm");
    const btnTexte = document.getElementById("btn-texte");
    const btnEchelle = document.getElementById("btn-echelle");
    const submitBtn = document.getElementById("submit-btn");
    const saveBtn = document.getElementById("save-btn");
    const updateBtn = document.getElementById("update-btn");
    const callbacks = { onQuestionRemoved: affichemessage };

    if (btnQCM) {
        btnQCM.addEventListener("click", () => {
            const qcm = addQCM(false, callbacks);
            document.getElementById(SELECTORS.questionsContainer).appendChild(qcm);
            affichemessage();
        });
    }

    if (btnTexte) {
        btnTexte.addEventListener("click", () => {
            const txt = addTexte(false, callbacks);
            document.getElementById(SELECTORS.questionsContainer).appendChild(txt);
            affichemessage();
        });
    }

    if (btnEchelle) {
        btnEchelle.addEventListener("click", () => {
            const scale = addRatingScale(false, callbacks);
            document.getElementById(SELECTORS.questionsContainer).appendChild(scale);
            affichemessage();
        });
    }

    if (saveBtn) {
        saveBtn.addEventListener("click", (event) => {
            event.preventDefault();
            handleSubmitAttempt(sendFormToBDD);
        });
    }

    if (submitBtn) {
        submitBtn.addEventListener("click", async () => {
            if (!getCurrentFormId()) return;
            if (!confirm("Envoyer définitivement ce questionnaire ?")) return;

            const res = await apiFetch(`/questionnaire/send/${getCurrentFormId()}`, { method: "PUT" });
            const data = await res.json();

            if (data.success) {
                alert("Formulaire envoyé");
                window.location.href = "/prof";
            } else {
                alert(data.message);
            }
        });
    }

    if (updateBtn) {
        updateBtn.addEventListener("click", async () => {
            if (!getCurrentFormId()) return;

            if (!hasQuestions() || !answersValidation()) {
                alert("Formulaire invalide");
                return;
            }

            const formReady = getFullForm();
            await updateFormInBDD(formReady);
        });
    }

    document.addEventListener("click", (e) => {
        if (e.target && e.target.id === "btn-reset") {
            e.preventDefault();
            if (confirm("Êtes-vous sûr de vouloir tout effacer ? Cette action est irréversible.")) {
                const container = document.getElementById(SELECTORS.questionsContainer);
                if (container) {
                    container.innerHTML = "";
                    affichemessage();
                }
            }
        }
    });
}
