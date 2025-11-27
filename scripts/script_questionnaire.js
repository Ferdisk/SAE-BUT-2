/**
 * @file script_questionnaire.js
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

    // 1. Conteneur principal 
    const div = document.createElement("div");
    div.classList.add("question-wrapper");

    // 2. Conteneur du QCM (ul)
    const containerQCM = document.createElement("ul");
    containerQCM.classList.add("containerQCM");

    // 3. Liste des options QCM 
    const listQCM = document.createElement("ul");
    listQCM.classList.add("listQCM");

    // Helper interne pour créer une ligne d'option (avec boutons +/- visuels)
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

        // Boutons +/- décoratifs (sans action, juste pour l'alignement)
        const btnAddPlaceholder = document.createElement("button");
        btnAddPlaceholder.type = "button";
        btnAddPlaceholder.classList.add("btn-option", "btn-placeholder");
        btnAddPlaceholder.textContent = "+";
        // TODO: faire le comportement pour le bouton +

        const btnRemovePlaceholder = document.createElement("button");
        btnRemovePlaceholder.type = "button";
        btnRemovePlaceholder.classList.add("btn-option", "btn-placeholder");
        btnRemovePlaceholder.textContent = "-";

        btnRemovePlaceholder.addEventListener('click', () => {
            if (listQCM.children.length > 1) {
                localOptionCounter--;
                li.remove();
            } else {
                alert("Un QCM doit avoir au moins une option.");
            }
        });
        
        textContainer.appendChild(textArea);
        textContainer.appendChild(btnAddPlaceholder);
        textContainer.appendChild(btnRemovePlaceholder);

        li.appendChild(checkbox);
        li.appendChild(textContainer);

        return { li, textContainer };
    };

    // 4. Header avec titre et boutons +/x 
    const headerRow = document.createElement("li");
    headerRow.classList.add("header-row");

    const titreQCM = document.createElement("textarea");
    titreQCM.classList.add("titreQCM");
    titreQCM.placeholder = "Titre du QCM";

    // Bouton + du header 
    const btnAddHeader = document.createElement("button");
    btnAddHeader.type = "button";
    btnAddHeader.classList.add("btn-option", "btn-add");
    btnAddHeader.textContent = "+";

    btnAddHeader.addEventListener('click', () => {
        localOptionCounter++;
        const { li: newOption } = createOptionElement(localOptionCounter);
        listQCM.appendChild(newOption);
    });

    // Bouton × du header 
    const btnDelete = document.createElement("button");
    btnDelete.type = "button";
    btnDelete.classList.add("btn-delete");
    btnDelete.textContent = "×";

    btnDelete.addEventListener('click', () => {
        div.remove();  
        affichemessage();
    });

    // Assemblage du header (titre + boutons côte à côte)
    headerRow.appendChild(titreQCM);
    headerRow.appendChild(btnAddHeader);
    headerRow.appendChild(btnDelete);

    // 5. Création de la première option par défaut
    const { li: firstOption } = createOptionElement(localOptionCounter);

    // 6. Assemblage du containerQCM
    listQCM.appendChild(firstOption);
    containerQCM.appendChild(headerRow);
    containerQCM.appendChild(listQCM);

    // 7. Section "Autre choix"
    const otheroptiondiv = document.createElement("div");
    otheroptiondiv.classList.add("other-option");

    const separator = document.createElement("hr");

    const optionCheckbox = document.createElement("input");
    optionCheckbox.type = "checkbox";
    optionCheckbox.id = `other-option-${Date.now()}`;  // ID unique

    const optionLabel = document.createElement("label");
    optionLabel.textContent = "Autre choix";
    optionLabel.htmlFor = optionCheckbox.id;

    otheroptiondiv.appendChild(separator);
    otheroptiondiv.appendChild(optionCheckbox);
    otheroptiondiv.appendChild(optionLabel);

    // 8. Assemblage final
    div.appendChild(containerQCM);
    div.appendChild(otheroptiondiv);

    document.getElementById("questions-container").appendChild(div);
    affichemessage();
}

/**
 * Ajoute une nouvelle question de type Texte Libre.
 */
function addTexte() {
    // 1. Conteneur principal
    const containerText = document.createElement("ul");
    containerText.classList.add("containerText");

    // 2. Header avec titre + bouton supprimer
    const headerRow = document.createElement("li");
    headerRow.classList.add("header-row");

    const titreQuestion = document.createElement("textarea");
    titreQuestion.classList.add("titreQuestion");
    titreQuestion.placeholder = "Titre de la question texte";

    const btnDelete = document.createElement("button");
    btnDelete.type = "button";
    btnDelete.classList.add("btn-delete");
    btnDelete.textContent = "×";

    btnDelete.addEventListener('click', () => {
        containerText.remove();
        affichemessage();
    });

    // Assemblage du header
    headerRow.appendChild(titreQuestion);
    headerRow.appendChild(btnDelete);

    // 3. Zone de réponse
    const containerReponse = document.createElement("li");
    containerReponse.classList.add("containerReponse");

    const reponseQuestion = document.createElement("textarea");
    reponseQuestion.classList.add("reponseQuestion");
    reponseQuestion.placeholder = "Écrivez votre réponse ici...";

    // 4. Assemblage final
    containerReponse.appendChild(reponseQuestion);
    containerText.appendChild(headerRow);
    containerText.appendChild(containerReponse);

    document.getElementById("questions-container").appendChild(containerText);
    affichemessage();
}

/**
 * Ajoute une question de type Échelle de Notation.
 */
function addRatingScale() {
    const uniqueId = Date.now();

    // 1. Conteneur principal
    const container = document.createElement('ul');
    container.classList.add('containerRating');

    // 2. Header avec titre + bouton supprimer
    const headerRow = document.createElement('li');
    headerRow.classList.add('header-row');

    const titreRating = document.createElement('textarea');
    titreRating.classList.add('titreRating');
    titreRating.placeholder = "Titre de l'échelle de notation";

    const btnDelete = document.createElement('button');
    btnDelete.type = 'button';
    btnDelete.classList.add('btn-delete');
    btnDelete.textContent = '×';

    btnDelete.addEventListener('click', () => {
        container.remove();
        affichemessage();
    });

    // Assemblage du header
    headerRow.appendChild(titreRating);
    headerRow.appendChild(btnDelete);

    // 3. Le Slider (Range)
    const liSlider = document.createElement('li');
    liSlider.classList.add('slider-container');

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.id = `slider-${uniqueId}`;
    slider.min = 0;
    slider.max = 10;
    slider.value = 5;
    slider.classList.add('rating-slider');

    liSlider.appendChild(slider);

    // 4. Conteneur des numéros
    const numbersContainer = document.createElement('div');
    numbersContainer.classList.add('slider-numbers');

    for (let i = 0; i <= 10; i++) {
        const span = document.createElement('span');
        span.textContent = i;
        numbersContainer.appendChild(span);
    }

    // 5. Assemblage final
    liSlider.appendChild(numbersContainer);
    container.appendChild(headerRow);
    container.appendChild(liSlider);

    document.getElementById("questions-container").appendChild(container);
    affichemessage();
}

/**
 * Vérifie si le formulaire contient au moins une question.
 * @returns {boolean}
 */
function hasQuestions() {
    const container = document.getElementById('questions-container');

    if (container && container.children.length > 0) {
        return true;
    }
    return false;
}

/**
 * Met à jour le message d'indication selon la présence de questions.
 */
function affichemessage() {
    // Utilise querySelector pour obtenir UN élément, pas une collection
    const hint = document.querySelector(".hint");

    if (!hint) return;

    if (hasQuestions()) {
        hint.textContent = "";
    } else {
        hint.textContent = "Cliquez sur un type de question pour commencer";
    }
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
    // Boutons de création de questions
    const btnQCM = document.getElementById("btn-qcm");
    const btnTexte = document.getElementById("btn-texte");
    const btnEchelle = document.getElementById("btn-echelle");
    const submitBtn = document.getElementById("submit-btn");

    // Écouteurs pour les boutons de types de questions
    if (btnQCM) {
        btnQCM.addEventListener('click', addQCM);
    }

    if (btnTexte) {
        btnTexte.addEventListener('click', addTexte);
    }

    if (btnEchelle) {
        btnEchelle.addEventListener('click', addRatingScale);
    }

    // Écouteur pour le bouton d'envoi
    if (submitBtn) {
        submitBtn.addEventListener('click', (event) => {
            event.preventDefault();
            handleSubmitAttempt();
        });
    }

    // Affichage initial du message
    affichemessage();
}

document.addEventListener('DOMContentLoaded', initEventListeners);