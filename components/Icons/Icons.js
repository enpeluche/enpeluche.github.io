/**
 * Icônes du site, dessinées en SVG.
 *
 * Conventions (pour toute nouvelle icône) :
 *   - aria-hidden="true" et focusable="false" sur le <svg>, fill="currentColor", grille de 24 × 24 ;
 *   - l'icône est décorative : le lien ou le bouton qui la contient doit avoir un texte
 *     (ou un aria-label, ex. aria-label="Mon profil LinkedIn").
 *
 * <ui-icon name="github"> : icône générique, choisie dans iconPaths par son nom.
 * <right-arrow>, <eye-icon> : flèche des cartes projets, œil des aperçus.
 * <tag-icon>, <calendar-icon> : emplacements remplacés par une étiquette ou un calendrier
 *   (utilisés par <project-category> et <project-date>, voir project-elements.js).
 */

const iconPaths = {
    email: 'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
    institution: 'M4 10v7h3v-7H4zm6 0v7h3v-7h-3zM2 22h19v-3H2v3zm14-12v7h3v-7h-3zm-4.5-9L2 6v2h19V6l-9.5-5z',
    linkedin: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z',
    docker: 'M334,110.1c-8.3-5.6-30.2-8-46.1-3.7-.9-15.8-9-29.2-24-40.8l-5.5-3.7-3.7,5.6c-7.2,11-10.3,25.7-9.2,39,.8,8.2,3.7,17.4,9.2,24.1-20.7,12-39.8,9.3-124.3,9.3H0c-.4,19.1,2.7,55.8,26,85.6,2.6,3.3,5.4,6.5,8.5,9.6,19,19,47.6,32.9,90.5,33,65.4,0,121.4-35.3,155.5-120.8,11.2.2,40.8,2,55.3-26,.4-.5,3.7-7.4,3.7-7.4l-5.5-3.7h0ZM85.2,92.7h-36.7v36.7h36.7v-36.7ZM132.6,92.7h-36.7v36.7h36.7v-36.7ZM179.9,92.7h-36.7v36.7h36.7v-36.7ZM227.3,92.7h-36.7v36.7h36.7v-36.7ZM37.8,92.7H1.1v36.7h36.7v-36.7ZM85.2,46.3h-36.7v36.7h36.7v-36.7ZM132.6,46.3h-36.7v36.7h36.7v-36.7ZM179.9,46.3h-36.7v36.7h36.7v-36.7ZM179.9,0h-36.7v36.7h36.7V0',
    github: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z',
    linux: 'M11.97 24a2.21 2.21 0 0 1-1.3-.43c-.7-.52-1.27-1.18-2.04-1.63a7.41 7.41 0 0 1-2.98-3.32c-.37-.8-.68-1.64-1-2.47a2.53 2.53 0 0 1-.03-.38c0-.66.08-1.31.25-1.94.3-.96.67-1.89.92-2.86.3-1.07.48-2.18.57-3.29.14-1.35.45-2.65 1.2-3.8A7.8 7.8 0 0 1 11.23.63c.53-.25 1.1-.4 1.68-.49.33-.06.66-.08.98-.05.8.07 1.55.3 2.27.65 1.15.54 2.06 1.34 2.8 2.33 1 1.3 1.57 2.76 1.83 4.35.19 1.07.26 2.16.2 3.24a13.36 13.36 0 0 1-.22 2.32c-.17.91-.4 1.8-.68 2.68-.2.62-.47 1.23-.73 1.84-.42 1-.95 1.93-1.62 2.77a7.51 7.51 0 0 1-2.73 2.1 4.5 4.5 0 0 1-1.58.48A4.18 4.18 0 0 1 11.97 24zm4.4-11.27c.1-.48.2-.95.27-1.44.1-1.08.17-2.16.15-3.25a8.7 8.7 0 0 0-.64-3.53c-.32-.82-.82-1.52-1.4-2.16-.76-.8-1.7-1.3-2.78-1.5-.7-.14-1.4-.1-2.08.1-1.18.33-2.16.98-2.92 1.95a8.53 8.53 0 0 0-1.63 3.4 16.3 16.3 0 0 0-.4 3.49c-.06.74-.08 1.48-.05 2.22.04 1.05.2 2.08.38 3.12.18.99.39 1.98.74 2.92.54 1.4 1.33 2.64 2.45 3.65 1.18 1.04 2.58 1.6 4.18 1.62 1.16 0 2.22-.38 3.14-1.07 1.2-.9 2.14-2.04 2.78-3.41.52-1.09.9-2.22 1.17-3.39.22-.89.4-1.8.64-2.7zm-6.1-2.02c.08.62.1 1.25.1 1.88 0 .4 0 .8-.05 1.2-.08.6-.2 1.19-.38 1.77a2.53 2.53 0 0 1-1.18 1.44c-.7.36-1.43.3-2.08-.14a2.22 2.22 0 0 1-1-1.84c-.05-.82-.04-1.64.12-2.45.18-.87.45-1.72.77-2.55.27-.69.65-1.3 1.17-1.8.68-.64 1.5-.96 2.46-.92.2 0 .4.04.57.14a1.86 1.86 0 0 1 .84 1.4c.15.65.23 1.33.26 2.01v.05zm5.55-.18c.03.65.04 1.3.06 1.96 0 .42-.04.83-.1 1.25-.09.6-.2 1.18-.4 1.75a2.54 2.54 0 0 1-1.2 1.43c-.7.35-1.44.28-2.08-.16a2.2 2.2 0 0 1-.98-1.8c-.05-.8-.04-1.63.1-2.44.18-.88.45-1.72.78-2.55.26-.68.64-1.3 1.15-1.8.68-.64 1.5-.95 2.44-.92.2 0 .4.04.58.14a1.86 1.86 0 0 1 .83 1.38c.16.65.24 1.32.26 2v.04zm-8.8 6.57c-.52-.15-1-.28-1.46-.42-.65-.2-1.28-.42-1.88-.74a1.76 1.76 0 0 0-2.34.8 1.77 1.77 0 0 0 .76 2.37c1.12.63 2.34.98 3.6 1.16.7.1 1.42.12 2.13.06a3.68 3.68 0 0 0 2.2-.74 1.82 1.82 0 0 0 .66-1.5c-.04-.88-.5-1.4-1.3-1.63a8.95 8.95 0 0 0-2.37-.22zm7.6 0c-.54.1-1.07.2-1.6.3a8.4 8.4 0 0 0-2.26.54c-.75.3-1.12.86-1.1 1.63a1.82 1.82 0 0 0 1 1.63c.6.32 1.25.54 1.9.7a9.23 9.23 0 0 0 4.14-.1c.64-.17 1.26-.4 1.85-.7a1.78 1.78 0 0 0 .9-2.38 1.76 1.76 0 0 0-2.3-.85 10.45 10.45 0 0 0-2.52.92v-.03z',
};

class UiIcon extends HTMLElement {
    connectedCallback() {
        const iconName = this.getAttribute('name');
        const pathData = iconPaths[iconName];

        if (pathData) {
            this.innerHTML = `
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" width="100%" height="100%" fill="currentColor">
                    <path d="${pathData}"></path>
                </svg>
                `;
        } else {
            console.warn(`L'icône "${iconName}" n'existe pas.`);
        }
    }
}

customElements.define('ui-icon', UiIcon);

document.addEventListener("DOMContentLoaded", function () {

    const tagIconSVG = `
    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                        fill="none" stroke="var(--secondary-text-color)" stroke-width="3" stroke-linecap="round"
                        stroke-linejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>`;


    const sgg = `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                        fill="none" stroke="var(--secondary-text-color)" stroke-width="3" stroke-linecap="round"
                        stroke-linejoin="round">
                        <path
                            d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z">
                        </path>
                        <line x1="7" y1="7" x2="7.01" y2="7"></line>
                    </svg>`;

    const placeholders = document.querySelectorAll('calendar-icon');


    placeholders.forEach(el => {
        el.outerHTML = tagIconSVG;
    });



    const ddd = document.querySelectorAll('tag-icon');


    ddd.forEach(el => {
        el.outerHTML = sgg;
    });
});

class RightArrow extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <svg aria-hidden="true" width="24" viewBox="0 0 24 24">
                            <path d="m12 4-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"></path>
                        </svg>
            `;
    }
}

class Eye extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
        </svg>
        `;
    }
}

customElements.define('eye-icon', Eye);
customElements.define('right-arrow', RightArrow);
