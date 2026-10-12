/**
 * <folded-image> : une photo recouverte de sa version « pliée », qui s'efface pour la révéler.
 *
 *   <folded-image src="photo.webp" folds="photo-plis.webp" alt="Ce que montre la photo"></folded-image>
 *
 * - souris : les plis s'effacent au survol (CSS) ;
 * - toucher, Entrée ou Espace : ouvre / referme les plis (classe .is-open) ;
 * - les deux images sont fabriquées par _outils/origamiser.py.
 */
export class FoldedImage extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready) return;
    this.dataset.ready = "true";

    const photo = document.createElement("img");
    photo.className = "folded-photo";
    photo.src = this.getAttribute("src");
    photo.alt = this.getAttribute("alt") || "";
    photo.loading = "lazy";

    // Décorative : c'est la photo qui porte la description
    const folds = document.createElement("img");
    folds.className = "folded-folds";
    folds.src = this.getAttribute("folds");
    folds.alt = "";
    folds.loading = "lazy";

    this.replaceChildren(photo, folds);

    // Utilisable au clavier et annoncé comme un bouton à deux états
    this.tabIndex = 0;
    this.setAttribute("role", "button");
    this.setAttribute("aria-pressed", "false");

    const toggle = () => {
      const open = this.classList.toggle("is-open");
      this.setAttribute("aria-pressed", String(open));
    };

    this.addEventListener("click", toggle);
    this.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggle();
      }
    });
  }
}

if (!customElements.get("folded-image")) {
  customElements.define("folded-image", FoldedImage);
}
