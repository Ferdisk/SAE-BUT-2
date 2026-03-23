/**
 * @file script_questionnaire.js
 * @description Gestion de la logique du constructeur de questionnaire (Builder Panel)
 * et de la prévisualisation.
 */


const ajoutQuestionBtn = document.getElementById('ajout-question-btn');
const formActionsContainer = document.querySelector('.form-actions');
const formActionButtons = formActionsContainer ? formActionsContainer.querySelectorAll('button') : [];

let currentFormId = null;
let currentFormEtat = null;
let questionnairesProf = [];
let etatFilters = [{ value: "__all__", label: "Tous" }];
let selectedEtatFilterValue = "__all__";

function normalizeEtat(value) {
    return String(value || "").trim().toLowerCase();
}

function formatEtat(value) {
    const text = String(value || "").trim();
    return text ? text.charAt(0).toUpperCase() + text.slice(1) : "Inconnu";
}

function renderEtatFilterSelect() {
    const select = document.getElementById("state-filter-select");
    if (!select) return;

    select.innerHTML = "";

    etatFilters.forEach((filter) => {
        const option = document.createElement("option");
        option.value = filter.value;
        option.textContent = filter.label;
        select.appendChild(option);
    });

    if (!etatFilters.some((filter) => filter.value === selectedEtatFilterValue)) {
        selectedEtatFilterValue = "__all__";
    }

    select.value = selectedEtatFilterValue;
}

function setupEtatFilters(questionnaires) {
    const etatMap = new Map();
    const etatOrder = ["envoye", "brouillon", "archive", "ferme", "actif"];

    questionnaires.forEach((q) => {
        const normalized = normalizeEtat(q.etat);
        if (!normalized) return;
        if (!etatMap.has(normalized)) {
            etatMap.set(normalized, formatEtat(q.etat));
        }
    });

    const sortedEtats = Array.from(etatMap.entries()).sort((a, b) => {
        const indexA = etatOrder.indexOf(a[0]);
        const indexB = etatOrder.indexOf(b[0]);

        const hasPriorityA = indexA !== -1;
        const hasPriorityB = indexB !== -1;

        if (hasPriorityA && hasPriorityB) return indexA - indexB;
        if (hasPriorityA) return -1;
        if (hasPriorityB) return 1;

        return a[1].localeCompare(b[1], "fr");
    });

    etatFilters = [{ value: "__all__", label: "Tous" }, ...sortedEtats.map(([value, label]) => ({ value, label }))];
    selectedEtatFilterValue = "__all__";
    renderEtatFilterSelect();
}

function getFilteredQuestionnaires() {
    if (selectedEtatFilterValue === "__all__") {
        return questionnairesProf;
    }

    return questionnairesProf.filter((q) => normalizeEtat(q.etat) === selectedEtatFilterValue);
}

function applyEtatFilter() {
    afficherQuestionnairesProf(getFilteredQuestionnaires());
}

function createOptionElement(listQCM, optionIndex) {
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
}

function addQCM(isSubQuestion = false) {
    let localOptionCounter = 1;

    const wrapper = document.createElement("div");
    wrapper.classList.add("question-wrapper-flex");

    const questionContent = document.createElement("div");
    questionContent.classList.add("question-content-white");

    const actionPanel = document.createElement("div");
    actionPanel.classList.add("question-actions-side");

    let titreQCM;
    if (!isSubQuestion) {
        titreQCM = document.createElement("textarea");
        titreQCM.classList.add("titreQCM");
        titreQCM.placeholder = "[Titre du QCM]";
    }

    const listQCM = document.createElement("ul");
    listQCM.classList.add("listQCM");


    let otherOption;
    let otherOptionCheckbox;
    let otherOptionLabel;

    if (!isSubQuestion) {
        otherOption = document.createElement("div");
        otherOption.classList.add("other-option");
        otherOption.style.display = "none";

        otherOptionCheckbox = document.createElement("input");
        otherOptionCheckbox.style.display = "none";
        otherOptionCheckbox.type = "checkbox";
        otherOptionCheckbox.id = `other-option-${Date.now()}`;

        otherOptionLabel = document.createElement("label");
	otherOptionLabel.style.display = "none";
        otherOptionLabel.textContent = "Ajouter l'option \"Autre (à préciser)\"";
        otherOptionLabel.htmlFor = otherOptionCheckbox.id;

        otherOption.appendChild(otherOptionCheckbox);
        otherOption.appendChild(otherOptionLabel);
    }

    if (!isSubQuestion) {
        questionContent.appendChild(titreQCM);
	questionContent.appendChild(createObligatoireToggle());
    }
    questionContent.appendChild(listQCM);
    if (!isSubQuestion) {
        questionContent.appendChild(otherOption);
    }

    const btnAddOption = document.createElement("button");
    btnAddOption.type = "button";
    btnAddOption.classList.add("side-btn", "side-btn-add");
    btnAddOption.textContent = "+";

    btnAddOption.addEventListener('click', () => {
        localOptionCounter++;
        const { li: newOption } = createOptionElement(listQCM, localOptionCounter);
        listQCM.appendChild(newOption);
    });

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


    const { li: firstOption } = createOptionElement(listQCM, localOptionCounter);
    listQCM.appendChild(firstOption);

    wrapper.appendChild(questionContent);
    wrapper.appendChild(actionPanel);

    return wrapper;
}

function addTexte(isSubQuestion = false) {

    const wrapper = document.createElement("div");
    wrapper.classList.add("question-wrapper-flex");

    const questionContent = document.createElement("div");
    questionContent.classList.add("question-content-white");

    const actionPanel = document.createElement("div");
    actionPanel.classList.add("question-actions-side");

    let titreQuestion;
    if (!isSubQuestion) {
        titreQuestion = document.createElement("textarea");
        titreQuestion.classList.add("titreQuestion");
        titreQuestion.placeholder = "[Question Texte]";
    }


    const containerReponse = document.createElement("div");
    containerReponse.classList.add("containerReponse");

    const reponseQuestion = document.createElement("textarea");
    reponseQuestion.classList.add("reponseQuestion");
    reponseQuestion.placeholder = "[Réponse]";
    reponseQuestion.maxLength = 100;

    containerReponse.appendChild(reponseQuestion);

    if (!isSubQuestion) {
        questionContent.appendChild(titreQuestion);
	questionContent.appendChild(createObligatoireToggle());
    }
    questionContent.appendChild(containerReponse);

    const btnDelete = document.createElement("button");
    btnDelete.type = "button";
    btnDelete.classList.add("side-btn", "side-btn-delete");
    btnDelete.textContent = "-";

    btnDelete.addEventListener('click', () => {
        wrapper.remove();
        affichemessage();
    });

    actionPanel.appendChild(btnDelete);

    wrapper.appendChild(questionContent);
    wrapper.appendChild(actionPanel);

    return wrapper;
}

function addRatingScale(isSubQuestion = false) {
    const uniqueId = Date.now();
    let currentMax = 10;

    const wrapper = document.createElement("div");
    wrapper.classList.add("question-wrapper-flex");

    const questionContent = document.createElement("div");
    questionContent.classList.add("question-content-white");

    const actionPanel = document.createElement("div");
    actionPanel.classList.add("question-actions-side");

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

    const btnDelete = document.createElement('button');
    btnDelete.type = 'button';
    btnDelete.classList.add('side-btn', 'side-btn-delete');
    btnDelete.textContent = '-';

    btnDelete.addEventListener('click', () => {
        wrapper.remove();
        affichemessage();
    });

    actionPanel.appendChild(btnDelete);

    wrapper.appendChild(questionContent);
    wrapper.appendChild(actionPanel);

    return wrapper;
}

function hasQuestions() {
    const container = document.getElementById('questions-container');

    if (container && container.children.length > 0) {
        return true;
    }
    return false;
}

function affichemessage() {

    const hint = document.querySelector(".hint");

    if (!hint) return;

    if (hasQuestions()) {
        hint.textContent = "";
    } else {
        hint.textContent = "Cliquez sur un type de question pour commencer";
    }
}

function handleSubmitAttempt() {
    const titleElement = document.querySelector(".title-box");
    const titleBox = titleElement ? titleElement.value : "";

    if (!hasQuestions()) {
        alert("Vous devez insérer des questions pour envoyer");
    } else if (!answersValidation()) {
        alert("Certaines zones de texte sont vides, veuillez les remplir.");
    } else if (titleBox.trim().length === 0) {
        alert("Votre titre ne doit pas être vide");
    } else {
        alert("Formulaire valide, prêt à être sauvegardé");
	const formReady = getFullForm();
    	sendFormToBDD(formReady);
    }
}

function answersValidation() {
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

function initEventListeners() {
    const btnQCM = document.getElementById("btn-qcm");
    const btnTexte = document.getElementById("btn-texte");
    const btnEchelle = document.getElementById("btn-echelle");
    const submitBtn = document.getElementById("submit-btn");
    const saveBtn = document.getElementById("save-btn");

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

    if (saveBtn) {
        saveBtn.addEventListener('click', (event) => {
            event.preventDefault();
            handleSubmitAttempt();
        });
    }

    if (submitBtn) {
        submitBtn.addEventListener("click", async () => {
            if (!currentFormId) return;

            if (!confirm("Envoyer définitivement ce questionnaire ?")) return;

            const res = await fetch(`/questionnaire/send/${currentFormId}`, {
                method: "PUT",
                credentials: "include"
            });

            const data = await res.json();

            if (data.success) {
                alert("Formulaire envoyé");
                window.location.href = "/prof";
            } else {
                alert(data.message);
            }
        });
    }

    const updateBtn = document.getElementById("update-btn");

    if (updateBtn) {
        updateBtn.addEventListener("click", async () => {
            if (!currentFormId) return;

            if (!hasQuestions() || !answersValidation()) {
                alert("Formulaire invalide");
                return;
            }

            const formReady = getFullForm();
            await updateFormInBDD(formReady);
        });
    }

    document.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'btn-reset') {
            e.preventDefault();
            if (confirm("Êtes-vous sûr de vouloir tout effacer ? Cette action est irréversible.")) {
                const container = document.getElementById('questions-container');
                if (container) {
                    container.innerHTML = '';
                    affichemessage(); 
                }
            }
        }
    });

    affichemessage();
}

document.addEventListener('DOMContentLoaded', initEventListeners);

document.addEventListener("DOMContentLoaded", () => {
    const parts = window.location.pathname.split("/");
    const id = parts[parts.length - 1];

    if (id && !isNaN(id)) {
	currentFormId = id;
        loadQuestionnaire(id);
    }
});

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
    // Si obligatoireCheckbox existe : obligatoire = 1 si cochée, sinon 0 ; si elle n'existe pas : obligatoire = 1.
    const obligatoire = obligatoireCheckbox ? (obligatoireCheckbox.checked ? 1 : 0) : 1;

    const isSubQuestion = wrapper.classList.contains('sub-question');

    // Récupérer l'ID de la question stocké dans le wrapper (si présent)
    const questionId = wrapper.dataset.questionId ? parseInt(wrapper.dataset.questionId, 10) : null;

    const titreQCM = wrapper.querySelector(":scope > .question-content-white > .titreQCM");
    const titreTexte = wrapper.querySelector(":scope > .question-content-white > .titreQuestion");
    const titreRating = wrapper.querySelector(":scope > .question-content-white > .header-row > .titreRating");

    const listQCM = wrapper.querySelector(":scope > .question-content-white > .listQCM");

    if (titreQCM || (isSubQuestion && listQCM)) {
        const choix = [];
        wrapper.querySelectorAll(":scope > .question-content-white > .listQCM > li").forEach(li => {
            const textarea = li.querySelector(".textAreaQuestion");
            if (!textarea || !textarea.value.trim()) return;

            // Récupérer l'ID du choix stocké dans le li (si présent)
            const choixId = li.dataset.choixId ? parseInt(li.dataset.choixId, 10) : null;

            const sous_questions = [];
            li.querySelectorAll(":scope > .question-wrapper-flex").forEach(sub => {
                const subResult = extractQuestion(sub);
                if (subResult) sous_questions.push(subResult);
            });

            const choixObj = {
                contenu: textarea.value.trim(),
                sous_questions: sous_questions
            };
            if (choixId) choixObj.id = choixId;
            choix.push(choixObj);
        });

        const result = {
            contenu: titreQCM ? titreQCM.value.trim() : "Sous-QCM",
            obligatoire: obligatoire,
            type_question_id: 2,
            choix: choix
        };
        if (questionId) result.id = questionId;
        return result;
    }

    const containerReponse = wrapper.querySelector(":scope > .question-content-white > .containerReponse");

    if (titreTexte || (isSubQuestion && containerReponse && !listQCM)) {
        const result = {
            contenu: titreTexte ? titreTexte.value.trim() : "Sous-question Texte",
            obligatoire: obligatoire,
            type_question_id: 1
        };
        if (questionId) result.id = questionId;
        return result;
    }

    const sliderContainer = wrapper.querySelector(":scope > .question-content-white > .slider-container");

    if (titreRating || (isSubQuestion && sliderContainer)) {
        const selectScale = wrapper.querySelector(".select-scale");
        const echelleMax = selectScale ? parseInt(selectScale.value, 10) : 10;

        const result = {
            contenu: titreRating ? titreRating.value.trim() : "Sous-question Échelle",
            obligatoire: obligatoire,
            type_question_id: 3,
            echelle_max: echelleMax
        };
        if (questionId) result.id = questionId;
        return result;
    }

    return null;
}


async function sendFormToBDD(formReady) {
    const titreInput = document.getElementById("form-titre") || document.querySelector(".title-box");
    const descInput = document.querySelector(".desc-box");
    
    const titre = titreInput ? titreInput.value.trim() : "Sans titre";
    const description = descInput ? descInput.value.trim() : "";

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
            alert("Formulaire et questions sauvegardés avec succès !");
            window.location.href = "/prof";
        } else {
            alert("Erreur technique : " + data.message);
        }
    } catch (err) {
        console.error("Erreur : ", err);
        alert("Impossible de contacter le serveur.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const listContainer = document.getElementById("questionnaires-list");
    if (!listContainer) return;

    const filterSelect = document.getElementById("state-filter-select");
    if (filterSelect) {
        filterSelect.addEventListener("change", (event) => {
            selectedEtatFilterValue = event.target.value || "__all__";
            applyEtatFilter();
        });
    }

    const urlParams = new URLSearchParams(window.location.search);
    const authorId = urlParams.get('authorId');

    chargerQuestionnairesProf(authorId);
});

async function chargerQuestionnairesProf(authorId = null) {
    try {
        let url = "/listForms";
        if (authorId) {
            url = `/listForms?authorId=${authorId}`;
        }

        const res = await fetch(url, {
            credentials: "include"
        });

        const data = await res.json();

        if (!data.success) {
            alert("Erreur lors du chargement des questionnaires");
            return;
        }

        questionnairesProf = Array.isArray(data.questionnaires) ? data.questionnaires : [];
        setupEtatFilters(questionnairesProf);
        applyEtatFilter();
    } catch (err) {
        console.error(err);
        alert("Erreur serveur");
    }
}

function afficherQuestionnairesProf(questionnaires) {
    const container = document.getElementById("questionnaires-list");
    container.innerHTML = "";

    if (questionnaires.length === 0) {
        container.innerHTML = "<p>Aucun questionnaire créé.</p>";
        return;
    }

    questionnaires.forEach(q => {
        const div = document.createElement("div");
        div.className = "questionnaire-card";

        div.innerHTML = `
            <h3>${q.titre}</h3>
	    <p>Code formulaire : ${q.lien_formulaire || "Aucun code"}</p>
            <p>${q.description || "Aucune description"}</p>
            <small>Créé le : ${new Date(q.date_creation).toLocaleDateString()}</small>
            <br>
            <strong>État :</strong> ${q.etat}
            <div class="actions">
                <button class="btn-blue btn-view" data-id="${q.id}">Voir</button>
		<button class="btn-blue btn-qrcode">QR Code</button>
		<button class="btn-blue btn-tracking" data-id="${q.id}">Suivi des étudiants</button>
		<button class="btn-blue btn-export" data-id="${q.id}">Exporter les réponses</button>
                <button class="btn-blue btn-stat" data-id="${q.id}">Stats</button>
                <button class="btn-red btn-delete" date-id="${q.id}">Supprimer</button>
            </div>
        `;

	const btnQRCode = div.querySelector(".btn-qrcode");
	btnQRCode.addEventListener("click", () => {
    	    if (!q.lien_formulaire) return alert("Ce questionnaire n'a pas encore de code.");

    	    if (window.openQRCodeModal) {
        	window.openQRCodeModal(q.lien_formulaire);
    	    }
	});

	const btnTracking = div.querySelector(".btn-tracking");
    	btnTracking.addEventListener("click", () => {
        	window.location.href = `/suivi/${q.id}`;
    	});

	const btnDelete = div.querySelector(".btn-delete");

	btnDelete.addEventListener("click", async () => {
    	    const confirmDelete = confirm(`Voulez-vous vraiment supprimer le questionnaire "${q.titre}" ?`);

    	    if (!confirmDelete) return;

    	    try {
                const res = await fetch(`/questionnaire/${q.id}`, {
            	    method: "DELETE",
            	    credentials: "include"
                });

                const data = await res.json();

                if (!data.success) {
                    alert(data.message || "Erreur lors de la suppression");
                    return;
                }

                div.remove();
            } catch (err) {
                console.error(err);
                alert("Erreur serveur");
            }
        });


        const btnVoir = div.querySelector(".btn-view");

        btnVoir.addEventListener("click", () => {
            window.location.href = `/questionnaire/${q.id}`;
        });

        const btnExport = div.querySelector(".btn-export");

        btnExport.addEventListener("click", async () => {
            /*const res = await fetch(`/exportReponses/${q.id}`, {
                credentials: "include"
            });

	    const data = await res.json();

            if (!data.success) {
		throw new Error("Erreur lors de l'exportation des réponses");
	    } else {
		alert("Export des réponses réussis");
	    }*/
	    window.location.href = `/exportReponses/${q.id}`;

        });

        container.appendChild(div);
    });

}

async function loadQuestionnaire(id) {
    try {
        const res = await fetch(`/questionnaireCharger/${id}`, {
            credentials: "include"
        });

        if (!res.ok) {
            throw new Error("Erreur HTTP");
        }

        const data = await res.json();

        if (!data || !data.questionnaire) {
            throw new Error("questionnaire absent dans la réponse");
        }

        fillForm(data.questionnaire);

        currentFormEtat = data.questionnaire.etat;

        const saveBtn = document.getElementById("save-btn");
        const updateBtn = document.getElementById("update-btn");
	const exportBtn = document.getElementById("export-btn");
        const submitBtn = document.getElementById("submit-btn");
	const btnQCM = document.getElementById("btn-qcm");
	const btnTexte = document.getElementById("btn-texte");
	const btnEchelle = document.getElementById("btn-echelle");
	const btnReset = document.getElementById("btn-reset");
        const hint = document.querySelector(".hint");
	const groupeCibleInput = document.getElementById("groupe-cible");

    if (hasQuestions() && hint) {
        hint.remove();
    }

	document.querySelectorAll("input, textarea, select, button").forEach(el => {
            el.disabled = false;
        });

        if (btnQCM) {
            btnQCM.disabled = false;
        }

        if (btnTexte) {
            btnTexte.disabled = false;
        }

        if (btnEchelle) {
            btnEchelle.disabled = false;
        }

        if (btnReset) {
            btnReset.disabled = false;
        }

        if (currentFormEtat === "brouillon") {
	    if (saveBtn) {
	        saveBtn.style.display = "none";
	    }

            updateBtn.style.display = "inline-block";

            if (submitBtn) {
                submitBtn.style.display = "inline-block";
            }

        } else if (currentFormEtat === "envoye") {
            updateBtn.style.display = "none";
	    saveBtn.style.display = "none";
	    submitBtn.style.display = "none";

	    if (groupeCibleInput) groupeCibleInput.disabled = true;

            if (btnQCM) {
                btnQCM.disabled = true;
            }

            if (btnTexte) {
                btnTexte.disabled = true;
            }

            if (btnEchelle) {
                btnEchelle.disabled = true;
            }

            if (btnReset) {
                btnReset.disabled = true;
            }

            document.querySelectorAll("input, textarea, select, button").forEach(el => {
		if (el.id !== "btn-back") {
                    el.disabled = true;
		}

	    if (exportBtn) {
		exportBtn.disabled = false;
	    }

            });
        }

    } catch (err) {
        console.error("loadQuestionnaire casser :", err);
        alert("Impossible de charger le questionnaire");
    }
}

function fillForm(questionnaire) {

    const titleInput = document.querySelector(".title-box");
    if (titleInput) {
        titleInput.value = questionnaire.titre || "";
        titleInput.disabled = true;
    }

    const descInput = document.querySelector(".desc-box");
    if (descInput) {
        descInput.value = questionnaire.description || "";
        descInput.disabled = true;
    }

    const groupeCibleInput = document.getElementById("groupe-cible");
    if (groupeCibleInput && questionnaire.groupe_cible) {
        groupeCibleInput.value = questionnaire.groupe_cible;
    }

    const timeLimitToggle = document.getElementById("time-limit-toggle");
    const timeInput = document.querySelector(".time-input");
    const timeLimitContent = document.getElementById("time-limit-content");
    
    if (questionnaire.temps_limite && timeLimitToggle && timeInput) {
        timeLimitToggle.checked = true;
        timeInput.value = questionnaire.temps_limite;
        if (timeLimitContent) {
            timeLimitContent.style.display = "flex";
        }
    } else if (timeLimitToggle) {
        timeLimitToggle.checked = false;
        if (timeLimitContent) {
            timeLimitContent.style.display = "none";
        }
    }

    const container = document.getElementById("questions-container");
    if (!container) return;

    container.innerHTML = "";

    function createQuestionElement(q, isSubQuestion = false) {
        let element = null;

        if (q.type_question_id === 1) {
            element = addTexte(isSubQuestion);
            if (!isSubQuestion) {
                element.querySelector(".titreQuestion").value = q.contenu;
            }
        }

        if (q.type_question_id === 2) {
            element = addQCM(isSubQuestion);
            if (!isSubQuestion) {
                element.querySelector(".titreQCM").value = q.contenu;
            }

            const list = element.querySelector(".listQCM");
            list.innerHTML = "";

            if (q.choix) {
                q.choix.forEach((c, index) => {
                    const { li } = createOptionElement(list, index + 1);
                    if (c.id) li.dataset.choixId = c.id;
                    const textarea = li.querySelector(".textAreaQuestion");
                    textarea.value = c.contenu;

                    if (c.sous_questions && c.sous_questions.length > 0) {
                        c.sous_questions.forEach(sq => {
                            const subElement = createQuestionElement(sq, true);
                            if (subElement) {
                                subElement.classList.add('sub-question');
                                if (sq.id) subElement.dataset.questionId = sq.id;
                                li.appendChild(subElement);
                            }
                        });
                    }

                    list.appendChild(li);
                });
            }
        }

        if (q.type_question_id === 3) {
            element = addRatingScale(isSubQuestion);
            if (!isSubQuestion) {
                element.querySelector(".titreRating").value = q.contenu;
            }

            if (q.echelle_max) {
                const selectScale = element.querySelector(".select-scale");
                if (selectScale) {
                    selectScale.value = q.echelle_max;
                    selectScale.dispatchEvent(new Event('change'));
                }
            }
        }

        return element;
    }

    questionnaire.questions.forEach(q => {
        const element = createQuestionElement(q, false);

        if (element) {
            if (q.id) element.dataset.questionId = q.id;

            const obligatoireCheckbox = element.querySelector(".question-obligatoire");
            if (obligatoireCheckbox) {
                obligatoireCheckbox.checked = q.obligatoire === 1;
            }

            container.appendChild(element);
        }
    });
}

function fillFormStudent(questionnaire) {

    const titleInput = document.querySelector(".title-box");
    if (titleInput) {
        titleInput.textContent = questionnaire.titre || "";
        titleInput.value = questionnaire.titre || "";
        titleInput.disabled = true;
    }

    const descInput = document.querySelector(".desc-box");
    if (descInput) {
        descInput.value = questionnaire.description || "";
        descInput.disabled = true;
    }

    const container = document.getElementById("questions-container");
    if (!container) return;

    container.innerHTML = "";

    function createStudentChoixLi(c, questionId) {
        const li = document.createElement("li");
        li.classList.add("elementQCM");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("qcm-checkbox");
        checkbox.value = c.id;
        checkbox.dataset.questionId = questionId;

        const textContainer = document.createElement("span");
        textContainer.classList.add("textQuestionContainer");

        const textarea = document.createElement("textarea");
        textarea.classList.add("textAreaQuestion");
        textarea.textContent = c.contenu || "";
        textarea.disabled = true;

        textContainer.appendChild(textarea);
        li.appendChild(checkbox);
        li.appendChild(textContainer);

        if (c.sous_questions && c.sous_questions.length > 0) {
            c.sous_questions.forEach(function(sq) {
                const subElement = createStudentQuestionElement(sq, true);
                if (subElement) {
                    subElement.classList.add("sub-question");
                    if (sq.id) subElement.dataset.questionId = sq.id;
                    li.appendChild(subElement);
                }
            });
        }

        return li;
    }

    function createStudentQuestionElement(q, isSubQuestion) {
        var element = null;

        if (q.type_question_id === 1) {
            element = addTexte(isSubQuestion);

            if (!isSubQuestion) {
                var titreTexte = element.querySelector(".titreQuestion");
                if (titreTexte) {
                    titreTexte.textContent = q.contenu || "";
                    titreTexte.disabled = true;
                }
            }

            var reponse = element.querySelector(".reponseQuestion");
            if (reponse) {
                reponse.dataset.questionId = q.id;
                reponse.disabled = false;
            }
        }

        if (q.type_question_id === 2) {
            element = addQCM(isSubQuestion);

            if (!isSubQuestion) {
                var titreQCM = element.querySelector(".titreQCM");
                if (titreQCM) {
                    titreQCM.textContent = q.contenu || "";
                    titreQCM.disabled = true;
                }
            }

            var list = element.querySelector(".listQCM");
            if (list) {
                list.innerHTML = "";
            }

            if (list && q.choix && q.choix.length > 0) {
                q.choix.forEach(function(c) {
                    var li = createStudentChoixLi(c, q.id);
                    list.appendChild(li);
                });
            }
        }

        if (q.type_question_id === 3) {
            element = addRatingScale(isSubQuestion);

            if (!isSubQuestion) {
                var titreRating = element.querySelector(".titreRating");
                if (titreRating) {
                    titreRating.textContent = q.contenu || "";
                    titreRating.disabled = true;
                }
            }

            if (q.echelle_max) {
                var selectScale = element.querySelector(".select-scale");
                if (selectScale) {
                    selectScale.value = q.echelle_max;
                    selectScale.dispatchEvent(new Event('change'));
                }
            }

            var slider = element.querySelector(".rating-slider");
            if (slider) {
                slider.dataset.questionId = q.id;
            }
        }

        if (element) {
            var obligatoireCheckbox = element.querySelector(".question-obligatoire");
            if (obligatoireCheckbox) {
                obligatoireCheckbox.checked = q.obligatoire === 1;
            }
        }

        return element;
    }

    questionnaire.questions.forEach(function(q) {
        var element = createStudentQuestionElement(q, false);
        if (element) {
            if (q.id) element.dataset.questionId = q.id;
            container.appendChild(element);
        }
    });
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
            window.location.replace("/loginStudent");
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
                window.location.replace("/loginStudent");
            }
        });

});


async function updateFormInBDD(formReady) {
    const titre = document.querySelector(".title-box")?.value || "";
    const description = document.querySelector(".desc-box")?.value || "";

    const groupeCibleInput = document.getElementById("groupe-cible");
    const groupe_cible = groupeCibleInput ? groupeCibleInput.value : "BUT1";

    const timeToggle = document.getElementById("time-limit-toggle");
    const timeValue = document.querySelector(".time-input")?.value;
    const temps_limite = timeToggle && timeToggle.checked ? parseInt(timeValue, 10) : null;

    const payload = {
        titre,
        description,
        temps_limite,
	groupe_cible,
        questions: formReady.questions
    };

    const res = await fetch(`/questionnaireCharger/${currentFormId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (data.success) {
        alert("Formulaire mis à jour");
    } else {
        alert(data.message || "Modification impossible");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const btnBack = document.getElementById("btn-back");

    if (btnBack) {
        const redirectionMap = {
            "Admin": "/adminQuestionnaires",
            "Prof": "/prof",
            "Etudiant": "/student"
        };

        btnBack.addEventListener("click", async (e) => {
            e.preventDefault();

            try {
                const res = await fetch("/session", { credentials: "include" });
                const data = await res.json();

                if (!data.connected || !data.user) {
                    window.location.href = "/loginStudent";
                    return; 
                }

                const role = data.user.role;
                const provenance = document.referrer;

                if (role === "Admin" && provenance.includes("/adminQuestionnaires")) {
                    window.location.href = provenance;
                    return;
                }

                const destination = redirectionMap[role] || "/student";
                window.location.href = destination;

            } catch (err) {
                console.error("Erreur lors de la redirection :", err);
                window.history.back();
            }
        });
    }
});
