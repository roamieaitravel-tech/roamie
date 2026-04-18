"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Anchor,
  Calendar,
  Hotel,
  MapPin,
  Minus,
  Plane,
  Plus,
  Sparkles,
  Star,
  Train,
  Backpack,
} from "lucide-react";

export type PlanFormValues = {
  destination: string;
  origin: string;
  startDate: string;
  endDate: string;
  flexible: boolean;
  adults: number;
  children: number;
  budget: number;
  transportTypes: Array<"plane" | "train" | "cruise">;
  travelStyle: "Budget" | "Comfort" | "Premium";
  specialRequests: string;
};

const planSchema = z.object({
  destination: z.string().min(1),
  origin: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  flexible: z.boolean(),
  adults: z.number().min(1),
  children: z.number().min(0),
  budget: z.number().min(100).max(10000),
  transportTypes: z.array(z.enum(["plane", "train", "cruise"])),
  travelStyle: z.enum(["Budget", "Comfort", "Premium"]),
  specialRequests: z.string().max(1000),
});

const defaultValues: PlanFormValues = {
  destination: "",
  origin: "",
  startDate: "",
  endDate: "",
  flexible: true,
  adults: 2,
  children: 0,
  budget: 1500,
  transportTypes: ["plane"],
  travelStyle: "Comfort",
  specialRequests: "",
};

interface PlanFormProps {
  submitting: boolean;
  onSubmit: (values: PlanFormValues) => Promise<void>;
}

export default function PlanForm({ submitting, onSubmit }: PlanFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues,
    mode: "onChange",
  });

  const transportTypes = watch("transportTypes");
  const budget = watch("budget");
  const flexible = watch("flexible");
  const adults = watch("adults");
  const children = watch("children");

  useEffect(() => {
    setValue("transportTypes", transportTypes.length ? transportTypes : ["plane"]);
  }, [transportTypes, setValue]);

  const updateCount = (field: "adults" | "children", delta: number) => {
    const current = field === "adults" ? adults : children;
    const nextValue = Math.max(0, current + delta);
    if (field === "adults" && nextValue === 0) return;
    setValue(field, nextValue);
  };

  const toggleTransport = (type: "plane" | "train" | "cruise") => {
    const nextTypes = transportTypes.includes(type)
      ? transportTypes.filter((item) => item !== type)
      : [...transportTypes, type];

    setValue("transportTypes", nextTypes.length ? nextTypes : ["plane"]);
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-6">
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-900">Destination</label>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="e.g. Paris, Tokyo, Bali..."
              className="w-full rounded-3xl border-2 border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-orange-500"
              {...register("destination")}
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-900">Departing From</label>
          <div className="relative">
            <Plane className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="e.g. London, Los Angeles, Sydney..."
              className="w-full rounded-3xl border-2 border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-orange-500"
              {...register("origin")}
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-900">Travel Dates</label>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="relative rounded-3xl border-2 border-slate-200 bg-slate-50 py-4 pl-12 pr-4 transition focus-within:border-orange-500">
                <Calendar className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="date"
                  className="w-full bg-transparent text-sm text-slate-900 outline-none"
                  {...register("startDate")}
                />
                <span className="mt-2 block text-xs text-slate-500">Departure</span>
              </div>
              <div className="relative rounded-3xl border-2 border-slate-200 bg-slate-50 py-4 pl-12 pr-4 transition focus-within:border-orange-500">
                <Calendar className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="date"
                  className="w-full bg-transparent text-sm text-slate-900 outline-none"
                  {...register("endDate")}
                />
                <span className="mt-2 block text-xs text-slate-500">Return</span>
              </div>
            </div>
            <label className="inline-flex items-center gap-3 text-sm text-slate-600">
              <input
                type="checkbox"
                className="h-5 w-5 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                checked={flexible}
                onChange={(event) => setValue("flexible", event.target.checked)}
              />
              Flexible by ± 3 days
            </label>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-900">Who&apos;s Coming?</label>
            <div className="grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
              {[
                { label: "Adults", value: adults, field: "adults" as const },
                { label: "Children", value: children, field: "children" as const },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{item.label}</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1">
                    <button
                      type="button"
                      onClick={() => updateCount(item.field, -1)}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white transition hover:bg-orange-600"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="min-w-[2rem] text-center text-sm font-semibold text-slate-900">{item.value}</span>
                    <button
                      type="button"
                      onClick={() => updateCount(item.field, 1)}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white transition hover:bg-orange-600"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-900">Total Budget (per person)</label>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-900">${budget.toLocaleString()}</span>
                <span className="text-xs uppercase tracking-[0.24em] text-slate-500">Budget</span>
              </div>
              <input
                type="range"
                min="100"
                max="10000"
                step="100"
                value={budget}
                onChange={(event) => setValue("budget", Number(event.target.value))}
                className="w-full accent-orange-500"
              />
              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500">
                <span>Budget</span>
                <span>$500</span>
                <span>$2K</span>
                <span>$5K+</span>
                <span>Luxury</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-slate-900">How do you want to travel?</label>
              <p className="text-sm text-slate-500">Choose one or more transport modes.</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "By Air", description: "Fastest option", type: "plane" as const, icon: Plane },
              { label: "By Train", description: "Scenic routes", type: "train" as const, icon: Train },
              { label: "By Cruise", description: "Sail away", type: "cruise" as const, icon: Anchor },
            ].map((card) => {
              const selected = transportTypes.includes(card.type);
              const Icon = card.icon;
              return (
                <button
                  key={card.type}
                  type="button"
                  onClick={() => toggleTransport(card.type)}
                  className={`group flex flex-col gap-3 rounded-3xl border p-5 text-left transition ${
                    selected
                      ? "border-orange-400 bg-orange-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-orange-500">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{card.label}</p>
                    <p className="mt-1 text-sm text-slate-500">{card.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-medium text-slate-900">Your travel style</label>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                value: "Budget",
                title: "Budget",
                description: "Hostels, local food",
                icon: Backpack,
              },
              {
                value: "Comfort",
                title: "Comfort",
                description: "Good hotels, mix of experiences",
                icon: Hotel,
              },
              {
                value: "Premium",
                title: "Premium",
                description: "Best options available",
                icon: Star,
              },
            ].map((option) => {
              const selected = watch("travelStyle") === option.value;
              const OptionIcon = option.icon;
              return (
                <label
                  key={option.value}
                  className={`group cursor-pointer rounded-3xl border p-5 transition ${
                    selected
                      ? "border-orange-400 bg-orange-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    value={option.value}
                    {...register("travelStyle")}
                    className="sr-only"
                  />
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-orange-500">
                    <OptionIcon className="h-5 w-5" />
                  </div>
                  <div className="mt-4">
                    <p className="font-semibold text-slate-900">{option.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{option.description}</p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-900">Anything specific? (Optional)</label>
          <textarea
            rows={3}
            placeholder="e.g. I want vegetarian food options, avoid long layovers, prefer window seats..."
            className="w-full rounded-3xl border-2 border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none transition focus:border-orange-500"
            {...register("specialRequests")}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="flex h-14 w-full items-center justify-center gap-3 rounded-full bg-[#FF6B35] px-6 text-sm font-semibold text-white transition-transform duration-200 hover:scale-[1.02] disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-white">
          <Sparkles className="h-4 w-4" />
        </span>
        {submitting ? "Generating..." : "Generate My Trip Plan"}
      </button>

      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-slate-400" />
          <span>Your data is private and never shared</span>
        </div>
      </div>
    </form>
  );
}
