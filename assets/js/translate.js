const traductions = {
    fr: {
        welcome: "Bonjour, je suis",
        education_master_degree: "Titulaire d'un Master 2 en Algorithmie & Mathématiques."
    },
    en: {
        welcome: "Hello, I am",
        education_master_degree: "Master's Degree in Algorithmics & Mathematics."
    }
};

// La fonction magique
function changerLangue(langue) {
    // On sélectionne tous les éléments qui ont l'attribut data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const cle = element.getAttribute('data-i18n');
        // On remplace le texte par celui du dictionnaire
        element.textContent = traductions[langue][cle];
    });
}

// Utilisation avec ton switch
monCheckbox.addEventListener('change', function() {
    if(this.checked) {
        changerLangue('en');
    } else {
        changerLangue('fr');
    }
});