# Outils du site

Ce dossier commence par `_` : GitHub Pages ne le publie pas.

## `origamiser.py` : ajouter un loisir dans « En dehors du labo »

Chaque loisir de la page d'accueil montre une photo recouverte de sa version « pliée »
(des triangles, comme du papier plié), qui s'efface au survol ou au toucher.

### 1. Préparer la photo

Depuis la racine du dépôt :

```sh
pip install numpy pillow        # une seule fois
python3 _outils/origamiser.py ~/Images/ma-photo.jpg randonnee-vercors
```

Le second argument est un nom court, en minuscules, sans espaces ni accents.
Le script crée dans `assets/img/loisirs/` :

- `randonnee-vercors.webp` : la photo, redressée, redimensionnée et **sans métadonnées**.
  Les photos de téléphone contiennent souvent leur position GPS : elle est retirée ;
- `randonnee-vercors-plis.webp` : la version pliée.

Utiliser de préférence la photo originale, en grand : en dessous de 1000 pixels,
elle sera un peu floue une fois dépliée (le script prévient).

### 2. Ajouter le bloc dans `index.html`

Dans la section `id="hobbies"`, copier un `<article class="hobby reveal">` existant,
puis adapter :

- `src` et `folds` : les deux fichiers créés à l'étape 1 ;
- `alt` : ce que montre la photo (c'est ce que lisent les lecteurs d'écran) ;
- le titre, le texte, les étiquettes et le lien éventuel vers un article.

L'image passe toute seule à gauche puis à droite d'un bloc à l'autre.

### 3. Traduire

Chaque texte a un attribut `data-i18n="…"`. Ajouter les mêmes clés dans
`assets/js/translate.js`, à côté des clés `hobby_origami_…` existantes (rechercher
`hobby_origami_title`), avec la version `fr` et la version `en`.

### Comment les plis sont calculés

1. Des points sont tirés au hasard, plus nombreux là où la photo a des contours.
2. Ils sont reliés en triangles par une **triangulation de Delaunay** (algorithme de
   Bowyer-Watson) : aucun point ne tombe à l'intérieur du cercle circonscrit d'un triangle.
3. Chaque triangle prend la couleur moyenne des pixels qu'il recouvre, à quelques pour cent près
   pour imiter la lumière sur un pli.

Le même nom donne toujours les mêmes plis.

## `bandeaux.py` : les illustrations en tête des cartes projets

Chaque carte projet commence par un bandeau dessiné au trait, calculé à partir du sujet
du projet (le code de Beckett-Gray est vraiment recherché, les rayons s'arrêtent vraiment
sur le cœur de Taubin, etc.).

```sh
pip install numpy               # une seule fois
python3 _outils/bandeaux.py     # régénère tous les fichiers de assets/img/bandeaux/
```

Le script donne toujours les mêmes fichiers. Les SVG sont dessinés en noir, sur fond transparent :
sur le site, ils servent de **masque** (classe `.project-banner`), et prennent donc la couleur
violette du thème, de jour comme de nuit.

### Ajouter un bandeau à un nouveau projet

1. Écrire dans `bandeaux.py` une fonction qui renvoie `svg(...)` (zone de 600 × 150),
   puis l'ajouter au dictionnaire `BANNERS` avec un nom court.
2. Lancer le script.
3. Dans `index.html`, juste après l'ouverture de la carte (`<div class="project" …>`) :

   ```html
   <div class="project-banner" style="--banner: url('/assets/img/bandeaux/mon-projet.svg')" aria-hidden="true"></div>
   ```

   Le bandeau est décoratif (`aria-hidden`) : le titre de la carte dit déjà de quoi il s'agit.

## `sitemap.py` : la liste des pages pour les moteurs de recherche

`sitemap.xml` (à la racine) liste les pages du site pour Google et les autres moteurs ;
`robots.txt` leur indique où le trouver. Après chaque nouvel article (une fois `blog/data.json`
modifié) :

```sh
python3 _outils/sitemap.py
```

Aucune dépendance. Si on l'oublie, le test « sitemap » échoue et rappelle la commande.

## `polices.py` : la police Inter, allégée

Le site utilise une seule police, Inter (variable : toutes les graisses dans un fichier).
La version complète contient aussi le grec, le cyrillique, le vietnamien… et pèse ~350 Ko par style.
Le site charge donc une **version allégée** (alphabet latin, ~140 Ko) : `InterVariable-latin.woff2`
et `InterVariable-Italic-latin.woff2`.

La police complète reste dans `assets/fonts/` **en secours** : le navigateur ne la télécharge que
si une page contient un caractère absent de la version allégée (une lettre grecque, par exemple).
Rien ne s'affiche donc jamais mal, au pire la page est un peu plus lourde.

Pour changer la liste des caractères de la version allégée (`PLAGES_ALLEGEES`, en haut du script) :

```sh
pip install fonttools brotli    # une seule fois
python3 _outils/polices.py      # régénère les deux polices allégées et leurs déclarations dans inter.css
```

Le test « polices » signale si une page télécharge la police complète, c'est-à-dire si un caractère
utilisé sur le site manque dans la version allégée.

## `tests/` : les tests automatiques du site

Environ 170 vérifications, faites dans un vrai navigateur (Chromium) : menu, mode nuit,
« réduire les animations », blog et chaque article, loisirs, pas de défilement horizontal
sur téléphone, liens internes, bandeaux, sitemap, polices, navigation au clavier (`clavier.test.js` :
chaque page est parcourue avec Tab et Maj+Tab ; chaque arrêt doit avoir un contour visible,
un nom, et ne jamais être caché sous le menu), et audit d'accessibilité automatique
(`accessibilite.test.js`, avec axe-core : contrastes, structure des titres, noms des liens…,
sur chaque page, de jour et de nuit).

Ils ne supposent rien sur le contenu : ajouter un article, un loisir ou un projet ne les casse pas
(au contraire, ils vérifient le nouveau contenu).

### Sur GitHub

Ils se lancent tout seuls à chaque pull request et à chaque push sur `main`
(`.github/workflows/tests.yml`) : coche verte ou croix rouge à côté du commit,
détail dans l'onglet « Actions » du dépôt.

### En local

Il faut Node.js (version 18 ou plus). Depuis `_outils/tests` :

```sh
npm install                              # une seule fois
npx playwright install chromium          # une seule fois : télécharge le navigateur de test
npm test                                 # tous les tests
node lancer.js blog                      # seulement blog.test.js
```

Le script démarre lui-même un petit serveur local : rien d'autre à lancer.
Chaque ligne affiche `OK` ou `ÉCHEC` puis ce qui est vérifié ; le bilan est à la fin.

### Ajouter une vérification

Dans le fichier `*.test.js` du thème concerné (ou un nouveau fichier `*.test.js`, pris en compte
automatiquement) : `ok(condition, "ce qui est vérifié")`. Les outils disponibles
(`nouvellePage`, `attendre`, `articles`…) sont décrits dans `outils.js`.
