document.querySelector('.add-user').addEventListener('click', function() {
    const modal = new bootstrap.Modal(document.getElementById('addUserModal'));
    modal.show();
});

document.getElementById('submitUser').addEventListener('click', async function() {
    const newUserMail = document.getElementById('newUserMail').value;
    const newUserPassword = document.getElementById('newUserPassword').value;
    const newUserPasswordConfirm = document.getElementById('newUserConfirm').value;
    const feedback = document.getElementById('feedback');
    feedback.style.color = "red";
    if (!newUserMail || !newUserPassword) {
	feedback.textContent="Veuillez remplir tous les champs.";
	return;
    }
    if (newUserPassword != newUserPasswordConfirm) {
	feedback.textContent="Les mots de passe ne sont pas similaires.";
	return;
    }

    let role = '';
    if (newUserMail.includes("@etu.unilim.fr")) {
	role = 'Etudiant';
    } else if (newUserMail.includes("@unilim.fr") || newUserMail.includes("aff@unilim.fr")) {
	role = 'Prof';
    } else {
	feedback.textContent="Email invalide.";
	return;
    }

    alert('mail :' + newUserMail);
    alert('mdp:' + newUserPassword);

    const response = await fetch("http://164.81.120.71:3000/addUser", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ newUserMail, newUserPassword, role})
        });

        const data = await response.json();

        if (data.success) {
            feedback.style.color = "green";
            feedback.textContent = data.message;
    	    document.getElementById('addUserForm').reset();
        } else {
            feedback.style.color = "red";
            feedback.textContent = data.message;
        }

});
