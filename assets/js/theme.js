/**
 * Thème jour / nuit.
 *
 * À charger en script classique dans le <head>, avant le <body> : le thème est posé sur
 * <html data-theme="..."> avant le premier affichage, donc pas de flash blanc en mode nuit.
 *
 * Choix du thème : celui mémorisé par le visiteur (interrupteur du header), sinon le réglage
 * clair/sombre de son système, suivi en direct tant qu'il n'a rien choisi.
 *
 * Chaque changement émet l'événement "themechange" sur document (header, particules…).
 */
(function () {
  const STORAGE_KEY = "app_theme";
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  // localStorage peut être indisponible (navigation privée stricte, stockage bloqué)
  function savedTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null;
    }
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    document.dispatchEvent(new CustomEvent("themechange", { detail: { theme } }));
  }

  window.getTheme = () => document.documentElement.dataset.theme;

  window.setTheme = (theme) => {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      // Pas de mémorisation possible : le thème s'applique quand même pour cette page
    }
    applyTheme(theme);
  };

  applyTheme(savedTheme() || (systemPrefersDark.matches ? "dark" : "light"));

  systemPrefersDark.addEventListener("change", (event) => {
    if (!savedTheme()) applyTheme(event.matches ? "dark" : "light");
  });
})();
