/**
 * @module validation
 * @description Validation métier centralisée - indépendante du DOM
 */

export class FormValidator {
    /**
     * Vérifie si le formulaire contient au moins une question
     * @returns {boolean}
     */
    static hasQuestions() {
        const container = document.getElementById('questions-container');
        return container && container.children.length > 0;
    }

    /**
     * Valide toutes les réponses du formulaire
     * @returns {Object} {isValid, errors, errorElements}
     */
    static validateAnswers() {
        const errorElements = [];
        const errors = [];
        
        const selectors = [
            '.titreQCM',
            '.titreQuestion',
            '.titreRating',
            '.textAreaQuestion'
        ];

        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                if (element.value.trim().length === 0) {
                    errorElements.push(element);
                    errors.push(`Le champ "${selector}" est vide`);
                }
            });
        });

        return {
            isValid: errors.length === 0,
            errors,
            errorElements
        };
    }

    /**
     * Valide le titre du formulaire
     * @param {string} title - Titre à valider
     * @returns {Object} {isValid, message}
     */
    static validateTitle(title) {
        if (!title || title.trim().length === 0) {
            return {
                isValid: false,
                message: 'Le titre ne doit pas être vide'
            };
        }
        return {
            isValid: true,
            message: ''
        };
    }

    /**
     * Validation complète du formulaire
     * @returns {Object} {isValid, errors, errorElements}
     */
    static validateForm() {
        const errors = [];
        const errorElements = [];

        // Vérifier les questions
        if (!this.hasQuestions()) {
            errors.push('Vous devez insérer des questions');
        }

        // Vérifier les réponses
        const answersValidation = this.validateAnswers();
        if (!answersValidation.isValid) {
            errors.push(...answersValidation.errors);
            errorElements.push(...answersValidation.errorElements);
        }

        // Vérifier le titre
        const titleElement = document.getElementById('form-titre') || 
                            document.querySelector('.title-box');
        if (titleElement) {
            const titleValidation = this.validateTitle(titleElement.value);
            if (!titleValidation.isValid) {
                errors.push(titleValidation.message);
                errorElements.push(titleElement);
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
            errorElements
        };
    }

    /**
     * Marque visuellement les éléments avec erreurs
     * @param {HTMLElement[]} errorElements - Éléments à marquer
     */
    static highlightErrors(errorElements) {
        errorElements.forEach(element => {
            element.style.border = '1px solid red';
        });
    }

    /**
     * Supprime les marques visuelles d'erreur
     */
    static clearHighlights() {
        document.querySelectorAll('.titreQCM, .titreQuestion, .titreRating, .textAreaQuestion')
            .forEach(element => {
                element.style.border = '';
            });
    }
}
