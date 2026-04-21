"use client";

import { useState } from "react";
import { ArrowLeft, Anchor, Lock, Plane, Train } from "lucide-react";
import { useRouter } from "next/navigation";
import PlanForm, { PlanFormValues } from "@/components/trip/PlanForm";
import LoadingPlan from "@/components/trip/LoadingPlan";

import { RefreshCcw } from "lucide-react";

export default function PlanPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamText, setStreamText] = useState("");
  const [lastSubmittedValues, setLastSubmittedValues] = useState<PlanFormValues | null>(null);

  const handleSubmit = async (values: PlanFormValues) => {
    setError(null);
    setIsLoading(true);
    setStreamText("");
    setLastSubmittedValues(values);

    const tripId = typeof crypto !== "undefined" && "randomUUID" in crypto 
      ? crypto.randomUUID() 
      : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    try {
      const response = await fetch("/api/plan-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, tripId }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Unable to generate trip plan.");
      }

      if (!response.body) throw new Error("No response stream");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setStreamText((prev) => prev + chunk);
      }

      // After streaming entirely finishes, route to results payload since Supabase has it.
      router.push(`/results?id=${encodeURIComponent(tripId)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error occurred while generating trip.");
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {isLoading && (
        <>
          <div className="fixed top-0 left-0 w-full z-[60] bg-white shadow-md rounded-b-[32px] p-6 max-h-[30vh] overflow-y-auto">
             <div className="flex items-center gap-3">
               <div className="h-6 w-6 border-4 border-orange-500 border-t-transparent flex rounded-full animate-spin"></div>
               <span className="font-semibold text-lg text-slate-900 tracking-wide uppercase">Generating your trip stream...</span>
             </div>
             <p className="text-slate-500 text-xs mt-3 whitespace-pre-wrap break-words opacity-70 leading-relaxed font-mono">
               {streamText}
             </p>
          </div>
          <LoadingPlan />
        </>
      )}

      <div className="mx-auto min-h-screen max-w-[1600px] lg:grid lg:grid-cols-[40%_60%]">
        <aside className="hidden h-screen flex-col bg-[#004E89] px-10 py-12 text-white lg:flex">
          <div className="flex items-center justify-between gap-4">
            <button type="button" className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-white/80">
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-white/80">roamie</div>
          </div>

          <div className="mt-12 flex h-full flex-col justify-between">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-[36px] font-bold leading-tight">Plan Your Perfect Trip</h1>
                <p className="max-w-lg text-base text-white/60">
                  AI searches 500+ providers to build your complete trip plan at the lowest possible price
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { icon: "Plane", label: "Flights from 500+ airlines" },
                  { icon: "Train", label: "Global rail networks" },
                  { icon: "Anchor", label: "Cruise packages worldwide" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-white/15 text-white">
                      {item.icon === "Plane" ? <Plane className="h-5 w-5" /> : item.icon === "Train" ? <Train className="h-5 w-5" /> : <Anchor className="h-5 w-5" />}
                    </div>
                    <p className="text-sm font-medium text-white">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
              <div className="flex items-start gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white">
                  <span className="text-2xl">“</span>
                </span>
                <div>
                  <p className="text-sm leading-6 text-white/90">
                    Saved $620 on my Southeast Asia trip. The AI found a combination I never would have thought of.
                  </p>
                  <p className="mt-4 text-sm text-white/70">Jamie R. — 2024</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <section className="min-h-screen overflow-y-auto bg-white px-6 py-10 sm:px-10 lg:px-14">
          <div className="mx-auto max-w-[520px]">
            <div className="mb-10 space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Your Trip Details</p>
              <h2 className="text-3xl font-bold text-slate-900">Tell us about your trip and our AI handles the rest</h2>
              <p className="text-sm leading-6 text-slate-500">
                Tell us about your trip and our AI handles the rest
              </p>
            </div>

            <div className="rounded-[32px] border border-slate-200 bg-white p-12 shadow-sm">
              <PlanForm onSubmit={handleSubmit} submitting={isLoading} />
              {error ? (
                <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-6 flex flex-col gap-4 text-sm text-red-700">
                  <div>
                    <h3 className="font-bold text-red-800 text-lg">Trip Generation Failed</h3>
                    <p className="mt-1">{error}</p>
                  </div>
                  <button 
                    onClick={() => lastSubmittedValues && handleSubmit(lastSubmittedValues)}
                    className="flex items-center self-start justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-full transition-colors"
                  >
                    <RefreshCcw className="h-4 w-4" /> Try Again
                  </button>
                </div>
              ) : null}
              <div className="mt-8 flex items-center gap-3 text-sm text-slate-500">
                <Lock className="h-4 w-4 text-slate-400" />
                <span>Your information is private and never shared</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
