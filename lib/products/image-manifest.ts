import type { ProductImage } from "@/types/database";

/**
 * Single source of truth for catalogue imagery.
 *
 * Rules enforced here (see docs/image-assets.md):
 *  - No external image URLs live in application code.
 *  - Every asset reserves a local path under /public/images using the
 *    naming convention in the image sourcing plan.
 *  - Licensing state is recorded per asset, so a manufacturer image can never
 *    reach the storefront before permission is granted.
 *  - Until a real photograph exists, the product renders a dimensioned SVG
 *    cross-section of its profile instead of unrelated stock photography.
 */

export type ImageRole = "main" | "profile" | "installed" | "detail";

export type PermissionStatus = "own" | "approved" | "pending" | "not-required";

export type ProfileKind =
  | "longspan"
  | "metcoppo"
  | "step-tile"
  | "corrugated"
  | "shingle"
  | "ridge"
  | "trimmer"
  | "flashing"
  | "gutter"
  | "fastener"
  | "roll-forming"
  | "bending";

export interface ManifestAsset {
  role: ImageRole;
  /** Reserved local path. Absent from disk until the photograph is delivered. */
  file: string;
  alt: string;
  source: string;
  sourceUrl?: string;
  license: string;
  permissionStatus: PermissionStatus;
}

export interface ManifestEntry {
  kind: ProfileKind;
  /** Profile name as it appears on the drawing. */
  label: string;
  directory: string;
  assets: ManifestAsset[];
}

const EASTMANT = "https://evermetal.ng/products/longspan-aluminium-roofing-sheets/";
const EVERMETAL_METCOPPO = "https://evermetal.ng/products/metcoppo-aluminium-roofing-sheets/";
const EVERMETAL_ACCESSORIES = "https://evermetal.ng/products/roofing-accessories/";
const TOWER_PRODUCTS = "https://www.towerplc.com/towerroofings/products.php";
const TOWER_ACCESSORIES = "https://www.towerplc.com/towerroofings/accessories.php";
const CILLA_PRODUCTS = "https://cillaaluminium.com/products.html";

const PENDING = "Permission required from manufacturer";
const OWN = "Original photography by the business";

/**
 * Reserved catalogue assets keyed by product slug.
 *
 * `permissionStatus: "pending"` means the file path is reserved and the alt
 * text is written, but the image must not be downloaded or published until
 * written permission exists.
 */
export const PRODUCT_IMAGE_MANIFEST: Record<string, ManifestEntry> = {
  "premium-longspan-aluminium-roofing-sheet": {
    kind: "longspan",
    label: "Longspan",
    directory: "longspan",
    assets: [
      {
        role: "main",
        file: "/images/products/longspan/longspan-main.webp",
        alt: "Roll-formed aluminium longspan roofing sheet",
        source: "Evermetal / Cilla",
        sourceUrl: EASTMANT,
        license: PENDING,
        permissionStatus: "pending",
      },
      {
        role: "profile",
        file: "/images/products/longspan/longspan-profile.webp",
        alt: "Longspan aluminium roofing sheet showing the rib profile cross-section",
        source: "Evermetal",
        sourceUrl: EASTMANT,
        license: PENDING,
        permissionStatus: "pending",
      },
      {
        role: "installed",
        file: "/images/products/longspan/longspan-installed.webp",
        alt: "Completed roof covered in longspan aluminium roofing",
        source: "Own project",
        license: OWN,
        permissionStatus: "own",
      },
    ],
  },
  "metcopo-steptile-profile-sheet": {
    kind: "metcoppo",
    label: "Metcoppo",
    directory: "metcoppo",
    assets: [
      {
        role: "main",
        file: "/images/products/metcoppo/metcoppo-main.webp",
        alt: "Roll-formed aluminium metcoppo roofing sheet with a stepped tile-effect profile",
        source: "Evermetal",
        sourceUrl: EVERMETAL_METCOPPO,
        license: PENDING,
        permissionStatus: "pending",
      },
      {
        role: "profile",
        file: "/images/products/metcoppo/metcoppo-profile.webp",
        alt: "Metcoppo aluminium roofing sheet showing the stepped tile profile",
        source: "Evermetal",
        sourceUrl: EVERMETAL_METCOPPO,
        license: PENDING,
        permissionStatus: "pending",
      },
      {
        role: "installed",
        file: "/images/products/metcoppo/metcoppo-installed.webp",
        alt: "Completed roof covered in metcoppo aluminium roofing",
        source: "Own project",
        license: OWN,
        permissionStatus: "own",
      },
    ],
  },
  "stone-coated-shake-shingle-tile": {
    kind: "shingle",
    label: "Shingle",
    directory: "shingles",
    assets: [
      {
        role: "main",
        file: "/images/products/shingles/shingles-main.webp",
        alt: "Stone-coated shake shingle tile",
        source: "Business stock",
        license: OWN,
        permissionStatus: "own",
      },
      {
        role: "profile",
        file: "/images/products/shingles/shingles-profile.webp",
        alt: "Shingle tile showing tabbed courses and keyway slot",
        source: "Business stock",
        license: OWN,
        permissionStatus: "own",
      },
      {
        role: "installed",
        file: "/images/products/shingles/shingles-installed.webp",
        alt: "Completed roof covered in stone-coated shingles",
        source: "Own project",
        license: OWN,
        permissionStatus: "own",
      },
    ],
  },
  "heavy-gauge-ridged-apex-cap": {
    kind: "ridge",
    label: "Ridge cap",
    directory: "ridge-caps",
    assets: [
      {
        role: "main",
        file: "/images/products/ridge-caps/ridge-cap-main.webp",
        alt: "Heavy-gauge ridged aluminium ridge cap for the apex of a roof",
        source: "Tower / Evermetal",
        sourceUrl: TOWER_ACCESSORIES,
        license: PENDING,
        permissionStatus: "pending",
      },
      {
        role: "profile",
        file: "/images/products/ridge-caps/ridge-cap-profile.webp",
        alt: "Ridge cap cross-section showing the folded apex and return lips",
        source: "Tower",
        sourceUrl: TOWER_ACCESSORIES,
        license: PENDING,
        permissionStatus: "pending",
      },
    ],
  },
  "on-site-continuous-roll-forming-service": {
    kind: "roll-forming",
    label: "Roll forming",
    directory: "roll-forming",
    assets: [
      {
        role: "main",
        file: "/images/services/roll-forming/roll-forming-main.webp",
        alt: "Aluminium coil being roll formed into a roofing sheet on site",
        source: "Own workshop",
        license: OWN,
        permissionStatus: "own",
      },
      {
        role: "detail",
        file: "/images/services/roll-forming/roll-forming-machine.webp",
        alt: "Roll-forming machine in the workshop",
        source: "Own workshop",
        license: OWN,
        permissionStatus: "own",
      },
    ],
  },
  "custom-cnc-sheet-bending-service": {
    kind: "bending",
    label: "Sheet bending",
    directory: "bending",
    assets: [
      {
        role: "main",
        file: "/images/services/bending/bending-service.webp",
        alt: "Aluminium sheet being bent to a required profile",
        source: "Own workshop",
        license: OWN,
        permissionStatus: "own",
      },
      {
        role: "detail",
        file: "/images/services/bending/sheet-bending-machine.webp",
        alt: "Press brake used for sheet bending",
        source: "Own workshop",
        license: OWN,
        permissionStatus: "own",
      },
    ],
  },
  "self-drilling-hex-roofing-screws-pack-100": {
    kind: "fastener",
    label: "Roofing screw",
    directory: "accessories",
    assets: [
      {
        role: "main",
        file: "/images/products/accessories/roofing-screws-main.webp",
        alt: "Self-drilling hex head roofing screw",
        source: "Business stock",
        license: OWN,
        permissionStatus: "own",
      },
    ],
  },
};

/** Reserved assets for categories that do not yet have a seeded product. */
export const CATEGORY_IMAGE_MANIFEST: Record<string, ManifestEntry> = {
  "roofing-sheets": {
    kind: "longspan",
    label: "Longspan",
    directory: "longspan",
    assets: [
      {
        role: "main",
        file: "/images/products/longspan/longspan-installed.webp",
        alt: "Completed longspan aluminium roof",
        source: "Own project",
        license: OWN,
        permissionStatus: "own",
      },
    ],
  },
  "metcopo-roofing": {
    kind: "metcoppo",
    label: "Metcoppo",
    directory: "metcoppo",
    assets: [
      {
        role: "main",
        file: "/images/products/metcoppo/metcoppo-installed.webp",
        alt: "Completed metcoppo aluminium roof",
        source: "Own project",
        license: OWN,
        permissionStatus: "own",
      },
    ],
  },
  "step-tiles": {
    kind: "step-tile",
    label: "Step tile",
    directory: "step-tiles",
    assets: [
      {
        role: "main",
        file: "/images/products/step-tiles/step-tiles-main.webp",
        alt: "Aluminium step tile roofing sheet",
        source: "Cilla / Ligcon",
        sourceUrl: CILLA_PRODUCTS,
        license: PENDING,
        permissionStatus: "pending",
      },
    ],
  },
  shingles: {
    kind: "shingle",
    label: "Shingle",
    directory: "shingles",
    assets: [
      {
        role: "main",
        file: "/images/products/shingles/shingles-installed.webp",
        alt: "Completed stone-coated shingle roof",
        source: "Own project",
        license: OWN,
        permissionStatus: "own",
      },
    ],
  },
  "ridge-caps": {
    kind: "ridge",
    label: "Ridge cap",
    directory: "ridge-caps",
    assets: [
      {
        role: "main",
        file: "/images/products/ridge-caps/ridge-cap-installed.webp",
        alt: "Ridge cap installed along a roof apex",
        source: "Own project",
        license: OWN,
        permissionStatus: "own",
      },
    ],
  },
  "trimmers-and-parapets": {
    kind: "trimmer",
    label: "Trimmer",
    directory: "trimmers",
    assets: [
      {
        role: "main",
        file: "/images/products/trimmers/upper-trimmer-main.webp",
        alt: "Upper trimmer profile for closing the ridge of a roofing sheet",
        source: "Business stock",
        license: OWN,
        permissionStatus: "own",
      },
    ],
  },
  parapets: {
    kind: "flashing",
    label: "Flashing",
    directory: "flashings",
    assets: [
      {
        role: "main",
        file: "/images/products/flashings/valley-flashing.webp",
        alt: "Valley flashing where two roof planes meet",
        source: "Tower / Evermetal",
        sourceUrl: TOWER_ACCESSORIES,
        license: PENDING,
        permissionStatus: "pending",
      },
    ],
  },
  "corrugated-sheets": {
    kind: "corrugated",
    label: "Corrugated",
    directory: "corrugated",
    assets: [
      {
        role: "main",
        file: "/images/products/corrugated/corrugated-main.webp",
        alt: "Corrugated aluminium roofing sheet",
        source: "Tower / Evermetal",
        sourceUrl: TOWER_PRODUCTS,
        license: PENDING,
        permissionStatus: "pending",
      },
      {
        role: "profile",
        file: "/images/products/corrugated/corrugated-profile.webp",
        alt: "Corrugated sheet showing the corrugation cross-section",
        source: "Tower",
        sourceUrl: TOWER_PRODUCTS,
        license: PENDING,
        permissionStatus: "pending",
      },
    ],
  },
  "roll-forming": {
    kind: "roll-forming",
    label: "Roll forming",
    directory: "roll-forming",
    assets: [
      {
        role: "main",
        file: "/images/services/roll-forming/roll-forming-process.webp",
        alt: "Aluminium coil passing through the roll-forming machine",
        source: "Own workshop",
        license: OWN,
        permissionStatus: "own",
      },
    ],
  },
  "bending-services": {
    kind: "bending",
    label: "Bending",
    directory: "bending",
    assets: [
      {
        role: "main",
        file: "/images/services/bending/fabrication-workshop.webp",
        alt: "Fabrication workshop where sheet metal is bent and cut",
        source: "Own workshop",
        license: OWN,
        permissionStatus: "own",
      },
    ],
  },
  accessories: {
    kind: "gutter",
    label: "Gutter",
    directory: "accessories",
    assets: [
      {
        role: "main",
        file: "/images/products/accessories/gutter-main.webp",
        alt: "Aluminium gutter section with downpipe",
        source: "Evermetal",
        sourceUrl: EVERMETAL_ACCESSORIES,
        license: PENDING,
        permissionStatus: "pending",
      },
    ],
  },
};

const UNKNOWN: ManifestEntry = {
  kind: "longspan",
  label: "Roofing profile",
  directory: "products",
  assets: [
    {
      role: "main",
      file: "/images/products/products-main.webp",
      alt: "Roofing product awaiting photography",
      source: "Unassigned",
      license: PENDING,
      permissionStatus: "pending",
    },
  ],
};

export function getManifestEntry(slug: string | undefined | null): ManifestEntry {
  if (!slug) return UNKNOWN;
  return PRODUCT_IMAGE_MANIFEST[slug] ?? CATEGORY_IMAGE_MANIFEST[slug] ?? UNKNOWN;
}

/** Picks the image a card should show, preferring the row flagged primary. */
export function pickPrimaryImage(images: ProductImage[] | undefined | null): ProductImage | null {
  if (!images || images.length === 0) return null;
  return images.find((img) => img.is_primary) ?? images[0];
}

/**
 * Resolves the display image for a product, and whether the SVG profile
 * cross-section should stand in for it.
 */
export function resolveKind(slug: string | undefined | null): {
  kind: ProfileKind;
  label: string;
} {
  const entry = getManifestEntry(slug);
  return { kind: entry.kind, label: entry.label };
}

/** Flattened rows for docs/image-assets.md and the shot list. */
export function listManifestAssets(): {
  file: string;
  alt: string;
  source: string;
  sourceUrl?: string;
  license: string;
  permissionStatus: PermissionStatus;
}[] {
  return [
    ...Object.values(PRODUCT_IMAGE_MANIFEST),
    ...Object.values(CATEGORY_IMAGE_MANIFEST),
  ].flatMap((entry) => entry.assets);
}