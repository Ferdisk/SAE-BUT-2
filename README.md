# SAÉ-BUT-2
### 1. Contexte du projet
L’IUT du Limousin souhaite moderniser la collecte de questionnaires auprès des étudiants de **BUT 2** et **BUT 3** après leurs soutenances de stage. Actuellement, les questionnaires sont distribués sous format papier, ce qui pose plusieurs problèmes : lisibilité, exploitation des données, coûts d’impression…  
L’objectif est donc de mettre en place un outil numérique permettant :

- de créer, personnaliser, remplir et exploiter des questionnaires en ligne,
- de remplacer le support papier par une solution 100 % numérique,
- de faciliter la création et la personnalisation des questionnaires pour les enseignants,
- d’automatiser l’exploitation des données (exports, statistiques, graphiques).

---

### 2. Objectifs du projet
|  | Description |
|---|-------------|
| 1 | Remplacer le questionnaire papier par une solution numérique. |
| 2 | Faciliter la création et personnalisation des questionnaires par les enseignants. |
| 3 | Automatiser l’exploitation des données (exports, statistiques, graphiques). |

---

### 3. Choix de la solution
Après analyse des besoins, nous avons retenu la **solution 1** : « Créer un outil de formulaire permettant de personnaliser le questionnaire, de le générer, d'être averti de son remplissage et d'exploiter les données ».

Deux alternatives ont été envisagées puis écartées :
- **Solution 2** : « Créer un outil de formulaire permettant de personnaliser le questionnaire, de le générer au format papier et d'utiliser une IA pour reconnaître l'écriture et extraire les données »
- **Solution 3** : Proposition libre

La solution 2 présentait l'inconvénient majeur de s'appuyer sur une technologie de reconnaissance de texte qui n'est pas totalement fiable : risques d'erreurs d'interprétation et nécessité de corrections manuelles. Quant à la solution 3, elle n'a pas été développée car la solution 1 apparaît comme la plus réalisable et la moins sujette aux limitations techniques.

---


### 4. Acteurs & utilisateurs
| Rôle | Utilisation |
|------|-------------|
| Administrateurs / Enseignants | Création et gestion des questionnaires |
| Étudiants | Remplissage des questionnaires |
| Cheffe de département / DSI | Gestion technique, sécurité, hébergement |

---

### 5. Besoins fonctionnels

#### 5.1 Création & gestion des questionnaires
- Interface pour créer un questionnaire (titre, description, date, etc.).
- Personnalisation des questions :
  - Réponses ouvertes (texte libre)
  - Questions fermées (QCM, cases à cocher)
  - Échelles de notation
  - Champs obligatoires
- Sauvegarde des modèles afin de pouvoir les réutiliser.

#### 5.2 Remplissage par les étudiants
- Accès via lien ou QR‑code.
- Vérification automatique des champs obligatoires avant validation.
- Envoi d’une confirmation de rendu à l’étudiant.

#### 5.3 Exploitation des données
- Tableau de bord pour visualiser les résultats.
- Export des données : CSV, Excel, PDF.
- Archivage des questionnaires et réponses.
- Génération automatique de statistiques & graphiques (taux de remplissage, moyennes, histogrammes…).

---

### 6. Besoins non fonctionnels
| Aspect | Exigences |
|--------|-----------|
| **Sécurité** | Authentification via identifiants universitaires. |
| **Performance / Accessibilité** | Site rapide d’accès et de soumission même en forte charge (fin de semestre). Compatible tablette, ordinateur, smartphone (responsive design). |

---

### 7. Contraintes techniques
- Application web uniquement (conformité aux politiques de sécurité de l’Université).
- Hébergement sur les serveurs universitaires (compatibilité Linux/Windows Server – à confirmer avec la DSI).
- Technologies à définir en fonction des compétences et contraintes :
  - Front : React / Vue.js / Angular / HTML/CSS/PHP
  - Back : Node.js / Django / Laravel
  - BDD : PostgreSQL / MySQL

---

### 8. Planning prévisionnel
| Phase | Tâches | Durée estimée |
|-------|--------|---------------|
| Analyse & conception | Conception de la base de données | 2‑3 semaines |
| Développement | Générateur de formulaires | 4‑6 semaines |
|  | Module de remplissage étudiant | 3‑5 semaines |
|  | Module d’exploitation (statistiques, exports) | 3‑4 semaines |
| Tests & validation | Intégration, tests fonctionnels et de charge | 2‑3 semaines |

**Durée totale estimée :** *≈ 18 semaines* (environ 4 mois)

---

### 9. Annexes
- Liste détaillée des champs possibles pour chaque type de question.
- Modèle de base de données initiale (ERD).
- Cahier de recette.

---