"use client";

import { motion } from "framer-motion";
import { Anchor, CheckCircle2, Plane, Train } from "lucide-react";

export type TransportOption = {
  id: string;
  provider: string;
  type: "plane" | "train" | "cruise";
  route: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: string;
  badge: "BEST VALUE" | "FASTEST" | "CHEAPEST";
  price: number;
};

interface TransportCardProps {
  option: TransportOption;
  selected: boolean;
  onSelect: () => void;
}

const iconMap = {
  plane: Plane,
  train: Train,
  cruise: Anchor,
};

export default function TransportCard({ option, selected, onSelect }: TransportCardProps): React.JSX.Element {
  const Icon = iconMap[option.type];

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileHover={{ y: -4 }}
      className={`group flex w-full flex-col justify-between gap-5 rounded-3xl border bg-white p-6 text-left transition ${
        selected
          ? "border-orange-400 bg-orange-50"
          : "border-slate-200 hover:border-slate-300"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-100 text-orange-500">
            <span className="text-sm font-semibold text-slate-900">{option.provider.slice(0, 2)}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{option.provider}</p>
            <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
              <Icon className="h-4 w-4" />
              <span>{option.type === "plane" ? "Air" : option.type === "train" ? "Train" : "Cruise"}</span>
            </div>
          </div>
        </div>
        {selected ? (
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            Selected
          </div>
        ) : null}
      </div>

      <div className="space-y-3">
        <p className="text-lg font-semibold text-slate-900">{option.route}</p>
        <div className="flex items-center gap-4 text-sm text-slate-500">
          <span>{option.departureTime} → {option.arrivalTime}</span>
          <span>•</span>
          <span>{option.duration}</span>
        </div>
        <div className="h-px bg-slate-200" />
        <div className="flex items-center justify-between gap-3 text-sm text-slate-500">
          <span>{option.stops}</span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">{option.badge}</span>
        </div>
      </div>

      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-2xl font-semibold text-slate-900">${option.price}</p>
          <p className="text-sm text-slate-500">Per person</p>
        </div>
        <span className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-orange-600">
          Select This Option
        </span>
      </div>
    </motion.button>
  );
}
