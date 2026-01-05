document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("twofa-form");
    const feedback = document.getElementById("twofa-feedback");

    document.getElementById('twofa-resend').addEventListener('click', async (e) => {
	    e.preventDefault();

            const response = await fetch("http://164.81.120.71:3000/resenda2f", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
	        credentials: "include",
                body: JSON.stringify({})
            });

            const data = await response.json();

	    document.getElementById('sendcode-feedback').classList.add('show');

            if (data.success) {
                feedback.style.color = "green";
                feedback.textContent = data.message;
            } else {
                feedback.style.color = "red";
                feedback.textContent = data.message;
            }
    });


    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const code = document.getElementById("twofa-code").value;

        if (!code) {
            feedback.textContent = "Veuillez remplir tous les champs.";
            return;
        }

        const response = await fetch("http://164.81.120.71:3000/a2f", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
	    credentials: "include",
            body: JSON.stringify({ code })
        });

        const data = await response.json();

        if (data.success) {
            feedback.style.color = "green";
            feedback.textContent = data.message;
            window.location.replace("http://164.81.120.71/SAE-BUT-2/site/page/studentview.html");
            //if data.role...
        } else {
            feedback.style.color = "red";
            feedback.textContent = data.message;
        }
    });
});
