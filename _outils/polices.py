"""Polices du site : version allégée d'Inter (alphabets latin et grec), avec la police complète en secours.

La police Inter complète pèse ~350 Ko par style, car elle contient aussi le cyrillique, le vietnamien,
de nombreux symboles… Ce script en extrait une version « latin + grec » d'environ 160 Ko, utilisée
sur toutes les pages. La police complète reste disponible : le navigateur ne la télécharge que si une
page contient un caractère absent de la version allégée (une lettre cyrillique, par exemple).

Le script écrit aussi les déclarations @font-face correspondantes dans
assets/css/04_components/inter.css, entre les deux commentaires « Généré par _outils/polices.py ».

Usage (depuis la racine du dépôt) : python3 _outils/polices.py
Dépendances : pip install fonttools brotli
"""

import re
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
FONTS = ROOT / "assets" / "fonts"
CSS = ROOT / "assets" / "css" / "04_components" / "inter.css"

# Caractères de la version allégée, choisis pour leur rapport utilité / poids (mesuré) : tout ce qu'il faut
# pour le français, l'anglais, les noms européens et les notations mathématiques (grec compris). Le reste
# (cyrillique, vietnamien, accents combinants rares…) passe par la police complète, téléchargée seulement
# par une page qui en contient.
PLAGES_ALLEGEES = [
    (0x0020, 0x007E),  # latin de base
    (0x00A0, 0x00FF),  # latin-1 : é, à, ç, «, », espace insécable…
    (0x0100, 0x017F),  # latin étendu A : œ, ł, š, ő… (noms européens)            ~ +10 Ko
    (0x0218, 0x021B),  # ș, ț (roumain)
    (0x02BB, 0x02BC),  # apostrophes modificatives
    (0x02C6, 0x02C7),  # ˆ ˇ
    (0x02D8, 0x02DD),  # ˘ ˙ ˚ ˛ ˜ ˝
    (0x0300, 0x0308),  # accents combinants courants : notations comme P̂, x̄, ẋ    ~ +17 Ko
    (0x030A, 0x030C),  # (le site écrit « P̂ et Q̂ » avec U+0302)
    (0x0327, 0x0328),
    (0x0370, 0x03FF),  # grec : α, μ, Θ, Σ… (pages de recherche, notations)       ~ +20 Ko
    (0x1D00, 0x1DBF),  # lettres en exposant (1ᵉʳ…)                               ~ +1 Ko
    (0x2000, 0x206F),  # ponctuation : espaces fines, tirets, guillemets, …
    (0x2070, 0x209F),  # chiffres en exposant et en indice
    (0x20AC, 0x20AC),  # €
    (0x2100, 0x214F),  # symboles lettres : ™, №, ℓ…                              ~ +3 Ko
    (0x2150, 0x218F),  # fractions : ⅓, ⅔, ⅛…
    (0x2190, 0x21FF),  # flèches : ←, →, ↗…                                       ~ +2 Ko
    (0x2200, 0x22FF),  # opérateurs mathématiques : −, ≤, ≥, ≈, ∞…                ~ +3 Ko
    (0x2713, 0x2718),  # coches et croix : ✓, ✗
    (0xFEFF, 0xFEFF),
    (0xFFFD, 0xFFFD),
]

STYLES = [("normal", "InterVariable"), ("italic", "InterVariable-Italic")]


def plages_css(points):
    """Liste de points de code → « U+0-24F, U+370-3FF, … » (plages contiguës regroupées)."""
    points = sorted(points)
    plages, debut, precedent = [], None, None
    for p in points:
        if debut is None:
            debut = precedent = p
        elif p == precedent + 1:
            precedent = p
        else:
            plages.append((debut, precedent))
            debut = precedent = p
    if debut is not None:
        plages.append((debut, precedent))
    return ", ".join(f"U+{a:X}" if a == b else f"U+{a:X}-{b:X}" for a, b in plages)


def allegee(source, destination, points):
    options = subset.Options()
    options.flavor = "woff2"
    options.layout_features = ["*"]  # garde ligatures, chiffres tabulaires, variantes (cv01…)
    options.name_IDs = ["*"]
    options.notdef_outline = True
    police = TTFont(source, recalcTimestamp=False)  # même entrée → même fichier, à chaque exécution
    sous_ensemble = subset.Subsetter(options)
    sous_ensemble.populate(unicodes=points)
    sous_ensemble.subset(police)
    police.flavor = "woff2"
    police.save(destination)


def main():
    voulus = {p for a, b in PLAGES_ALLEGEES for p in range(a, b + 1)}
    regles = []
    for style, nom in STYLES:
        complete = FONTS / f"{nom}.woff2"
        legere = FONTS / f"{nom}-latin.woff2"
        couverts = set(TTFont(complete).getBestCmap())
        dans_legere = voulus & couverts
        allegee(complete, legere, dans_legere)
        # La police complète ne déclare que ce qu'elle contient vraiment, hors version allégée :
        # pour un émoji (absent d'Inter), le navigateur ne la télécharge donc pas pour rien.
        for fichier, points in ((legere, dans_legere), (complete, couverts - dans_legere)):
            regles.append(
                "@font-face {\n"
                "  font-family: InterVariable;\n"
                f"  font-style: {style};\n"
                "  font-weight: 100 900;\n"
                "  font-display: swap;\n"
                f'  src: url("/assets/fonts/{fichier.name}") format("woff2");\n'
                f"  unicode-range: {plages_css(points)};\n"
                "}"
            )
        print(f"{legere.relative_to(ROOT)} : {legere.stat().st_size // 1024} Ko "
              f"(police complète : {complete.stat().st_size // 1024} Ko)")

    debut, fin = "/* Généré par _outils/polices.py : début */", "/* Généré par _outils/polices.py : fin */"
    css = CSS.read_text(encoding="utf-8")
    bloc = f"{debut}\n" + "\n".join(regles) + f"\n{fin}"
    css, n = re.subn(re.escape(debut) + r".*?" + re.escape(fin), lambda _: bloc, css, flags=re.S)
    if n != 1:
        raise SystemExit(f"Erreur : les commentaires de début et de fin sont introuvables dans {CSS.relative_to(ROOT)}")
    CSS.write_text(css, encoding="utf-8")
    print(f"{CSS.relative_to(ROOT)} mis à jour.")


if __name__ == "__main__":
    main()
