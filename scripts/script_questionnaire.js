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
function addQCM(isSubQuestion = false) {
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


    // 4. Header (Titre) 
    let titreQCM;
    if (!isSubQuestion) {
        titreQCM = document.createElement("textarea");
        titreQCM.classList.add("titreQCM");
        titreQCM.placeholder = "[Titre du QCM]";
    }

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
        btnSubOption.textContent = ">";

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
                const subQCM = addQCM(true);
		subQCM.classList.add('sub-question');
                li.appendChild(subQCM);
                menu.remove();
            });

            const optionTxt = document.createElement("button");
            optionTxt.textContent = "Sous-question Texte";

            optionTxt.addEventListener('click', () => {
                const subTxt = addTexte(true);
		subTxt.classList.add('sub-question');
                li.appendChild(subTxt);
                menu.remove();
            });

            const optionScale = document.createElement("button");
            optionScale.textContent = "Sous-question Échelle de notation";

            optionScale.addEventListener('click', () => {
                const subScale = addRatingScale(true);
		subScale.classList.add('sub-question');
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

        li.appendChild(btnSubOption);
        li.appendChild(btnRemoveOption);

        return { li, textContainer };
    };


    // 6. Section "Autre choix"
    let otherOption;
    let otherOptionCheckbox;
    let otherOptionLabel;

    if (!isSubQuestion) {
        otherOption = document.createElement("div");
        otherOption.classList.add("other-option");

        otherOptionCheckbox = document.createElement("input");
        otherOptionCheckbox.type = "checkbox";
        otherOptionCheckbox.id = `other-option-${Date.now()}`;

        otherOptionLabel = document.createElement("label");
        otherOptionLabel.textContent = "Ajouter l'option \"Autre (à préciser)\"";
        otherOptionLabel.htmlFor = otherOptionCheckbox.id;

        otherOption.appendChild(otherOptionCheckbox);
        otherOption.appendChild(otherOptionLabel);
    }

    // Assemblage contenu blanc
    if (!isSubQuestion) {
        questionContent.appendChild(titreQCM);
	questionContent.appendChild(createObligatoireToggle());
    }
    questionContent.appendChild(listQCM);
    if (!isSubQuestion) {
        questionContent.appendChild(otherOption);
    }


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
    btnDeleteQCM.textContent = "-";

    btnDeleteQCM.addEventListener('click', () => {
        wrapper.remove();
        affichemessage();
    });

    actionPanel.appendChild(btnAddOption);
    actionPanel.appendChild(btnDeleteQCM);



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
function addTexte(isSubQuestion = false) {

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
    let titreQuestion;
    if (!isSubQuestion) {
        titreQuestion = document.createElement("textarea");
        titreQuestion.classList.add("titreQuestion");
        titreQuestion.placeholder = "[Question Texte]";
    }


    // 5. Zone de réponse à l'intérieur
    const containerReponse = document.createElement("div");
    containerReponse.classList.add("containerReponse");

    const reponseQuestion = document.createElement("textarea");
    reponseQuestion.classList.add("reponseQuestion");
    reponseQuestion.placeholder = "[Réponse]";

    containerReponse.appendChild(reponseQuestion);

    // Assemblage contenu blanc
    if (!isSubQuestion) {
        questionContent.appendChild(titreQuestion);
	questionContent.appendChild(createObligatoireToggle());
    }
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
function addRatingScale(isSubQuestion = false) {
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
    let headerTitleRow;
    let titreRating;

    if (!isSubQuestion) {
        headerTitleRow = document.createElement('div');
        headerTitleRow.classList.add('header-row', 'rating-header');

        titreRating = document.createElement('textarea');
        titreRating.classList.add('titreRating');
        titreRating.placeholder = "[Question échelle de notation]";

        headerTitleRow.appendChild(titreRating);
	headerTitleRow.appendChild(createObligatoireToggle());

    }

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

    const updateSliderFill = () => {
        const percent = (slider.value / slider.max) * 100;
        slider.style.backgroundImage = `linear-gradient(to right, #007bba ${percent}%, #ccc ${percent}%)`;
    };

    updateSliderFill();

    const sliderValueLabel = document.createElement("label");
    sliderValueLabel.classList.add('slider-value');
    sliderValueLabel.textContent = slider.value;

    slider.addEventListener('input', (e) => {
        sliderValueLabel.textContent = e.target.value;
        updateSliderFill();
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
            span.style.left = `calc(8px + (100% - 16px) * ${i / max})`;
            span.style.transform = 'translateX(-50%)';
            numbersContainer.appendChild(span);
        }
        if (max % step !== 0) {
            const span = document.createElement('span');
            span.textContent = max;
            span.style.position = 'absolute';
            span.style.left = `calc(100% - 8px)`;
            span.style.transform = 'translateX(-50%)';
            numbersContainer.appendChild(span);
        }
    };
    generateSliderNumbers(currentMax);

    selectScale.addEventListener('change', (e) => {
        currentMax = parseInt(e.target.value, 10);
        slider.max = currentMax;
        slider.value = Math.floor(currentMax / 2);
        sliderValueLabel.textContent = slider.value;
        updateSliderFill();
        generateSliderNumbers(currentMax);
    });

    sliderRow.appendChild(slider);
    sliderRow.appendChild(numbersContainer);
    sliderRow.appendChild(sliderValueLabel);

    if (!isSubQuestion) {
        questionContent.appendChild(headerTitleRow);
    }
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
	const formReady = getFullForm();
    	sendFormToBDD(formReady);
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

function createObligatoireToggle() {
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

/**
 * Initialise les écouteurs d'événements globaux.
 */
function initEventListeners() {
    // Boutons de création de questions
    const btnQCM = document.getElementById("btn-qcm");
    const btnTexte = document.getElementById("btn-texte");
    const btnEchelle = document.getElementById("btn-echelle");
    const submitBtn = document.getElementById("submit-btn");

    const timeLimitToggle = document.getElementById("time-limit-toggle");
    const timeLimitContent = document.getElementById("time-limit-content");
    const timeLimitDesc = document.getElementById("time-limit-desc-text");

    if (timeLimitToggle) {
        timeLimitToggle.addEventListener("change", (e) => {
            if (e.target.checked) {
                timeLimitContent.style.display = "flex";
                const val = document.querySelector(".time-input").value;
                timeLimitDesc.textContent = `Les étudiants auront ${val} heures pour compléter ce questionnaire à partir de son envoi.`;
            } else {
                timeLimitContent.style.display = "none";
                timeLimitDesc.textContent = "Aucune limite de temps. Les étudiants pourront compléter le questionnaire à leur rythme.";
            }
        });

        const timeInput = document.querySelector(".time-input");
        if (timeInput) {
            timeInput.addEventListener("input", (e) => {
                let val = parseInt(e.target.value, 10);

                if (val > 24) val = 24;
                if (val < 1) val = 1;

                if (val !== parseInt(e.target.value, 10)) {
                    e.target.value = val;
                }

                timeLimitDesc.textContent = `Les étudiants auront ${val} heures pour compléter ce questionnaire à partir de son envoi.`;
            });
        }
    }

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

    document.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'btn-reset') {
            e.preventDefault();
            if (confirm("Êtes-vous sûr de vouloir tout effacer ? Cette action est irréversible.")) {
                const container = document.getElementById('questions-container');
                if (container) {
                    container.innerHTML = '';
                    affichemessage(); // Update empty state message
                }
            }
        }
    });

    affichemessage();
}

document.addEventListener('DOMContentLoaded', initEventListeners);



function getFullForm() {
    const container = document.getElementById('questions-container');
    const questions = [];

    container.querySelectorAll(':scope > .question-wrapper-flex').forEach(wrapper => {
        const result = extractQuestion(wrapper);
        if (result) questions.push(result);
    });

    return {
        titre: document.getElementById('form-titre')?.value || "Sans titre",
        questions: questions
    };
}

function extractQuestion(wrapper) {
    const obligatoireCheckbox = wrapper.querySelector(".question-obligatoire");
    const obligatoire = obligatoireCheckbox ? (obligatoireCheckbox.checked ? 1 : 0) : 1;

    const titreQCM = wrapper.querySelector(":scope > .question-content-white > .titreQCM");
    const titreTexte = wrapper.querySelector(":scope > .question-content-white > .titreQuestion");
    const titreRating = wrapper.querySelector(":scope > .question-content-white > .header-row > .titreRating");

    if (titreQCM) {
        const choix = [];
        wrapper.querySelectorAll(".listQCM > li").forEach(li => {
            const textarea = li.querySelector(".textAreaQuestion");
            if (!textarea || !textarea.value.trim()) return;

            const sous_questions = [];
            li.querySelectorAll(":scope > .question-wrapper-flex").forEach(sub => {
                const subQ = extractQuestion(sub);
                if (subQ) sous_questions.push(subQ);
            });

            choix.push({
                contenu: textarea.value.trim(),
                sous_questions: sous_questions
            });
        });

        return {
            contenu: titreQCM.value.trim(),
            obligatoire: obligatoire,
            type_question_id: 2, 
            choix: choix
        };
    }

    if (titreTexte) {
        return {
            contenu: titreTexte.value.trim(),
            obligatoire: obligatoire,
            type_question_id: 1 
        };
    }

    if (titreRating) {
        return {
            contenu: titreRating.value.trim(),
            obligatoire: obligatoire,
            type_question_id: 3 
        };
    }

    return null;
}


async function sendFormToBDD(formReady) {
    const titre = document.querySelector(".title-box").value.trim();
    const description = document.querySelector(".desc-box")?.value || null;

    const timeToggle = document.getElementById("time-limit-toggle");
    const timeValue = document.querySelector(".time-input")?.value;
    const temps_limite = timeToggle && timeToggle.checked ? parseInt(timeValue, 10) : null;

    const payload = {
        titre,
        description,
        temps_limite,
        questions: formReady.questions
    };

    try {
        const response = await fetch("http://164.81.120.71:3000/form", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.success) {
            alert("Formulaire enregistré avec succès !");
            window.location.href = "http://164.81.120.71/SAE-BUT-2/site/page/profview.html";
        } else {
            alert("Erreur : " + data.message);
        }

    } catch (err) {
        console.error(err);
        alert("Erreur lors de l'envoi au serveur.");
    }
}


document.getElementById("logout-btn").addEventListener("click", async (e) => {
    e.preventDefault();

    try {
        const res = await fetch("http://164.81.120.71:3000/logout", {
            method: "POST",
            credentials: "include"
        });

        const data = await res.json();

        if (data.success) {
            window.location.replace("http://164.81.120.71/SAE-BUT-2/site/login/login.html");
        } else {
            alert("Erreur lors de la déconnexion");
        }
    } catch (err) {
        console.error(err);
        alert("Erreur serveur");
    }

    fetch("http://164.81.120.71:3000/session", { credentials: "include" })
        .then(res => res.json())
        .then(data => {
            if (!data.connected) {
                window.location.replace("http://164.81.120.71/SAE-BUT-2/site/login/login.html");
            }
        });

});

