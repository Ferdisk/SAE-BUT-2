import { apiFetch } from "../api.js";

export function attachCardActions({ q, div, btnVoir, btnQRCode, btnTracking, btnExport, btnStat, btnDelete }) {
    btnQRCode.addEventListener("click", () => {
        if (!q.lien_formulaire) return alert("Ce questionnaire n'a pas encore de code.");
        if (window.openQRCodeModal) window.openQRCodeModal(q.lien_formulaire);
    });

    btnTracking.addEventListener("click", () => {
        window.location.href = `/suivi/${q.id}`;
    });

    btnDelete.addEventListener("click", async () => {
        const confirmDelete = confirm(`Voulez-vous vraiment supprimer le questionnaire "${q.titre}" ?`);
        if (!confirmDelete) return;

        try {
            const res = await apiFetch(`/questionnaire/${q.id}`, { method: "DELETE" });
            const data = await res.json();

            if (!data.success) {
                alert(data.message || "Erreur lors de la suppression");
                return;
            }

            div.remove();
        } catch (err) {
            console.error(err);
            alert("Erreur serveur");
        }
    });

    btnVoir.addEventListener("click", () => {
        window.location.href = `/questionnaire/${q.id}`;
    });

    btnExport.addEventListener("click", async () => {
        window.location.href = `/exportReponses/${q.id}`;
    });

    if (btnStat) {
        btnStat.addEventListener("click", () => {
            window.location.href = `/statistiques/${q.id}`;
        });
    }
}
