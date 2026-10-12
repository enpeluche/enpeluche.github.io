"""Régénère sitemap.xml (la liste des pages du site, pour les moteurs de recherche).

À relancer après chaque nouvel article de blog (après avoir modifié blog/data.json) :
    python3 _outils/sitemap.py

Aucune dépendance. Le test « sitemap » (_outils/tests) échoue si on a oublié de le lancer.
"""

import json
import sys
from pathlib import Path
from xml.sax.saxutils import escape

SITE = "https://enpeluche.github.io"
ROOT = Path(__file__).resolve().parent.parent


def build():
    articles = json.loads((ROOT / "blog" / "data.json").read_text(encoding="utf-8"))
    entries = [(f"{SITE}/", None), (f"{SITE}/blog/", None)]
    for article in sorted(articles, key=lambda a: a["date"], reverse=True):
        folder = article["folder"]
        if not (ROOT / "blog" / "articles" / folder / "index.html").is_file():
            sys.exit(f"Erreur : blog/data.json cite le dossier « {folder} », mais "
                     f"blog/articles/{folder}/index.html n'existe pas.")
        entries.append((f"{SITE}/blog/articles/{folder}/", article["date"]))

    lines = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for loc, lastmod in entries:
        lastmod_tag = f"<lastmod>{lastmod}</lastmod>" if lastmod else ""
        lines.append(f"  <url><loc>{escape(loc)}</loc>{lastmod_tag}</url>")
    lines.append("</urlset>")
    return "\n".join(lines) + "\n"


if __name__ == "__main__":
    (ROOT / "sitemap.xml").write_text(build(), encoding="utf-8")
    print("sitemap.xml mis à jour.")
