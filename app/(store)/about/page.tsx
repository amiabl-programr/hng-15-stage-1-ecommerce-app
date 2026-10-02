import Link from "next/link";
import { AboutTabsAndAccordion } from "@/components/about/AboutTabsAndAccordion";
import { HeroProfileSheet } from "@/components/ui/HeroProfileSheet";
import {
  ChevronRight,
  CheckSquare,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

export const metadata = {
  title: "About Us | Roofix Architectural Materials & Fabrication",
  description:
    "Learn about Roofix, our certified metallurgical testing standards, mobile on-site roll-forming rigs, and structural roofing solutions.",
};

export default function AboutPage() {
  return (
    <div className="space-y-16 pb-16">
      {/* 1. Header Banner & Breadcrumbs (Image 3 Top) */}
      <section className="bg-slate-50 border-b border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight">
            About Us
          </h1>
          <nav className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span>Elements</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-bold text-slate-800">About Us</span>
          </nav>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* 2. Subnav Tabs, 4-Image Collage & Accordion Section */}
        <AboutTabsAndAccordion />

        {/* 3. Three Value Cards (Image 3 Feature Cards) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-4 hover:border-blue-500 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mx-auto shadow-2xs">
              <CheckSquare className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Submit A Task
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Upload your architectural CAD drawings or bill of quantities for instant rafter length optimization and zero-waste cutting schedules.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-4 hover:border-blue-500 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mx-auto shadow-2xs">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Send Message
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Direct technical consultation with our certified metallurgical engineers to select the optimal gauge and coating for your local microclimate.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-4 hover:border-blue-500 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mx-auto shadow-2xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Trusted Experience
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Over two decades of proven industrial performance across industrial hangars, educational institutions, and luxury residential estates nationwide.
            </p>
          </div>
        </section>

        {/* 4. Dark Stats Banner (Image 3 Stats Strip) */}
        <section className="relative rounded-2xl overflow-hidden bg-slate-900 text-white p-12 lg:p-16 shadow-xl">
          <div className="absolute inset-0 opacity-25 flex items-center" aria-hidden="true">
            <HeroProfileSheet className="w-full h-full" />
          </div>

          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-black text-white block tracking-tight">
                20+
              </span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Years Operating
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-black text-white block tracking-tight">
                200+
              </span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Staff & Operators
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-black text-white block tracking-tight">
                50,000+
              </span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Tonnes Fabricated
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-black text-white block tracking-tight">
                27+
              </span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Industry Awards
              </span>
            </div>
          </div>
        </section>

        {/* 5. Contact CTA Box (Image 3 Bottom) */}
        <section id="contact" className="max-w-2xl mx-auto text-center space-y-4 py-6">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
            Contact Us
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
            Ready To Start Your Roofing Project?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Speak directly with our technical sales team for custom roll-forming rig bookings, coil reservations, or bulk trade pricing.
          </p>
          <div className="pt-2">
            <Link
              href="/fabrication"
              className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider px-8 py-3.5 rounded-lg inline-flex items-center gap-2 transition-colors shadow-sm"
            >
              <span>Click Here To Contact Us</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
