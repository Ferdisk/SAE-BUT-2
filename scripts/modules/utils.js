/**
 * @file modules/utils.js
 * @description Fonctions utilitaires réutilisables sans logique métier
 * Extraction, transformation, affichage de données
 */

/**
 * Extrait une question du DOM et retourne un objet de données
 * @param {HTMLElement} wrapper - Élément wrapper de la question
 * @returns {Object|null} { contenu, type_question_id, obligatoire, choix?, sous_questions? }
 */
export function extractQuestion(wrapper) {
  const obligatoireCheckbox = wrapper.querySelector(".question-obligatoire");
  const obligatoire = obligatoireCheckbox ? (obligatoireCheckbox.checked ? 1 : 0) : 1;
  const isSubQuestion = wrapper.classList.contains("sub-question");

  const titreQCM = wrapper.querySelector(":scope > .question-content-white > .titreQCM");
  const titreTexte = wrapper.querySelector(":scope > .question-content-white > .titreQuestion");
  const titreRating = wrapper.querySelector(":scope > .question-content-white > .header-row > .titreRating");
  const listQCM = wrapper.querySelector(":scope > .question-content-white > .listQCM");

  // QCM
  if (titreQCM || (isSubQuestion && listQCM)) {
    const choix = [];
    wrapper.querySelectorAll(":scope > .question-content-white > .listQCM > li").forEach(li => {
      const textarea = li.querySelector(".textAreaQuestion");
      if (!textarea || !textarea.value.trim()) return;

      const sous_questions = [];
      li.querySelectorAll(":scope > .question-wrapper-flex").forEach(sub => {
        const subResult = extractQuestion(sub);
        if (subResult) sous_questions.push(subResult);
      });

      choix.push({
        contenu: textarea.value.trim(),
        sous_questions: sous_questions
      });
    });

    return {
      contenu: titreQCM ? titreQCM.value.trim() : "Sous-QCM",
      obligatoire: obligatoire,
      type_question_id: 2,
      choix: choix
    };
  }

  const containerReponse = wrapper.querySelector(":scope > .question-content-white > .containerReponse");

  // Question Texte
  if (titreTexte || (isSubQuestion && containerReponse && !listQCM)) {
    return {
      contenu: titreTexte ? titreTexte.value.trim() : "Sous-question Texte",
      obligatoire: obligatoire,
      type_question_id: 1
    };
  }

  const sliderContainer = wrapper.querySelector(":scope > .question-content-white > .slider-container");

  // Question Échelle
  if (titreRating || (isSubQuestion && sliderContainer)) {
    return {
      contenu: titreRating ? titreRating.value.trim() : "Sous-question Échelle",
      obligatoire: obligatoire,
      type_question_id: 3
    };
  }

  return null;
}

/**
 * Récupère l'intégralité du formulaire avec titre et questions
 * @returns {Object} { titre: string, questions: Array }
 */
export function getFullForm() {
  const container = document.getElementById("questions-container");
  const questions = [];

  if (container) {
    container.querySelectorAll(":scope > .question-wrapper-flex").forEach(wrapper => {
      const result = extractQuestion(wrapper);
      if (result) questions.push(result);
    });
  }

  return {
    titre: document.getElementById("form-titre")?.value || "Sans titre",
    questions: questions
  };
}

/**
 * Remplit l'interface avec les données d'un questionnaire existant
 * @param {Object} questionnaire - Données du questionnaire
 * @param {QuestionFactory} QuestionFactory - Factory pour créer les questions
 */
export function fillForm(questionnaire, QuestionFactory) {
  const titleInput = document.querySelector(".title-box");
  if (titleInput) {
    titleInput.value = questionnaire.titre || "";
    titleInput.disabled = true;
  }

  const descInput = document.querySelector(".desc-box");
  if (descInput) {
    descInput.value = questionnaire.description || "";
    descInput.disabled = true;
  }

  const container = document.getElementById("questions-container");
  if (!container) return;

  container.innerHTML = "";

  questionnaire.questions.forEach(q => {
    let element = null;

    if (q.type_question_id === 1) {
      // Question Texte
      element = QuestionFactory.createTexte();
      element.querySelector(".titreQuestion").value = q.contenu;
    } else if (q.type_question_id === 2) {
      // Question QCM
      element = QuestionFactory.createQCM();
      element.querySelector(".titreQCM").value = q.contenu;

      const list = element.querySelector(".listQCM");
      list.innerHTML = "";

      q.choix.forEach(c => {
        const li = document.createElement("li");
        li.classList.add("elementQCM");

        const textarea = document.createElement("textarea");
        textarea.classList.add("textAreaQuestion");
        textarea.value = c.contenu;
        textarea.disabled = true;

        li.appendChild(textarea);
        list.appendChild(li);
      });
    } else if (q.type_question_id === 3) {
      // Question Échelle
      element = QuestionFactory.createRatingScale();
      element.querySelector(".titreRating").value = q.contenu;
    }

    if (element) {
      // Désactiver tous les éléments interactifs
      element.querySelectorAll("input, textarea, button, select").forEach(el => {
        el.disabled = true;
      });

      container.appendChild(element);
    }
  });
}

/**
 * Affiche la liste des questionnaires du professeur
 * @param {Array} questionnaires - Tableau de questionnaires
 * @param {Function} onDelete - Callback pour la suppression
 * @param {Function} onView - Callback pour affichage
 */
export function displayQuestionnairesProf(questionnaires, onDelete, onView) {
  const container = document.getElementById("questionnaires-list");
  if (!container) return;

  container.innerHTML = "";

  if (questionnaires.length === 0) {
    container.innerHTML = "<p>Aucun questionnaire créé.</p>";
    return;
  }

  questionnaires.forEach(q => {
    const div = document.createElement("div");
    div.className = "questionnaire-card";

    div.innerHTML = `
      <h3>${q.titre}</h3>
      <p>${q.description || "Aucune description"}</p>
      <small>Créé le : ${new Date(q.date_creation).toLocaleDateString()}</small>
      <br>
      <strong>État :</strong> ${q.etat}
      <div class="actions">
        <button class="btn-blue btn-view" data-id="${q.id}">Voir</button>
        <button class="btn-red btn-delete" data-id="${q.id}">Supprimer</button>
      </div>
    `;

    const btnDelete = div.querySelector(".btn-delete");
    const btnView = div.querySelector(".btn-view");

    if (btnDelete) {
      btnDelete.addEventListener("click", () => onDelete(q.id, q.titre, div));
    }

    if (btnView) {
      btnView.addEventListener("click", () => onView(q.id));
    }

    container.appendChild(div);
  });
}

/**
 * Met à jour l'interface selon l'état du formulaire
 * @param {string} etat - État du formulaire (brouillon, envoye)
 */
export function updateUIBasedOnFormState(etat) {
  const saveBtn = document.getElementById("save-btn");
  const updateBtn = document.getElementById("update-btn");
  const submitBtn = document.getElementById("submit-btn");
  const btnQCM = document.getElementById("btn-qcm");
  const btnTexte = document.getElementById("btn-texte");
  const btnEchelle = document.getElementById("btn-echelle");
  const btnReset = document.getElementById("btn-reset");

  // Réinitialiser tous les boutons
  document.querySelectorAll("input, textarea, select, button").forEach(el => {
    el.disabled = false;
  });

  if (etat === "brouillon") {
    // Mode édition - afficher les boutons de sauvegarde/mise à jour
    if (saveBtn) saveBtn.style.display = "none";
    if (updateBtn) updateBtn.style.display = "inline-block";
    if (submitBtn) submitBtn.style.display = "inline-block";

    // Garder les boutons d'ajout de questions actifs
    if (btnQCM) btnQCM.disabled = false;
    if (btnTexte) btnTexte.disabled = false;
    if (btnEchelle) btnEchelle.disabled = false;
    if (btnReset) btnReset.disabled = false;
  } else if (etat === "envoye") {
    // Mode lecture - tout désactiver
    if (updateBtn) updateBtn.style.display = "none";
    if (saveBtn) saveBtn.style.display = "none";
    if (submitBtn) submitBtn.style.display = "none";

    if (btnQCM) btnQCM.disabled = true;
    if (btnTexte) btnTexte.disabled = true;
    if (btnEchelle) btnEchelle.disabled = true;
    if (btnReset) btnReset.disabled = true;

    document.querySelectorAll("input, textarea, select, button").forEach(el => {
      el.disabled = true;
    });
  }
}

/**
 * Affiche/cache le message d'indication "Cliquez pour ajouter une question"
 */
export function updateHintMessage() {
  const hint = document.querySelector(".hint");
  if (!hint) return;

  const container = document.getElementById("questions-container");
  const hasQuestions = container && container.children.length > 0;

  hint.textContent = hasQuestions ? "" : "Cliquez sur un type de question pour commencer";
}

/**
 * Extrait l'ID du formulaire depuis l'URL
 * @returns {number|null}
 */
export function extractFormIdFromURL() {
  const parts = window.location.pathname.split("/");
  const id = parts[parts.length - 1];

  return id && !isNaN(id) ? parseInt(id, 10) : null;
}