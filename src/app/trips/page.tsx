"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, DollarSign, Plane, ChevronRight, Plus, Trash2, Eye } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Trip {
  id: string;
  destination: string;
  origin: string;
  start_date: string;
  end_date: string;
  budget: number;
  currency: string;
  transport_type: string;
  status: string;
  created_at: string;
}

export default function TripsPage() {
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const supabase = createClient();
        if (!supabase) throw new Error("Supabase not initialized");

        const { data: authData } = await supabase.auth.getUser();
        if (!authData.user) {
          router.push("/login");
          return;
        }

        let query = supabase.from("trips").select("*").eq("user_id", authData.user.id);

        if (filter === "active") {
          query = query.gte("end_date", new Date().toISOString());
        } else if (filter === "completed") {
          query = query.lt("end_date", new Date().toISOString());
        }

        const { data, error: fetchError } = await query.order("start_date", { ascending: false });

        if (fetchError) throw fetchError;

        setTrips(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load trips");
      } finally {
        setLoading(false);
      }
    };

    loadTrips();
  }, [router, filter]);

  const handleDeleteTrip = async (tripId: string) => {
    if (!confirm("Are you sure you want to delete this trip?")) return;

    try {
      const supabase = createClient();
      if (!supabase) throw new Error("Supabase not initialized");

      const { error: deleteError } = await supabase.from("trips").delete().eq("id", tripId);

      if (deleteError) throw deleteError;

      setTrips((prev) => prev.filter((t) => t.id !== tripId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete trip");
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    const days = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="mx-auto max-w-6xl">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-center py-12"
          >
            <p className="text-slate-600">Loading your trips...</p>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-4"
            >
              <ChevronRight className="h-5 w-5 rotate-180" />
              Back
            </Link>
            <h1 className="text-3xl font-bold text-slate-900">My Trips</h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/ai-plan")}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#FF6B35] text-white font-semibold hover:shadow-lg transition-all"
          >
            <Plus className="h-5 w-5" />
            Plan New Trip
          </motion.button>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-red-700"
          >
            {error}
          </motion.div>
        )}

        {/* Filter Tabs */}
        <div className="mb-8 flex gap-4">
          {(["all", "active", "completed"] as const).map((f) => (
            <motion.button
              key={f}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                filter === f
                  ? "bg-[#FF6B35] text-white shadow-lg"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </motion.button>
          ))}
        </div>

        {/* Trips Grid */}
        {trips.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl bg-white shadow-lg p-12 text-center"
          >
            <Plane className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No trips yet</h2>
            <p className="text-slate-600 mb-6">Start planning your next adventure with Roamie!</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/ai-plan")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FF6B35] text-white font-semibold hover:shadow-lg transition-all"
            >
              <Plus className="h-5 w-5" />
              Create Your First Trip
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {trips.map((trip, idx) => {
              const daysLeft = getDaysRemaining(trip.end_date);
              const isActive = daysLeft > 0;

              return (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="rounded-2xl bg-white shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Trip Header with Banner */}
                  <div className="relative h-40 bg-gradient-to-br from-[#FF6B35] to-orange-500 flex items-center justify-center">
                    <Plane className="h-16 w-16 text-white opacity-50" />
                    {isActive && (
                      <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                        {daysLeft} days left
                      </div>
                    )}
                  </div>

                  {/* Trip Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {trip.origin} → {trip.destination}
                      </h3>
                      <p className="text-sm text-slate-500">{trip.transport_type}</p>
                    </div>

                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-[#FF6B35]" />
                        <span>
                          {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-[#FF6B35]" />
                        <span>
                          {trip.currency} {trip.budget.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-[#FF6B35]" />
                        <span className="capitalize">{trip.status}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 border-t border-slate-200 flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.push(`/results?id=${trip.id}`)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#FF6B35] text-white font-semibold hover:shadow-lg transition-all"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDeleteTrip(trip.id)}
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </main>
  );
}
