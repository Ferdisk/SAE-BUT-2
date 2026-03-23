import {
    etatFilters,
    questionnairesProf,
    selectedEtatFilterValue,
    setEtatFilters,
    setSelectedEtatFilterValue
} from "./state.js";
import { afficherQuestionnairesProf } from "./list/renderQuestionnaireList.js";

export function normalizeEtat(value) {
    return String(value || "").trim().toLowerCase();
}

export function formatEtat(value) {
    const text = String(value || "").trim();
    return text ? text.charAt(0).toUpperCase() + text.slice(1) : "Inconnu";
}

export function renderEtatFilterSelect() {
    const select = document.getElementById("state-filter-select");
    if (!select) return;

    select.innerHTML = "";

    etatFilters.forEach((filter) => {
        const option = document.createElement("option");
        option.value = filter.value;
        option.textContent = filter.label;
        select.appendChild(option);
    });

    if (!etatFilters.some((filter) => filter.value === selectedEtatFilterValue)) {
        setSelectedEtatFilterValue("__all__");
    }

    select.value = selectedEtatFilterValue;
}

export function setupEtatFilters(questionnaires) {
    const etatMap = new Map();
    const etatOrder = ["envoye", "brouillon", "archive", "ferme", "actif"];

    questionnaires.forEach((q) => {
        const normalized = normalizeEtat(q.etat);
        if (!normalized) return;
        if (!etatMap.has(normalized)) {
            etatMap.set(normalized, formatEtat(q.etat));
        }
    });

    const sortedEtats = Array.from(etatMap.entries()).sort((a, b) => {
        const indexA = etatOrder.indexOf(a[0]);
        const indexB = etatOrder.indexOf(b[0]);
        const hasPriorityA = indexA !== -1;
        const hasPriorityB = indexB !== -1;

        if (hasPriorityA && hasPriorityB) return indexA - indexB;
        if (hasPriorityA) return -1;
        if (hasPriorityB) return 1;

        return a[1].localeCompare(b[1], "fr");
    });

    setEtatFilters([
        { value: "__all__", label: "Tous" },
        ...sortedEtats.map(([value, label]) => ({ value, label }))
    ]);
    setSelectedEtatFilterValue("__all__");
    renderEtatFilterSelect();
}

export function getFilteredQuestionnaires() {
    if (selectedEtatFilterValue === "__all__") {
        return questionnairesProf;
    }

    return questionnairesProf.filter((q) => normalizeEtat(q.etat) === selectedEtatFilterValue);
}

export function applyEtatFilter() {
    afficherQuestionnairesProf(getFilteredQuestionnaires());
}

export { afficherQuestionnairesProf } from "./list/renderQuestionnaireList.js";
