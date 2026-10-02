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

for (const kind of KINDS) {
  const markup = renderToStaticMarkup(<ProfileDiagram kind={kind} tone="light" />);
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

  const label = kind.padEnd(12);
  console.log(`${label} x ${String(minX).padStart(5)}..${String(maxX).padEnd(5)} y ${String(minY).padStart(5)}..${maxY}`);
}

if (failures > 0) {
  console.error(`\n${failures} geometry problem(s) found.`);
  process.exit(1);
}
console.log("\nAll drawings fit the 360x200 viewBox.");