import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata = {
  title: "Secure Checkout | Roofing Construction Shop",
  description: "Provide delivery details and place your official roofing materials order.",
};

export default function CheckoutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <span className="text-xs font-bold text-amber-500 tracking-wider uppercase">
          Finalize Order
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">
          Checkout &amp; Site Dispatch Information
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Review your material specifications, supply delivery address, and confirm your invoice.
        </p>
      </div>

      <CheckoutForm />
    </div>
  );
}
