/**
 * @module domBuilder
 * @description Construction DOM réutilisable - centralise la création de tous les éléments
 */

export class DOMBuilder {
    /**
     * Crée un élément DOM avec classes et attributs personnalisés
     * @param {string} tag - Balise HTML
     * @param {string|string[]} classes - Classe(s) CSS
     * @param {Object} attributes - Attributs personnalisés {id, placeholder, type, etc.}
     * @param {Object} handlers - Handlers d'événements {click, input, change, etc.}
     * @returns {HTMLElement}
     */
    static createElement(tag, classes = '', attributes = {}, handlers = {}) {
        const element = document.createElement(tag);
        
        if (classes) {
            if (Array.isArray(classes)) {
                element.classList.add(...classes);
            } else {
                element.classList.add(classes);
            }
        }
        
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'id' || key === 'placeholder' || key === 'type' || key === 'value') {
                element[key] = value;
            } else {
                element.setAttribute(key, value);
            }
        });
        
        Object.entries(handlers).forEach(([event, handler]) => {
            element.addEventListener(event, handler);
        });
        
        return element;
    }

    /**
     * Crée un bouton avec texte et handlers
     * @param {string} text - Texte du bouton
     * @param {string|string[]} classes - Classe(s) CSS
     * @param {Object} handlers - {click, mouseenter, etc.}
     * @param {Object} attributes - Attributs personnalisés
     * @returns {HTMLElement}
     */
    static createButton(text, classes = '', handlers = {}, attributes = {}) {
        const button = this.createElement('button', classes, 
            { type: 'button', ...attributes }, 
            handlers);
        button.textContent = text;
        return button;
    }

    /**
     * Crée une textarea personnalisée
     * @param {string} placeholder - Texte du placeholder
     * @param {string|string[]} classes - Classes CSS
     * @returns {HTMLElement}
     */
    static createTextarea(placeholder, classes = '') {
        return this.createElement('textarea', classes, { placeholder });
    }

    /**
     * Crée une checkbox avec label associé
     * @param {string} labelText - Texte du label
     * @param {boolean} checked - État initial
     * @param {string} id - ID unique
     * @param {string|string[]} classes - Classes CSS
     * @returns {Object} {checkbox, label, container}
     */
    static createCheckboxWithLabel(labelText, checked = true, id = '', classes = '') {
        const container = this.createElement('div', 'obligatoire-container');
        const checkbox = this.createElement('input', classes, 
            { type: 'checkbox', id, checked });
        const label = this.createElement('label', '', { htmlFor: id });
        label.textContent = labelText;
        
        container.appendChild(checkbox);
        container.appendChild(label);
        
        return { checkbox, label, container };
    }

    /**
     * Crée le wrapper principal d'une question
     * @param {boolean} isSubQuestion - Est-ce une sous-question
     * @returns {Object} {wrapper, questionContent, actionPanel}
     */
    static createQuestionWrapper(isSubQuestion = false) {
        const wrapper = this.createElement('div', 'question-wrapper-flex');
        const questionContent = this.createElement('div', 'question-content-white');
        const actionPanel = this.createElement('div', 'question-actions-side');
        
        if (isSubQuestion) {
            wrapper.classList.add('sub-question');
        }
        
        wrapper.appendChild(questionContent);
        wrapper.appendChild(actionPanel);
        
        return { wrapper, questionContent, actionPanel };
    }

    /**
     * Crée un élément d'option QCM (li avec checkbox, textarea, boutons)
     * @param {number} optionIndex - Index de l'option
     * @returns {Object} {listItem, checkbox, textarea, btnSub, btnRemove, textContainer}
     */
    static createQCMOptionElement(optionIndex) {
        const listItem = this.createElement('li', 'elementQCM');
        const checkbox = this.createElement('input', 'caseACocher', 
            { type: 'checkbox' });
        const textContainer = this.createElement('span', 'textQuestionContainer');
        const textarea = this.createElement('textarea', 'textAreaQuestion', 
            { placeholder: `[Choix ${optionIndex}]` });
        
        const btnSub = this.createButton('>', 
            ['btn-option-flat', 'btn-sub']);
        const btnRemove = this.createButton('-', 
            ['btn-option-flat', 'btn-remove']);
        
        textContainer.appendChild(textarea);
        listItem.appendChild(checkbox);
        listItem.appendChild(textContainer);
        listItem.appendChild(btnSub);
        listItem.appendChild(btnRemove);
        
        return { listItem, checkbox, textarea, btnSub, btnRemove, textContainer };
    }

    /**
     * Crée un select avec options
     * @param {string} labelText - Texte du label
     * @param {number[]} options - Valeurs des options
     * @param {number} defaultValue - Valeur sélectionnée par défaut
     * @param {string} id - ID unique
     * @returns {Object} {container, select}
     */
    static createSelect(labelText, options, defaultValue, id = '') {
        const container = this.createElement('div', 'header-row');
        const label = this.createElement('label', '', { htmlFor: id });
        label.textContent = labelText;
        
        const select = this.createElement('select', 'select-scale', { id });
        options.forEach(value => {
            const opt = this.createElement('option', '', { value });
            opt.textContent = value;
            if (value === defaultValue) opt.selected = true;
            select.appendChild(opt);
        });
        
        container.appendChild(label);
        container.appendChild(select);
        
        return { container, select };
    }

    /**
     * Crée un slider avec labels
     * @param {number} min - Valeur minimale
     * @param {number} max - Valeur maximale
     * @param {number} value - Valeur actuelle
     * @param {string} id - ID unique
     * @returns {Object} {container, slider, valueLabel, numbersContainer}
     */
    static createSlider(min, max, value, id = '') {
        const container = this.createElement('div', 'slider-container');
        const slider = this.createElement('input', 'rating-slider', 
            { type: 'range', id, min, max, value });
        const valueLabel = this.createElement('label', 'slider-value');
        valueLabel.textContent = value;
        const numbersContainer = this.createElement('div', 'slider-numbers');
        
        container.appendChild(slider);
        container.appendChild(numbersContainer);
        container.appendChild(valueLabel);
        
        return { container, slider, valueLabel, numbersContainer };
    }

    /**
     * Crée le conteneur de réponse (pour questions texte)
     * @returns {Object} {container, textarea}
     */
    static createResponseContainer() {
        const container = this.createElement('div', 'containerReponse');
        const textarea = this.createElement('textarea', 'reponseQuestion', 
            { placeholder: '[Réponse]' });
        container.appendChild(textarea);
        return { container, textarea };
    }

    /**
     * Crée un dropdown menu pour sous-questions
     * @returns {Object} {menu, optionQCM, optionTxt, optionScale}
     */
    static createSubQuestionDropdown() {
        const menu = this.createElement('div', 'dropdown');
        const optionQCM = this.createButton('Sous-question QCM');
        const optionTxt = this.createButton('Sous-question Texte');
        const optionScale = this.createButton('Sous-question Échelle de notation');
        
        menu.appendChild(optionQCM);
        menu.appendChild(optionTxt);
        menu.appendChild(optionScale);
        
        return { menu, optionQCM, optionTxt, optionScale };
    }

    /**
     * Crée une option de sous-question pour le dropdown
     * @param {string} text - Texte de l'option
     * @param {Function} callback - Fonction à appeler au clic
     * @returns {HTMLElement}
     */
    static createSubQuestionOption(text, callback) {
        const button = this.createButton(text, '', { click: callback });
        return button;
    }
}