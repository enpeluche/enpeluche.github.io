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


document.addEventListener("DOMContentLoaded", () => {
   const refs = document.querySelectorAll('a[class^=cite]');
   
   refs.forEach(a => {
    a.innerHTML = `
        <span class="author"></span>
        <strong></strong>
    `;
   });
});

//<a href="#ref-hales-2015" class="cite hales-2015">
//  <span class="author"></span><strong></strong>
//</a>
// rajjouter aussi les a href aussi je rajoute la classe comme ca c'est interssant
// et voir si je peux pas faire un json des sources