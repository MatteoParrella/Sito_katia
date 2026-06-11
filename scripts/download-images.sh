#!/usr/bin/env bash
# Scarica le immagini Unsplash in locale (licenza Unsplash: uso commerciale consentito).
# DA ESEGUIRE UNA VOLTA prima del deploy: index.html punta già a /images/*.jpg.
#   bash scripts/download-images.sh
#   git add images/ && git commit -m "assets: self-host Unsplash images"
set -euo pipefail
cd "$(dirname "$0")/../images"

curl -fL "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1920&q=85&fit=crop&crop=center" -o hero.jpg
curl -fL "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=600&q=80&fit=crop&crop=center"  -o corso-pilates.jpg
curl -fL "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80&fit=crop&crop=center"  -o corso-yoga.jpg
curl -fL "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1920&q=80&fit=crop&crop=center" -o mood.jpg

echo "OK — 4 immagini scaricate in images/:"
ls -la hero.jpg corso-pilates.jpg corso-yoga.jpg mood.jpg
