document.addEventListener('DOMContentLoaded', async () => {
  const questionContentEl = document.getElementById('question-content');
  const answerCountEl = document.getElementById('answer-count');
  const tbody = document.getElementById('answers-tbody');
  const emptyState = document.getElementById('empty-state');
  const answersTable = document.getElementById('answers-table');
  const backLink = document.getElementById('back-link');

  const pathMatch = window.location.pathname.match(/^\/statistiques\/(\d+)\/question\/(\d+)$/);

  if (!pathMatch) {
    questionContentEl.textContent = 'URL invalide pour afficher le detail de la question.';
    answersTable.hidden = true;
    emptyState.hidden = false;
    return;
  }

  const formulaireId = Number.parseInt(pathMatch[1], 10);
  const questionId = Number.parseInt(pathMatch[2], 10);

  if (backLink) {
    backLink.href = `/statistiques/${formulaireId}`;
  }

  if (Number.isNaN(formulaireId) || Number.isNaN(questionId)) {
    questionContentEl.textContent = 'Identifiants invalides.';
    answersTable.hidden = true;
    emptyState.hidden = false;
    return;
  }

  try {
    const response = await fetch(`/api/stats-globales/${formulaireId}`, { credentials: 'include' });
    const data = await response.json();

    if (!data.succes) {
      throw new Error('Reponse API invalide');
    }

    const allTextResponses = Array.isArray(data.reponses_textuelles) ? data.reponses_textuelles : [];
    const filteredResponses = allTextResponses.filter((row) => {
      const id = Number.parseInt(row.question_id, 10);
      return id === questionId;
    });

    const questionFromStats = (Array.isArray(data.reponses_par_question) ? data.reponses_par_question : [])
      .find((row) => Number.parseInt(row.question_id, 10) === questionId);

    const questionLabel = String(
      (questionFromStats && questionFromStats.contenu) ||
      (filteredResponses[0] && (filteredResponses[0].question || filteredResponses[0].contenu)) ||
      `Question ${questionId}`
    ).trim();

    questionContentEl.textContent = questionLabel;
    answerCountEl.textContent = String(filteredResponses.length);

    if (!filteredResponses.length) {
      answersTable.hidden = true;
      emptyState.hidden = false;
      return;
    }

    answersTable.hidden = false;
    emptyState.hidden = true;
    tbody.innerHTML = '';

    filteredResponses.forEach((row, index) => {
      const tr = document.createElement('tr');

      const indexCell = document.createElement('td');
      indexCell.textContent = String(index + 1);

      const userCell = document.createElement('td');
      const prenom = String(row.prenom || '').trim();
      const nom = String(row.nom || '').trim();
      const fullName = `${prenom} ${nom}`.trim();
      userCell.textContent = fullName || 'Etudiant inconnu';

      const answerCell = document.createElement('td');
      answerCell.textContent = String(row.reponse_texte || '').trim();

      tr.appendChild(indexCell);
      tr.appendChild(userCell);
      tr.appendChild(answerCell);
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error('Erreur chargement detail question:', error);
    questionContentEl.textContent = 'Impossible de charger les details de la question.';
    answersTable.hidden = true;
    emptyState.hidden = false;
  }
});
