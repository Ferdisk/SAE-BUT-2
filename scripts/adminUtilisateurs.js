document.addEventListener("DOMContentLoaded", () => {
    loadUsers();
});

async function loadUsers() {
    try {
        // On appelle la route définie dans server.js
        const res = await fetch("http://164.81.120.71:3000/listUsers", { credentials: "include" });
        const data = await res.json();

        if (data.success) {
            displayUsers(data.users);
        } else {
            console.error("Erreur :", data.message);
        }
    } catch (err) {
        console.error("Erreur serveur:", err);
    }
}

function displayUsers(users) {
    const container = document.getElementById("users-list");
    container.innerHTML = ""; // On vide la liste

    users.forEach(user => {
        // On crée la carte utilisateur (structure proche de tes questionnaires)
        const div = document.createElement("div");
        div.className = "user-card d-flex justify-content-between align-items-center p-3 mb-2 bg-white shadow-sm rounded";

        div.innerHTML = `
            <div class="user-details">
                <h6 class="mb-0"><strong>${user.prenom} ${user.nom.toUpperCase()}</strong></h6>
                <p class="text-muted mb-0 small">${user.email} — <span class="badge bg-light text-dark">${user.role}</span></p>
            </div>
            <div class="user-actions">
                <button class="btn btn-sm btn-outline-danger" onclick="confirmDelete(${user.id}, '${user.email}')">
                    <i class="bi bi-trash"></i> Supprimer
                </button>
            </div>
        `;
        container.appendChild(div);
    });

    // Mise à jour du compteur présent dans ton HTML
    const etudiants = users.filter(u => u.role === 'Etudiant').length;
    const profs = users.filter(u => u.role === 'Prof').length;
    const counterText = document.querySelector(".main-title p.text-muted");
    if (counterText) {
        counterText.textContent = `${etudiants} étudiant(s) et ${profs} professeur(s)`;
    }
}

// Fonction de suppression
async function confirmDelete(id, email) {
    if (!confirm(`Voulez-vous vraiment supprimer ${email} ?`)) return;

    try {
        const res = await fetch(`/deleteUser/${id}`, { 
            method: "DELETE",
            credentials: "include" 
        });
        const data = await res.json();

        if (data.success) {
            loadUsers(); // On recharge la liste comme pour les questionnaires
        }
    } catch (err) {
        console.error("Erreur suppression:", err);
    }
}
