
    document.querySelector('.add-user').addEventListener('click', function() {
      const modal = new bootstrap.Modal(document.getElementById('addUserModal'));
      modal.show();
    });

    // Gérer la soumission du formulaire
    document.getElementById('submitUser').addEventListener('click', function() {
      const studentName = document.getElementById('studentName').value;
      const studentSurName = document.getElementById('studentSurName') ? document.getElementById('studentSurName').value : '';
      if (studentName.trim() !== '') {
        console.log('Nom de l\'étudiant:', studentName);
        console.log('Prénom de l\'étudiant:', studentSurName);
        // Ici vous pouvez ajouter votre logique pour sauvegarder l'utilisateur
        const modal = bootstrap.Modal.getInstance(document.getElementById('addUserModal'));
        modal.hide();
        // Réinitialiser le formulaire
        document.getElementById('addUserForm').reset();
      } else {
        alert('Veuillez entrer un nom');
      }
    });