const ICONS = {
    OPEN: `<svg viewBox="0 0 24 24">
                <path d="M19 5v14H5V5zm1.1-2H3.9c-.5 0-.9.4-.9.9v16.2c0 .4.4.9.9.9h16.2c.4 0 .9-.5.9-.9V3.9c0-.5-.5-.9-.9-.9M11 7h6v2h-6zm0 4h6v2h-6zm0 4h6v2h-6zM7 7h2v2H7zm0 4h2v2H7zm0 4h2v2H7z"></path>
           </svg>`,
    CLOSE: `<svg class="CloseIcon" viewBox="0 0 24 24"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>`
};

async function fetchTOC() {
    const paths = ['../toc.json', 'toc.json', '/toc.json'];
    for (const path of paths) {
        try {
            const res = await fetch(path);
            if (res.ok) return await res.json();
        } catch (e) {}
    }
    return null;
}

export async function loadFooter() {
    const tocData = await fetchTOC();
    if (!tocData) return console.error("Impossible de charger toc.json");

    const list = []
    tocData.forEach(chapter => {
        list.push({
            title: chapter.title,
            path: chapter.path
        });

        if(chapter.children) {
            chapter.children.forEach(subchapter => {
                list.push({
                    title: subchapter.title,
                    path: subchapter.path
                });
            });
        }
    }); 
        
    const pageTitleClean = document.title.toLowerCase().trim();
    const currentIndex = list.findIndex(item => item.title.toLowerCase().trim() === pageTitleClean);

    // Sortir si la page actuelle n'est pas trouvée
    if (currentIndex === -1) {
        console.warn("Titre de page non trouvé dans la liste de navigation.");
        return; 
    }

        const footerContainer = document.getElementById('main-footer');
        const nav = document.createElement('nav');

        let divNext = null;
        let divPrevious = null;

        // --- Déclaration CONDITIONNELLE de divNext ---
        if (currentIndex < list.length - 1) {
            const nextChapter = list[currentIndex + 1];
            
            divNext = document.createElement('div');
            divNext.className="next";
            
            const aNext = document.createElement('a');
            aNext.href = nextChapter.path; // Important: Ajouter le lien ici
            aNext.innerHTML = 'Chapitre suivant <svg class="ArrowForwardIcon" viewBox="0 0 24 24"> <path d="m12 4-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"></path> </svg>';
            
            const pNext = document.createElement('p');
            pNext.textContent = nextChapter.title; // L'élément existe, donc .title est sûr

            divNext.appendChild(aNext);
            divNext.appendChild(pNext);
        }

        // --- Déclaration CONDITIONNELLE de divPrevious ---
        if (currentIndex > 0) {
            const previousChapter = list[currentIndex - 1];

            divPrevious = document.createElement('div');
            divPrevious.className="previous";

            const aPrevious = document.createElement('a');
            aPrevious.href = previousChapter.path; // Important: Ajouter le lien ici
            aPrevious.innerHTML = '<svg class="arrowBackwardIcon" viewBox="0 0 24 24" transform="matrix(-1,0,0,1,0,0)"> <path d="m12 4-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"></path> </svg> Chapitre précédent';
            
            const pPrevious = document.createElement('p');
            pPrevious.textContent = previousChapter.title; // L'élément existe, donc .title est sûr

            divPrevious.appendChild(aPrevious);
            divPrevious.appendChild(pPrevious);
        }

        

        if(currentIndex === 0) {
            // Seul divNext est non-null
            nav.style.justifyContent = "flex-end";
            if (divNext) nav.appendChild(divNext);

        }
        else if(currentIndex === list.length - 1) {
            // Seul divPrevious est non-null
            nav.style.justifyContent = "flex-start";
            if (divPrevious) nav.appendChild(divPrevious);

        }
        else {
            nav.appendChild(divPrevious);
            nav.appendChild(divNext);
        }
            
        footerContainer.appendChild(nav);

}
//126 lignes de code moche

/*
<nav>
    <div class="previous">
        <a href="undefined">
            <svg class="arrowBackwardIcon" viewBox="0 0 24 24" transform="matrix(-1,0,0,1,0,0)">
                <path d="m12 4-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"></path>
            </svg>
            Chapitre précédent
        </a>
        <p>Introduction</p>
    </div>
    <div class="next">
        <a href="undefined">
            Chapitre suivant
                <svg class="ArrowForwardIcon" viewBox="0 0 24 24">
                    <path d="m12 4-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"></path>
                </svg>
        </a>
        &<p>Découverte</p>
    </div>
</nav>*/