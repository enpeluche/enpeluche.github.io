/*
  Page d'accueil du blog : une carte par article (liste dans blog/data.json), avec recherche et tri.
  Chaque carte mène à la page de l'article, /blog/articles/<dossier>/
  (pour écrire un article : blog/articles/_modele/LISEZMOI.md).
*/

const grid = document.querySelector(".blog-grid");
const noResults = document.getElementById("no-results");

// Libellés affichés pour les catégories de data.json (une catégorie absente s'affiche telle quelle)
const CATEGORY_LABELS = {
  maths: "Maths",
  life: "Parcours",
};

function categoryLabel(category) {
  return CATEGORY_LABELS[category] || category;
}

function articleUrl(article) {
  return `/blog/articles/${article.folder}/`;
}

// "2026-03-15" lu comme une date locale (et non UTC), pour ne pas afficher la veille selon le fuseau
function parseDate(isoDate) {
  return new Date(`${isoDate}T00:00:00`);
}

// "2026-03-15" → "15 mars 2026"
function formatDate(isoDate) {
  return parseDate(isoDate).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Récupère la liste des articles et leurs métadonnées.
 * @async
 * @returns {Promise<Array>} Un tableau d'objets articles (vide si erreur).
 */
async function fetchData() {
  try {
    const res = await fetch("/blog/data.json");

    if (!res.ok) {
      throw new Error(`Erreur : ${res.status}`);
    }

    return await res.json();
  } catch (e) {
    console.error("Impossible de charger les articles :", e);
    return [];
  }
}

/**
 * Génère et affiche les cartes d'articles dans la grille HTML.
 * @param {Array} articlesList - Liste des articles à afficher.
 */
export function renderArticles(articlesList) {
  if (!grid) return;

  // on vide la grille avant de redessiner
  grid.innerHTML = "";

  // Gestion de l'affichage si la liste est vide (Recherche infructueuse)
  const hasArticles = articlesList.length > 0;
  if (noResults) noResults.classList.toggle("hidden", hasArticles);

  if (!hasArticles) return;

  articlesList.forEach((article) => {
    const card = document.createElement("article");
    card.className = "blog-card";

    // alt vide : l'image illustre le titre, écrit juste en dessous
    card.innerHTML = `
        <a class="blog-card-link" href="${articleUrl(article)}">
            <div class="blog-card-cover-frame">
                <img class="blog-card-cover" src="${articleUrl(article)}cover.webp" alt="" loading="lazy">
            </div>

            <div class="blog-card-body">
                <p class="blog-card-meta">
                    <span class="card-category">${categoryLabel(article.category)}</span>
                    <time datetime="${article.date}">${formatDate(article.date)}</time>
                </p>
                <h2 class="card-title">${article.title}</h2>
                <p class="card-summary">${article.summary || ""}</p>
            </div>
        </a>
        `;

    grid.appendChild(card);
  });
}

/**
 * Trie un tableau d'articles selon l'ordre demandé.
 * @param {Array} articles - Le tableau à trier
 * @param {String} sortValue - "newest" ou "oldest"
 * @returns {Array} Une nouvelle liste triée
 */
function sortArticles(articles, sortValue) {
  // Toujours créer une copie [...] pour ne pas détruire la liste originale
  return [...articles].sort((a, b) => {
    const dateA = parseDate(a.date);
    const dateB = parseDate(b.date);

    return sortValue === "newest" ? dateB - dateA : dateA - dateB;
  });
}

function initBlogSystem(allArticlesData) {
  const searchInput = document.getElementById("blog-search");
  const sortSelect = document.getElementById("blog-sort");

  if (!searchInput || !sortSelect) return;

  // Recherche et tri appliqués ensemble : changer l'ordre garde la recherche en cours
  const update = () => {
    const term = searchInput.value.toLowerCase();

    const filtered = allArticlesData.filter((article) => {
      return (
        article.title.toLowerCase().includes(term) ||
        (article.summary && article.summary.toLowerCase().includes(term)) ||
        categoryLabel(article.category).toLowerCase().includes(term)
      );
    });

    renderArticles(sortArticles(filtered, sortSelect.value));
  };

  sortSelect.value = localStorage.getItem("blogSortPref") || "newest";

  searchInput.addEventListener("input", update);

  sortSelect.addEventListener("change", () => {
    localStorage.setItem("blogSortPref", sortSelect.value);
    update();
  });

  update();
}

export async function initBlog() {
  // main.js est chargé sur toutes les pages : on n'agit que sur la page du blog
  // (les anciens liens /blog/?post=… sont redirigés dès le <head> de blog/index.html)
  if (!grid) return;

  const articlesData = await fetchData();

  initBlogSystem(articlesData);
}
