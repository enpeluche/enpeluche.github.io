// Vérifications sur toutes les pages : pas de défilement horizontal sur téléphone, liens internes valides,
// un seul h1, polices allégées, fichiers servis par le site, bandeaux des projets, et informations
// pour les moteurs de recherche (fiche, sitemap, robots.txt).

module.exports = async ({ base, SITE, INTROUVABLE, ok, nouvellePage, toutAfficher, articles, lire }) => {
  const pages = ["/", "/blog/", ...articles().map((a) => `/blog/articles/${a.folder}/`)];

  // --- Pas de défilement horizontal, du plus petit téléphone courant (320 px) à 375 px ---
  for (const largeur of [320, 375]) {
    const p = await nouvellePage({ viewport: { width: largeur, height: 700 } });
    const debordent = [];
    for (const page of pages) {
      await p.goto(base + page, { waitUntil: "networkidle" });
      await toutAfficher(p);
      const largeurPage = await p.evaluate(() => document.documentElement.scrollWidth);
      if (largeurPage > largeur) debordent.push(`${page} (${largeurPage} px)`);
    }
    ok(debordent.length === 0, `${largeur} px de large : aucune page ne défile sur le côté` + (debordent.length ? ` — débordent : ${debordent.join(", ")}` : ""));
    await p.fermer();
  }

  // --- Liens et images internes ---
  const p = await nouvellePage();
  const casses = new Set();
  for (const page of pages) {
    await p.goto(base + page, { waitUntil: "networkidle" });
    const { adresses, ancresManquantes } = await p.evaluate(() => {
      const adresses = [...document.querySelectorAll("a[href], img[src]")]
        .map((e) => new URL(e.getAttribute("href") || e.getAttribute("src"), location.href))
        .filter((u) => u.origin === location.origin);
      const ancresManquantes = adresses
        .filter((u) => u.pathname === location.pathname && u.hash && !document.getElementById(decodeURIComponent(u.hash.slice(1))))
        .map((u) => u.hash);
      return { adresses: [...new Set(adresses.map((u) => u.pathname))], ancresManquantes };
    });
    ancresManquantes.forEach((a) => casses.add(`${page}${a} (ancre absente)`));
    for (const adresse of adresses) {
      const reponse = await fetch(base + adresse, { method: "HEAD" });
      if (reponse.status >= 400) casses.add(`${adresse} (${reponse.status}, depuis ${page})`);
    }
  }
  ok(casses.size === 0, "liens et images internes valides" + (casses.size ? ` — cassés : ${[...casses].join(", ")}` : ""));

  // --- Icônes : onglet (192 px) et écran d'accueil des téléphones, sur toutes les pages ---
  const sansIcone = [];
  for (const page of [...pages, INTROUVABLE]) {
    await p.goto(base + page, { waitUntil: "networkidle" });
    const icones = await p.evaluate(() => [
      document.querySelector('link[rel="icon"][sizes="192x192"]')?.getAttribute("href"),
      document.querySelector('link[rel="apple-touch-icon"]')?.getAttribute("href"),
    ]);
    for (const icone of icones) {
      if (!icone || (await fetch(base + icone)).status !== 200) sansIcone.push(`${page} (${icone || "absente"})`);
    }
  }
  ok(sansIcone.length === 0, "icônes haute définition présentes sur chaque page" + (sansIcone.length ? ` — manquantes : ${sansIcone.join(", ")}` : ""));

  // --- Page 404, affichée par GitHub Pages pour toute adresse inexistante ---
  const page404 = await nouvellePage();
  const reponse = await page404.goto(base + INTROUVABLE, { waitUntil: "networkidle" });
  ok(reponse.status() === 404, "adresse inexistante : code 404");
  ok((await page404.$eval("h1", (h) => h.textContent.trim())) === "Page introuvable", "page 404 : titre « Page introuvable »");
  ok((await page404.$("site-header #main-header")) !== null, "page 404 : menu affiché");
  ok((await page404.getAttribute('meta[name="robots"]', "content")) === "noindex", "page 404 : pas indexée par les moteurs de recherche");
  const retours = await page404.$$eval(".page-introuvable-lien", (liens) => liens.map((a) => a.getAttribute("href")).join(", "));
  ok(retours === "/, /blog/", `page 404 : liens vers l'accueil et le blog (${retours})`);
  // Plus profond dans l'arborescence : chemins absolus, donc styles et menu toujours chargés
  await page404.goto(`${base}${INTROUVABLE}un/dossier/profond/`, { waitUntil: "networkidle" });
  ok((await page404.evaluate(() => getComputedStyle(document.querySelector(".page-introuvable-carte")).maxWidth)) === "640px" && (await page404.$("site-header #main-header")) !== null, "page 404 : bien affichée, même à une adresse profonde");
  await page404.fermer();

  // --- Un seul titre principal (h1) par page ---
  const h1 = [];
  for (const page of pages) {
    await p.goto(base + page, { waitUntil: "networkidle" });
    const n = await p.evaluate(() => document.querySelectorAll("h1").length);
    if (n !== 1) h1.push(`${page} (${n})`);
  }
  ok(h1.length === 0, "un seul titre principal (h1) par page" + (h1.length ? ` — pages en défaut : ${h1.join(", ")}` : ""));

  // --- Polices : seulement la version allégée (la complète ne sert qu'en secours, voir _outils/polices.py) ---
  const pagePolices = await nouvellePage();
  const polices = new Set();
  pagePolices.on("request", (r) => {
    if (r.url().includes("/assets/fonts/")) polices.add(r.url().split("/").pop());
  });
  for (const page of [...pages, "/?lang=en"]) {
    await pagePolices.goto(base + page, { waitUntil: "networkidle" });
    await toutAfficher(pagePolices);
    await pagePolices.evaluate(() => document.fonts.ready);
  }
  await pagePolices.fermer();
  const lourdes = [...polices].filter((f) => !f.endsWith("-latin.woff2"));
  ok(polices.size > 0 && lourdes.length === 0, `polices : seule la version allégée est téléchargée (${[...polices].join(", ")})` + (lourdes.length ? ` — police complète chargée : un caractère du site manque dans la version allégée (voir _outils/polices.py)` : ""));

  // --- Les fichiers du site sont servis par le site, pas par jsDelivr (cache de plusieurs heures) ---
  const fichiers = ["index.html", "blog/index.html", "assets/css/main.css", ...articles().map((a) => `blog/articles/${a.folder}/index.html`)];
  const viaCdn = fichiers.filter((f) => lire(f).includes("cdn.jsdelivr.net/gh/enpeluche"));
  ok(viaCdn.length === 0, "aucun fichier du site chargé via jsDelivr" + (viaCdn.length ? ` — dans : ${viaCdn.join(", ")}` : ""));

  // --- Bandeaux des cartes projets ---
  await p.goto(base + "/", { waitUntil: "networkidle" });
  const bandeaux = await p.evaluate(() =>
    [...document.querySelectorAll(".project")].map((carte) => {
      const bandeau = carte.querySelector(".project-banner");
      const masque = bandeau && getComputedStyle(bandeau, "::before").maskImage;
      return { id: carte.id, url: masque && (masque.match(/url\("(.*)"\)/) || [])[1] };
    })
  );
  const sansBandeau = bandeaux.filter((b) => !b.url).map((b) => b.id);
  ok(sansBandeau.length === 0, `chaque carte projet a son bandeau (${bandeaux.length} cartes)` + (sansBandeau.length ? ` — sans bandeau : ${sansBandeau.join(", ")}` : ""));
  const svgAbsents = [];
  for (const { url } of bandeaux.filter((b) => b.url)) {
    const reponse = await fetch(url);
    if (reponse.status !== 200 || !(reponse.headers.get("content-type") || "").includes("svg")) svgAbsents.push(url);
  }
  ok(svgAbsents.length === 0, "chaque bandeau désigne un fichier SVG existant" + (svgAbsents.length ? ` — absents : ${svgAbsents.join(", ")}` : ""));

  // --- Formules des cartes projets, rendues par KaTeX même après la traduction ---
  const formules = () => document.querySelectorAll("#project-raytracer .katex").length > 0 && !document.querySelector("#project-raytracer .description").textContent.includes("$");
  ok(await p.evaluate(formules), "carte Ray Tracing : formule mise en forme (pas de $ visibles)");
  await p.click('label[for="lang-toggle"]');
  await p.waitForFunction(() => document.documentElement.lang === "en");
  ok(await p.evaluate(formules), "carte Ray Tracing en anglais : formule mise en forme");
  await p.click('label[for="lang-toggle"]');

  // --- Moteurs de recherche ---
  let fiche = null;
  try {
    fiche = JSON.parse(await p.$eval('script[type="application/ld+json"]', (s) => s.textContent));
  } catch {}
  ok(fiche && fiche["@type"] === "Person" && fiche.name === "Lucas Noirot" && fiche.alternateName.includes("Lucas Petit"), "accueil : fiche schema.org valide, avec les deux noms");
  ok((await p.getAttribute('link[rel="canonical"]', "href")) === `${SITE}/`, "accueil : adresse canonique");
  await p.goto(base + "/blog/", { waitUntil: "networkidle" });
  ok((await p.getAttribute('link[rel="canonical"]', "href")) === `${SITE}/blog/`, "blog : adresse canonique");
  await p.fermer();

  ok(lire("robots.txt").includes(`Sitemap: ${SITE}/sitemap.xml`), "robots.txt indique le sitemap");
  const plan = lire("sitemap.xml");
  const adressesPlan = [...plan.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  const attendues = pages.map((page) => SITE + page);
  const oubliees = attendues.filter((a) => !adressesPlan.includes(a));
  const enTrop = adressesPlan.filter((a) => !attendues.includes(a));
  ok(oubliees.length === 0 && enTrop.length === 0, "sitemap.xml à jour avec blog/data.json" + (oubliees.length || enTrop.length ? ` — lancer : python3 _outils/sitemap.py (manquantes : ${oubliees.join(", ") || "aucune"} ; en trop : ${enTrop.join(", ") || "aucune"})` : ""));
};
