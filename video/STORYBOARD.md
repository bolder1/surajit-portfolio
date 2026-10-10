# ACCESS GRANTED — portfolio reel storyboard (v2)

> **Read `ANTI-SLOP.md` first.** Its rules override anything below (e.g. readouts must be true states, not decorative numbers; no em dashes in on-screen copy).

**Concept.** The film *is* an authentication flow. The viewer starts as an unverified request, Surajit's
identity is challenged and verified, then the scope of what he designs is granted, chapter by chapter.
Every motif comes from his domain (IdP handshakes, password fields, Face-ID brackets, vault dials, OTP
reels, access reviews, device fleets, sign-in cards), so nothing is decoration.

**Format.** 1920×1080, 30 fps, 50 s (1500 frames). 120 BPM → 1 beat = 15 f, 1 bar = 60 f. Every section
starts on a bar downbeat; every cut lands on a beat. Letterboxed 2.39:1 until ACCESS GRANTED, then the
frame opens to full 16:9.

**Look.** Warm near-black `#0d0a07`, cream `#f3ecde` 1–1.5 px linework, ONE emissive accent: vermilion
`#ff3b1f` = *state change only* (active / verified / granted / alert). No green, no blue, no neon.
Finishing on every frame: film grain, vignette, letterbox, HUD chrome (corner brackets, chapter label,
timecode), bloom on bright type, micro camera push on every hold, shake on impacts. Glitch/RGB-split only
on cuts, never on holds.

**Type.** Mona Sans variable (wdth 75–125, wght 200–900) for display, with animated width/weight;
Instrument Serif *italic* for the human words; JetBrains Mono for system text; Doto (dot-matrix) for
big numerals. Inter Tight for UI labels inside mock interfaces.

**Sound.** 100 % synthesised (no stock): a dark 120 BPM pulse bed + frame-locked SFX for every visual
event (key clicks, blips, data chatter, scan tone, ratchets, vault clunks, whooshes, risers, glitches,
sub-boom impacts, the access-granted chime). 6–10 frames of near-silence before each big hit.

---

| # | Chapter | Frames | Bars | Music |
|---|---|---|---|---|
| 0 | REQUEST — handshake terminal | 0–120 | 1–2 | drone, heartbeat sub |
| 1 | HOOK — password field decodes the thesis | 120–240 | 3–4 | + ticking hats, filtered pulse |
| 2 | CHALLENGE — biometric scan of his portrait | 240–420 | 5–7 | tension, riser, silence |
| 3 | IDENTITY — name decrypts, width slam | 420–540 | 8–9 | **DROP** |
| 4 | SCOPE — 7 domains, 1 bar each | 540–960 | 10–16 | full groove |
| 5 | SPEED — 3 weeks → 5 days (AI workflow) | 960–1080 | 17–18 | groove + arp |
| 6 | THESIS — chaos → calm | 1080–1200 | 19–20 | breakdown, riser, silence |
| 7 | GRANTED — ACCESS: DENIED → GRANTED | 1200–1320 | 21–22 | **FINAL DROP** |
| 8 | SESSION — end card | 1320–1500 | 23–25 | outro, sub boom, tail |

### 0 · REQUEST (0–120)
Black. A block caret blinks twice. A real identity handshake types at machine speed (JetBrains Mono 22 px,
timestamps dim, keywords bright), lines push up as new ones arrive:
```
[00:00.012]  GET /authorize?client_id=portfolio&scope=openid profile
[00:00.031]  302 → idp/saml/sso   AuthnRequest  ID=_8f3a…c21
[00:00.048]  WebAuthn challenge · 32 bytes · 9f1c…e07a
[00:00.061]  subject = ?
             IDENTITY: UNVERIFIED          ← vermilion, blinking
```
Slow push-in. SFX: room tone, key chatter (one click per 2 chars), blips per line, deny double-beep on
UNVERIFIED (f≈100).

### 1 · HOOK (120–240)
A wide glass password field. Dots type in rhythmically (16ths, key clicks). Eye icon toggles (click), the
dots scramble through symbols (vermilion while unresolved) and resolve into **EVERY LOGIN IS A DOOR.**
(Mona Sans, tracking compresses). Beat later, line two rises from a baseline mask:
*Someone has to design it.* (Instrument Serif italic, "design" in vermilion). Whoosh out.

### 2 · CHALLENGE (240–420)
Portrait (cut-out, near-black, vermilion rim light) starts as a coarse dot-matrix halftone (= unverified).
Four Face-ID corner brackets fly in and lock around the face. A vermilion scan beam sweeps down; above it
the photo resolves to clean duotone and the REAL 478-point face mesh (MediaPipe landmarks of his photo)
draws itself; landmark dots pop as the beam passes. A 120-tick ring around the face fills clockwise. Side
readouts tick: `LIVENESS · PASS · FACTOR 2 OF 2 · IdP · OIDC · SUBJECT · S. DUTTA`. At 100 %: ring snaps, check
draws, stamp **IDENTITY VERIFIED**. Riser from f≈360, near-silence 412–420.
SFX: scan tone, data chatter, ticks per ring segment, verified chime + lock.

### 3 · IDENTITY (420–540) — DROP
Impact + flash. **SURAJIT DUTTA** decrypts out of hex glyphs, each letter locking with a vermilion flash,
then the whole name slams from condensed-hairline to extended-black (variable width/weight ripple), RGB
split decaying. A metallic light band sweeps once. Under it: *I design the way in.* and a mono line
`IDENTITY · ACCESS · SECURITY UX · 4 YEARS`. Light leak. Particles of the face mesh drift behind.

### 4 · SCOPE (540–960) — seven domains, one bar each, glitch cuts on downbeats
Shared layout: chapter tag `SCOPE / WHAT I DESIGN  0X/07` top-left, domain title bottom-left (Mona Sans)
with a serif-italic line, the motif animating centre-right.
1. **IdP · SSO** — *One identity. Every app.* One identity node; dotted elbow connectors draw out to a grid
   of unbranded app tiles; packets travel; tiles switch to authorised. (blips per tile)
2. **PASSWORD VAULT** — *Secrets, kept simple.* Blueprint combination dial: rings spin and snap to a
   combination, bolts retract, centre slot glows. (ratchet ticks, clunks)
3. **MFA & SIGN-UP FLOWS** — *Prove it's you, painlessly.* Six OTP slot reels spin and lock one by one,
   expiry bar drains, "Approved" pill. (reel ticks, confirm blip)
4. **PRIVILEGED ACCESS** — *Power, only when needed.* Just-in-time grant: a countdown ring drains, padlock
   opens, then auto-revokes at zero. (tick, unlock, relock)
5. **IDENTITY GOVERNANCE** — *Who has access, and why.* A tilted access-review table (incl.
   `AD › Domain Admins`); a vermilion review line sweeps, rows stamp GRANTED / REVOKED. (stamps)
6. **ENDPOINT MANAGEMENT** — *Every device, in policy.* A wall of device icons flips to enrolled as a
   policy wave spreads; counter climbs. (click texture)
7. **DESIGN SYSTEMS** — *Systems, then surfaces.* An unbranded sign-in card explodes into isometric
   layers with spec annotations (radius / focus / token / state), then snaps back together. (whoosh, snaps)

### 5 · SPEED (960–1080)
The AI-workflow proof on a security-posture instrument: a 270° gauge sweeps, then becomes a 15-cell
timeline (3 weeks) where 10 cells fold away leaving **5 DAYS**. Doto odometer lands on **−70 %** on the
downbeat. Mono: `ACTIVE DIRECTORY PROTOTYPE · FIGMA MAKE + CLAUDE`. (ticks, odometer, impact-soft)

### 6 · THESIS (1080–1200) — breakdown
**Security is complex.** — the frame floods with tangled connector lines, warning chips and jittering UI
fragments (glitch stutters). On the half-bar everything snaps into a calm aligned grid:
*Using it shouldn't be.* Riser, then 8 frames of near-silence.

### 7 · GRANTED (1200–1320) — final drop
**ACCESS** sits collapsed as a vermilion hairline (DENIED) → on the downbeat it bursts to extended-black
**GRANTED**; the letterbox opens to full frame; impact, chime, light leak, camera shake. The identity-graph
particles converge into an `SD` dot-matrix monogram.

### 8 · SESSION (1320–1500)
End card. **SURAJIT DUTTA** in extended Mona Sans with one metallic light sweep; *Let's build something
users trust.*; mono contact types in with clicks: `surajit3255@gmail.com · linkedin.com/in/surajit3255`.
HUD: `SESSION ACTIVE ●`. Final sub boom, music tail to silence.
