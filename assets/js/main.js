import { initScrollDown } from "/components/ScrollDown/ScrollDown.js";
import { initCarousel } from "/components/Carousel/Carousel.js";

import { setupKatex } from "../../shared-assets/katex-config.js";

import { loadReferences } from "./pages/references.js";

import { loadHeader } from "./components/header.js";

import { initParticles } from "./particles.js";

import { initBlog } from "../../blog/blog.js";

document.addEventListener("DOMContentLoaded", () => {
  setupKatex();
  initScrollDown();
  loadHeader();
  loadReferences();
  initCarousel();

  initBlog();

  initParticles();
});

const header = document.getElementById("main-header-hihi");
const headerr = document.getElementById("main-header");
let lastScrollY = window.scrollY;

window.addEventListener("scroll", () => {
  const currentScrollY = window.scrollY;

  if (currentScrollY <= 0) {
    header.classList.remove("header-hidden");
    headerr.classList.remove("header-hidden");
    return;
  }

  if (currentScrollY > lastScrollY && currentScrollY > 5) {
    header.classList.add("header-hidden");
    headerr.classList.add("header-hidden");
  } else if (currentScrollY < lastScrollY) {
    header.classList.remove("header-hidden");
    headerr.classList.remove("header-hidden");
  }

  lastScrollY = currentScrollY;
});

const filterContainers = document.querySelectorAll(".filter-container");

filterContainers.forEach((container) => {
  const filterButtons = container.querySelectorAll(".filter-btn");

  const projectGrid = container.nextElementSibling;

  if (!projectGrid || !projectGrid.classList.contains("project-grid")) return;

  const projects = projectGrid.querySelectorAll(".project");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const filterValue = button.getAttribute("data-filter");

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
