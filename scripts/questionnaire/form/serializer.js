import { SELECTORS } from "../dom/selectors.js";
import { getFormTitleValue } from "./title.js";

export function getFullForm() {
    const container = document.getElementById(SELECTORS.questionsContainer);
    const questions = [];

    container.querySelectorAll(":scope > .question-wrapper-flex").forEach((wrapper) => {
        const result = extractQuestion(wrapper);
        if (result) questions.push(result);
    });

    return {
        titre: getFormTitleValue("Sans titre"),
        questions
    };
}

export function extractQuestion(wrapper) {
    const obligatoireCheckbox = wrapper.querySelector(".question-obligatoire");
    const obligatoire = obligatoireCheckbox ? (obligatoireCheckbox.checked ? 1 : 0) : 1;

    const isSubQuestion = wrapper.classList.contains("sub-question");
    const questionId = wrapper.dataset.questionId ? parseInt(wrapper.dataset.questionId, 10) : null;

    const titreQCM = wrapper.querySelector(":scope > .question-content-white > .titreQCM");
    const titreTexte = wrapper.querySelector(":scope > .question-content-white > .titreQuestion");
    const titreRating = wrapper.querySelector(":scope > .question-content-white > .header-row > .titreRating");
    const listQCM = wrapper.querySelector(":scope > .question-content-white > .listQCM");

    if (titreQCM || (isSubQuestion && listQCM)) {
        const choix = [];
        wrapper.querySelectorAll(":scope > .question-content-white > .listQCM > li").forEach((li) => {
            const textarea = li.querySelector(".textAreaQuestion");
            if (!textarea || !textarea.value.trim()) return;

            const choixId = li.dataset.choixId ? parseInt(li.dataset.choixId, 10) : null;
            const sous_questions = [];

            li.querySelectorAll(":scope > .question-wrapper-flex").forEach((sub) => {
                const subResult = extractQuestion(sub);
                if (subResult) sous_questions.push(subResult);
            });

            const choixObj = {
                contenu: textarea.value.trim(),
                sous_questions
            };
            if (choixId) choixObj.id = choixId;
            choix.push(choixObj);
        });

        const result = {
            contenu: titreQCM ? titreQCM.value.trim() : "Sous-QCM",
            obligatoire,
            type_question_id: 2,
            choix
        };
        if (questionId) result.id = questionId;
        return result;
    }

    const containerReponse = wrapper.querySelector(":scope > .question-content-white > .containerReponse");
    if (titreTexte || (isSubQuestion && containerReponse && !listQCM)) {
        const result = {
            contenu: titreTexte ? titreTexte.value.trim() : "Sous-question Texte",
            obligatoire,
            type_question_id: 1
        };
        if (questionId) result.id = questionId;
        return result;
    }

    const sliderContainer = wrapper.querySelector(":scope > .question-content-white > .slider-container");
    if (titreRating || (isSubQuestion && sliderContainer)) {
        const selectScale = wrapper.querySelector(".select-scale");
        const echelleMax = selectScale ? parseInt(selectScale.value, 10) : 10;
        const result = {
            contenu: titreRating ? titreRating.value.trim() : "Sous-question Échelle",
            obligatoire,
            type_question_id: 3,
            echelle_max: echelleMax
        };
        if (questionId) result.id = questionId;
        return result;
    }

    return null;
}
