async function loadTableOfContents() {
    try {
        const response = await fetch('/academic-works/lattice-reduction/toc.json');
        const toc = await response.json();

        const container = document.getElementById('toc');
        
        const ul = document.createElement('ul');

        

        toc.forEach(toc => {
            const numDiv = document.createElement('div');
        numDiv.className = 'num';
            const li = document.createElement('li');

            const chapterDiv = document.createElement('div');
            chapterDiv.className = 'chapter';

            chapterDiv.appendChild(numDiv);

            const h3 = document.createElement('h3');
            h3.textContent = toc.title;

            chapterDiv.appendChild(h3);

            li.appendChild(chapterDiv);

            const subList = document.createElement('ul');
            const chapterContentDiv = document.createElement('div');
            chapterContentDiv.className = 'chapter-content';

            toc.children.forEach(children => {
                const snumDiv = document.createElement('div');
        snumDiv.className = 'num';
                const subLi = document.createElement('li');
                subLi.appendChild(snumDiv);

                const h4 = document.createElement('h4');

                const a = document.createElement('a');
                a.href = children.filename;
                a.title = children.title;
                a.textContent = children.title;

                h4.appendChild(a);

                subLi.appendChild(h4);
                subList.appendChild(subLi);       
            });

            
            chapterContentDiv.appendChild(subList);
            li.appendChild(chapterContentDiv);

            ul.appendChild(li);
        });

        container.appendChild(ul);
    } catch (error) {
        console.error("Erreur lors de la génération de la TOC :", error);
    }
}

document.addEventListener("DOMContentLoaded", loadTableOfContents);