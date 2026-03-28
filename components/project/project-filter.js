const allFilterButtons = document.querySelectorAll(".filter-btn");

allFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const currentSection = button.closest("section");

    const sectionButtons = currentSection.querySelectorAll(".filter-btn");
    const sectionProjects = currentSection.querySelectorAll(".project");

    sectionButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    const filterValue = button.getAttribute("data-filter");

    sectionProjects.forEach((project) => {
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
