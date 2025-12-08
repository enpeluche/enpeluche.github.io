document.addEventListener("DOMContentLoaded", () => {
  // Sélectionne tous les <li> dont l'id commence par "ref-"
 const refs = document.querySelectorAll('li[id^="ref-"]');

  refs.forEach(li => {
    li.innerHTML = `
      <div>
        <span class="author"></span>
        <strong></strong>
      </div>
      <a title="Accéder à l'article" href=""></a>
    `;
  });
});

async function loadReferences() {
  try {
    const response = await fetch('references.json');
    const references = await response.json();

    //on recup toutes les refs de l article
    const refs = document.querySelectorAll('a[class^=ref-]');

    const refList = [];



    refs.forEach(ref => {

      const elt = references.find(REF => REF.id === ref.className);
      
      console.log(elt.title); //on pourrait' aussi ajout'er cet' elt' dans la list'e des references a la fin
      refList.push(elt);

      ref.title=elt.title;
      ref.href="#"+ref.className;

      const spanAuthor = document.createElement('span');
      spanAuthor.className="author";
      spanAuthor.textContent=elt.authors[0].given+elt.authors[0].family;

      const year = document.createElement('strong');
      year.textContent = elt.year;


      ref.appendChild(spanAuthor);
      ref.appendChild(year);

      ref.className="cite " + ref.className;
      
    })



      // on fait maintenant la partie reference du bas

      const container = document.getElementById('main-references');

const ol = document.createElement('ol');
ol.className = "references";

      refList.forEach(rr => {

        

        const li = document.createElement('li');

        const div = document.createElement('div');

        const spanAuthor = document.createElement('span');
      spanAuthor.className="author";
      spanAuthor.textContent=rr.authors[0].given+rr.authors[0].family;

      const year = document.createElement('strong');
      year.textContent = rr.year;


      div.appendChild(spanAuthor);
      div.appendChild(year);

      li.appendChild(div);

      const aa = document.createElement('a');
      aa.title = "Accèder a l'article";
      aa.href = rr.url;
      aa.textContent = rr.title;

      li.appendChild(aa);

      li.id=rr.id;
      ol.appendChild(li);


      const h1 = document.createElement('h1');
      h1.textContent = "Références";
      
      container.appendChild(h1);

      container.appendChild(ol);
      });
  } catch (error) {
    console.log(error);
  }
}


document.addEventListener("DOMContentLoaded", loadReferences);

//<a href="#ref-hales-2015" class="cite hales-2015">
//  <span class="author"></span><strong></strong>
//</a>
// rajjouter aussi les a href aussi je rajoute la classe comme ca c'est interssant
// et voir si je peux pas faire un json des sources