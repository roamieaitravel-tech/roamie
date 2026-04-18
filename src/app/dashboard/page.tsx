"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import {
  Plane,
  DollarSign,
  Users,
  Star,
  Map,
  Plus,
  MessageCircle,
} from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import StatsCard from "@/components/dashboard/StatsCard";
import TripCard from "@/components/dashboard/TripCard";
import Image from "next/image";
import type { User } from "@supabase/supabase-js";

interface Trip {
  id: string;
  destination: string;
  country: string;
  start_date: string;
  end_date: string;
  total_budget: number;
  status: "planning" | "booked" | "ongoing";
  destination_image: string;
  transport_type: "plane" | "train" | "ship";
  total_cost: number;
}

interface Match {
  id: string;
  name: string;
  destination: string;
  match_percentage: number;
  avatar_url?: string;
}

interface Stats {
  totalTrips: number;
  totalSaved: number;
  totalMatches: number;
  vibeScore: number;
}

export default function Dashboard(): React.JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalTrips: 0,
    totalSaved: 0,
    totalMatches: 0,
    vibeScore: 0,
  });
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async (): Promise<void> => {
      try {
        const supabase = createClient();

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        setUser(user ?? null);

        // Get user's trips (mock data for now - replace with real query)
        // const { data: tripsData, error: tripsError } = await supabase
        //   .from('trips')
        //   .select('*')
        //   .eq('user_id', user.id)
        //   .limit(6);
        // if (tripsError) throw tripsError;

        // Mock trips data
        const mockTrips: Trip[] = [
          {
            id: "1",
            destination: "Bali",
            country: "Indonesia",
            start_date: "2024-06-15",
            end_date: "2024-06-22",
            total_budget: 1500,
            status: "planning",
            destination_image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&q=80",
            transport_type: "plane",
            total_cost: 30,
          },
          {
            id: "2",
            destination: "Paris",
            country: "France",
            start_date: "2024-07-10",
            end_date: "2024-07-17",
            total_budget: 2200,
            status: "booked",
            destination_image: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&q=80",
            transport_type: "plane",
            total_cost: 75,
          },
        ];
        setTrips(mockTrips);

        // Get recent matches (mock data)
        const mockMatches: Match[] = [
          {
            id: "1",
            name: "Alex M.",
            destination: "Bali",
            match_percentage: 94,
            avatar_url: undefined,
          },
          {
            id: "2",
            name: "Sarah J.",
            destination: "Paris",
            match_percentage: 89,
            avatar_url: undefined,
          },
          {
            id: "3",
            name: "Mike R.",
            destination: "Tokyo",
            match_percentage: 87,
            avatar_url: undefined,
          },
        ];
        setMatches(mockMatches);

        // Calculate stats
        const calculatedStats: Stats = {
          totalTrips: mockTrips.length,
          totalSaved: mockTrips.reduce((sum, trip) => sum + (trip.total_budget * 0.25), 0), // Mock savings
          totalMatches: mockMatches.length,
          vibeScore: 85, // Mock vibe score
        };
        setStats(calculatedStats);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <Header />
        <main className="ml-0 md:ml-64 pt-16">
          <div className="p-6 space-y-6">
            {/* Skeleton loading */}
            <div className="h-8 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-white rounded-2xl animate-pulse" />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activeItem="Dashboard" />
      <Header onMobileMenuToggle={(): void => setMobileMenuOpen(!mobileMenuOpen)} />

      <main className="ml-0 md:ml-64 pt-16">
        <div className="p-6 space-y-8">
          {/* Welcome Section */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {getGreeting()}, {user?.user_metadata?.full_name ?? "Traveler"}!
            </h1>
            <p className="text-gray-600 mt-2">
              Here&apos;s what&apos;s happening with your travels
            </p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              icon={Plane}
              title="Total Trips"
              value={stats.totalTrips.toString()}
              subtitle="+2 this month"
              iconColor="text-orange-600"
              iconBgColor="bg-orange-100"
            />
            <StatsCard
              icon={DollarSign}
              title="Total Saved"
              value={`$${stats.totalSaved.toFixed(0)}`}
              subtitle="vs average prices"
              iconColor="text-blue-600"
              iconBgColor="bg-blue-100"
            />
            <StatsCard
              icon={Users}
              title="Travel Matches"
              value={stats.totalMatches.toString()}
              subtitle="people matched"
              iconColor="text-green-600"
              iconBgColor="bg-green-100"
            />
            <StatsCard
              icon={Star}
              title="Vibe Score"
              value={`${stats.vibeScore}/100`}
              subtitle="Your match quality"
              iconColor="text-purple-600"
              iconBgColor="bg-purple-100"
            />
          </div>

          {/* My Trips Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Trips</h2>
              <button className="bg-[#FF6B35] text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Trip
              </button>
            </div>

            {trips.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                <Map className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No trips yet</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Start planning your first adventure with Roamie AI
                </p>
                <button className="bg-[#FF6B35] text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors">
                  Plan Your First Trip
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trips.map((trip) => (
                  <TripCard
                    key={trip.id}
                    id={trip.id}
                    destination={trip.destination}
                    country={trip.country}
                    startDate={trip.start_date}
                    endDate={trip.end_date}
                    budget={trip.total_budget}
                    status={trip.status}
                    imageUrl={trip.destination_image}
                    transportTypes={[trip.transport_type]}
                    budgetUsed={trip.total_cost}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Recent Matches Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Potential Travel Matches</h2>

            {matches.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No matches yet</h3>
                <p className="text-gray-600">
                  Complete your profile to find travel companions
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {matches.map((match) => (
                  <div key={match.id} className="bg-white rounded-2xl p-6 border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold overflow-hidden">
                        {match.avatar_url ? (
                          <Image
                            src={match.avatar_url}
                            alt={match.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          match.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{match.name}</p>
                        <p className="text-sm text-gray-600">{match.destination}</p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Match</span>
                        <span className="text-green-600 font-medium">{match.match_percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${match.match_percentage}%` }}
                        />
                      </div>
                    </div>
                    <button className="w-full bg-[#FF6B35] text-white py-2 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Say Hello
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Assistant Widget */}
          <div className="bg-gradient-to-r from-[#004E89] to-[#0077B6] rounded-2xl p-8 text-white">
            <div className="max-w-2xl">
              <h3 className="text-2xl font-bold mb-2">Ask Roamie AI</h3>
              <p className="text-white/80 mb-6">
                Plan your next trip in seconds with our AI assistant
              </p>
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Where do you want to go?"
                  className="flex-1 bg-white/10 border border-white/20 rounded-full px-6 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
                <button className="bg-[#FF6B35] text-white px-6 py-3 rounded-full font-medium hover:bg-orange-600 transition-colors">
                  Plan →
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}