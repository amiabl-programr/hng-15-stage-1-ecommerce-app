import { writeFileSync, mkdirSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { ProfileDiagram } from "../components/products/ProfileDiagram";
import { HeroProfileSheet } from "../components/ui/HeroProfileSheet";
import type { ProfileKind } from "../lib/products/image-manifest";

/**
 * Renders the profile cross-sections to a PNG contact sheet so the geometry can
 * be reviewed before it ships. Run with: pnpm assets:preview
 */

const KINDS: ProfileKind[] = [
  "longspan",
  "metcoppo",
  "corrugated",
  "shingle",
  "ridge",
  "trimmer",
  "flashing",
  "gutter",
  "fastener",
  "roll-forming",
  "bending",
];

const CELL = 300;
const COLS = 4;
const ROWS = Math.ceil(KINDS.length / COLS);

const cells = KINDS.map((kind, i) => {
  const x = (i % COLS) * CELL;
  const y = Math.floor(i / COLS) * CELL;
  const inner = renderToStaticMarkup(<ProfileDiagram kind={kind} tone="light" />);
  const svg = inner.slice(inner.indexOf("<svg"), inner.lastIndexOf("</svg>") + 6);
  return `<g transform="translate(${x},${y})"><rect width="${CELL}" height="${CELL}" fill="#f1f5f9"/>${svg}</g>`;
}).join("");

const hero = renderToStaticMarkup(<HeroProfileSheet />);
const heroSvg = hero.slice(hero.indexOf("<svg"), hero.lastIndexOf("</svg>") + 6);

const sheet = `<svg xmlns="http://www.w3.org/2000/svg" width="${COLS * CELL}" height="${ROWS * CELL + 160}" viewBox="0 0 ${COLS * CELL} ${ROWS * CELL + 160}">
  <rect width="100%" height="100%" fill="#ffffff"/>
  ${cells}
  <g transform="translate(0,${ROWS * CELL + 20})">
    <rect width="${COLS * CELL}" height="120" fill="#0f172a"/>
    <g transform="translate(0,20) scale(${COLS * CELL / 1200},1)">${heroSvg}</g>
  </g>
</svg>`;

mkdirSync("docs/preview", { recursive: true });
writeFileSync("docs/preview/profiles.svg", sheet);

// eslint-disable-next-line @typescript-eslint/no-require-imports
const sharp = require("sharp");
sharp(Buffer.from(sheet), { density: 96 })
  .png()
  .toFile("docs/preview/profiles.png")
  .then(() => console.log("Wrote docs/preview/profiles.png"))
  .catch((err: unknown) => console.error("PNG render failed:", err));