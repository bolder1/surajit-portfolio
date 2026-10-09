#!/usr/bin/env bash
# Full render: regenerate audio, render the Reel, master loudness, copy to the site's public/video.
set -e
cd "$(dirname "$0")"
export REMOTION_BROWSER=${REMOTION_BROWSER:-/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell}
(cd sound && python3 sfx.py && python3 music.py)
mkdir -p out
npx remotion render Reel out/reel-raw.mp4 --codec=h264 --crf=17 --audio-bitrate=320k --concurrency=${CONCURRENCY:-4} --log=error
# Two-pass-ish loudness: master to -14 LUFS / -1 dBTP, keep video stream untouched.
ffmpeg -y -v error -i out/reel-raw.mp4 -c:v copy -af "loudnorm=I=-14:TP=-1:LRA=11" -c:a aac -b:a 320k -ar 48000 -movflags +faststart out/reel.mp4
mkdir -p ../public/video && cp out/reel.mp4 ../public/video/folio-reel.mp4
echo "wrote ../public/video/folio-reel.mp4"
