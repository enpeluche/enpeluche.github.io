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
 * L'interrupteur jour/nuit est toujours affiché ; il s'appuie sur assets/js/theme.js,
 * à charger avant ce fichier.
 *
 * Onglet courant (barre violette) :
 *   - data-page="blog" : actif quand l'URL commence par /blog
 *   - data-spy="id1 id2" : actif quand l'une de ces sections est au milieu de l'écran
 */

const CHEVRON_ICON = `
  <svg aria-hidden="true" viewBox="0 0 24 24" width="30" height="30">
    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
  </svg>`;

// Interrupteur jour/nuit : role="switch" + aria-checked (coché = nuit), logique dans theme.js
const THEME_TOGGLE = `
  <li class="nav-theme">
    <button type="button" class="theme-toggle" role="switch" aria-checked="false">
      <span class="visually-hidden" data-i18n="theme_toggle_label">Mode nuit</span>
      <span class="theme-toggle-knob" aria-hidden="true"></span>
      <svg class="theme-icon theme-icon-sun" aria-hidden="true" viewBox="0 0 24 24">
        <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z" />
      </svg>
      <svg class="theme-icon theme-icon-moon" aria-hidden="true" viewBox="0 0 24 24">
        <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z" />
      </svg>
    </button>
  </li>`;

const LANG_TOGGLE = `
  <li class="nav-lang">
    <input type="checkbox" id="lang-toggle" class="lang-check" role="switch" autocomplete="off"
      aria-label="English version (version anglaise)">
    <label for="lang-toggle" class="lang-label">
      <span class="slider"></span>
      <span class="lang-text">FR</span>
      <span class="lang-text">EN</span>
    </label>
  </li>`;

function headerTemplate(withLangToggle) {
  return `
    <a class="skip-link" href="#contenu" data-i18n="skip_link">Aller au contenu</a>
    <header id="main-header">
      <nav aria-label="Navigation principale">
        <ul>
          <li>
            <a class="nav-logo" href="/#homepage" title="Accueil Lucas Noirot (Petit)">
              <img class="image-rotative" src="/assets/img/logo/logo.png"
                title="Logo de Lucas Noirot (Petit) - étoile à 8 branches"
                alt="Accueil – Lucas Noirot (Petit)">
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

          ${THEME_TOGGLE}

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

    // Sur l'accueil, les liens du menu (/#phd…) deviennent de simples ancres (#phd) : l'adresse y porte
    // ?lang=…, et un lien /#phd la changerait, ce qui rechargerait toute la page au lieu de défiler
    // jusqu'à la section. Sur les autres pages (blog), ils mènent toujours à l'accueil.
    if (["/", "/index.html"].includes(window.location.pathname)) {
      this.querySelectorAll('a[href^="/#"]').forEach((link) => {
        link.setAttribute("href", link.getAttribute("href").slice(1));
      });
    }

    this.initDropdown();
    this.initThemeToggle();

    // Au clavier, le menu réapparaît dès qu'un de ses éléments reçoit le focus
    // (il se masque quand on descend dans la page : voir main.js)
    const header = this.querySelector("#main-header");
    header.addEventListener("focusin", () => header.classList.remove("header-hidden"));

    // Les sections de la page ne sont pas encore lues par le navigateur à ce stade
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        this.initSkipLink();
        this.initCurrentTab();
      });
    } else {
      this.initSkipLink();
      this.initCurrentTab();
    }
  }

  /** « Aller au contenu » : premier élément atteint avec Tab, il saute le menu et mène au <main>. */
  initSkipLink() {
    const main = document.querySelector("main");
    const link = this.querySelector(".skip-link");

    if (!main) {
      link.remove();
      return;
    }

    if (!main.id) main.id = "contenu";
    main.tabIndex = -1; // pour que le focus clavier aille bien au contenu, et pas seulement l'affichage
    link.href = `#${main.id}`;
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
      if (event.key !== "Escape") return;
      // Le focus était dans le menu, qui va disparaître : on le rend au bouton « Projets »
      if (dropdown.querySelector(".nav-dropdown-menu").contains(document.activeElement)) toggle.focus();
      setOpen(false);
    });

    dropdown.addEventListener("focusout", (event) => {
      if (!dropdown.contains(event.relatedTarget)) setOpen(false);
    });
  }

  /** Interrupteur jour/nuit (theme.js doit être chargé avant ce fichier). */
  initThemeToggle() {
    const toggle = this.querySelector(".theme-toggle");

    if (typeof window.setTheme !== "function") {
      toggle.closest("li").remove();
      return;
    }

    const sync = () => {
      toggle.setAttribute("aria-checked", String(window.getTheme() === "dark"));
    };

    toggle.addEventListener("click", () => {
      window.setTheme(window.getTheme() === "dark" ? "light" : "dark");
    });

    // Le thème peut aussi changer sans clic (réglage du système modifié)
    document.addEventListener("themechange", sync);
    sync();
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
