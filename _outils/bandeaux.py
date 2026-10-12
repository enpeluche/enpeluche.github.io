"""Bandeaux des cartes projets (assets/img/bandeaux/*.svg).

Un seul style pour tous : traits fins et points, sur fond transparent. Le SVG ne sert que de
forme : sur le site, il est appliqué en masque CSS (voir .project-banner dans project-card.css)
et prend donc la couleur violette du thème, de jour comme de nuit. Seules comptent les
opacités ; la couleur du SVG lui-même est ignorée.

Usage (depuis la racine du dépôt) : python3 _outils/bandeaux.py
Dépendance : numpy (pip install numpy).
"""

import math
import random
from collections import deque
from pathlib import Path

import numpy as np

W, H = 600, 150
OUTPUT_DIR = Path(__file__).resolve().parent.parent / "assets" / "img" / "bandeaux"


def svg(body, marker=False):
    defs = ""
    if marker:
        defs = ('<defs><marker id="tip" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" '
                'orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="black" stroke="none"/></marker></defs>\n')
    return (f'<svg viewBox="0 0 {W} {H}" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="black" '
            f'stroke-linecap="round" stroke-linejoin="round">\n{defs}{body}\n</svg>\n')


def fmt(x):
    return f"{x:.1f}"


# ---------------------------------------------------------------- lignes de niveau

def contour_segments(values, xs, ys, level):
    """Marching squares : segments de la courbe values = level sur la grille (xs, ys)."""
    segments = []
    ny, nx = values.shape
    for j in range(ny - 1):
        for i in range(nx - 1):
            corners = [(xs[i], ys[j], values[j, i]), (xs[i + 1], ys[j], values[j, i + 1]),
                       (xs[i + 1], ys[j + 1], values[j + 1, i + 1]), (xs[i], ys[j + 1], values[j + 1, i])]
            crossings = []
            for k in range(4):
                (x0, y0, v0), (x1, y1, v1) = corners[k], corners[(k + 1) % 4]
                if (v0 - level) * (v1 - level) < 0:
                    t = (level - v0) / (v1 - v0)
                    crossings.append((x0 + t * (x1 - x0), y0 + t * (y1 - y0)))
            if len(crossings) == 2:
                segments.append(crossings)
            elif len(crossings) == 4:  # case ambiguë : on relie deux à deux
                segments += [crossings[:2], crossings[2:]]
    return segments


def segments_path(segments, attrs):
    """Recolle les segments bout à bout en lignes brisées (fichier bien plus léger)."""
    def key(p):
        return (round(p[0], 2), round(p[1], 2))

    ends = {}
    for i, (a, b) in enumerate(segments):
        ends.setdefault(key(a), []).append(i)
        ends.setdefault(key(b), []).append(i)
    used, lines = set(), []
    for start in range(len(segments)):
        if start in used:
            continue
        used.add(start)
        line = list(segments[start])
        for forward in (True, False):  # prolonger d'un côté, puis de l'autre
            while True:
                tip = line[-1] if forward else line[0]
                nxt = next((i for i in ends[key(tip)] if i not in used), None)
                if nxt is None:
                    break
                used.add(nxt)
                a, b = segments[nxt]
                other = b if key(a) == key(tip) else a
                if forward:
                    line.append(other)
                else:
                    line.insert(0, other)
        lines.append(line)
    d = " ".join("M" + " L".join(f"{fmt(x)},{fmt(y)}" for x, y in line) for line in lines)
    return f'<path d="{d}" {attrs}/>'


# ---------------------------------------------------------------- réduction de réseaux

def reseaux():
    """Mauvaise base (longue, presque plate) et base réduite (courte, presque orthogonale)."""
    O = (150, 128)
    r1, r2 = (30.0, 8.0), (-7.0, 26.0)
    b1 = (3 * r1[0] + r2[0], 3 * r1[1] + r2[1])  # matrice de passage de déterminant 1 : même réseau
    b2 = (2 * r1[0] + r2[0], 2 * r1[1] + r2[1])

    def P(v):
        return (O[0] + v[0], O[1] - v[1])

    def fade(x, y):
        return max(0.0, 1 - math.hypot(x - O[0], (y - O[1]) * 1.6) / 470)

    points = {}
    for k in range(-30, 31):
        for l in range(-30, 31):
            x, y = P((k * r1[0] + l * r2[0], k * r1[1] + l * r2[1]))
            if -10 <= x <= W + 10 and -10 <= y <= H + 10:
                points[(k, l)] = (x, y)

    parts = []
    for (k, l), (x, y) in points.items():
        for dk, dl in ((1, 0), (0, 1), (1, -1)):
            q = points.get((k + dk, l + dl))
            if q:
                a = fade((x + q[0]) / 2, (y + q[1]) / 2) ** 4 * 0.45
                if a > 0.03:
                    parts.append(f'<line x1="{fmt(x)}" y1="{fmt(y)}" x2="{fmt(q[0])}" y2="{fmt(q[1])}" stroke-width="0.8" opacity="{a:.2f}"/>')
    for x, y in points.values():
        parts.append(f'<circle cx="{fmt(x)}" cy="{fmt(y)}" r="1.8" fill="black" stroke="none" opacity="{max(0.12, fade(x, y)):.2f}"/>')

    def parallelogram(u, v, attrs):
        a, b, c, d = P((0, 0)), P(u), P((u[0] + v[0], u[1] + v[1])), P(v)
        return f'<path d="M{fmt(a[0])},{fmt(a[1])} L{fmt(b[0])},{fmt(b[1])} L{fmt(c[0])},{fmt(c[1])} L{fmt(d[0])},{fmt(d[1])} Z" {attrs}/>'

    parts.append(parallelogram(b1, b2, 'stroke-width="1" stroke-dasharray="4 4" opacity="0.55"'))
    for v in (b1, b2):
        x, y = P(v)
        parts.append(f'<line x1="{O[0]}" y1="{O[1]}" x2="{fmt(x)}" y2="{fmt(y)}" stroke-width="1.4" stroke-dasharray="4 4" opacity="0.7" marker-end="url(#tip)"/>')
    parts.append(parallelogram(r1, r2, 'fill="black" fill-opacity="0.14" stroke="none"'))
    for v in (r1, r2):
        x, y = P(v)
        parts.append(f'<line x1="{O[0]}" y1="{O[1]}" x2="{fmt(x)}" y2="{fmt(y)}" stroke-width="2.4" marker-end="url(#tip)"/>')
    parts.append(f'<circle cx="{O[0]}" cy="{O[1]}" r="3" fill="black" stroke="none"/>')
    return svg("\n".join(parts), marker=True)


# ---------------------------------------------------------------- Beckett-Gray

def beckett_gray_code(n):
    """Code de Gray cyclique où un bit repassant à 0 est toujours le plus ancien bit à 1."""
    total = 1 << n
    visited, seq, queue = {0}, [0], deque()

    def step(state):
        if len(seq) == total:
            return len(queue) == 1 and state ^ (1 << queue[0]) == 0
        if queue:  # éteindre le plus ancien bit allumé
            b = queue[0]
            nxt = state ^ (1 << b)
            if nxt not in visited:
                queue.popleft(); visited.add(nxt); seq.append(nxt)
                if step(nxt):
                    return True
                seq.pop(); visited.discard(nxt); queue.appendleft(b)
        for b in range(n):  # allumer un bit éteint
            if not state >> b & 1:
                nxt = state | (1 << b)
                if nxt not in visited:
                    queue.append(b); visited.add(nxt); seq.append(nxt)
                    if step(nxt):
                        return True
                    seq.pop(); visited.discard(nxt); queue.pop()
        return False

    return seq if step(0) else None


def beckett_gray():
    """Le code en frise : une colonne par mot (32), une ligne par bit (5), case pleine = 1."""
    n = 5
    code = beckett_gray_code(n)
    gap = 3.0
    cell = min((W - 40 - gap * (len(code) - 1)) / len(code), (H - 30 - gap * (n - 1)) / n)
    x0 = (W - (len(code) * cell + gap * (len(code) - 1))) / 2
    y0 = (H - (n * cell + gap * (n - 1))) / 2
    parts = []
    for c, word in enumerate(code):
        for r in range(n):
            x, y = x0 + c * (cell + gap), y0 + r * (cell + gap)
            if word >> (n - 1 - r) & 1:
                parts.append(f'<rect x="{fmt(x)}" y="{fmt(y)}" width="{fmt(cell)}" height="{fmt(cell)}" rx="3" fill="black" stroke="none" opacity="0.9"/>')
            else:
                parts.append(f'<rect x="{fmt(x)}" y="{fmt(y)}" width="{fmt(cell)}" height="{fmt(cell)}" rx="3" stroke-width="1" opacity="0.3"/>')
    return svg("\n".join(parts))


# ---------------------------------------------------------------- empilement compact

def empilement():
    """Empilement hexagonal de disques ; un disque et ses 6 voisins (nombre de contact) mis en valeur."""
    r = 17.0
    cx, cy = W / 2, H / 2
    parts, centers = [], []
    for j in range(-5, 6):
        for i in range(-12, 13):
            x = cx + (i + (j % 2) * 0.5) * 2 * r
            y = cy + j * r * math.sqrt(3)
            if -r <= x <= W + r and -r <= y <= H + r:
                centers.append((x, y))
    for x, y in centers:
        d = math.hypot(x - cx, y - cy)
        if d < 1:
            parts.append(f'<circle cx="{fmt(x)}" cy="{fmt(y)}" r="{r - 1.5:.1f}" fill="black" fill-opacity="0.22" stroke-width="2.2"/>')
        elif d < 2 * r + 1:
            parts.append(f'<circle cx="{fmt(x)}" cy="{fmt(y)}" r="{r - 1.5:.1f}" stroke-width="2"/>')
            parts.append(f'<line x1="{fmt(cx)}" y1="{fmt(cy)}" x2="{fmt(x)}" y2="{fmt(y)}" stroke-width="1" opacity="0.55"/>')
        else:
            a = max(0.1, 1 - math.hypot(x - cx, (y - cy) * 1.4) / 330) * 0.8
            parts.append(f'<circle cx="{fmt(x)}" cy="{fmt(y)}" r="{r - 1.5:.1f}" stroke-width="1.1" opacity="{a:.2f}"/>')
    return svg("\n".join(parts))


# ---------------------------------------------------------------- transformée de Weyl

def weyl():
    """Lignes de niveau de la fonction de Wigner d'un état « chat » (superposition de deux états
    cohérents) : deux taches gaussiennes et, entre elles, des franges d'interférence.
    Valeurs négatives (purement quantiques) en pointillés."""
    a = 3.0
    scale = 50.0  # pixels par unité, identique sur les deux axes
    xs = np.linspace(-W / 2 / scale, W / 2 / scale, 301)
    ps = np.linspace(-H / 2 / scale, H / 2 / scale, 76)
    X, P = np.meshgrid(xs, ps)
    Wig = np.exp(-(X - a) ** 2 - P ** 2) + np.exp(-(X + a) ** 2 - P ** 2) + 2 * np.exp(-X ** 2 - P ** 2) * np.cos(2 * a * P)
    Wig /= Wig.max()
    px = xs * scale + W / 2
    py = H / 2 - ps * scale

    parts = []
    for level in (0.08, 0.25, 0.45, 0.65, 0.85):
        segs = contour_segments(Wig, px, py, level)
        parts.append(segments_path(segs, f'stroke-width="{1 + 1.2 * level:.1f}" opacity="{0.35 + 0.6 * level:.2f}"'))
    for level in (-0.08, -0.3, -0.55):
        segs = contour_segments(Wig, px, py, level)
        parts.append(segments_path(segs, f'stroke-width="1.2" stroke-dasharray="3 3" opacity="{0.4 + 0.5 * abs(level):.2f}"'))
    # axes de l'espace des phases (position x, impulsion p), très discrets
    parts.append(f'<line x1="20" y1="{H / 2}" x2="{W - 20}" y2="{H / 2}" stroke-width="0.8" opacity="0.18"/>')
    parts.append(f'<line x1="{W / 2}" y1="8" x2="{W / 2}" y2="{H - 8}" stroke-width="0.8" opacity="0.18"/>')
    return svg("\n".join(parts))


# ---------------------------------------------------------------- solveur WSRP

def two_opt(route):
    """Retourne des portions de la tournée tant que cela la raccourcit (supprime les croisements)."""
    improved = True
    while improved:
        improved = False
        for i in range(1, len(route) - 2):
            for j in range(i + 1, len(route) - 1):
                a, b, c, d = route[i - 1], route[i], route[j], route[j + 1]
                if math.dist(a, c) + math.dist(b, d) < math.dist(a, b) + math.dist(c, d) - 1e-9:
                    route[i:j + 1] = route[i:j + 1][::-1]
                    improved = True
    return route


def wsrp():
    """Un dépôt et des clients ; chaque technicien fait une tournée (style de trait différent).
    Tournées construites par balayage angulaire autour du dépôt, puis raccourcies par 2-opt."""
    rng = random.Random(7)
    depot = (W / 2, H / 2)
    clients = []
    while len(clients) < 24:
        p = (rng.uniform(25, W - 25), rng.uniform(18, H - 18))
        if math.dist(p, depot) > 45 and all(math.dist(p, q) > 38 for q in clients):
            clients.append(p)

    def angle(p):
        return math.atan2(p[1] - depot[1], (p[0] - depot[0]) / 3)  # bandeau 4:1 : on « redresse » les angles

    clients.sort(key=angle)
    k = 4
    size = len(clients) // k
    shift = size // 2  # pour que les secteurs ne coupent pas pile à gauche
    clients = clients[shift:] + clients[:shift]
    tours = [two_opt([depot] + clients[t * size:(t + 1) * size] + [depot]) for t in range(k)]

    styles = ['stroke-width="2"', 'stroke-width="1.6" stroke-dasharray="7 5"',
              'stroke-width="2" stroke-dasharray="0.1 5"', 'stroke-width="1.6" stroke-dasharray="10 4 2 4"']
    parts = []
    for tour, style in zip(tours, styles):
        d = " ".join(f"{'M' if i == 0 else 'L'}{fmt(x)},{fmt(y)}" for i, (x, y) in enumerate(tour))
        parts.append(f'<path d="{d}" {style} opacity="0.8"/>')
    for x, y in clients:
        parts.append(f'<circle cx="{fmt(x)}" cy="{fmt(y)}" r="3.2" fill="black" stroke="none"/>')
        parts.append(f'<circle cx="{fmt(x)}" cy="{fmt(y)}" r="6.5" stroke-width="1" opacity="0.35"/>')  # fenêtre de temps
    parts.append(f'<rect x="{depot[0] - 7}" y="{depot[1] - 7}" width="14" height="14" rx="2" fill="black" stroke="none"/>')
    return svg("\n".join(parts))


# ---------------------------------------------------------------- ray tracing

def ray_tracing():
    """Coupe y = 0 du cœur de Taubin, (x² + z² − 1)³ − x² z³ = 0. Un rayon part de l'œil par
    pixel de l'écran et s'arrête au premier point d'intersection, trouvé par changement de signe ;
    le pixel est plein si le rayon touche le cœur, vide sinon."""
    def f(x, z):
        return (x * x + z * z - 1) ** 3 - x * x * z ** 3

    scale, center = 52.0, (W * 0.71, H / 2 + 6)  # œil et cœur centrés ensemble dans le bandeau

    def to_px(x, z):
        return (center[0] + x * scale, center[1] - z * scale)

    xs = np.linspace(-1.6, 1.6, 161)
    zs = np.linspace(-1.4, 1.6, 151)
    X, Z = np.meshgrid(xs, zs)
    F = (X * X + Z * Z - 1) ** 3 - X * X * Z ** 3
    parts = [segments_path(contour_segments(F, xs * scale + center[0], center[1] - zs * scale, 0.0), 'stroke-width="2.4"')]

    eye = (-6.0, 0.2)
    screen_x = -2.6
    ex, ey = to_px(*eye)
    n = 13
    pixel = 0.25 * (screen_x - eye[0]) / (0 - eye[0]) * scale * 0.75  # côté d'un pixel, en px
    for k in range(n):
        target_z = -1.5 + k * 0.25  # direction visée, à l'aplomb du centre du cœur
        dx, dz = 0 - eye[0], target_z - eye[1]
        norm = math.hypot(dx, dz)
        dx, dz = dx / norm, dz / norm
        hit, prev = None, f(*eye)
        for t in np.linspace(0, 10, 4000):
            x, z = eye[0] + t * dx, eye[1] + t * dz
            cur = f(x, z)
            if prev > 0 >= cur:
                hit = (x, z)
                break
            prev = cur
        sx, sy = to_px(screen_x, eye[1] + (screen_x - eye[0]) / dx * dz)
        if hit:
            hx, hy = to_px(*hit)
            parts.append(f'<line x1="{fmt(ex)}" y1="{fmt(ey)}" x2="{fmt(hx)}" y2="{fmt(hy)}" stroke-width="1" opacity="0.6"/>')
            parts.append(f'<circle cx="{fmt(hx)}" cy="{fmt(hy)}" r="2.6" fill="black" stroke="none"/>')
        else:  # rayon qui manque le cœur
            x2, y2 = to_px(eye[0] + 9 * dx, eye[1] + 9 * dz)
            parts.append(f'<line x1="{fmt(ex)}" y1="{fmt(ey)}" x2="{fmt(x2)}" y2="{fmt(y2)}" stroke-width="1" stroke-dasharray="3 4" opacity="0.3"/>')
        style = 'fill="black" stroke="none" opacity="0.85"' if hit else 'stroke-width="1" opacity="0.5"'
        parts.append(f'<rect x="{fmt(sx - pixel / 2)}" y="{fmt(sy - pixel / 2)}" width="{fmt(pixel)}" height="{fmt(pixel)}" rx="1" {style}/>')
    parts.append(f'<circle cx="{fmt(ex)}" cy="{fmt(ey)}" r="4" fill="black" stroke="none"/>')
    return svg("\n".join(parts))


# ---------------------------------------------------------------- portfolio

def star_points(cx, cy, outer, inner, branches=8):
    pts = []
    for k in range(2 * branches):
        r = outer if k % 2 == 0 else inner
        a = math.pi / 2 + k * math.pi / branches
        pts.append((cx + r * math.cos(a), cy - r * math.sin(a)))
    return "M" + " L".join(f"{fmt(x)},{fmt(y)}" for x, y in pts) + " Z"


def portfolio():
    """Le logo du site (étoile à 8 branches) au milieu d'une constellation, comme le fond animé."""
    rng = random.Random(3)
    cx, cy, R = W / 2, H / 2, 60

    stars = []  # points bien répartis : chaque nouveau point reste loin des autres
    for _ in range(4000):
        p = (rng.uniform(10, W - 10), rng.uniform(10, H - 10))
        if math.dist(p, (cx, cy)) > R + 26 and all(math.dist(p, q) > 36 for q in stars):
            stars.append(p)
    parts = []
    for i, p in enumerate(stars):
        for q in stars[i + 1:]:
            d = math.dist(p, q)
            if d < 62:
                parts.append(f'<line x1="{fmt(p[0])}" y1="{fmt(p[1])}" x2="{fmt(q[0])}" y2="{fmt(q[1])}" stroke-width="0.9" opacity="{0.6 * (1 - d / 62) + 0.1:.2f}"/>')
    for x, y in stars:
        fade = max(0.25, 1 - abs(x - cx) / (W / 2))
        parts.append(f'<circle cx="{fmt(x)}" cy="{fmt(y)}" r="{rng.uniform(1.4, 2.4):.1f}" fill="black" stroke="none" opacity="{0.8 * fade:.2f}"/>')

    parts.append(f'<path d="{star_points(cx, cy, R, R * 0.5)}" stroke-width="2.6"/>')
    parts.append(f'<path d="{star_points(cx, cy, R * 0.27, R * 0.19)}" fill="black" stroke="none"/>')
    for k in range(8):  # petits rayons entre les branches
        a = math.pi / 2 + math.pi / 8 + k * math.pi / 4
        x1, y1 = cx + R * 0.68 * math.cos(a), cy - R * 0.68 * math.sin(a)
        x2, y2 = cx + R * 0.88 * math.cos(a), cy - R * 0.88 * math.sin(a)
        parts.append(f'<line x1="{fmt(x1)}" y1="{fmt(y1)}" x2="{fmt(x2)}" y2="{fmt(y2)}" stroke-width="2.6"/>')
    return svg("\n".join(parts))


BANNERS = {
    "reseaux": reseaux,
    "beckett-gray": beckett_gray,
    "empilement": empilement,
    "weyl": weyl,
    "wsrp": wsrp,
    "ray-tracing": ray_tracing,
    "portfolio": portfolio,
}

if __name__ == "__main__":
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for name, draw in BANNERS.items():
        path = OUTPUT_DIR / f"{name}.svg"
        path.write_text(draw(), encoding="utf-8")
        print(f"{path.relative_to(OUTPUT_DIR.parent.parent.parent)}  ({path.stat().st_size // 1024} Ko)")
