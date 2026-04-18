"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Heart,
  MapPin,
  Share2,
  Star,
  Plane,
} from "lucide-react";
import BudgetChart from "@/components/trip/BudgetChart";
import HotelCard from "@/components/trip/HotelCard";
import ItineraryDay from "@/components/trip/ItineraryDay";
import TransportCard, { TransportOption } from "@/components/trip/TransportCard";

const heroImage =
  "https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1400&q=80";

const transportOptions: TransportOption[] = [
  {
    id: "air",
    provider: "SkyJet",
    type: "plane" as const,
    route: "JFK → DPS",
    departureTime: "08:45",
    arrivalTime: "23:30",
    duration: "19h 45m",
    stops: "1 stop",
    badge: "BEST VALUE" as const,
    price: 445,
  },
  {
    id: "train",
    provider: "RailAsia",
    type: "train" as const,
    route: "Bali Central → Ubud",
    departureTime: "07:20",
    arrivalTime: "14:10",
    duration: "6h 50m",
    stops: "Direct",
    badge: "FASTEST" as const,
    price: 389,
  },
  {
    id: "cruise",
    provider: "OceanWave",
    type: "cruise" as const,
    route: "Bali Port → Nusa Penida",
    departureTime: "09:30",
    arrivalTime: "16:15",
    duration: "6h 45m",
    stops: "Direct",
    badge: "CHEAPEST" as const,
    price: 375,
  },
];

const hotelOptions = [
  {
    id: "hotelA",
    imageUrl:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=70",
    badge: "BEST VALUE",
    name: "Nusa Indah Resort",
    rating: 4.8,
    location: "Seminyak, Bali",
    reviewCount: 2847,
    amenities: ["Wifi", "Pool", "Breakfast", "Gym"],
    highlights: [
      "Beachfront access",
      "Rooftop pool lounge",
      "Complimentary breakfast",
    ],
    pricePerNight: 45,
    totalPrice: 315,
    nights: 7,
  },
  {
    id: "hotelB",
    imageUrl:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=70",
    badge: "MOST POPULAR",
    name: "Bali Oasis Retreat",
    rating: 4.7,
    location: "Ubud, Bali",
    reviewCount: 2170,
    amenities: ["Wifi", "Spa", "Breakfast", "Yoga"],
    highlights: [
      "Eco-friendly suites",
      "Garden-side dining",
      "Daily wellness classes",
    ],
    pricePerNight: 52,
    totalPrice: 364,
    nights: 7,
  },
  {
    id: "hotelC",
    imageUrl:
      "https://images.unsplash.com/photo-1424709746721-b8fd1f6c47ff?auto=format&fit=crop&w=800&q=70",
    badge: "LUXURY",
    name: "Sea Breeze Palace",
    rating: 4.9,
    location: "Nusa Dua, Bali",
    reviewCount: 1785,
    amenities: ["Wifi", "Pool", "Breakfast", "Gym"],
    highlights: [
      "Ocean-view suites",
      "Private beach lounge",
      "Upscale dining options",
    ],
    pricePerNight: 72,
    totalPrice: 504,
    nights: 7,
  },
];

const itineraryItems = [
  {
    id: "day1",
    day: 1,
    date: "Jun 12",
    title: "Arrival in Bali",
    estimatedCost: 120,
    activities: [
      {
        time: "09:30 AM",
        title: "Arrive at Ngurah Rai Airport",
        description: "Private transfer to the resort and seamless check-in.",
        duration: "45m",
        location: "Denpasar",
        cost: "Free",
      },
      {
        time: "12:00 PM",
        title: "Lunch at Beach Club",
        description: "Enjoy local seafood with a sea view.",
        duration: "1h 15m",
        location: "Seminyak",
        cost: "$28",
      },
      {
        time: "03:00 PM",
        title: "Sunset pool lounge",
        description: "Relax by the pool and welcome drinks.",
        duration: "2h",
        location: "Resort",
        cost: "Free",
      },
    ],
    meals: [
      { type: "Breakfast", suggestion: "Resort buffet", estimatedCost: "$0" },
      { type: "Lunch", suggestion: "Beach club seafood platter", estimatedCost: "$28" },
      { type: "Dinner", suggestion: "Poolside tapas", estimatedCost: "$22" },
    ],
    summary: "A smooth arrival day with a relaxing introduction to Bali’s coastline.",
  },
  {
    id: "day2",
    day: 2,
    date: "Jun 13",
    title: "Ubud Cultural Tour",
    estimatedCost: 187,
    activities: [
      {
        time: "08:30 AM",
        title: "Temple walk and market tour",
        description: "Guided morning tour of local temples and traditional markets.",
        duration: "3h",
        location: "Ubud",
        cost: "$45",
      },
      {
        time: "12:30 PM",
        title: "Lunch at rice terrace cafe",
        description: "Tasting menu overlooking the green terraces.",
        duration: "1h 30m",
        location: "Tegalalang",
        cost: "$32",
      },
      {
        time: "03:00 PM",
        title: "Spa and wellness session",
        description: "Traditional Balinese massage and relaxation.",
        duration: "2h",
        location: "Ubud spa",
        cost: "$45",
      },
    ],
    meals: [
      { type: "Breakfast", suggestion: "Resort continental", estimatedCost: "$0" },
      { type: "Lunch", suggestion: "Terrace cafe tasting", estimatedCost: "$32" },
      { type: "Dinner", suggestion: "Local restaurant", estimatedCost: "$18" },
    ],
    summary: "Experience Bali’s cultural heart through temples, cuisine, and wellness.",
  },
  {
    id: "day3",
    day: 3,
    date: "Jun 14",
    title: "Island Adventure",
    estimatedCost: 180,
    activities: [
      {
        time: "07:30 AM",
        title: "Boat transfer to Nusa Penida",
        description: "Scenic coastal cruise with island views.",
        duration: "1h 30m",
        location: "Bali Port",
        cost: "$55",
      },
      {
        time: "10:30 AM",
        title: "Beach exploration tour",
        description: "Visit hidden bays and iconic viewpoints.",
        duration: "3h",
        location: "Nusa Penida",
        cost: "$38",
      },
      {
        time: "02:30 PM",
        title: "Return transfer and sunset dinner",
        description: "Relaxed evening back in Bali with dinner by the water.",
        duration: "3h",
        location: "Seminyak",
        cost: "$25",
      },
    ],
    meals: [
      { type: "Breakfast", suggestion: "Grab-and-go pastry", estimatedCost: "$7" },
      { type: "Lunch", suggestion: "Island cafe meal", estimatedCost: "$18" },
      { type: "Dinner", suggestion: "Coastal seafood dinner", estimatedCost: "$20" },
    ],
    summary: "A memorable island day with beach cliffs, cruises, and a mellow evening.",
  },
];

const savingTips = [
  {
    title: "Book early departures",
    description: "Select morning transfers to avoid peak pricing and secure the best seats.",
  },
  {
    title: "Combine transport modes",
    description: "Mix train and boat journeys for better value and local experiences.",
  },
  {
    title: "Choose flexible dining",
    description: "Local lunch spots offer high-quality meals at a fraction of hotel prices.",
  },
  {
    title: "Use shared transfers",
    description: "Shuttle services reduce individual transport costs while staying efficient.",
  },
];

const companions = [
  { initials: "AJ", name: "Ari J.", flag: "ID", match: 92 },
  { initials: "MN", name: "Mina N.", flag: "AU", match: 88 },
  { initials: "RY", name: "Ryo Y.", flag: "JP", match: 84 },
];

export default function ResultsPage(): React.JSX.Element {
  const [selectedTransportId, setSelectedTransportId] = useState("air");
  const [selectedHotelId, setSelectedHotelId] = useState("hotelA");

  const selectedTransport = useMemo(
    () => transportOptions.find((option) => option.id === selectedTransportId) ?? transportOptions[0],
    [selectedTransportId]
  );

  const selectedHotel = useMemo(
    () => hotelOptions.find((hotel) => hotel.id === selectedHotelId) ?? hotelOptions[0],
    [selectedHotelId]
  );

  const extraCosts = 487;
  const totalCost = selectedTransport.price + selectedHotel.totalPrice + extraCosts;
  const budget = 1500;
  const savings = budget - totalCost;

  const budgetCategories = useMemo(
    () => [
      { name: "Transport", amount: selectedTransport.price, color: "#FF6B35" },
      { name: "Hotel", amount: selectedHotel.totalPrice, color: "#004E89" },
      { name: "Food", amount: 320, color: "#1A936F" },
      { name: "Activities", amount: 110, color: "#9333EA" },
      { name: "Misc", amount: 57, color: "#6B7280" },
    ],
    [selectedTransport.price, selectedHotel.totalPrice]
  );

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-3 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3 text-sm font-medium text-slate-900">
            <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 transition hover:border-slate-300">
              <ArrowLeft className="h-4 w-4" />
              Bali
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button className="rounded-full border border-orange-400 px-4 py-2 text-sm font-semibold text-orange-600 transition hover:bg-orange-50">
              Save Trip
            </button>
            <button className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100">
              <Share2 className="mr-2 inline-block h-4 w-4" />
              Share
            </button>
            <button className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600">
              Book All
            </button>
            <button className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:border-slate-300">
              <Heart className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-5 py-8 sm:px-6 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-3xl bg-slate-900 shadow-xl"
        >
          <div className="relative h-[420px]">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent" />

            <div className="relative z-10 flex h-full flex-col justify-between p-8 lg:p-10">
              <div className="max-w-2xl text-white">
                <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/90">
                  AI Generated Plan
                </span>
                <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl">Bali</h1>
                <div className="mt-4 text-sm text-slate-200 sm:text-base">
                  Jun 12 &mdash; Jun 18 &bull; 6 nights
                </div>
              </div>

              <div className="grid gap-4 rounded-3xl bg-white/95 p-6 text-slate-900 shadow-lg sm:grid-cols-[1.4fr_0.85fr]">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">Total Trip Cost</p>
                  <p className="mt-3 text-4xl font-semibold">${totalCost.toLocaleString()}</p>
                  <p className="mt-2 text-sm text-slate-500">Your budget: $1,500</p>
                </div>
                <div className="rounded-3xl bg-slate-100 p-4">
                  <p className="text-sm font-semibold text-slate-900">You save ${savings.toLocaleString()}</p>
                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.round((savings / budget) * 100)}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white px-5 py-6 sm:px-8">
            <div className="grid gap-4 sm:grid-cols-4">
              {[
                { label: "Air travel", value: "Plane", icon: Plane },
                { label: "Hotel nights", value: "6", icon: Star },
                { label: "Activities", value: "12", icon: MapPin },
                { label: "Estimated savings", value: `$${savings.toLocaleString()}`, icon: CheckCircle2 },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center gap-3 text-slate-500">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-orange-500 shadow-sm">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{item.label}</p>
                        <p className="mt-2 text-lg font-semibold text-slate-900">{item.value}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mt-8 rounded-3xl bg-white p-6 shadow-sm"
        >
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Getting There</h2>
              <p className="mt-2 text-sm text-slate-500">Select your preferred option</p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {transportOptions.map((option) => (
              <TransportCard
                key={option.id}
                option={option}
                selected={selectedTransportId === option.id}
                onSelect={() => setSelectedTransportId(option.id)}
              />
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-8 rounded-3xl bg-white p-6 shadow-sm"
        >
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Where You&apos;ll Stay</h2>
              <p className="mt-2 text-sm text-slate-500">AI selected for best value</p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {hotelOptions.map((hotel) => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                selected={selectedHotelId === hotel.id}
                onSelect={() => setSelectedHotelId(hotel.id)}
              />
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-8 grid gap-6 xl:grid-cols-[360px_1fr]"
        >
          <BudgetChart total={totalCost} categories={budgetCategories} />

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">Your Budget</h3>
            <p className="mt-2 text-sm text-slate-500">Trip Cost summary for the selected options</p>
            <div className="mt-6 space-y-4">
              {budgetCategories.map((category) => (
                <div key={category.name} className="flex items-center justify-between gap-4 text-sm text-slate-700">
                  <span>{category.name}</span>
                  <span>${category.amount}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-3xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Your Budget</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">$1,500</p>
              <div className="mt-4 flex items-center justify-between text-sm text-slate-700">
                <span>Trip Cost</span>
                <span>${totalCost}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm font-semibold text-emerald-700">
                <span>You Save</span>
                <span>${savings}</span>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 rounded-3xl bg-white p-6 shadow-sm"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-slate-900">Your Journey</h2>
            <p className="mt-2 text-sm text-slate-500">Full day-by-day breakdown</p>
          </div>

          <div className="space-y-4">
            {itineraryItems.map((item) => (
              <ItineraryDay key={item.id} item={item} />
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-8 rounded-3xl bg-orange-50 p-6 shadow-sm"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-orange-700">AI Saving Tips</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-900">Saving Tips</h2>
            </div>
            <div className="rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-orange-700">
              <Star className="mr-2 inline h-4 w-4" />
              Learn more
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {savingTips.map((tip) => (
              <motion.div
                key={tip.title}
                whileHover={{ y: -4 }}
                className="rounded-3xl bg-white p-5 shadow-sm"
              >
                <div className="flex items-center gap-3 text-orange-600">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-orange-100">
                    <Star className="h-5 w-5" />
                  </div>
                  <p className="font-semibold text-slate-900">{tip.title}</p>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600">{tip.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 rounded-3xl bg-slate-900 p-6 text-white shadow-sm"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-300">3 Travelers Going to Bali</p>
              <h2 className="mt-3 text-2xl font-semibold">Around the same dates as you</h2>
            </div>
            <button className="rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600">
              Find Travel Companions
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {companions.map((person) => (
              <div key={person.name} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-slate-700 text-sm font-semibold text-white">
                    {person.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{person.name}</p>
                    <p className="text-sm text-slate-300">{person.flag}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-emerald-300">
                  <span>Match</span>
                  <span>{person.match}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        <div className="mt-10 hidden md:block">
          <button className="w-full rounded-full bg-orange-500 px-6 py-4 text-base font-semibold text-white transition hover:bg-orange-600">
            Book Everything Now
          </button>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 bg-white px-5 py-4 shadow-[0_-16px_32px_rgba(15,23,42,0.08)] md:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">Total</p>
            <p className="text-base font-semibold text-slate-900">${totalCost}</p>
            <p className="text-xs text-slate-500">For 2 travelers</p>
          </div>
          <button className="rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600">
            Book Everything Now
          </button>
        </div>
      </div>
    </main>
  );
}
