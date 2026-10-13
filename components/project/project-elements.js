/**
 * Petits éléments des cartes projets :
 *   <tech-tag>, <concept-tag> : étiquettes (leur style est dans project-card.css) ;
 *   <project-category>, <project-date> : catégorie et dates, avec leur icône ;
 *   <hover-preview src="…" alt="…"> : texte avec un aperçu en image, au survol ou au clavier.
 * À charger après components/Icons/Icons.js (icônes <eye-icon>, <tag-icon>, <calendar-icon>).
 */

class TechTag extends HTMLElement { }
customElements.define('tech-tag', TechTag);

class ConceptTag extends HTMLElement { }
customElements.define('concept-tag', ConceptTag);

class MetaCategory extends HTMLElement {
    connectedCallback() {
        // 1. On récupère le texte initial et la clé de traduction du parent
        const text = this.innerHTML.trim();
        const i18nKey = this.getAttribute('data-i18n');

        if (i18nKey) {
            // 2. On reconstruit l'intérieur, en plaçant le data-i18n sur le span !
            this.innerHTML = `<tag-icon></tag-icon> <span data-i18n="${i18nKey}">${text}</span>`;

            // 3. On nettoie le parent pour que le script de traduction ne cible que le span
            this.removeAttribute('data-i18n');
        } else {
            // Comportement de secours s'il n'y a pas de traduction
            this.innerHTML = `<tag-icon></tag-icon> <span>${text}</span>`;
        }
    }
}
customElements.define('project-category', MetaCategory);

class MetaDate extends HTMLElement {
    connectedCallback() {
        // 1. On récupère le texte initial et la clé de traduction du parent
        const text = this.innerHTML.trim();
        const i18nKey = this.getAttribute('data-i18n');

        if (i18nKey) {
            // 2. On reconstruit l'intérieur, en plaçant le data-i18n sur le span !
            this.innerHTML = `<calendar-icon></calendar-icon> <span data-i18n="${i18nKey}">${text}</span>`;

            // 3. On nettoie le parent pour que le script de traduction ne cible que le span
            this.removeAttribute('data-i18n');
        } else {
            // Comportement de secours s'il n'y a pas de traduction
            this.innerHTML = `<calendar-icon></calendar-icon> <span>${text}</span>`;
        }
    }
}
customElements.define('project-date', MetaDate);

class HoverPreview extends HTMLElement {
    connectedCallback() {
        const text = this.innerHTML.trim();

        const src = this.getAttribute('src');
        const alt = this.getAttribute('alt') || 'Aperçu 3D';

        this.innerHTML = `
            <eye-icon aria-hidden="true"></eye-icon>
            ${text}
            <img src="${src}" loading="lazy" alt="${alt}">
        `;

        // Atteignable au clavier (Tab) : l'aperçu s'affiche aussi au focus.
        // Échap le referme sans déplacer le focus ; il revient au prochain survol ou focus.
        this.tabIndex = 0;
        this.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') this.classList.add('preview-dismissed');
        });
        for (const fin of ['blur', 'mouseleave']) {
            this.addEventListener(fin, () => this.classList.remove('preview-dismissed'));
        }
    }
}

// On déclare la nouvelle balise au navigateur
customElements.define('hover-preview', HoverPreview);
