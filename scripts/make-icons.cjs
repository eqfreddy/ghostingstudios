#!/usr/bin/env node
/**
 * make-ghosting-icons.cjs
 *
 * Renders 8 icon concepts for Ghosting Studios as PNGs at 128 / 512 / 1024.
 *   bedsheet-see-no-evil, bedsheet-hear-no-evil, bedsheet-speak-no-evil,
 *   bedsheet-trio, chat, tombstone-ghost, g-dissolve, g-ghost
 * Output: scripts/out/ghosting-icon-{concept}-{size}.png  (24 files total)
 *
 * Run: node scripts/make-ghosting-icons.cjs
 * Idempotent: re-runs overwrite previous output.
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// ---- output dir ----------------------------------------------------------
const OUT_DIR = path.join(__dirname, 'out');
fs.mkdirSync(OUT_DIR, { recursive: true });

// ---- palette (locked, no green ever) -------------------------------------
const C = {
  slate: '#0f172a', // primary BG
  bone:  '#e8e1d0', // light fill
  paper: '#fafaf7', // very light
  snow:  '#f8fafc', // highlights on slate
  fog:   '#64748b', // muted
  fogD:  '#475569', // muted darker
  blood: '#7a1d1d', // accent (unused here; reserved)
};

const SIZES = [128, 512, 1024];

// ---- canvas frame: slate BG + 22px-radius rounded square (in 128-vb units)
function frame(inner, extraDefs = '') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <defs>
    <clipPath id="round"><rect width="128" height="128" rx="22" ry="22"/></clipPath>
    ${extraDefs}
  </defs>
  <g clip-path="url(#round)">
    <rect width="128" height="128" fill="${C.slate}"/>
    ${inner}
  </g>
</svg>`;
}

// =========================================================================
// CONCEPT 1–3 — bedsheet trio: the Three Wise Ghosts
// Mizaru / Kikazaru / Iwazaru (見ずる / 聞かずる / 言わずる).
// Standard bedsheet body (bone, x 26..102, deep humps to y=104). The monkey
// gesture — hands placed over a sensory feature — is rendered as bone paw
// ellipses with a slate stroke so they read as separate "hands" against the
// bone sheet. Position carries the meaning; outlines carry the legibility.
// =========================================================================
function bedsheetSheet() {
  // bedsheet body only — no eyes / no hands. Shared across the trio.
  return `
    <path
      d="M 26 54
         C 26 14 102 14 102 54
         L 102 92
         Q 89.33 104 76.67 92
         Q 64 104 51.33 92
         Q 38.67 104 26 92
         Z"
      fill="${C.bone}"/>
  `;
}
function bedsheetEyes() {
  return `
    <circle cx="52" cy="50" r="8" fill="${C.slate}"/>
    <circle cx="76" cy="50" r="8" fill="${C.slate}"/>
  `;
}
const ghostHand = (cx, cy, rx, ry) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${C.bone}" stroke="${C.slate}" stroke-width="1.4"/>`;

// Mizaru — see no evil: two paws across the eye band; eyes NOT drawn.
function svgBedsheetSeeNoEvil() {
  return frame(`
    ${bedsheetSheet()}
    ${ghostHand(52, 50, 11, 8.5)}
    ${ghostHand(76, 50, 11, 8.5)}
  `);
}

// Kikazaru — hear no evil: paws clamped on the sides of the head, straddling
// the body's left/right edge. Eyes visible in the centre.
function svgBedsheetHearNoEvil() {
  return frame(`
    ${bedsheetSheet()}
    ${bedsheetEyes()}
    ${ghostHand(24, 46, 10, 12)}
    ${ghostHand(104, 46, 10, 12)}
  `);
}

// Iwazaru — speak no evil: two paws touching at centre over where the mouth
// would sit. Eyes visible.
function svgBedsheetSpeakNoEvil() {
  return frame(`
    ${bedsheetSheet()}
    ${bedsheetEyes()}
    ${ghostHand(53, 66, 11, 7)}
    ${ghostHand(75, 66, 11, 7)}
  `);
}

// =========================================================================
// CONCEPT 4 — bedsheet-trio  (NEW)
// All three wise ghosts in one frame: Mizaru · Kikazaru · Iwazaru in a row,
// honouring the canonical 三猿 composition. Each is a mini bedsheet (width
// 32, body y=36..93) carrying its own gesture. Reads well from ~64px up;
// below that, prefer the single-monkey variants for Stripe receipts.
// =========================================================================
function miniGhost(cx, variant) {
  // shared mini body: width 32 (cx±16), dome 36..52, sides to 83, humps to 93.
  const body = `
    <path
      d="M ${cx - 16} 52
         C ${cx - 16} 36 ${cx + 16} 36 ${cx + 16} 52
         L ${cx + 16} 83
         Q ${cx + 10.67} 93 ${cx + 5.33} 83
         Q ${cx} 93 ${cx - 5.33} 83
         Q ${cx - 10.67} 93 ${cx - 16} 83
         Z"
      fill="${C.bone}"/>
  `;
  const eyes = `
    <circle cx="${cx - 5}" cy="58" r="2.5" fill="${C.slate}"/>
    <circle cx="${cx + 5}" cy="58" r="2.5" fill="${C.slate}"/>
  `;
  const paw = (x, y, rx, ry) =>
    `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${C.bone}" stroke="${C.slate}" stroke-width="0.9"/>`;

  let extras = '';
  if (variant === 'see') {
    // Mizaru — paws across eye band; eyes hidden behind hands.
    extras = paw(cx - 5.5, 58, 5, 4) + paw(cx + 5.5, 58, 5, 4);
  } else if (variant === 'hear') {
    // Kikazaru — paws clamped on the sides of the head; eyes visible.
    extras = eyes + paw(cx - 18, 55, 4, 6) + paw(cx + 18, 55, 4, 6);
  } else if (variant === 'speak') {
    // Iwazaru — paws touching at the mouth zone; eyes visible.
    extras = eyes + paw(cx - 4.5, 71, 4.5, 3) + paw(cx + 4.5, 71, 4.5, 3);
  }
  return body + extras;
}
function svgBedsheetTrio() {
  // centres at 22 / 64 / 106 → 10px gap between ghost edges, 6px side margins.
  return frame(`
    ${miniGhost(22, 'see')}
    ${miniGhost(64, 'hear')}
    ${miniGhost(106, 'speak')}
  `);
}

// =========================================================================
// CONCEPT 2 — chat
// Rounded chat bubble (bone) w/ iMessage-style tail bottom-left.
// 3 typing dots (fog) inside, opacity 1.0 / 0.5 / 0.2.
// Bubble fills ~75% of canvas.
// =========================================================================
function svgChat() {
  // bubble rect: 16..112 wide (w 96, 75%), 18..84 tall (h 66), rx 20
  // tail: teardrop hanging off bottom-left
  const bubble = `
    <rect x="16" y="18" width="96" height="66" rx="20" ry="20" fill="${C.bone}"/>
    <path
      d="M 26 82
         Q 20 96 12 104
         Q 30 102 42 84
         Z"
      fill="${C.bone}"/>
    <circle cx="44" cy="51" r="5.5" fill="${C.fog}" fill-opacity="1.0"/>
    <circle cx="64" cy="51" r="5.5" fill="${C.fog}" fill-opacity="0.5"/>
    <circle cx="84" cy="51" r="5.5" fill="${C.fog}" fill-opacity="0.2"/>
  `;
  return frame(bubble);
}

// =========================================================================
// CONCEPT 3 — tombstone-ghost
// Bone tombstone (rounded-top slab) bottom 60%; small snow bedsheet ghost
// peeking from behind, top 40%. Tiny faint R·I·P on the slab.
// =========================================================================
function svgTombstoneGhost() {
  // Ghost (snow) rendered first so the tombstone covers its lower half.
  // Ghost box: x 46..82 (w 36), y 12..58
  // Tombstone: x 28..100 (w 72), y 46..118; rounded-top via Q corners.
  const inner = `
    <path
      d="M 46 32
         C 46 12 82 12 82 32
         L 82 58
         Q 76 66 70 58
         Q 64 66 58 58
         Q 52 66 46 58
         Z"
      fill="${C.snow}"/>
    <circle cx="56" cy="28" r="2.6" fill="${C.slate}"/>
    <circle cx="72" cy="28" r="2.6" fill="${C.slate}"/>

    <path
      d="M 28 118
         L 28 68
         Q 28 46 64 46
         Q 100 46 100 68
         L 100 118
         Z"
      fill="${C.bone}"/>

    <text
      x="64" y="82"
      text-anchor="middle"
      font-family="Georgia, 'Times New Roman', serif"
      font-size="9"
      font-weight="700"
      letter-spacing="0.6"
      fill="${C.fog}"
      fill-opacity="0.4">R·I·P</text>
  `;
  return frame(inner);
}

// =========================================================================
// CONCEPT 4 — g-dissolve  (REFINED)
// Solid bold mono g, baseline y=74; descender hard-cut, replaced by 5 sharp
// solid-bone wedges (mirror-symmetric around x=64). NO opacity fade — the
// "dissolving" reads via negative space between crisp shards.
// =========================================================================
function svgGDissolve() {
  const extraDefs = `
    <clipPath id="cutDescender">
      <rect x="0" y="0" width="128" height="74"/>
    </clipPath>
  `;
  // 5 wedges: centered, mirror-symmetric. Center is tallest; outers shortest.
  // base half-widths and tip-Y per tendril (top at y=74 for all):
  //   outer-L:  cx=50, hw=2.0, tipY=100
  //   inner-L:  cx=57, hw=2.2, tipY=106
  //   center:   cx=64, hw=2.5, tipY=112
  //   inner-R:  cx=71, hw=2.2, tipY=106
  //   outer-R:  cx=78, hw=2.0, tipY=100
  const wedge = (cx, hw, tipY) =>
    `<path d="M ${cx - hw} 74 L ${cx + hw} 74 L ${cx} ${tipY} Z" fill="${C.bone}"/>`;
  const tendrils = [
    wedge(50, 2.0, 100),
    wedge(57, 2.2, 106),
    wedge(64, 2.5, 112),
    wedge(71, 2.2, 106),
    wedge(78, 2.0, 100),
  ].join('\n    ');
  const inner = `
    <text
      clip-path="url(#cutDescender)"
      x="64" y="74"
      text-anchor="middle"
      font-family="'Courier New', 'Liberation Mono', 'DejaVu Sans Mono', Courier, monospace"
      font-size="86"
      font-weight="700"
      fill="${C.bone}">g</text>
    ${tendrils}
  `;
  return frame(inner, extraDefs);
}

// =========================================================================
// CONCEPT 5 — g-ghost  (NEW HYBRID)
// Top half of a bold mono g (bowl + stem visible from ~y=30 to y=72) merges
// seamlessly into a small bedsheet-ghost body below. Same bone fill so the
// silhouette reads as a single "g" at small sizes; up close, the eyes reveal
// the ghost hiding in the descender.
// =========================================================================
function svgGGhost() {
  const extraDefs = `
    <clipPath id="cutDescenderGG">
      <rect x="0" y="0" width="128" height="72"/>
    </clipPath>
  `;
  // Ghost body: 36px wide (x 46..82), top slightly arched UP into y=66 so it
  // overlaps the bowl bottom and the seam disappears (same bone fill). Sides
  // drop to y=96, then 3 humps dip to y=110.
  const ghostBody = `
    <path
      d="M 46 72
         C 46 66 82 66 82 72
         L 82 96
         Q 76 110 70 96
         Q 64 110 58 96
         Q 52 110 46 96
         Z"
      fill="${C.bone}"/>
    <circle cx="56" cy="88" r="4" fill="${C.slate}"/>
    <circle cx="72" cy="88" r="4" fill="${C.slate}"/>
  `;
  const inner = `
    <text
      clip-path="url(#cutDescenderGG)"
      x="64" y="72"
      text-anchor="middle"
      font-family="'Courier New', 'Liberation Mono', 'DejaVu Sans Mono', Courier, monospace"
      font-size="84"
      font-weight="700"
      fill="${C.bone}">g</text>
    ${ghostBody}
  `;
  return frame(inner, extraDefs);
}

// ---- render --------------------------------------------------------------
const CONCEPTS = {
  'bedsheet-see-no-evil':   svgBedsheetSeeNoEvil,   // Mizaru
  'bedsheet-hear-no-evil':  svgBedsheetHearNoEvil,  // Kikazaru
  'bedsheet-speak-no-evil': svgBedsheetSpeakNoEvil, // Iwazaru
  'bedsheet-trio':          svgBedsheetTrio,        // all 3 in one
  'chat':                   svgChat,
  'tombstone-ghost':        svgTombstoneGhost,
  'g-dissolve':             svgGDissolve,
  'g-ghost':                svgGGhost,
};

(async () => {
  const written = [];

  for (const [name, build] of Object.entries(CONCEPTS)) {
    const svg = build();
    const buf = Buffer.from(svg, 'utf8');

    for (const size of SIZES) {
      const out = path.join(OUT_DIR, `ghosting-icon-${name}-${size}.png`);

      // density scales the SVG raster so text/strokes are crisp at target size.
      // viewBox is 128; density 72 ⇒ 128px raster, so density = 72 * size/128.
      const density = Math.max(72, Math.round((72 * size) / 128));

      await sharp(buf, { density })
        .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png({ compressionLevel: 9 })
        .toFile(out);

      console.log(`wrote ${path.relative(process.cwd(), out)}`);
      written.push(out);
    }
  }

  console.log('\nAll output files:');
  for (const f of written) console.log('  ' + path.relative(process.cwd(), f));
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
