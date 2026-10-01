import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItem, ProductType, UnitType, OrderCustomSpecs } from "@/types/database";

interface AddItemInput {
  productId: string;
  productSlug: string;
  productName: string;
  productType: ProductType;
  unit: UnitType;
  basePrice: number;
  effectiveUnitPrice: number;
  variantId?: string;
  variantName?: string;
  variantAttributes?: Record<string, unknown>;
  customSpecs?: OrderCustomSpecs;
  quantity: number;
  imageUrl?: string;
}

interface CartStore {
  items: CartItem[];
  isHydrated: boolean;
  setHydrated: (state: boolean) => void;
  addItem: (input: AddItemInput) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getItemCount: () => number;
}

function generateCartItemId(input: AddItemInput): string {
  const parts = [
    input.productId,
    input.variantId || "base",
    input.customSpecs?.length_metres || 0,
    input.customSpecs?.gauge || "",
    input.customSpecs?.colour || "",
    input.customSpecs?.finish || "",
  ];
  return parts.join("::");
}

function calculateItemLineTotal(
  productType: ProductType,
  effectiveUnitPrice: number,
  quantity: number,
  customSpecs?: OrderCustomSpecs
): number {
  if (productType === "dimensioned" && customSpecs?.length_metres) {
    // Length in metres * unit price per metre * number of sheets
    return effectiveUnitPrice * customSpecs.length_metres * quantity;
  }
  return effectiveUnitPrice * quantity;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isHydrated: false,
      setHydrated: (state) => set({ isHydrated: state }),

      addItem: (input) => {
        const cartItemId = generateCartItemId(input);
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex((item) => item.cartItemId === cartItemId);

        if (existingIndex > -1) {
          const updatedItems = [...currentItems];
          const existing = updatedItems[existingIndex];
          const newQty = existing.quantity + input.quantity;
          const newLineTotal = calculateItemLineTotal(
            existing.productType,
            existing.effectiveUnitPrice,
            newQty,
            existing.customSpecs
          );
          updatedItems[existingIndex] = {
            ...existing,
            quantity: newQty,
            lineTotal: newLineTotal,
          };
          set({ items: updatedItems });
        } else {
          const lineTotal = calculateItemLineTotal(
            input.productType,
            input.effectiveUnitPrice,
            input.quantity,
            input.customSpecs
          );
          const newItem: CartItem = {
            ...input,
            cartItemId,
            lineTotal,
          };
          set({ items: [...currentItems, newItem] });
        }
      },

      removeItem: (cartItemId) => {
        set({
          items: get().items.filter((item) => item.cartItemId !== cartItemId),
        });
      },

      updateQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cartItemId);
          return;
        }

        const updated = get().items.map((item) => {
          if (item.cartItemId === cartItemId) {
            const lineTotal = calculateItemLineTotal(
              item.productType,
              item.effectiveUnitPrice,
              quantity,
              item.customSpecs
            );
            return {
              ...item,
              quantity,
              lineTotal,
            };
          }
          return item;
        });

        set({ items: updated });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getSubtotal: () => {
        return get().items.reduce((acc, item) => acc + item.lineTotal, 0);
      },

      getItemCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },
    }),
    {
      name: "roofing_construction_cart",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
