import { createQuestionWrapper } from "./common.js";
import { createObligatoireToggle } from "./optionFactory.js";

export function addTexte(isSubQuestion = false, callbacks = {}) {
    const { onQuestionRemoved = () => {} } = callbacks;
    const { wrapper, questionContent, actionPanel } = createQuestionWrapper();

    if (!isSubQuestion) {
        const titreQuestion = document.createElement("textarea");
        titreQuestion.classList.add("titreQuestion");
        titreQuestion.placeholder = "[Question Texte]";
        questionContent.appendChild(titreQuestion);
        questionContent.appendChild(createObligatoireToggle());
    }

    const containerReponse = document.createElement("div");
    containerReponse.classList.add("containerReponse");

    const reponseQuestion = document.createElement("textarea");
    reponseQuestion.classList.add("reponseQuestion");
    reponseQuestion.placeholder = "[Réponse]";
    reponseQuestion.maxLength = 100;

    containerReponse.appendChild(reponseQuestion);
    questionContent.appendChild(containerReponse);

    const btnDelete = document.createElement("button");
    btnDelete.type = "button";
    btnDelete.classList.add("side-btn", "side-btn-delete");
    btnDelete.textContent = "-";
    btnDelete.addEventListener("click", () => {
        wrapper.remove();
        onQuestionRemoved();
    });

    actionPanel.appendChild(btnDelete);

    return wrapper;
}
