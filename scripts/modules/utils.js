/**
 * @module utils
 * @description Fonctions utilitaires réutilisables
 */

import { QuestionFactory } from './questionFactory.js';

/**
 * Extrait les données d'une question
 * @param {HTMLElement} wrapper - Conteneur de la question
 * @returns {Object|null}
 */
export function extractQuestion(wrapper) {
    const obligatoireCheckbox = wrapper.querySelector('.question-obligatoire');
    const obligatoire = obligatoireCheckbox ? (obligatoireCheckbox.checked ? 1 : 0) : 1;
    const isSubQuestion = wrapper.classList.contains('sub-question');

    const titreQCM = wrapper.querySelector(':scope > .question-content-white > .titreQCM');
    const titreTexte = wrapper.querySelector(':scope > .question-content-white > .titreQuestion');
    const titreRating = wrapper.querySelector(':scope > .question-content-white > .header-row > .titreRating');
    const listQCM = wrapper.querySelector(':scope > .question-content-white > .listQCM');

    // QCM
    if (titreQCM || (isSubQuestion && listQCM)) {
        const choix = [];
        wrapper.querySelectorAll(':scope > .question-content-white > .listQCM > li').forEach(li => {
            const textarea = li.querySelector('.textAreaQuestion');
            if (!textarea || !textarea.value.trim()) return;

            const sous_questions = [];
            li.querySelectorAll(':scope > .question-wrapper-flex').forEach(sub => {
                const subResult = extractQuestion(sub);
                if (subResult) sous_questions.push(subResult);
            });

            choix.push({
                contenu: textarea.value.trim(),
                sous_questions: sous_questions
            });
        });

        return {
            contenu: titreQCM ? titreQCM.value.trim() : 'Sous-QCM',
            obligatoire: obligatoire,
            type_question_id: 2,
            choix: choix
        };
    }

    // Texte
    const containerReponse = wrapper.querySelector(':scope > .question-content-white > .containerReponse');
    if (titreTexte || (isSubQuestion && containerReponse && !listQCM)) {
        return {
            contenu: titreTexte ? titreTexte.value.trim() : 'Sous-question Texte',
            obligatoire: obligatoire,
            type_question_id: 1
        };
    }

    // Rating Scale
    const sliderContainer = wrapper.querySelector(':scope > .question-content-white > .slider-container');
    if (titreRating || (isSubQuestion && sliderContainer)) {
        return {
            contenu: titreRating ? titreRating.value.trim() : 'Sous-question Échelle',
            obligatoire: obligatoire,
            type_question_id: 3
        };
    }

    return null;
}

/**
 * Récupère le formulaire complet
 * @returns {Object}
 */
export function getFullForm() {
    const container = document.getElementById('questions-container');
    const questions = [];

    if (container) {
        container.querySelectorAll(':scope > .question-wrapper-flex').forEach(wrapper => {
            const result = extractQuestion(wrapper);
            if (result) questions.push(result);
        });
    }

    return {
        titre: document.getElementById('form-titre')?.value || document.querySelector('.title-box')?.value || 'Sans titre',
        questions: questions
    };
}

/**
 * Remplit le formulaire avec les données d'un questionnaire
 * @param {Object} questionnaire
 * @param {Function} QuestionFactory - Factory pour créer les questions
 */
export function fillForm(questionnaire) {
    const titleInput = document.querySelector('.title-box') || document.getElementById('form-titre');
    if (titleInput) {
        titleInput.value = questionnaire.titre || '';
        titleInput.disabled = true;
    }

    const descInput = document.querySelector('.desc-box');
    if (descInput) {
        descInput.value = questionnaire.description || '';
        descInput.disabled = true;
    }

    const container = document.getElementById('questions-container');
    if (!container) return;

    container.innerHTML = '';

    questionnaire.questions.forEach(q => {
        let element = null;

        if (q.type_question_id === 1) {
            element = QuestionFactory.createTexte();
            const titreField = element.querySelector('.titreQuestion');
            if (titreField) titreField.value = q.contenu;
        }

        if (q.type_question_id === 2) {
            element = QuestionFactory.createQCM();
            const titreField = element.querySelector('.titreQCM');
            if (titreField) titreField.value = q.contenu;

            const list = element.querySelector('.listQCM');
            if (list && q.choix) {
                list.innerHTML = '';
                q.choix.forEach(c => {
                    const li = document.createElement('li');
                    li.classList.add('elementQCM');

                    const textarea = document.createElement('textarea');
                    textarea.classList.add('textAreaQuestion');
                    textarea.value = c.contenu;
                    textarea.disabled = true;

                    li.appendChild(textarea);
                    list.appendChild(li);
                });
            }
        }

        if (q.type_question_id === 3) {
            element = QuestionFactory.createRatingScale();
            const titreField = element.querySelector('.titreRating');
            if (titreField) titreField.value = q.contenu;
        }

        if (element) {
            element.querySelectorAll('input, textarea, button, span').forEach(el => {
                if (!el.classList.contains('side-btn')) {
                    el.disabled = true;
                }
            });
            container.appendChild(element);
        }
    });
}

/**
 * Remplit le formulaire pour un étudiant
 * @param {Object} questionnaire
 */
export function fillFormStudent(questionnaire) {
    const titleInput = document.querySelector('.title-box');
    if (titleInput) {
        titleInput.value = questionnaire.titre || '';
        titleInput.disabled = true;
    }

    const descInput = document.querySelector('.desc-box');
    if (descInput) {
        descInput.value = questionnaire.description || '';
        descInput.disabled = true;
    }

    const container = document.getElementById('questions-container');
    if (!container) return;

    container.innerHTML = '';

    questionnaire.questions.forEach(q => {
        let element = null;

        if (q.type_question_id === 1) {
            element = QuestionFactory.createTexte();
            const titreField = element.querySelector('.titreQuestion');
            if (titreField) {
                titreField.value = q.contenu;
                titreField.disabled = true;
            }
            const reponse = element.querySelector('.reponseQuestion');
            if (reponse) reponse.disabled = false;
        }

        if (q.type_question_id === 2) {
            element = QuestionFactory.createQCM();
            const titreField = element.querySelector('.titreQCM');
            if (titreField) {
                titreField.value = q.contenu;
                titreField.disabled = true;
            }

            const list = element.querySelector('.listQCM');
            if (list && q.choix) {
                list.innerHTML = '';
                q.choix.forEach(c => {
                    const li = document.createElement('li');
                    li.classList.add('elementQCM');

                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.classList.add('reponseQCM');

                    const textarea = document.createElement('textarea');
                    textarea.classList.add('textAreaQuestion');
                    textarea.value = c.contenu;
                    textarea.disabled = true;

                    li.appendChild(checkbox);
                    li.appendChild(textarea);
                    list.appendChild(li);
                });
            }
        }

        if (q.type_question_id === 3) {
            element = QuestionFactory.createRatingScale();
            const titreField = element.querySelector('.titreRating');
            if (titreField) {
                titreField.value = q.contenu;
                titreField.disabled = true;
            }
            element.querySelectorAll('input[type=range]').forEach(slider => {
                slider.disabled = false;
            });
        }

        if (element) {
            container.appendChild(element);
        }
    });
}

/**
 * Affiche la liste des questionnaires pour les professeurs
 * @param {Array} questionnaires
 * @param {Function} onDelete - Callback de suppression
 * @param {Function} onView - Callback de visualisation
 */
export function displayQuestionnairesProf(questionnaires, onDelete, onView) {
    const container = document.getElementById('questionnaires-list');
    if (!container) return;

    container.innerHTML = '';

    if (questionnaires.length === 0) {
        container.innerHTML = '<p>Aucun questionnaire créé.</p>';
        return;
    }

    questionnaires.forEach(q => {
        const div = document.createElement('div');
        div.className = 'questionnaire-card';

        div.innerHTML = `
            <h3>${q.titre}</h3>
            <p>${q.description || 'Aucune description'}</p>
            <small>Créé le : ${new Date(q.date_creation).toLocaleDateString()}</small>
            <br>
            <strong>État :</strong> ${q.etat}
            <div class="actions">
                <button class="btn-blue btn-view" data-id="${q.id}">Voir</button>
                <button class="btn-red btn-delete" data-id="${q.id}">Supprimer</button>
            </div>
        `;

        const btnDelete = div.querySelector('.btn-delete');
        btnDelete.addEventListener('click', () => onDelete(q, div));

        const btnView = div.querySelector('.btn-view');
        btnView.addEventListener('click', () => onView(q));

        container.appendChild(div);
    });
}

/**
 * Met à jour l'indication visuelle basée sur l'état du formulaire
 * @param {string} etat - État du formulaire ('brouillon' ou 'envoye')
 */
export function updateUIBasedOnFormState(etat) {
    const saveBtn = document.getElementById('save-btn');
    const updateBtn = document.getElementById('update-btn');
    const submitBtn = document.getElementById('submit-btn');
    const btnQCM = document.getElementById('btn-qcm');
    const btnTexte = document.getElementById('btn-texte');
    const btnEchelle = document.getElementById('btn-echelle');
    const btnReset = document.getElementById('btn-reset');

    const allInputs = document.querySelectorAll('input, textarea, select, button');

    if (etat === 'brouillon') {
        if (saveBtn) saveBtn.style.display = 'none';
        if (updateBtn) updateBtn.style.display = 'inline-block';
        if (submitBtn) submitBtn.style.display = 'inline-block';

        allInputs.forEach(el => el.disabled = false);
    } else if (etat === 'envoye') {
        if (updateBtn) updateBtn.style.display = 'none';
        if (saveBtn) saveBtn.style.display = 'none';
        if (submitBtn) submitBtn.style.display = 'none';

        [btnQCM, btnTexte, btnEchelle, btnReset].forEach(btn => {
            if (btn) btn.disabled = true;
        });

        allInputs.forEach(el => el.disabled = true);
    }
}

/**
 * Met à jour le message d'indication
 */
export function updateHintMessage() {
    const hint = document.querySelector('.hint');
    if (!hint) return;

    const container = document.getElementById('questions-container');
    if (container && container.children.length > 0) {
        hint.textContent = '';
    } else {
        hint.textContent = 'Cliquez sur un type de question pour commencer';
    }
}

/**
 * Extrait l'ID du formulaire depuis l'URL
 * @returns {number|null}
 */
export function extractFormIdFromURL() {
    const parts = window.location.pathname.split('/');
    const id = parts[parts.length - 1];
    return id && !isNaN(id) ? parseInt(id, 10) : null;
}
