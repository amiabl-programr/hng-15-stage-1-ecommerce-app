import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";
import { seed } from "./seed";

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
  console.error("Database reset aborted: Missing required Supabase credentials in environment configuration.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function resetDatabase() {
  console.log("Database reset initiated.");

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

  console.log("Purging operational and catalogue records...");

  for (const { name, filterColumn } of tablesToClear) {
    try {
      const { error, count } = await supabase
        .from(name)
        .delete({ count: "exact" })
        .not(filterColumn, "is", null);

      if (error) {
        console.warn(`Could not clear table ${name}.`);
      } else {
        console.log(`Cleared ${name}: ${count ?? 0} records removed.`);
      }
    } catch {
      console.warn(`Unexpected error clearing table ${name}.`);
    }
  }

  console.log("Re-seeding catalogue and inventory...");
  await seed();

  console.log("Database reset and re-seeding completed successfully.");
}

resetDatabase().catch(() => {
  console.error("Database reset failed.");
  process.exit(1);
});
