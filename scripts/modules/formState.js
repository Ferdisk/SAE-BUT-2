/**
 * @module formState
 * @description Gestion d'état centralisée avec Singleton Pattern et Observer Pattern
 */

export class FormState {
    static #instance = null;
    #currentFormId = null;
    #currentFormEtat = null;
    #observers = [];

    /**
     * Récupère l'instance unique du FormState
     * @returns {FormState}
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
     * @param {number} id
     */
    setCurrentFormId(id) {
        if (this.#currentFormId !== id) {
            this.#currentFormId = id;
            this.#notifyObservers({ type: 'formIdChanged', id });
        }
    }

    /**
     * Obtient l'état du formulaire actuel
     * @returns {string|null} - 'brouillon' ou 'envoye'
     */
    getCurrentFormEtat() {
        return this.#currentFormEtat;
    }

    /**
     * Définit l'état du formulaire actuel
     * @param {string} etat - 'brouillon' ou 'envoye'
     */
    setCurrentFormEtat(etat) {
        if (this.#currentFormEtat !== etat) {
            this.#currentFormEtat = etat;
            this.#notifyObservers({ type: 'formEtatChanged', etat });
        }
    }

    /**
     * Vérifie si le formulaire est en brouillon
     * @returns {boolean}
     */
    isDraft() {
        return this.#currentFormEtat === 'brouillon';
    }

    /**
     * Vérifie si le formulaire est envoyé
     * @returns {boolean}
     */
    isSent() {
        return this.#currentFormEtat === 'envoye';
    }

    /**
     * S'abonne aux changements d'état
     * @param {Function} callback - Fonction appelée lors de changements
     */
    subscribe(callback) {
        this.#observers.push(callback);
    }

    /**
     * Se désabonne des changements d'état
     * @param {Function} callback
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
                console.error('Erreur dans observer:', err);
            }
        });
    }

    /**
     * Réinitialise l'état
     */
    reset() {
        this.#currentFormId = null;
        this.#currentFormEtat = null;
        this.#notifyObservers({ type: 'reset' });
    }
}
