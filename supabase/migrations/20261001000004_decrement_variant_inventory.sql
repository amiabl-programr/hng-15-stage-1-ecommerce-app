-- ==============================================================================
-- Migration: Atomic variant inventory decrement
-- Description: lib/orders/actions.ts calls decrement_variant_inventory to
--              reserve stock at checkout, but no such function existed. The
--              call therefore always errored and fell through to the caller's
--              non-atomic read-then-write fallback, where two concurrent
--              orders could both read the same stock level and both succeed.
--
-- This function takes a row lock before reading, so concurrent checkouts
-- serialise and cannot oversell.
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.decrement_variant_inventory(
    p_variant_id UUID,
    p_quantity INTEGER
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_remaining INTEGER;
BEGIN
    IF p_quantity IS NULL OR p_quantity <= 0 THEN
        RAISE EXCEPTION 'Quantity must be a positive integer'
            USING ERRCODE = '22023';
    END IF;

    -- FOR UPDATE takes a row-level lock held to the end of the transaction, so a
    -- concurrent checkout blocks here and re-reads the committed value.
    SELECT stock_quantity INTO v_remaining
    FROM public.product_variants
    WHERE id = p_variant_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Variant % does not exist', p_variant_id
            USING ERRCODE = 'P0002';
    END IF;

    IF v_remaining < p_quantity THEN
        RAISE EXCEPTION 'Insufficient stock for variant %: % available, % requested',
            p_variant_id, v_remaining, p_quantity
            USING ERRCODE = '23514';
    END IF;

    UPDATE public.product_variants
    SET stock_quantity = stock_quantity - p_quantity
    WHERE id = p_variant_id
    RETURNING stock_quantity INTO v_remaining;

    RETURN v_remaining;
END;
$$;

-- Checkout runs server-side through the service-role client, which bypasses
-- RLS, so no anon/authenticated grant is needed. Granting EXECUTE to service_role
-- explicitly keeps this correct if the caller is ever changed.
GRANT EXECUTE ON FUNCTION public.decrement_variant_inventory(UUID, INTEGER) TO service_role;