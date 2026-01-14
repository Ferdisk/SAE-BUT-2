function lockStudentUI() {
    const selectors = [
        ".side-btn",
        ".side-btn-add",
        ".side-btn-delete",
        ".other-option",
        ".select-scale"
    ];

    selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.style.display = "none";
        });
    });

    document.querySelectorAll(".question-obligatoire").forEach(el => {
        el.disabled = true;
        el.style.pointerEvents = "none";
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const stored = sessionStorage.getItem("questionnaire");

    if (!stored) {
        alert("Aucun questionnaire chargé");
        return;
    }

    const questionnaire = JSON.parse(stored);

    if (questionnaire.repondu) {
        alert("Vous avez déjà répondu à ce questionnaire. Vous ne pouvez pas le remplir une seconde fois.");
        lockStudentUI();
        document.getElementById("submitStudent-btn").disabled = true;
        return;
    }

    fillFormStudent(questionnaire);
    lockStudentUI();
});


function checkObligatoryAnswers() {
    let allFilled = true;

    document.querySelectorAll(".question-wrapper-flex").forEach(wrapper => {
        const obligatoireCheckbox = wrapper.querySelector(".question-obligatoire");
        if (!obligatoireCheckbox) return;

        if (!obligatoireCheckbox.checked) return;

        let answered = false;

        const reponse = wrapper.querySelector(".reponseQuestion");
        if (reponse && reponse.value.trim() !== "") answered = true;

        const checkedQCM = wrapper.querySelectorAll(".qcm-checkbox:checked");
        if (checkedQCM.length > 0) answered = true;

        const slider = wrapper.querySelector(".rating-slider");
        if (slider && slider.value !== "") answered = true;

        if (!answered) {
            allFilled = false;
            wrapper.classList.add("question-error");
        } else {
            wrapper.classList.remove("question-error");
        }
    });

    return allFilled;
}

document.getElementById("submitStudent-btn").addEventListener("click", async () => {

    if (!checkObligatoryAnswers()) {
        alert("Veuillez répondre à toutes les questions obligatoires.");
        return;
    }

    const reponses = [];

    document.querySelectorAll(".reponseQuestion").forEach(el => {
        if (el.value.trim() !== "") {
            reponses.push({
                question_id: el.dataset.questionId,
                texte: el.value.trim(),
                choix_id: null
            });
        }
    });

    document.querySelectorAll(".qcm-checkbox:checked").forEach(el => {
        reponses.push({
            question_id: el.dataset.questionId,
            texte: null,
            choix_id: el.value
        });
    });

    document.querySelectorAll(".rating-slider").forEach(el => {
        reponses.push({
            question_id: el.dataset.questionId,
            texte: el.value,
            choix_id: null
        });
    });

    console.log("Réponses envoyées :", reponses);

    if (reponses.length === 0) {
        alert("Aucune réponse fournie");
        return;
    }

    try {
        const questionnaire = JSON.parse(sessionStorage.getItem("questionnaire"));

        const res = await fetch("/reponses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                questionnaire_id: questionnaire.id,
                reponses
            })
        });

        const data = await res.json();

        if (data.success) {
            alert("Réponses envoyées avec succès");
            window.location.href = "/student";
        } else {
            alert("Erreur lors de l'envoi");
        }

    } catch (err) {
        console.error(err);
        alert("Erreur serveur");
    }
});
