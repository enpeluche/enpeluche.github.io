// On sélectionne tous les boutons de la page
const allFilterButtons = document.querySelectorAll(".filter-btn");

allFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // 1. On trouve la section parente EXACTE de ce bouton cliqué
    const currentSection = button.closest("section");

    // 2. On isole les éléments qui n'appartiennent QU'À cette section
    const sectionButtons = currentSection.querySelectorAll(".filter-btn");
    const sectionProjects = currentSection.querySelectorAll(".project");

    // 3. Gestion du bouton "active" (seulement pour ce groupe)
    sectionButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    // 4. Filtrage (seulement pour cette grille)
    const filterValue = button.getAttribute("data-filter");

    sectionProjects.forEach((project) => {
      // Sécurité : on s'assure que l'attribut existe pour éviter une erreur
      const projectCategories = project.getAttribute("data-category") || "";

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
