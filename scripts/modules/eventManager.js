/**
 * @file modules/eventManager.js
 * @description Centralise tous les addEventListener() et handlers d'événements
 */

import { QuestionFactory } from "./questionFactory.js";
import { FormValidator } from "./validation.js";
import { ApiService } from "./apiService.js";
import { FormState } from "./formState.js";
import { updateHintMessage, updateUIBasedOnFormState, getFullForm } from "./utils.js";

export class EventManager {
  constructor() {
    this.formState = FormState.getInstance();
    this.apiService = ApiService.getInstance();
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

    updateHintMessage();
  }

  /**
   * Attache les listeners aux boutons de création de questions
   * @private
   */
  attachQuestionButtonListeners() {
    const btnQCM = document.getElementById("btn-qcm");
    const btnTexte = document.getElementById("btn-texte");
    const btnEchelle = document.getElementById("btn-echelle");
    const container = document.getElementById("questions-container");

    if (btnQCM) {
      btnQCM.addEventListener("click", () => {
        const question = QuestionFactory.createQCM();
        container.appendChild(question);
        updateHintMessage();
      });
    }

    if (btnTexte) {
      btnTexte.addEventListener("click", () => {
        const question = QuestionFactory.createTexte();
        container.appendChild(question);
        updateHintMessage();
      });
    }

    if (btnEchelle) {
      btnEchelle.addEventListener("click", () => {
        const question = QuestionFactory.createRatingScale();
        container.appendChild(question);
        updateHintMessage();
      });
    }
  }

  /**
   * Attache le listener au bouton de sauvegarde/envoi du formulaire
   * @private
   */
  attachFormSubmitListener() {
    const saveBtn = document.getElementById("save-btn");
    const submitBtn = document.getElementById("submit-btn");

    if (saveBtn) {
      saveBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleSaveForm();
      });
    }

    if (submitBtn) {
      submitBtn.addEventListener("click", async () => {
        await this.handleSubmitForm();
      });
    }
  }

  /**
   * Attache le listener au toggle de limite de temps
   * @private
   */
  attachTimeLimitToggleListener() {
    const timeLimitToggle = document.getElementById("time-limit-toggle");
    const timeLimitContent = document.getElementById("time-limit-content");
    const timeLimitDesc = document.getElementById("time-limit-desc-text");

    if (!timeLimitToggle) return;

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

  /**
   * Attache le listener au bouton de mise à jour
   * @private
   */
  attachUpdateFormListener() {
    const updateBtn = document.getElementById("update-btn");

    if (updateBtn) {
      updateBtn.addEventListener("click", async () => {
        await this.handleUpdateForm();
      });
    }
  }

  /**
   * Attache le listener au bouton de réinitialisation
   * @private
   */
  attachResetFormListener() {
    document.addEventListener("click", (e) => {
      if (e.target && e.target.id === "btn-reset") {
        e.preventDefault();
        if (confirm("Êtes-vous sûr de vouloir tout effacer ? Cette action est irréversible.")) {
          const container = document.getElementById("questions-container");
          if (container) {
            container.innerHTML = "";
            updateHintMessage();
          }
        }
      }
    });
  }

  /**
   * Attache le listener au bouton de déconnexion
   * @private
   */
  attachLogoutListener() {
    const logoutBtn = document.getElementById("logout-btn");

    if (logoutBtn) {
      logoutBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        try {
          await this.apiService.logout();
          
          // Vérifier la session après déconnexion
          const sessionData = await this.apiService.checkSession();
          if (!sessionData.connected) {
            window.location.replace("/loginStudent");
          }
        } catch (err) {
          console.error("Erreur lors de la déconnexion:", err);
          alert("Erreur serveur");
        }
      });
    }
  }

  /**
   * Attache les listeners pour la liste des questionnaires
   * @private
   */
  attachQuestionnairesListListener() {
    const listContainer = document.getElementById("questionnaires-list");
    if (listContainer) {
      // Le chargement se fait via loadQuestionnairesProf()
    }
  }

  /**
   * Handler pour sauvegarder un nouveau formulaire
   * @private
   */
  async handleSaveForm() {
    const validation = FormValidator.validateForm();

    if (!validation.isValid) {
      FormValidator.highlightErrors(validation.errorElements);
      validation.errors.forEach(error => alert(error));
      return;
    }

    const formData = this.extractFormData();
    
    try {
      const response = await this.apiService.sendFormToBDD(formData);
      
      if (response.success) {
        alert("Formulaire et questions sauvegardés avec succès !");
        window.location.href = "/prof";
      } else {
        alert("Erreur technique : " + (response.message || "Erreur inconnue"));
      }
    } catch (err) {
      console.error("Erreur lors de la sauvegarde:", err);
      alert("Impossible de contacter le serveur.");
    }
  }

  /**
   * Handler pour soumettre un formulaire existant
   * @private
   */
  async handleSubmitForm() {
    const formId = this.formState.getCurrentFormId();
    if (!formId) return;

    if (!confirm("Envoyer définitivement ce questionnaire ?")) return;

    try {
      const response = await this.apiService.submitQuestionnaire(formId);

      if (response.success) {
        alert("Formulaire envoyé");
        window.location.href = "/prof";
      } else {
        alert(response.message || "Erreur lors de l'envoi");
      }
    } catch (err) {
      console.error("Erreur lors de l'envoi:", err);
      alert("Erreur serveur");
    }
  }

  /**
   * Handler pour mettre à jour un formulaire existant
   * @private
   */
  async handleUpdateForm() {
    const formId = this.formState.getCurrentFormId();
    if (!formId) return;

    const validation = FormValidator.validateForm();
    if (!validation.isValid) {
      FormValidator.highlightErrors(validation.errorElements);
      alert("Formulaire invalide");
      return;
    }

    const formData = this.extractFormData();

    try {
      const response = await this.apiService.updateFormInBDD(formId, formData);

      if (response.success) {
        alert("Formulaire mis à jour");
      } else {
        alert(response.message || "Modification impossible");
      }
    } catch (err) {
      console.error("Erreur lors de la mise à jour:", err);
      alert("Erreur serveur");
    }
  }

  /**
   * Extrait les données complètes du formulaire depuis l'interface
   * @private
   * @returns {Object} { titre, description, temps_limite, questions }
   */
  extractFormData() {
    const titreInput = document.getElementById("form-titre") || document.querySelector(".title-box");
    const descInput = document.querySelector(".desc-box");
    
    const titre = titreInput ? titreInput.value.trim() : "Sans titre";
    const description = descInput ? descInput.value.trim() : "";

    const timeToggle = document.getElementById("time-limit-toggle");
    const timeValue = document.querySelector(".time-input")?.value;
    const temps_limite = timeToggle && timeToggle.checked ? parseInt(timeValue, 10) : null;

    const form = getFullForm();

    return {
      titre: titre,
      description: description,
      temps_limite: temps_limite,
      questions: form.questions
    };
  }
}
