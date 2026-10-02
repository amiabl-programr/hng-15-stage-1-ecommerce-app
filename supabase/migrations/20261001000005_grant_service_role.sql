-- ==============================================================================
-- Migration: Grant service_role access to public tables
-- Description: Supabase no longer grants new tables in public to the Data API
--              roles automatically. This project already had its anon and
--              authenticated grants added in the previous migration, but
--              service_role was left out, so every server-side write through
--              createAdminClient() failed with:
--                42501 permission denied for table categories
--
--              The service-role key bypasses RLS, but it still needs table-level
--              privileges. Every write path in the application depends on it:
--                lib/orders/actions.ts     (checkout, order items, inventory)
--                lib/auth/user-sync.ts     (Google sign-in profile upsert)
--                lib/products/queries.ts   (catalogue reads, fallbacks)
--                app/admin/**              (admin CRUD, image lifecycle)
--
--              Granted explicitly so behaviour is identical regardless of the
--              project's default-privilege settings, and so the required grants
--              are discoverable in the repository rather than in dashboard
--              settings nobody can diff.

-- Full access for server-side code using the service-role key.
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_variants TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_images TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inventory TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.addresses TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.order_items TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fabrication_requests TO service_role;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Functions reached through the Data API RPC endpoint.
GRANT EXECUTE ON FUNCTION public.is_admin() TO service_role;
GRANT EXECUTE ON FUNCTION public.decrement_variant_inventory(UUID, INTEGER) TO service_role;