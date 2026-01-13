/**
 * @file modules/apiService.js
 * @description Gestion centralisée de tous les appels HTTP avec gestion d'erreurs
 */

export class ApiService {
  static #instance = null;
  #baseURL = "http://164.81.120.71:3000";

  /**
   * Obtient l'instance unique du singleton
   * @returns {ApiService}
   */
  static getInstance() {
    if (!ApiService.#instance) {
      ApiService.#instance = new ApiService();
    }
    return ApiService.#instance;
  }

  /**
   * Effectue une requête HTTP centralisée
   * @private
   * @param {string} endpoint - URL de l'endpoint
   * @param {Object} options - Options fetch
   * @returns {Promise<Object>} Réponse JSON
   * @throws {Error} En cas d'erreur réseau ou serveur
   */
  async #request(endpoint, options = {}) {
    const url = endpoint.startsWith("http") ? endpoint : `${this.#baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        credentials: "include",
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      console.error(`Erreur API (${endpoint}):`, err);
      throw err;
    }
  }

  /**
   * Envoie un nouveau formulaire à la base de données
   * @param {Object} formData - { titre, description, temps_limite, questions }
   * @returns {Promise<Object>} Réponse du serveur
   */
  async sendFormToBDD(formData) {
    return this.#request("/form", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
  }

  /**
   * Met à jour un formulaire existant
   * @param {number} formId - ID du formulaire
   * @param {Object} formData - { titre, description, temps_limite, questions }
   * @returns {Promise<Object>} Réponse du serveur
   */
  async updateFormInBDD(formId, formData) {
    return this.#request(`/api/questionnaire/${formId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
  }

  /**
   * Charge un questionnaire spécifique
   * @param {number} id - ID du questionnaire
   * @returns {Promise<Object>} { questionnaire, etat, ... }
   */
  async loadQuestionnaire(id) {
    return this.#request(`/api/questionnaire/${id}`);
  }

  /**
   * Charge tous les questionnaires de l'utilisateur actuel
   * @returns {Promise<Object>} { questionnaires: Array, success: boolean }
   */
  async loadUserQuestionnaires() {
    return this.#request("/listForms");
  }

  /**
   * Supprime un questionnaire
   * @param {number} id - ID du questionnaire
   * @returns {Promise<Object>} { success: boolean, message: string }
   */
  async deleteQuestionnaire(id) {
    return this.#request(`/questionnaire/${id}`, {
      method: "DELETE"
    });
  }

  /**
   * Envoie définitivement un questionnaire (changement d'état)
   * @param {number} id - ID du questionnaire
   * @returns {Promise<Object>} { success: boolean, message: string }
   */
  async submitQuestionnaire(id) {
    return this.#request(`/questionnaire/send/${id}`, {
      method: "PUT"
    });
  }

  /**
   * Déconnecte l'utilisateur
   * @returns {Promise<Object>} { success: boolean }
   */
  async logout() {
    return this.#request("/logout", {
      method: "POST"
    });
  }

  /**
   * Vérifie la session utilisateur
   * @returns {Promise<Object>} { connected: boolean, user: Object | null }
   */
  async checkSession() {
    return this.#request("/session");
  }
}