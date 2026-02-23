let tousLesEtudiants = [];

document.addEventListener("DOMContentLoaded", () => {
    const segments = window.location.pathname.split('/');
    const formId = segments[segments.length - 1]; 

    if (!formId || isNaN(formId)) {
        console.error("ID du questionnaire invalide");
        return;
    }

    chargerDonnees(formId);

    const filterGroupe = document.getElementById("filter-groupe");
    if (filterGroupe) {
        filterGroupe.addEventListener("change", () => {
            afficherEtudiants(filterGroupe.value);
        });
    }

    const btnSend = document.getElementById("confirm-send");
    if (btnSend) {
        btnSend.addEventListener("click", envoyerMail);
    }
});

async function chargerDonnees(formId) {
    try {
        const res = await fetch(`/suivi-formulaire/${formId}`);
        const data = await res.json();
        if (!data.success) throw new Error(data.message);

        tousLesEtudiants = data.etudiants;
        afficherEtudiants("tous");
    } catch (err) {
        console.error("Erreur chargement:", err);
    }
}

function afficherEtudiants(groupeFiltre) {
    const tbody = document.getElementById("liste-suivi");
    tbody.innerHTML = "";

    const listeFiltree = groupeFiltre === "tous" 
        ? tousLesEtudiants 
        : tousLesEtudiants.filter(etu => etu.groupe === groupeFiltre);

    listeFiltree.forEach(etu => {
        const tr = document.createElement("tr");

        const statutLabel = etu.a_repondu
            ? '<span class="statut-ok">Répondu</span>'
            : '<span class="statut-no">En attente</span>';

        const boutonAction = etu.a_repondu
            ? '<span>-</span>'
            : `<button class="btn-blue" onclick="ouvrirRedaction('${etu.email}', '${etu.prenom}')">Relancer</button>`;

        tr.innerHTML = `
            <td>${etu.nom}</td>
            <td>${etu.prenom}</td>
            <td><strong>${etu.groupe || 'N/A'}</strong></td>
            <td>${statutLabel}</td>
            <td>${boutonAction}</td>
        `;
        tbody.appendChild(tr);
    });
}

function ouvrirRedaction(email, prenom) {
    window.currentEmailCible = email;

    const zone = document.getElementById("zone-redaction");
    const nomEtuSpan = document.getElementById("nom-etudiant");
    
    if (zone && nomEtuSpan) {
        nomEtuSpan.innerText = prenom;
        document.getElementById("mail-sujet").value = "Rappel : Questionnaire à compléter";
        document.getElementById("mail-corps").value = `Bonjour ${prenom},\n\nSauf erreur de notre part, vous n'avez pas encore rempli le questionnaire.\n\nMerci de le faire rapidement.\n\nCordialement.`;
        
        zone.style.display = "block";
        
        zone.scrollIntoView({ behavior: 'smooth' });
    }
}

function annulerRedaction() {
    const zone = document.getElementById("zone-redaction");
    if (zone) zone.style.display = "none";
}

async function envoyerMail() {
    const sujet = document.getElementById("mail-sujet").value;
    const message = document.getElementById("mail-corps").value;
    const email = window.currentEmailCible;

    if (!email) {
        alert("Erreur : aucun destinataire sélectionné.");
        return;
    }

    try {
        const res = await fetch("/relancer-etudiant", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, sujet, message })
        });

        const result = await res.json();
        if (result.success) {
            alert("Le mail de relance a été envoyé !");
            annulerRedaction();
        } else {
            alert("Erreur lors de l'envoi : " + result.message);
        }
    } catch (err) {
        console.error("Erreur envoi mail:", err);
        alert("Impossible de contacter le serveur d'envoi.");
    }
}
