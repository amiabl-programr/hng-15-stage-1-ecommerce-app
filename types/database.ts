export type UserRole = "customer" | "admin";

export type ProductType = "standard" | "dimensioned" | "service";

export type UnitType = "piece" | "metre" | "bundle" | "sqm" | "service" | "roll";

export type OrderStatus =
  | "pending"
  | "payment_pending"
  | "paid"
  | "processing"
  | "ready_for_delivery"
  | "shipped"
  | "completed"
  | "cancelled"
  | "refunded";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string | null;
  email: string;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string | null;
  product_type: ProductType;
  base_price: number;
  unit: UnitType;
  min_order_quantity: number;
  is_active: boolean;
  is_featured: boolean;
  specifications: Record<string, string | number | boolean> | null;
  created_at: string;
  updated_at: string;
  category?: Category;
  variants?: ProductVariant[];
  images?: ProductImage[];
  inventory?: InventoryItem[];
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  sku: string;
  price_override: number | null;
  attributes: {
    thickness?: string; // e.g. "0.45mm", "0.50mm", "0.55mm"
    colour?: string; // e.g. "Wine Red", "Traffic Blue", "Charcoal Grey"
    finish?: string; // e.g. "Matte", "Gloss", "Stone-Coated"
    profile?: string; // e.g. "Longspan", "Step Tile", "Metcopo"
    length_range?: string;
    [key: string]: unknown;
  };
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  display_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface InventoryItem {
  id: string;
  product_id: string;
  variant_id: string | null;
  quantity: number;
  low_stock_threshold: number;
  updated_at: string;
}

export interface Address {
  id: string;
  profile_id: string;
  recipient_name: string;
  phone: string;
  street_address: string;
  city: string;
  state: string;
  is_default: boolean;
  created_at: string;
}

export interface DeliveryAddressData {
  recipient_name: string;
  phone: string;
  street_address: string;
  city: string;
  state: string;
  additional_instructions?: string;
}

export interface Order {
  id: string;
  order_number: string;
  profile_id: string | null;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: DeliveryAddressData;
  subtotal: number;
  delivery_fee: number;
  total_amount: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderCustomSpecs {
  length_metres?: number;
  gauge?: string;
  colour?: string;
  finish?: string;
  bending_angles?: string;
  special_instructions?: string;
  [key: string]: unknown;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string | null;
  product_name: string;
  unit_price: number;
  quantity: number;
  custom_specs: OrderCustomSpecs | null;
  line_total: number;
  created_at: string;
  product?: Product;
}

export interface FabricationRequest {
  id: string;
  profile_id: string | null;
  order_item_id: string | null;
  service_type: string;
  specifications: Record<string, unknown>;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  status: "pending" | "reviewed" | "quoted" | "in_production" | "completed" | "rejected";
  notes: string | null;
  created_at: string;
}

export interface CartItem {
  cartItemId: string; 
  productId: string;
  productSlug: string;
  productName: string;
  productType: ProductType;
  unit: UnitType;
  basePrice: number;
  effectiveUnitPrice: number;
  variantId?: string;
  variantName?: string;
  variantAttributes?: {
    thickness?: string;
    colour?: string;
    finish?: string;
    [key: string]: unknown;
  };
  customSpecs?: OrderCustomSpecs;
  quantity: number;
  imageUrl?: string;
  lineTotal: number;
}
