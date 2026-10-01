import { CartView } from "@/components/cart/CartView";

export const metadata = {
  title: "Shopping Cart | Roofing Construction Shop",
  description: "Review your selected roofing materials, custom sheet lengths, and fabrication items.",
};

export default function CartPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <span className="text-xs font-bold text-amber-500 tracking-wider uppercase">
          Review Order
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">
          Your Roofing Materials Cart
        </h1>
      </div>

      <CartView />
    </div>
  );
}
