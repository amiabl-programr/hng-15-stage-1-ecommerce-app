"use client";

import { useState } from "react";
import { ProfileDiagram } from "@/components/products/ProfileDiagram";
import { ChevronDown, ChevronUp, Lightbulb } from "lucide-react";

export function AboutTabsAndAccordion() {
  const [activeTab, setActiveTab] = useState<"development" | "team" | "strategy">("development");
  const [openAccordion, setOpenAccordion] = useState<string>("vision");

  const toggleAccordion = (key: string) => {
    setOpenAccordion(openAccordion === key ? "" : key);
  };

  return (
    <div className="space-y-16">
      {/* 1. Subnav Tabs (Matching Image 3 Top) */}
      <div className="space-y-6">
        <div className="flex justify-center border-b border-slate-200">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("development")}
              className={`pb-4 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
                activeTab === "development"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              Development
            </button>
            <button
              onClick={() => setActiveTab("team")}
              className={`pb-4 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
                activeTab === "team"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              Qualified Team
            </button>
            <button
              onClick={() => setActiveTab("strategy")}
              className={`pb-4 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
                activeTab === "strategy"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              Strategy & Quality
            </button>
          </div>
        </div>

        {/* Tab Content Paragraph */}
        <div className="max-w-4xl mx-auto text-center text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3">
          {activeTab === "development" && (
            <p>
              Founded with the objective of eliminating structural roof failures and end-lap leakage across residential and commercial developments, Roofix has grown into a premier supplier of computerized roll-forming equipment and high-tensile aluzinc coils. We continuously innovate by bringing mobile extrusion rigs directly to construction jobsites, saving contractors valuable time and avoiding costly transportation joint damage.
            </p>
          )}
          {activeTab === "team" && (
            <p>
              Our staff comprises structural civil engineers, metallurgical technicians, and factory-trained CNC machine operators. Each fabrication run is supervised by a certified quantity surveyor and checked with calibrated digital micrometers to guarantee that coil gauge, tensile yield stress, and coating thickness strictly match engineering documentation.
            </p>
          )}
          {activeTab === "strategy" && (
            <p>
              Our strategic roadmap focuses on 100% sustainable materials, certified marine-grade aluminium alloys, and zero-defect quality control. By maintaining extensive primary coil reserves in regional depots, we ensure nationwide dispatch within 24 to 48 hours for even the most demanding infrastructure projects.
            </p>
          )}
        </div>
      </div>

      {/* Profile collage. These slots used to be stock photographs captioned as the
          business's own rig, installation crew, press, and finished roofs. */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
        {/* Left tall card */}
        <div className="relative aspect-[3/4] md:aspect-auto md:row-span-2 rounded-2xl overflow-hidden shadow-xs border border-slate-200">
          <ProfileDiagram kind="roll-forming" tone="light" />
        </div>

        {/* Top right card */}
        <div className="relative aspect-[16/10] md:col-span-2 rounded-2xl overflow-hidden shadow-xs border border-slate-200">
          <ProfileDiagram kind="longspan" tone="light" />
        </div>

        {/* Bottom right split 2 cards */}
        <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xs border border-slate-200">
          <ProfileDiagram kind="metcoppo" tone="light" />
        </div>
        <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xs border border-slate-200">
          <ProfileDiagram kind="ridge" tone="light" />
        </div>
      </div>

      {/* 3. Inspiration, Innovation & Accordion Section (Matching Image 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center max-w-5xl mx-auto pt-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
              Inspiration, Innovation, and Structural Integrity.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Every building represents a permanent capital investment. Our mission is to protect that investment with roofing solutions that will endure for generations without fading or leaking.
            </p>
          </div>

          {/* Accordion Group */}
          <div className="space-y-3">
            {/* Item 1: Business's Vision */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => toggleAccordion("vision")}
                className="w-full px-5 py-3.5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left text-xs font-black text-slate-900 uppercase tracking-wider transition-colors"
              >
                <span>Business's Vision</span>
                {openAccordion === "vision" ? (
                  <ChevronUp className="w-4 h-4 text-blue-600" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>
              {openAccordion === "vision" && (
                <div className="p-5 text-xs text-slate-600 leading-relaxed bg-white border-t border-slate-200">
                  To become Africa's foremost architectural metal supply partner, known for absolute gauge integrity, zero compromise on material testing, and rapid on-site mobile extrusion capability.
                </div>
              )}
            </div>

            {/* Item 2: Our Mission */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => toggleAccordion("mission")}
                className="w-full px-5 py-3.5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left text-xs font-black text-slate-900 uppercase tracking-wider transition-colors"
              >
                <span>Our Mission</span>
                {openAccordion === "mission" ? (
                  <ChevronUp className="w-4 h-4 text-blue-600" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>
              {openAccordion === "mission" && (
                <div className="p-5 text-xs text-slate-600 leading-relaxed bg-white border-t border-slate-200">
                  To deliver factory-certified structural roofing panels and tailored fabrication services directly to builders and homeowners, backed by transparent pricing, dependable technical support, and rapid nationwide freight delivery.
                </div>
              )}
            </div>

            {/* Item 3: Our Support */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => toggleAccordion("support")}
                className="w-full px-5 py-3.5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left text-xs font-black text-slate-900 uppercase tracking-wider transition-colors"
              >
                <span>Our Support</span>
                {openAccordion === "support" ? (
                  <ChevronUp className="w-4 h-4 text-blue-600" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>
              {openAccordion === "support" && (
                <div className="p-5 text-xs text-slate-600 leading-relaxed bg-white border-t border-slate-200">
                  Our engineering team provides complimentary bill-of-quantities estimations, truss rafter pitch calculations, and on-site rig setup support to ensure effortless execution.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Illustration Card */}
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gradient-to-tr from-blue-900 to-blue-600 flex items-center justify-center p-8 text-center text-white shadow-lg">
          <div className="space-y-4 max-w-xs">
            <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center mx-auto shadow-inner">
              <Lightbulb className="w-10 h-10 text-amber-300" />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight">
              Precision Engineering Meets Architectural Beauty
            </h3>
            <p className="text-xs text-blue-100 leading-relaxed">
              Eliminate joint corrosion with continuous seamless panels extruded on location.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
