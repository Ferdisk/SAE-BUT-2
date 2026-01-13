/**
 * @file questionnaire.js
 * @description Fichier principal d'orchestration
 * Orchestre les modules sans logique métier
 */

import { QuestionFactory } from "./modules/questionFactory.js";
import { FormState } from "./modules/formState.js";
import { ApiService } from "./modules/apiService.js";
import { EventManager } from "./modules/eventManager.js";
import { FormValidator } from "./modules/validation.js";
import {
  fillForm,
  displayQuestionnairesProf,
  updateUIBasedOnFormState,
  extractFormIdFromURL,
  getFullForm
} from "./modules/utils.js";

/**
 * Application principale du constructeur de questionnaire
 */
class QuestionnaireApp {
  constructor() {
    this.formState = FormState.getInstance();
    this.apiService = ApiService.getInstance();
    this.eventManager = new EventManager();
  }

  /**
   * Initialise l'application
   */
  async init() {
    // Attache tous les écouteurs d'événements
    this.eventManager.init();

    // Charge un formulaire existant si ID présent dans l'URL
    const formId = extractFormIdFromURL();
    if (formId) {
      this.formState.setCurrentFormId(formId);
      await this.loadExistingForm(formId);
    }

    // S'abonne aux changements d'état du formulaire
    this.formState.subscribe((change) => {
      if (change.type === "formEtatChanged") {
        updateUIBasedOnFormState(change.etat);
      }
    });

    // Charge les questionnaires de la page d'accueil
    this.loadQuestionnairesList();
  }

  /**
   * Charge un formulaire existant depuis l'API
   * @private
   * @param {number} formId
   */
  async loadExistingForm(formId) {
    try {
      const response = await this.apiService.loadQuestionnaire(formId);

      if (!response || !response.questionnaire) {
        throw new Error("Formulaire absent dans la réponse");
      }

      const questionnaire = response.questionnaire;

      // Remplit l'interface avec les données
      fillForm(questionnaire, QuestionFactory);

      // Met à jour l'état du formulaire
      this.formState.setCurrentFormEtat(questionnaire.etat);

      // Met à jour l'UI selon l'état
      updateUIBasedOnFormState(questionnaire.etat);
    } catch (err) {
      console.error("Erreur lors du chargement du formulaire:", err);
      alert("Impossible de charger le questionnaire");
    }
  }

  /**
   * Charge la liste des questionnaires de l'utilisateur
   * @private
   */
  async loadQuestionnairesList() {
    const listContainer = document.getElementById("questionnaires-list");
    if (!listContainer) return; // Page n'a pas de liste

    try {
      const response = await this.apiService.loadUserQuestionnaires();

      if (!response.success) {
        alert("Erreur lors du chargement des questionnaires");
        return;
      }

      displayQuestionnairesProf(
        response.questionnaires,
        this.handleDeleteQuestionnaire.bind(this),
        this.handleViewQuestionnaire.bind(this)
      );
    } catch (err) {
      console.error("Erreur lors du chargement des questionnaires:", err);
      alert("Erreur serveur");
    }
  }

  /**
   * Handler pour supprimer un questionnaire
   * @private
   * @param {number} id
   * @param {string} titre
   * @param {HTMLElement} cardElement
   */
  async handleDeleteQuestionnaire(id, titre, cardElement) {
    const confirmDelete = confirm(`Voulez-vous vraiment supprimer le questionnaire "${titre}" ?`);

    if (!confirmDelete) return;

    try {
      const response = await this.apiService.deleteQuestionnaire(id);

      if (!response.success) {
        alert(response.message || "Erreur lors de la suppression");
        return;
      }

      cardElement.remove();
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      alert("Erreur serveur");
    }
  }

  /**
   * Handler pour afficher un questionnaire
   * @private
   * @param {number} id
   */
  handleViewQuestionnaire(id) {
    window.location.href = `/questionnaire/${id}`;
  }
}

/**
 * Point d'entrée - lance l'application au chargement du DOM
 */
document.addEventListener("DOMContentLoaded", async () => {
  const app = new QuestionnaireApp();
  await app.init();
});