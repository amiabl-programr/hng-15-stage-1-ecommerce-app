import { FabricationForm } from "@/components/fabrication/FabricationForm";
import { ProfileDiagram } from "@/components/products/ProfileDiagram";
import { Wrench, CheckCircle2, Shield, Cog, Truck } from "lucide-react";

export const metadata = {
  title: "On-Site Roll Forming & Sheet Fabrication Services | Roofing Construction Shop",
  description:
    "Mobile automated continuous roll-forming rigs, CNC sheet bending, curving, and custom parapet capping.",
};

export default function FabricationPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Page Header */}
      <div>
        <span className="text-xs font-bold text-amber-500 tracking-wider uppercase">
          Engineering & Site Fabrication
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">
          Precision Roofing Fabrication & On-Site Roll Forming
        </h1>
        <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
          We bring industrial manufacturing directly to your project site. Produce single continuous
          roofing panels up to 30 metres long without seam laps, reducing labor and eliminating
          rain-leak vulnerabilities.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3">
          <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-lg flex items-center justify-center">
            <Cog className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Mobile Roll Forming</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Our self-powered mobile rigs travel anywhere across the country to form Metcopo,
            Longspan, or Step tile profiles straight from prime master coils.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3">
          <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-lg flex items-center justify-center">
            <Wrench className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">CNC Sheet Bending</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Heavy-duty 4-metre computerized hydraulic press brakes capable of producing intricate
            valley trimmers, parapet caps, and bespoke fascia flashings.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3">
          <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Radius Arch Curving</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            High precision crimp curving machinery to roll seamless arched canopies, barrel vault
            roofs, and petrol station convex spans.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-7">
          <FabricationForm />
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider text-amber-500">
              Why Specify On-Site Fabrication?
            </h4>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>No Transportation Damage:</strong> Extra-long sheets are extruded on
                  site, avoiding highway transport dents and scratches.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Zero End-Lap Leak Points:</strong> One continuous sheet spans from the
                  ridge apex directly to the eaves gutter.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Exact Real-Time Measurement:</strong> We verify physical truss dimensions
                  prior to feeding the master coil into the rollers.
                </span>
              </div>
            </div>
          </div>

          <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
            <ProfileDiagram kind="bending" tone="dark" />
          </div>
        </div>
      </div>
    </div>
  );
}
