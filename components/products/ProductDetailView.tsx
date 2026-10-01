"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product, ProductVariant } from "@/types/database";
import { useCartStore } from "@/lib/cart/store";
import { formatCurrency } from "@/lib/utils";
import {
  Star,
  ShoppingBag,
  Heart,
  Share2,
  Check,
  CheckCircle2,
  Truck,
  ShieldCheck,
  Clock,
  Ruler,
  ChevronLeft,
  ChevronRight,
  Info,
} from "lucide-react";

interface ProductDetailViewProps {
  product: Product;
  relatedProducts?: Product[];
}

export function ProductDetailView({ product, relatedProducts = [] }: ProductDetailViewProps) {
  const router = useRouter();
  const variants = product.variants || [];
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    variants.length > 0 ? variants[0] : null
  );

  // Gallery state
  const images = product.images && product.images.length > 0
    ? product.images
    : [
        {
          id: "default-1",
          image_url: "https://images.unsplash.com/photo-1620027814885-f55a1cb8b776?auto=format&fit=crop&w=1200&q=80",
          alt_text: product.name,
          display_order: 1,
          is_primary: true,
        },
        {
          id: "default-2",
          image_url: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80",
          alt_text: "Profile Angle View",
          display_order: 2,
          is_primary: false,
        },
        {
          id: "default-3",
          image_url: "https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=1200&q=80",
          alt_text: "Installation On Site",
          display_order: 3,
          is_primary: false,
        },
        {
          id: "default-4",
          image_url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
          alt_text: "Coil Detail",
          display_order: 4,
          is_primary: false,
        },
      ];

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Custom sheet cut-to-length state
  const isDimensioned = product.product_type === "dimensioned";
  const [lengthMetres, setLengthMetres] = useState<number>(3.5);
  const [quantity, setQuantity] = useState<number>(1);
  const [specialInstructions, setSpecialInstructions] = useState<string>("");
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "reviews">("desc");

  const addItem = useCartStore((state) => state.addItem);

  // Price calculations
  const effectiveUnitPrice = selectedVariant?.price_override != null
    ? Number(selectedVariant.price_override)
    : Number(product.base_price);

  const singleItemPrice = isDimensioned
    ? effectiveUnitPrice * (lengthMetres || 1)
    : effectiveUnitPrice;
  const totalPrice = singleItemPrice * quantity;

  const handleAddToCart = (redirectCheckout: boolean = false) => {
    addItem({
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      productType: product.product_type,
      unit: product.unit,
      basePrice: Number(product.base_price),
      effectiveUnitPrice,
      variantId: selectedVariant?.id,
      variantName: selectedVariant?.name,
      variantAttributes: selectedVariant?.attributes,
      customSpecs: isDimensioned
        ? {
            length_metres: lengthMetres,
            gauge: (selectedVariant?.attributes?.thickness as string) || "Standard",
            colour: (selectedVariant?.attributes?.colour as string) || "Standard",
            special_instructions: specialInstructions || undefined,
          }
        : specialInstructions
        ? { special_instructions: specialInstructions }
        : undefined,
      quantity,
      imageUrl: images[activeImageIndex]?.image_url,
    });

    if (redirectCheckout) {
      router.push("/checkout");
    } else {
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    }
  };

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-16">
      {/* 1. Main Product Section (Gallery Left + Details Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Image Gallery (5 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-square w-full bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-xs flex items-center justify-center p-6">
            <Image
              src={images[activeImageIndex]?.image_url}
              alt={images[activeImageIndex]?.alt_text || product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain object-center rounded-xl transition-all duration-300"
            />

            {/* Gallery Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md flex items-center justify-center transition-all hover:scale-105"
                  aria-label="Previous Image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md flex items-center justify-center transition-all hover:scale-105"
                  aria-label="Next Image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Carousel Slider */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative aspect-square w-20 rounded-xl overflow-hidden border-2 bg-slate-50 shrink-0 transition-all ${
                    activeImageIndex === idx
                      ? "border-blue-600 ring-2 ring-blue-100 shadow-xs"
                      : "border-slate-200 hover:border-slate-400 opacity-75 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img.image_url}
                    alt={img.alt_text || `Thumbnail ${idx + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Meta, Options & CTAs (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Category Tag */}
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
            {product.category?.name || "Architectural Roofing"}
          </span>

          {/* Product Title */}
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
            {product.name}
          </h1>

          {/* Rating & Review Count */}
          <div className="flex items-center gap-2">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-xs font-bold text-slate-600">(18 Customer Reviews)</span>
          </div>

          {/* Price Display */}
          <div className="flex items-baseline gap-2 py-2 border-y border-slate-100">
            <span className="text-3xl font-black text-blue-600 tracking-tight">
              {formatCurrency(effectiveUnitPrice)}
            </span>
            <span className="text-sm font-semibold text-slate-400">
              per {product.unit}
            </span>
            <span className="ml-auto text-xs text-slate-400 font-semibold">
              Est. Delivery: 1–2 Business Days
            </span>
          </div>

          {/* Short Specs / Bullet Points */}
          <ul className="space-y-1.5 text-xs text-slate-600">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
              <span>Certified heavy-gauge structural coil with 25-year anti-fade warranty</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
              <span>Custom continuous cut-to-length forming with zero end-lap leaks</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
              <span>100% factory direct pricing with nationwide site freight haulage</span>
            </li>
          </ul>

          {/* Variants: Thickness & Color (Matching Image 1 Swatches & Buttons) */}
          {variants.length > 0 && (
            <div className="space-y-4 pt-2">
              {/* Thickness / Specification Pills */}
              <div>
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                  Specification / Gauge:
                </label>
                <div className="flex flex-wrap gap-2">
                  {variants.map((v) => {
                    const isSelected = selectedVariant?.id === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={`px-3.5 py-2 text-xs font-bold rounded-lg border transition-all ${
                          isSelected
                            ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                            : "bg-white text-slate-700 border-slate-200 hover:border-blue-400"
                        }`}
                      >
                        {v.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Custom Cut-to-Length Calculator (for Dimensioned Roofing Sheets) */}
          {isDimensioned && (
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 space-y-3">
              <div className="flex items-center gap-2 text-blue-900 font-extrabold text-xs uppercase tracking-wider">
                <Ruler className="w-4 h-4 text-blue-600" />
                <span>Custom Cut-To-Length Calculator</span>
              </div>
              <p className="text-[11px] text-blue-800 leading-snug">
                Enter your exact rafter length. Sheets are extruded to order in continuous unbroken lengths up to 30 metres.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Sheet Length (Metres):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1.0"
                    max="30.0"
                    value={lengthMetres}
                    onChange={(e) => setLengthMetres(Math.max(1, parseFloat(e.target.value) || 1))}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Quantity of Sheets:
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-blue-200/60 flex items-center justify-between text-xs">
                <span className="font-semibold text-blue-900">
                  Total Length: {(lengthMetres * quantity).toFixed(1)} metres
                </span>
                <span className="font-black text-blue-600 text-sm">
                  Subtotal: {formatCurrency(totalPrice)}
                </span>
              </div>
            </div>
          )}

          {/* Quantity Stepper (Non-dimensioned) */}
          {!isDimensioned && (
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Quantity ({product.unit}):
              </label>
              <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-50 font-black text-xs"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-xs font-extrabold text-slate-800">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-50 font-black text-xs"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Action CTAs: Blue Add To Cart, Wishlist, Black Buy Now (Image 1 Style) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleAddToCart(false)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider py-3.5 px-6 rounded-lg transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-600/25 active:scale-[0.99]"
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add To Cart</span>
                  </>
                )}
              </button>

              <button
                type="button"
                className="p-3.5 border border-slate-200 hover:border-slate-400 text-slate-600 hover:text-red-500 rounded-lg bg-white shadow-2xs transition-colors"
                title="Save to Wishlist"
              >
                <Heart className="w-4 h-4" />
              </button>

              <button
                type="button"
                className="p-3.5 border border-slate-200 hover:border-slate-400 text-slate-600 hover:text-blue-600 rounded-lg bg-white shadow-2xs transition-colors"
                title="Share Product"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Jet Black Buy Now Button (Instant Checkout) */}
            <button
              type="button"
              onClick={() => handleAddToCart(true)}
              className="w-full bg-slate-950 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-lg transition-colors shadow-sm"
            >
              Buy Now
            </button>
          </div>

          {/* In Stock Badge */}
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
            <span>In Stock — Available for immediate factory haulage</span>
          </div>

          {/* Trust Badges (Image 1 Bottom Right) */}
          <div className="border-t border-slate-200 pt-4 space-y-2.5 text-xs text-slate-500">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-blue-600 shrink-0" />
              <span><strong>Free Shipping & Returns:</strong> Available on all orders over ₦500,000.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-blue-600 shrink-0" />
              <span><strong>Estimated Delivery:</strong> Orders dispatched within 24–48 hours nationwide.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span><strong>Quality Guarantee:</strong> 25 to 50 year structural & anti-fade manufacturer warranty.</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Tabbed Information Section (Description, Product Details / Specs Table, Reviews) */}
      <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
        {/* Tab Headers */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-4 gap-6">
          <button
            onClick={() => setActiveTab("desc")}
            className={`pb-4 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
              activeTab === "desc"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab("specs")}
            className={`pb-4 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
              activeTab === "specs"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            Product Details & Specifications
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`pb-4 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
              activeTab === "reviews"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            Reviews (18)
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 sm:p-8">
          {activeTab === "desc" && (
            <div className="space-y-4 max-w-4xl text-xs sm:text-sm text-slate-600 leading-relaxed">
              <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
                Architectural Performance & Manufacturing Overview
              </h3>
              <p className="whitespace-pre-line">{product.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-800 text-xs uppercase">Key Advantages:</h4>
                  <ul className="space-y-1 list-disc list-inside text-xs text-slate-500">
                    <li>Superior 85%+ solar heat deflection reducing indoor cooling costs</li>
                    <li>Continuous length roll-forming eliminating end-lap joint risks</li>
                    <li>Corrosion-resistant coating tested against severe maritime atmosphere</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-800 text-xs uppercase">Handling & Storage:</h4>
                  <ul className="space-y-1 list-disc list-inside text-xs text-slate-500">
                    <li>Store bundles on timber bearers at a minimum 5-degree pitch</li>
                    <li>Avoid metal grinding dust contact to protect resin integrity</li>
                    <li>Fasten using certified hex-head screws with UV-stable EPDM washers</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === "specs" && (
            <div className="max-w-3xl">
              <h3 className="text-base font-black text-slate-900 uppercase tracking-tight mb-4">
                Technical Specifications Table
              </h3>
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <tbody>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <td className="px-4 py-3 font-bold text-slate-700 w-1/3">Alloy / Material</td>
                      <td className="px-4 py-3 text-slate-600">Aluminium Alloy 3003 / Aluzinc Steel</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="px-4 py-3 font-bold text-slate-700">Available Gauges</td>
                      <td className="px-4 py-3 text-slate-600">0.45mm, 0.50mm, 0.55mm, 0.65mm</td>
                    </tr>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <td className="px-4 py-3 font-bold text-slate-700">Coating Chemistry</td>
                      <td className="px-4 py-3 text-slate-600">25 Micron Fluorocarbon (PVDF) / Granite Stone Resin</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="px-4 py-3 font-bold text-slate-700">Effective Cover Width</td>
                      <td className="px-4 py-3 text-slate-600">900mm – 1000mm</td>
                    </tr>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <td className="px-4 py-3 font-bold text-slate-700">Tensile Yield Strength</td>
                      <td className="px-4 py-3 text-slate-600">160 – 210 MPa</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="px-4 py-3 font-bold text-slate-700">Structural Warranty</td>
                      <td className="px-4 py-3 text-slate-600">25 to 50 Years Manufacturer Backed</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="px-4 py-3 font-bold text-slate-700">Recommended Pitch</td>
                      <td className="px-4 py-3 text-slate-600">Minimum 5° for Longspan, 15° for Tiles</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
                    Customer Verified Reviews
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-slate-700">5.0 Out of 5.0 Stars (18 Reviews)</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg transition-colors shadow-xs"
                >
                  Write Your Review
                </button>
              </div>

              {/* Review Item List (Matching Image 1) */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900">Engr. Kolawole Davies</span>
                      <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold">Verified Order</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">18 October 2026</span>
                  </div>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Very impressed with the continuous roll-forming. We ordered 18-metre continuous panels for an industrial hangar in Ikeja. Sheets arrived completely straight with zero ripple distortion.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900">Arch. Folashade Adeleke</span>
                      <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold">Verified Order</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">14 October 2026</span>
                  </div>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    The matte finish in Slate Grey looks extremely premium on modern residential builds. Factory delivery logistics were well handled.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
