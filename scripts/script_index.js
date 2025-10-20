const ajoutQuestionBtn = document.getElementById('ajout-question-btn');
const divbtnform_actions = document.querySelector('.form-actions');
const boutonform_actions = divbtnform_actions.querySelectorAll('button');
let questionsHidden = true;
let nbr_questions = 0;

function displayQuestions() {
    if (questionsHidden) {
        document.getElementById("builder-questions-container").style.display = 'block';
        questionsHidden = false
    } else {
        document.getElementById("builder-questions-container").style.display = 'none';
        questionsHidden = true
    }
}

function addQCM() {
    let nbr_questions = 1;
    const containerQCM = document.createElement("ul");
    containerQCM.classList.add("containerQCM");
    const titreQCM = document.createElement("textarea");
    titreQCM.classList.add("titreQCM");
    let textTitreQCM = document.createTextNode("QCM");
    
    const listQCM = document.createElement("ul");
    listQCM.classList.add("listQCM");
    const elementQCM = document.createElement("li");
    elementQCM.classList.add("elementQCM");
    const caseACocher = document.createElement("INPUT");
    caseACocher.setAttribute("type", "checkbox");
    caseACocher.classList.add("caseACocher");
    const textQuestionContainer = document.createElement("span");
    textQuestionContainer.classList.add("textQuestionContainer");
    const textAreaQuestion = document.createElement("textarea");
    textAreaQuestion.classList.add("textAreaQuestion");
    let textQuestion = document.createTextNode("Choix " + nbr_questions.toString());
    
    const addQuestion = document.createElement("button");
    const addQuestionText = document.createTextNode("+");
    
    const removeQuestion = document.createElement("button");
    const removeQuestionText = document.createTextNode("-");
    

    addQuestion.onclick = function(){
        nbr_questions += 1;
        const addElementQCM = document.createElement("li");
        addElementQCM.classList.add("nvElementQCM");
        const addCaseACocher = document.createElement("INPUT");
        addCaseACocher.classList.add("nvCaseACocher");
        addCaseACocher.setAttribute("type", "checkbox");
        addElementQCM.appendChild(addCaseACocher);
        listQCM.appendChild(addElementQCM);

        const addTextQuestionContainer = document.createElement("span");
        addTextQuestionContainer.classList.add("nvTextQuestionContainer");
        const addTextAreaQuestion = document.createElement("textarea");
        addTextAreaQuestion.classList.add("nvTextAreaQuestion");
        let addTextQuestion = document.createTextNode("Choix " + nbr_questions.toString());
        addTextAreaQuestion.appendChild(addTextQuestion);
        addTextQuestionContainer.appendChild(addTextAreaQuestion);
        addElementQCM.appendChild(addTextQuestionContainer);

        
        addTextQuestion.classList.add("nvTextQuestion");
    };

    removeQuestion.onclick = function(){
        if (nbr_questions>1){
            nbr_questions -= 1;
            listQCM.removeChild(listQCM.lastChild);
        }
    };
    
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

    textTitreQCM.classList.add("textTitreQCM");
    textQuestion.classList.add("textQuestion");
    addQuestionText.classList.add("addQuestionText");
    removeQuestionText.classList.add("removeQuestionText");
}

function addTexte() {
    const containerText = document.createElement("ul");
    containerText.classList.add("containerText");
    const titreQuestion = document.createElement("textarea");
    titreQuestion.classList.add("titreQuestion");
    let titreQuestionText = document.createTextNode("Titre");
    
    const containerReponse = document.createElement("li");
    containerReponse.classList.add("containerReponse");
    const reponseQuestion = document.createElement("textarea");
    reponseQuestion.classList.add("reponseQuestion");
    let reponseQuestionText = document.createTextNode("Écrivez votre réponse : ");
    
    titreQuestion.appendChild(titreQuestionText);
    reponseQuestion.appendChild(reponseQuestionText);
    containerText.appendChild(titreQuestion);
    containerReponse.appendChild(reponseQuestion)
    containerText.appendChild(containerReponse);
    const element = document.getElementById("questions-container");
    element.append(containerText);

    titreQuestionText.classList.add("titreQuestionText");
    reponseQuestionText.classList.add("reponseQuestionText");
}

function removeLastQuestion() {
    const element = document.getElementById("questions-container");
    element.removeChild(element.lastChild);
}


function verifiePresenceQuestion(){
    const container = document.getElementById('questions-container');
    return !!(container && container.children.length > 0);
}


function btnEnvoyerClickerSansQuestion(){
    if (!verifiePresenceQuestion()) {
        alert("Vous devez insérer des questions pour envoyer");
    } else {
        console.log("Formulaire valide, prêt à être envoyé");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    envoyerEstClicker();
})

function addEchelleNotation() {
    
}