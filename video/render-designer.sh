#!/usr/bin/env bash
# Designer reel (v2 look, v3 story): copy the bed and extra SFX from videos/designer-reel, render, master, copy to public/video.
set -e
cd "$(dirname "$0")"
export REMOTION_BROWSER=${REMOTION_BROWSER:-/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell}
SRC=../videos/designer-reel/assets
mkdir -p public/music public/sfx out
cp "$SRC/audio/bed.wav" public/music/designer-bed.wav
for f in arcade-blip crt-on crt-off gated-snare-hit glass-tink glass-tink-2 laser synth-stab whoosh-retro hum-80f sine-calm tape-rewind whoosh-flyby; do [ -f "$SRC/sfx/$f.wav" ] && cp "$SRC/sfx/$f.wav" public/sfx/; done
npx remotion render Designer out/designer-raw.mp4 --codec=h264 --crf=17 --audio-bitrate=320k --concurrency=${CONCURRENCY:-3} --log=error
ffmpeg -y -v error -i out/designer-raw.mp4 -c:v copy -af "afade=t=out:st=51.3:d=0.7,loudnorm=I=-14:TP=-1:LRA=11" -c:a aac -b:a 320k -ar 48000 -movflags +faststart out/designer.mp4
ffmpeg -y -v error -i out/designer.mp4 -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart out/designer-web.mp4
echo "wrote out/designer.mp4 and out/designer-web.mp4"
