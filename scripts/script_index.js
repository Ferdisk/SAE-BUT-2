/**
 * @file script_index.js
 * @description Gestion de la logique du constructeur de questionnaire (Builder Panel)
 * et de la prévisualisation.
 */

const ajoutQuestionBtn = document.getElementById('ajout-question-btn');
const formActionsContainer = document.querySelector('.form-actions');
const formActionButtons = formActionsContainer ? formActionsContainer.querySelectorAll('button') : [];

let isBuilderPanelHidden = true;

/**
 * Bascule l'affichage du panneau de construction de questions.
 */
function displayQuestions() {
    const container = document.getElementById("builder-questions-container");
    if (!container) return;

    container.style.display = isBuilderPanelHidden ? 'block' : 'none';
    isBuilderPanelHidden = !isBuilderPanelHidden;
}

/**
 * Ajoute une nouvelle question de type QCM au formulaire.
 */
function addQCM() {
    let localOptionCounter = 1;

    const containerQCM = document.createElement("ul");
    containerQCM.classList.add("containerQCM");

    const titreQCM = document.createElement("textarea");
    titreQCM.classList.add("titreQCM");
    titreQCM.placeholder = "Titre du QCM";

    const listQCM = document.createElement("ul");
    listQCM.classList.add("listQCM");

    // Helper interne pour créer une ligne d'option
    const createOptionElement = (optionIndex) => {
        const li = document.createElement("li");
        li.classList.add("elementQCM");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("caseACocher");

        const textContainer = document.createElement("span");
        textContainer.classList.add("textQuestionContainer");

        const textArea = document.createElement("textarea");
        textArea.classList.add("textAreaQuestion");
        textArea.value = `Choix ${optionIndex}`;

        textContainer.appendChild(textArea);
        li.appendChild(checkbox);
        li.appendChild(textContainer);

        return { li, textContainer };
    };

    // Création de la première option par défaut
    const { li: firstOption, textContainer: firstTextContainer } = createOptionElement(localOptionCounter);

    const btnAddOption = document.createElement("button");
    btnAddOption.type = "button";
    btnAddOption.classList.add("link", "addQuestionText");
    btnAddOption.textContent = "+";

    const btnRemoveOption = document.createElement("button");
    btnRemoveOption.type = "button";
    btnRemoveOption.classList.add("link");
    btnRemoveOption.textContent = "-";

    btnAddOption.addEventListener('click', (e) => {
        e.preventDefault();
        localOptionCounter++;
        const { li: newOption } = createOptionElement(localOptionCounter);
        listQCM.appendChild(newOption);
    });

    btnRemoveOption.addEventListener('click', (e) => {
        e.preventDefault();
        if (listQCM.children.length > 1) {
            localOptionCounter--;
            listQCM.removeChild(listQCM.lastChild);
        } else {
            alert("Un QCM doit avoir au moins une option.");
        }
    });

    // Assemblage
    firstTextContainer.appendChild(btnAddOption);
    firstTextContainer.appendChild(btnRemoveOption);
    
    listQCM.appendChild(firstOption);
    containerQCM.appendChild(titreQCM);
    containerQCM.appendChild(listQCM);

    document.getElementById("questions-container").appendChild(containerQCM);
}

/**
 * Ajoute une nouvelle question de type Texte Libre.
 */
function addTexte() {
    const containerText = document.createElement("ul");
    containerText.classList.add("containerText");

    const titreQuestion = document.createElement("textarea");
    titreQuestion.classList.add("titreQuestion");
    titreQuestion.placeholder = "Titre de la question texte";

    const containerReponse = document.createElement("li");
    containerReponse.classList.add("containerReponse");

    const reponseQuestion = document.createElement("textarea");
    reponseQuestion.classList.add("reponseQuestion");
    reponseQuestion.placeholder = "Écrivez votre réponse ici...";

    containerReponse.appendChild(reponseQuestion);
    containerText.appendChild(titreQuestion);
    containerText.appendChild(containerReponse);

    document.getElementById("questions-container").appendChild(containerText);
}

/**
 * Ajoute une question de type Échelle de Notation.
 * @todo À implémenter (Phase 3)
 */
function addEchelleNotation() {
    //TODO: implémenter la fonction
}

/**
 * Supprime la dernière question ajoutée au conteneur.
 */
function removeLastQuestion() {
    const container = document.getElementById("questions-container");
    if (container?.lastChild) {
        container.removeChild(container.lastChild);
    }
}

/**
 * Vérifie si le formulaire contient au moins une question.
 * @returns {boolean}
 */
function hasQuestions() {
    const container = document.getElementById('questions-container');
    return !!(container && container.children.length > 0);
}

/**
 * Gestionnaire de validation avant envoi.
 */
function handleSubmitAttempt() {
    if (!hasQuestions()) {
        alert("Vous devez insérer des questions pour envoyer");
    } else {
        console.log("Formulaire valide, prêt à être envoyé");
        // TODO: Implémenter l'envoi fetch() ici
    }
}

/**
 * Initialise les écouteurs d'événements globaux.
 */
function initEventListeners() {
    const submitBtn = document.getElementById("submit-btn");
    
    if (submitBtn) {
        submitBtn.addEventListener('click', (event) => {
            event.preventDefault();
            handleSubmitAttempt();
        });
    }
}

document.addEventListener('DOMContentLoaded', initEventListeners);