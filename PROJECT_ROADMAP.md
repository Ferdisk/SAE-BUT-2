# SAÉ-BUT-2 : Roadmap de Développement

## 📋 À faire (TODO)

### Priorité 🔴 Haute

- [ ] Refaire BDD et l'envoyer
- [ ] Envoyer maquettes avec user stories
- [ ] Faire liste des fonctionnalités pour se mettre d'accord
- [ ] Envoyer lien vers VM

### Priorité 🟡 Moyenne

- [ ] Implémenter validation complète des formulaires (titres obligatoires, options QCM, etc.)
- [ ] Intégrer persistance locale (localStorage)
- [ ] Implémenter export JSON vers serveur (fetch)

---

## 🐛 Bugs & Limitations Identifiés

### Builder de Questionnaires

- **Limitation sous-QCM** : Quand on crée un sous-QCM, on ne peut ajouter que 2 options maximum (limitation actuelle du système). Besoin d'étendre la logique pour permettre N options.
- **Tick marks du slider** : Les repères visuels du range input ne s'affichent pas de manière fiable cross-browser. Solution : utiliser CSS `::before` au lieu de `<datalist>`.

---

## 💡 Fonctionnalités Futures (Backlog)

### Questions Optionnelles / Obligatoires

- Rendre les questions **obligatoires par défaut**
- Ajouter une case à cocher pour les rendre **facultatives**
- Afficher un **symbole ⭐** ou **astérisque\*** pour les questions facultatives
- Ajouter un commentaire explicatif quelque part (légende ou tooltip)

### Affichage Dynamique par Type de Question

**Problème** : Le système actuel traite tous les types de questions (QCM, Texte, Échelle) de la même façon pour l'affichage des résultats. Cela crée des incohérences :

- Champ "Score moyen" n'a du sens que pour les **Échelles**, pas pour les QCM/Texte
- "Distribution de notes" : s'applique seulement aux **Échelles**
- "Performances par questions" : logique différente selon le type
- "Résultats individuels" : affichage différent par type

**Solution proposée** : Implémenter une **logique d'affichage conditionnelle** basée sur le type de question créée.
