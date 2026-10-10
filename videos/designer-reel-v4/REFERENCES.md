# References and fonts for v4

Every reference is human-made work. Links marked "verified" returned HTTP 200 from the build machine on 2026-10-10; the others are the standard pages for each title but the build sandbox's proxy blocks those hosts, so open them from a normal browser before relying on a specific timecode.

## Title sequences and films

| Reference | URL | What we take |
|---|---|---|
| Halt and Catch Fire main title (Elastic, Patrick Clair, 2014) | https://www.artofthetitle.com/title/halt-and-catch-fire/ | A signal with a destination. The loupe arrives on the drop and lights one real screen full frame, where v3's beam only travelled. |
| Bullitt main title (Pablo Ferro, 1968) | https://www.artofthetitle.com/title/bullitt/ | Footage inside the letterforms. SURAJIT / DUTTA are cut as glass windows onto his real banking table and design-system cover. |
| Neon Genesis Evangelion title cards (Gainax, 1995) | https://www.artofthetitle.com/title/neon-genesis-evangelion/ | The big card held, the small text as 2-frame flashes. Questions and the principle hold; labels flash; the flashbulb inversion is the cut. |
| Enter the Void main title (Tom Kan and Gaspar Noé, 2009) | https://www.artofthetitle.com/title/enter-the-void/ | Titles cut per hit, readable at first and then a blur. The 26-title burst through the loupe. |
| North by Northwest main title (Saul Bass, 1959) | https://www.artofthetitle.com/title/north-by-northwest/ | A grid that becomes a facade. The loupe is measured (stroke, two corners, three paddings) while lying on the real design-system cover. |
| Dr. Strangelove main title (Pablo Ferro, 1964) | https://www.artofthetitle.com/title/dr-strangelove-or-how-i-learned-to-stop-worrying-and-love-the-bomb/ | Hand-set type that fills and overruns the frame. The questions at 260 to 300 px with no side gutters and descenders cut by the edge. |
| Mindhunter main title (Elastic, 2017) | https://www.artofthetitle.com/title/mindhunter/ | Two-frame flashes of a different image inside a longer sequence. The four real-screen flashes inside the burst. |
| Dexter main title (Digital Kitchen, 2006) | https://www.artofthetitle.com/title/dexter/ | A routine shown as concrete acts in order. The five days as five acts with day stamps. |
| Bob Dylan, "Subterranean Homesick Blues" cue cards, from Dont Look Back (D. A. Pennebaker, 1967) | https://www.criterion.com/films/27742-dont-look-back | A person holding one line of text, then the next. The treatment for the [HIS WORDS] cue cards over his portrait. |
| DEMO Festival (Amsterdam, digital motion type) | https://demofestival.com/ | Type that arrives deformed and recovers. "Complex" jitters, then calms; a word opens as the loupe passes. |
| Apple liquid glass (WWDC 2025 design sessions) | https://developer.apple.com/videos/play/wwdc2025/219/ | Glass that bends what is behind its rim. v3's SVG recipe already does this; v4 keeps it and gives the loupe a job in every scene. |

## Fonts

All three are SIL Open Font License 1.1. Download the variable TTFs from the google/fonts repository (verified), subset to Latin plus the punctuation used, and convert to woff2 before the build (`pyftsubset --flavor=woff2`). The render browser cannot reach a CDN, so the files must be vendored into `assets/fonts/`.

| Font | Role | Download (verified) | Licence (verified) |
|---|---|---|---|
| Bricolage Grotesque, variable (opsz 12 to 96, wdth 75 to 100, wght 200 to 800), by Mathieu Triay | Display: questions, name, numbers | https://raw.githubusercontent.com/google/fonts/main/ofl/bricolagegrotesque/BricolageGrotesque%5Bopsz%2Cwdth%2Cwght%5D.ttf | https://raw.githubusercontent.com/google/fonts/main/ofl/bricolagegrotesque/OFL.txt |
| Newsreader Italic, variable (opsz 6 to 72, wght 200 to 800), by Production Type | His own sentences | https://raw.githubusercontent.com/google/fonts/main/ofl/newsreader/Newsreader-Italic%5Bopsz%2Cwght%5D.ttf | https://raw.githubusercontent.com/google/fonts/main/ofl/newsreader/OFL.txt |
| Newsreader Roman, variable (only if an upright is ever needed) | spare | https://raw.githubusercontent.com/google/fonts/main/ofl/newsreader/Newsreader%5Bopsz%2Cwght%5D.ttf | same |
| Martian Mono, variable (wdth 75 to 112.5, wght 100 to 800), by Evil Martians | Labels, days, contacts | https://raw.githubusercontent.com/google/fonts/main/ofl/martianmono/MartianMono%5Bwdth%2Cwght%5D.ttf | https://raw.githubusercontent.com/google/fonts/main/ofl/martianmono/OFL.txt |

Google Fonts CSS endpoints also respond from the build machine (verified) if a quick browser specimen is wanted; they are not used in the render:

- https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,200..800&display=swap
- https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@1,6..72,200..800&display=swap
- https://fonts.googleapis.com/css2?family=Martian+Mono:wdth,wght@75..112.5,100..800&display=swap

Project pages (not reachable from the sandbox): https://github.com/ateliertriay/bricolage · https://github.com/kosbarts/Newsreader · https://github.com/evilmartians/mono · https://fonts.google.com/specimen/Bricolage+Grotesque · https://fonts.google.com/specimen/Newsreader · https://fonts.google.com/specimen/Martian+Mono

Fonts dropped from v3: Mona Sans, JetBrains Mono, Doto (still in videos/designer-reel/assets/fonts/ if the fallback is ever needed).

## In the repo

- v3 storyboard and frame system: videos/designer-reel/STORYBOARD.md, frame.md, SOUND.md, assets/audio/README.md (the bed and SFX this film rebuilds).
- Claims sheet: videos/designer-reel-v4/FACTS.md.
- Real assets used: public/v5/portrait.png · public/projects/design-system/01-cover.png · public/projects/banking-tool/ma-6.png, ma-7.png, region-1.png · public/projects/ad-tools/01-overview.png.
- Not used: public/showcase/*.jpg (concept renders, not real UI) and public/v5/*.webm (a rendered world; the film has two materials, glass and ink).
