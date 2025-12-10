async function loadReferences() {
	try {
    	// Await network response, then await JSON body parsing.
    	const response = await fetch('references.json');
    	const references = await response.json();

    	// La list'e des different'es references fait'e dans l art'icle, unicit'e
    	const refList = [];

    	// Retrieve all reference links from the article.
    	const refs = document.querySelectorAll('a[class^=ref-]');

    	// je vais devoir changer les noms de variables
    
    	// On parcourt toutes les references t'rouvÉE from t'he article
    	refs.forEach(ref => {
			const elt = references.find(REF => REF.id === ref.className);
      
      		// if elt is not in refList we add it
      		if (!refList.includes(elt)) {
        		refList.push(elt);
      		}

      		ref.title=elt.title;
      		ref.href="#"+ref.className;


      		const spanAuthor = document.createElement('span');
      		spanAuthor.className="author";
      		spanAuthor.textContent=elt.authors[0].given[0] +". "+elt.authors[0].family;

      		
			// <strong> elt.year </strong> 
			const year = document.createElement('strong');
      		year.textContent = elt.year;


      		ref.appendChild(spanAuthor);
      		ref.appendChild(year);

      		ref.className="cite " + ref.className;
    	})

		createReferencesList(refList);

      
  	} catch (error) {
    	console.log(error);
  	}
}

function createReferencesList(refList) {
		// on fait maintenant la partie reference du bas, on la creer que si on a des t'rucs a cit'er
		//pourquoi pas le decouper en une deuxieme fonct'ion
     	if(refList.length>0) {

			const container = document.getElementById('article');
			
			const divReferences = document.createElement('div');
			divReferences.id = 'main-references';

			hr = document.createElement('hr');

			divReferences.appendChild(hr);

	    	//<h1>Références</h1>
        	const h1 = document.createElement('h1');
        	h1.textContent = "Références";
        
        	divReferences.appendChild(h1);

			//on creer la list'e ordonnee des references

        	// <ol class="references"></ol>
        	const ol = document.createElement('ol');
        	ol.className = "references"; 
			ol.style = "list-style-type: none;";
			
			// on construit chaque element de la liste
			refList.forEach(rr => {
        		const li = document.createElement('li');

        		const div = document.createElement('div');

				// <span class="author"> </span>

				//on parcourt' t'ous les auteurs

				rr.authors.forEach(author => {
					const spanAuthor = document.createElement('span');
      				spanAuthor.className="author";

					// first' let't'er of first' name + familyè name
      				spanAuthor.textContent=author.given[0]+". "+ author.family;

					div.appendChild(spanAuthor);
				});
        		

      			const year = document.createElement('strong');
      			year.textContent = rr.year;


      			
      			div.appendChild(year);

      			li.appendChild(div);

      			const aa = document.createElement('a');
      			aa.title = "Accèder a l'article";
      			aa.href = rr.url;
      			aa.textContent = rr.title;

      			li.appendChild(aa);

      			li.id=rr.id;
				li.style = "list-style-type: none;";
				
				
				li.className=rr.type;
      			ol.appendChild(li);
      
      			
      		});
			divReferences.appendChild(ol);
			container.appendChild(divReferences);
      	}      
}

document.addEventListener("DOMContentLoaded", loadReferences);