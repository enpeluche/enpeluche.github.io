// Mode jour / nuit, et respect du réglage « réduire les animations ».

const theme = () => document.documentElement.dataset.theme;
const fond = () => getComputedStyle(document.documentElement).backgroundColor;

module.exports = async ({ base, ok, nouvellePage, attendre }) => {
  // 1. Système clair, aucun choix mémorisé
  let p = await nouvellePage({ colorScheme: "light" });
  await p.goto(base + "/", { waitUntil: "networkidle" });
  ok((await p.evaluate(theme)) === "light" && (await p.evaluate(fond)) === "rgb(255, 255, 255)", "système clair → mode jour");
  ok((await p.getAttribute(".theme-toggle", "aria-checked")) === "false", "interrupteur sur « jour »");
  ok(await attendre(p, () => !!document.querySelector("#tsparticles canvas")), "particules affichées");

  await p.click(".theme-toggle");
  ok(await attendre(p, () => document.documentElement.dataset.theme === "dark" && getComputedStyle(document.documentElement).backgroundColor === "rgb(11, 16, 38)"), "clic → mode nuit (fond bleu nuit)");
  ok((await p.getAttribute(".theme-toggle", "aria-checked")) === "true", "interrupteur sur « nuit »");
  ok((await p.evaluate(() => localStorage.getItem("app_theme"))) === "dark", "choix mémorisé");
  ok((await p.evaluate(() => getComputedStyle(document.querySelector("#main-header img")).filter)) === "invert(1)", "logo inversé la nuit");
  await p.reload({ waitUntil: "networkidle" });
  ok((await p.evaluate(theme)) === "dark", "après rechargement : la nuit est conservée malgré un système clair");

  await p.click('label[for="lang-toggle"]');
  ok(await attendre(p, () => document.querySelector(".theme-toggle .visually-hidden").textContent === "Night mode"), "nom accessible de l'interrupteur traduit en anglais");
  await p.fermer();

  // 2. Système sombre, aucun choix mémorisé : la nuit doit être posée avant l'affichage (pas de flash blanc)
  p = await nouvellePage({ colorScheme: "dark" });
  await p.addInitScript(() => {
    new MutationObserver((_, observateur) => {
      if (document.body) {
        window.__themeAuDebut = document.documentElement.dataset.theme;
        observateur.disconnect();
      }
    }).observe(document, { childList: true, subtree: true });
  });
  await p.goto(base + "/blog/", { waitUntil: "networkidle" });
  ok((await p.evaluate(() => window.__themeAuDebut)) === "dark", "système sombre → nuit déjà posée quand la page commence (pas de flash)");
  ok((await p.$("#lang-toggle")) === null && (await p.$(".theme-toggle")) !== null, "blog : interrupteur jour/nuit présent, pas de FR/EN");
  await p.fermer();

  // 3. Réduire les animations
  p = await nouvellePage({ colorScheme: "dark", reducedMotion: "reduce" });
  await p.goto(base + "/", { waitUntil: "networkidle" });
  await p.waitForTimeout(1000);
  const image1 = await p.screenshot({ clip: { x: 0, y: 60, width: 1280, height: 700 } });
  await p.waitForTimeout(1500);
  const image2 = await p.screenshot({ clip: { x: 0, y: 60, width: 1280, height: 700 } });
  ok(image1.equals(image2), "réduire les animations : particules immobiles (deux captures identiques)");
  ok((await p.evaluate(() => getComputedStyle(document.querySelector(".image-rotative")).animationName)) === "none", "réduire les animations : logo immobile");
  ok((await p.evaluate(() => getComputedStyle(document.querySelector("#scroll-down-indicator")).animationName)) === "none", "réduire les animations : flèche immobile");
  ok((await p.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)) === "auto", "réduire les animations : défilement instantané");
  ok(await p.evaluate(() => [...document.querySelectorAll(".reveal")].every((e) => getComputedStyle(e).opacity === "1")), "réduire les animations : contenu visible sans apparition progressive");
  await p.fermer();

  // 4. Sans réduction, les particules bougent
  p = await nouvellePage({ colorScheme: "dark" });
  await p.goto(base + "/", { waitUntil: "networkidle" });
  await p.waitForTimeout(1000);
  const avant = await p.screenshot({ clip: { x: 0, y: 60, width: 1280, height: 700 } });
  await p.waitForTimeout(1500);
  const apres = await p.screenshot({ clip: { x: 0, y: 60, width: 1280, height: 700 } });
  ok(!avant.equals(apres), "sans réduction : particules en mouvement");
  await p.fermer();
};
