"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Coffee,
  Dumbbell,
  MapPin,
  Star,
  Wifi,
} from "lucide-react";

export type HotelOption = {
  id: string;
  imageUrl: string;
  badge: string;
  name: string;
  rating: number;
  location: string;
  reviewCount: number;
  amenities: string[];
  highlights: string[];
  pricePerNight: number;
  totalPrice: number;
  nights: number;
};

interface HotelCardProps {
  hotel: HotelOption;
  selected: boolean;
  onSelect: () => void;
}

const amenityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Wifi,
  Pool: Dumbbell,
  Breakfast: Coffee,
  Gym: Dumbbell,
  Spa: Star,
  Yoga: Star,
};

export default function HotelCard({ hotel, selected, onSelect }: HotelCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileHover={{ y: -4 }}
      className={`group flex w-full flex-col overflow-hidden rounded-3xl border bg-white text-left shadow-sm transition ${
        selected ? "border-orange-400 bg-orange-50" : "border-slate-200 hover:border-slate-300"
      }`}
    >
      <div className="relative h-52 w-full overflow-hidden bg-slate-200 sm:h-[220px]">
        <Image
          src={hotel.imageUrl}
          alt={hotel.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      <div className="flex flex-1 flex-col gap-5 p-6">
        <div className="flex items-start justify-between gap-4">
          <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">
            {hotel.badge}
          </span>
          {selected ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              Selected
            </span>
          ) : null}
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-slate-900">{hotel.name}</h3>
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="h-4 w-4" />
              <span>{hotel.rating}</span>
            </div>
            <span>·</span>
            <span>{hotel.reviewCount.toLocaleString()} reviews</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <MapPin className="h-4 w-4" />
            <span>{hotel.location}</span>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          {hotel.amenities.map((amenity) => {
            const Icon = amenityIcons[amenity] ?? Wifi;
            return (
              <div key={amenity} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                <Icon className="h-4 w-4" />
                {amenity}
              </div>
            );
          })}
        </div>

        <div className="space-y-3">
          {hotel.highlights.map((highlight) => (
            <div key={highlight} className="flex items-start gap-3 text-sm text-slate-600">
              <CheckCircle2 className="mt-1 h-4 w-4 text-emerald-600" />
              <span>{highlight}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-2xl font-semibold text-slate-900">${hotel.pricePerNight}/night</p>
            <p className="text-sm text-slate-500">Total: ${hotel.totalPrice} ({hotel.nights} nights)</p>
          </div>
          <span className="inline-flex rounded-full bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition group-hover:bg-orange-600">
            Select Hotel
          </span>
        </div>
      </div>
    </motion.button>
  );
}
