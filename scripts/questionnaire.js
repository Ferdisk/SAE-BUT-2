/**
 * @file questionnaire.js
 * @description Orchestrateur principal de l'application de gestion des questionnaires
 * Architecture modulaire avec 7 modules spécialisés
 */

import { QuestionFactory } from './modules/questionFactory.js';
import { FormState } from './modules/formState.js';
import { ApiService } from './modules/apiService.js';
import { EventManager } from './modules/eventManager.js';
import { FormValidator } from './modules/validation.js';
import {
    fillForm,
    fillFormStudent,
    updateUIBasedOnFormState,
    updateHintMessage,
    extractFormIdFromURL
} from './modules/utils.js';

/**
 * Application principale de gestion des questionnaires
 */
class QuestionnaireApp {
    constructor() {
        this.formState = FormState.getInstance();
        this.apiService = ApiService.getInstance();
        this.eventManager = new EventManager();
        this.validator = FormValidator;
    }

    /**
     * Initialise l'application
     */
    async init() {
        // Initialiser les écouteurs d'événements
        this.eventManager.init();

        // Mettre à jour le message d'indication
        updateHintMessage();

        // Charger un formulaire existant si l'ID est dans l'URL
        const formId = extractFormIdFromURL();
        if (formId) {
            this.formState.setCurrentFormId(formId);
            await this.loadExistingForm(formId);
        }

        // Écouter les changements d'état du formulaire
        this.formState.subscribe((change) => {
            if (change.type === 'formEtatChanged') {
                updateUIBasedOnFormState(change.etat);
            }
        });
    }

    /**
     * Charge un formulaire existant depuis le serveur
     * @private
     */
    async loadExistingForm(formId) {
        try {
            const data = await this.apiService.loadQuestionnaire(formId);

            if (!data || !data.questionnaire) {
                throw new Error('Questionnaire absent dans la réponse');
            }

            const questionnaire = data.questionnaire;

            // Remplir le formulaire
            const isStudent = window.location.pathname.includes('Student');
            if (isStudent) {
                fillFormStudent(questionnaire);
            } else {
                fillForm(questionnaire);
            }

            // Mettre à jour l'état
            this.formState.setCurrentFormEtat(questionnaire.etat);

            // Adapter l'UI selon l'état
            updateUIBasedOnFormState(questionnaire.etat);

        } catch (err) {
            console.error('Erreur lors du chargement:', err);
            alert('Impossible de charger le questionnaire');
        }
    }
}

// Point d'entrée de l'application
document.addEventListener('DOMContentLoaded', async () => {
    const app = new QuestionnaireApp();
    await app.init();
});