/**
 * <site-header> : header commun à toutes les pages du site.
 *
 * À charger en script classique dans le <head> (ni defer, ni module) : le header est alors
 * construit dès que le navigateur lit la balise, avant DOMContentLoaded. translate.js trouve
 * ainsi les data-i18n du menu et le bouton de langue (c'est ce qui manquait avec fetch()).
 *
 * Attribut :
 *   lang-toggle : affiche le bouton FR/EN (uniquement sur les pages traduites)
 *
 * Onglet courant (barre violette) :
 *   - data-page="blog" : actif quand l'URL commence par /blog
 *   - data-spy="id1 id2" : actif quand l'une de ces sections est au milieu de l'écran
 */

const CHEVRON_ICON = `
  <svg aria-hidden="true" viewBox="0 0 24 24" width="30" height="30">
    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
  </svg>`;

const LANG_TOGGLE = `
  <li class="nav-lang">
    <input type="checkbox" id="lang-toggle" class="lang-check" autocomplete="off">
    <label for="lang-toggle" class="lang-label" aria-label="Changer de langue / Switch language">
      <span class="slider"></span>
      <span class="lang-text">FR</span>
      <span class="lang-text">EN</span>
    </label>
  </li>`;

function headerTemplate(withLangToggle) {
  return `
    <header id="main-header">
      <nav aria-label="Navigation principale">
        <ul>
          <li>
            <a href="/#homepage" title="Accueil Lucas Noirot (Petit)">
              <img class="image-rotative" src="/assets/img/logo/logo.png"
                title="Logo de Lucas Noirot (Petit) - étoile à 8 branches"
                alt="Logo de Lucas Noirot (Petit) - étoile à 8 branches">
            </a>
          </li>

          <li>
            <a class="nav-link" href="/#phd" data-spy="phd" data-i18n="nav_phd">Thèse</a>
          </li>

          <li>
            <a class="nav-link" href="/#cv" data-spy="cv">CV</a>
          </li>

          <li class="nav-dropdown">
            <button class="nav-link nav-dropdown-toggle" type="button" data-spy="projects projects-more"
              aria-expanded="false" aria-controls="nav-projects-menu">
              ${CHEVRON_ICON}
              <span data-i18n="section_projects_title">Projets</span>
            </button>

            <div class="nav-dropdown-menu" id="nav-projects-menu">
              <a href="/#dev" data-i18n="research_engineering">Recherche & Ingénierie</a>
              <a href="/#acad" data-i18n="additional_projects">Projets complémentaires</a>
            </div>
          </li>

          <li>
            <a class="nav-link" href="/blog/" data-page="blog">Blog</a>
          </li>

          ${withLangToggle ? LANG_TOGGLE : ""}
        </ul>
      </nav>
    </header>`;
}

class SiteHeader extends HTMLElement {
  connectedCallback() {
    // connectedCallback est rappelé si l'élément est déplacé : on ne construit qu'une fois
    if (this.dataset.ready) return;
    this.dataset.ready = "true";

    this.innerHTML = headerTemplate(this.hasAttribute("lang-toggle"));

    this.initDropdown();

    // Les sections de la page ne sont pas encore lues par le navigateur à ce stade
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.initCurrentTab());
    } else {
      this.initCurrentTab();
    }
  }

  /** Menu "Projets" : ouverture au clic/toucher (le survol reste géré en CSS sur ordinateur). */
  initDropdown() {
    const dropdown = this.querySelector(".nav-dropdown");
    const toggle = dropdown.querySelector(".nav-dropdown-toggle");

    const setOpen = (open) => {
      dropdown.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    };

    toggle.addEventListener("click", () => {
      setOpen(!dropdown.classList.contains("is-open"));
    });

    // On referme après avoir choisi une destination, en cliquant ailleurs, ou avec Échap
    dropdown.querySelectorAll(".nav-dropdown-menu a").forEach((link) => {
      link.addEventListener("click", () => setOpen(false));
    });

    document.addEventListener("click", (event) => {
      if (!dropdown.contains(event.target)) setOpen(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setOpen(false);
    });
  }

  /** Barre violette sous l'onglet de la page ou de la section en cours. */
  initCurrentTab() {
    const setCurrent = (item, value = "true") => {
      this.querySelectorAll(".nav-link").forEach((link) => {
        link.classList.remove("is-current");
        link.removeAttribute("aria-current");
      });

      if (!item) return;

      item.classList.add("is-current");
      item.setAttribute("aria-current", value);
    };

    // Pages à part entière : on se fie à l'URL
    const pageLink = [...this.querySelectorAll("[data-page]")].find((link) =>
      window.location.pathname.startsWith(`/${link.dataset.page}`),
    );

    if (pageLink) {
      setCurrent(pageLink, "page");
      return;
    }

    // Page d'accueil : l'onglet suit la section qui traverse le milieu de l'écran
    const navItemBySection = new Map();

    this.querySelectorAll("[data-spy]").forEach((item) => {
      item.dataset.spy.split(" ").forEach((id) => {
        const section = document.getElementById(id);
        if (section) navItemBySection.set(section, item);
      });
    });

    if (navItemBySection.size === 0) return;

    const visibleSections = new Set();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visibleSections.add(entry.target);
          else visibleSections.delete(entry.target);
        });

        const [section] = visibleSections;
        setCurrent(section ? navItemBySection.get(section) : null);
      },
      // Ligne de détection : le milieu vertical de l'écran
      { rootMargin: "-50% 0px -50% 0px" },
    );

    navItemBySection.forEach((_, section) => observer.observe(section));
  }
}

customElements.define("site-header", SiteHeader);
