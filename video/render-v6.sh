#!/usr/bin/env bash
# KEY LIGHT (V6) full render: the checker first (it refuses the render on any violation), then the raw render,
# the loudness master and a web copy. One Chrome at a time on the 4-core box: nothing else runs meanwhile.
# Usage: ./render-v6.sh            (CONCURRENCY=3 by default; MUSIC=0 renders without the bed)
set -e
cd "$(dirname "$0")"
export REMOTION_BROWSER=${REMOTION_BROWSER:-/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell}

npm run --silent check:v6

mkdir -p out
music=${MUSIC:-1}
if [ ! -f public/music/bed-v6.wav ]; then
  echo "render-v6: public/music/bed-v6.wav is missing (sound/compose_v6.py writes it); rendering without the bed" >&2
  music=0
fi
props="{\"music\":$([ "$music" = 1 ] && echo true || echo false),\"grade\":true}"

npx remotion render V6 out/v6-raw.mp4 --props="$props" --codec=h264 --crf=17 --audio-bitrate=320k --concurrency=${CONCURRENCY:-3} --log=error

# Master: a fade that finishes before 199.2 s, then loudness to -14 LUFS / -1 dBTP; the video stream is untouched.
ffmpeg -y -v error -i out/v6-raw.mp4 -c:v copy -af "afade=t=out:st=198.5:d=0.7,loudnorm=I=-14:TP=-1:LRA=11" -c:a aac -b:a 320k -ar 48000 -movflags +faststart out/v6.mp4
# Web copy.
ffmpeg -y -v error -i out/v6.mp4 -c:v libx264 -preset slow -crf 23 -c:a aac -b:a 192k -movflags +faststart out/v6-web.mp4
echo "wrote out/v6.mp4 and out/v6-web.mp4"
