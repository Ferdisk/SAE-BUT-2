import { applyEtatFilter } from "../filterUtils.js";
import { setSelectedEtatFilterValue } from "../state.js";
import { SELECTORS } from "../dom/selectors.js";

export function bindListPageListeners() {
    const filterSelect = document.getElementById(SELECTORS.stateFilterSelect);
    if (!filterSelect) return;

    filterSelect.addEventListener("change", (event) => {
        setSelectedEtatFilterValue(event.target.value || "__all__");
        applyEtatFilter();
    });
}
