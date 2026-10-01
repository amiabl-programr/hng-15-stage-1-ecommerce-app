"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fabricationRequestSchema, FabricationRequestFormData } from "@/lib/validation/checkout";
import { submitFabricationRequestAction } from "@/lib/orders/fabrication-actions";
import { Wrench, CheckCircle2, AlertCircle, Send } from "lucide-react";

export function FabricationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FabricationRequestFormData>({
    resolver: zodResolver(fabricationRequestSchema),
    defaultValues: {
      serviceType: "On-Site Roll Forming",
      material: "Aluminium 0.50mm",
    },
  });

  const onSubmit = async (data: FabricationRequestFormData) => {
    setErrorMsg(null);
    const result = await submitFabricationRequestAction(data);
    if (result.success) {
      setSubmitted(true);
      reset();
    } else {
      setErrorMsg(result.error || "Submission failed. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-8 text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-white">Fabrication Request Received</h3>
        <p className="text-slate-300 text-sm max-w-lg mx-auto">
          Our senior technical fabrication engineer will review your project parameters and contact
          you within 2–4 hours with an official Bill of Quantities (BOQ) and production schedule.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-4 px-6 py-2.5 bg-slate-800 hover:bg-slate-750 text-white rounded-lg text-xs font-semibold"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 space-y-6 shadow-xl"
    >
      <div>
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Wrench className="w-5 h-5 text-amber-500" />
          <span>Request Technical Fabrication Quote</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Specify your requirements for mobile on-site roll-forming, CNC sheet bending, or custom
          trims.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            Full Name / Contractor Name *
          </label>
          <input
            {...register("contactName")}
            placeholder="e.g. Arc. Johnson Okoro"
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
          />
          {errors.contactName && (
            <p className="text-red-400 text-[11px] mt-1">{errors.contactName.message}</p>
          )}
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            Contact Email Address *
          </label>
          <input
            type="email"
            {...register("contactEmail")}
            placeholder="johnson@example.com"
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
          />
          {errors.contactEmail && (
            <p className="text-red-400 text-[11px] mt-1">{errors.contactEmail.message}</p>
          )}
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            Phone / WhatsApp Number *
          </label>
          <input
            {...register("contactPhone")}
            placeholder="+234 803 000 0000"
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
          />
          {errors.contactPhone && (
            <p className="text-red-400 text-[11px] mt-1">{errors.contactPhone.message}</p>
          )}
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            Required Service *
          </label>
          <select
            {...register("serviceType")}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
          >
            <option value="On-Site Roll Forming">On-Site Continuous Roll Forming</option>
            <option value="CNC Sheet Bending">CNC Sheet Bending & Folding</option>
            <option value="Arch Curving">Radius Arch / Barrel Vault Curving</option>
            <option value="Custom Parapet Fabrication">Custom Parapet & Coping</option>
            <option value="Full Roof BOQ Estimation">Full Architectural Roof BOQ</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            Estimated Linear Metres / Area
          </label>
          <input
            type="number"
            step="1"
            {...register("lengthInMetres", { valueAsNumber: true })}
            placeholder="e.g. 850"
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            Site / Project Location (City, State)
          </label>
          <input
            {...register("projectLocation")}
            placeholder="e.g. Lekki Phase 1, Lagos"
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            Material Gauge & Color Preference
          </label>
          <input
            {...register("material")}
            placeholder="e.g. 0.55mm Heavy Gauge Aluminium - Wine Red (Gloss Finish)"
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            Technical Details / Cutting Schedule / Special Notes
          </label>
          <textarea
            rows={4}
            {...register("specialInstructions")}
            placeholder="Enter truss slope angle, specific lengths required, site access notes, or purlin spacing..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3.5 text-sm text-white focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
      >
        <Send className="w-4 h-4" />
        <span>{isSubmitting ? "Submitting Request..." : "Submit Quote Request"}</span>
      </button>
    </form>
  );
}
