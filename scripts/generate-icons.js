#!/usr/bin/env node
/**
 * Generates a stylized lotus icon for the Yogini Rakshita app.
 *
 *   icon.png          1024x1024  cream background, purple lotus
 *   adaptive-icon.png 1024x1024  transparent foreground, lotus inside Android safe area
 *
 * Uses only Node built-ins (zlib + Buffer). No npm dependencies.
 *
 *   node scripts/generate-icons.js
 */

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const SIZE = 1024;

// Palette tuned to match src/lib/constants.ts COLORS.
const BG = [0xff, 0xf7, 0xed]; // cream background
const PETAL_OUTER = [0x7c, 0x3a, 0xed]; // primary purple
const PETAL_INNER = [0xf9, 0xa8, 0xd4]; // soft pink for the petal centers
const CENTER = [0xfb, 0xbf, 0x24]; // amber seed pod
const SHADOW = [0x5b, 0x21, 0xb6]; // primaryDark for petal outline

function lerp(a, b, t) {
  return a + (b - a) * t;
}
function lerpColor(a, b, t) {
  return [
    Math.round(lerp(a[0], b[0], t)),
    Math.round(lerp(a[1], b[1], t)),
    Math.round(lerp(a[2], b[2], t)),
  ];
}
function clamp(x, lo, hi) {
  return Math.max(lo, Math.min(hi, x));
}
function smoothstep(edge0, edge1, x) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/**
 * Sample the lotus at (x, y). Returns [r, g, b, a] for the foreground pixel
 * (with alpha) — caller decides whether to composite onto a solid background
 * or leave transparent (for the adaptive icon).
 */
function sampleLotus(x, y, opts) {
  const { cx, cy, radius } = opts;
  const dx = x - cx;
  const dy = y - cy;
  const r = Math.sqrt(dx * dx + dy * dy);
  const theta = Math.atan2(dy, dx);

  // 8-petal flower: r_max(theta) is maximal at theta = k*pi/4.
  // cos^2(4*theta) has period pi/4 and 8 maxima per 2*pi.
  const petalShape = Math.cos(4 * theta);
  const petalEnvelope = 0.55 + 0.45 * (petalShape * petalShape);
  const rMax = radius * petalEnvelope;

  // Soft anti-aliased edge over ~3 pixels.
  const edgeWidth = 3;
  const inside = 1 - smoothstep(rMax - edgeWidth, rMax + edgeWidth, r);
  if (inside <= 0) return [0, 0, 0, 0];

  // Radial gradient: pink/inner near center, purple toward the rim.
  // Then dip back to a darker outline ring near the edge.
  const t = clamp(r / rMax, 0, 1);
  let color;
  if (t < 0.85) {
    color = lerpColor(PETAL_INNER, PETAL_OUTER, t / 0.85);
  } else {
    color = lerpColor(PETAL_OUTER, SHADOW, (t - 0.85) / 0.15);
  }

  // Center seed pod: a small amber disc with a soft edge.
  const centerR = radius * 0.18;
  const centerEdge = 1 - smoothstep(centerR - edgeWidth, centerR + edgeWidth, r);
  if (centerEdge > 0) {
    color = lerpColor(color, CENTER, centerEdge);
  }

  // Subtle inter-petal seam — darken where the cos²(4θ) envelope is small.
  const seam = 1 - petalShape * petalShape; // 0 at petal peak, 1 at gap
  if (seam > 0.7 && t > 0.4) {
    const dim = (seam - 0.7) / 0.3; // 0..1
    color = lerpColor(color, SHADOW, dim * 0.45);
  }

  const alpha = Math.round(inside * 255);
  return [color[0], color[1], color[2], alpha];
}

function generate({ withBackground }) {
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  // Adaptive icons must keep all art inside the central ~66% to survive
  // launcher cropping (circle/squircle/rounded square). 1024 * 0.66 ~= 676,
  // so a radius of 320 gives the lotus a comfortable margin of ~12% on each side.
  // For the regular icon we can fill more of the canvas.
  const radius = withBackground ? 410 : 320;

  // Per-row buffer: 1 filter byte + 4 bytes (RGBA) per pixel.
  const rowBytes = 1 + SIZE * 4;
  const raw = Buffer.alloc(rowBytes * SIZE);

  for (let y = 0; y < SIZE; y++) {
    const rowStart = y * rowBytes;
    raw[rowStart] = 0; // filter type: None
    for (let x = 0; x < SIZE; x++) {
      const [pr, pg, pb, pa] = sampleLotus(x, y, { cx, cy, radius });
      const off = rowStart + 1 + x * 4;
      if (withBackground) {
        // Composite lotus over the cream background.
        const a = pa / 255;
        raw[off + 0] = Math.round(pr * a + BG[0] * (1 - a));
        raw[off + 1] = Math.round(pg * a + BG[1] * (1 - a));
        raw[off + 2] = Math.round(pb * a + BG[2] * (1 - a));
        raw[off + 3] = 255;
      } else {
        raw[off + 0] = pr;
        raw[off + 1] = pg;
        raw[off + 2] = pb;
        raw[off + 3] = pa;
      }
    }
  }

  return encodePng(SIZE, SIZE, raw);
}

// ----- minimal PNG encoder -----

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(typeStr, data) {
  const type = Buffer.from(typeStr, "ascii");
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([type, data])), 0);
  return Buffer.concat([len, type, data, crcBuf]);
}

function encodePng(width, height, raw) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const idat = zlib.deflateSync(raw, { level: 9 });

  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// ----- run -----

const outDir = path.join(__dirname, "..", "assets");
fs.mkdirSync(outDir, { recursive: true });

const iconPath = path.join(outDir, "icon.png");
const adaptivePath = path.join(outDir, "adaptive-icon.png");

console.log("Generating icon.png ...");
fs.writeFileSync(iconPath, generate({ withBackground: true }));
console.log(`  -> ${iconPath} (${fs.statSync(iconPath).size} bytes)`);

console.log("Generating adaptive-icon.png ...");
fs.writeFileSync(adaptivePath, generate({ withBackground: false }));
console.log(`  -> ${adaptivePath} (${fs.statSync(adaptivePath).size} bytes)`);

console.log("Done.");
