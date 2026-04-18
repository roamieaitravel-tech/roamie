"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Heart,
  MapPin,
  Share2,
  Star,
  Plane,
  Train,
  Anchor,
  Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface TripData {
  id: string;
  destination: string;
  origin: string;
  start_date: string;
  end_date: string;
  budget: number;
  currency: string;
  transport_type: string;
  status: string;
  ai_itinerary: any; // JSON object from OpenAI
  user_id: string | null;
}

function ResultsPageContent() {
  const searchParams = useSearchParams();
  const tripId = searchParams.get("id");

  const [trip, setTrip] = useState<TripData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tripId) {
      setError("No trip ID provided");
      setLoading(false);
      return;
    }

    const fetchTrip = async () => {
      try {
        const supabase = createClient();
        const { data, error: fetchError } = await supabase
          .from("trips")
          .select("*")
          .eq("id", tripId)
          .single();

        if (fetchError) {
          throw new Error(fetchError.message);
        }

        if (!data) {
          throw new Error("Trip not found");
        }

        setTrip(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load trip");
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [tripId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-500" />
          <p className="text-slate-600">Loading your trip plan...</p>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center max-w-md">
          <p className="text-red-600 mb-4">{error || "Trip not found"}</p>
          <a href="/plan" className="text-orange-500 hover:underline">
            Plan a new trip
          </a>
        </div>
      </div>
    );
  }

  // Parse the AI itinerary
  const itinerary = trip.ai_itinerary?.itinerary || [];
  const transportOptions = trip.ai_itinerary?.transportOptions || [];
  const hotelOptions = trip.ai_itinerary?.hotelOptions || [];
  const budgetBreakdown = trip.ai_itinerary?.budgetBreakdown || {};

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-orange-400 to-orange-600">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex h-full items-center justify-center text-center text-white">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Your Trip to {trip.destination}
            </h1>
            <p className="text-xl opacity-90">
              {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
            </p>
          </div>
        </div>
        <button className="absolute top-6 left-6 z-20 flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-white backdrop-blur-sm hover:bg-white/30">
          <ArrowLeft className="h-4 w-4" />
          Back to Plan
        </button>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Transport Options */}
        {transportOptions.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Transportation</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {transportOptions.map((option: any, index: number) => (
                <div key={index} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {option.type === "plane" && <Plane className="h-5 w-5 text-orange-500" />}
                      {option.type === "train" && <Train className="h-5 w-5 text-orange-500" />}
                      {option.type === "cruise" && <Anchor className="h-5 w-5 text-orange-500" />}
                      <span className="font-semibold">{option.provider}</span>
                    </div>
                    {option.badge && (
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                        {option.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{option.route}</p>
                  <p className="text-sm text-slate-600 mb-4">
                    {option.departureTime} - {option.arrivalTime} ({option.duration})
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">${option.price}</span>
                    <button className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600">
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Hotel Options */}
        {hotelOptions.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Accommodation</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {hotelOptions.map((hotel: any, index: number) => (
                <div key={index} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="aspect-video mb-4 overflow-hidden rounded-xl bg-slate-100">
                    <img
                      src={hotel.imageKeyword ? `https://source.unsplash.com/400x300/?${hotel.imageKeyword}` : "https://source.unsplash.com/400x300/?hotel"}
                      alt={hotel.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{hotel.name}</h3>
                    {hotel.badge && (
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                        {hotel.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{hotel.rating}</span>
                    </div>
                    <span className="text-sm text-slate-500">({hotel.reviewCount} reviews)</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">{hotel.location}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold">${hotel.pricePerNight}</span>
                      <span className="text-sm text-slate-500">/night</span>
                    </div>
                    <button className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600">
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Itinerary */}
        {itinerary.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Your Itinerary</h2>
            <div className="space-y-6">
              {itinerary.map((day: any, index: number) => (
                <div key={index} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">Day {day.day}: {day.title}</h3>
                    <span className="text-sm text-slate-500">{day.date}</span>
                  </div>
                  <p className="text-slate-600 mb-6">{day.description}</p>

                  <div className="space-y-4">
                    {day.activities?.map((activity: any, actIndex: number) => (
                      <div key={actIndex} className="flex gap-4">
                        <div className="flex-shrink-0 w-20 text-sm font-medium text-slate-500">
                          {activity.time}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{activity.title}</h4>
                          <p className="text-sm text-slate-600">{activity.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                            <span>{activity.duration}</span>
                            <span>{activity.location}</span>
                            <span>${activity.cost}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {day.meals && day.meals.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-slate-200">
                      <h4 className="font-semibold mb-3">Meals</h4>
                      <div className="grid gap-2 sm:grid-cols-3">
                        {day.meals.map((meal: any, mealIndex: number) => (
                          <div key={mealIndex} className="text-sm">
                            <span className="font-medium">{meal.type}:</span> {meal.suggestion} (${meal.estimatedCost})
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 pt-6 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-sm text-slate-600">Estimated daily cost</span>
                    <span className="font-semibold">${day.estimatedDayCost}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Budget Breakdown */}
        {budgetBreakdown && Object.keys(budgetBreakdown).length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Budget Breakdown</h2>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Object.entries(budgetBreakdown).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="text-2xl font-bold text-orange-500">{`$${value}`}</div>
                    <div className="text-sm text-slate-600 capitalize">{key}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="flex items-center justify-center gap-2 rounded-full bg-orange-500 px-8 py-3 font-semibold text-white hover:bg-orange-600">
            <CheckCircle2 className="h-5 w-5" />
            Book This Trip
          </button>
          <button className="flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-8 py-3 font-semibold text-slate-700 hover:bg-slate-50">
            <Share2 className="h-5 w-5" />
            Share Plan
          </button>
          <button className="flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-8 py-3 font-semibold text-slate-700 hover:bg-slate-50">
            <Heart className="h-5 w-5" />
            Save for Later
          </button>
        </div>
      </div>
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-500" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    }>
      <ResultsPageContent />
    </Suspense>
  );
}
  const searchParams = useSearchParams();
  const tripId = searchParams.get("id");

  const [trip, setTrip] = useState<TripData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tripId) {
      setError("No trip ID provided");
      setLoading(false);
      return;
    }

    const fetchTrip = async () => {
      try {
        const supabase = createClient();
        const { data, error: fetchError } = await supabase
          .from("trips")
          .select("*")
          .eq("id", tripId)
          .single();

        if (fetchError) {
          throw new Error(fetchError.message);
        }

        if (!data) {
          throw new Error("Trip not found");
        }

        setTrip(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load trip");
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [tripId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-500" />
          <p className="text-slate-600">Loading your trip plan...</p>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center max-w-md">
          <p className="text-red-600 mb-4">{error || "Trip not found"}</p>
          <a href="/plan" className="text-orange-500 hover:underline">
            Plan a new trip
          </a>
        </div>
      </div>
    );
  }

  // Parse the AI itinerary
  const itinerary = trip.ai_itinerary?.itinerary || [];
  const transportOptions = trip.ai_itinerary?.transportOptions || [];
  const hotelOptions = trip.ai_itinerary?.hotelOptions || [];
  const budgetBreakdown = trip.ai_itinerary?.budgetBreakdown || {};

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-orange-400 to-orange-600">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex h-full items-center justify-center text-center text-white">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Your Trip to {trip.destination}
            </h1>
            <p className="text-xl opacity-90">
              {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
            </p>
          </div>
        </div>
        <button className="absolute top-6 left-6 z-20 flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-white backdrop-blur-sm hover:bg-white/30">
          <ArrowLeft className="h-4 w-4" />
          Back to Plan
        </button>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Transport Options */}
        {transportOptions.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Transportation</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {transportOptions.map((option: any, index: number) => (
                <div key={index} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {option.type === "plane" && <Plane className="h-5 w-5 text-orange-500" />}
                      {option.type === "train" && <Train className="h-5 w-5 text-orange-500" />}
                      {option.type === "cruise" && <Anchor className="h-5 w-5 text-orange-500" />}
                      <span className="font-semibold">{option.provider}</span>
                    </div>
                    {option.badge && (
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                        {option.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{option.route}</p>
                  <p className="text-sm text-slate-600 mb-4">
                    {option.departureTime} - {option.arrivalTime} ({option.duration})
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">${option.price}</span>
                    <button className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600">
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Hotel Options */}
        {hotelOptions.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Accommodation</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {hotelOptions.map((hotel: any, index: number) => (
                <div key={index} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="aspect-video mb-4 overflow-hidden rounded-xl bg-slate-100">
                    <img
                      src={hotel.imageKeyword ? `https://source.unsplash.com/400x300/?${hotel.imageKeyword}` : "https://source.unsplash.com/400x300/?hotel"}
                      alt={hotel.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{hotel.name}</h3>
                    {hotel.badge && (
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                        {hotel.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{hotel.rating}</span>
                    </div>
                    <span className="text-sm text-slate-500">({hotel.reviewCount} reviews)</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">{hotel.location}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold">${hotel.pricePerNight}</span>
                      <span className="text-sm text-slate-500">/night</span>
                    </div>
                    <button className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600">
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Itinerary */}
        {itinerary.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Your Itinerary</h2>
            <div className="space-y-6">
              {itinerary.map((day: any, index: number) => (
                <div key={index} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">Day {day.day}: {day.title}</h3>
                    <span className="text-sm text-slate-500">{day.date}</span>
                  </div>
                  <p className="text-slate-600 mb-6">{day.description}</p>

                  <div className="space-y-4">
                    {day.activities?.map((activity: any, actIndex: number) => (
                      <div key={actIndex} className="flex gap-4">
                        <div className="flex-shrink-0 w-20 text-sm font-medium text-slate-500">
                          {activity.time}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{activity.title}</h4>
                          <p className="text-sm text-slate-600">{activity.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                            <span>{activity.duration}</span>
                            <span>{activity.location}</span>
                            <span>${activity.cost}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {day.meals && day.meals.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-slate-200">
                      <h4 className="font-semibold mb-3">Meals</h4>
                      <div className="grid gap-2 sm:grid-cols-3">
                        {day.meals.map((meal: any, mealIndex: number) => (
                          <div key={mealIndex} className="text-sm">
                            <span className="font-medium">{meal.type}:</span> {meal.suggestion} (${meal.estimatedCost})
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 pt-6 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-sm text-slate-600">Estimated daily cost</span>
                    <span className="font-semibold">${day.estimatedDayCost}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Budget Breakdown */}
        {budgetBreakdown && Object.keys(budgetBreakdown).length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Budget Breakdown</h2>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Object.entries(budgetBreakdown).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="text-2xl font-bold text-orange-500">{`$${value}`}</div>
                    <div className="text-sm text-slate-600 capitalize">{key}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="flex items-center justify-center gap-2 rounded-full bg-orange-500 px-8 py-3 font-semibold text-white hover:bg-orange-600">
            <CheckCircle2 className="h-5 w-5" />
            Book This Trip
          </button>
          <button className="flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-8 py-3 font-semibold text-slate-700 hover:bg-slate-50">
            <Share2 className="h-5 w-5" />
            Share Plan
          </button>
          <button className="flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-8 py-3 font-semibold text-slate-700 hover:bg-slate-50">
            <Heart className="h-5 w-5" />
            Save for Later
          </button>
        </div>
      </div>
    </main>
  );
}