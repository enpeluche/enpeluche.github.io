// Menu commun à toutes les pages (<site-header>) : onglet courant, menu déroulant, masquage, traduction.

const { devices } = require("playwright");

// Le menu peut ne pas exister encore (page en cours de rechargement) : on attend alors qu'il apparaisse
const menuOuvert = () => {
  const menu = document.querySelector(".nav-dropdown-menu");
  return !!menu && getComputedStyle(menu).visibility === "visible";
};
const menuFerme = () => {
  const menu = document.querySelector(".nav-dropdown-menu");
  return !!menu && getComputedStyle(menu).visibility !== "visible";
};
const ongletCourant = () => [...document.querySelectorAll(".nav-link.is-current")].map((e) => e.textContent.trim()).join(",");

module.exports = async ({ base, ok, nouvellePage, attendre, articles }) => {
  // --- Accueil, ordinateur ---
  let p = await nouvellePage({ viewport: { width: 1280, height: 900 } });
  await p.goto(base + "/", { waitUntil: "networkidle" });
  ok((await p.$("#main-header")) !== null, "menu affiché par <site-header>");
  ok((await p.$("#lang-toggle")) !== null, "bouton de langue présent sur l'accueil");
  ok((await p.evaluate(ongletCourant)) === "", "aucun onglet courant en haut de page");

  for (const [id, attendu] of [["phd", "Thèse"], ["cv", "CV"], ["projects", "Projets"], ["projects-more", "Projets"], ["contact", ""]]) {
    await p.evaluate((id) => window.scrollTo({ top: document.getElementById(id).offsetTop + 40, behavior: "instant" }), id);
    const bon = await attendre(p, (attendu) => [...document.querySelectorAll(".nav-link.is-current")].map((e) => e.textContent.trim()).join(",") === attendu, attendu);
    ok(bon, `section #${id} → onglet courant « ${await p.evaluate(ongletCourant)} » (attendu « ${attendu} »)`);
  }

  ok(await attendre(p, () => document.getElementById("main-header").classList.contains("header-hidden")), "menu masqué après une descente");
  await p.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  ok(await attendre(p, () => !document.getElementById("main-header").classList.contains("header-hidden")), "menu réaffiché en haut de page");

  // Menu déroulant : survol, clic, Échap, clic ailleurs, clavier
  ok(await p.evaluate(menuFerme), "menu déroulant fermé au départ");
  await p.hover(".nav-dropdown-toggle");
  ok(await attendre(p, menuOuvert), "menu déroulant ouvert au survol");
  await p.mouse.move(10, 600);
  ok(await attendre(p, menuFerme), "menu déroulant refermé quand la souris s'en va");
  await p.click(".nav-dropdown-toggle");
  await p.mouse.move(10, 600);
  ok((await attendre(p, menuOuvert)) && (await p.getAttribute(".nav-dropdown-toggle", "aria-expanded")) === "true", "menu déroulant ouvert au clic (aria-expanded=true)");
  await p.keyboard.press("Escape");
  ok(await attendre(p, menuFerme), "menu déroulant refermé avec Échap");
  await p.click(".nav-dropdown-toggle");
  await p.mouse.click(600, 500);
  ok(await attendre(p, menuFerme), "menu déroulant refermé par un clic ailleurs");
  await p.focus(".nav-dropdown-toggle");
  await p.keyboard.press("Enter");
  await p.mouse.move(10, 600);
  ok(await attendre(p, menuOuvert), "menu déroulant ouvert au clavier (Entrée)");
  await p.keyboard.press("Tab");
  ok(await p.evaluate(() => document.activeElement.closest(".nav-dropdown-menu") !== null), "Tab entre dans le menu déroulant");
  await p.keyboard.press("Escape");

  // Liens du menu sur l'accueil : la page défile jusqu'à la section, sans être rechargée
  ok((await p.getAttribute('a.nav-link[data-spy="phd"]', "href")) === "#phd", "accueil : le lien « Thèse » est une ancre de la page (#phd)");
  await p.evaluate(() => {
    window.__pasRechargee = true;
  });
  await p.click('a.nav-link[data-spy="phd"]');
  ok(await attendre(p, () => location.hash === "#phd"), "accueil : le lien « Thèse » mène à #phd");
  ok(await p.evaluate(() => window.__pasRechargee === true), "accueil : la page n'est pas rechargée (simple défilement)");
  ok(await attendre(p, () => Math.abs(document.getElementById("phd").getBoundingClientRect().top) < 2), "accueil : la section « Thèse » arrive en haut de l'écran");
  await p.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await attendre(p, () => !document.getElementById("main-header").classList.contains("header-hidden"));

  // Traduction du menu
  await p.click('label[for="lang-toggle"]');
  const texte = () => [...document.querySelectorAll("#main-header .nav-link, .nav-dropdown-menu a")].map((e) => e.textContent.trim()).join(" | ");
  const attenduEN = "PhD | CV | Projects | Research & Engineering | Additional Projects | Blog";
  ok(await attendre(p, (t) => [...document.querySelectorAll("#main-header .nav-link, .nav-dropdown-menu a")].map((e) => e.textContent.trim()).join(" | ") === t, attenduEN), "menu traduit en anglais : " + (await p.evaluate(texte)));
  await p.click('label[for="lang-toggle"]');
  await p.fermer();

  // --- Accueil, téléphone (toucher) ---
  p = await nouvellePage({ ...devices["iPhone 13"] });
  await p.goto(base + "/", { waitUntil: "networkidle" });
  await p.tap(".nav-dropdown-toggle");
  ok(await attendre(p, menuOuvert), "téléphone : menu déroulant ouvert au toucher");
  await p.tap('.nav-dropdown-menu a[href$="#acad"]');
  await p.waitForURL(/#acad$/);
  await p.waitForLoadState("networkidle");
  ok(await attendre(p, menuFerme), "téléphone : menu déroulant refermé après un choix");
  ok(await attendre(p, () => location.hash === "#acad"), "téléphone : navigation vers #acad");
  await p.goto(base + "/", { waitUntil: "networkidle" });
  await p.tap(".nav-dropdown-toggle");
  await attendre(p, menuOuvert);
  await p.tap("#profile-name");
  ok(await attendre(p, menuFerme), "téléphone : menu déroulant refermé en touchant ailleurs");
  await p.fermer();

  // --- Blog ---
  p = await nouvellePage();
  await p.goto(base + "/blog/", { waitUntil: "networkidle" });
  ok((await p.$("#main-header")) !== null, "blog : menu affiché");
  ok((await p.$("#lang-toggle")) === null, "blog : pas de bouton de langue");
  ok((await p.evaluate(ongletCourant)) === "Blog", "blog : onglet « Blog » courant");
  ok((await p.getAttribute('.nav-link[data-page="blog"]', "aria-current")) === "page", 'blog : aria-current="page"');
  ok((await p.getAttribute('a.nav-link[data-spy="phd"]', "href")) === "/#phd", "blog : le lien « Thèse » mène toujours à l'accueil (/#phd)");
  const dossier = articles()[0].folder;
  await p.goto(`${base}/blog/articles/${dossier}/`, { waitUntil: "networkidle" });
  ok((await p.evaluate(ongletCourant)) === "Blog", "page d'article : onglet « Blog » courant");
  await p.fermer();
};
