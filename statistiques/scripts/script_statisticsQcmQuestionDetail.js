let qcmDetailChart = null;

function toInt(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function getPiePalette(size) {
  const base = [
    '#e2001a', '#0082c8', '#ffb703', '#2a9d8f', '#fb8500', '#4361ee', '#8ecae6', '#90be6d', '#f94144', '#6d597a'
  ];

  if (size <= base.length) return base.slice(0, size);

  const colors = [...base];
  for (let index = base.length; index < size; index += 1) {
    const hue = Math.round((index * 137.5) % 360);
    colors.push(`hsl(${hue} 65% 52%)`);
  }

  return colors;
}

function parseParams() {
  const params = new URLSearchParams(window.location.search);
  const formulaireId = toInt(params.get('formulaireId'));
  const questionId = toInt(params.get('questionId'));

  return { formulaireId, questionId };
}

function renderQcmChart(labels, counts) {
  const canvas = document.getElementById('qcm-detail-chart');
  if (!canvas) return;

  if (qcmDetailChart) {
    qcmDetailChart.destroy();
  }

  qcmDetailChart = new Chart(canvas, {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        label: 'Part des reponses (%)',
        data: counts,
        backgroundColor: getPiePalette(labels.length)
      }]
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const value = Number(ctx.parsed) || 0;
              const total = (ctx.dataset?.data || []).reduce((sum, item) => sum + (Number(item) || 0), 0);
              const ratio = total > 0 ? (value * 100) / total : 0;
              return `${ctx.label}: ${value} reponse(s) - ${ratio.toFixed(1)}%`;
            }
          }
        }
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const questionContentEl = document.getElementById('question-content');
  const answerCountEl = document.getElementById('answer-count');
  const tbody = document.getElementById('answers-tbody');
  const emptyState = document.getElementById('empty-state');
  const answersTable = document.getElementById('answers-table');
  const backLink = document.getElementById('back-link');

  const { formulaireId, questionId } = parseParams();

  if (backLink && formulaireId !== null) {
    backLink.href = `/statistiques/${formulaireId}`;
  }

  if (formulaireId === null || questionId === null) {
    questionContentEl.textContent = 'Identifiants invalides dans l URL.';
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

    const qcmRows = Array.isArray(data.qcm_par_choix) ? data.qcm_par_choix : [];
    const rowsForQuestion = qcmRows.filter((row) => toInt(row.question_id) === questionId);

    const questionLabel = String(
      (rowsForQuestion[0] && rowsForQuestion[0].question) ||
      `Question QCM ${questionId}`
    ).trim();

    questionContentEl.textContent = questionLabel;

    const total = rowsForQuestion.reduce((sum, row) => sum + (toInt(row.nb_reponses) || 0), 0);
    answerCountEl.textContent = String(total);

    if (!rowsForQuestion.length) {
      answersTable.hidden = true;
      emptyState.hidden = false;
      renderQcmChart(['Aucune reponse'], [1]);
      return;
    }

    answersTable.hidden = false;
    emptyState.hidden = true;
    tbody.innerHTML = '';

    const labels = [];
    const counts = [];

    rowsForQuestion.forEach((row, index) => {
      const choix = String(row.choix || '').trim() || `Choix ${index + 1}`;
      const count = toInt(row.nb_reponses) || 0;
      const percent = total > 0 ? (count * 100) / total : 0;

      labels.push(choix);
      counts.push(count);

      const tr = document.createElement('tr');

      const rankCell = document.createElement('td');
      rankCell.textContent = String(index + 1);

      const choiceCell = document.createElement('td');
      choiceCell.textContent = choix;

      const countCell = document.createElement('td');
      countCell.textContent = String(count);

      const percentCell = document.createElement('td');
      percentCell.textContent = `${percent.toFixed(1)}%`;

      tr.appendChild(rankCell);
      tr.appendChild(choiceCell);
      tr.appendChild(countCell);
      tr.appendChild(percentCell);
      tbody.appendChild(tr);
    });

    renderQcmChart(labels, counts);
  } catch (error) {
    console.error('Erreur chargement detail QCM:', error);
    questionContentEl.textContent = 'Impossible de charger les details QCM.';
    answersTable.hidden = true;
    emptyState.hidden = false;
  }
});
