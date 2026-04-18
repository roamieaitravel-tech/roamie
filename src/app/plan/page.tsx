"use client";

import { useState } from "react";
import { ArrowLeft, Anchor, Plane, Train } from "lucide-react";
import PlanForm, { PlanFormValues } from "@/components/trip/PlanForm";
import LoadingPlan from "@/components/trip/LoadingPlan";

export default function PlanPage(): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async (values: PlanFormValues): Promise<void> => {
    setError(null);
    setResult(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/plan-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Unable to generate trip plan.");
      }

      const text = await response.text();
      setResult(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {isLoading && <LoadingPlan />}

      <div className="mx-auto min-h-screen max-w-[1600px] lg:grid lg:grid-cols-[45%_55%]">
        <aside className="hidden h-screen flex-col bg-[#004E89] px-10 py-12 text-white lg:flex">
          <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-white/80">
            <ArrowLeft className="h-4 w-4" />
            <span>Plan New Trip</span>
          </div>

          <div className="mt-12 max-w-xl space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-semibold leading-tight">
                Tell us about
                <br />
                your perfect trip.
              </h1>
              <p className="max-w-lg text-base text-white/80">
                Our AI reads your request and builds a complete travel plan in seconds.
              </p>
            </div>

            <div className="grid gap-3">
              <div className="flex items-center gap-3 rounded-full border border-white/40 px-4 py-3 text-sm font-medium text-white">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white">
                  <Plane className="h-5 w-5" />
                </div>
                Flights
              </div>
              <div className="flex items-center gap-3 rounded-full border border-white/40 px-4 py-3 text-sm font-medium text-white">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white">
                  <Train className="h-5 w-5" />
                </div>
                Trains
              </div>
              <div className="flex items-center gap-3 rounded-full border border-white/40 px-4 py-3 text-sm font-medium text-white">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white">
                  <Anchor className="h-5 w-5" />
                </div>
                Cruises
              </div>
            </div>

            <div className="mt-auto rounded-3xl border border-white/20 bg-white/15 p-8 backdrop-blur-xl">
                <p className="text-sm text-white/80">&quot;Saved $400 on my Bali trip by letting the AI find the optimal route combination.&quot;</p>
                <p className="mt-6 text-base font-semibold text-white">Alex M. &mdash; Bangkok, 2024</p>
            </div>
          </div>
        </aside>

        <section className="min-h-screen bg-white px-6 py-10 sm:px-10 lg:px-14">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 flex flex-col gap-3 lg:mb-12">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Your Trip Details</p>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Fill in the basics and let AI handle the rest
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-slate-500">
                Complete the details below to generate a tailored itinerary, transport recommendations, and a realistic cost plan.
              </p>
            </div>

            <PlanForm onSubmit={handleSubmit} submitting={isLoading} />

            {error ? (
              <div className="mt-6 rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4 text-sm text-orange-700">
                {error}
              </div>
            ) : null}

            {result ? (
              <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <h3 className="text-base font-semibold text-slate-900">Generated plan payload</h3>
                <pre className="mt-4 max-h-[420px] overflow-auto rounded-2xl bg-white p-4 text-sm text-slate-700">
                  {result}
                </pre>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
