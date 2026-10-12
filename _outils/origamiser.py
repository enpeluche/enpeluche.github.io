"""Prépare une photo pour la section « En dehors du labo » : la photo, et sa version pliée.

Usage (depuis la racine du dépôt) :
    python3 _outils/origamiser.py ma-photo.jpg nom-court

Produit, dans assets/img/loisirs/ :
    nom-court.webp       la photo, redressée, redimensionnée, SANS métadonnées
                         (les photos de téléphone contiennent souvent leur position GPS)
    nom-court-plis.webp  la version « origamisée » : triangulation de Delaunay sur des points
                         placés le long des contours, chaque triangle rempli de la couleur
                         moyenne de sa zone

Dépendances : numpy et Pillow (pip install numpy pillow).
Mode d'emploi complet : _outils/LISEZMOI.md
"""

import math
import random
import sys
import zlib
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageOps

OUTPUT_DIR = Path(__file__).resolve().parent.parent / "assets" / "img" / "loisirs"

PHOTO_MAX_SIDE = 1400  # assez pour un écran retina, sans alourdir la page
FOLDS_MIN_SIDE = 1200  # les plis sont dessinés, pas photographiés : on peut toujours les rendre nets
WORK_MAX_SIDE = 500  # taille sur laquelle on calcule les plis (le rendu est ensuite agrandi)
EDGE_POINTS = 520  # points placés sur les contours : plus il y en a, plus les plis sont fins
UNIFORM_POINTS = 140  # points répartis au hasard, pour ne pas laisser de grands vides


# ---------- points d'appui : plus denses là où la photo a des contours ----------

def sample_points(im):
    gray = np.asarray(im.convert("L").filter(ImageFilter.GaussianBlur(1.2)), dtype=float)
    gx = np.zeros_like(gray)
    gy = np.zeros_like(gray)
    gx[:, 1:-1] = gray[:, 2:] - gray[:, :-2]
    gy[1:-1, :] = gray[2:, :] - gray[:-2, :]
    weight = (np.hypot(gx, gy) ** 1.3).ravel()
    weight /= weight.sum()

    h, w = gray.shape
    chosen = np.random.choice(h * w, size=min(EDGE_POINTS, h * w), replace=False, p=weight)
    points = [(float(i % w), float(i // w)) for i in chosen]
    points += [(random.uniform(0, w - 1), random.uniform(0, h - 1)) for _ in range(UNIFORM_POINTS)]

    # bords et coins, pour que les triangles couvrent toute l'image
    for k in range(9):
        t = k / 8
        points += [(t * (w - 1), 0.0), (t * (w - 1), h - 1.0), (0.0, t * (h - 1)), (w - 1.0, t * (h - 1))]

    return list(dict.fromkeys((round(x, 2), round(y, 2)) for x, y in points))


# ---------- triangulation de Delaunay (algorithme de Bowyer-Watson) ----------

def circumcircle(a, b, c):
    """Centre et rayon au carré du cercle passant par a, b, c."""
    ax, ay = a
    bx, by = b
    cx, cy = c
    d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by))
    if abs(d) < 1e-12:
        return (0.0, 0.0, float("inf"))
    ux = ((ax * ax + ay * ay) * (by - cy) + (bx * bx + by * by) * (cy - ay) + (cx * cx + cy * cy) * (ay - by)) / d
    uy = ((ax * ax + ay * ay) * (cx - bx) + (bx * bx + by * by) * (ax - cx) + (cx * cx + cy * cy) * (bx - ax)) / d
    return (ux, uy, (ax - ux) ** 2 + (ay - uy) ** 2)


def delaunay(points):
    """Ajoute les points un à un : les triangles dont le cercle circonscrit contient le nouveau
    point sont retirés, et le trou est recousu en reliant ses bords au nouveau point."""
    pts = list(points)
    xs = [p[0] for p in pts]
    ys = [p[1] for p in pts]
    span = max(max(xs) - min(xs), max(ys) - min(ys)) * 10
    mx, my = (max(xs) + min(xs)) / 2, (max(ys) + min(ys)) / 2
    n = len(pts)

    # « super-triangle » englobant tous les points, retiré à la fin
    pts += [(mx - span, my - span), (mx + span, my - span), (mx, my + span)]
    triangles = {(n, n + 1, n + 2): circumcircle(pts[n], pts[n + 1], pts[n + 2])}

    for i in range(n):
        px, py = pts[i]
        bad = [t for t, (ux, uy, r2) in triangles.items() if (px - ux) ** 2 + (py - uy) ** 2 < r2]

        edge_count = {}
        for t in bad:
            for edge in ((t[0], t[1]), (t[1], t[2]), (t[2], t[0])):
                key = tuple(sorted(edge))
                edge_count[key] = edge_count.get(key, 0) + 1
            del triangles[t]

        # les arêtes vues une seule fois forment le bord du trou
        for (a, b), count in edge_count.items():
            if count == 1:
                triangles[(a, b, i)] = circumcircle(pts[a], pts[b], pts[i])

    return pts[:n], [t for t in triangles if max(t) < n]


def mean_color(pixels, triangle):
    """Couleur moyenne des pixels à l'intérieur du triangle (coordonnées barycentriques)."""
    (x0, y0), (x1, y1), (x2, y2) = triangle
    h, w = pixels.shape[:2]
    xmin, xmax = int(max(0, min(x0, x1, x2))), int(min(w - 1, math.ceil(max(x0, x1, x2))))
    ymin, ymax = int(max(0, min(y0, y1, y2))), int(min(h - 1, math.ceil(max(y0, y1, y2))))

    det = (y1 - y2) * (x0 - x2) + (x2 - x1) * (y0 - y2)
    if xmin > xmax or ymin > ymax or abs(det) < 1e-9:
        cx = min(max(int((x0 + x1 + x2) / 3), 0), w - 1)
        cy = min(max(int((y0 + y1 + y2) / 3), 0), h - 1)
        return tuple(pixels[cy, cx])

    yy, xx = np.mgrid[ymin:ymax + 1, xmin:xmax + 1]
    l1 = ((y1 - y2) * (xx - x2) + (x2 - x1) * (yy - y2)) / det
    l2 = ((y2 - y0) * (xx - x2) + (x0 - x2) * (yy - y2)) / det
    inside = (l1 >= -0.01) & (l2 >= -0.01) & (1 - l1 - l2 >= -0.01)
    region = pixels[ymin:ymax + 1, xmin:xmax + 1][inside]

    if len(region) == 0:
        cx, cy = int((x0 + x1 + x2) / 3), int((y0 + y1 + y2) / 3)
        return tuple(pixels[min(cy, h - 1), min(cx, w - 1)])
    return tuple(region.mean(axis=0))


def fold(photo, output_size):
    """Version pliée de la photo, rendue à output_size pour des arêtes nettes."""
    small = photo.copy()
    small.thumbnail((WORK_MAX_SIDE, WORK_MAX_SIDE))
    pixels = np.asarray(small, dtype=float)
    scale = output_size[0] / small.width

    points, triangles = delaunay(sample_points(small))

    out = Image.new("RGB", output_size)
    draw = ImageDraw.Draw(out)
    for t in triangles:
        corners = [points[k] for k in t]
        r, g, b = mean_color(pixels, corners)
        shade = random.uniform(0.93, 1.07)  # léger relief, comme un pli qui accroche la lumière
        color = tuple(int(max(0, min(255, c * shade))) for c in (r, g, b))
        draw.polygon([(x * scale, y * scale) for x, y in corners], fill=color)
    return out, len(triangles)


def main():
    if len(sys.argv) != 3:
        print(__doc__)
        sys.exit(1)

    source, name = Path(sys.argv[1]), sys.argv[2]

    # même nom → mêmes plis, d'une exécution à l'autre
    random.seed(name)
    np.random.seed(zlib.crc32(name.encode()))

    photo = ImageOps.exif_transpose(Image.open(source)).convert("RGB")  # redressée selon l'appareil
    photo.thumbnail((PHOTO_MAX_SIDE, PHOTO_MAX_SIDE), Image.LANCZOS)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    photo_path = OUTPUT_DIR / f"{name}.webp"
    folds_path = OUTPUT_DIR / f"{name}-plis.webp"

    # Pas de paramètre exif : Pillow écrit le fichier sans aucune métadonnée (GPS compris)
    photo.save(photo_path, "WEBP", quality=82)

    zoom = max(1.0, FOLDS_MIN_SIDE / max(photo.size))
    folds, count = fold(photo, (round(photo.width * zoom), round(photo.height * zoom)))
    folds.save(folds_path, "WEBP", quality=82)

    root = OUTPUT_DIR.parent.parent.parent
    print(f"{photo_path.relative_to(root)}  ({photo.width}×{photo.height}, sans métadonnées)")
    print(f"{folds_path.relative_to(root)}  ({folds.width}×{folds.height}, {count} plis)")
    if max(photo.size) < 1000:
        print("Attention : photo de moins de 1000 px, elle sera un peu floue en grand. "
              "Utiliser l'original si possible.")
    print()
    print("À coller dans index.html (voir _outils/LISEZMOI.md) :")
    print(f'<folded-image src="/assets/img/loisirs/{name}.webp" folds="/assets/img/loisirs/{name}-plis.webp"')
    print('    alt="⟨Description de la photo⟩"></folded-image>')


if __name__ == "__main__":
    main()
