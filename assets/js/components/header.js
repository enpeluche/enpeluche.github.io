export function loadHeader() {
    fetch("/includes/main-header.html")

    .then(response => response.text())
    .then(data => {  
        const header = document.getElementById('main-header');
        if(!header) return;
        header.innerHTML = data;
    })
    .catch(error => {
        console.error("Erreur lors du chargement de l'en-tête :", error);
    });
}


