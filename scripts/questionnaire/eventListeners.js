import { affichemessage } from "./formUtils.js";
import { bindFormBuilderListeners } from "./listeners/formBuilderListeners.js";
import { bindTimeLimitListeners } from "./listeners/timeLimitListeners.js";
import { bindListPageListeners } from "./listeners/listPageListeners.js";
import { bindBackButtonListener, bindLogoutListener } from "./listeners/navListeners.js";

export function initEventListeners() {
    bindTimeLimitListeners();
    bindFormBuilderListeners();
    bindListPageListeners();
    bindLogoutListener();
    bindBackButtonListener();

    affichemessage();
}
