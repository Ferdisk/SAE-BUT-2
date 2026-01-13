/**
 * @file modules/questionFactory.js
 * @description Factory Pattern pour création de différents types de questions
 * Élimine la duplication : addQCM(), addTexte(), addRatingScale()
 */

import { DOMBuilder } from "./domBuilder.js";

/**
 * Classe abstraite de base pour une question
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
   * @returns {Object} { wrapper, questionContent, actionPanel }
   */
  createMainContainer() {
    const { wrapper, questionContent, actionPanel } = DOMBuilder.createQuestionWrapper(this.isSubQuestion);
    this.wrapper = wrapper;
    this.questionContent = questionContent;
    this.actionPanel = actionPanel;
    return { wrapper, questionContent, actionPanel };
  }

  /**
   * Crée le bouton de suppression standard
   * @protected
   * @returns {HTMLButtonElement}
   */
  createDeleteButton() {
    return DOMBuilder.createButton("-", ["side-btn", "side-btn-delete"], {
      click: () => {
        this.wrapper.remove();
        this.#updateHintMessage();
      }
    });
  }

  /**
   * Met à jour le message d'indication (visible/caché)
   * @private
   */
  #updateHintMessage() {
    const hint = document.querySelector(".hint");
    if (hint) {
      const container = document.getElementById("questions-container");
      hint.textContent = (container && container.children.length > 0)
        ? ""
        : "Cliquez sur un type de question pour commencer";
    }
  }

  /**
   * Rend la question
   * @abstract
   * @returns {HTMLElement}
   */
  render() {
    throw new Error("La méthode render() doit être implémentée");
  }
}

/**
 * Question de type QCM (Multiple Choice)
 */
export class QCMQuestion extends BaseQuestion {
  constructor(isSubQuestion = false) {
    super(isSubQuestion);
    this.localOptionCounter = 1;
    this.listQCM = null;
  }

  /**
   * Crée une option QCM (checkbox + textarea + boutons sous-question/supprimer)
   * @private
   * @param {number} optionIndex
   * @returns {Object} { listItem, textarea }
   */
  #createOptionElement(optionIndex) {
    const {
      listItem,
      textarea,
      buttonSubQuestion,
      buttonRemoveOption
    } = DOMBuilder.createQCMOptionElement(optionIndex);

    // Handler pour ajouter une sous-question
    buttonSubQuestion.addEventListener("click", () => {
      const existingMenu = listItem.querySelector(".dropdown");
      if (existingMenu) {
        existingMenu.remove();
        return;
      }

      const menu = DOMBuilder.createSubQuestionDropdown();

      const optionQCM = DOMBuilder.createSubQuestionOption("Sous-question QCM", () => {
        const subQuestion = new QCMQuestion(true).render();
        listItem.appendChild(subQuestion);
        menu.remove();
      });

      const optionTxt = DOMBuilder.createSubQuestionOption("Sous-question Texte", () => {
        const subQuestion = new TextQuestion(true).render();
        listItem.appendChild(subQuestion);
        menu.remove();
      });

      const optionScale = DOMBuilder.createSubQuestionOption("Sous-question Échelle de notation", () => {
        const subQuestion = new RatingScaleQuestion(true).render();
        listItem.appendChild(subQuestion);
        menu.remove();
      });

      menu.appendChild(optionQCM);
      menu.appendChild(optionTxt);
      menu.appendChild(optionScale);
      listItem.appendChild(menu);
    });

    // Handler pour supprimer une option
    buttonRemoveOption.addEventListener("click", () => {
      if (this.listQCM.children.length > 1) {
        listItem.remove();
      } else {
        alert("Un QCM doit avoir au moins une option.");
      }
    });

    return { listItem, textarea };
  }

  /**
   * Rend la question QCM
   * @returns {HTMLElement}
   */
  render() {
    const { wrapper, questionContent, actionPanel } = this.createMainContainer();

    // Titre (si ce n'est pas une sous-question)
    let titreQCM = null;
    if (!this.isSubQuestion) {
      titreQCM = DOMBuilder.createTextarea("[Titre du QCM]", ["titreQCM"]);
      questionContent.appendChild(titreQCM);
      questionContent.appendChild(DOMBuilder.createCheckboxWithLabel("Question obligatoire", true, "obligatoire-qcm").container);
    }

    // Liste des options
    this.listQCM = DOMBuilder.createList(["listQCM"]);
    const { listItem: firstOption } = this.#createOptionElement(this.localOptionCounter);
    this.listQCM.appendChild(firstOption);
    questionContent.appendChild(this.listQCM);

    // Option "Autre choix"
    if (!this.isSubQuestion) {
      const { container: otherOption } = DOMBuilder.createOtherOption();
      questionContent.appendChild(otherOption);
    }

    // Boutons d'action (côté droit)
    const btnAddOption = DOMBuilder.createButton("+", ["side-btn", "side-btn-add"], {
      click: () => {
        this.localOptionCounter++;
        const { listItem: newOption } = this.#createOptionElement(this.localOptionCounter);
        this.listQCM.appendChild(newOption);
      }
    });

    const btnDelete = this.createDeleteButton();

    actionPanel.appendChild(btnAddOption);
    actionPanel.appendChild(btnDelete);

    return wrapper;
  }
}

/**
 * Question de type Texte Libre
 */
export class TextQuestion extends BaseQuestion {
  /**
   * Rend la question texte
   * @returns {HTMLElement}
   */
  render() {
    const { wrapper, questionContent, actionPanel } = this.createMainContainer();

    // Titre (si ce n'est pas une sous-question)
    if (!this.isSubQuestion) {
      const titreQuestion = DOMBuilder.createTextarea("[Question Texte]", ["titreQuestion"]);
      questionContent.appendChild(titreQuestion);
      questionContent.appendChild(DOMBuilder.createCheckboxWithLabel("Question obligatoire", true, "obligatoire-text").container);
    }

    // Zone de réponse
    const { container: responseContainer } = DOMBuilder.createResponseContainer();
    questionContent.appendChild(responseContainer);

    // Bouton de suppression (côté droit)
    const btnDelete = this.createDeleteButton();
    actionPanel.appendChild(btnDelete);

    return wrapper;
  }
}

/**
 * Question de type Échelle de Notation (Rating Scale)
 */
export class RatingScaleQuestion extends BaseQuestion {
  constructor(isSubQuestion = false) {
    super(isSubQuestion);
    this.currentMax = 10;
    this.uniqueId = Date.now();
  }

  /**
   * Génère les nombres affichés sous le slider
   * @private
   * @param {number} max
   * @param {HTMLDivElement} numbersContainer
   */
  #generateSliderNumbers(max, numbersContainer) {
    numbersContainer.innerHTML = "";
    numbersContainer.style.position = "relative";
    
    const step = max <= 10 ? 1 : Math.ceil(max / 10);
    for (let i = 0; i <= max; i += step) {
      const span = document.createElement("span");
      span.textContent = i;
      span.style.position = "absolute";
      span.style.left = `calc(8px + (100% - 16px) * ${i / max})`;
      span.style.transform = "translateX(-50%)";
      numbersContainer.appendChild(span);
    }

    if (max % step !== 0) {
      const span = document.createElement("span");
      span.textContent = max;
      span.style.position = "absolute";
      span.style.left = `calc(100% - 8px)`;
      span.style.transform = "translateX(-50%)";
      numbersContainer.appendChild(span);
    }
  }

  /**
   * Met à jour le remplissage du slider visuellement
   * @private
   * @param {HTMLInputElement} slider
   */
  #updateSliderFill(slider) {
    const percent = (slider.value / slider.max) * 100;
    slider.style.backgroundImage = `linear-gradient(to right, #007bba ${percent}%, #ccc ${percent}%)`;
  }

  /**
   * Rend la question d'échelle de notation
   * @returns {HTMLElement}
   */
  render() {
    const { wrapper, questionContent, actionPanel } = this.createMainContainer();

    // Titre (si ce n'est pas une sous-question)
    if (!this.isSubQuestion) {
      const { headerRow: headerTitleRow, titleElement: titreRating } = DOMBuilder.createHeaderRow(
        "[Question échelle de notation]",
        "titreRating"
      );
      const obligatoireToggle = DOMBuilder.createCheckboxWithLabel("Question obligatoire", true, "obligatoire-rating").container;
      headerTitleRow.appendChild(obligatoireToggle);
      questionContent.appendChild(headerTitleRow);
    }

    // Sélecteur du type d'échelle
    const { container: headerScaleRow, select: selectScale } = DOMBuilder.createSelect(
      "Notation sur : ",
      [5, 10, 20, 50, 100],
      10,
      `select-scale-${this.uniqueId}`
    );

    // Conteneur du slider
    const sliderRow = DOMBuilder.createElement("div", ["slider-container"]);

    const slider = DOMBuilder.createSlider(0, this.currentMax, Math.floor(this.currentMax / 2), `slider-${this.uniqueId}`);
    this.#updateSliderFill(slider);

    const sliderValueLabel = DOMBuilder.createSliderValueLabel(slider.value);

    const numbersContainer = DOMBuilder.createSliderNumbersContainer();
    this.#generateSliderNumbers(this.currentMax, numbersContainer);

    // Event listeners pour slider
    slider.addEventListener("input", (e) => {
      sliderValueLabel.textContent = e.target.value;
      this.#updateSliderFill(slider);
    });

    // Event listener pour changer l'échelle
    selectScale.addEventListener("change", (e) => {
      this.currentMax = parseInt(e.target.value, 10);
      slider.max = this.currentMax;
      slider.value = Math.floor(this.currentMax / 2);
      sliderValueLabel.textContent = slider.value;
      this.#updateSliderFill(slider);
      this.#generateSliderNumbers(this.currentMax, numbersContainer);
    });

    // Assemblage slider
    sliderRow.appendChild(slider);
    sliderRow.appendChild(numbersContainer);
    sliderRow.appendChild(sliderValueLabel);

    questionContent.appendChild(headerScaleRow);
    questionContent.appendChild(sliderRow);

    // Bouton de suppression
    const btnDelete = this.createDeleteButton();
    actionPanel.appendChild(btnDelete);

    return wrapper;
  }
}

/**
 * Factory pour créer les bonnes instances de questions
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
   * Crée une question d'échelle de notation
   * @param {boolean} isSubQuestion
   * @returns {HTMLElement}
   */
  static createRatingScale(isSubQuestion = false) {
    return new RatingScaleQuestion(isSubQuestion).render();
  }
}