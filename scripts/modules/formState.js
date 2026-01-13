/**
 * @file modules/formState.js
 * @description Gestion centralisée de l'état global du formulaire (Singleton Pattern)
 * Replaces les variables globales : currentFormId, currentFormEtat
 */

export class FormState {
  static #instance = null;
  #currentFormId = null;
  #currentFormEtat = null;
  #observers = [];

  /**
   * Obtient l'instance unique du singleton
   * @returns {FormState} Instance unique
   */
  static getInstance() {
    if (!FormState.#instance) {
      FormState.#instance = new FormState();
    }
    return FormState.#instance;
  }

  /**
   * Obtient l'ID du formulaire actuel
   * @returns {number|null}
   */
  getCurrentFormId() {
    return this.#currentFormId;
  }

  /**
   * Définit l'ID du formulaire actuel
   * @param {number|null} id
   */
  setCurrentFormId(id) {
    this.#currentFormId = id;
    this.#notifyObservers({ type: "formIdChanged", id });
  }

  /**
   * Obtient l'état du formulaire (brouillon, envoye, etc.)
   * @returns {string|null}
   */
  getCurrentFormEtat() {
    return this.#currentFormEtat;
  }

  /**
   * Définit l'état du formulaire
   * @param {string|null} etat
   */
  setCurrentFormEtat(etat) {
    this.#currentFormEtat = etat;
    this.#notifyObservers({ type: "formEtatChanged", etat });
  }

  /**
   * Vérifie si le formulaire est en état "brouillon"
   * @returns {boolean}
   */
  isDraft() {
    return this.#currentFormEtat === "brouillon";
  }

  /**
   * Vérifie si le formulaire est en état "envoyé"
   * @returns {boolean}
   */
  isSent() {
    return this.#currentFormEtat === "envoye";
  }

  /**
   * Réinitialise l'état du formulaire
   */
  reset() {
    this.#currentFormId = null;
    this.#currentFormEtat = null;
    this.#notifyObservers({ type: "formReset" });
  }

  /**
   * S'abonne aux changements d'état (Pattern Observer)
   * @param {Function} callback - Fonction à appeler lors d'un changement
   */
  subscribe(callback) {
    if (typeof callback === "function") {
      this.#observers.push(callback);
    }
  }

  /**
   * Se désabonne des changements d'état
   * @param {Function} callback - Fonction à retirer
   */
  unsubscribe(callback) {
    this.#observers = this.#observers.filter(obs => obs !== callback);
  }

  /**
   * Notifie tous les observateurs
   * @private
   * @param {Object} change - Objet décrivant le changement
   */
  #notifyObservers(change) {
    this.#observers.forEach(callback => {
      try {
        callback(change);
      } catch (err) {
        console.error("Erreur dans observateur FormState:", err);
      }
    });
  }
}