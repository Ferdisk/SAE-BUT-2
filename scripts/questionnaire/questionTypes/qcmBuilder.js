import { createQuestionWrapper } from "./common.js";
import { createObligatoireToggle, createOptionElement } from "./optionFactory.js";
import { addTexte } from "./textBuilder.js";
import { addRatingScale } from "./ratingBuilder.js";

function createQcmCallbacks(parentCallbacks = {}) {
    const callbacks = { ...parentCallbacks };

    callbacks.onCreateSubQCM = () => {
        const sub = addQCM(true, callbacks);
        sub.classList.add("sub-question");
        return sub;
    };

    callbacks.onCreateSubTexte = () => {
        const sub = addTexte(true, callbacks);
        sub.classList.add("sub-question");
        return sub;
    };

    callbacks.onCreateSubScale = () => {
        const sub = addRatingScale(true, callbacks);
        sub.classList.add("sub-question");
        return sub;
    };

    return callbacks;
}

export function addQCM(isSubQuestion = false, parentCallbacks = {}) {
    const callbacks = createQcmCallbacks(parentCallbacks);
    const { onQuestionRemoved = () => {} } = callbacks;
    let localOptionCounter = 1;

    const { wrapper, questionContent, actionPanel } = createQuestionWrapper();

    if (!isSubQuestion) {
        const titreQCM = document.createElement("textarea");
        titreQCM.classList.add("titreQCM");
        titreQCM.placeholder = "[Titre du QCM]";
        questionContent.appendChild(titreQCM);
        questionContent.appendChild(createObligatoireToggle());
    }

    const listQCM = document.createElement("ul");
    listQCM.classList.add("listQCM");
    questionContent.appendChild(listQCM);

    if (!isSubQuestion) {
        const otherOption = document.createElement("div");
        otherOption.classList.add("other-option");
        otherOption.style.display = "none";

        const otherOptionCheckbox = document.createElement("input");
        otherOptionCheckbox.style.display = "none";
        otherOptionCheckbox.type = "checkbox";
        otherOptionCheckbox.id = `other-option-${Date.now()}`;

        const otherOptionLabel = document.createElement("label");
        otherOptionLabel.style.display = "none";
        otherOptionLabel.textContent = "Ajouter l'option \"Autre (à préciser)\"";
        otherOptionLabel.htmlFor = otherOptionCheckbox.id;

        otherOption.appendChild(otherOptionCheckbox);
        otherOption.appendChild(otherOptionLabel);
        questionContent.appendChild(otherOption);
    }

    const btnAddOption = document.createElement("button");
    btnAddOption.type = "button";
    btnAddOption.classList.add("side-btn", "side-btn-add");
    btnAddOption.textContent = "+";
    btnAddOption.addEventListener("click", () => {
        localOptionCounter++;
        const { li: newOption } = createOptionElement(listQCM, localOptionCounter, callbacks);
        listQCM.appendChild(newOption);
    });

    const btnDeleteQCM = document.createElement("button");
    btnDeleteQCM.type = "button";
    btnDeleteQCM.classList.add("side-btn", "side-btn-delete");
    btnDeleteQCM.textContent = "-";
    btnDeleteQCM.addEventListener("click", () => {
        wrapper.remove();
        onQuestionRemoved();
    });

    actionPanel.appendChild(btnAddOption);
    actionPanel.appendChild(btnDeleteQCM);

    const { li: firstOption } = createOptionElement(listQCM, localOptionCounter, callbacks);
    listQCM.appendChild(firstOption);

    return wrapper;
}
