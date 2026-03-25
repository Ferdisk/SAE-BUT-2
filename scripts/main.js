import { chargerQuestionnairesProf, loadQuestionnaire } from "./questionnaire/api.js";
import { initEventListeners } from "./questionnaire/eventListeners.js";
import { applyEtatFilter, setupEtatFilters } from "./questionnaire/filterUtils.js";
import { setCurrentFormId, setQuestionnairesProf } from "./questionnaire/state.js";

document.addEventListener("DOMContentLoaded", async () => {
    initEventListeners();

    const parts = window.location.pathname.split("/");
    const id = parts[parts.length - 1];

    if (id && !isNaN(id)) {
        setCurrentFormId(id);
        await loadQuestionnaire(id);
    }

    const listContainer = document.getElementById("questionnaires-list");
    if (listContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        const authorId = urlParams.get("authorId");

        const questionnaires = await chargerQuestionnairesProf(authorId);
        setQuestionnairesProf(questionnaires);
        setupEtatFilters(questionnaires);
        applyEtatFilter();
    }
});
