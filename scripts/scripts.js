const ajoutQuestionBtn = document.getElementById('ajout-question-btn');
const divbtnform_actions = document.querySelector('.form-actions');
const boutonform_actions = divbtnform_actions.querySelectorAll('button');
let questionsHidden = true;
let nbr_questions = 0;

//Vérifie s'il y a des questions quand le bouton envoyer et effacer sont clicker
// boutonform_actions.forEach(btn => {
//     btn.addEventListener('click', () => {
//             if (verifiePresenceQuestion()){

//             } else {
//                 alert("Vous n'avez ajouté aucune question au formulaire !")
//             };
//         });
//     });

// function verifiePresenceQuestion() {

// }

function displayQuestions() {
    if (questionsHidden) {
        document.getElementById("builder-questions-container").style.display = 'block';
        questionsHidden = false
    } else {
        document.getElementById("builder-questions-container").style.display = 'none';
        questionsHidden = true
    }
}
}

function addQCM() {
    let nbr_questions = 1;
    const containerQCM = document.createElement("ul")
    const titreQCM = document.createElement("textarea");
    let textTitreQCM = document.createTextNode("QCM");
    const listQCM = document.createElement("ul");
    const elementQCM = document.createElement("li");
    const caseACocher = document.createElement("INPUT");
    caseACocher.setAttribute("type", "checkbox");
    const textQuestionContainer = document.createElement("span");
    const textAreaQuestion = document.createElement("textarea");
    let textQuestion = document.createTextNode("Question " + nbr_questions.toString());
    const addQuestion = document.createElement("button");
    const addQuestionText = document.createTextNode("+");
    const removeQuestion = document.createElement("button");
    const removeQuestionText = document.createTextNode("-");

    addQuestion.onclick = function(){
        nbr_questions += 1;
        const addElementQCM = document.createElement("li");
        const addCaseACocher = document.createElement("INPUT");
        addCaseACocher.setAttribute("type", "checkbox");
        addElementQCM.appendChild(addCaseACocher);
        listQCM.appendChild(addElementQCM);

        const addTextQuestionContainer = document.createElement("span");
        const addTextAreaQuestion = document.createElement("textarea");
        let addTextQuestion = document.createTextNode("Question " + nbr_questions.toString());
        addTextAreaQuestion.appendChild(addTextQuestion);
        addTextQuestionContainer.appendChild(addTextAreaQuestion);
        addElementQCM.appendChild(addTextQuestionContainer);
    }; //ajout choix

    removeQuestion.onclick = function(){
        if (nbr_questions>1){
            nbr_questions -= 1;
            listQCM.removeChild(listQCM.lastChild);
        }
    } //suppression choix
    
    addQuestion.classList.add("link");
    addQuestion.appendChild(addQuestionText);
    removeQuestion.classList.add("link");
    removeQuestion.appendChild(removeQuestionText);
    textAreaQuestion.appendChild(textQuestion);
    textQuestionContainer.appendChild(textAreaQuestion);
    textQuestionContainer.appendChild(addQuestion);
    textQuestionContainer.appendChild(removeQuestion);
    const element = document.getElementById("questions-container");
    containerQCM.appendChild(titreQCM);
    containerQCM.appendChild(listQCM);
    titreQCM.appendChild(textTitreQCM);
    listQCM.appendChild(elementQCM);
    elementQCM.appendChild(caseACocher);
    elementQCM.appendChild(textQuestionContainer);
    element.appendChild(containerQCM);
}

function addTexte() {
    // const para = document.createElement("p");
    // const node = document.createTextNode("Texte");
    // const element = document.getElementById("questions-container");
    // para.appendChild(node);
    // element.appendChild(para);
    const containerText = document.createElement("ul");
    const titreQuestion = document.createElement("textarea");
    let titreQuestionText = document.createTextNode("Titre");
    const containerReponse = document.createElement("li");
    const reponseQuestion = document.createElement("textarea");
    let reponseQuestionText = document.createTextNode("Écrivez votre réponse : ");
    titreQuestion.appendChild(titreQuestionText);
    reponseQuestion.appendChild(reponseQuestionText);
    containerText.appendChild(titreQuestion);
    containerReponse.appendChild(reponseQuestion)
    containerText.appendChild(containerReponse);
    const element = document.getElementById("questions-container");
    element.append(containerText);
}

function removeLastQuestion() {
    const element = document.getElementById("questions-container");
    element.removeChild(element.lastChild);
}