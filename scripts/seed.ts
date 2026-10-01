import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment configuration from .env or .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey =
  process.env.SUPABASE_SECRET_KEY ||
  (process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("placeholder")
    ? process.env.SUPABASE_SERVICE_ROLE_KEY
    : null) ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !serviceRoleKey || supabaseUrl.includes("placeholder")) {
  console.error("Cannot connect to Supabase: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY in environment configuration.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

interface SeedCategory {
  name: string;
  slug: string;
  description: string;
  image_url: string;
  display_order: number;
}

interface SeedProduct {
  categorySlug: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  product_type: "standard" | "dimensioned" | "service";
  base_price: number;
  unit: "piece" | "metre" | "bundle" | "sqm" | "service" | "roll";
  min_order_quantity: number;
  is_featured: boolean;
  specifications: Record<string, unknown>;
  imageUrl: string;
  variants?: Array<{
    name: string;
    sku: string;
    price_override?: number;
    attributes: Record<string, unknown>;
    stock_quantity: number;
  }>;
}

const SEED_CATEGORIES: SeedCategory[] = [
  {
    name: "Roofing Sheets",
    slug: "roofing-sheets",
    description: "Industrial & residential longspan aluminium sheets available in custom lengths.",
    image_url: "https://images.unsplash.com/photo-1620027814885-f55a1cb8b776?auto=format&fit=crop&w=800&q=80",
    display_order: 1,
  },
  {
    name: "Metcopo Roofing",
    slug: "metcopo-roofing",
    description: "Classic European clay tile aesthetics engineered in high-tensile aluzinc steel.",
    image_url: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80",
    display_order: 2,
  },
  {
    name: "Step Tiles",
    slug: "step-tiles",
    description: "Stepped architectural panels with anti-fade exterior resin finishes.",
    image_url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    display_order: 3,
  },
  {
    name: "Roofing Shingles",
    slug: "shingles",
    description: "Multi-layered volcanic basalt stone-coated asphalt tiles for luxury roofs.",
    image_url: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80",
    display_order: 4,
  },
  {
    name: "Ridge Caps & Apex",
    slug: "ridge-caps",
    description: "Heavy gauge apex caps to seal junctions against driving rainfall.",
    image_url: "https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=800&q=80",
    display_order: 5,
  },
  {
    name: "Trimmers & Gutters",
    slug: "trimmers-and-parapets",
    description: "Valley gutters, flashing trimmers, and parapet perimeter wall copings.",
    image_url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
    display_order: 6,
  },
  {
    name: "Parapets & Flashing",
    slug: "parapets",
    description: "Double drip edge architectural wall cappings for firewall perimeters.",
    image_url: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80",
    display_order: 7,
  },
  {
    name: "Corrugated Sheets",
    slug: "corrugated-sheets",
    description: "Traditional heavy-gauge sinusoidal steel sheets for industrial structures.",
    image_url: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=800&q=80",
    display_order: 8,
  },
  {
    name: "Roll Forming Services",
    slug: "roll-forming",
    description: "Computerized on-site continuous roll forming rigs up to 30 metres unbroken.",
    image_url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    display_order: 9,
  },
  {
    name: "Bending & Fabrication",
    slug: "bending-services",
    description: "CNC press brake metal folding, arch curving, and bespoke trims.",
    image_url: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
    display_order: 10,
  },
  {
    name: "Accessories & Fasteners",
    slug: "accessories",
    description: "EPDM self-drilling hex fasteners, butyl waterproof tapes, and sealants.",
    image_url: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=800&q=80",
    display_order: 11,
  },
];

const SEED_PRODUCTS: SeedProduct[] = [
  {
    categorySlug: "roofing-sheets",
    name: "Premium Longspan Aluminium Roofing Sheet",
    slug: "premium-longspan-aluminium-roofing-sheet",
    description:
      "Industrial-grade continuous longspan aluminium sheet engineered to withstand intense tropical sun and heavy coastal rain. Can be formed to any length without overlapping joints.",
    short_description: "High durability longspan aluminium sheet available in custom lengths and gauges.",
    product_type: "dimensioned",
    base_price: 3800.0,
    unit: "metre",
    min_order_quantity: 1,
    is_featured: true,
    imageUrl: "https://images.unsplash.com/photo-1620027814885-f55a1cb8b776?auto=format&fit=crop&w=1200&q=80",
    specifications: {
      material: "Aluminium Alloy 3003",
      effective_width: "900mm",
      warranty: "25 Years",
      heat_reflection: "85%",
    },
    variants: [
      {
        name: "0.45mm / Wine Red",
        sku: "LS-045-WR",
        price_override: 3800.0,
        attributes: { thickness: "0.45mm", colour: "Wine Red", finish: "Gloss" },
        stock_quantity: 1500,
      },
      {
        name: "0.50mm / Wine Red",
        sku: "LS-050-WR",
        price_override: 4200.0,
        attributes: { thickness: "0.50mm", colour: "Wine Red", finish: "Gloss" },
        stock_quantity: 2000,
      },
      {
        name: "0.55mm / Slate Grey",
        sku: "LS-055-SG",
        price_override: 4700.0,
        attributes: { thickness: "0.55mm", colour: "Slate Grey", finish: "Matte" },
        stock_quantity: 1200,
      },
      {
        name: "0.50mm / Forest Green",
        sku: "LS-050-FG",
        price_override: 4200.0,
        attributes: { thickness: "0.50mm", colour: "Forest Green", finish: "Gloss" },
        stock_quantity: 1800,
      },
    ],
  },
  {
    categorySlug: "metcopo-roofing",
    name: "Metcopo Steptile Profile Sheet",
    slug: "metcopo-steptile-profile-sheet",
    description:
      "Metcopo profile combines the classic architectural elegance of clay roofing tiles with the ultra-lightweight strength of zinc-coated steel.",
    short_description: "Classical architectural clay tile aesthetic with modern steel resilience.",
    product_type: "dimensioned",
    base_price: 4200.0,
    unit: "metre",
    min_order_quantity: 1,
    is_featured: true,
    imageUrl: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80",
    specifications: {
      material: "Aluzinc Steel",
      effective_width: "1000mm",
      step_height: "28mm",
      warranty: "30 Years",
    },
    variants: [
      {
        name: "0.50mm / Traffic Blue",
        sku: "MC-050-TB",
        price_override: 4200.0,
        attributes: { thickness: "0.50mm", colour: "Traffic Blue", finish: "Gloss" },
        stock_quantity: 900,
      },
      {
        name: "0.55mm / Charcoal Black",
        sku: "MC-055-CB",
        price_override: 4800.0,
        attributes: { thickness: "0.55mm", colour: "Charcoal Black", finish: "Matte" },
        stock_quantity: 1100,
      },
    ],
  },
  {
    categorySlug: "shingles",
    name: "Stone-Coated Shake Shingle Tile",
    slug: "stone-coated-shake-shingle-tile",
    description:
      "Stone-coated roofing tiles made from galvanized zinc-alloy steel covered with natural volcanic basalt stone granules. Fireproof, sound-dampening, and highly luxurious.",
    short_description: "Granule-coated volcanic stone shingle tile with superior sound and heat insulation.",
    product_type: "standard",
    base_price: 5400.0,
    unit: "piece",
    min_order_quantity: 1,
    is_featured: true,
    imageUrl: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
    specifications: {
      material: "Galvalume Steel + Basalt Granules",
      length: "1340mm",
      width: "420mm",
      warranty: "50 Years",
    },
    variants: [
      {
        name: "Basalt Charcoal Black",
        sku: "SH-ST-BLK",
        price_override: 5400.0,
        attributes: { colour: "Charcoal Black", finish: "Stone-Coated" },
        stock_quantity: 850,
      },
      {
        name: "Spanish Coffee Brown",
        sku: "SH-ST-BRN",
        price_override: 5400.0,
        attributes: { colour: "Coffee Brown", finish: "Stone-Coated" },
        stock_quantity: 720,
      },
    ],
  },
  {
    categorySlug: "ridge-caps",
    name: "Heavy-Gauge Ridged Apex Cap (2m Length)",
    slug: "heavy-gauge-ridged-apex-cap",
    description: "V-profile and rounded barrel ridge caps designed to seal the upper roof apex against storm-driven rain.",
    short_description: "Heavy gauge apex capping for complete waterproof ridge sealing.",
    product_type: "standard",
    base_price: 2800.0,
    unit: "piece",
    min_order_quantity: 1,
    is_featured: false,
    imageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=1200&q=80",
    specifications: { material: "Aluminium / Aluzinc", length: "2000mm", girth: "450mm" },
  },
  {
    categorySlug: "roll-forming",
    name: "On-Site Continuous Roll Forming Service",
    slug: "on-site-continuous-roll-forming-service",
    description: "Automated mobile roll-forming machinery deployed straight to your construction site for sheets up to 30 metres.",
    short_description: "Mobile machine extrusion at your site with zero seam leak risk.",
    product_type: "service",
    base_price: 25000.0,
    unit: "service",
    min_order_quantity: 1,
    is_featured: true,
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    specifications: {
      crew_size: "4 Engineers",
      rig_type: "Computerized Hydraulic",
      daily_capacity: "5,000m",
    },
  },
  {
    categorySlug: "bending-services",
    name: "Custom CNC Sheet Bending & Curving Service",
    slug: "custom-cnc-sheet-bending-service",
    description: "High precision CNC brake press service for custom trimming, fascia bending, and barrel vault arches.",
    short_description: "Bespoke architectural sheet folding and radius arch curving.",
    product_type: "service",
    base_price: 850.0,
    unit: "metre",
    min_order_quantity: 1,
    is_featured: true,
    imageUrl: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80",
    specifications: {
      max_thickness: "1.2mm",
      bending_accuracy: "+/- 0.5 degrees",
      turnaround: "24-48 Hours",
    },
  },
  {
    categorySlug: "accessories",
    name: "Self-Drilling Hex Roofing Screws (Pack of 100)",
    slug: "self-drilling-hex-roofing-screws-pack-100",
    description: "Case-hardened carbon steel screws with integrated EPDM rubber sealing washers to ensure leak-free anchoring.",
    short_description: "Weather-sealed self-drilling hex fasteners with UV-stabilized rubber washers.",
    product_type: "standard",
    base_price: 6500.0,
    unit: "bundle",
    min_order_quantity: 1,
    is_featured: false,
    imageUrl: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=1200&q=80",
    specifications: {
      count: 100,
      size: "12 x 55mm",
      washer: "High Temp EPDM",
      coating: "Ruspert Corrosion Resistant",
    },
  },
];

export async function seed() {
  console.log("Starting catalogue seeder...");

  console.log(`Seeding ${SEED_CATEGORIES.length} categories...`);
  const { data: insertedCategories, error: catErr } = await supabase
    .from("categories")
    .upsert(SEED_CATEGORIES, { onConflict: "slug" })
    .select("id, slug");

  if (catErr || !insertedCategories) {
    console.error("Failed inserting categories.");
    process.exitCode = 1;
    return;
  }

  const categoryMap = new Map<string, string>(insertedCategories.map((c) => [c.slug, c.id]));
  console.log(`Categories seeded successfully (${insertedCategories.length} records).`);

  console.log(`Seeding ${SEED_PRODUCTS.length} products...`);
  let totalVariants = 0;
  let totalInventory = 0;

  for (const p of SEED_PRODUCTS) {
    const categoryId = categoryMap.get(p.categorySlug);
    if (!categoryId) {
      console.warn(`Category "${p.categorySlug}" not found. Skipping product.`);
      continue;
    }

    const { data: insertedProduct, error: prodErr } = await supabase
      .from("products")
      .upsert(
        {
          category_id: categoryId,
          name: p.name,
          slug: p.slug,
          description: p.description,
          short_description: p.short_description,
          product_type: p.product_type,
          base_price: p.base_price,
          unit: p.unit,
          min_order_quantity: p.min_order_quantity,
          is_active: true,
          is_featured: p.is_featured,
          specifications: p.specifications,
        },
        { onConflict: "slug" }
      )
      .select("id")
      .single();

    if (prodErr || !insertedProduct) {
      console.error(`Failed inserting product "${p.name}".`);
      continue;
    }

    const productId = insertedProduct.id;

    await supabase.from("product_images").upsert(
      {
        product_id: productId,
        image_url: p.imageUrl,
        alt_text: p.name,
        display_order: 1,
        is_primary: true,
      },
      { onConflict: "product_id,display_order" }
    );

    if (p.variants && p.variants.length > 0) {
      for (const v of p.variants) {
        const { data: insertedVar, error: varErr } = await supabase
          .from("product_variants")
          .upsert(
            {
              product_id: productId,
              name: v.name,
              sku: v.sku,
              price_override: v.price_override,
              attributes: v.attributes,
              stock_quantity: v.stock_quantity,
              is_active: true,
            },
            { onConflict: "sku" }
          )
          .select("id")
          .single();

        if (varErr || !insertedVar) {
          console.error(`Failed inserting variant "${v.name}".`);
          continue;
        }

        totalVariants++;

        await supabase.from("inventory").upsert(
          {
            product_id: productId,
            variant_id: insertedVar.id,
            quantity: v.stock_quantity,
            low_stock_threshold: 100,
          },
          { onConflict: "product_id,variant_id" }
        );
        totalInventory++;
      }
    } else {
      await supabase.from("inventory").upsert(
        {
          product_id: productId,
          variant_id: null,
          quantity: 500,
          low_stock_threshold: 50,
        },
        { onConflict: "product_id,variant_id" }
      );
      totalInventory++;
    }
  }

  console.log("Seeding completed successfully.");
  console.log(`- Categories: ${insertedCategories.length}`);
  console.log(`- Products:   ${SEED_PRODUCTS.length}`);
  console.log(`- Variants:   ${totalVariants}`);
  console.log(`- Inventory:  ${totalInventory}`);
}

if (process.argv[1]?.replace(/\\/g, "/").endsWith("seed.ts")) {
  seed().catch(() => {
    console.error("Unhandled seeding error occurred.");
    process.exit(1);
  });
}
