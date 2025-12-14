export async function loadFooter() {
    try {
        const response = await fetch('toc.json');
        const toc = await response.json();

        const list = [];

        toc.forEach(chapter => {

            list.push({
                title: chapter.title,
                filename: chapter.filename
            });

            if(chapter.children) {
                chapter.children.forEach(subchapter => {
                    list.push({
                        title: subchapter.title,
                        filename: subchapter.filename
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
            aNext.href = nextChapter.filename; // Important: Ajouter le lien ici
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
            aPrevious.href = previousChapter.filename; // Important: Ajouter le lien ici
            aPrevious.innerHTML = '<svg class="arrowBackwardIcon" viewBox="0 0 24 24" transform="matrix(-1,0,0,1,0,0)"> <path d="m12 4-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"></path> </svg> Chapitre précédent';
            
            const pPrevious = document.createElement('p');
            pPrevious.textContent = previousChapter.title; // L'élément existe, donc .title est sûr

            divPrevious.appendChild(aPrevious);
            divPrevious.appendChild(pPrevious);
        }

        
        // --- LOGIQUE D'AFFICHAGE (Qui fonctionne maintenant) ---

        // Cas 1 : Début (index 0)
        if(currentIndex === 0) {
            // Seul divNext est non-null
            nav.style.justifyContent = "flex-end";
            if (divNext) nav.appendChild(divNext);

        }
        // Cas 2 : Fin (dernier index)
        else if(currentIndex === list.length - 1) {
            // Seul divPrevious est non-null
            nav.style.justifyContent = "flex-start";
            if (divPrevious) nav.appendChild(divPrevious);

        }
        // Cas 3 : Milieu
        else {
            nav.appendChild(divPrevious);
            nav.appendChild(divNext);
        }
            
        footerContainer.appendChild(nav);

    } catch (error) {
        // Affiche l'erreur en console pour le débogage, mais n'arrête pas tout silencieusement
        console.error("Erreur critique dans loadFooter :", error); 
    }
}
