import { loadTableOfContents } from "/components/TableOfContents/TableOfContents.js";
import { initScrollDown } from "/components/ScrollDown/ScrollDown.js";
import { initCarousel } from "/components/Carousel/Carousel.js";
import { createNews } from "/components/News/News.js";
import { makeAlgorithm } from "/components/Algorithm/Algorithm.js";
import { loadFooter } from "/components/Footer/footer.js";

import { setupKatex } from "./katex-config.js";

import { loadReferences } from "./pages/references.js";

import { makeArticle } from "/components/Course/Course.js";
import { loadHeader } from "./components/header.js";

import { initParticles } from "./particles.js";

import { initBlog } from "../../blog/blog.js";

document.addEventListener("DOMContentLoaded", () => {
  setupKatex();
  loadTableOfContents();
  initScrollDown();
  loadFooter();
  loadHeader();
  loadReferences();
  makeAlgorithm();
  makeArticle();
  createNews();
  initCarousel();

  initBlog();

  initParticles();
});

///////////////////////////

// On sélectionne le header
const header = document.getElementById("main-header-hihi");
const headerr = document.getElementById("main-header");
let lastScrollY = window.scrollY; // Mémorise la position de départ

window.addEventListener("scroll", () => {
  const currentScrollY = window.scrollY;

  // Si on est tout en haut de la page, on affiche toujours le header
  if (currentScrollY <= 0) {
    header.classList.remove("header-hidden");
    headerr.classList.remove("header-hidden");
    return;
  }

  // Si on descend (et qu'on a scrolé un peu pour éviter les faux mouvements)
  if (currentScrollY > lastScrollY && currentScrollY > 5) {
    header.classList.add("header-hidden"); // Hop, on le cache vers le haut
    headerr.classList.add("header-hidden");
  }
  // Si on remonte
  else if (currentScrollY < lastScrollY) {
    header.classList.remove("header-hidden"); // Hop, on le fait réapparaître
    headerr.classList.remove("header-hidden");
  }

  // On met à jour la position pour le prochain tour
  lastScrollY = currentScrollY;
});

// 1. On cible tous les conteneurs de filtres
const filterContainers = document.querySelectorAll(".filter-container");

filterContainers.forEach((container) => {
  // 2. On récupère les boutons de CE conteneur spécifique
  const filterButtons = container.querySelectorAll(".filter-btn");

  // 3. LA MAGIE EST ICI : On cherche la grille de projets qui est juste après ce conteneur
  // nextElementSibling va attraper la <div class="project-grid"> qui suit tes boutons
  const projectGrid = container.nextElementSibling;

  // Si pour une raison ou une autre on ne trouve pas la grille, on arrête pour éviter une erreur
  if (!projectGrid || !projectGrid.classList.contains("project-grid")) return;

  // On récupère uniquement les projets de CETTE grille
  const projects = projectGrid.querySelectorAll(".project");

  // 4. On applique ta logique de filtrage
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // A. Gérer la classe "active" uniquement sur les boutons de ce groupe
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // B. Récupérer la catégorie cliquée
      const filterValue = button.getAttribute("data-filter");

      // C. Filtrer les projets de CETTE grille uniquement
      projects.forEach((project) => {
        const projectCategories = project.getAttribute("data-category");

        if (filterValue === "all" || projectCategories.includes(filterValue)) {
          project.classList.remove("hide");
          project.classList.add("show");
        } else {
          project.classList.add("hide");
          project.classList.remove("show");
        }
      });
    });
  });
});
