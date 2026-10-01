-- Migration: Allow individual item purchases by updating minimum order quantities
-- Description: Sets min_order_quantity to 1 for all products that can be bought individually.

UPDATE public.products
SET min_order_quantity = 1
WHERE min_order_quantity > 1;
