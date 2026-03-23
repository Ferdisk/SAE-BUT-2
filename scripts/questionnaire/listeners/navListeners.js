import { API_ENDPOINTS, apiFetch } from "../api.js";

export function bindLogoutListener() {
    const logoutBtn = document.getElementById("logout-btn");
    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        try {
            const res = await apiFetch(API_ENDPOINTS.logout, { method: "POST" });
            const data = await res.json();

            if (data.success) {
                window.location.replace("/loginStudent");
            } else {
                alert("Erreur lors de la déconnexion");
            }
        } catch (err) {
            console.error(err);
            alert("Erreur serveur");
        }

        apiFetch(API_ENDPOINTS.session)
            .then((res) => res.json())
            .then((data) => {
                if (!data.connected) {
                    window.location.replace("/loginStudent");
                }
            });
    });
}

export function bindBackButtonListener() {
    const btnBack = document.getElementById("btn-back");
    if (!btnBack) return;

    const redirectionMap = {
        Admin: "/adminQuestionnaires",
        Prof: "/prof",
        Etudiant: "/student"
    };

    btnBack.addEventListener("click", async (e) => {
        e.preventDefault();

        try {
            const res = await apiFetch(API_ENDPOINTS.session);
            const data = await res.json();

            if (!data.connected || !data.user) {
                window.location.href = "/loginStudent";
                return;
            }

            const role = data.user.role;
            const provenance = document.referrer;

            if (role === "Admin" && provenance.includes("/adminQuestionnaires")) {
                window.location.href = provenance;
                return;
            }

            const destination = redirectionMap[role] || "/student";
            window.location.href = destination;
        } catch (err) {
            console.error("Erreur lors de la redirection :", err);
            window.history.back();
        }
    });
}
