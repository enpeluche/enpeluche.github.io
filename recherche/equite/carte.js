/*
  Carte des notions d'équité (/recherche/equite/) : diagramme des implications entre notions (les plus
  fortes en haut), panneau de détail de la notion choisie, et échelles des versions approchées α.
  Les couleurs et la mise en page sont dans carte.css ; les formules sont rendues par KaTeX.
*/
"use strict";

// Formules : chaque morceau entre $…$ est rendu par KaTeX, comme dans les articles du blog.
// Si KaTeX n'a pas pu être chargé, la formule s'affiche telle quelle.
const echapper = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const math = (s) => s.split("$").map((morceau, i) => i % 2 === 0 ? echapper(morceau)
  : window.katex ? katex.renderToString(morceau, { throwOnError: false }) : echapper(morceau)).join("");
const NODES = {
  EF:   { x: 470, y: 70,  s: "no",   fam: "Envie", full: "Sans envie (envy-free)",
          def: String.raw`$v_i(A_i) \ge v_i(A_j)$ pour tous $i, j$`,
          exist: "Pas toujours : un seul bien à partager entre deux agents suffit.",
          cx: "Décider s'il existe une allocation EF : NP-complet (réduction depuis Partition). EF + PO : Σ₂ᵖ-complet.",
          approx: "Aucun α-EF avec α > 0 n'est garantissable, d'où les relaxations « à un bien près »." },
  EFX:  { x: 470, y: 280, s: "open", fam: "Envie", full: "Sans envie à n'importe quel bien près",
          def: String.raw`$v_i(A_i) \ge v_i(A_j \setminus \{g\})$ pour tous $i, j$ et tout $g \in A_j$`,
          exist: "Prouvé pour 2 et 3 agents, ≤ 3 types d'agents, valuations identiques, ordonnées ou bi-valuées, m ≤ n + 3, et 4 agents avec ≤ 9 biens. Ouvert pour n ≥ 4 en additif. Faux pour des valuations monotones (3 agents, 8 biens, 2026).",
          cx: "2 agents avec valuations générales : PLS-complet.",
          approx: "0,618-EFX en général ; ⅔-EFX pour ≤ 7 agents. EFX exact en laissant ≤ n − 2 biens à la charité.",
          note: "Le problème phare du domaine. La version « faible » ne retire que les biens de valeur > 0." },
  EFL:  { x: 400, y: 390, s: "yes",  fam: "Envie", full: "Sans envie à un bien moins aimé près",
          def: String.raw`$A_j$ contient au plus un bien de valeur $> 0$ pour $i$, ou il existe $g \in A_j$ avec $v_i(g) \le v_i(A_i)$ et $v_i(A_i) \ge v_i(A_j \setminus \{g\})$`,
          exist: "Toujours (Barman et al.).", cx: "Polynomial, par une variante d'Envy-Cycle.",
          approx: "EFL ⇒ ½-GMMS." },
  EFR:  { x: 540, y: 390, s: "open", fam: "Envie", full: "Sans envie à un bien aléatoire près",
          def: String.raw`$v_i(A_i) \ge$ moyenne sur $g \in A_j$ de $v_i(A_j \setminus \{g\})$`,
          exist: "Ouvert (problème 7 du survey).", cx: "—",
          approx: "0,73-EFR en temps polynomial (Farhadi et al.)." },
  EF1:  { x: 470, y: 500, s: "yes",  fam: "Envie", full: "Sans envie à un bien près",
          def: String.raw`pour tous $i, j$ : $A_j = \emptyset$ ou il existe $g \in A_j$ avec $v_i(A_i) \ge v_i(A_j \setminus \{g\})$`,
          exist: "Toujours, même pour toute valuation monotone.",
          cx: "Polynomial : Round-Robin (additif), Envy-Cycle (monotone). EF1 + PO : pseudo-polynomial en général, polynomial à n fixé (Mahara) ; le cas général est le problème ouvert 1.",
          approx: "EF1 ⇒ 1/n-MMS." },
  PROP: { x: 930, y: 170, s: "no",   fam: "Proportionnalité", full: "Proportionnelle",
          def: String.raw`$v_i(A_i) \ge v_i(M) / n$ pour tout $i$`,
          exist: "Pas toujours : un seul bien suffit.", cx: "Décider s'il existe une allocation PROP : NP-complet (Partition).",
          approx: "—", note: "Avec 2 agents additifs, PROP ⇔ EF. Dès 3 agents, PROP ⇏ EF." },
  PropX:{ x: 930, y: 280, s: "no",   fam: "Proportionnalité", full: "Proportionnelle à n'importe quel bien près",
          def: String.raw`pour tout $g \notin A_i$ : $v_i(A_i \cup \{g\}) \ge v_i(M) / n$`,
          exist: "Pas toujours : 3 agents avec les valeurs 3, 3, 3, 3, 1 (Table 3 du survey).", cx: "—",
          approx: "—", note: "Pour les corvées, PropX existe toujours." },
  PropM:{ x: 930, y: 390, s: "yes",  fam: "Proportionnalité", full: "Proportionnelle au « max-min » près",
          def: String.raw`$v_i(A_i) + d_i \ge v_i(M) / n$, où $d_i = \max_{j \ne i} \, \min_{g \in A_j} v_i(g)$`,
          exist: "Toujours (Baklanov et al.).", cx: "Polynomial.", approx: "—" },
  Prop1:{ x: 930, y: 560, s: "yes",  fam: "Proportionnalité", full: "Proportionnelle à un bien près",
          def: String.raw`il existe $g \notin A_i$ avec $v_i(A_i \cup \{g\}) \ge v_i(M) / n$`,
          exist: "Toujours, et même avec PO.", cx: "Prop1 + PO en temps fortement polynomial (Barman et Krishnamurthy).", approx: "—" },
  APS:  { x: 790, y: 320, s: "no",   fam: "Parts garanties", full: "Part AnyPrice",
          def: String.raw`le plus que $i$ peut s'assurer avec un budget $1/n$, face à n'importe quels prix de somme $1$`,
          exist: "Pas toujours (APS implique MMS, qui peut échouer).", cx: "—",
          approx: "3/5-APS.", note: "Pensée pour les droits inégaux : chaque agent a alors un budget égal à son droit." },
  MMS:  { x: 790, y: 450, s: "no",   fam: "Parts garanties", full: "Part maximin",
          def: String.raw`$v_i(A_i) \ge \mu_i$, où $\mu_i$ = max, sur les partitions de $M$ en $n$ paquets, de la valeur du pire paquet`,
          exist: "Toujours pour 2 agents (je coupe, tu choisis). Pas toujours dès 3 agents (Kurokawa et al.). Existe pour les valuations bi-valuées, même personnalisées (prépublication 2026).",
          cx: "Calculer μᵢ : NP-difficile, mais il existe un PTAS.",
          approx: "7/9-MMS (Huang et Zhou, prépublication 2025) ; on ne peut pas dépasser 39/40 avec 3 agents." },
  PMMS: { x: 650, y: 280, s: "open", fam: "Parts garanties", full: "Part maximin par paires",
          def: String.raw`$v_i(A_i) \ge \mu_i^2(A_i \cup A_j)$ pour tout $j$ : $i$ se partage chaque paire de paquets en « je coupe, tu choisis »`,
          exist: "Ouvert en additif (problème 8). Faux pour des valuations monotones dès 3 agents (Byrka et al., AAAI 2026).",
          cx: "—", approx: "0,781-PMMS.", note: "PMMS ⇒ EFX : prouver PMMS réglerait EFX. PMMS et MMS sont incomparables." },
  GMMS: { x: 650, y: 170, s: "no",   fam: "Parts garanties", full: "Part maximin par groupes",
          def: String.raw`pour tout groupe $S \ni i$ : $v_i(A_i) \ge \mu_i^{|S|}\big(\bigcup_{j \in S} A_j\big)$`,
          exist: "Pas toujours (GMMS implique MMS). Existe pour les valuations binaires ou identiques.",
          cx: "—", approx: "4/7-GMMS ; le meilleur α est ouvert (problème 9)." },
  EQ:   { x: 100, y: 70,  s: "no",   fam: "Équitabilité", full: "Équitable",
          def: String.raw`$v_i(A_i) = v_j(A_j)$ pour tous $i, j$`,
          exist: "Pas toujours : un seul bien suffit.", cx: "—", approx: "—",
          note: "Compare des niveaux de satisfaction entre agents : dépend de l'échelle de chaque valuation, contrairement à l'envie." },
  EQX:  { x: 100, y: 280, s: "yes",  fam: "Équitabilité", full: "Équitable à n'importe quel bien près",
          def: String.raw`$v_i(A_i) \ge v_j(A_j \setminus \{g\})$ pour tous $i, j$ et tout $g \in A_j$`,
          exist: "Toujours (Gourvès et al.).", cx: "Polynomial. EQX + PO existe si toutes les valeurs sont > 0 (Freeman et al.).", approx: "—" },
  EQ1:  { x: 100, y: 500, s: "yes",  fam: "Équitabilité", full: "Équitable à un bien près",
          def: String.raw`il existe $g \in A_j$ avec $v_i(A_i) \ge v_j(A_j \setminus \{g\})$`,
          exist: "Toujours.", cx: "Polynomial. EQ1 + PO peut échouer avec des valeurs nulles (Exemple 5 du survey).", approx: "—" },
  MNW:  { x: 300, y: 430, s: "yes",  fam: "Efficacité", full: "Maximum de Nash welfare",
          def: String.raw`maximise $\prod_i v_i(A_i)$, après avoir maximisé le nombre d'agents de valeur $> 0$`,
          exist: "Existe toujours (c'est un optimum).",
          cx: "NP-difficile et APX-difficile (pas mieux que 1,069) ; approximation e^(1/e) ≈ 1,45.",
          approx: "MNW ⇒ Θ(1/√n)-MMS.", note: "Le seul critère de welfare usuel qui ne dépend pas de l'échelle des valuations." },
  PO:   { x: 300, y: 600, s: "yes",  fam: "Efficacité", full: "Pareto-optimale",
          def: String.raw`aucune allocation $B$ avec $v_i(B_i) \ge v_i(A_i)$ pour tout $i$ et $v_j(B_j) > v_j(A_j)$ pour un $j$`,
          exist: "Toujours (l'optimum utilitariste, par exemple).",
          cx: "Vérifier qu'une allocation donnée est PO : coNP-complet.",
          approx: "—", note: "Compatibilités : EF1 + PO oui, Prop1 + PO oui, EQX + PO oui si valeurs > 0, EFX + PO non en général (oui en bi-valué), EQ1 + PO non avec des zéros." },
  fPO:  { x: 140, y: 600, s: "yes",  fam: "Efficacité", full: "Fractionnellement Pareto-optimale",
          def: String.raw`PO même face aux allocations où les biens peuvent être coupés`,
          exist: "Toujours.", cx: "—", approx: "—",
          note: "Caractérisée par un équilibre de marché de Fisher : chacun n'achète que ses biens au meilleur rapport valeur/prix." },
};
// exact implications (additive goods); label optional
const EDGES = [
  ["EF","EFX"], ["EF","PROP"], ["EF","GMMS"], ["EFX","EFL"], ["EFX","EFR"], ["EFL","EF1"], ["EFR","EF1"],
  ["EF1","Prop1"], ["GMMS","PMMS"], ["GMMS","MMS"], ["PMMS","EFX","au sens faible"], ["PROP","PropX"],
  ["PropX","PropM"], ["PropM","Prop1"], ["PROP","APS"], ["APS","MMS"], ["EQ","EQX"], ["EQX","EQ1"],
  ["fPO","PO"], ["MNW","PO"], ["MNW","EF1"],
];
// conditional or approximate links (dashed, not used for highlighting)
const COND = [
  ["EQ","EF","⇔ si valuations identiques", true], ["EQX","EFX","", true], ["EQ1","EF1","", true],
  ["EFL","GMMS","½-GMMS", false, 0.78], ["EF1","MMS","1/n-MMS"], ["MNW","EFX","si bi-valué"],
];
const COLS = [[100,"Équitabilité"],[470,"Envie"],[720,"Parts garanties"],[930,"Proportionnalité"]];
const GLYPH = { yes: "✓", no: "✗", open: "?" };

const svg = document.getElementById("map"), NS = "http://www.w3.org/2000/svg";
const el = (tag, attrs = {}, parent = svg) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent.appendChild(e); return e; };
const label = (k) => k;
const GAUGED = ["EF", "PROP", "MMS", "GMMS", "PMMS", "APS", "EFX", "EFR"];   // nodes that carry an α gauge
// largeur des boîtes : assez pour le nom (Inter 17 px) et le symbole ✓ ✗ ? à droite
for (const k in NODES) { const n = NODES[k]; n.w = 42 + 12 * label(k).length; n.h = GAUGED.includes(k) ? 50 : 36; }

function boxPoint(n, tx, ty) {   // point on the border of node n towards (tx, ty)
  const dx = tx - n.x, dy = ty - n.y, sx = (n.w / 2 + 4) / Math.abs(dx || 1e-9), sy = (n.h / 2 + 4) / Math.abs(dy || 1e-9);
  const s = Math.min(sx, sy); return [n.x + dx * s, n.y + dy * s];
}
// α view: approximable notions become vertical rails, from the exact notion (α = 1, the box) down to α = 0
const RAILS = { EFX: 180, PMMS: 180, GMMS: 180, MMS: 220, APS: 150 };
const RAIL_ALGOS = { EFX: [[0.5, "Envy-Cycle", "left"]], MMS: [[0.5, "Envy-Cycle", "right"]] };
const LAYOUT_A = { EQ: [100, 60], EF: [470, 60], EQX: [100, 300], EFX: [470, 250], PMMS: [600, 200], GMMS: [700, 130],
  PROP: [990, 130], APS: [900, 210], MMS: [810, 290], PropX: [990, 300], PropM: [990, 440], EFR: [360, 520],
  EFL: [580, 520], EF1: [470, 620], Prop1: [990, 620], EQ1: [100, 540], MNW: [260, 470], PO: [260, 650], fPO: [110, 650] };
const COLS_A = [[100, "Équitabilité"], [470, "Envie"], [750, "Parts garanties"], [990, "Proportionnalité"]];
// [from, to, α(n), label]: "from ⇒ α-to", drawn to the matching height on the rail of "to"
const ALPHA_EDGES = [["EFL", "GMMS", () => 0.5, "½", 0.5], ["EF1", "MMS", (n) => 1 / n, "1/n", 0.5],
  ["MNW", "MMS", (n) => 2 / (1 + Math.sqrt(4 * n - 3)), "2/(1+√(4n−3))", 0.62]];
let alphaMode = false, edgeEls = [], alphaEls = [];
for (const k in NODES) NODES[k].pos = [NODES[k].x, NODES[k].y];
const railTop = (n) => n.y + n.h / 2 + 3;
const railY = (k, a) => railTop(NODES[k]) + (1 - a) * RAILS[k];

function drawRail(k, g, nAg) {
  const n = NODES[k], L = RAILS[k], S = SCALES[k], x = n.x, top = railTop(n), bot = top + L, y = (a) => railY(k, a);
  const [kv, kl] = S.known(nAg), imp = S.imp(nAg), iv = imp ? imp[0] : 1;
  const line = (y1, y2, cls) => el("line", { x1: x, y1, x2: x, y2, class: cls }, g);
  line(top, bot, "rail-bg");
  if (imp) line(top, y(iv), "rail-i");
  if (iv > kv) line(y(iv), y(kv), "rail-u");
  if (kv > 0) line(y(kv), bot, "rail-k");
  el("path", { d: `M${x - 6},${bot + 1} L${x + 6},${bot + 1} L${x},${bot + 11} z`, class: "rail-tip" }, g);
  const txt = (tx, ty, s, cls, anchor = "start") => { const t = el("text", { x: tx, y: ty, "text-anchor": anchor, class: cls }, g); t.textContent = s; };
  txt(x + 9, bot + 10, "0", "rail-text");
  if (kv > 0 && kv < 1) { el("line", { x1: x - 6, y1: y(kv), x2: x + 6, y2: y(kv), class: "rail-tick" }, g); txt(x + 10, y(kv) + 4, kl, "rail-text rail-known"); }
  for (const [a, l, side] of RAIL_ALGOS[k] || []) {
    const r = side === "right";
    el("line", { x1: r ? x : x - 6, y1: y(a), x2: r ? x + 6 : x, y2: y(a), class: "rail-tick" }, g);
    txt(r ? x + 10 : x - 10, y(a) + 4, l, "rail-text", r ? "start" : "end");
  }
  const tt = el("title", {}, g); tt.textContent = `α-${k} (n = ${nAg}) : ${frontText(k, nAg)}`;
}

function draw() {
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  const A = alphaMode, nAg = +nInput.value;
  svg.setAttribute("viewBox", A ? "0 0 1060 700" : "0 0 1040 660");
  svg.classList.toggle("alpha-view", A);
  for (const k in NODES) {
    const n = NODES[k];
    [n.x, n.y] = A ? LAYOUT_A[k] : n.pos;
    n.h = !A && GAUGED.includes(k) ? 50 : 36;
    n.gauge = null;
  }
  const defs = el("defs");
  for (const [id, cls] of [["arr","m-def"],["arr-up","m-up"],["arr-down","m-down"],["arr-a","m-a"]]) {
    const m = el("marker", { id, viewBox: "0 0 10 10", refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: "auto-start-reverse" }, defs);
    el("path", { d: "M0,0 L10,5 L0,10 z", class: cls }, m);
  }
  (A ? COLS_A : COLS).forEach(([x, t]) => { const tx = el("text", { x, y: 26, "text-anchor": "middle", class: "col-label" }); tx.textContent = t; });
  const eff = el("text", A ? { x: 185, y: 690, "text-anchor": "middle", class: "col-label" } : { x: 220, y: 650, "text-anchor": "middle", class: "col-label" });
  eff.textContent = "Efficacité";

  edgeEls = []; alphaEls = [];
  const path = (a, b, cls, both) => {
    const P = NODES[a], Q = NODES[b];
    const [x1, y1] = boxPoint(P, Q.x, Q.y), [x2, y2] = boxPoint(Q, P.x, P.y);
    const p = el("path", { d: `M${x1},${y1} L${x2},${y2}`, class: cls, "marker-end": "url(#arr)" });
    if (both) p.setAttribute("marker-start", "url(#arr)");
    return { p, mid: [(x1 + x2) / 2, (y1 + y2) / 2], at: (t) => [x1 + (x2 - x1) * t, y1 + (y2 - y1) * t] };
  };
  for (const [a, b, lab] of EDGES) {
    const { p, mid } = path(a, b, "edge");
    edgeEls.push({ a, b, p });
    if (lab) { const t = el("text", { x: mid[0], y: mid[1] - 7, "text-anchor": "middle", class: "edge-label" }); t.textContent = lab; }
  }
  const inAlpha = (a, b) => A && ALPHA_EDGES.some(([x, y]) => x === a && y === b);
  for (const [a, b, lab, both, pos] of COND) {
    if (inAlpha(a, b)) continue;   // drawn on the rail instead
    const { at } = path(a, b, "edge cond", both);
    const [lx, ly] = at(pos ?? 0.5);
    if (lab) { const t = el("text", { x: lx + (pos ? 26 : 0), y: ly - 7, "text-anchor": "middle", class: "edge-label cond-label" }); t.textContent = lab; }
  }
  if (A) for (const [a, b, f, lab, lt] of ALPHA_EDGES) {
    const alpha = f(nAg), tx = NODES[b].x - 5, ty = railY(b, alpha);
    const [x1, y1] = boxPoint(NODES[a], tx, ty);
    const p = el("path", { d: `M${x1},${y1} L${tx},${ty}`, class: "edge alpha", "marker-end": "url(#arr-a)" });
    const c = el("circle", { cx: NODES[b].x, cy: ty, r: 4.5, class: "rail-dot" });
    const t = el("text", { x: x1 + (tx - x1) * lt, y: y1 + (ty - y1) * lt - 7, "text-anchor": "middle", class: "edge-label alpha-label" });
    t.textContent = `${lab}-${b}`;
    alphaEls.push({ a, b, p, c, t });
  }
  for (const k in NODES) {
    const n = NODES[k];
    const g = el("g", { class: `node ${n.s}`, tabindex: 0, role: "button", "data-k": k,
      "aria-label": `${k}, ${n.full}, ${ {yes:"existe toujours",no:"pas toujours",open:"ouvert"}[n.s] }` });
    if (A && RAILS[k]) drawRail(k, g, nAg);
    el("rect", { x: n.x - n.w / 2, y: n.y - n.h / 2, width: n.w, height: n.h, rx: 9, class: "box" }, g);
    const dy = n.h === 50 ? -6 : 0;   // gauged nodes: name a bit higher, gauge underneath
    const t = el("text", { x: n.x - 6, y: n.y + 6 + dy, "text-anchor": "middle" }, g); t.textContent = label(k);
    const gl = el("text", { x: n.x + n.w / 2 - 11, y: n.y + 5 + dy, "text-anchor": "middle", class: "glyph" }, g); gl.textContent = GLYPH[n.s];
    if (n.h === 50) n.gauge = el("g", { class: "gauge" }, g);
    n.el = g;
    g.addEventListener("click", () => select(k));
    g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(k); } });
  }
  if (!A) updateGauges();
}

const out = {}, inn = {};
for (const k in NODES) { out[k] = []; inn[k] = []; }
for (const [a, b] of EDGES) { out[a].push(b); inn[b].push(a); }
function reach(start, adj) { const seen = new Set(), st = [start]; while (st.length) { const u = st.pop(); for (const w of adj[u]) if (!seen.has(w)) { seen.add(w); st.push(w); } } return seen; }

const STATUS = { yes: ["yes", "✓ existe toujours"], no: ["no", "✗ pas toujours"], open: ["open", "? ouvert"] };
const order = Object.keys(NODES);
const linkList = (set, cls) => set.size
  ? [...set].sort((a, b) => order.indexOf(a) - order.indexOf(b)).map((k) => `<button class="${cls}" data-go="${k}">${k}</button>`).join("")
  : `<span class="none">aucune</span>`;

function select(k, keepScales) {
  selected = k;
  if (!keepScales && colonneEtroite()) {
    // la ligne dépliée change : on redessine les échelles, en gardant le focus clavier sur la ligne choisie
    const ligneActive = document.activeElement && document.activeElement.closest && document.activeElement.closest(".srow");
    renderScales();
    if (ligneActive) document.querySelector(`.srow[data-k="${k}"]`)?.focus({ preventScroll: true });
  } else if (!keepScales) document.querySelectorAll(".srow").forEach((r) => r.classList.toggle("sel", r.dataset.k === k));
  const n = NODES[k], up = reach(k, inn), down = reach(k, out);
  svg.classList.add("has-sel");
  for (const j in NODES) NODES[j].el.classList.remove("sel", "up", "down");
  n.el.classList.add("sel");
  up.forEach((j) => NODES[j].el.classList.add("up"));
  down.forEach((j) => NODES[j].el.classList.add("down"));
  for (const { a, b, p } of edgeEls) {
    // an edge is on a path towards k (stronger side) or away from k (weaker side)
    const isUp = up.has(a) && (up.has(b) || b === k);
    const isDown = (a === k || down.has(a)) && down.has(b);
    p.classList.remove("on", "up", "down"); p.setAttribute("marker-end", "url(#arr)");
    if (isUp) { p.classList.add("on", "up"); p.setAttribute("marker-end", "url(#arr-up)"); }
    else if (isDown) { p.classList.add("on", "down"); p.setAttribute("marker-end", "url(#arr-down)"); }
  }
  for (const e of alphaEls) [e.p, e.c, e.t].forEach((x) => x.classList.toggle("on", e.a === k || e.b === k));
  const [cls, txt] = STATUS[n.s];
  const sec = (title, body) => body && body !== "—" ? `<section><h3>${title}</h3><p>${body}</p></section>` : "";
  document.getElementById("detail").innerHTML = `
    <div class="detail-entete">
      <div><h2>${k}</h2><p class="full">${n.full} · ${n.fam}</p></div>
      <p class="def">${math(n.def)}</p>
      <div><span class="chip ${cls}">${txt}</span></div>
    </div>
    ${sec("Existence", n.exist)}${sec("Complexité", n.cx)}${sec("Approximations", n.approx)}
    ${SCALES[k] ? `<section class="mini"><h3>Échelle <span class="maths">α</span> (<span class="maths">n</span> = ${nInput.value})</h3><p class="note">${frontText(k, +nInput.value)}</p>${scaleHTML(k, +nInput.value, miniWidth())}</section>` : ""}
    <section><h3>Implique</h3><div class="links">${linkList(down, "down")}</div></section>
    <section><h3>Est impliquée par</h3><div class="links">${linkList(up, "up")}</div></section>
    ${n.note ? `<p class="note">${n.note}</p>` : ""}`;
  document.querySelectorAll("#detail [data-go]").forEach((b) => b.addEventListener("click", () => { select(b.dataset.go); NODES[b.dataset.go].el.focus(); }));
  // L'échelle du détail est dans une colonne : on la redessine à la largeur réelle de cette colonne
  const mini = document.querySelector("#detail .mini");
  if (mini) mini.querySelector(".scale").outerHTML = scaleHTML(k, +nInput.value, Math.max(160, mini.clientWidth - 20));
  if (!keepScales) montrerLigne(k);
}

// Notion choisie dans le diagramme : on fait défiler la colonne des échelles jusqu'à sa ligne
// (sans faire bouger la page elle-même)
function montrerLigne(k) {
  const panneau = document.querySelector(".carte .alpha"), ligne = document.querySelector(`.srow[data-k="${k}"]`);
  if (!ligne || panneau.scrollHeight <= panneau.clientHeight) return;
  const haut = panneau.getBoundingClientRect().top + document.querySelector(".carte .alpha-head").offsetHeight;
  const r = ligne.getBoundingClientRect();
  if (r.top >= haut && r.bottom <= panneau.getBoundingClientRect().bottom) return;
  const doux = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  panneau.scrollBy({ top: r.top - haut - 8, behavior: doux ? "smooth" : "auto" });
}

// ------------------------------------------------------------------ α scales
// known(n): largest α proven achievable for every instance; imp(n): smallest α known to fail on some
// instance (null = no impossibility known below 1). Values are [number, label].
const F = (v, l) => [v, l];
const mmsImp = (n) => n === 2 ? null : n === 3 ? F(39 / 40, "39/40") : F(1 - 1 / n ** 4, "1 − 1/n⁴");
const SCALES = {
  EF:   { def: String.raw`$v_i(A_i) \ge \alpha \cdot v_i(A_j)$`, known: () => F(0, "0"), imp: () => F(0, "tout α > 0"), marks: () => [],
          why: "Un seul bien : celui qui n'a rien ne peut avoir α fois quelque chose de positif." },
  PROP: { def: String.raw`$v_i(A_i) \ge \alpha \cdot v_i(M)/n$`, known: () => F(0, "0"), imp: () => F(0, "tout α > 0"), marks: () => [],
          why: "Même obstacle qu'EF : un seul bien suffit." },
  MMS:  { def: String.raw`$v_i(A_i) \ge \alpha \cdot \mu_i$`,
          known: (n) => n === 2 ? F(1, "1") : n === 3 ? F(11 / 12, "11/12") : n === 4 ? F(4 / 5, "4/5") : F(7 / 9, "7/9"),
          imp: mmsImp,
          marks: (n) => [
            { v: 1 / n, l: "EF1 ⇒ 1/n" },
            { v: 2 / (1 + Math.sqrt(4 * n - 3)), l: "MNW ⇒ 2/(1+√(4n−3))" },
            { v: 0.5, l: "Envy-Cycle, Bag-Filling" },
            { v: 1, l: "PROP, APS, GMMS ⇒" }],
          why: (n) => n === 2 ? "Deux agents : je coupe, tu choisis." : n === 3 ? "3 agents : 11/12 garanti, 39/40 impossible (Feige, Sapir et Tauber)." : n === 4 ? "4 agents : 4/5 (Ghodsi et al.)." : "Cas général : 7/9 (Huang et Zhou, prépublication 2025) ; impossibilité 1 − 1/n⁴ d'après Heidari et al." },
  GMMS: { def: String.raw`$\alpha \cdot \mu$ pour chaque groupe d'agents`, known: (n) => n === 2 ? F(1, "1") : F(4 / 7, "4/7"), imp: mmsImp,
          marks: () => [{ v: 0.5, l: "EFL ⇒ ½" }, { v: 1, l: "EF ⇒" }],
          why: (n) => n === 2 ? "Avec deux agents, GMMS revient à MMS, qui existe." : "GMMS ⇒ MMS : l'impossibilité de MMS s'applique." },
  PMMS: { def: String.raw`$v_i(A_i) \ge \alpha \cdot \mu_i^2(A_i \cup A_j)$`, known: (n) => n === 2 ? F(1, "1") : F(0.781, "0,781"), imp: () => null,
          marks: () => [{ v: 0.618, l: "MNW ⇒ 0,618" }, { v: 1, l: "GMMS, EF ⇒" }],
          why: (n) => n === 2 ? "Avec deux agents, PMMS revient à MMS, qui existe." : "Aucune impossibilité connue en additif : PMMS exact est peut-être toujours possible (problème ouvert 8)." },
  APS:  { def: String.raw`$v_i(A_i) \ge \alpha \cdot \mathrm{APS}_i$`, known: () => F(0.6, "3/5"), imp: (n) => mmsImp(n),
          marks: () => [{ v: 1, l: "PROP ⇒" }],
          why: "α-APS ⇒ α-MMS, donc l'impossibilité de MMS s'applique aussi." },
  EFX:  { def: String.raw`$v_i(A_i) \ge \alpha \cdot v_i(A_j \setminus \{g\})$ pour tout $g$`,
          known: (n) => n <= 3 ? F(1, "1") : n <= 7 ? F(2 / 3, "⅔") : F(0.618, "0,618"), imp: () => null,
          marks: () => [{ v: 0.5, l: "Envy-Cycle ⇒ ½" }, { v: 1, l: "PMMS, EF ⇒" }],
          why: (n) => n <= 3 ? "EFX existe pour 2 et 3 agents." : "Aucune impossibilité connue en additif. Pour des valuations monotones, EFX exact peut échouer (2026)." },
  EFR:  { def: String.raw`$v_i(A_i) \ge \alpha \cdot$ moyenne des $v_i(A_j \setminus \{g\})$`, known: (n) => n <= 3 ? F(1, "1") : F(0.73, "0,73"), imp: () => null,
          marks: () => [{ v: 1, l: "EFX ⇒" }],
          why: (n) => n <= 3 ? "EFX existe pour n ≤ 3, et EFX ⇒ EFR." : "0,73 en temps polynomial (Farhadi et al.) ; problème ouvert 7." },
};
const pct = (v) => `${(v * 100).toFixed(2)}%`;
function scaleHTML(key, n, W = 700, compacte = false) {
  const S = SCALES[key], [kv, kl] = S.known(n), imp = S.imp(n);
  const iv = imp ? imp[0] : 1;
  let h = `<div class="scale${compacte ? " compacte" : ""}"><div class="bar">`;
  if (kv > 0) h += `<div class="seg known" style="left:0;width:${pct(kv)}"></div>`;
  if (iv > kv) h += `<div class="seg unknown" style="left:${pct(kv)};width:${pct(iv - kv)}"></div>`;
  if (imp) h += `<div class="seg imp" style="left:${pct(Math.max(iv, 0.004))};width:${pct(1 - Math.max(iv, 0.004))}"></div>`;
  h += `</div>`;
  for (const t of [[0, "0"], [0.25, "¼"], [0.5, "½"], [0.75, "¾"], [1, "1"]]) h += `<span class="tick" style="left:${pct(t[0])}">${t[1]}</span>`;
  if (compacte) return h + `</div>`;   // ligne repliée : pas de repères
  // markers: each label is placed (in px, for a scale W px wide) on the first of three rows where it
  // does not collide; its pin (stem + arrow head) touches the bar exactly at α
  const marks = S.marks(n).slice().sort((a, b) => a.v - b.v);
  const rowsEnd = [-1e9, -1e9, -1e9];
  for (const m of marks) {
    const lw = m.l.length * 7.4 + 8;
    const left = Math.max(-6, Math.min(W - lw + 6, m.v * W - lw / 2));
    let row = rowsEnd.findIndex((end) => left > end + 6);
    if (row < 0) row = 2;
    rowsEnd[row] = left + lw;
    const top = row * 17, pinTop = top + 17;
    h += `<span class="mlabel" style="left:${left.toFixed(1)}px;top:${top}px">${m.l}</span>`
      + `<div class="mpin" style="left:${pct(m.v)};top:${pinTop}px;height:${64 - pinTop}px"><div class="stem"></div><i></i></div>`;
  }
  return h + `</div>`;
}
function frontText(key, n) {
  const S = SCALES[key], [kv, kl] = S.known(n), imp = S.imp(n);
  const a = kv > 0 ? `garanti jusqu'à ${kl}` : "rien de garanti";
  const b = imp ? (imp[0] === 0 ? "impossible pour tout α > 0" : `impossible au-delà de ${imp[1]}`) : (kv < 1 ? "aucune impossibilité connue" : "");
  return [a, b].filter(Boolean).join(" · ");
}
const nInput = document.getElementById("n-agents"), nOut = document.getElementById("n-out");
let selected = "EFX";
function scaleWidth() {   // pixel width of a scale in the α section (two columns above 640px)
  const w = document.getElementById("scales").clientWidth;
  return Math.max(160, w < 640 ? w - 16 - 28 : w - 16 - 230 - 22 - 28);
}
const miniWidth = () => Math.max(160, document.getElementById("detail").clientWidth - 44 - 20);
// Colonne étroite (à droite du diagramme, ou téléphone) : une ligne courte par notion, et seule la
// notion choisie est dépliée (formule et repères). En pleine largeur, toutes sont dépliées.
const colonneEtroite = () => document.getElementById("scales").clientWidth < 640;
function renderScales() {
  const n = +nInput.value, W = scaleWidth(), etroite = colonneEtroite();
  nOut.textContent = `n = ${n}`;
  document.getElementById("scales").innerHTML = Object.keys(SCALES).map((k) => {
    const why = typeof SCALES[k].why === "function" ? SCALES[k].why(n) : SCALES[k].why;
    const ouverte = !etroite || k === selected;
    return `<div class="srow${k === selected ? " sel" : ""}${ouverte ? "" : " repliee"}" data-k="${k}" tabindex="0" role="button" aria-label="α-${k} : ${frontText(k, n)}">
      <div><div class="name">α-${k}</div>${ouverte ? `<div class="sdef">${math(SCALES[k].def)}</div>` : ""}<div class="front">${frontText(k, n)}</div></div>
      <div title="${why}">${scaleHTML(k, n, W, !ouverte)}</div></div>`;
  }).join("");
  document.querySelectorAll(".srow").forEach((r) => {
    r.addEventListener("click", () => select(r.dataset.k));
    r.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(r.dataset.k); } });
  });
}
function updateGauges() {   // mini α gauge inside each gauged node: known / unknown / impossible
  const nAg = +nInput.value;
  for (const k of GAUGED) {
    const n = NODES[k], g = n.gauge, S = SCALES[k];
    if (!g) continue;
    while (g.firstChild) g.removeChild(g.firstChild);
    const [kv] = S.known(nAg), imp = S.imp(nAg), iv = imp ? Math.max(imp[0], 0.03) : 1;
    const x0 = n.x - n.w / 2 + 9, W = n.w - 18, y = n.y + 9, h = 6;
    el("rect", { x: x0, y, width: W, height: h, rx: 3, class: "gbg" }, g);
    if (kv > 0) el("rect", { x: x0, y, width: W * kv, height: h, class: "gk" }, g);
    if (iv > kv) el("rect", { x: x0 + W * kv, y, width: W * (iv - kv), height: h, class: "gu" }, g);
    if (imp) el("rect", { x: x0 + W * iv, y, width: W * (1 - iv), height: h, class: "gi" }, g);
    const tt = el("title", {}, g); tt.textContent = `α-${k} (n = ${nAg}) : ${frontText(k, nAg)}`;
  }
}
const gaugeBox = document.getElementById("show-gauges");
gaugeBox.addEventListener("change", () => svg.classList.toggle("hide-gauges", !gaugeBox.checked));
nInput.addEventListener("input", () => { renderScales(); draw(); select(selected, true); });
function setView(a) {
  alphaMode = a;
  document.getElementById("view-impl").classList.toggle("active", !a);
  document.getElementById("view-alpha").classList.toggle("active", a);
  document.getElementById("view-impl").setAttribute("aria-pressed", !a);
  document.getElementById("view-alpha").setAttribute("aria-pressed", a);
  document.getElementById("gauge-toggle").hidden = a;
  document.getElementById("alpha-hint").hidden = !a;
  draw(); select(selected, true);
}
document.getElementById("view-impl").addEventListener("click", () => setView(false));
document.getElementById("view-alpha").addEventListener("click", () => setView(true));
let resizeTimer;
window.addEventListener("resize", () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(() => { renderScales(); select(selected, true); }, 120); });

const cond = document.getElementById("show-cond");
cond.addEventListener("change", () => svg.classList.toggle("hidden-cond", !cond.checked));
renderScales();
draw();
select("EFX", true); // au chargement, la colonne des échelles reste en haut
