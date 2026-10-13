// Blog : liste des articles (d'après blog/data.json), recherche, tri, et chaque page d'article.
// Les vérifications ne supposent rien sur le nombre ni le contenu des articles.

const lireCartes = () =>
  [...document.querySelectorAll(".blog-card")].map((c) => ({
    href: c.querySelector("a").getAttribute("href"),
    categorie: c.querySelector(".card-category").textContent.trim(),
    date: c.querySelector("time").textContent.trim(),
    resume: c.querySelector(".card-summary").textContent.trim(),
  }));

module.exports = async ({ base, SITE, ok, nouvellePage, attendre, articles, toutAfficher, lire }) => {
  const liste = articles();
  const lien = (a) => `/blog/articles/${a.folder}/`;
  const recentsDabord = [...liste].sort((a, b) => b.date.localeCompare(a.date)).map(lien);
  const anciensDabord = [...recentsDabord].reverse();

  // --- Liste du blog ---
  let p = await nouvellePage();
  await p.goto(base + "/blog/", { waitUntil: "networkidle" });
  let cartes = await p.evaluate(lireCartes);
  ok(cartes.length === liste.length, `une carte par article de data.json (${cartes.length}/${liste.length})`);
  ok(cartes.map((c) => c.href).join() === recentsDabord.join(), "cartes triées du plus récent au plus ancien, chacune menant à /blog/articles/<dossier>/");
  ok(cartes.every((c) => c.resume.length > 20), "résumé affiché sur chaque carte");
  ok(cartes.every((c) => /^\d{1,2} \S+ \d{4}$/.test(c.date)), "dates écrites en toutes lettres : " + cartes.map((c) => c.date).join(" | "));
  const libelles = lire("blog/blog.js").match(/const CATEGORY_LABELS = \{([^}]*)\}/)[1];
  const sansLibelle = [...new Set(liste.map((a) => a.category))].filter((c) => !new RegExp(`\\b${c}\\s*:`).test(libelles));
  ok(sansLibelle.length === 0, "chaque catégorie de data.json a un libellé dans blog.js" + (sansLibelle.length ? ` (manque : ${sansLibelle.join(", ")})` : ""));

  // Recherche par le titre du plus ancien article, puis tri « plus anciens d'abord »
  const cible = liste.find((a) => lien(a) === anciensDabord[0]);
  const terme = cible.title.toLowerCase();
  const attendus = liste.filter((a) => a.title.toLowerCase().includes(terme) || a.summary.toLowerCase().includes(terme)).map(lien);
  await p.fill("#blog-search", cible.title);
  await attendre(p, (n) => document.querySelectorAll(".blog-card").length === n, attendus.length);
  cartes = await p.evaluate(lireCartes);
  ok(cartes.map((c) => c.href).sort().join() === attendus.sort().join(), `recherche « ${cible.title} » → ${attendus.length} article(s)`);
  await p.selectOption("#blog-sort", "oldest");
  await p.fill("#blog-search", "");
  await attendre(p, (n) => document.querySelectorAll(".blog-card").length === n, liste.length);
  cartes = await p.evaluate(lireCartes);
  ok(cartes.map((c) => c.href).join() === anciensDabord.join(), "tri « plus anciens d'abord »");
  await p.fill("#blog-search", "zzzz-introuvable");
  ok(await attendre(p, () => document.querySelectorAll(".blog-card").length === 0 && getComputedStyle(document.getElementById("no-results")).display !== "none"), "recherche sans résultat → message « aucun article »");
  await p.fill("#blog-search", "");
  await p.selectOption("#blog-sort", "newest");
  await attendre(p, (n) => document.querySelectorAll(".blog-card").length === n, liste.length);
  await p.click(".blog-card >> nth=0");
  await p.waitForLoadState("networkidle");
  ok(new URL(p.url()).pathname === recentsDabord[0], "clic sur une carte → page de l'article");
  await p.fermer();

  // --- Anciens liens ?post= ---
  p = await nouvellePage();
  await p.goto(`${base}/blog/?post=${liste[0].folder}`, { waitUntil: "networkidle" });
  ok(new URL(p.url()).pathname === lien(liste[0]), "ancien lien /blog/?post=… redirigé vers la page de l'article");
  await p.goto(base + "/?post=xyz", { waitUntil: "networkidle" });
  ok(new URL(p.url()).pathname === "/", "accueil avec ?post= : pas de redirection");
  await p.fermer();

  // --- Chaque page d'article (et le modèle) ---
  p = await nouvellePage();
  for (const dossier of [...liste.map((a) => a.folder), "_modele"]) {
    await p.goto(`${base}/blog/articles/${dossier}/`, { waitUntil: "networkidle" });
    const nom = `article ${dossier}`;
    ok((await p.$("site-header #main-header")) !== null && (await p.$(".article-body h1")) !== null, `${nom} : menu et article affichés`);
    ok((await p.getAttribute(".btn-back", "href")) === "/blog/", `${nom} : bouton retour vers /blog/`);
    if (dossier === "_modele") continue;
    ok((await p.title()).endsWith(" · Blog de Lucas Noirot (Petit)"), `${nom} : titre d'onglet propre à l'article`);
    ok((await p.getAttribute('link[rel="canonical"]', "href")) === `${SITE}/blog/articles/${dossier}/`, `${nom} : adresse canonique`);
    ok(((await p.getAttribute('meta[property="og:image"]', "content")) || "").startsWith(`${SITE}/blog/articles/${dossier}/`), `${nom} : image d'aperçu de partage propre à l'article`);
    const fiche = await p.evaluate(() => {
      try {
        return JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent);
      } catch {
        return null;
      }
    });
    const balise = (selecteur) => p.$eval(selecteur, (e) => e.getAttribute("content") || e.getAttribute("href")).catch(() => null);
    const attendue = {
      headline: await balise('meta[property="og:title"]'),
      description: await balise('meta[name="description"]'),
      datePublished: liste.find((a) => a.folder === dossier).date,
      url: await balise('link[rel="canonical"]'),
      image: await balise('meta[property="og:image"]'),
    };
    const ecarts = fiche ? Object.keys(attendue).filter((cle) => fiche[cle] !== attendue[cle]) : ["fiche absente ou illisible"];
    ok(fiche && fiche["@type"] === "BlogPosting" && fiche.author?.name === "Lucas Noirot" && ecarts.length === 0, `${nom} : fiche pour les moteurs à jour (titre, résumé, date, adresse, image)` + (ecarts.length ? ` — différent : ${ecarts.join(", ")}` : ""));
    if (lire(`blog/articles/${dossier}/index.html`).includes("$")) {
      ok(await attendre(p, () => document.querySelectorAll(".katex").length > 0), `${nom} : formules rendues par KaTeX`);
    }
    if (await p.$(".article-body h2")) {
      ok((await p.evaluate(() => getComputedStyle(document.querySelector(".article-body h2"), "::before").content)).includes("counter(titre2)"), `${nom} : titres numérotés`);
    }
  }
  await p.fermer();

  // --- Qualités humaines (page d'accueil) : chaque qualité renvoie vers des preuves qui existent ---
  p = await nouvellePage();
  await p.goto(base + "/", { waitUntil: "networkidle" });
  await toutAfficher(p);
  const preuves = await p.evaluate(() =>
    [...document.querySelectorAll(".soft-skill")].map((li) => ({
      qualite: li.querySelector(".tag").textContent.trim(),
      liens: [...li.querySelectorAll("a")].map((a) => a.getAttribute("href")),
    }))
  );
  ok(preuves.length > 0 && preuves.every((q) => q.liens.length > 0), "chaque qualité a au moins une preuve : " + preuves.map((q) => `${q.qualite} (${q.liens.length})`).join(" | "));
  const cassees = await p.evaluate((hrefs) => hrefs.filter((h) => h.startsWith("#") && !document.getElementById(h.slice(1))), preuves.flatMap((q) => q.liens));
  ok(cassees.length === 0, "chaque preuve mène à une carte qui existe" + (cassees.length ? ` (cassées : ${cassees.join(", ")})` : ""));
  const premiere = preuves[0].liens[0];
  await p.click(`.soft-skill a[href="${premiere}"]`);
  ok(await attendre(p, (id) => document.getElementById(id).matches(":target"), premiere.slice(1)), "clic sur une preuve → carte projet mise en évidence");
  await p.fermer();
};
