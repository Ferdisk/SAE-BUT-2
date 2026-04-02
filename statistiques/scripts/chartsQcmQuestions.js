let qcmOverviewChart = null;
let qcmRows = [];
let qcmQuestionRows = [];
let qcmQuestionIndex = 0;
let currentFormulaireId = null;

function toInt(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function toChartLabel(text, index) {
  const raw = String(text || `Question ${index + 1}`).trim();
  return raw.length > 36 ? `${raw.slice(0, 36)}...` : raw;
}

function ensureQcmNavigator() {
  const chartRight = document.querySelector('.chart-right');
  if (!chartRight) return;

  if (!document.getElementById('qcm-question-info')) {
    const info = document.createElement('div');
    info.id = 'qcm-question-info';
    info.className = 'text-question-info';

    const title = chartRight.querySelector('.chart-title');
    if (title && title.parentNode) {
      title.parentNode.insertBefore(info, title.nextSibling);
    } else {
      chartRight.prepend(info);
    }
  }

  if (!document.getElementById('qcm-question-nav')) {
    const nav = document.createElement('div');
    nav.id = 'qcm-question-nav';
    nav.className = 'text-question-nav';
    nav.innerHTML = `
      <button type="button" id="qcm-question-prev" class="text-question-arrow" aria-label="Question QCM precedente">&#8592;</button>
      <button type="button" id="qcm-question-next" class="text-question-arrow" aria-label="Question QCM suivante">&#8594;</button>
    `;
    chartRight.appendChild(nav);
  }

  const prevBtn = document.getElementById('qcm-question-prev');
  const nextBtn = document.getElementById('qcm-question-next');

  if (prevBtn && !prevBtn.dataset.bound) {
    prevBtn.dataset.bound = '1';
    prevBtn.addEventListener('click', () => {
      if (qcmQuestionRows.length < 2) return;
      qcmQuestionIndex = (qcmQuestionIndex - 1 + qcmQuestionRows.length) % qcmQuestionRows.length;
      updateQcmChart();
    });
  }

  if (nextBtn && !nextBtn.dataset.bound) {
    nextBtn.dataset.bound = '1';
    nextBtn.addEventListener('click', () => {
      if (qcmQuestionRows.length < 2) return;
      qcmQuestionIndex = (qcmQuestionIndex + 1) % qcmQuestionRows.length;
      updateQcmChart();
    });
  }
}

function buildQcmQuestionRows(rows) {
  const grouped = new Map();

  rows.forEach((row) => {
    const questionId = toInt(row.question_id);
    if (questionId === null) return;

    const choiceId = toInt(row.choix_id);
    if (choiceId === null) return;

    if (!grouped.has(questionId)) {
      grouped.set(questionId, {
        question_id: questionId,
        question: String(row.question || '').trim() || `Question ${questionId}`,
        choices: []
      });
    }

    grouped.get(questionId).choices.push({
      choix_id: choiceId,
      choix: String(row.choix || '').trim() || `Choix ${choiceId}`,
      nb_reponses: toInt(row.nb_reponses) || 0
    });
  });

  return Array.from(grouped.values()).sort((a, b) => a.question_id - b.question_id);
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

function getQcmDetailUrl(formulaireId, questionId) {
  const params = new URLSearchParams({
    formulaireId: String(formulaireId),
    questionId: String(questionId)
  });
  return `/statistiques/pages/statisticsQcmQuestionDetail.html?${params.toString()}`;
}

function goToCurrentQcmQuestionDetails() {
  if (!qcmQuestionRows.length) return;

  const question = qcmQuestionRows[qcmQuestionIndex];
  const questionId = toInt(question.question_id);
  const formulaireId = toInt(currentFormulaireId);

  if (questionId === null || formulaireId === null) return;

  window.location.href = getQcmDetailUrl(formulaireId, questionId);
}

function updateQcmChart() {
  const infoEl = document.getElementById('qcm-question-info');
  const prevBtn = document.getElementById('qcm-question-prev');
  const nextBtn = document.getElementById('qcm-question-next');

  if (!qcmOverviewChart) return;

  if (!qcmQuestionRows.length) {
    qcmOverviewChart.data.labels = ['Aucune question QCM'];
    qcmOverviewChart.data.datasets[0].data = [1];
    qcmOverviewChart.data.datasets[0].backgroundColor = ['#d9d9d9'];
    qcmOverviewChart.data.datasets[0].borderWidth = 0;
    qcmOverviewChart.update();

    if (infoEl) {
      infoEl.textContent = 'Aucune question QCM trouvee pour ce formulaire.';
      infoEl.title = '';
    }
    if (prevBtn) prevBtn.disabled = true;
    if (nextBtn) nextBtn.disabled = true;
    return;
  }

  const current = qcmQuestionRows[qcmQuestionIndex];
  const totalResponses = current.choices.reduce((sum, choice) => sum + (toInt(choice.nb_reponses) || 0), 0);

  const labels = current.choices.map((choice) => {
    const count = toInt(choice.nb_reponses) || 0;
    const ratio = totalResponses > 0 ? (count * 100) / totalResponses : 0;
    const label = toChartLabel(choice.choix, 0);
    return `${label} (${ratio.toFixed(1)}%)`;
  });

  const data = current.choices.map((choice) => toInt(choice.nb_reponses) || 0);

  qcmOverviewChart.data.labels = labels;
  qcmOverviewChart.data.datasets[0].label = 'Part des reponses (%) par choix';
  qcmOverviewChart.data.datasets[0].data = data;
  qcmOverviewChart.data.datasets[0].backgroundColor = getPiePalette(labels.length);
  qcmOverviewChart.data.datasets[0].borderWidth = 1;
  qcmOverviewChart.update();

  if (infoEl) {
    const indexText = `Question QCM ${qcmQuestionIndex + 1}/${qcmQuestionRows.length}`;
    const questionText = String(current.question || '').trim();
    infoEl.textContent = `${indexText} - Cliquez sur le graphique pour ouvrir le detail.`;
    infoEl.title = questionText;
  }

  const disableNav = qcmQuestionRows.length < 2;
  if (prevBtn) prevBtn.disabled = disableNav;
  if (nextBtn) nextBtn.disabled = disableNav;
}

const completionRateCanvas = document.getElementById('completionRateChart');
if (completionRateCanvas) {
  qcmOverviewChart = new Chart(completionRateCanvas, {
    type: 'pie',
    data: {
      labels: [],
      datasets: [{
        label: 'Part des reponses (%) par choix',
        data: [],
        backgroundColor: []
      }]
    },
    options: {
      responsive: true,
      onClick: (_event, elements) => {
        if (!elements || !elements.length || !qcmQuestionRows.length) return;
        goToCurrentQcmQuestionDetails();
      },
      onHover: (event, elements) => {
        const canvas = event?.native?.target;
        if (!canvas) return;
        canvas.style.cursor = (elements && elements.length && qcmQuestionRows.length) ? 'pointer' : 'default';
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const value = Number(ctx.parsed) || 0;
              const dataset = ctx.dataset?.data || [];
              const total = dataset.reduce((sum, item) => sum + (Number(item) || 0), 0);
              const ratio = total > 0 ? (value * 100) / total : 0;
              return `${ctx.label}: ${value} reponse(s) - ${ratio.toFixed(1)}%`;
            }
          }
        }
      }
    }
  });
}

window.renderStatsCharts = function renderStatsCharts(reponsesParQuestion, totalReponsesCompletees, qcmParChoix, formulaireId) {
  const rows = Array.isArray(reponsesParQuestion) ? reponsesParQuestion : [];
  qcmRows = Array.isArray(qcmParChoix) ? qcmParChoix : [];
  currentFormulaireId = toInt(formulaireId);

  const labels = rows.map((row, index) => toChartLabel(row.contenu, index));
  const counts = rows.map((row) => toInt(row.nb_reponses) || 0);

  const nbStudentCanvas = document.getElementById('nbStudentChart');
  if (nbStudentCanvas && window.Chart) {
    if (!window.__qcmNbStudentChartInstance) {
      window.__qcmNbStudentChartInstance = new Chart(nbStudentCanvas, {
        type: 'bar',
        data: {
          labels: [],
          datasets: [{
            label: 'Nombre de reponses',
            data: [],
            backgroundColor: '#e2001a'
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              ticks: { precision: 0 }
            }
          }
        }
      });
    }

    window.__qcmNbStudentChartInstance.data.labels = labels;
    window.__qcmNbStudentChartInstance.data.datasets[0].data = counts;
    window.__qcmNbStudentChartInstance.update();
  }

  qcmQuestionRows = buildQcmQuestionRows(qcmRows);
  if (qcmQuestionIndex >= qcmQuestionRows.length) {
    qcmQuestionIndex = 0;
  }

  ensureQcmNavigator();
  updateQcmChart();
};
