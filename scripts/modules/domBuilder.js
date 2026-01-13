/**
 * @file modules/domBuilder.js
 * @description Classe de construction centralisée d'éléments DOM réutilisables
 * Élimine la duplication de code createElement() et applique des conventions cohérentes
 */

export class DOMBuilder {
  /**
   * Crée un élément générique avec classes et attributs
   * @param {string} tag - Balise HTML (div, button, input, etc.)
   * @param {string[]} classes - Liste des classes CSS à ajouter
   * @param {Object} attributes - Attributs HTML (id, placeholder, type, etc.)
   * @param {Object} handlers - Écouteurs événements {eventName: callback}
   * @returns {HTMLElement} Élément DOM créé
   */
  static createElement(tag, classes = [], attributes = {}, handlers = {}) {
    const element = document.createElement(tag);
    
    classes.forEach(cls => element.classList.add(cls));
    
    Object.entries(attributes).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        element.setAttribute(key, value);
      }
    });
    
    Object.entries(handlers).forEach(([event, callback]) => {
      element.addEventListener(event, callback);
    });
    
    return element;
  }

  /**
   * Crée une zone de texte (textarea)
   * @param {string} placeholder - Texte indicatif
   * @param {string[]} classes - Classes CSS additionnelles
   * @returns {HTMLTextAreaElement}
   */
  static createTextarea(placeholder = "", classes = []) {
    return this.createElement("textarea", classes, { placeholder });
  }

  /**
   * Crée un bouton
   * @param {string} text - Texte du bouton
   * @param {string[]} classes - Classes CSS
   * @param {Object} handlers - Écouteurs événements
   * @param {Object} attributes - Attributs additionnels (type, disabled, etc.)
   * @returns {HTMLButtonElement}
   */
  static createButton(text = "", classes = [], handlers = {}, attributes = {}) {
    const button = this.createElement("button", classes, { type: "button", ...attributes }, handlers);
    button.textContent = text;
    return button;
  }

  /**
   * Crée une checkbox avec étiquette
   * @param {string} labelText - Texte de l'étiquette
   * @param {boolean} checked - État initial
   * @param {string} id - Identifiant unique
   * @param {string[]} classes - Classes CSS
   * @returns {Object} { container, checkbox, label }
   */
  static createCheckboxWithLabel(labelText = "", checked = true, id = "", classes = []) {
    const container = this.createElement("div", classes);
    
    const checkbox = this.createElement("input", ["question-obligatoire"], { 
      type: "checkbox",
      id: id || `checkbox-${Date.now()}`
    });
    checkbox.checked = checked;
    
    const label = this.createElement("label", [], {}, {});
    label.textContent = labelText;
    if (id) label.setAttribute("for", id);
    
    container.appendChild(checkbox);
    container.appendChild(label);
    
    return { container, checkbox, label };
  }

  /**
   * Crée une liste non-ordonnée
   * @param {string[]} classes - Classes CSS
   * @returns {HTMLUListElement}
   */
  static createList(classes = []) {
    return this.createElement("ul", classes);
  }

  /**
   * Crée un élément de liste
   * @param {string[]} classes - Classes CSS
   * @returns {HTMLLIElement}
   */
  static createListItem(classes = []) {
    return this.createElement("li", classes);
  }

  /**
   * Crée un conteneur pour une question (wrapper flex)
   * @param {boolean} isSubQuestion - Si c'est une sous-question
   * @returns {Object} { wrapper, questionContent, actionPanel }
   */
  static createQuestionWrapper(isSubQuestion = false) {
    const wrapper = this.createElement("div", ["question-wrapper-flex"]);
    const questionContent = this.createElement("div", ["question-content-white"]);
    const actionPanel = this.createElement("div", ["question-actions-side"]);
    
    if (isSubQuestion) {
      wrapper.classList.add("sub-question");
    }
    
    wrapper.appendChild(questionContent);
    wrapper.appendChild(actionPanel);
    
    return { wrapper, questionContent, actionPanel };
  }

  /**
   * Crée une rangée d'en-tête avec titre et options
   * @param {string} placeholder - Placeholder du textarea de titre
   * @param {string} titleClass - Classe CSS du titre
   * @returns {Object} { headerRow, titleElement }
   */
  static createHeaderRow(placeholder = "", titleClass = "") {
    const headerRow = this.createElement("div", ["header-row"]);
    const titleElement = this.createTextarea(placeholder, [titleClass]);
    
    headerRow.appendChild(titleElement);
    
    return { headerRow, titleElement };
  }

  /**
   * Crée un conteneur de réponse pour questions texte
   * @returns {Object} { container, textarea }
   */
  static createResponseContainer() {
    const container = this.createElement("div", ["containerReponse"]);
    const textarea = this.createTextarea("[Réponse]", ["reponseQuestion"]);
    
    container.appendChild(textarea);
    
    return { container, textarea };
  }

  /**
   * Crée un select avec options
   * @param {string} labelText - Texte de l'étiquette
   * @param {number[]} options - Valeurs des options
   * @param {number} defaultValue - Valeur par défaut
   * @param {string} id - Identifiant du select
   * @returns {Object} { container, label, select }
   */
  static createSelect(labelText = "", options = [], defaultValue = null, id = "") {
    const container = this.createElement("div", ["header-row"]);
    
    const label = this.createElement("label", [], { htmlFor: id });
    label.textContent = labelText;
    
    const select = this.createElement("select", ["select-scale"], { id });
    
    options.forEach(value => {
      const option = this.createElement("option", [], { value });
      option.textContent = value;
      if (value === defaultValue) option.selected = true;
      select.appendChild(option);
    });
    
    container.appendChild(label);
    container.appendChild(select);
    
    return { container, label, select };
  }

  /**
   * Crée un slider (input range)
   * @param {number} min - Valeur minimale
   * @param {number} max - Valeur maximale
   * @param {number} value - Valeur initiale
   * @param {string} id - Identifiant
   * @returns {HTMLInputElement}
   */
  static createSlider(min = 0, max = 10, value = 5, id = "") {
    return this.createElement("input", ["rating-slider"], {
      type: "range",
      min,
      max,
      value,
      id: id || `slider-${Date.now()}`
    });
  }

  /**
   * Crée un menu déroulant (dropdown) pour sous-questions
   * @returns {HTMLDivElement}
   */
  static createSubQuestionDropdown() {
    return this.createElement("div", ["dropdown"]);
  }

  /**
   * Crée un option de sous-question pour le dropdown
   * @param {string} text - Texte de l'option
   * @param {Function} callback - Callback au clic
   * @returns {HTMLButtonElement}
   */
  static createSubQuestionOption(text = "", callback) {
    return this.createButton(text, [], { click: callback });
  }

  /**
   * Crée un conteneur pour les nombres du slider
   * @returns {HTMLDivElement}
   */
  static createSliderNumbersContainer() {
    return this.createElement("div", ["slider-numbers"]);
  }

  /**
   * Crée un label pour afficher la valeur du slider
   * @param {number} value - Valeur initiale
   * @returns {HTMLLabelElement}
   */
  static createSliderValueLabel(value = 0) {
    const label = this.createElement("label", ["slider-value"]);
    label.textContent = value;
    return label;
  }

  /**
   * Crée un conteneur pour les options QCM avec checkbox + textarea + boutons
   * @param {number} optionIndex - Numéro de l'option
   * @returns {Object} { listItem, checkbox, textContainer, textarea, buttonSubQuestion, buttonRemoveOption }
   */
  static createQCMOptionElement(optionIndex = 1) {
    const listItem = this.createListItem(["elementQCM"]);
    
    const checkbox = this.createElement("input", ["caseACocher"], { type: "checkbox" });
    
    const textContainer = this.createElement("span", ["textQuestionContainer"]);
    const textarea = this.createTextarea(`[Choix ${optionIndex}]`, ["textAreaQuestion"]);
    textContainer.appendChild(textarea);
    
    const buttonSubQuestion = this.createButton(">", ["btn-option-flat", "btn-sub"]);
    const buttonRemoveOption = this.createButton("-", ["btn-option-flat", "btn-remove"]);
    
    listItem.appendChild(checkbox);
    listItem.appendChild(textContainer);
    listItem.appendChild(buttonSubQuestion);
    listItem.appendChild(buttonRemoveOption);
    
    return { listItem, checkbox, textContainer, textarea, buttonSubQuestion, buttonRemoveOption };
  }

  /**
   * Crée le section "Autre choix" pour QCM
   * @returns {Object} { container, checkbox, label }
   */
  static createOtherOption() {
    const container = this.createElement("div", ["other-option"]);
    
    const checkboxId = `other-option-${Date.now()}`;
    const checkbox = this.createElement("input", [], { type: "checkbox", id: checkboxId });
    
    const label = this.createElement("label", [], { htmlFor: checkboxId });
    label.textContent = "Ajouter l'option \"Autre (à préciser)\"";
    
    container.appendChild(checkbox);
    container.appendChild(label);
    
    return { container, checkbox, label };
  }

  /**
   * Crée une carte de questionnaire pour affichage en liste
   * @param {Object} questionnaire - Données du questionnaire
   * @returns {HTMLDivElement}
   */
  static createQuestionnaireCard(questionnaire) {
    const card = this.createElement("div", ["questionnaire-card"]);
    
    card.innerHTML = `
      <h3>${questionnaire.titre}</h3>
      <p>${questionnaire.description || "Aucune description"}</p>
      <small>Créé le : ${new Date(questionnaire.date_creation).toLocaleDateString()}</small>
      <br>
      <strong>État :</strong> ${questionnaire.etat}
      <div class="actions">
        <button class="btn-blue btn-view" data-id="${questionnaire.id}">Voir</button>
        <button class="btn-red btn-delete" data-id="${questionnaire.id}">Supprimer</button>
      </div>
    `;
    
    return card;
  }
}