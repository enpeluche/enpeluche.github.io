// Outils communs aux tests : serveur local, pages Playwright surveillées, vérifications.

const fs = require("fs");
const http = require("http");
const path = require("path");

const RACINE = path.resolve(__dirname, "..", "..");
const SITE = "https://enpeluche.github.io";

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

// Petit serveur statique, comme GitHub Pages : /dossier/ sert /dossier/index.html, et une adresse
// qui n'existe pas reçoit la page 404.html (avec le code 404).
function demarrerServeur() {
  const serveur = http.createServer((req, res) => {
    const url = new URL(req.url, "http://localhost");
    const chemin = decodeURIComponent(url.pathname);
    let fichier = path.join(RACINE, chemin);
    if (!fichier.startsWith(RACINE)) {
      res.writeHead(403);
      return res.end();
    }
    fs.stat(fichier, (erreur, infos) => {
      if (!erreur && infos.isDirectory()) {
        if (!chemin.endsWith("/")) {
          res.writeHead(301, { Location: chemin + "/" + url.search });
          return res.end();
        }
        fichier = path.join(fichier, "index.html");
      }
      fs.readFile(fichier, (erreur2, contenu) => {
        if (erreur2) {
          return fs.readFile(path.join(RACINE, "404.html"), (erreur3, page404) => {
            res.writeHead(404, { "Content-Type": erreur3 ? "text/plain" : TYPES[".html"] });
            res.end(erreur3 ? "404" : page404);
          });
        }
        res.writeHead(200, { "Content-Type": TYPES[path.extname(fichier).toLowerCase()] || "application/octet-stream" });
        res.end(contenu);
      });
    });
  });
  return new Promise((resolve) => serveur.listen(0, "127.0.0.1", () => resolve(serveur)));
}

// Requêtes vers l'extérieur :
// - le compteur de visites (GoatCounter) est bloqué, pour ne pas compter les tests ;
// - les fichiers du site lui-même, chargés via jsDelivr (…/enpeluche.github.io@main/…),
//   sont servis depuis le dépôt local, pour tester la version en cours et non celle en ligne ;
// - si la variable CDN_LOCAL désigne un dossier, les bibliothèques jsDelivr (npm/<paquet>@<version>/…)
//   y sont lues (utile hors ligne) ; sinon elles sont téléchargées normalement.
async function preparerContexte(contexte) {
  await contexte.route("**/gc.zgo.at/**", (route) => route.abort());
  await contexte.route("https://cdn.jsdelivr.net/**", async (route) => {
    const url = new URL(route.request().url());
    const propre = url.pathname.match(/^\/gh\/enpeluche\/enpeluche\.github\.io@main\/(.*)$/);
    const paquet = url.pathname.match(/^\/npm\/(.*)$/);
    let fichier = null;
    if (propre) fichier = path.join(RACINE, propre[1]);
    else if (paquet && process.env.CDN_LOCAL) fichier = path.join(process.env.CDN_LOCAL, paquet[1]);
    if (!fichier) return route.continue();
    try {
      await route.fulfill({ path: fichier });
    } catch {
      await route.abort();
    }
  });
}

// Articles du blog, tels que listés dans blog/data.json
function articles() {
  return JSON.parse(fs.readFileSync(path.join(RACINE, "blog", "data.json"), "utf8"));
}

function lire(fichierRelatif) {
  return fs.readFileSync(path.join(RACINE, fichierRelatif), "utf8");
}

// Attend qu'une condition devienne vraie dans la page (3 s au plus) ; renvoie true ou false.
async function attendre(page, condition, argument) {
  try {
    await page.waitForFunction(condition, argument, { timeout: 3000 });
    return true;
  } catch {
    return false;
  }
}

// Rend tout le contenu visible d'un coup (sans attendre les animations d'apparition au défilement)
function toutAfficher(page) {
  return page.evaluate(() => document.querySelectorAll(".reveal").forEach((e) => e.classList.add("active")));
}

// Crée l'objet passé à chaque fichier de test
function creerOutils(navigateur, base, bilan) {
  return {
    base,
    SITE,
    RACINE,
    INTROUVABLE,
    articles,
    lire,
    attendre,
    toutAfficher,

    // Une vérification : affichée, et comptée dans le bilan
    ok(condition, message) {
      bilan.total += 1;
      if (!condition) bilan.echecs.push(message);
      console.log(`${condition ? "  OK   " : "  ÉCHEC"} ${message}`);
    },

    // Nouvelle page, dans un contexte neuf. Les erreurs JavaScript et les réponses HTTP en erreur
    // sont relevées dans p.erreurs.
    async nouvellePage(options = {}) {
      const contexte = await navigateur.newContext({ viewport: { width: 1280, height: 800 }, ...options });
      await preparerContexte(contexte);
      const page = await contexte.newPage();
      page.erreurs = [];
      page.on("pageerror", (e) => page.erreurs.push("JS : " + e.message));
      page.on("response", (r) => {
        const adresse = decodeURIComponent(r.url());
        // Pas des erreurs : les ⟨…⟩ sont des emplacements à remplir du modèle d'article (blog/articles/_modele),
        // et les adresses /introuvable… sont celles que les tests visitent exprès pour voir la page 404.
        const voulu = adresse.includes("⟨") || new URL(r.url()).pathname.startsWith("/introuvable");
        if (r.status() >= 400 && !voulu) page.erreurs.push(`HTTP ${r.status()} : ${r.url()}`);
      });
      page.fermer = async () => {
        bilan.erreurs.push(...page.erreurs);
        await contexte.close();
      };
      return page;
    },
  };
}

// Adresse qui n'existe pas, visitée exprès pour tester la page 404
const INTROUVABLE = "/introuvable-test/";

module.exports = { demarrerServeur, creerOutils, SITE, RACINE, INTROUVABLE };
