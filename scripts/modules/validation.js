/**
 * @file modules/validation.js
 * @description Logique de validation métier (séparée de la présentation)
 * Retourne état, pas de manipulation DOM directe
 */

export class FormValidator {
  /**
   * Vérifie si le conteneur de questions a au moins une question
   * @returns {boolean}
   */
  static hasQuestions() {
    const container = document.getElementById("questions-container");
    return container && container.children.length > 0;
  }

  /**
   * Valide tous les textareas/inputs requis
   * @returns {Object} { isValid: boolean, errorElements: HTMLElement[] }
   */
  static validateAnswers() {
    const textAreasToValidate = document.querySelectorAll(
      ".titreQCM, .titreQuestion, .titreRating, .textAreaQuestion"
    );
    const errorElements = [];

    textAreasToValidate.forEach(element => {
      if (!element.value.trim()) {
        errorElements.push(element);
      }
    });

    return {
      isValid: errorElements.length === 0,
      errorElements
    };
  }

  /**
   * Valide le titre du formulaire
   * @param {string} title - Titre à valider
   * @returns {Object} { isValid: boolean, message: string }
   */
  static validateTitle(title = "") {
    const trimmed = title.trim();

    if (trimmed.length === 0) {
      return {
        isValid: false,
        message: "Le titre du formulaire ne doit pas être vide"
      };
    }

    if (trimmed.length > 255) {
      return {
        isValid: false,
        message: "Le titre ne peut pas dépasser 255 caractères"
      };
    }

    return {
      isValid: true,
      message: ""
    };
  }

  /**
   * Valide le formulaire complet
   * @returns {Object} { isValid: boolean, errors: string[], errorElements: HTMLElement[] }
   */
  static validateForm() {
    const errors = [];
    const errorElements = [];

    // Vérifier les questions
    if (!this.hasQuestions()) {
      errors.push("Vous devez insérer au moins une question");
    }

    // Vérifier les réponses
    const answersValidation = this.validateAnswers();
    if (!answersValidation.isValid) {
      errors.push("Certaines zones de texte sont vides, veuillez les remplir");
      errorElements.push(...answersValidation.errorElements);
    }

    // Vérifier le titre
    const titleElement = document.querySelector(".title-box");
    const titleValidation = this.validateTitle(titleElement?.value || "");
    if (!titleValidation.isValid) {
      errors.push(titleValidation.message);
    }

    return {
      isValid: errors.length === 0,
      errors,
      errorElements
    };
  }

  /**
   * Marque visuellement les éléments invalides
   * @param {HTMLElement[]} errorElements - Éléments à marquer
   */
  static highlightErrors(errorElements = []) {
    // Réinitialiser d'abord tous les styles
    document.querySelectorAll(".titreQCM, .titreQuestion, .titreRating, .textAreaQuestion").forEach(el => {
      el.style.border = "";
    });

    // Appliquer les bordures rouges
    errorElements.forEach(element => {
      element.style.border = "2px solid red";
    });
  }

  /**
   * Réinitialise les marquages visuels
   */
  static clearHighlights() {
    document.querySelectorAll(".titreQCM, .titreQuestion, .titreRating, .textAreaQuestion").forEach(el => {
      el.style.border = "";
    });
  }
}