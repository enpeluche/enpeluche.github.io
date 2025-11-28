async function loadTableOfContents() {
    try {
        const response = await fetch('/academic-works/lattice-reduction/toc.json');
        const toc = await response.json();

        const container = document.getElementById('toc');
        
        const ul = document.createElement('ul');

        toc.forEach(toc => {
            const li = document.createElement('li');

            const chapterDiv = document.createElement('div');
            chapterDiv.className = 'chapter';

            const h3 = document.createElement('h3');
            h3.textContent = toc.title;

            chapterDiv.appendChild(h3);

            li.appendChild(chapterDiv);

            

            ul.appendChild(li);
        });

        container.appendChild(ul);
    } catch (error) {
        console.error("Erreur lors de la génération de la TOC :", error);
    }
}

document.addEventListener("DOMContentLoaded", loadTableOfContents);