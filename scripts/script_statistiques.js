// Navigation vers la page de stats depuis la liste des questionnaires
document.addEventListener("DOMContentLoaded", () => {
    const listContainer = document.getElementById("questionnaires-list");
    if (listContainer) {
        listContainer.addEventListener("click", (e) => {
            const btn = e.target.closest(".btn-stat");
            if (!btn) return;
            const formulaireId = btn.dataset.id;
            if (!formulaireId || isNaN(formulaireId)) {
                alert("Aucun formulaire disponible pour afficher les statistiques.");
                return;
            }
            window.location.href = `/statistiques/${formulaireId}`;
        });
    }
});

// Affichage des stats sur la page statistiques
document.addEventListener("DOMContentLoaded", async () => {
    const valeurReponses = document.getElementById("valeur-reponses");
    if (!valeurReponses) return; // On n'est pas sur la page stats

    const sanitizeText = (value) => String(value || "").replace(/\s+/g, " ").trim();
    const truncate = (value, max = 70) => value.length > max ? `${value.slice(0, max)}...` : value;
    const getQuestionKey = (item) => {
        const id = Number.parseInt(item.question_id, 10);
        if (!Number.isNaN(id)) return `id:${id}`;
        return `q:${sanitizeText(item.contenu || item.question).toLowerCase()}`;
    };

    const buildTextResponsesMap = (textRows) => {
        const map = new Map();

        (Array.isArray(textRows) ? textRows : []).forEach((row) => {
            const key = getQuestionKey(row);
            const response = sanitizeText(row.reponse_texte);
            if (!response) return;

            if (!map.has(key)) {
                map.set(key, []);
            }

            const values = map.get(key);
            if (!values.includes(response)) {
                values.push(response);
            }
        });

        return map;
    };

    const parts = window.location.pathname.split("/").filter(Boolean);
    const id = parts[parts.length - 1];
    if (!id || isNaN(id)) return;

    try {
        const res = await fetch(`/api/stats-globales/${id}`, { credentials: "include" });
        const data = await res.json();

        console.log("Stats API response:", data);

        if (!data.succes) {
            console.warn("API succes=false", data);
            valeurReponses.textContent = "0";
            return;
        }

        const reponses = data.reponses_par_question;
        const totalReponsesCompletees = Number.parseInt(data.total_reponses_completees, 10) || 0;
        const qcmParChoix = data.qcm_par_choix;
        const reponsesTextuelles = data.reponses_textuelles;
        const textResponsesByQuestion = buildTextResponsesMap(reponsesTextuelles);

        valeurReponses.textContent = totalReponsesCompletees;

        if (!reponses || reponses.length === 0) {
            const tbody = document.getElementById("stats-questions-tbody");
            if (tbody) tbody.innerHTML = "<tr><td colspan='3'>Aucune réponse pour ce questionnaire.</td></tr>";
            if (typeof window.renderStatsCharts === "function") {
                window.renderStatsCharts([], totalReponsesCompletees, qcmParChoix);
            }
            return;
        }

        const tbody = document.getElementById("stats-questions-tbody");
        if (tbody) {
            tbody.innerHTML = "";
            reponses.forEach(r => {
                const key = getQuestionKey(r);
                const textes = textResponsesByQuestion.get(key) || [];
                const extrait = textes.length ? textes.slice(0, 3).map((t) => truncate(t)).join(" | ") : "-";

                const tr = document.createElement("tr");

                const questionTd = document.createElement("td");
                questionTd.textContent = sanitizeText(r.contenu);

                const countTd = document.createElement("td");
                countTd.textContent = `${parseInt(r.nb_reponses, 10) || 0}`;

                const contentTd = document.createElement("td");
                contentTd.textContent = extrait;
                contentTd.title = textes.join("\n") || "Aucune réponse textuelle";

                tr.appendChild(questionTd);
                tr.appendChild(countTd);
                tr.appendChild(contentTd);
                tbody.appendChild(tr);
            });
        }

        if (typeof window.renderStatsCharts === "function") {
            window.renderStatsCharts(reponses, totalReponsesCompletees, qcmParChoix);
        }
    } catch (err) {
        console.error("Erreur chargement stats :", err);
        valeurReponses.textContent = "Erreur";
    }
});


