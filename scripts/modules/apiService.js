/**
 * @module apiService
 * @description Service centralisé pour tous les appels HTTP - Singleton Pattern
 */

export class ApiService {
    static #instance = null;
    #baseUrl = 'http://164.81.120.71:3000';

    /**
     * Récupère l'instance unique
     * @returns {ApiService}
     */
    static getInstance() {
        if (!ApiService.#instance) {
            ApiService.#instance = new ApiService();
        }
        return ApiService.#instance;
    }

    /**
     * Effectue une requête HTTP
     * @private
     * @param {string} endpoint - Point de terminaison
     * @param {Object} options - Options fetch
     * @returns {Promise<Object>}
     */
    async #request(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.#baseUrl}${endpoint}`, {
                credentials: 'include',
                ...options
            });

            if (!response.ok && response.status !== 404) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (err) {
            console.error(`Erreur API ${endpoint}:`, err);
            throw err;
        }
    }

    /**
     * Envoie un formulaire à la BDD
     * @param {Object} formData - Données du formulaire
     * @returns {Promise<Object>}
     */
    async sendFormToBDD(formData) {
        return this.#request('/form', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
    }

    /**
     * Met à jour un formulaire dans la BDD
     * @param {number} formId - ID du formulaire
     * @param {Object} formData - Données du formulaire
     * @returns {Promise<Object>}
     */
    async updateFormInBDD(formId, formData) {
        return this.#request(`/api/questionnaire/${formId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
    }

    /**
     * Charge un questionnaire depuis la BDD
     * @param {number} id - ID du questionnaire
     * @returns {Promise<Object>}
     */
    async loadQuestionnaire(id) {
        return this.#request(`/api/questionnaire/${id}`);
    }

    /**
     * Charge la liste des questionnaires de l'utilisateur
     * @returns {Promise<Object>}
     */
    async loadUserQuestionnaires() {
        return this.#request('/listForms');
    }

    /**
     * Supprime un questionnaire
     * @param {number} id - ID du questionnaire
     * @returns {Promise<Object>}
     */
    async deleteQuestionnaire(id) {
        return this.#request(`/questionnaire/${id}`, {
            method: 'DELETE'
        });
    }

    /**
     * Envoie un questionnaire (change l'état)
     * @param {number} id - ID du questionnaire
     * @returns {Promise<Object>}
     */
    async submitQuestionnaire(id) {
        return this.#request(`/questionnaire/send/${id}`, {
            method: 'PUT'
        });
    }

    /**
     * Déconnecte l'utilisateur
     * @returns {Promise<Object>}
     */
    async logout() {
        return this.#request('/logout', {
            method: 'POST'
        });
    }

    /**
     * Vérifie l'état de la session
     * @returns {Promise<Object>}
     */
    async checkSession() {
        return this.#request('/session');
    }
}