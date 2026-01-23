document.addEventListener("DOMContentLoaded", () => {
    loadUsers();
});

async function loadUsers() {
    try {
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
    container.innerHTML = "";

    if (users.length === 0) {
        container.innerHTML = "<p class='text-muted'>Aucun utilisateur trouvé.</p>";
        return;
    }

    users.forEach(user => {
        const div = document.createElement("div");
        div.className = "user-card d-flex justify-content-between align-items-center p-3 mb-2 bg-white shadow-sm rounded border";

        let profButton = "";
        if (user.role === 'Prof') {
            profButton = `
                <button class="btn btn-sm btn-outline-primary me-2"
                        onclick="window.location.href='/adminQuestionnaires?authorId=${user.id}'"
                        title="Voir les questionnaires créés par ce prof">
                    <i class="bi bi-file-earmark-text"></i> Voir ses questionnaires
                </button>`;
        }

        let deleteButton = "";
        if (user.role !== 'Admin') {
            deleteButton = `
                <button class="btn btn-sm btn-outline-danger"
                        onclick="confirmDelete(${user.id}, '${user.email}')"
                        title="Supprimer l'utilisateur et ses données">
                    <i class="bi bi-trash"></i>
                </button>`;
        } else {
            deleteButton = `<span class="badge bg-secondary opacity-50"><i class="bi bi-shield-lock"></i></span>`;
        }

        div.innerHTML = `
            <div class="user-details">
                <h6 class="mb-0"><strong>${user.prenom} ${user.nom.toUpperCase()}</strong></h6>
                <p class="text-muted mb-0 small">
                    ${user.email} —
                    <span class="badge ${user.role === 'Admin' ? 'bg-danger' : 'bg-light text-dark'}">
                        ${user.role}
                    </span>
                </p>
            </div>
            <div class="user-actions d-flex align-items-center">
                ${profButton}
                ${deleteButton}
            </div>
        `;
        container.appendChild(div);
    });

    updateCounters(users);
}

function updateCounters(users) {
    const etudiants = users.filter(u => u.role === 'Etudiant').length;
    const profs = users.filter(u => u.role === 'Prof').length;
    const counterText = document.querySelector(".main-title p.text-muted");
    if (counterText) {
        counterText.textContent = `${etudiants} étudiant(s) et ${profs} professeur(s) inscrit(s)`;
    }
}

async function confirmDelete(id, email) {
    if (!confirm(`Voulez-vous vraiment supprimer ${email} ?`)) return;

    try {
        const res = await fetch(`/deleteUser/${id}`, {
            method: "DELETE",
            credentials: "include"
        });
        const data = await res.json();

        if (data.success) {
            loadUsers();
        }
    } catch (err) {
        console.error("Erreur suppression:", err);
    }
}
