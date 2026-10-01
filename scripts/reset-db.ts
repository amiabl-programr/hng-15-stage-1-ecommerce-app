import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";
import { seed } from "./seed";

// 1. Load environment variables (.env.local or .env)
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
  console.error("==================================================================");
  console.error("❌ Database Reset Aborted: Missing Supabase credentials in .env");
  console.error("Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.");
  console.error("==================================================================");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function resetDatabase() {
  console.log("==================================================================");
  console.log("⚠️  ROOFIX DATABASE RESET INITIATED");
  console.log("Connecting to:", supabaseUrl);
  console.log("==================================================================");

  // Tables to clear in strict reverse-dependency order
  const tablesToClear = [
    { name: "order_items", filterColumn: "id" },
    { name: "orders", filterColumn: "id" },
    { name: "fabrication_requests", filterColumn: "id" },
    { name: "inventory", filterColumn: "id" },
    { name: "product_images", filterColumn: "id" },
    { name: "product_variants", filterColumn: "id" },
    { name: "products", filterColumn: "id" },
    { name: "categories", filterColumn: "id" },
  ];

  console.log("\n🧹 Step 1: Purging operational & catalogue records...");

  for (const { name, filterColumn } of tablesToClear) {
    process.stdout.write(`   → Clearing "${name}"... `);

    // Delete all records where filterColumn is not null
    const { error, count } = await supabase
      .from(name)
      .delete({ count: "exact" })
      .not(filterColumn, "is", null);

    if (error) {
      // In case table doesn't exist or is empty
      console.log(`⚠️ (${error.message})`);
    } else {
      console.log(`✓ Deleted ${count ?? 0} rows`);
    }
  }

  console.log("\n🌱 Step 2: Re-seeding clean catalogue and inventory...");
  await seed();

  console.log("\n==================================================================");
  console.log("✅ DATABASE RESET & RE-SEEDING COMPLETED SUCCESSFULLY!");
  console.log("==================================================================\n");
}

resetDatabase().catch((err) => {
  console.error("\n❌ Database reset failed with error:", err);
  process.exit(1);
});
