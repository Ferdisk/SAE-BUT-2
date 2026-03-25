import { renderQuestionnaireCard } from "./renderQuestionnaireCard.js";

export function afficherQuestionnairesProf(questionnaires) {
    const container = document.getElementById("questionnaires-list");
    if (!container) return;

    container.innerHTML = "";

    if (questionnaires.length === 0) {
        container.innerHTML = "<p>Aucun questionnaire créé.</p>";
        return;
    }

    questionnaires.forEach((q) => {
        container.appendChild(renderQuestionnaireCard(q));
    });
}
