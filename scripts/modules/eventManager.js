/**
 * @module eventManager
 * @description Gestion centralisée de tous les événements
 */

import { QuestionFactory } from './questionFactory.js';
import { FormValidator } from './validation.js';
import { ApiService } from './apiService.js';
import { FormState } from './formState.js';
import {
    extractQuestion,
    getFullForm,
    updateHintMessage,
    updateUIBasedOnFormState,
    displayQuestionnairesProf
} from './utils.js';

export class EventManager {
    constructor() {
        this.apiService = ApiService.getInstance();
        this.formState = FormState.getInstance();
    }

    /**
     * Initialise tous les écouteurs d'événements
     */
    init() {
        this.attachQuestionButtonListeners();
        this.attachFormSubmitListener();
        this.attachTimeLimitToggleListener();
        this.attachUpdateFormListener();
        this.attachResetFormListener();
        this.attachLogoutListener();
        this.attachQuestionnairesListListener();
    }

    /**
     * Attache les listeners aux boutons d'ajout de questions
     * @private
     */
    attachQuestionButtonListeners() {
        const btnQCM = document.getElementById('btn-qcm');
        const btnTexte = document.getElementById('btn-texte');
        const btnEchelle = document.getElementById('btn-echelle');

        if (btnQCM) {
            btnQCM.addEventListener('click', () => {
                const qcm = QuestionFactory.createQCM();
                document.getElementById('questions-container').appendChild(qcm);
                updateHintMessage();
            });
        }

        if (btnTexte) {
            btnTexte.addEventListener('click', () => {
                const txt = QuestionFactory.createTexte();
                document.getElementById('questions-container').appendChild(txt);
                updateHintMessage();
            });
        }

        if (btnEchelle) {
            btnEchelle.addEventListener('click', () => {
                const scale = QuestionFactory.createRatingScale();
                document.getElementById('questions-container').appendChild(scale);
                updateHintMessage();
            });
        }
    }

    /**
     * Attache le listener de soumission du formulaire
     * @private
     */
    attachFormSubmitListener() {
        const saveBtn = document.getElementById('save-btn');

        if (saveBtn) {
            saveBtn.addEventListener('click', async (event) => {
                event.preventDefault();
                await this.handleSaveForm();
            });
        }

        const submitBtn = document.getElementById('submit-btn');

        if (submitBtn) {
            submitBtn.addEventListener('click', async () => {
                if (!this.formState.getCurrentFormId()) return;

                if (!confirm('Envoyer définitivement ce questionnaire ?')) return;

                try {
                    const res = await this.apiService.submitQuestionnaire(
                        this.formState.getCurrentFormId()
                    );

                    if (res.success) {
                        alert('Formulaire envoyé');
                        window.location.href = '/prof';
                    } else {
                        alert(res.message || 'Erreur lors de l\'envoi');
                    }
                } catch (err) {
                    console.error('Erreur lors de l\'envoi:', err);
                    alert('Impossible de contacter le serveur');
                }
            });
        }
    }

    /**
     * Attache le listener du toggle de limite de temps
     * @private
     */
    attachTimeLimitToggleListener() {
        const timeLimitToggle = document.getElementById('time-limit-toggle');
        const timeLimitContent = document.getElementById('time-limit-content');
        const timeLimitDesc = document.getElementById('time-limit-desc-text');

        if (!timeLimitToggle) return;

        timeLimitToggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                timeLimitContent.style.display = 'flex';
                const val = document.querySelector('.time-input').value;
                timeLimitDesc.textContent = `Les étudiants auront ${val} heures pour compléter ce questionnaire à partir de son envoi.`;
            } else {
                timeLimitContent.style.display = 'none';
                timeLimitDesc.textContent = 'Aucune limite de temps. Les étudiants pourront compléter le questionnaire à leur rythme.';
            }
        });

        const timeInput = document.querySelector('.time-input');
        if (timeInput) {
            timeInput.addEventListener('input', (e) => {
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

    /**
     * Attache le listener du bouton de mise à jour
     * @private
     */
    attachUpdateFormListener() {
        const updateBtn = document.getElementById('update-btn');

        if (updateBtn) {
            updateBtn.addEventListener('click', async () => {
                if (!this.formState.getCurrentFormId()) return;

                if (!FormValidator.hasQuestions() || !FormValidator.validateForm().isValid) {
                    alert('Formulaire invalide');
                    return;
                }

                await this.handleUpdateForm();
            });
        }
    }

    /**
     * Attache le listener du bouton de réinitialisation
     * @private
     */
    attachResetFormListener() {
        document.addEventListener('click', (e) => {
            if (e.target && e.target.id === 'btn-reset') {
                e.preventDefault();
                if (confirm('Êtes-vous sûr de vouloir tout effacer ? Cette action est irréversible.')) {
                    const container = document.getElementById('questions-container');
                    if (container) {
                        container.innerHTML = '';
                        updateHintMessage();
                    }
                }
            }
        });
    }

    /**
     * Attache le listener de déconnexion
     * @private
     */
    attachLogoutListener() {
        const logoutBtn = document.getElementById('logout-btn');

        if (logoutBtn) {
            logoutBtn.addEventListener('click', async (e) => {
                e.preventDefault();

                try {
                    await this.apiService.logout();
                    window.location.replace('/loginStudent');
                } catch (err) {
                    console.error('Erreur de déconnexion:', err);
                    window.location.replace('/loginStudent');
                }
            });
        }
    }

    /**
     * Attache les listeners de la liste des questionnaires
     * @private
     */
    attachQuestionnairesListListener() {
        const listContainer = document.getElementById('questionnaires-list');
        if (!listContainer) return;

        this.loadAndDisplayQuestionnaires();
    }

    /**
     * Charge et affiche la liste des questionnaires
     * @private
     */
    async loadAndDisplayQuestionnaires() {
        try {
            const data = await this.apiService.loadUserQuestionnaires();

            if (!data.success) {
                alert('Erreur lors du chargement des questionnaires');
                return;
            }

            displayQuestionnairesProf(
                data.questionnaires,
                (q, div) => this.handleDeleteQuestionnaire(q, div),
                (q) => this.handleViewQuestionnaire(q)
            );
        } catch (err) {
            console.error('Erreur lors du chargement:', err);
            alert('Erreur serveur');
        }
    }

    /**
     * Gère la suppression d'un questionnaire
     * @private
     */
    async handleDeleteQuestionnaire(questionnaire, cardDiv) {
        const confirmDelete = confirm(
            `Voulez-vous vraiment supprimer le questionnaire "${questionnaire.titre}" ?`
        );

        if (!confirmDelete) return;

        try {
            const data = await this.apiService.deleteQuestionnaire(questionnaire.id);

            if (!data.success) {
                alert(data.message || 'Erreur lors de la suppression');
                return;
            }

            cardDiv.remove();
        } catch (err) {
            console.error('Erreur lors de la suppression:', err);
            alert('Erreur serveur');
        }
    }

    /**
     * Gère la visualisation d'un questionnaire
     * @private
     */
    handleViewQuestionnaire(questionnaire) {
        window.location.href = `/questionnaire/${questionnaire.id}`;
    }

    /**
     * Traite la sauvegarde du formulaire
     * @private
     */
    async handleSaveForm() {
        const validation = FormValidator.validateForm();

        if (!validation.isValid) {
            alert(validation.errors[0] || 'Certaines zones sont vides');
            FormValidator.highlightErrors(validation.errorElements);
            return;
        }

        const formData = this.extractFormData();

        try {
            const res = await this.apiService.sendFormToBDD(formData);

            if (res.success) {
                alert('Formulaire et questions sauvegardés avec succès !');
                window.location.href = '/prof';
            } else {
                alert('Erreur technique : ' + (res.message || 'Unknown error'));
            }
        } catch (err) {
            console.error('Erreur:', err);
            alert('Impossible de contacter le serveur');
        }
    }

    /**
     * Traite la mise à jour du formulaire
     * @private
     */
    async handleUpdateForm() {
        const formData = this.extractFormData();

        try {
            const res = await this.apiService.updateFormInBDD(
                this.formState.getCurrentFormId(),
                formData
            );

            if (res.success) {
                alert('Formulaire mis à jour');
            } else {
                alert(res.message || 'Modification impossible');
            }
        } catch (err) {
            console.error('Erreur lors de la mise à jour:', err);
            alert('Erreur serveur');
        }
    }

    /**
     * Extrait les données du formulaire
     * @private
     */
    extractFormData() {
        const titleInput = document.getElementById('form-titre') || 
                          document.querySelector('.title-box');
        const descInput = document.querySelector('.desc-box');
        
        const titre = titleInput ? titleInput.value.trim() : 'Sans titre';
        const description = descInput ? descInput.value.trim() : '';

        const timeToggle = document.getElementById('time-limit-toggle');
        const timeValue = document.querySelector('.time-input')?.value;
        const temps_limite = timeToggle && timeToggle.checked 
            ? parseInt(timeValue, 10) 
            : null;

        const formReady = getFullForm();

        return {
            titre: titre,
            description: description,
            temps_limite: temps_limite,
            questions: formReady.questions
        };
    }
}
