# Anniversaire de Lyne : choix des plats

Le site (`docs/index.html`, publié avec GitHub Pages) permet à chaque membre de la famille d'indiquer son nom et de choisir son plat du menu Barollière, **sans créer de compte**.
Les choix sont enregistrés dans un Google Sheet qui appartient à l'organisateur.

## Brancher le Google Sheet (une seule fois, 5 minutes)

1. Crée un nouveau Google Sheet (par exemple « Anniv Lyne – choix »).
2. Menu **Extensions > Apps Script**. Efface le code présent et colle tout le contenu de `google-apps-script/Code.gs`. Enregistre.
3. **Déployer > Nouveau déploiement**, type **Application Web** :
   - Exécuter en tant que : **Moi**
   - Qui a accès : **Tout le monde**
4. Clique sur **Déployer**, autorise l'accès (Google affiche un avertissement : *Paramètres avancés > Accéder au projet*).
5. Copie l'**URL de l'application Web** (elle se termine par `/exec`) et mets-la dans `docs/index.html`, à la ligne `const SCRIPT_URL = "";`.

Les choix apparaissent dans l'onglet **Choix** du Sheet.
