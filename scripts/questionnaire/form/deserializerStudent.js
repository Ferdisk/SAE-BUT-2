import { SELECTORS } from "../dom/selectors.js";
import { addQCM, addTexte, addRatingScale } from "../questionBuilder.js";

export function fillFormStudent(questionnaire) {
    const titleInput = document.querySelector(SELECTORS.formTitleFallback);
    if (titleInput) {
        titleInput.textContent = questionnaire.titre || "";
        titleInput.value = questionnaire.titre || "";
        titleInput.disabled = true;
    }

    const descInput = document.querySelector(SELECTORS.descInput);
    if (descInput) {
        descInput.value = questionnaire.description || "";
        descInput.disabled = true;
    }

    const container = document.getElementById(SELECTORS.questionsContainer);
    if (!container) return;
    container.innerHTML = "";

    function createStudentChoixLi(c, questionId) {
        const li = document.createElement("li");
        li.classList.add("elementQCM");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("qcm-checkbox");
        checkbox.value = c.id;
        checkbox.dataset.questionId = questionId;

        const textContainer = document.createElement("span");
        textContainer.classList.add("textQuestionContainer");

        const textarea = document.createElement("textarea");
        textarea.classList.add("textAreaQuestion");
        textarea.textContent = c.contenu || "";
        textarea.disabled = true;

        textContainer.appendChild(textarea);
        li.appendChild(checkbox);
        li.appendChild(textContainer);

        if (c.sous_questions && c.sous_questions.length > 0) {
            c.sous_questions.forEach((sq) => {
                const subElement = createStudentQuestionElement(sq, true);
                if (subElement) {
                    subElement.classList.add("sub-question");
                    if (sq.id) subElement.dataset.questionId = sq.id;
                    li.appendChild(subElement);
                }
            });
        }

        return li;
    }

    function createStudentQuestionElement(q, isSubQuestion) {
        let element = null;

        if (q.type_question_id === 1) {
            element = addTexte(isSubQuestion);
            if (!isSubQuestion) {
                const titreTexte = element.querySelector(".titreQuestion");
                if (titreTexte) {
                    titreTexte.textContent = q.contenu || "";
                    titreTexte.disabled = true;
                }
            }

            const reponse = element.querySelector(".reponseQuestion");
            if (reponse) {
                reponse.dataset.questionId = q.id;
                reponse.disabled = false;
            }
        }

        if (q.type_question_id === 2) {
            element = addQCM(isSubQuestion);
            if (!isSubQuestion) {
                const titreQCM = element.querySelector(".titreQCM");
                if (titreQCM) {
                    titreQCM.textContent = q.contenu || "";
                    titreQCM.disabled = true;
                }
            }

            const list = element.querySelector(".listQCM");
            if (list) list.innerHTML = "";
            if (list && q.choix && q.choix.length > 0) {
                q.choix.forEach((c) => list.appendChild(createStudentChoixLi(c, q.id)));
            }
        }

        if (q.type_question_id === 3) {
            element = addRatingScale(isSubQuestion);
            if (!isSubQuestion) {
                const titreRating = element.querySelector(".titreRating");
                if (titreRating) {
                    titreRating.textContent = q.contenu || "";
                    titreRating.disabled = true;
                }
            }

            if (q.echelle_max) {
                const selectScale = element.querySelector(".select-scale");
                if (selectScale) {
                    selectScale.value = q.echelle_max;
                    selectScale.dispatchEvent(new Event("change"));
                }
            }

            const slider = element.querySelector(".rating-slider");
            if (slider) slider.dataset.questionId = q.id;
        }

        if (element) {
            const obligatoireCheckbox = element.querySelector(".question-obligatoire");
            if (obligatoireCheckbox) obligatoireCheckbox.checked = q.obligatoire === 1;
        }

        return element;
    }

    questionnaire.questions.forEach((q) => {
        const element = createStudentQuestionElement(q, false);
        if (element) {
            if (q.id) element.dataset.questionId = q.id;
            container.appendChild(element);
        }
    });
}
