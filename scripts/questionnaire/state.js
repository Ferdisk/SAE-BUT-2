export let currentFormId = null;
export let currentFormEtat = null;
export let questionnairesProf = [];
export let etatFilters = [{ value: "__all__", label: "Tous" }];
export let selectedEtatFilterValue = "__all__";

export function setCurrentFormId(value) {
    currentFormId = value;
}

export function getCurrentFormId() {
    return currentFormId;
}

export function setCurrentFormEtat(value) {
    currentFormEtat = value;
}

export function getCurrentFormEtat() {
    return currentFormEtat;
}

export function setQuestionnairesProf(value) {
    questionnairesProf = Array.isArray(value) ? value : [];
}

export function setEtatFilters(value) {
    etatFilters = Array.isArray(value) ? value : [{ value: "__all__", label: "Tous" }];
}

export function setSelectedEtatFilterValue(value) {
    selectedEtatFilterValue = value || "__all__";
}
