function toInt(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function getFormulaireIdFromPath() {
  const parts = window.location.pathname.split('/').filter(Boolean);
  const last = parts[parts.length - 1];
  return toInt(last);
}

function createAccessUi() {
  if (document.getElementById('qcm-detail-access')) {
    return document.getElementById('qcm-detail-access');
  }

  const chartRight = document.querySelector('.chart-right');
  if (!chartRight) return null;

  const wrapper = document.createElement('div');
  wrapper.id = 'qcm-detail-access';
  wrapper.style.marginTop = '0.8rem';
  wrapper.style.padding = '0.75rem';
  wrapper.style.border = '1px solid #d3dbe6';
  wrapper.style.borderRadius = '10px';
  wrapper.style.background = '#f8fbff';

  const label = document.createElement('label');
  label.setAttribute('for', 'qcm-question-select');
  label.textContent = 'Detail QCM:';
  label.style.display = 'block';
  label.style.fontWeight = '600';
  label.style.marginBottom = '0.4rem';

  const row = document.createElement('div');
  row.style.display = 'flex';
  row.style.gap = '0.5rem';
  row.style.flexWrap = 'wrap';

  const select = document.createElement('select');
  select.id = 'qcm-question-select';
  select.style.flex = '1 1 260px';
  select.style.minHeight = '38px';
  select.style.border = '1px solid #bfcce0';
  select.style.borderRadius = '8px';
  select.style.padding = '0 0.6rem';

  const button = document.createElement('button');
  button.id = 'qcm-question-open';
  button.type = 'button';
  button.textContent = 'Voir le detail QCM';
  button.style.minHeight = '38px';
  button.style.border = 'none';
  button.style.borderRadius = '8px';
  button.style.padding = '0 0.9rem';
  button.style.background = '#0082c8';
  button.style.color = '#fff';
  button.style.fontWeight = '700';
  button.style.cursor = 'pointer';

  const hint = document.createElement('div');
  hint.id = 'qcm-question-hint';
  hint.style.marginTop = '0.45rem';
  hint.style.fontSize = '0.9rem';
  hint.style.color = '#44566c';

  row.appendChild(select);
  row.appendChild(button);
  wrapper.appendChild(label);
  wrapper.appendChild(row);
  wrapper.appendChild(hint);
  chartRight.appendChild(wrapper);

  return wrapper;
}

function getQcmDetailUrl(formulaireId, questionId) {
  const params = new URLSearchParams({
    formulaireId: String(formulaireId),
    questionId: String(questionId)
  });
  return `/statistiques/pages/statisticsQcmQuestionDetail.html?${params.toString()}`;
}

async function loadQcmAccess() {
  const formulaireId = getFormulaireIdFromPath();
  if (formulaireId === null) return;

  const wrapper = createAccessUi();
  if (!wrapper) return;

  const select = document.getElementById('qcm-question-select');
  const openButton = document.getElementById('qcm-question-open');
  const hint = document.getElementById('qcm-question-hint');

  if (!select || !openButton || !hint) return;

  try {
    const response = await fetch(`/api/stats-globales/${formulaireId}`, { credentials: 'include' });
    const data = await response.json();

    if (!data.succes) {
      hint.textContent = 'Impossible de charger les questions QCM.';
      openButton.disabled = true;
      return;
    }

    const qcmRows = Array.isArray(data.qcm_par_choix) ? data.qcm_par_choix : [];
    const questionsById = new Map();

    qcmRows.forEach((row) => {
      const questionId = toInt(row.question_id);
      if (questionId === null) return;
      if (!questionsById.has(questionId)) {
        const raw = String(row.question || '').trim() || `Question ${questionId}`;
        const label = raw.length > 80 ? `${raw.slice(0, 80)}...` : raw;
        questionsById.set(questionId, label);
      }
    });

    const entries = Array.from(questionsById.entries()).sort((a, b) => a[0] - b[0]);

    if (!entries.length) {
      select.innerHTML = '';
      const emptyOption = document.createElement('option');
      emptyOption.value = '';
      emptyOption.textContent = 'Aucune question QCM';
      select.appendChild(emptyOption);
      select.disabled = true;
      openButton.disabled = true;
      hint.textContent = 'Ce formulaire ne contient pas de question QCM.';
      return;
    }

    select.innerHTML = '';
    entries.forEach(([questionId, label]) => {
      const option = document.createElement('option');
      option.value = String(questionId);
      option.textContent = `Q${questionId} - ${label}`;
      select.appendChild(option);
    });

    select.disabled = false;
    openButton.disabled = false;
    hint.textContent = 'Choisis une question QCM puis ouvre la page detail.';

    openButton.addEventListener('click', () => {
      const questionId = toInt(select.value);
      if (questionId === null) return;
      window.location.href = getQcmDetailUrl(formulaireId, questionId);
    });
  } catch (error) {
    console.error('Erreur chargement acces QCM:', error);
    hint.textContent = 'Erreur reseau lors du chargement des questions QCM.';
    openButton.disabled = true;
  }
}

document.addEventListener('DOMContentLoaded', loadQcmAccess);
