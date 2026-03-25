import { getFormTitleValue } from "./title.js";
import { hasQuestions, answersValidation } from "./validation.js";
import { getFullForm } from "./serializer.js";

export function handleSubmitAttempt(sendFormFn) {
    const titleBox = getFormTitleValue();

    if (!hasQuestions()) {
        alert("Vous devez insérer des questions pour envoyer");
    } else if (!answersValidation()) {
        alert("Certaines zones de texte sont vides, veuillez les remplir.");
    } else if (titleBox.trim().length === 0) {
        alert("Votre titre ne doit pas être vide");
    } else {
        alert("Formulaire valide, prêt à être sauvegardé");
        const formReady = getFullForm();
        sendFormFn(formReady);
    }
}
