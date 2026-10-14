// Pages de recherche interactives (/recherche/…) : la carte des notions d'équité.

const CARTE = "/recherche/equite/";
const titre = () => document.querySelector("#detail h2").textContent.trim();

module.exports = async ({ base, ok, nouvellePage, attendre }) => {
  const p = await nouvellePage({ viewport: { width: 1440, height: 1000 } });
  await p.goto(base + CARTE, { waitUntil: "networkidle" });

  // État de départ
  ok((await p.evaluate(titre)) === "EFX", "carte : EFX sélectionnée au départ");
  ok(await attendre(p, () => document.querySelectorAll("#detail .def .katex").length > 0), "carte : définition mise en forme par KaTeX");
  ok(await p.evaluate(() => document.querySelectorAll("#map g.node").length === 19 && document.querySelectorAll(".srow").length === 8), "carte : 19 notions et 8 échelles α affichées");

  // Disposition sur grand écran : échelles à droite du diagramme (même hauteur, défilement interne), détail dessous
  const dispo = await p.evaluate(() => {
    const [d, a, t] = [".diagram", ".alpha", ".detail"].map((s) => document.querySelector(s).getBoundingClientRect());
    const colonne = document.querySelector(".alpha");
    return {
      aDroite: a.left >= d.right && Math.abs(a.top - d.top) < 2 && Math.abs(a.height - d.height) < 2,
      defile: colonne.scrollHeight > colonne.clientHeight && getComputedStyle(colonne).overflowY === "auto",
      detailDessous: t.top >= d.bottom && Math.abs(t.left - d.left) < 2 && Math.abs(t.right - a.right) < 2,
    };
  });
  ok(dispo.aDroite, "carte : les échelles α sont à droite du diagramme, à la même hauteur");
  ok(dispo.defile, "carte : la colonne des échelles défile à l'intérieur");
  ok(dispo.detailDessous, "carte : le détail de la notion est sous le diagramme, sur toute la largeur");
  ok(await p.evaluate(() => [...document.querySelectorAll(".srow:not(.repliee)")].map((r) => r.dataset.k).join() === "EFX"), "colonne étroite : seule l'échelle de la notion choisie (EFX) est dépliée");
  ok(await p.evaluate(() => document.querySelector(".alpha").scrollTop === 0), "au chargement, la colonne des échelles commence en haut");

  // Clic sur une notion : détail et surlignage des notions plus fortes / plus faibles
  await p.click('#map g[data-k="MMS"] rect.box');
  ok((await p.evaluate(titre)) === "MMS", "clic sur MMS → son détail s'affiche");
  const surlignage = await p.evaluate(() => ({
    plusFortes: ["EF", "GMMS", "PROP", "APS"].every((k) => document.querySelector(`#map g[data-k="${k}"]`).classList.contains("up")),
    plusFaibles: document.querySelectorAll("#map g.node.down").length,
  }));
  ok(surlignage.plusFortes && surlignage.plusFaibles === 0, "MMS : EF, GMMS, PROP et APS surlignées comme plus fortes, aucune plus faible");

  // … et son échelle se déplie, visible dans la colonne (sous l'en-tête collant), sans faire défiler la page
  const pageAvant = await p.evaluate(() => scrollY);
  ok(await attendre(p, () => {
    const colonne = document.querySelector(".alpha").getBoundingClientRect(), tete = document.querySelector(".alpha-head").getBoundingClientRect();
    const ligne = document.querySelector('.srow[data-k="MMS"]'), r = ligne.getBoundingClientRect();
    return !ligne.classList.contains("repliee") && ligne.querySelector(".sdef") && r.top >= tete.bottom - 1 && r.bottom <= colonne.bottom + 1;
  }), "clic sur MMS → son échelle se déplie et apparaît dans la colonne, sous l'en-tête");
  ok((await p.evaluate(() => scrollY)) === pageAvant, "clic sur MMS → la page elle-même ne défile pas");

  // Clavier dans la colonne : Entrée sur une échelle repliée la choisit, le focus reste sur sa ligne
  await p.focus('.srow[data-k="PMMS"]');
  await p.keyboard.press("Enter");
  ok((await p.evaluate(titre)) === "PMMS" && (await p.evaluate(() => document.activeElement.matches('.srow[data-k="PMMS"]:not(.repliee)'))), "clavier : Entrée sur α-PMMS la déplie et garde le focus dessus");

  // Bouton « Implique » du panneau : on suit l'implication
  await p.click('#map g[data-k="EF1"] rect.box');
  await p.click('#detail .links button.down[data-go="Prop1"]');
  ok((await p.evaluate(titre)) === "Prop1", "bouton « Implique » : EF1 → Prop1");

  // Clavier : Tab jusqu'à une notion, puis Entrée
  await p.focus('#map g[data-k="EQX"]');
  await p.keyboard.press("Enter");
  ok((await p.evaluate(titre)) === "EQX", "clavier : Entrée sur une notion la sélectionne");

  // Liens conditionnels masquables
  await p.click("#show-cond");
  ok(await p.evaluate(() => document.getElementById("map").classList.contains("hidden-cond")), "case « liens conditionnels » décochée → pointillés masqués");
  await p.click("#show-cond");

  // Vue « granularité α »
  await p.click("#view-alpha");
  const vue = await p.evaluate(() => ({
    pressee: document.getElementById("view-alpha").getAttribute("aria-pressed"),
    tiges: document.querySelectorAll("#map .rail-bg").length,
    jaugeMasquee: getComputedStyle(document.getElementById("gauge-toggle")).display === "none",
    aideVisible: getComputedStyle(document.getElementById("alpha-hint")).display !== "none",
  }));
  ok(vue.pressee === "true" && vue.tiges === 5 && vue.jaugeMasquee && vue.aideVisible, "vue α : 5 tiges, explication affichée, option des jauges masquée");
  await p.click("#view-impl");

  // Nombre d'agents
  await p.$eval("#n-agents", (curseur) => {
    curseur.value = "5";
    curseur.dispatchEvent(new Event("input", { bubbles: true }));
  });
  ok(await attendre(p, () => document.getElementById("n-out").textContent === "n = 5"), "curseur : n = 5 affiché");
  ok((await p.$eval('.srow[data-k="MMS"] .front', (e) => e.textContent)).includes("7/9"), "n = 5 : α-MMS garanti jusqu'à 7/9");

  // Thème nuit : les couleurs suivent
  const fondJour = await p.$eval('#map g[data-k="EF1"] rect.box', (r) => getComputedStyle(r).fill);
  await p.click(".theme-toggle");
  ok(await attendre(p, (avant) => getComputedStyle(document.querySelector('#map g[data-k="EF1"] rect.box')).fill !== avant, fondJour), "mode nuit : les couleurs du diagramme changent");

  await p.fermer();

  // Téléphone : diagramme, échelles puis détail, les uns sous les autres, sans défilement interne
  const tel = await nouvellePage({ viewport: { width: 390, height: 844 } });
  await tel.goto(base + CARTE, { waitUntil: "networkidle" });
  const pile = await tel.evaluate(() => {
    const [d, a, t] = [".diagram", ".alpha", ".detail"].map((s) => document.querySelector(s).getBoundingClientRect());
    const colonne = document.querySelector(".alpha");
    return { ordre: d.bottom <= a.top && a.bottom <= t.top, interne: colonne.scrollHeight > colonne.clientHeight + 1, debord: document.documentElement.scrollWidth - innerWidth };
  });
  ok(pile.ordre && !pile.interne && pile.debord === 0, "téléphone : diagramme, échelles puis détail empilés, sans défilement interne ni débordement");
  await tel.fermer();
};
