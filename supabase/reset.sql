-- ==============================================================================
-- Supabase Database Reset Script (supabase/reset.sql)
-- Run this in the Supabase SQL Editor to wipe out test orders, inventory,
-- and catalogue data, and restore a pristine seed catalogue.
-- Profiles and user credentials are safe and NOT dropped.
-- ==============================================================================

-- 1. Purge all catalogue & transactional tables (in cascade order)
TRUNCATE TABLE
    public.order_items,
    public.orders,
    public.fabrication_requests,
    public.inventory,
    public.product_images,
    public.product_variants,
    public.products,
    public.categories
CASCADE;

-- 2. Seed Fresh Categories
INSERT INTO public.categories (name, slug, description, image_url, display_order, is_active)
VALUES
    ('Roofing Sheets', 'roofing-sheets', 'Industrial & residential longspan aluminium sheets available in custom lengths.', 'https://images.unsplash.com/photo-1620027814885-f55a1cb8b776?auto=format&fit=crop&w=800&q=80', 1, true),
    ('Metcopo Roofing', 'metcopo-roofing', 'Classic European clay tile aesthetics engineered in high-tensile aluzinc steel.', 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80', 2, true),
    ('Step Tiles', 'step-tiles', 'Stepped architectural panels with anti-fade exterior resin finishes.', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80', 3, true),
    ('Roofing Shingles', 'shingles', 'Multi-layered volcanic basalt stone-coated asphalt tiles for luxury roofs.', 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80', 4, true),
    ('Ridge Caps & Apex', 'ridge-caps', 'Heavy gauge apex caps to seal junctions against driving rainfall.', 'https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=800&q=80', 5, true),
    ('Trimmers & Gutters', 'trimmers-and-parapets', 'Valley gutters, flashing trimmers, and parapet perimeter wall copings.', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80', 6, true),
    ('Parapets & Flashing', 'parapets', 'Double drip edge architectural wall cappings for firewall perimeters.', 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80', 7, true),
    ('Corrugated Sheets', 'corrugated-sheets', 'Traditional heavy-gauge sinusoidal steel sheets for industrial structures.', 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=800&q=80', 8, true),
    ('Roll Forming Services', 'roll-forming', 'Computerized on-site continuous roll forming rigs up to 30 metres unbroken.', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', 9, true),
    ('Bending & Fabrication', 'bending-services', 'CNC press brake metal folding, arch curving, and bespoke trims.', 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80', 10, true),
    ('Accessories & Fasteners', 'accessories', 'EPDM self-drilling hex fasteners, butyl waterproof tapes, and sealants.', 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=800&q=80', 11, true);

-- 3. Seed Fresh Products
INSERT INTO public.products (category_id, name, slug, description, short_description, product_type, base_price, unit, min_order_quantity, is_active, is_featured, specifications)
VALUES
    (
        (SELECT id FROM public.categories WHERE slug = 'roofing-sheets'),
        'Premium Longspan Aluminium Roofing Sheet',
        'premium-longspan-aluminium-roofing-sheet',
        'Industrial-grade continuous longspan aluminium sheet engineered to withstand intense tropical sun and heavy coastal rain. Can be formed to any length without overlapping joints.',
        'High durability longspan aluminium sheet available in custom lengths and gauges.',
        'dimensioned', 3800.00, 'metre', 1, true, true,
        '{"material": "Aluminium Alloy 3003", "effective_width": "900mm", "warranty": "25 Years", "heat_reflection": "85%"}'::jsonb
    ),
    (
        (SELECT id FROM public.categories WHERE slug = 'metcopo-roofing'),
        'Metcopo Steptile Profile Sheet',
        'metcopo-steptile-profile-sheet',
        'Metcopo profile combines the classic architectural elegance of clay roofing tiles with the ultra-lightweight strength of zinc-coated steel.',
        'Classical architectural clay tile aesthetic with modern steel resilience.',
        'dimensioned', 4200.00, 'metre', 1, true, true,
        '{"material": "Aluzinc Steel", "effective_width": "1000mm", "step_height": "28mm", "warranty": "30 Years"}'::jsonb
    ),
    (
        (SELECT id FROM public.categories WHERE slug = 'shingles'),
        'Stone-Coated Shake Shingle Tile',
        'stone-coated-shake-shingle-tile',
        'Stone-coated roofing tiles made from galvanized zinc-alloy steel covered with natural volcanic basalt stone granules. Fireproof, sound-dampening, and highly luxurious.',
        'Granule-coated volcanic stone shingle tile with superior sound and heat insulation.',
        'standard', 5400.00, 'piece', 1, true, true,
        '{"material": "Galvalume Steel + Basalt Granules", "length": "1340mm", "width": "420mm", "coverage": "0.48 sqm/piece", "warranty": "50 Years"}'::jsonb
    ),
    (
        (SELECT id FROM public.categories WHERE slug = 'ridge-caps'),
        'Heavy-Gauge Ridged Apex Cap (2m Length)',
        'heavy-gauge-ridged-apex-cap',
        'V-profile and rounded barrel ridge caps designed to seal the upper roof apex against storm-driven rain and wind gusts. Pre-notched for easy fastening.',
        'Heavy gauge apex capping for complete waterproof ridge sealing.',
        'standard', 2800.00, 'piece', 1, true, false,
        '{"material": "Aluminium / Aluzinc", "length": "2000mm", "girth": "450mm"}'::jsonb
    ),
    (
        (SELECT id FROM public.categories WHERE slug = 'roll-forming'),
        'On-Site Continuous Roll Forming Service',
        'on-site-continuous-roll-forming-service',
        'We bring our automated hydraulic roll forming rig directly to your construction site, manufacturing roofing sheets up to 30 metres in one unbroken piece.',
        'Mobile machine extrusion at your site with zero seam risk.',
        'service', 25000.00, 'service', 1, true, true,
        '{"crew_size": "4 Engineers", "rig_type": "Computerized Hydraulic", "daily_capacity": "5,000m"}'::jsonb
    ),
    (
        (SELECT id FROM public.categories WHERE slug = 'bending-services'),
        'Custom CNC Sheet Bending & Curving Service',
        'custom-cnc-sheet-bending-service',
        'High precision CNC brake press service for custom trimming, fascia bending, circular barrel vaults, and intricate canopy angles.',
        'Bespoke architectural sheet folding and radius arch curving.',
        'service', 850.00, 'metre', 1, true, true,
        '{"max_thickness": "1.2mm", "bending_accuracy": "+/- 0.5 degrees", "turnaround": "24-48 Hours"}'::jsonb
    ),
    (
        (SELECT id FROM public.categories WHERE slug = 'accessories'),
        'Self-Drilling Hex Roofing Screws (Pack of 100)',
        'self-drilling-hex-roofing-screws-pack-100',
        'Case-hardened carbon steel screws with integrated EPDM rubber sealing washers to ensure leak-free anchoring into metal and timber purlins.',
        'Weather-sealed self-drilling hex fasteners with UV-stabilized rubber washers.',
        'standard', 6500.00, 'bundle', 1, true, false,
        '{"count": 100, "size": "12 x 55mm", "washer": "High Temp EPDM", "coating": "Ruspert Corrosion Resistant"}'::jsonb
    );

-- 4. Seed Product Variants
INSERT INTO public.product_variants (product_id, name, sku, price_override, attributes, stock_quantity, is_active)
VALUES
    ((SELECT id FROM public.products WHERE slug = 'premium-longspan-aluminium-roofing-sheet'), '0.45mm / Wine Red', 'LS-045-WR', 3800.00, '{"thickness": "0.45mm", "colour": "Wine Red", "finish": "Gloss"}'::jsonb, 1500, true),
    ((SELECT id FROM public.products WHERE slug = 'premium-longspan-aluminium-roofing-sheet'), '0.50mm / Wine Red', 'LS-050-WR', 4200.00, '{"thickness": "0.50mm", "colour": "Wine Red", "finish": "Gloss"}'::jsonb, 2000, true),
    ((SELECT id FROM public.products WHERE slug = 'premium-longspan-aluminium-roofing-sheet'), '0.55mm / Slate Grey', 'LS-055-SG', 4700.00, '{"thickness": "0.55mm", "colour": "Slate Grey", "finish": "Matte"}'::jsonb, 1200, true),
    ((SELECT id FROM public.products WHERE slug = 'premium-longspan-aluminium-roofing-sheet'), '0.50mm / Forest Green', 'LS-050-FG', 4200.00, '{"thickness": "0.50mm", "colour": "Forest Green", "finish": "Gloss"}'::jsonb, 1800, true),
    ((SELECT id FROM public.products WHERE slug = 'metcopo-steptile-profile-sheet'), '0.50mm / Traffic Blue', 'MC-050-TB', 4200.00, '{"thickness": "0.50mm", "colour": "Traffic Blue", "finish": "Gloss"}'::jsonb, 900, true),
    ((SELECT id FROM public.products WHERE slug = 'metcopo-steptile-profile-sheet'), '0.55mm / Charcoal Black', 'MC-055-CB', 4800.00, '{"thickness": "0.55mm", "colour": "Charcoal Black", "finish": "Matte"}'::jsonb, 1100, true),
    ((SELECT id FROM public.products WHERE slug = 'stone-coated-shake-shingle-tile'), 'Basalt Charcoal Black', 'SH-ST-BLK', 5400.00, '{"colour": "Charcoal Black", "finish": "Stone-Coated"}'::jsonb, 850, true),
    ((SELECT id FROM public.products WHERE slug = 'stone-coated-shake-shingle-tile'), 'Spanish Coffee Brown', 'SH-ST-BRN', 5400.00, '{"colour": "Coffee Brown", "finish": "Stone-Coated"}'::jsonb, 720, true);

-- 5. Seed Product Images
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
VALUES
    ((SELECT id FROM public.products WHERE slug = 'premium-longspan-aluminium-roofing-sheet'), 'https://images.unsplash.com/photo-1620027814885-f55a1cb8b776?auto=format&fit=crop&w=1200&q=80', 'Longspan Aluminium Sheets', 1, true),
    ((SELECT id FROM public.products WHERE slug = 'metcopo-steptile-profile-sheet'), 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80', 'Metcopo Steptile Profile', 1, true),
    ((SELECT id FROM public.products WHERE slug = 'stone-coated-shake-shingle-tile'), 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80', 'Stone Coated Shingles', 1, true),
    ((SELECT id FROM public.products WHERE slug = 'heavy-gauge-ridged-apex-cap'), 'https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=1200&q=80', 'Apex Ridge Cap', 1, true),
    ((SELECT id FROM public.products WHERE slug = 'on-site-continuous-roll-forming-service'), 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80', 'Roll Forming Rig', 1, true),
    ((SELECT id FROM public.products WHERE slug = 'custom-cnc-sheet-bending-service'), 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80', 'CNC Sheet Bending', 1, true),
    ((SELECT id FROM public.products WHERE slug = 'self-drilling-hex-roofing-screws-pack-100'), 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=1200&q=80', 'Roofing Screws', 1, true);

-- 6. Sync Inventory
INSERT INTO public.inventory (product_id, variant_id, quantity, low_stock_threshold)
SELECT product_id, id, stock_quantity, 100
FROM public.product_variants;
