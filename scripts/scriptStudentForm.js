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

    fillFormStudent(questionnaire);
    lockStudentUI();
});
