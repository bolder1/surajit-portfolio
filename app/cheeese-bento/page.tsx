import Image from "next/image";
import Link from "next/link";
import s from "./bento.module.css";

/**
 * /cheeese-bento — the standalone CHEEEESE Bento Brand System page.
 *
 * Four bentos (Classic Original · Jalapeño Cheddar · Roasted Garlic
 * Herb · Smoky Paprika), one per SKU. Same brand DNA — Bagel Fat
 * One wordmark, real-cheese stamp, hex chip strip, nutrition card,
 * kicker quotes — but a distinct grid + colour mood per flavour.
 *
 * Ported 1:1 from a Claude Design HTML/CSS handoff bundle. Asset
 * paths point at /public/projects/cheeese-bento/. The promo-video
 * slot defaults to a fallback gradient until the user drops a real
 * file at /projects/cheeese-bento/promo.mp4.
 */
export default function CheeseseBentoPage() {
  return (
    <div className={s.scope}>
      {/* Page header */}
      <header className={s.pageHead}>
        <div>
          <div className={s.kicker} style={{ color: "#9b8d6e", marginBottom: 14 }}>
            CHEEEESE / 2026 BRAND COMMS
          </div>
          <h1>
            Bento <em>system</em>
            <br />
            for cheesy goodness.
          </h1>
          <p style={{ marginTop: 18 }}>
            Four flavours, four bento layouts. Same brand DNA, distinct mood per
            SKU. Sized for social — drop into a 4×5 carousel, 1×1 grid post, or
            full-bleed billboard.
          </p>
        </div>
        <div className={s.meta}>
          <span>v1.0 — May 2026</span>
          <span>4 SKUs · Classic · Jalapeño · Garlic · Paprika</span>
          <span>16:11 · Web · Social · OOH</span>
        </div>
      </header>

      {/* In-page nav */}
      <nav className={s.nav} aria-label="Bento system flavours">
        <a href="#classic" data-f="orange">
          <span className={s.dot} style={{ background: "#e87722" }} />
          01 — Classic Original
        </a>
        <a href="#jalapeno" data-f="green">
          <span className={s.dot} style={{ background: "#6fb53b" }} />
          02 — Jalapeño Cheddar
        </a>
        <a href="#garlic" data-f="olive">
          <span className={s.dot} style={{ background: "#6f7a36" }} />
          03 — Roasted Garlic Herb
        </a>
        <a href="#paprika" data-f="red">
          <span className={s.dot} style={{ background: "#b1271d" }} />
          04 — Smoky Paprika
        </a>
        <a href="#promo" className={s.video}>
          ▶ Watch the promo video
        </a>
        <Link
          href="/work/cheeese"
          style={{
            background: "transparent",
            color: "#f3e8cf",
            border: "1px solid #3a2c1e",
          }}
        >
          ← Back to case study
        </Link>
      </nav>

      {/* ===== 01 CLASSIC ORIGINAL ===== */}
      <div className={s.bentoLabel}>
        <span className={s.num}>01 / ORANGE — #E87722</span>
        <span className={s.title}>The hero stack.</span>
        <span className={s.desc}>
          Editorial &amp; balanced — the flagship layout for launch comms.
        </span>
      </div>
      <section className={`${s.bento} ${s.classic}`} id="classic">
        <div
          className={`${s.tile} ${s.tHero} ${s.col}`}
          style={{ justifyContent: "flex-end", padding: 24 }}
        >
          <Image
            src="/projects/cheeese-bento/classic-handopen.png"
            alt="hand opening sachet"
            fill
            sizes="(max-width: 1100px) 100vw, 33vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
            unoptimized
          />
          <div
            style={{
              position: "relative",
              zIndex: 1,
              color: "#fff",
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 11,
              letterSpacing: ".16em",
              textTransform: "uppercase",
            }}
          >
            SACHET / 30G
          </div>
        </div>

        <div className={`${s.tile} ${s.tWord}`}>
          <div className={s.word}>CHEEEESE</div>
        </div>

        <div className={`${s.tile} ${s.tTag}`}>
          <span className={s.kicker} style={{ color: "#b9560f" }}>
            — POPPABLE —
          </span>
          <div className="head">
            Cheesy
            <br />
            goodness
            <br />
            in every bite.
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "#b9560f",
            }}
          >
            <span className={s.sparks}>
              <i />
              <i />
              <i />
            </span>
            <span className={s.kicker}>REAL CHEESE INSIDE</span>
          </div>
        </div>

        <div className={`${s.tile} ${s.tDisplay}`}>
          <Image
            src="/projects/cheeese-bento/classic-display.png"
            alt="Classic display box open"
            fill
            sizes="(max-width: 1100px) 100vw, 33vw"
            style={{ objectFit: "cover" }}
            unoptimized
          />
        </div>

        <div className={`${s.tile} ${s.tStamp} ${s.center}`}>
          <Stamp top="REAL" mid="CHEESE" cube="🧀" bottom="GOODNESS" />
        </div>

        <div className={`${s.tile} ${s.tFlavor}`}>
          <span className={s.kicker}>FLAVOR No.01</span>
          <div className="name">
            Classic
            <br />
            Original
          </div>
        </div>

        <div className={`${s.tile} ${s.tBites}`}>
          <Image
            src="/projects/cheeese-bento/classic-splash.png"
            alt="cheese splash"
            fill
            sizes="(max-width: 1100px) 100vw, 33vw"
            style={{ objectFit: "cover" }}
            unoptimized
          />
        </div>

        <div className={`${s.tile} ${s.tQuote}`}>
          <div className="q">
            “Snack like
            <br />
            you mean it.”
          </div>
        </div>

        <div className={`${s.tile} ${s.tChips}`}>
          <Palette
            cols={3}
            swatches={[
              { role: "PRIMARY", num: "01/03", hex: "#E87722", name: "Cheddar Orange" },
              { role: "HIGHLIGHT", num: "02/03", hex: "#F9B66A", name: "Cream Glow" },
              { role: "SURFACE", num: "03/03", hex: "#F3E8CF", name: "Bone" },
            ]}
          />
        </div>

        <div className={`${s.tile} ${s.tNutri}`}>
          <Nutri />
        </div>

        <div className={`${s.tile} ${s.tCube}`}>
          <div className={s.megatext}>
            ×4
            <br />
            PACKS
          </div>
        </div>
      </section>

      {/* ===== 02 JALAPEÑO CHEDDAR ===== */}
      <div className={s.bentoLabel}>
        <span className={s.num}>02 / GREEN — #6FB53B</span>
        <span className={s.title}>Spicy stack.</span>
        <span className={s.desc}>
          Higher energy — louder type, splash photo, feed-stopping accents.
        </span>
      </div>
      <section className={`${s.bento} ${s.jalapeno}`} id="jalapeno">
        <div className={`${s.tile} ${s.tMega}`}>
          <div>
            <span className={s.kicker} style={{ color: "#b8e08a" }}>
              — POPPABLE CHEESEY GOODNESS —
            </span>
            <div className={s.word} style={{ marginTop: 12 }}>
              CHEEEESE
            </div>
          </div>
          <div className="row">
            <span className={s.kicker} style={{ color: "#b8e08a" }}>
              SACHET / 30G
            </span>
            <span className="heat">🌶 MILD HEAT</span>
          </div>
        </div>

        <div className={`${s.tile} ${s.tSplash}`}>
          <Image
            src="/projects/cheeese-bento/jalapeno-splash.png"
            alt="jalapeño splash"
            fill
            sizes="(max-width: 1100px) 100vw, 33vw"
            style={{ objectFit: "cover" }}
            unoptimized
          />
        </div>

        <div className={`${s.tile} ${s.tName}`}>
          <span className="small">FLAVOR No.02</span>
          <div className="flavor">
            Jalapeño
            <br />
            Cheddar.
          </div>
          <span className="small">RICH · CREAMY · A LITTLE FIERY</span>
        </div>

        <div className={`${s.tile} ${s.tTagline}`}>
          <span className={s.kicker} style={{ alignSelf: "flex-start" }}>
            — a small green riot —
          </span>
          <div className="h">
            Made with
            <br />
            real cheese,
            <br />
            real chillies.
          </div>
        </div>

        <div className={`${s.tile} ${s.tStamp} ${s.center}`}>
          <Stamp top="REAL" mid="CHEESE" cube="🧀" bottom="REAL HEAT" />
        </div>

        <div className={`${s.tile} ${s.tDisp}`}>
          <Image
            src="/projects/cheeese-bento/jalapeno-display.png"
            alt="jalapeño display"
            fill
            sizes="(max-width: 1100px) 100vw, 33vw"
            style={{ objectFit: "cover" }}
            unoptimized
          />
        </div>

        <div className={`${s.tile} ${s.tStat}`}>
          <span>SCOVILLE INDEX</span>
          <b>2.5K</b>
          <span>
            — ENOUGH TO TINGLE,
            <br />
            NOT TO BURN —
          </span>
        </div>

        <div className={`${s.tile} ${s.tQuote}`}>
          <div className="q">
            A little <em>kick</em>.
            <br />A lot of <em>cheeese</em>.
          </div>
        </div>

        <div className={`${s.tile} ${s.tPack}`}>
          <Image
            src="/projects/cheeese-bento/jalapeno-group.png"
            alt="4 jalapeño sachets"
            fill
            sizes="(max-width: 1100px) 100vw, 33vw"
            style={{ objectFit: "cover" }}
            unoptimized
          />
        </div>

        <div className={`${s.tile} ${s.tChips}`}>
          <Palette
            cols={2}
            swatches={[
              { role: "PRIMARY", num: "01/02", hex: "#6FB53B", name: "Jalapeño" },
              { role: "LIGHT", num: "02/02", hex: "#B8E08A", name: "Mint Pop" },
            ]}
          />
        </div>

        <div className={`${s.tile} ${s.tCube}`}>
          <div className={s.megatext}>
            POP.
            <br />
            POP.
            <br />
            POP.
          </div>
        </div>

        <div className={`${s.tile} ${s.tRating}`}>
          <div>
            <div className={s.kicker} style={{ opacity: 0.7 }}>
              SNACK SCORE
            </div>
            <div className="num">
              4.8
              <span style={{ fontSize: ".5em", opacity: 0.6 }}>/5</span>
            </div>
          </div>
          <div className="stars">★★★★★</div>
        </div>

        <div className={`${s.tile} ${s.tFoot}`}>
          <span className="lbl">NET WT</span>
          <div className="big">
            120g
            <br />
            4×30g
          </div>
        </div>
      </section>

      {/* ===== 03 GARLIC HERB ===== */}
      <div className={s.bentoLabel}>
        <span className={s.num}>03 / OLIVE — #6F7A36</span>
        <span className={s.title}>Editorial, herbal.</span>
        <span className={s.desc}>
          Whitespace &amp; restraint — premium, calm, magazine-coded.
        </span>
      </div>
      <section className={`${s.bento} ${s.garlic}`} id="garlic">
        <div className={`${s.tile} ${s.tName}`}>
          <span className={s.kicker} style={{ opacity: 0.85 }}>
            — FLAVOR No.03 —
          </span>
          <div className={s.word}>CHEEEESE</div>
          <div className="row">
            <span className="meta">poppable cheesey goodness</span>
            <span className="meta">made / w / real cheese</span>
          </div>
        </div>

        <div className={`${s.tile} ${s.tFlavor}`}>
          <span className={s.kicker}>SAVORY · HERBAL</span>
          <div className="h">
            Roasted
            <br />
            Garlic
            <br />
            &amp; Herb.
          </div>
          <span className={s.kicker}>— a quiet stunner —</span>
        </div>

        <div className={`${s.tile} ${s.tHandopen}`}>
          <Image
            src="/projects/cheeese-bento/garlic-handopen.png"
            alt="hand opening garlic"
            fill
            sizes="(max-width: 1100px) 100vw, 33vw"
            style={{ objectFit: "cover" }}
            unoptimized
          />
        </div>

        <div className={`${s.tile} ${s.tQuote}`}>
          <div className="q">
            Slow-roasted garlic. Soft
            <br />
            chopped herbs. <em>It&rsquo;s that simple.</em>
          </div>
        </div>

        <div className={`${s.tile} ${s.tStamp} ${s.center}`}>
          <Stamp top="REAL" mid="HERBS" cube="🌿" bottom="REAL CHEESE" />
        </div>

        <div className={`${s.tile} ${s.tDisplay}`}>
          <Image
            src="/projects/cheeese-bento/garlic-display.png"
            alt="garlic display box"
            fill
            sizes="(max-width: 1100px) 100vw, 33vw"
            style={{ objectFit: "cover" }}
            unoptimized
          />
        </div>

        <div className={`${s.tile} ${s.tNutri}`}>
          <Nutri />
        </div>

        <div className={`${s.tile} ${s.tChips}`}>
          <Palette
            cols={3}
            swatches={[
              { role: "DEEP", num: "01/03", hex: "#41481B", name: "Bay Leaf" },
              { role: "PRIMARY", num: "02/03", hex: "#6F7A36", name: "Olive" },
              { role: "LIGHT", num: "03/03", hex: "#AAB66F", name: "Sage" },
            ]}
          />
        </div>

        <div className={`${s.tile} ${s.tFoot}`}>
          <span className={s.kicker}>x4 PACKS / 120G</span>
          <div className="big">
            For the
            <br />
            quiet
            <br />
            cravers.
          </div>
        </div>

        <div className={`${s.tile} ${s.tCubes} ${s.center}`}>
          <div>
            <div className={s.megatext}>
              SAY
              <br />
              CHEEEESE.
            </div>
            <div className={s.kicker} style={{ marginTop: 14 }}>
              — GARLIC HERB EDITION —
            </div>
          </div>
        </div>
      </section>

      {/* ===== 04 SMOKY PAPRIKA ===== */}
      <div className={s.bentoLabel}>
        <span className={s.num}>04 / RED — #B1271D</span>
        <span className={s.title}>Bold magazine.</span>
        <span className={s.desc}>
          Dark stage, big type, dramatic photography. Built for the algorithm.
        </span>
      </div>
      <section className={`${s.bento} ${s.paprika}`} id="paprika">
        <div className={`${s.tile} ${s.tCubes}`}>
          <Image
            src="/projects/cheeese-bento/paprika-cubes.png"
            alt="paprika cubes flying"
            fill
            sizes="(max-width: 1100px) 100vw, 33vw"
            style={{ objectFit: "cover" }}
            unoptimized
          />
        </div>

        <div className={`${s.tile} ${s.tMega}`}>
          <div>
            <span className={s.kicker} style={{ color: "#e8775f" }}>
              — POPPABLE CHEESEY GOODNESS —
            </span>
            <div className={s.word} style={{ marginTop: 12 }}>
              CHEEEESE
            </div>
          </div>
          <div className="row">
            <span className={s.kicker} style={{ color: "#e8775f" }}>
              SACHET / 30G · ×4 PACKS
            </span>
            <span className="heat">🔥 SMOKY HEAT</span>
          </div>
        </div>

        <div className={`${s.tile} ${s.tFlavor}`}>
          <span className={s.kicker}>FLAVOR No.04</span>
          <div className="h">
            Smoky
            <br />
            Paprika.
          </div>
          <span className={s.kicker}>SLOW SMOKED · BOLD</span>
        </div>

        <div className={`${s.tile} ${s.tStat}`}>
          <span>HEAT</span>
          <b>4 / 5</b>
          <span>
            — SLOW BURN
            <br />
            NOT FIREWORKS —
          </span>
        </div>

        <div className={`${s.tile} ${s.tDisplay}`}>
          <Image
            src="/projects/cheeese-bento/paprika-display.png"
            alt="paprika display"
            fill
            sizes="(max-width: 1100px) 100vw, 33vw"
            style={{ objectFit: "cover" }}
            unoptimized
          />
        </div>

        <div className={`${s.tile} ${s.tQuote}`}>
          <div className="q">
            Built for the
            <br />
            <em>5pm crash.</em>
            <br />
            And the 11pm one.
          </div>
        </div>

        <div className={`${s.tile} ${s.tStamp} ${s.center}`}>
          <Stamp top="REAL" mid="SMOKE" cube="🌶" bottom="REAL CHEESE" />
        </div>

        <div className={`${s.tile} ${s.tPack}`}>
          <Image
            src="/projects/cheeese-bento/paprika-group.png"
            alt="paprika 4 sachets"
            fill
            sizes="(max-width: 1100px) 100vw, 33vw"
            style={{ objectFit: "cover" }}
            unoptimized
          />
        </div>

        <div className={`${s.tile} ${s.tTag}`}>
          <span className={s.kicker} style={{ opacity: 0.7 }}>
            — RICH &amp; CREAMY —
          </span>
          <div className="h">
            Smoke gets
            <br />
            in your
            <br />
            cravings.
          </div>
        </div>

        <div className={`${s.tile} ${s.tRating}`}>
          <div>
            <div className={s.kicker} style={{ opacity: 0.8 }}>
              REORDER RATE
            </div>
            <div className="num">87%</div>
          </div>
          <div
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 11,
              letterSpacing: ".06em",
            }}
          >
            tastemakers · 2026
          </div>
        </div>

        <div className={`${s.tile} ${s.tChips}`}>
          <Palette
            cols={3}
            swatches={[
              { role: "DEEP", num: "01/03", hex: "#6C1410", name: "Burnt Brick" },
              { role: "PRIMARY", num: "02/03", hex: "#B1271D", name: "Paprika" },
              { role: "HIGHLIGHT", num: "03/03", hex: "#E8775F", name: "Embers" },
            ]}
          />
        </div>

        <div className={`${s.tile} ${s.tCube}`}>
          <div className={s.megatext}>
            SAY IT
            <br />
            LOUDER.
          </div>
        </div>

        <div className={`${s.tile} ${s.tFoot}`}>
          <span className="lbl">NET WT</span>
          <div className="big">120g</div>
          <span className="lbl">SHELF · 9 MO</span>
        </div>
      </section>

      {/* ===== Promo video block ===== */}
      <div className={s.bentoLabel} id="promo">
        <span className={s.num}>05 / PROMO</span>
        <span className={s.title}>The animated cut.</span>
        <span className={s.desc}>
          Hero product + orbiting ingredients + per-flavour bento cards.
        </span>
      </div>
      <section className={s.videoBlock} aria-label="CHEEEESE promo video">
        {/* Drop the final video at /public/projects/cheeese-bento/promo.mp4
            (and optional poster at promo-poster.jpg). Until then this
            renders a branded fallback panel so the page never looks
            broken. */}
        <video
          controls
          preload="metadata"
          poster="/projects/cheeese-bento/promo-poster.jpg"
          style={{ background: "#0d0a07" }}
        >
          <source src="/projects/cheeese-bento/promo.mp4" type="video/mp4" />
          <source src="/projects/cheeese-bento/promo.webm" type="video/webm" />
          <div className={s.videoFallback}>
            <h2>SAY CHEEEESE.</h2>
            <p>Promo video coming soon · drop /projects/cheeese-bento/promo.mp4</p>
          </div>
        </video>
      </section>

      <footer className={s.footer}>
        <span>CHEEEESE — Poppable Cheesey Goodness</span>
        <span>v1.0 — May 2026 · 4 SKUs · 5 layouts</span>
        <span>
          <Link
            href="/work/cheeese"
            style={{
              color: "#7a6c4f",
              textDecoration: "underline",
              textUnderlineOffset: 4,
            }}
          >
            Back to case study
          </Link>
        </span>
      </footer>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Small helpers used inside each bento.
   ─────────────────────────────────────────────────────── */
function Stamp({
  top,
  mid,
  cube,
  bottom,
}: {
  top: string;
  mid: string;
  cube: string;
  bottom: string;
}) {
  return (
    <div className={s.stamp}>
      <div>
        <div
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 9,
            letterSpacing: ".18em",
            opacity: 0.7,
          }}
        >
          — {top} —
        </div>
        <div className={s.stampInner}>{mid}</div>
        <div className={s.stampCube}>{cube}</div>
        <div className={s.stampInner}>{bottom}</div>
        <div
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 9,
            letterSpacing: ".18em",
            opacity: 0.7,
            marginTop: 4,
          }}
        >
          — EST. 2026 —
        </div>
      </div>
    </div>
  );
}

function Palette({
  cols,
  swatches,
}: {
  cols: 2 | 3 | 4;
  swatches: { role: string; num: string; hex: string; name: string }[];
}) {
  const colsClass = cols === 2 ? s.cols2 : cols === 4 ? s.cols4 : s.cols3;
  return (
    <div className={`${s.palette} ${colsClass}`}>
      {swatches.map((sw) => (
        <div key={sw.hex} className={s.sw}>
          <div className={s.top}>
            <span>{sw.role}</span>
            <span className={s.num}>{sw.num}</span>
          </div>
          <div>
            <div className={s.hex}>{sw.hex}</div>
            <div className={s.swMeta}>
              <span>{sw.name}</span>
              <span>RGB</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Nutri() {
  return (
    <div className={s.nutri}>
      <div>
        <b>160</b>
        <span>kcal</span>
      </div>
      <div>
        <b>11g</b>
        <span>fat</span>
      </div>
      <div>
        <b>7g</b>
        <span>sat fat</span>
      </div>
      <div>
        <b>1g</b>
        <span>sugar</span>
      </div>
      <div>
        <b>180mg</b>
        <span>sodium</span>
      </div>
    </div>
  );
}
