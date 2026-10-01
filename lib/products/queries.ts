import { createClient } from "@/lib/supabase/server";
import { Product, Category } from "@/types/database";

// Fallback seed catalog for instant local rendering before Supabase migrations are run
export const FALLBACK_CATEGORIES: Category[] = [
  {
    id: "a0000000-0000-0000-0000-000000000001",
    name: "Roofing Sheets",
    slug: "roofing-sheets",
    description: "Industrial & residential longspan aluminium sheets available in custom lengths.",
    image_url: "https://images.unsplash.com/photo-1620027814885-f55a1cb8b776?auto=format&fit=crop&w=800&q=80",
    display_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "a0000000-0000-0000-0000-000000000002",
    name: "Metcopo Roofing",
    slug: "metcopo-roofing",
    description: "Classic European clay tile aesthetics engineered in high-tensile aluzinc steel.",
    image_url: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80",
    display_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "a0000000-0000-0000-0000-000000000003",
    name: "Step Tiles",
    slug: "step-tiles",
    description: "Stepped architectural panels with anti-fade exterior resin finishes.",
    image_url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    display_order: 3,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "a0000000-0000-0000-0000-000000000004",
    name: "Roofing Shingles",
    slug: "shingles",
    description: "Multi-layered volcanic basalt stone-coated asphalt tiles for luxury roofs.",
    image_url: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80",
    display_order: 4,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "a0000000-0000-0000-0000-000000000005",
    name: "Ridge Caps & Apex",
    slug: "ridge-caps",
    description: "Heavy gauge apex caps to seal junctions against driving rainfall.",
    image_url: "https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=800&q=80",
    display_order: 5,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "a0000000-0000-0000-0000-000000000006",
    name: "Trimmers & Parapets",
    slug: "trimmers-and-parapets",
    description: "Valley gutters, flashing trimmers, and parapet perimeter wall copings.",
    image_url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
    display_order: 6,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "a0000000-0000-0000-0000-000000000009",
    name: "Roll Forming Services",
    slug: "roll-forming",
    description: "Computerized on-site continuous roll forming rigs.",
    image_url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    display_order: 7,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "a0000000-0000-0000-0000-000000000010",
    name: "Bending & Fabrication",
    slug: "bending-services",
    description: "CNC press brake metal folding, arch curving, and bespoke trims.",
    image_url: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
    display_order: 8,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "b0000000-0000-0000-0000-000000000001",
    category_id: "a0000000-0000-0000-0000-000000000001",
    name: "Premium Longspan Aluminium Roofing Sheet",
    slug: "premium-longspan-aluminium-roofing-sheet",
    description:
      "Industrial-grade continuous longspan aluminium sheet engineered to withstand intense tropical weather and coastal corrosion. Cut to exact customer length without overlap seams.",
    short_description: "High durability longspan aluminium sheet available in custom lengths and gauges.",
    product_type: "dimensioned",
    base_price: 3800.0,
    unit: "metre",
    min_order_quantity: 10,
    is_active: true,
    is_featured: true,
    specifications: {
      material: "Aluminium Alloy 3003",
      effective_width: "900mm",
      warranty: "25 Years",
      heat_reflection: "85%",
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: FALLBACK_CATEGORIES[0],
    images: [
      {
        id: "img-1",
        product_id: "b0000000-0000-0000-0000-000000000001",
        image_url: "https://images.unsplash.com/photo-1620027814885-f55a1cb8b776?auto=format&fit=crop&w=1200&q=80",
        alt_text: "Longspan Aluminium Roofing Sheets",
        display_order: 1,
        is_primary: true,
        created_at: new Date().toISOString(),
      },
    ],
    variants: [
      {
        id: "c0000000-0000-0000-0000-000000000001",
        product_id: "b0000000-0000-0000-0000-000000000001",
        name: "0.45mm / Wine Red",
        sku: "LS-045-WR",
        price_override: 3800.0,
        attributes: { thickness: "0.45mm", colour: "Wine Red", finish: "Gloss" },
        stock_quantity: 1500,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "c0000000-0000-0000-0000-000000000002",
        product_id: "b0000000-0000-0000-0000-000000000001",
        name: "0.50mm / Wine Red",
        sku: "LS-050-WR",
        price_override: 4200.0,
        attributes: { thickness: "0.50mm", colour: "Wine Red", finish: "Gloss" },
        stock_quantity: 2000,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "c0000000-0000-0000-0000-000000000003",
        product_id: "b0000000-0000-0000-0000-000000000001",
        name: "0.55mm / Slate Grey",
        sku: "LS-055-SG",
        price_override: 4700.0,
        attributes: { thickness: "0.55mm", colour: "Slate Grey", finish: "Matte" },
        stock_quantity: 1200,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
  },
  {
    id: "b0000000-0000-0000-0000-000000000002",
    category_id: "a0000000-0000-0000-0000-000000000002",
    name: "Metcopo Steptile Profile Sheet",
    slug: "metcopo-steptile-profile-sheet",
    description:
      "Combines European classical clay tile aesthetics with the strength of aluzinc steel. Deep drainage channels prevent ponding.",
    short_description: "Classical architectural clay tile aesthetic with modern steel resilience.",
    product_type: "dimensioned",
    base_price: 4200.0,
    unit: "metre",
    min_order_quantity: 10,
    is_active: true,
    is_featured: true,
    specifications: {
      material: "Aluzinc Steel",
      effective_width: "1000mm",
      step_height: "28mm",
      warranty: "30 Years",
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: FALLBACK_CATEGORIES[1],
    images: [
      {
        id: "img-2",
        product_id: "b0000000-0000-0000-0000-000000000002",
        image_url: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80",
        alt_text: "Metcopo Steptile Roofing",
        display_order: 1,
        is_primary: true,
        created_at: new Date().toISOString(),
      },
    ],
    variants: [
      {
        id: "c0000000-0000-0000-0000-000000000005",
        product_id: "b0000000-0000-0000-0000-000000000002",
        name: "0.50mm / Traffic Blue",
        sku: "MC-050-TB",
        price_override: 4200.0,
        attributes: { thickness: "0.50mm", colour: "Traffic Blue", finish: "Gloss" },
        stock_quantity: 900,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "c0000000-0000-0000-0000-000000000006",
        product_id: "b0000000-0000-0000-0000-000000000002",
        name: "0.55mm / Charcoal Black",
        sku: "MC-055-CB",
        price_override: 4800.0,
        attributes: { thickness: "0.55mm", colour: "Charcoal Black", finish: "Matte" },
        stock_quantity: 1100,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
  },
  {
    id: "b0000000-0000-0000-0000-000000000004",
    category_id: "a0000000-0000-0000-0000-000000000004",
    name: "Stone-Coated Shake Shingle Tile",
    slug: "stone-coated-shake-shingle-tile",
    description:
      "Galvanized zinc-alloy steel tiles coated with volcanic basalt stone chips. Exceptional fire resistance, sound muffling, and 50-year longevity.",
    short_description: "Granule-coated volcanic stone shingle tile with superior sound and heat insulation.",
    product_type: "standard",
    base_price: 5400.0,
    unit: "piece",
    min_order_quantity: 50,
    is_active: true,
    is_featured: true,
    specifications: {
      material: "Galvalume Steel + Basalt Granules",
      length: "1340mm",
      width: "420mm",
      warranty: "50 Years",
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: FALLBACK_CATEGORIES[3],
    images: [
      {
        id: "img-4",
        product_id: "b0000000-0000-0000-0000-000000000004",
        image_url: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
        alt_text: "Stone Coated Shingle Roofing Tile",
        display_order: 1,
        is_primary: true,
        created_at: new Date().toISOString(),
      },
    ],
    variants: [
      {
        id: "c0000000-0000-0000-0000-000000000008",
        product_id: "b0000000-0000-0000-0000-000000000004",
        name: "Basalt Charcoal Black",
        sku: "SH-ST-BLK",
        price_override: 5400.0,
        attributes: { colour: "Charcoal Black", finish: "Stone-Coated" },
        stock_quantity: 850,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
  },
  {
    id: "b0000000-0000-0000-0000-000000000009",
    category_id: "a0000000-0000-0000-0000-000000000009",
    name: "On-Site Continuous Roll Forming Service",
    slug: "on-site-continuous-roll-forming-service",
    description:
      "Automated mobile roll-forming machinery deployed straight to your construction site. Extrudes single-piece sheets up to 30 metres without end laps.",
    short_description: "Mobile machine extrusion at your site with zero seam leak risk.",
    product_type: "service",
    base_price: 25000.0,
    unit: "service",
    min_order_quantity: 1,
    is_active: true,
    is_featured: true,
    specifications: {
      crew_size: "4 Engineers",
      rig_type: "Computerized Hydraulic",
      daily_capacity: "5,000m",
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: FALLBACK_CATEGORIES[6],
    images: [
      {
        id: "img-9",
        product_id: "b0000000-0000-0000-0000-000000000009",
        image_url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
        alt_text: "On-site Roll Forming Machine Rig",
        display_order: 1,
        is_primary: true,
        created_at: new Date().toISOString(),
      },
    ],
  },
];

export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return FALLBACK_CATEGORIES;
    }
    return data as Category[];
  } catch {
    return FALLBACK_CATEGORIES;
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        category:categories(*),
        variants:product_variants(*),
        images:product_images(*)
      `)
      .eq("is_active", true)
      .eq("is_featured", true)
      .limit(8);

    if (error || !data || data.length === 0) {
      return FALLBACK_PRODUCTS;
    }
    return data as Product[];
  } catch {
    return FALLBACK_PRODUCTS;
  }
}

export async function getAllProducts(categorySlug?: string): Promise<Product[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("products")
      .select(`
        *,
        category:categories(*),
        variants:product_variants(*),
        images:product_images(*)
      `)
      .eq("is_active", true);

    if (categorySlug) {
      // Find category id
      const { data: cat } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", categorySlug)
        .single();

      if (cat) {
        query = query.eq("category_id", cat.id);
      }
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      if (categorySlug) {
        return FALLBACK_PRODUCTS.filter((p) => p.category?.slug === categorySlug);
      }
      return FALLBACK_PRODUCTS;
    }
    return data as Product[];
  } catch {
    return FALLBACK_PRODUCTS;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        category:categories(*),
        variants:product_variants(*),
        images:product_images(*)
      `)
      .eq("slug", slug)
      .single();

    if (error || !data) {
      const fallback = FALLBACK_PRODUCTS.find((p) => p.slug === slug);
      return fallback || null;
    }
    return data as Product;
  } catch {
    return FALLBACK_PRODUCTS.find((p) => p.slug === slug) || null;
  }
}
