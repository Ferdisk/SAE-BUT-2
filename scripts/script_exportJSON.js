document.addEventListener("DOMContentLoaded", () => {
    const btnExport = document.getElementById("export-btn");

    if (btnExport) {
        btnExport.addEventListener("click", () => {

            const fullData = getFullForm();

            if (!fullData || !fullData.questions || fullData.questions.length === 0) {
                alert("Le questionnaire est vide. Ajoutez des questions avant d'exporter.");
                return;
            }

            const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            const fileName = fullData.titre ? fullData.titre.replace(/[^a-z0-9]/gi, '_') : "questionnaire";
            a.download = `${fileName}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }
});
