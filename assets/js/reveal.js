// Apparition progressive des blocs .reveal quand ils entrent à l'écran (désactivée si l'appareil
// demande de réduire les animations : voir animation.css). Les blocs d'un même parent apparaissent
// l'un après l'autre, à 0,1 s d'intervalle.
(() => {
  const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
          if (entry.isIntersecting) {

              // 1. On identifie le parent direct de l'élément visible
              const parent = entry.target.parentElement;

              // 2. On récupère TOUS les éléments '.reveal' qui sont dans ce même parent
              // Cela nous permet de savoir combien de "frères" il a
              const siblings = parent.querySelectorAll('.reveal');

              // 3. On trouve le numéro (index) de notre élément actuel parmi ses frères
              // Array.from() transforme la liste en tableau pour utiliser .indexOf()
              const index = Array.from(siblings).indexOf(entry.target);

              // 4. On applique le délai basé sur sa position réelle dans le HTML
              // Le 1er élément du bloc aura 0s, le 2ème 0.1s, etc.
              entry.target.style.transitionDelay = `${index * 0.1}s`;

              entry.target.classList.add('active');

              // On arrête d'observer pour la performance
              observer.unobserve(entry.target);
          }
      });
  }, {
      threshold: 0.1
  });

  const hiddenElements = document.querySelectorAll('.reveal');
  hiddenElements.forEach((el) => observer.observe(el));
})();
