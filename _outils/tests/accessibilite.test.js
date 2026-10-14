// Audit d'accessibilité automatique (axe-core, l'outil de référence) sur chaque page, de jour et de nuit :
// contrastes, noms des liens et boutons, structure des titres, attributs ARIA, langue…
// Tout problème relevé fait échouer le test, avec son explication et les éléments concernés.

const AXE = require.resolve("axe-core");

module.exports = async ({ base, INTROUVABLE, PAGES_RECHERCHE, ok, nouvellePage, toutAfficher, articles }) => {
  const pages = ["/", "/?lang=en", "/blog/", ...articles().map((a) => `/blog/articles/${a.folder}/`), INTROUVABLE, ...PAGES_RECHERCHE];

  for (const theme of ["light", "dark"]) {
    for (const page of pages) {
      // reducedMotion : le contenu est affiché d'un coup, sans animation qui fausserait les contrastes
      const p = await nouvellePage({ colorScheme: theme, reducedMotion: "reduce" });
      await p.goto(base + page, { waitUntil: "networkidle" });
      await toutAfficher(p);
      await p.addScriptTag({ path: AXE });
      const problemes = await p.evaluate(async () => {
        // preload: false : axe ne relit pas lui-même les feuilles de style (il résout mal les @import
        // relatifs de main.css et provoquerait de fausses erreurs 404)
        const resultat = await window.axe.run(document, { resultTypes: ["violations"], preload: false });
        return resultat.violations.map((v) => `${v.impact} — ${v.help} (${v.id}) : ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}${v.nodes.length > 3 ? ` … (${v.nodes.length} éléments)` : ""}`);
      });
      ok(problemes.length === 0, `${page} (${theme === "light" ? "jour" : "nuit"}) : aucun problème d'accessibilité relevé` + (problemes.length ? `\n         ${problemes.join("\n         ")}` : ""));
      await p.fermer();
    }
  }
};
