// Vérifications sur toutes les pages : pas de défilement horizontal sur téléphone, liens internes valides,
// bandeaux des projets, et informations pour les moteurs de recherche (fiche, sitemap, robots.txt).

module.exports = async ({ base, SITE, ok, nouvellePage, toutAfficher, articles, lire }) => {
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
