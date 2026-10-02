import { renderToStaticMarkup } from "react-dom/server";
import { ProfileDiagram } from "../components/products/ProfileDiagram";
import type { ProfileKind } from "../lib/products/image-manifest";

/**
 * Geometry check for the profile drawings. Confirms every coordinate sits
 * inside the 360x200 viewBox so no stroke is clipped.
 * Run with: pnpm assets:check
 */

const KINDS: ProfileKind[] = [
  "longspan",
  "metcoppo",
  "step-tile",
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

let failures = 0;

// Both modes are checked: compact thickens strokes, so a drawing that fits at
// 1x could still clip at 2.8x near the viewBox edge.
const MODES = [false, true] as const;

for (const compact of MODES) {
  if (compact) console.log("compact mode (strokes x2.8)");
  for (const kind of KINDS) {
    const markup = renderToStaticMarkup(
      <ProfileDiagram kind={kind} tone="light" compact={compact} />,
    );
    const paths = [...markup.matchAll(/ d="([^"]+)"/g)].map((m) => m[1]);
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    for (const d of paths) {
      for (const m of d.matchAll(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g)) {
        const x = Number(m[1]);
        const y = Number(m[2]);
        if (!Number.isFinite(x) || !Number.isFinite(y)) {
          console.error(`${kind}: non-finite coordinate in ${d.slice(0, 40)}`);
          failures++;
          continue;
        }
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
        if (x < 0 || x > 360 || y < 0 || y > 200) {
          console.error(`${kind}: (${x}, ${y}) outside the 360x200 viewBox`);
          failures++;
        }
      }
    }

    const label = `${compact ? "  " : ""}${kind}`;
    console.log(
      `${label.padEnd(14)} x ${String(minX).padStart(5)}..${String(maxX).padEnd(5)} y ${String(minY).padStart(5)}..${maxY}`,
    );
  }
}

// Two drawings must never render identically, or a category row shows the same
// picture twice and tells the buyer nothing.
const shapeOf = (kind: ProfileKind) =>
  renderToStaticMarkup(<ProfileDiagram kind={kind} tone="light" compact />)
    .replace(/id="[^"]*"/g, "")
    .replace(/(stroke-dasharray|stroke-width)="[^"]*"/g, "");

const signatures = new Map<string, ProfileKind>();
for (const kind of KINDS) {
  const sig = shapeOf(kind);
  const clash = signatures.get(sig);
  if (clash) {
    console.error(`\n${kind} renders identically to ${clash}.`);
    failures++;
  }
  signatures.set(sig, kind);
}


if (failures > 0) {
  console.error(`\n${failures} geometry problem(s) found.`);
  process.exit(1);
}
console.log(
  `\nAll ${KINDS.length} drawings fit the 360x200 viewBox in both modes, and no two render identically.`,
);