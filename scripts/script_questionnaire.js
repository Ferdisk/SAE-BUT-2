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

    // 1. Conteneur principal 
    const div = document.createElement("div");
    div.classList.add("question-wrapper", "container-question");

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

        // Boutons +/- 
        const btnAddPlaceholder = document.createElement("button");
        btnAddPlaceholder.type = "button";
        btnAddPlaceholder.classList.add("btn-option", "btn-placeholder");
        btnAddPlaceholder.textContent = ">";

        btnAddPlaceholder.addEventListener('click', () => {
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

        })

        

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

    return div;
}

/**
 * Ajoute une nouvelle question de type Texte Libre.
 */
function addTexte() {
    // 1. Conteneur principal
    const containerText = document.createElement("ul");
    containerText.classList.add("containerText", "container-question");

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

    return containerText;
}

/**
 * Ajoute une question de type Échelle de Notation.
 * @returns {HTMLElement} Le conteneur de la question
 */
function addRatingScale() {
    const uniqueId = Date.now();
    let currentMax = 10; 

    // 1. Conteneur principal
    const container = document.createElement('ul');
    container.classList.add('containerRating', "container-question");

    // 2. Header avec titre + bouton supprimer
    const headerTitleRow = document.createElement('li');
    headerTitleRow.classList.add('header-row');

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

    headerTitleRow.appendChild(titreRating);
    headerTitleRow.appendChild(btnDelete);

    // 3. Header avec sélection de l'échelle
    const headerScaleRow = document.createElement('li');
    headerScaleRow.classList.add('header-row');

    const labelScale = document.createElement('label');
    labelScale.textContent = 'Notation sur : ';
    labelScale.htmlFor = `select-scale-${uniqueId}`;

    const selectScale = document.createElement('select');
    selectScale.id = `select-scale-${uniqueId}`;
    selectScale.classList.add('select-scale');

    // Options du select (sans option vide par défaut)
    [5, 10, 20, 50, 100].forEach((value, index) => {
        const opt = document.createElement('option');
        opt.value = value;
        opt.textContent = value;
        if (value === 10) opt.selected = true; 
        selectScale.appendChild(opt);
    });

    headerScaleRow.appendChild(labelScale);
    headerScaleRow.appendChild(selectScale);

    // 4. Conteneur du slider
    const sliderRow = document.createElement('li');
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


    // 5. Conteneur des numéros (labels visuels)
    const numbersContainer = document.createElement('div');
    numbersContainer.classList.add('slider-numbers');

    /**
     * Génère les labels numériques sous le slider
     * @param {number} max - Valeur maximale de l'échelle
     */
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

    // Génération initiale des numéros
    generateSliderNumbers(currentMax);

    // 6. Listener pour mettre à jour le slider quand le select change
    selectScale.addEventListener('change', (e) => {
        currentMax = parseInt(e.target.value, 10);
        slider.max = currentMax;
        slider.value = Math.floor(currentMax / 2); // Recentrer le curseur
        generateSliderNumbers(currentMax);
    });

    // 7. Assemblage du sliderRow
    sliderRow.appendChild(slider);
    sliderRow.appendChild(numbersContainer);
    sliderRow.appendChild(sliderValueLabel);


    // 8. Assemblage final du container
    container.appendChild(headerTitleRow);
    container.appendChild(headerScaleRow);
    container.appendChild(sliderRow);

    return container;
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