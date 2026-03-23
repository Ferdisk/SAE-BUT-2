import { fillForm, getFormTitleValue, hasQuestions } from "./formUtils.js";
import { getCurrentFormId, getCurrentFormEtat, setCurrentFormEtat } from "./state.js";

export const API_ENDPOINTS = {
    form: "/form",
    logout: "/logout",
    session: "/session"
};

export const FETCH_CREDENTIALS = "include";

export function apiFetch(url, options = {}) {
    return fetch(url, {
        credentials: FETCH_CREDENTIALS,
        ...options
    });
}

export async function sendFormToBDD(formReady) {
    const descInput = document.querySelector(".desc-box");
    const titre = getFormTitleValue("Sans titre");
    const description = descInput ? descInput.value.trim() : "";

    const timeToggle = document.getElementById("time-limit-toggle");
    const timeValue = document.querySelector(".time-input")?.value;
    const temps_limite = timeToggle && timeToggle.checked ? parseInt(timeValue, 10) : null;

    const payload = {
        titre,
        description,
        temps_limite,
        questions: formReady.questions
    };

    try {
        const response = await apiFetch(API_ENDPOINTS.form, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (data.success) {
            alert("Formulaire et questions sauvegardés avec succès !");
            window.location.href = "/prof";
        } else {
            alert("Erreur technique : " + data.message);
        }
    } catch (err) {
        console.error("Erreur : ", err);
        alert("Impossible de contacter le serveur.");
    }
}

export async function updateFormInBDD(formReady) {
    const titre = getFormTitleValue();
    const description = document.querySelector(".desc-box")?.value || "";

    const groupeCibleInput = document.getElementById("groupe-cible");
    const groupe_cible = groupeCibleInput ? groupeCibleInput.value : "BUT1";

    const timeToggle = document.getElementById("time-limit-toggle");
    const timeValue = document.querySelector(".time-input")?.value;
    const temps_limite = timeToggle && timeToggle.checked ? parseInt(timeValue, 10) : null;

    const payload = {
        titre,
        description,
        temps_limite,
        groupe_cible,
        questions: formReady.questions
    };

    const res = await apiFetch(`/questionnaireCharger/${getCurrentFormId()}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (data.success) {
        alert("Formulaire mis à jour");
    } else {
        alert(data.message || "Modification impossible");
    }
}

export async function chargerQuestionnairesProf(authorId = null) {
    try {
        let url = "/listForms";
        if (authorId) url = `/listForms?authorId=${authorId}`;

        const res = await apiFetch(url);
        const data = await res.json();

        if (!data.success) {
            alert("Erreur lors du chargement des questionnaires");
            return [];
        }

        return Array.isArray(data.questionnaires) ? data.questionnaires : [];
    } catch (err) {
        console.error(err);
        alert("Erreur serveur");
        return [];
    }
}

export async function loadQuestionnaire(id) {
    try {
        const res = await apiFetch(`/questionnaireCharger/${id}`);

        if (!res.ok) {
            throw new Error("Erreur HTTP");
        }

        const data = await res.json();

        if (!data || !data.questionnaire) {
            throw new Error("questionnaire absent dans la réponse");
        }

        fillForm(data.questionnaire);
        setCurrentFormEtat(data.questionnaire.etat);

        const saveBtn = document.getElementById("save-btn");
        const updateBtn = document.getElementById("update-btn");
        const exportBtn = document.getElementById("export-btn");
        const submitBtn = document.getElementById("submit-btn");
        const btnQCM = document.getElementById("btn-qcm");
        const btnTexte = document.getElementById("btn-texte");
        const btnEchelle = document.getElementById("btn-echelle");
        const btnReset = document.getElementById("btn-reset");
        const hint = document.querySelector(".hint");
        const groupeCibleInput = document.getElementById("groupe-cible");

        if (hasQuestions() && hint) hint.remove();

        document.querySelectorAll("input, textarea, select, button").forEach((el) => {
            el.disabled = false;
        });

        if (btnQCM) btnQCM.disabled = false;
        if (btnTexte) btnTexte.disabled = false;
        if (btnEchelle) btnEchelle.disabled = false;
        if (btnReset) btnReset.disabled = false;

        if (getCurrentFormEtat() === "brouillon") {
            if (saveBtn) saveBtn.style.display = "none";
            updateBtn.style.display = "inline-block";
            if (submitBtn) submitBtn.style.display = "inline-block";
        } else if (getCurrentFormEtat() === "envoye") {
            updateBtn.style.display = "none";
            saveBtn.style.display = "none";
            submitBtn.style.display = "none";

            if (groupeCibleInput) groupeCibleInput.disabled = true;
            if (btnQCM) btnQCM.disabled = true;
            if (btnTexte) btnTexte.disabled = true;
            if (btnEchelle) btnEchelle.disabled = true;
            if (btnReset) btnReset.disabled = true;

            document.querySelectorAll("input, textarea, select, button").forEach((el) => {
                if (el.id !== "btn-back") el.disabled = true;
                if (exportBtn) exportBtn.disabled = false;
            });
        }
    } catch (err) {
        console.error("loadQuestionnaire casser :", err);
        alert("Impossible de charger le questionnaire");
    }
}
