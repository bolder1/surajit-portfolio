#!/usr/bin/env bash
# Usage: ./stills.sh <CompId> <outdir> f1 f2 ...   → renders PNG stills + a contact sheet <outdir>/<CompId>-sheet.jpg
set -e
cd "$(dirname "$0")"
export REMOTION_BROWSER=${REMOTION_BROWSER:-/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell}
id=$1; out=$2; shift 2; mkdir -p "$out"
for fr in "$@"; do npx remotion still "$id" "$out/$id-$fr.png" --frame="$fr" --log=error >/dev/null; done
python3 - "$out" "$id" "$@" <<'PY'
import sys
from PIL import Image, ImageDraw
out,id,frames=sys.argv[1],sys.argv[2],sys.argv[3:]
W,H=640,360; cols=min(3,len(frames)); rows=(len(frames)+cols-1)//cols
sheet=Image.new('RGB',(W*cols,H*rows),(20,20,20))
for k,fr in enumerate(frames):
    im=Image.open(f'{out}/{id}-{fr}.png').convert('RGB').resize((W,H))
    ImageDraw.Draw(im).text((8,8),f'{id} f{fr}',fill=(0,255,120))
    sheet.paste(im,(k%cols*W,k//cols*H))
sheet.save(f'{out}/{id}-sheet.jpg',quality=85)
print(f'{out}/{id}-sheet.jpg')
PY
