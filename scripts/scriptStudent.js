document.getElementById("logout-btn").addEventListener("click", async (e) => {
    e.preventDefault();

    try {
        const res = await fetch("http://164.81.120.71:3000/logout", {
            method: "POST",
            credentials: "include"
        });

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

    fetch("http://164.81.120.71:3000/session", { credentials: "include" })
        .then(res => res.json())
        .then(data => {
            if (!data.connected) {
                window.location.replace("/loginStudent");
            }
        });

});

document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("questionnaire-access-button");

    if (!btn) return;

    btn.addEventListener("click", async (e) => {
        e.preventDefault();

        const code = document.getElementById("label-link").value.trim();

        if (!code) {
            alert("Veuillez entrer un code");
            return;
        }

        try {
            const res = await fetch(`/api/questionnaire/code/${code}`, {
                credentials: "include"
            });

            const data = await res.json();

            if (!data.success) {
                alert("Impossible de charger le questionnaire");
                return;
            }

	    sessionStorage.setItem("questionnaire", JSON.stringify(data.questionnaire));

            window.location.href = `/questionnaire/code/${code}`;

        } catch (err) {
            console.error(err);
            alert("Erreur serveur");
        }
    });
});

