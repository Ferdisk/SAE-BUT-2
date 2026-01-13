/**
 * @module questionFactory
 * @description Factory Pattern pour créer différents types de questions
 */

import { DOMBuilder } from './domBuilder.js';

/**
 * Classe abstraite pour les questions
 */
class BaseQuestion {
    constructor(isSubQuestion = false) {
        this.isSubQuestion = isSubQuestion;
        this.wrapper = null;
        this.questionContent = null;
        this.actionPanel = null;
    }

    /**
     * Crée le conteneur principal
     * @protected
     */
    createMainContainer() {
        const { wrapper, questionContent, actionPanel } = DOMBuilder.createQuestionWrapper(this.isSubQuestion);
        this.wrapper = wrapper;
        this.questionContent = questionContent;
        this.actionPanel = actionPanel;
    }

    /**
     * Crée le bouton de suppression
     * @protected
     */
    createDeleteButton() {
        const btnDelete = DOMBuilder.createButton('-', ['side-btn', 'side-btn-delete']);
        btnDelete.addEventListener('click', () => {
            this.wrapper.remove();
            this.updateHintMessage();
        });
        return btnDelete;
    }

    /**
     * Met à jour le message d'indication
     * @protected
     */
    updateHintMessage() {
        const hint = document.querySelector('.hint');
        if (!hint) return;

        const container = document.getElementById('questions-container');
        if (container && container.children.length > 0) {
            hint.textContent = '';
        } else {
            hint.textContent = 'Cliquez sur un type de question pour commencer';
        }
    }

    /**
     * Rend la question (à implémenter dans les sous-classes)
     */
    render() {
        throw new Error('render() doit être implémentée');
    }
}

/**
 * Question de type QCM
 */
class QCMQuestion extends BaseQuestion {
    #localOptionCounter = 1;

    render() {
        this.createMainContainer();

        // Titre
        if (!this.isSubQuestion) {
            const titreQCM = DOMBuilder.createTextarea('[Titre du QCM]', 'titreQCM');
            const obligatoire = DOMBuilder.createCheckboxWithLabel(
                'Question obligatoire',
                true,
                `qcm-obligatoire-${Date.now()}`,
                'question-obligatoire'
            );
            this.questionContent.appendChild(titreQCM);
            this.questionContent.appendChild(obligatoire.container);
        }

        // Liste des options
        const listQCM = DOMBuilder.createElement('ul', 'listQCM');
        const { listItem: firstOption } = DOMBuilder.createQCMOptionElement(1);
        this.#attachOptionHandlers(firstOption, listQCM);
        listQCM.appendChild(firstOption);

        // Option "Autre"
        if (!this.isSubQuestion) {
            const otherOption = DOMBuilder.createElement('div', 'other-option');
            const checkbox = DOMBuilder.createElement('input', 'other-option-checkbox', 
                { type: 'checkbox', id: `other-${Date.now()}` });
            const label = DOMBuilder.createElement('label', '', 
                { htmlFor: `other-${Date.now()}` });
            label.textContent = 'Ajouter l\'option "Autre (à préciser)"';
            otherOption.appendChild(checkbox);
            otherOption.appendChild(label);
            this.questionContent.appendChild(listQCM);
            this.questionContent.appendChild(otherOption);
        } else {
            this.questionContent.appendChild(listQCM);
        }

        // Boutons d'actions
        const btnAddOption = DOMBuilder.createButton('+', ['side-btn', 'side-btn-add']);
        btnAddOption.addEventListener('click', () => {
            this.#localOptionCounter++;
            const { listItem: newOption } = DOMBuilder.createQCMOptionElement(this.#localOptionCounter);
            this.#attachOptionHandlers(newOption, listQCM);
            listQCM.appendChild(newOption);
        });

        this.actionPanel.appendChild(btnAddOption);
        this.actionPanel.appendChild(this.createDeleteButton());

        return this.wrapper;
    }

    /**
     * Attache les handlers aux boutons d'une option
     * @private
     */
    #attachOptionHandlers(optionElement, listQCM) {
        const btnSub = optionElement.querySelector('.btn-sub');
        const btnRemove = optionElement.querySelector('.btn-remove');

        btnSub.addEventListener('click', () => {
            const existingMenu = optionElement.querySelector('.dropdown');
            if (existingMenu) {
                existingMenu.remove();
                return;
            }

            const { menu, optionQCM, optionTxt, optionScale } = DOMBuilder.createSubQuestionDropdown();

            optionQCM.addEventListener('click', () => {
                const subQCM = new QCMQuestion(true).render();
                optionElement.appendChild(subQCM);
                menu.remove();
            });

            optionTxt.addEventListener('click', () => {
                const subTxt = new TextQuestion(true).render();
                optionElement.appendChild(subTxt);
                menu.remove();
            });

            optionScale.addEventListener('click', () => {
                const subScale = new RatingScaleQuestion(true).render();
                optionElement.appendChild(subScale);
                menu.remove();
            });

            optionElement.appendChild(menu);
        });

        btnRemove.addEventListener('click', () => {
            if (listQCM.children.length > 1) {
                optionElement.remove();
            } else {
                alert('Un QCM doit avoir au moins une option.');
            }
        });
    }
}

/**
 * Question de type Texte Libre
 */
class TextQuestion extends BaseQuestion {
    render() {
        this.createMainContainer();

        if (!this.isSubQuestion) {
            const titreQuestion = DOMBuilder.createTextarea('[Question Texte]', 'titreQuestion');
            const obligatoire = DOMBuilder.createCheckboxWithLabel(
                'Question obligatoire',
                true,
                `txt-obligatoire-${Date.now()}`,
                'question-obligatoire'
            );
            this.questionContent.appendChild(titreQuestion);
            this.questionContent.appendChild(obligatoire.container);
        }

        const { container: reponseContainer } = DOMBuilder.createResponseContainer();
        this.questionContent.appendChild(reponseContainer);

        this.actionPanel.appendChild(this.createDeleteButton());

        return this.wrapper;
    }
}

/**
 * Question de type Échelle de Notation
 */
class RatingScaleQuestion extends BaseQuestion {
    render() {
        this.createMainContainer();
        const uniqueId = `rating-${Date.now()}`;
        let currentMax = 10;

        if (!this.isSubQuestion) {
            const headerTitleRow = DOMBuilder.createElement('div', ['header-row', 'rating-header']);
            const titreRating = DOMBuilder.createTextarea('[Question échelle de notation]', 'titreRating');
            const obligatoire = DOMBuilder.createCheckboxWithLabel(
                'Question obligatoire',
                true,
                `rating-obligatoire-${Date.now()}`,
                'question-obligatoire'
            );
            headerTitleRow.appendChild(titreRating);
            headerTitleRow.appendChild(obligatoire.container);
            this.questionContent.appendChild(headerTitleRow);
        }

        // Select d'échelle
        const { container: scaleRow, select: selectScale } = DOMBuilder.createSelect(
            'Notation sur : ',
            [5, 10, 20, 50, 100],
            10,
            uniqueId
        );
        this.questionContent.appendChild(scaleRow);

        // Slider
        const { container: sliderRow, slider, valueLabel, numbersContainer } = 
            DOMBuilder.createSlider(0, currentMax, Math.floor(currentMax / 2), `slider-${uniqueId}`);
        this.questionContent.appendChild(sliderRow);

        // Logique du slider
        const updateSliderFill = () => {
            const percent = (slider.value / slider.max) * 100;
            slider.style.backgroundImage = `linear-gradient(to right, #007bba ${percent}%, #ccc ${percent}%)`;
        };

        const generateSliderNumbers = (max) => {
            numbersContainer.innerHTML = '';
            const step = max <= 10 ? 1 : Math.ceil(max / 10);
            for (let i = 0; i <= max; i += step) {
                const span = DOMBuilder.createElement('span', '', {}, {});
                span.textContent = i;
                span.style.position = 'absolute';
                span.style.left = `calc(8px + (100% - 16px) * ${i / max})`;
                span.style.transform = 'translateX(-50%)';
                numbersContainer.appendChild(span);
            }
            if (max % step !== 0) {
                const span = DOMBuilder.createElement('span', '', {}, {});
                span.textContent = max;
                span.style.position = 'absolute';
                span.style.left = 'calc(100% - 8px)';
                span.style.transform = 'translateX(-50%)';
                numbersContainer.appendChild(span);
            }
        };

        updateSliderFill();
        generateSliderNumbers(currentMax);

        slider.addEventListener('input', () => {
            valueLabel.textContent = slider.value;
            updateSliderFill();
        });

        selectScale.addEventListener('change', (e) => {
            currentMax = parseInt(e.target.value, 10);
            slider.max = currentMax;
            slider.value = Math.floor(currentMax / 2);
            valueLabel.textContent = slider.value;
            updateSliderFill();
            generateSliderNumbers(currentMax);
        });

        this.actionPanel.appendChild(this.createDeleteButton());

        return this.wrapper;
    }
}

/**
 * Factory pour créer les questions
 */
export class QuestionFactory {
    /**
     * Crée une question QCM
     * @param {boolean} isSubQuestion
     * @returns {HTMLElement}
     */
    static createQCM(isSubQuestion = false) {
        return new QCMQuestion(isSubQuestion).render();
    }

    /**
     * Crée une question Texte
     * @param {boolean} isSubQuestion
     * @returns {HTMLElement}
     */
    static createTexte(isSubQuestion = false) {
        return new TextQuestion(isSubQuestion).render();
    }

    /**
     * Crée une question Échelle de Notation
     * @param {boolean} isSubQuestion
     * @returns {HTMLElement}
     */
    static createRatingScale(isSubQuestion = false) {
        return new RatingScaleQuestion(isSubQuestion).render();
    }
}
