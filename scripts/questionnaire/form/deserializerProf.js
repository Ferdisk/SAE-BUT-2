import { SELECTORS } from "../dom/selectors.js";
import { addQCM, addTexte, addRatingScale, createOptionElement } from "../questionBuilder.js";
import { affichemessage } from "./validation.js";

export function fillForm(questionnaire) {
    const titleInput = document.querySelector(SELECTORS.formTitleFallback);
    if (titleInput) {
        titleInput.value = questionnaire.titre || "";
        titleInput.disabled = true;
    }

    const descInput = document.querySelector(SELECTORS.descInput);
    if (descInput) {
        descInput.value = questionnaire.description || "";
        descInput.disabled = true;
    }

    const groupeCibleInput = document.getElementById("groupe-cible");
    if (groupeCibleInput && questionnaire.groupe_cible) groupeCibleInput.value = questionnaire.groupe_cible;

    const timeLimitToggle = document.getElementById("time-limit-toggle");
    const timeInput = document.querySelector(SELECTORS.timeInput);
    const timeLimitContent = document.getElementById("time-limit-content");

    if (questionnaire.temps_limite && timeLimitToggle && timeInput) {
        timeLimitToggle.checked = true;
        timeInput.value = questionnaire.temps_limite;
        if (timeLimitContent) timeLimitContent.style.display = "flex";
    } else if (timeLimitToggle) {
        timeLimitToggle.checked = false;
        if (timeLimitContent) timeLimitContent.style.display = "none";
    }

    const container = document.getElementById(SELECTORS.questionsContainer);
    if (!container) return;
    container.innerHTML = "";

    const callbacks = { onQuestionRemoved: affichemessage };

    function createQuestionElement(q, isSubQuestion = false) {
        let element = null;

        if (q.type_question_id === 1) {
            element = addTexte(isSubQuestion, callbacks);
            if (!isSubQuestion) element.querySelector(".titreQuestion").value = q.contenu;
        }

        if (q.type_question_id === 2) {
            element = addQCM(isSubQuestion, callbacks);
            if (!isSubQuestion) element.querySelector(".titreQCM").value = q.contenu;

            const list = element.querySelector(".listQCM");
            list.innerHTML = "";

            if (q.choix) {
                q.choix.forEach((c, index) => {
                    const { li } = createOptionElement(list, index + 1, callbacks);
                    if (c.id) li.dataset.choixId = c.id;
                    const textarea = li.querySelector(".textAreaQuestion");
                    textarea.value = c.contenu;

                    if (c.sous_questions && c.sous_questions.length > 0) {
                        c.sous_questions.forEach((sq) => {
                            const subElement = createQuestionElement(sq, true);
                            if (subElement) {
                                subElement.classList.add("sub-question");
                                if (sq.id) subElement.dataset.questionId = sq.id;
                                li.appendChild(subElement);
                            }
                        });
                    }

                    list.appendChild(li);
                });
            }
        }

        if (q.type_question_id === 3) {
            element = addRatingScale(isSubQuestion, callbacks);
            if (!isSubQuestion) element.querySelector(".titreRating").value = q.contenu;

            if (q.echelle_max) {
                const selectScale = element.querySelector(".select-scale");
                if (selectScale) {
                    selectScale.value = q.echelle_max;
                    selectScale.dispatchEvent(new Event("change"));
                }
            }
        }

        return element;
    }

    questionnaire.questions.forEach((q) => {
        const element = createQuestionElement(q, false);
        if (element) {
            if (q.id) element.dataset.questionId = q.id;
            const obligatoireCheckbox = element.querySelector(".question-obligatoire");
            if (obligatoireCheckbox) obligatoireCheckbox.checked = q.obligatoire === 1;
            container.appendChild(element);
        }
    });
}
