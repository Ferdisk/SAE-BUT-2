/**
 * @file script_questionnaire.js
 * @description Gestion de la logique du constructeur de questionnaire (Builder Panel)
 * et de la prévisualisation.
 */


const ajoutQuestionBtn = document.getElementById('ajout-question-btn');
const formActionsContainer = document.querySelector('.form-actions');
const formActionButtons = formActionsContainer ? formActionsContainer.querySelectorAll('button') : [];


/**
 * Ajoute une nouvelle question de type QCM au formulaire.
 */
function addQCM() {
    let localOptionCounter = 1;

    // 1. Conteneur principal (Flex wrapper)
    const wrapper = document.createElement("div");
    wrapper.classList.add("question-wrapper-flex");

    // 2. Zone blanche de contenu
    const questionContent = document.createElement("div");
    questionContent.classList.add("question-content-white");

    // 3. Zone d'actions latérale
    const actionPanel = document.createElement("div");
    actionPanel.classList.add("question-actions-side");


    // 4. Header (Titre) - Désormais dans la zone blanche
    // (On ne garde que le titre ici, les boutons vont à côté)
    const titreQCM = document.createElement("textarea");
    titreQCM.classList.add("titreQCM");
    titreQCM.placeholder = "[Titre du QCM]";


    // 5. Liste des options QCM
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
        textArea.placeholder = `[Choix ${optionIndex}]`;

        // Bouton "+" (Sous-question)
        const btnSubOption = document.createElement("button");
        btnSubOption.type = "button";
        btnSubOption.classList.add("btn-option-flat", "btn-sub");
        btnSubOption.textContent = ">"; // Peut être remplacé par une icône

        btnSubOption.addEventListener('click', () => {
            const existinMenu = li.querySelector('.dropdown');
            if (existinMenu) {
                existinMenu.remove();
                return;
            }

            const menu = document.createElement("div");
            menu.classList.add('dropdown');

            const optionQCM = document.createElement("button");
            optionQCM.textContent = "Sous-question QCM";

            optionQCM.addEventListener('click', () => {
                const subQCM = addQCM();
                li.appendChild(subQCM);
                menu.remove();
            });

            const optionTxt = document.createElement("button");
            optionTxt.textContent = "Sous-question Texte";

            optionTxt.addEventListener('click', () => {
                const subTxt = addTexte();
                li.appendChild(subTxt);
                menu.remove();
            });

            const optionScale = document.createElement("button");
            optionScale.textContent = "Sous-question Échelle de notation";

            optionScale.addEventListener('click', () => {
                const subScale = addRatingScale();
                li.appendChild(subScale);
                menu.remove();
            });

            menu.appendChild(optionQCM);
            menu.appendChild(optionTxt);
            menu.appendChild(optionScale);

            li.appendChild(menu);
        });

        // Bouton "-" (Supprimer l'option)
        const btnRemoveOption = document.createElement("button");
        btnRemoveOption.type = "button";
        btnRemoveOption.classList.add("btn-option-flat", "btn-remove");
        btnRemoveOption.textContent = "-";

        btnRemoveOption.addEventListener('click', () => {
            if (listQCM.children.length > 1) {
                li.remove();
            } else {
                alert("Un QCM doit avoir au moins une option.");
            }
        });

        textContainer.appendChild(textArea);

        li.appendChild(checkbox);
        li.appendChild(textContainer);
        // Les boutons sub/remove restent à côté de l'option (interne) ou externe ? 
        // Le screenshot montre +/- à droite de CHAQUE option.
        // Donc on les ajoute à la ligne
        li.appendChild(btnSubOption);
        li.appendChild(btnRemoveOption);

        return { li, textContainer };
    };


    // 6. Section "Autre choix"
    const otheroptiondiv = document.createElement("div");
    otheroptiondiv.classList.add("other-option"); // Css pour alignement

    const optionCheckbox = document.createElement("input");
    optionCheckbox.type = "checkbox";
    optionCheckbox.id = `other-option-${Date.now()}`;

    const optionLabel = document.createElement("label");
    optionLabel.textContent = "Ajouter l'option \"Autre (à préciser)\"";
    optionLabel.htmlFor = optionCheckbox.id;

    otheroptiondiv.appendChild(optionCheckbox);
    otheroptiondiv.appendChild(optionLabel);


    // Assemblage contenu blanc
    questionContent.appendChild(titreQCM);
    questionContent.appendChild(listQCM);
    questionContent.appendChild(otheroptiondiv);


    // 7. Boutons d'actions GLOBALES (Côté droit)

    // Bouton "+" (Ajouter une option au QCM)
    const btnAddOption = document.createElement("button");
    btnAddOption.type = "button";
    btnAddOption.classList.add("side-btn", "side-btn-add");
    btnAddOption.textContent = "+";

    btnAddOption.addEventListener('click', () => {
        localOptionCounter++;
        const { li: newOption } = createOptionElement(localOptionCounter);
        listQCM.appendChild(newOption);
    });

    // Bouton "x" (Supprimer le QCM entier)
    const btnDeleteQCM = document.createElement("button");
    btnDeleteQCM.type = "button";
    btnDeleteQCM.classList.add("side-btn", "side-btn-delete");
    btnDeleteQCM.textContent = "-"; // Le screenshot montre un tiret rouge (-)

    btnDeleteQCM.addEventListener('click', () => {
        wrapper.remove();
        affichemessage();
    });

    actionPanel.appendChild(btnDeleteQCM); // Le delete est souvent en haut
    actionPanel.appendChild(btnAddOption); // L'ajout d'option en dessous ou au niveau des options


    // 8. Initialisation
    const { li: firstOption } = createOptionElement(localOptionCounter);
    listQCM.appendChild(firstOption);

    // Assemblage final
    wrapper.appendChild(questionContent);
    wrapper.appendChild(actionPanel);

    return wrapper;
}

/**
 * Ajoute une nouvelle question de type Texte Libre.
 */
/**
 * Ajoute une nouvelle question de type Texte Libre.
 */
function addTexte() {
    // 1. Conteneur principal (Flex wrapper)
    const wrapper = document.createElement("div");
    wrapper.classList.add("question-wrapper-flex");

    // 2. Zone blanche de contenu
    const questionContent = document.createElement("div");
    questionContent.classList.add("question-content-white");

    // 3. Zone d'actions latérale
    const actionPanel = document.createElement("div");
    actionPanel.classList.add("question-actions-side");

    // 4. Titre de la question à l'intérieur
    const titreQuestion = document.createElement("textarea");
    titreQuestion.classList.add("titreQuestion");
    titreQuestion.placeholder = "[Question Texte]";

    // 5. Zone de réponse à l'intérieur
    const containerReponse = document.createElement("div");
    containerReponse.classList.add("containerReponse");

    const reponseQuestion = document.createElement("textarea");
    reponseQuestion.classList.add("reponseQuestion");
    reponseQuestion.placeholder = "[Réponse]";

    containerReponse.appendChild(reponseQuestion);

    // Assemblage contenu blanc
    questionContent.appendChild(titreQuestion);
    questionContent.appendChild(containerReponse);


    // 6. Bouton "x" (Supprimer) dans le panneau latéral
    const btnDelete = document.createElement("button");
    btnDelete.type = "button";
    btnDelete.classList.add("side-btn", "side-btn-delete");
    btnDelete.textContent = "-";

    btnDelete.addEventListener('click', () => {
        wrapper.remove();
        affichemessage();
    });

    actionPanel.appendChild(btnDelete);

    // 7. Assemblage final
    wrapper.appendChild(questionContent);
    wrapper.appendChild(actionPanel);

    return wrapper;
}

/**
 * Ajoute une question de type Échelle de Notation.
 * @returns {HTMLElement} Le conteneur de la question
 */
function addRatingScale() {
    const uniqueId = Date.now();
    let currentMax = 10;

    // 1. Conteneur principal (Flex wrapper)
    const wrapper = document.createElement("div");
    wrapper.classList.add("question-wrapper-flex");

    // 2. Zone blanche de contenu
    const questionContent = document.createElement("div");
    questionContent.classList.add("question-content-white");

    // 3. Zone d'actions latérale
    const actionPanel = document.createElement("div");
    actionPanel.classList.add("question-actions-side");


    // 4. Titre + Select (Header interne)
    const headerTitleRow = document.createElement('div');
    headerTitleRow.classList.add('header-row', 'rating-header');

    const titreRating = document.createElement('textarea');
    titreRating.classList.add('titreRating');
    titreRating.placeholder = "[Question échelle de notation]";

    headerTitleRow.appendChild(titreRating);

    // Select Scale 
    const headerScaleRow = document.createElement('div');
    headerScaleRow.classList.add('header-row');

    const labelScale = document.createElement('label');
    labelScale.textContent = 'Notation sur : ';
    labelScale.htmlFor = `select-scale-${uniqueId}`;

    const selectScale = document.createElement('select');
    selectScale.id = `select-scale-${uniqueId}`;
    selectScale.classList.add('select-scale');

    [5, 10, 20, 50, 100].forEach((value, index) => {
        const opt = document.createElement('option');
        opt.value = value;
        opt.textContent = value;
        if (value === 10) opt.selected = true;
        selectScale.appendChild(opt);
    });

    headerScaleRow.appendChild(labelScale);
    headerScaleRow.appendChild(selectScale);


    // 5. Conteneur du slider
    const sliderRow = document.createElement('div');
    sliderRow.classList.add('slider-container');

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.id = `slider-${uniqueId}`;
    slider.min = 0;
    slider.max = currentMax;
    slider.value = Math.floor(currentMax / 2);
    slider.classList.add('rating-slider');

    const sliderValueLabel = document.createElement("label");
    sliderValueLabel.classList.add('slider-value');
    sliderValueLabel.textContent = slider.value;

    slider.addEventListener('input', (e) => {
        sliderValueLabel.textContent = e.target.value;
    });

    const numbersContainer = document.createElement('div');
    numbersContainer.classList.add('slider-numbers');

    const generateSliderNumbers = (max) => {
        numbersContainer.innerHTML = '';
        numbersContainer.style.position = 'relative';
        const step = max <= 10 ? 1 : Math.ceil(max / 10);
        for (let i = 0; i <= max; i += step) {
            const span = document.createElement('span');
            span.textContent = i;
            span.style.position = 'absolute';
            span.style.left = `${(i / max) * 100}%`;
            span.style.transform = 'translateX(-50%)';
            numbersContainer.appendChild(span);
        }
        if (max % step !== 0) {
            const span = document.createElement('span');
            span.textContent = max;
            span.style.position = 'absolute';
            span.style.left = '100%';
            span.style.transform = 'translateX(-50%)';
            numbersContainer.appendChild(span);
        }
    };
    generateSliderNumbers(currentMax);

    selectScale.addEventListener('change', (e) => {
        currentMax = parseInt(e.target.value, 10);
        slider.max = currentMax;
        slider.value = Math.floor(currentMax / 2);
        generateSliderNumbers(currentMax);
    });

    sliderRow.appendChild(slider);
    sliderRow.appendChild(numbersContainer);
    // sliderRow.appendChild(sliderValueLabel); // Optionnel si on veut la valeur courante affichée

    // Assemblage contenu blanc
    questionContent.appendChild(headerTitleRow);
    questionContent.appendChild(headerScaleRow);
    questionContent.appendChild(sliderRow);


    // 6. Bouton "x" (Supprimer) latéral
    const btnDelete = document.createElement('button');
    btnDelete.type = 'button';
    btnDelete.classList.add('side-btn', 'side-btn-delete');
    btnDelete.textContent = '-';

    btnDelete.addEventListener('click', () => {
        wrapper.remove();
        affichemessage();
    });

    actionPanel.appendChild(btnDelete);

    // 7. Assemblage final
    wrapper.appendChild(questionContent);
    wrapper.appendChild(actionPanel);

    return wrapper;
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
    // Récupère l'élément du titre et sa valeur (si présent)
    const titleElement = document.querySelector(".title-box");
    const titleBox = titleElement ? titleElement.value : "";

    if (!hasQuestions()) {
        // Pas de questions insérées
        alert("Vous devez insérer des questions pour envoyer");
    } else if (!answersValidation()) {
        // Certaines zones de configuration sont vides
        alert("Certaines zones de texte sont vides, veuillez les remplir.");
    } else if (titleBox.trim().length === 0) {
        // Titre vide
        alert("Votre titre ne doit pas être vide");
    } else {
        // Tout est valide
        alert("Formulaire valide, prêt à être envoyé");
        // TODO: Implémenter l'envoi fetch() ici 
    }
}

function answersValidation() {
    //  Sélectionne uniquement les champs de CONFIGURATION de la question
    const textAreasToValidate = document.querySelectorAll(".titreQCM, .titreQuestion, .titreRating, .textAreaQuestion");

    for (const element of textAreasToValidate) {
        if (element.value.trim().length === 0) {
            element.style.border = "1px solid red";
            return false;
        } else {
            element.style.border = "";
        }
    }
    return true;
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
        btnQCM.addEventListener('click', () => {
            const qcm = addQCM();
            document.getElementById("questions-container").appendChild(qcm);
            affichemessage();
        });
    }

    if (btnTexte) {
        btnTexte.addEventListener('click', () => {
            const txt = addTexte();
            document.getElementById("questions-container").appendChild(txt);
            affichemessage();
        });
    }

    if (btnEchelle) {
        btnEchelle.addEventListener('click', () => {
            const scale = addRatingScale();
            document.getElementById("questions-container").appendChild(scale);
            affichemessage();
        });
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


/**
 * Sauvegarde la structure du formulaire au format JSON pour l'expoter vers la BDD
 */
function getFormStructure() {
    const container = document.getElementById('questions-container');
    const questions = [];

    // Parcourir chaque enfant direct du container
    container.querySelectorAll('.question-wrapper, .containerText, .containerRating').forEach(element => {
        // TODO: Identifier le type de question
        // TODO: Extraire les données
        // TODO: Ajouter à questions[]
    });

    return {
        dateCreation: new Date().toISOString(),
        questions: questions
    };
}