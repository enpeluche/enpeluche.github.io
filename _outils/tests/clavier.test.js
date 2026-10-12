// Navigation au clavier : on parcourt chaque page avec Tab (puis Maj+Tab) comme le ferait une personne
// sans souris, et on vérifie que chaque arrêt est visible, nommé, et jamais caché sous le menu fixe.

// Décrit l'élément qui a le focus (exécuté dans la page)
function decrireFocus() {
  const e = document.activeElement;
  if (!e || e === document.body || e === document.documentElement) return null;
  if (!e.dataset.ordre) e.dataset.ordre = String(document.querySelectorAll("[data-ordre]").length + 1);

  // Ce qui porte le contour, et ce qui doit être visible à l'écran
  const carte = e.closest(".project footer") ? e.closest(".project") : null;
  const porteur = carte || (e.matches(".lang-check") ? e.nextElementSibling : e);
  const zone = (carte ? e.closest("footer") : porteur).getBoundingClientRect();
  const contour = getComputedStyle(porteur).outlineStyle !== "none";

  const menu = document.getElementById("main-header");
  const menuVisible = menu && !menu.classList.contains("header-hidden");
  const basMenu = menu ? menu.getBoundingClientRect().bottom : 0;
  const dansMenu = (menu && menu.contains(e)) || e.matches(".skip-link");

  const label = e.id && document.querySelector(`label[for="${e.id}"]`);
  const candidats = [e.getAttribute("aria-label"), e.textContent, (e.querySelector("img") || {}).alt, e.getAttribute("placeholder"), label && label.textContent];
  const nom = (candidats.map((c) => (c || "").trim()).find((c) => c) || "").replace(/\s+/g, " ");

  return {
    ordre: e.dataset.ordre,
    description: `${e.tagName.toLowerCase()}${e.id ? "#" + e.id : ""} « ${nom.slice(0, 40)} »`,
    contour,
    nom,
    visible: zone.width > 0 && zone.bottom > 0 && zone.top < innerHeight,
    sousLeMenu: menuVisible && !dansMenu && zone.top < basMenu,
  };
}

async function parcourir(p, touche) {
  const arrets = [];
  for (let i = 0; i < 250; i++) {
    await p.keyboard.press(touche);
    await p.waitForTimeout(60); // le menu se masque ou réapparaît selon le défilement
    const arret = await p.evaluate(decrireFocus);
    if (!arret || arrets.some((a) => a.ordre === arret.ordre)) return { arrets, fin: true };
    arrets.push(arret);
  }
  return { arrets, fin: false };
}

function verifierParcours(ok, nomPage, { arrets, fin }, sens) {
  const lister = (filtre) => arrets.filter(filtre).map((a) => a.description).join(", ");
  ok(fin, `${nomPage} (${sens}) : le parcours se termine, aucun piège au clavier (${arrets.length} arrêts)`);
  ok(arrets.every((a) => a.contour), `${nomPage} (${sens}) : contour de focus visible à chaque arrêt` + (arrets.some((a) => !a.contour) ? ` — sans contour : ${lister((a) => !a.contour)}` : ""));
  ok(arrets.every((a) => a.visible), `${nomPage} (${sens}) : chaque élément atteint est à l'écran` + (arrets.some((a) => !a.visible) ? ` — hors écran : ${lister((a) => !a.visible)}` : ""));
  ok(arrets.every((a) => !a.sousLeMenu), `${nomPage} (${sens}) : aucun élément atteint n'est caché sous le menu` + (arrets.some((a) => a.sousLeMenu) ? ` — cachés : ${lister((a) => a.sousLeMenu)}` : ""));
  ok(arrets.every((a) => a.nom), `${nomPage} (${sens}) : chaque élément atteint a un nom` + (arrets.some((a) => !a.nom) ? ` — sans nom : ${lister((a) => !a.nom)}` : ""));
}

const menuOuvert = () => getComputedStyle(document.querySelector(".nav-dropdown-menu")).visibility === "visible";

module.exports = async ({ base, ok, nouvellePage, attendre, toutAfficher, articles }) => {
  // reducedMotion : défilement instantané, pour mesurer les positions sans attendre les animations
  const options = { viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" };

  // --- Accueil : parcours complet, dans les deux sens ---
  let p = await nouvellePage(options);
  await p.goto(base + "/", { waitUntil: "networkidle" });
  await toutAfficher(p);
  const avant = await parcourir(p, "Tab");
  verifierParcours(ok, "accueil", avant, "Tab");
  const atteint = (filtre) => avant.arrets.filter(filtre).length;
  ok(avant.arrets[0] && avant.arrets[0].description.startsWith("a « Aller au contenu"), "accueil : le premier Tab atteint « Aller au contenu »");
  ok(atteint((a) => a.description.startsWith("input#lang-toggle")) === 1, "accueil : le bouton FR/EN est atteint");
  const nbCartes = await p.evaluate(() => document.querySelectorAll(".project").length);
  const nbApercus = await p.evaluate(() => document.querySelectorAll("hover-preview").length);
  const liensCartes = await p.evaluate(() => [...document.querySelectorAll(".project footer a")].filter((a) => a.dataset.ordre).length);
  ok(liensCartes === nbCartes, `accueil : le lien de chaque carte projet est atteint (${liensCartes}/${nbCartes})`);
  ok(atteint((a) => a.description.startsWith("hover-preview")) === nbApercus, `accueil : chaque aperçu (« Cœur de Taubin »…) est atteint (${nbApercus})`);
  verifierParcours(ok, "accueil", await parcourir(p, "Shift+Tab"), "Maj+Tab");
  await p.fermer();

  // --- « Aller au contenu » ---
  p = await nouvellePage(options);
  await p.goto(base + "/", { waitUntil: "networkidle" });
  await p.keyboard.press("Tab");
  await p.keyboard.press("Enter");
  ok(await attendre(p, () => document.activeElement === document.querySelector("main")), "« Aller au contenu » : Entrée place le focus sur le contenu");
  await p.keyboard.press("Tab");
  ok(await p.evaluate(() => !document.getElementById("main-header").contains(document.activeElement)), "« Aller au contenu » : le Tab suivant est dans le contenu, pas dans le menu");
  await p.fermer();

  // --- Bouton FR/EN au clavier ---
  p = await nouvellePage(options);
  await p.goto(base + "/", { waitUntil: "networkidle" });
  await p.focus("#lang-toggle");
  await p.keyboard.press("Space");
  ok(await attendre(p, () => document.documentElement.lang === "en"), "bouton FR/EN : Espace passe en anglais");
  await p.keyboard.press("Space");
  ok(await attendre(p, () => document.documentElement.lang === "fr"), "bouton FR/EN : Espace revient en français");

  // --- Menu « Projets » ---
  await p.focus(".nav-dropdown-toggle");
  await p.keyboard.press("Enter");
  await p.keyboard.press("Tab");
  ok(await attendre(p, menuOuvert), "menu « Projets » : ouvert, focus sur un choix");
  await p.keyboard.press("Escape");
  ok((await attendre(p, () => getComputedStyle(document.querySelector(".nav-dropdown-menu")).visibility !== "visible")) && (await p.evaluate(() => document.activeElement.matches(".nav-dropdown-toggle"))), "menu « Projets » : Échap le referme et rend le focus au bouton");
  await p.keyboard.press("Enter");
  await p.keyboard.press("Tab");
  await p.keyboard.press("Tab");
  await p.keyboard.press("Tab");
  ok(await attendre(p, () => getComputedStyle(document.querySelector(".nav-dropdown-menu")).visibility !== "visible"), "menu « Projets » : se referme quand le focus en sort");

  // --- Le menu masqué réapparaît quand il reçoit le focus ---
  await p.evaluate(() => window.scrollTo(0, 3000));
  await attendre(p, () => document.getElementById("main-header").classList.contains("header-hidden"));
  await p.focus(".nav-link");
  ok(await attendre(p, () => !document.getElementById("main-header").classList.contains("header-hidden")), "menu masqué : il réapparaît quand un de ses liens reçoit le focus");

  // --- Aperçus au clavier ---
  await toutAfficher(p);
  await p.focus("hover-preview");
  ok(await attendre(p, () => getComputedStyle(document.querySelector("hover-preview img")).display === "block"), "aperçu : affiché quand il reçoit le focus");
  await p.keyboard.press("Escape");
  ok((await attendre(p, () => getComputedStyle(document.querySelector("hover-preview img")).display === "none")) && (await p.evaluate(() => document.activeElement.tagName)) === "HOVER-PREVIEW", "aperçu : Échap le referme (après son fondu), le focus reste en place");

  // --- Filtres des projets : état annoncé ---
  const etats = () => [...document.querySelectorAll("#projects .filter-btn")].map((b) => b.getAttribute("aria-pressed")).join(",");
  ok(/^true(,false)+$/.test(await p.evaluate(etats)), "filtres : « Tout voir » enfoncé au départ (aria-pressed)");
  await p.focus('#projects .filter-btn[data-filter="rust"]');
  await p.keyboard.press("Enter");
  ok((await p.getAttribute('#projects .filter-btn[data-filter="rust"]', "aria-pressed")) === "true" && (await p.getAttribute('#projects .filter-btn[data-filter="all"]', "aria-pressed")) === "false", "filtres : Entrée active un filtre, l'état suit");
  await p.fermer();

  // --- Blog et articles ---
  for (const page of ["/blog/", ...articles().map((a) => `/blog/articles/${a.folder}/`)]) {
    p = await nouvellePage(options);
    await p.goto(base + page, { waitUntil: "networkidle" });
    const parcours = await parcourir(p, "Tab");
    verifierParcours(ok, page, parcours, "Tab");
    ok(parcours.arrets[0] && parcours.arrets[0].description.startsWith("a « Aller au contenu"), `${page} : le premier Tab atteint « Aller au contenu »`);
    await p.fermer();
  }
};
