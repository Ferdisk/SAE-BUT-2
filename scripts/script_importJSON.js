document.addEventListener("DOMContentLoaded", () => {
    const btnTrigger = document.getElementById("import-btn");
    const fileInput = document.getElementById("import-file-input");


    btnTrigger.addEventListener("click", () => {
        fileInput.click();
    });

    fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const jsonData = JSON.parse(event.target.result);
                console.log("JSON parsé avec succès :", jsonData);

                const response = await fetch("/importJSON", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(jsonData)
                });

                const result = await response.json();

                if (result.success) {
                    alert("Questionnaire importé avec succès !");
                    window.location.reload();
                } else {
                    alert("Erreur serveur : " + result.message);
                }
            } catch (err) {
                console.error("Erreur lors de la lecture du JSON :", err);
                alert("Le fichier sélectionné n'est pas un JSON valide.");
            }
        };

        reader.readAsText(file);
    });
});
