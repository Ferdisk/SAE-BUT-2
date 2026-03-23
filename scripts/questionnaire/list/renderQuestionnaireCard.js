import { appendChildren } from "../dom/helpers.js";
import { attachCardActions } from "./cardActions.js";

export function renderQuestionnaireCard(q) {
    const div = document.createElement("div");
    div.className = "questionnaire-card";

    const title = document.createElement("h3");
    title.textContent = q.titre || "Sans titre";

    const code = document.createElement("p");
    code.textContent = `Code formulaire : ${q.lien_formulaire || "Aucun code"}`;

    const description = document.createElement("p");
    description.textContent = q.description || "Aucune description";

    const createdAt = document.createElement("small");
    createdAt.textContent = `Créé le : ${new Date(q.date_creation).toLocaleDateString()}`;

    const lineBreak = document.createElement("br");
    const etatLabel = document.createElement("strong");
    etatLabel.textContent = "État :";
    const etatValue = document.createTextNode(` ${q.etat || "Inconnu"}`);

    const actions = document.createElement("div");
    actions.className = "actions";

    const btnVoir = document.createElement("button");
    btnVoir.className = "btn-blue btn-view";
    btnVoir.dataset.id = q.id;
    btnVoir.textContent = "Voir";

    const btnQRCode = document.createElement("button");
    btnQRCode.className = "btn-blue btn-qrcode";
    btnQRCode.textContent = "QR Code";

    const btnTracking = document.createElement("button");
    btnTracking.className = "btn-blue btn-tracking";
    btnTracking.dataset.id = q.id;
    btnTracking.textContent = "Suivi des étudiants";

    const btnExport = document.createElement("button");
    btnExport.className = "btn-blue btn-export";
    btnExport.dataset.id = q.id;
    btnExport.textContent = "Exporter les réponses";

    const btnStat = document.createElement("button");
    btnStat.className = "btn-blue btn-stat";
    btnStat.dataset.id = q.id;
    btnStat.textContent = "Stats";

    const btnDelete = document.createElement("button");
    btnDelete.className = "btn-red btn-delete";
    btnDelete.dataset.id = q.id;
    btnDelete.textContent = "Supprimer";

    appendChildren(actions, btnVoir, btnQRCode, btnTracking, btnExport, btnStat, btnDelete);
    appendChildren(div, title, code, description, createdAt, lineBreak, etatLabel, etatValue, actions);

    attachCardActions({ q, div, btnVoir, btnQRCode, btnTracking, btnExport, btnStat, btnDelete });

    return div;
}
