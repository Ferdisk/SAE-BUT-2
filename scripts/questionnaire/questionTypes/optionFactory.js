export function createObligatoireToggle() {
    const div = document.createElement("div");
    div.classList.add("obligatoire-container");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("question-obligatoire");
    checkbox.checked = true;

    const label = document.createElement("label");
    label.textContent = "Question obligatoire";

    div.appendChild(checkbox);
    div.appendChild(label);

    return div;
}

export function createOptionElement(listQCM, optionIndex, callbacks = {}) {
    const {
        onQuestionRemoved = () => {},
        onCreateSubQCM = () => null,
        onCreateSubTexte = () => null,
        onCreateSubScale = () => null
    } = callbacks;

    const li = document.createElement("li");
    li.classList.add("elementQCM");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("caseACocher");

    const textContainer = document.createElement("span");
    textContainer.classList.add("textQuestionContainer");

    const textArea = document.createElement("textarea");
    textArea.classList.add("textAreaQuestion");
    textArea.placeholder = `[Choix ${optionIndex}]`;

    const btnSubOption = document.createElement("button");
    btnSubOption.type = "button";
    btnSubOption.classList.add("btn-option-flat", "btn-sub");
    btnSubOption.textContent = ">";

    btnSubOption.addEventListener("click", () => {
        const existingMenu = li.querySelector(".dropdown");
        if (existingMenu) {
            existingMenu.remove();
            return;
        }

        const menu = document.createElement("div");
        menu.classList.add("dropdown");

        const optionQCM = document.createElement("button");
        optionQCM.textContent = "Sous-question QCM";
        optionQCM.addEventListener("click", () => {
            const sub = onCreateSubQCM();
            if (sub) li.appendChild(sub);
            menu.remove();
        });

        const optionTxt = document.createElement("button");
        optionTxt.textContent = "Sous-question Texte";
        optionTxt.addEventListener("click", () => {
            const sub = onCreateSubTexte();
            if (sub) li.appendChild(sub);
            menu.remove();
        });

        const optionScale = document.createElement("button");
        optionScale.textContent = "Sous-question Échelle de notation";
        optionScale.addEventListener("click", () => {
            const sub = onCreateSubScale();
            if (sub) li.appendChild(sub);
            menu.remove();
        });

        menu.appendChild(optionQCM);
        menu.appendChild(optionTxt);
        menu.appendChild(optionScale);
        li.appendChild(menu);
    });

    const btnRemoveOption = document.createElement("button");
    btnRemoveOption.type = "button";
    btnRemoveOption.classList.add("btn-option-flat", "btn-remove");
    btnRemoveOption.textContent = "-";
    btnRemoveOption.addEventListener("click", () => {
        if (listQCM.children.length > 1) {
            li.remove();
            onQuestionRemoved();
        } else {
            alert("Un QCM doit avoir au moins une option.");
        }
    });

    textContainer.appendChild(textArea);
    li.appendChild(checkbox);
    li.appendChild(textContainer);
    li.appendChild(btnSubOption);
    li.appendChild(btnRemoveOption);

    return { li, textContainer };
}
