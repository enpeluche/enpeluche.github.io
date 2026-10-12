// Lance tous les tests du site : node lancer.js (ou npm test), depuis _outils/tests.
// Pour n'en lancer qu'un : node lancer.js blog

const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");
const { demarrerServeur, creerOutils } = require("./outils");

(async () => {
  const filtre = process.argv[2];
  const fichiers = fs
    .readdirSync(__dirname)
    .filter((f) => f.endsWith(".test.js"))
    .filter((f) => !filtre || f.startsWith(filtre))
    .sort();

  const serveur = await demarrerServeur();
  const base = `http://127.0.0.1:${serveur.address().port}`;
  const navigateur = await chromium.launch();
  const bilan = { total: 0, echecs: [], erreurs: [] };
  const outils = creerOutils(navigateur, base, bilan);

  for (const fichier of fichiers) {
    console.log(`\n${fichier.replace(".test.js", "")}`);
    try {
      await require(path.join(__dirname, fichier))(outils);
    } catch (e) {
      outils.ok(false, `le test s'est arrêté : ${e.message.split("\n")[0]}`);
    }
  }

  await navigateur.close();
  serveur.close();

  const erreurs = [...new Set(bilan.erreurs)];
  console.log(`\n${bilan.total} vérifications : ${bilan.total - bilan.echecs.length} OK, ${bilan.echecs.length} en échec.`);
  console.log(erreurs.length ? `Erreurs JavaScript ou HTTP pendant les tests :\n  ${erreurs.join("\n  ")}` : "Aucune erreur JavaScript ni HTTP.");
  process.exit(bilan.echecs.length || erreurs.length ? 1 : 0);
})();
