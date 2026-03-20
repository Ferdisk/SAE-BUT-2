let nbStudentChart = null;
let completionRateChart = null;
let textQuestionRows = [];
let textQuestionIndex = 0;

function toInt(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function ensureTextQuestionNavigator() {
  const chartRight = document.querySelector('.chart-right');
  if (!chartRight) return;

  if (!document.getElementById('text-question-info')) {
    const info = document.createElement('div');
    info.id = 'text-question-info';
    info.className = 'text-question-info';

    const title = chartRight.querySelector('.chart-title');
    if (title && title.parentNode) {
      title.parentNode.insertBefore(info, title.nextSibling);
    } else {
      chartRight.prepend(info);
    }
  }

  if (!document.getElementById('text-question-nav')) {
    const nav = document.createElement('div');
    nav.id = 'text-question-nav';
    nav.className = 'text-question-nav';
    nav.innerHTML = `
      <button type="button" id="text-question-prev" class="text-question-arrow" aria-label="Question précédente">&#8592;</button>
      <button type="button" id="text-question-next" class="text-question-arrow" aria-label="Question suivante">&#8594;</button>
    `;
    chartRight.appendChild(nav);
  }

  const prevBtn = document.getElementById('text-question-prev');
  const nextBtn = document.getElementById('text-question-next');

  if (prevBtn && !prevBtn.dataset.bound) {
    prevBtn.dataset.bound = '1';
    prevBtn.addEventListener('click', () => {
      if (textQuestionRows.length < 2) return;
      textQuestionIndex = (textQuestionIndex - 1 + textQuestionRows.length) % textQuestionRows.length;
      updateTextQuestionChart();
    });
  }

  if (nextBtn && !nextBtn.dataset.bound) {
    nextBtn.dataset.bound = '1';
    nextBtn.addEventListener('click', () => {
      if (textQuestionRows.length < 2) return;
      textQuestionIndex = (textQuestionIndex + 1) % textQuestionRows.length;
      updateTextQuestionChart();
    });
  }
}

function updateTextQuestionChart() {
  const infoEl = document.getElementById('text-question-info');
  const prevBtn = document.getElementById('text-question-prev');
  const nextBtn = document.getElementById('text-question-next');

  if (!completionRateChart) return;

  if (!textQuestionRows.length) {
    completionRateChart.data.labels = ['Aucune question texte'];
    completionRateChart.data.datasets[0].label = 'Nombre de réponses';
    completionRateChart.data.datasets[0].data = [0];
    completionRateChart.update();

    if (infoEl) {
      infoEl.textContent = 'Aucune question texte disponible (QCM exclus).';
    }
    if (prevBtn) prevBtn.disabled = true;
    if (nextBtn) nextBtn.disabled = true;
    return;
  }

  const current = textQuestionRows[textQuestionIndex];
  const questionLabel = toChartLabel(current.contenu, textQuestionIndex);
  const responseCount = toInt(current.nb_reponses) || 0;
  const questionId = toInt(current.question_id);

  completionRateChart.data.labels = [questionLabel];
  completionRateChart.data.datasets[0].label = 'Nombre de réponses (question texte)';
  completionRateChart.data.datasets[0].data = [responseCount];
  completionRateChart.update();

  if (infoEl) {
    const indexText = `Question ${textQuestionIndex + 1}/${textQuestionRows.length}`;
    const idText = questionId !== null ? ` - ID ${questionId}` : '';
    infoEl.textContent = `${indexText}${idText}`;
    infoEl.title = String(current.contenu || '');
  }

  const disableNav = textQuestionRows.length < 2;
  if (prevBtn) prevBtn.disabled = disableNav;
  if (nextBtn) nextBtn.disabled = disableNav;
}

const nbStudentCanvas = document.getElementById('nbStudentChart');
if (nbStudentCanvas) {
  nbStudentChart = new Chart(nbStudentCanvas, {
    type: 'bar',
    data: {
      labels: [],
      datasets: [{
        label: "Nombre de réponses",
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

const completionRateCanvas = document.getElementById('completionRateChart');
if (completionRateCanvas) {
  completionRateChart = new Chart(completionRateCanvas, {
    type: 'bar',
    data: {
      labels: [],
      datasets: [{
        label: "Nombre de selections (QCM)",
        data: [],
        backgroundColor: '#0082c8'
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

function toChartLabel(text, index) {
  const raw = String(text || `Question ${index + 1}`).trim();
  return raw.length > 24 ? `${raw.slice(0, 24)}...` : raw;
}

window.renderStatsCharts = function renderStatsCharts(reponsesParQuestion, totalReponsesCompletees, qcmParChoix) {
  const rows = Array.isArray(reponsesParQuestion) ? reponsesParQuestion : [];
  const qcmRows = Array.isArray(qcmParChoix) ? qcmParChoix : [];

  const labels = rows.map((row, index) => toChartLabel(row.contenu, index));
  const counts = rows.map(row => Number.parseInt(row.nb_reponses, 10) || 0);

  const qcmQuestionIds = new Set(
    qcmRows
      .map(row => toInt(row.question_id))
      .filter(id => id !== null)
  );
  const qcmQuestionTexts = new Set(
    qcmRows
      .map(row => String(row.question || '').trim())
      .filter(Boolean)
  );

  textQuestionRows = rows.filter(row => {
    const id = toInt(row.question_id);
    if (id !== null && qcmQuestionIds.has(id)) return false;

    const contenu = String(row.contenu || '').trim();
    if (!id && contenu && qcmQuestionTexts.has(contenu)) return false;

    return true;
  });

  if (textQuestionIndex >= textQuestionRows.length) {
    textQuestionIndex = 0;
  }

  if (nbStudentChart) {
    nbStudentChart.data.labels = labels;
    nbStudentChart.data.datasets[0].data = counts;
    nbStudentChart.update();
  }

  if (completionRateChart) {
    ensureTextQuestionNavigator();
    updateTextQuestionChart();
  }
};

//TODO fonction convertir le score obtenu /20 en %  
//fonction move qui prendra des valeur en paramèètre les valeur du score 
//  pour afficher le score en % (width)
var i = 0;
function move_first_bar() {
  if (i == 0) {
    i = 1;
    var elem = document.getElementById("myBar1");
    var width = 1;
    var id = setInterval(frame, 10);
    function frame() {
      if (width >= 100) {
        clearInterval(id);
        i = 0;
      } else {
        width++;
        elem.style.width = width + "%";
      }
    }
  }
}

var j = 0;
function move_second_bar() {
  if (j == 0) {
    j = 1;
    var elem = document.getElementById("myBar2");
    var width = 1;
    var id = setInterval(frame, 10);
    function frame() {
      if (width >= 100) {
        clearInterval(id);
        j = 0;
      } else {
        width++;
        elem.style.width = width + "%";
      }
    }
  }
}
var k = 0;
function move_third_bar() {
  if (k == 0) {
    k = 1;
    var elem = document.getElementById("myBar3");
    var width = 1;
    var id = setInterval(frame, 10);
    function frame() {
      if (width >= 100) {
        clearInterval(id);
        k = 0;
      } else {
        width++;
        elem.style.width = width + "%";
      }
    }
  }
}

// Les données sont chargées par script_statistiques.js, puis envoyées ici via window.renderStatsCharts.
