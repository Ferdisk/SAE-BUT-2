const ajoutQuestionBtn = document.getElementById('ajout-question-btn');
const divbtnform_actions = document.querySelector('.form-actions');
const boutonform_actions = divbtnform_actions.querySelectorAll('button');

//Vérifie s'il y a des questions quand le bouton envoyer et effacer sont clicker
boutonform_actions.forEach(btn => {
    btn.addEventListener('click', () => {
            if (verifiePresenceQuestion()){
                //TODO
            } else {
                alert("Vous n'avez ajouté aucune question au formulaire !")
            };
        });
    });

function verifiePresenceQuestion() {
    //TODO
}