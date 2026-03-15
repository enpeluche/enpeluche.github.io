import { setupKatex } from "/assets/js/katex-config.js";

const blogView = document.getElementById("blog-view");
const articleView = document.getElementById("article-view");
const contentLoader = document.getElementById("article-content-loader");
const backBtn = document.getElementById("back-btn");
const grid = document.querySelector(".blog-grid");
const noResults = document.getElementById("no-results");

/**
 * Récupère la liste des articles et leurs métadonnées.
 * @async
 * @returns {Promise<Array>} Un tableau d'objets articles (vide si erreur).
 * @example
 * const articles = await fetchData();
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

  // Création des cartes
  articlesList.forEach((article) => {
    const card = document.createElement("article");
    card.className = "blog-card fade-in-up delay-1";

    const basePath = `/blog/articles/${article.folder}/`;

    const coverUrl = basePath + "cover.jpg";
    const articleUrl = basePath + "article.html";

    card.innerHTML = `
        <a href="#" class="stretched-link js-load-article" data-url="${articleUrl}">
            <div class="card-header">
                <span class="card-title">${article.title}</span>
                <span class="card-category">${article.category}</span>
                <time class="card-date" datetime="${article.date}">
                    ${new Date(article.date).toLocaleDateString("fr-FR")}
                </time>
            </div>
            <div class="card-content">
                <img src="${coverUrl}" alt="${article.title}" loading="lazy">
            </div>
            
            
            </a>
        `;
    const link = card.querySelector(".js-load-article");
    link.addEventListener("click", (e) => {
      e.preventDefault();

      window.history.pushState({}, "", `?post=${article.folder}`);

      displayArticle(articleUrl);
    });
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
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    return sortValue === "newest" ? dateB - dateA : dateA - dateB;
  });
}

function initBlogSystem(allArticlesData) {
  const searchInput = document.getElementById("blog-search");

  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase();

    const filtered = allArticlesData.filter((article) => {
      return (
        article.title.toLowerCase().includes(term) ||
        (article.summary && article.summary.toLowerCase().includes(term)) ||
        (article.category && article.category.toLowerCase().includes(term))
      );
    });

    renderArticles(filtered);
  });

  const sortSelect = document.getElementById("blog-sort");

  if (sortSelect) {
    const savedSort = localStorage.getItem("blogSortPref") || "newest";

    sortSelect.value = savedSort;

    const initialSorted = sortArticles(allArticlesData, savedSort);
    renderArticles(initialSorted);
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      const sortValue = sortSelect.value;

      localStorage.setItem("blogSortPref", sortValue);

      const sorted = sortArticles(allArticlesData, sortValue);

      renderArticles(sorted);
    });
  }
}

async function displayArticle(url) {
  try {
    contentLoader.innerHTML =
      "<p style='text-align:center; padding:2rem;'>Chargement...</p>";
    blogView.classList.add("hidden");
    articleView.classList.remove("hidden");
    window.scrollTo(0, 0);

    const response = await fetch(url);
    if (!response.ok) throw new Error("Article introuvable");

    const html = await response.text();

    contentLoader.innerHTML = html;

    setupKatex(contentLoader);
  } catch (error) {
    contentLoader.innerHTML = `<p style="color:red; text-align:center;">Erreur : ${error.message}</p>`;
  }
}

if (backBtn) {
  backBtn.addEventListener("click", () => {
    articleView.classList.add("hidden");
    blogView.classList.remove("hidden");

    window.history.pushState({}, "", window.location.pathname);

    setTimeout(() => {
      contentLoader.innerHTML = "";
    }, 300);
  });
}
export async function initBlog() {
  const articlesData = await fetchData();

  initBlogSystem(articlesData);

  const urlParams = new URLSearchParams(window.location.search);
  const postFolder = urlParams.get("post");

  if (postFolder) {
    const articleUrl = `/blog/articles/${postFolder}/article.html`;
    displayArticle(articleUrl);
  }
}
