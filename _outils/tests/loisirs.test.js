// Section « En dehors du labo » : photos pliées (<folded-image>) qui se déplient au survol, au clavier, au toucher.

const { devices } = require("playwright");

const plis = () => getComputedStyle(document.querySelector("folded-image .folded-folds")).opacity;

module.exports = async ({ base, ok, nouvellePage, attendre, toutAfficher }) => {
  let p = await nouvellePage();
  await p.goto(base + "/", { waitUntil: "networkidle" });
  ok((await p.evaluate(() => [...document.querySelectorAll("main > section")].map((s) => s.id).join(","))) === "homepage,phd,cv,projects,projects-more,hobbies,contact", "ordre des sections : …, projets, loisirs, contact");
  const images = await p.evaluate(() => [...document.querySelectorAll("folded-image")].map((f) => f.querySelectorAll("img").length));
  ok(images.length > 0 && images.every((n) => n === 2), `chaque <folded-image> affiche la photo et ses plis (${images.length} loisir(s))`);

  await toutAfficher(p);
  const image = await p.$("folded-image");
  await image.scrollIntoViewIfNeeded();
  await p.mouse.move(5, 5);
  ok(await attendre(p, () => getComputedStyle(document.querySelector("folded-image .folded-folds")).opacity === "1"), "plis visibles au repos");
  await image.hover();
  ok(await attendre(p, () => getComputedStyle(document.querySelector("folded-image .folded-folds")).opacity === "0"), "plis effacés au survol");
  await p.mouse.move(5, 5);
  await attendre(p, () => getComputedStyle(document.querySelector("folded-image .folded-folds")).opacity === "1");
  await p.focus("folded-image");
  await p.keyboard.press("Enter");
  ok((await attendre(p, () => getComputedStyle(document.querySelector("folded-image .folded-folds")).opacity === "0")) && (await p.getAttribute("folded-image", "aria-pressed")) === "true", "clavier : Entrée déplie (aria-pressed=true)");
  await p.keyboard.press(" ");
  ok(await attendre(p, () => getComputedStyle(document.querySelector("folded-image .folded-folds")).opacity === "1"), "clavier : Espace replie");

  const texteFR = await p.evaluate(() => document.querySelector(".hobby-text p").textContent.trim());
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.click('label[for="lang-toggle"]');
  ok(await attendre(p, () => document.querySelector("#hobbies .section-title").textContent.trim() === "Outside the lab"), "titre de la section traduit : Outside the lab");
  ok((await p.evaluate(() => document.querySelector(".hobby-text p").textContent.trim())) !== texteFR, "texte du premier loisir traduit");
  await p.fermer();

  p = await nouvellePage({ ...devices["iPhone 13"] });
  await p.goto(base + "/", { waitUntil: "networkidle" });
  await toutAfficher(p);
  const mobile = await p.$("folded-image");
  await mobile.scrollIntoViewIfNeeded();
  await mobile.tap();
  ok(await attendre(p, () => getComputedStyle(document.querySelector("folded-image .folded-folds")).opacity === "0"), "téléphone : toucher déplie");
  await p.fermer();

  p = await nouvellePage({ reducedMotion: "reduce" });
  await p.goto(base + "/", { waitUntil: "networkidle" });
  ok((await p.evaluate(plis)) === "1" && (await p.evaluate(() => getComputedStyle(document.querySelector("folded-image .folded-folds")).transitionDuration)) === "0s", "réduire les animations : pas de fondu");
  await p.fermer();
};
