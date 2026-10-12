# Écrire un article de blog

Chaque article est une page à part entière : `blog/articles/<DOSSIER>/index.html`,
visible à l'adresse `https://enpeluche.github.io/blog/articles/<DOSSIER>/`.

Ce dossier `_modele` ne sert qu'à être copié. Comme son nom commence par `_`,
GitHub Pages ne le publie pas.

## Les étapes

### 1. Créer le dossier de l'article

Copier `blog/articles/_modele/` en `blog/articles/<DOSSIER>/`.

Nom du dossier : `AAAA-MM-JJ-sujet`, en minuscules, sans espaces ni accents.
Exemple : `2026-11-02-kernelisation`.

Supprimer la copie de ce fichier `LISEZMOI.md` dans le nouveau dossier.

### 2. Remplir l'en-tête de `index.html`

Remplacer chaque `⟨…⟩` (rechercher le caractère `⟨` pour n'en oublier aucun) :

| À remplacer | Exemple |
|---|---|
| `⟨Titre de l'article⟩` (3 fois) | `La kernelisation expliquée` |
| `⟨Résumé en une ou deux phrases⟩` (2 fois) | `Réduire un problème difficile à un noyau…` |
| `⟨DOSSIER⟩` (3 fois, plus le chemin des images) | `2026-11-02-kernelisation` |
| `⟨AAAA-MM-JJ⟩` (2 fois) | `2026-11-02` |
| `⟨2 novembre 2026⟩` | la date écrite en toutes lettres |
| `⟨Maths⟩` | la catégorie affichée (voir l'étape 5) |

Le titre et le résumé sont ceux qui s'affichent dans Google et dans l'aperçu
quand on partage le lien (LinkedIn, messageries).

### 3. Écrire le contenu

Entre `CONTENU` et `FIN DU CONTENU`. Le modèle montre un exemple de chaque bloc :

- `<div class="paragraph">` : un paragraphe ;
- `<h2>`, `<h3>` : titres, numérotés automatiquement (1., 1.1…) ;
- `$…$` : formule dans le texte, `$$…$$` : formule centrée.
  Les raccourcis `\norm{x}`, `\ps{x}{y}`, `\OO`, `\F`, `\K`… sont définis dans
  `shared-assets/katex-config.js` ;
- `definition`, `theorem`, `proof` (et aussi `lemma`, `proposition`, `remark`,
  `example`, `notation`, `conjecture`, `problem`, `counterexample`) :
  le mot « Définition. », « Preuve. »… s'affiche tout seul ;
- `<details>` : une note que le lecteur peut déplier ;
- `<figure>` : une image avec sa légende. Toujours remplir `alt` avec ce que
  montre l'image (c'est ce que lisent les lecteurs d'écran).

Supprimer les exemples inutiles.

### 4. Ajouter l'image de couverture

Dans le dossier de l'article :

- `cover.webp` : l'image de la carte sur la page du blog (format 16:9 conseillé) ;
- `cover.jpg` : la même en JPG, pour l'aperçu de partage (LinkedIn n'accepte pas le WebP).
  Idéalement 1200 × 630 pixels.

### 5. Ajouter l'article à la liste du blog

Dans `blog/data.json`, ajouter un bloc (attention à la virgule entre deux blocs) :

```json
{
  "title": "La kernelisation expliquée",
  "date": "2026-11-02",
  "category": "maths",
  "folder": "2026-11-02-kernelisation",
  "summary": "Réduire un problème difficile à un noyau…"
}
```

Catégories existantes : `maths` (affichée « Maths ») et `life` (affichée « Parcours »).
Pour en créer une, ajouter son libellé dans `CATEGORY_LABELS`, en haut de `blog/blog.js`.

### 6. Vérifier en local

Depuis la racine du dépôt :

```sh
python3 -m http.server 8000
```

Puis ouvrir `http://localhost:8000/blog/` : la carte doit apparaître, et mener à l'article.
Vérifier les formules, les images, et le mode nuit.

### 7. Publier

Commit, push : GitHub Pages met le site à jour en une ou deux minutes.

Après un premier partage sur LinkedIn, si l'aperçu est faux ou vide, passer l'adresse
de l'article dans le Post Inspector de LinkedIn pour rafraîchir son cache.
