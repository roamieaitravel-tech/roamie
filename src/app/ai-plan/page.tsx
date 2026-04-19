"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Loader,
  MapPin,
  DollarSign,
  Calendar,
  Users,
  Download,
  Share2,
  Heart,
  Plane,
  Hotel,
  Train,
  Waves,
  MessageCircle,
  ChevronDown,
  Home,
  Settings,
  LogOut,
  Sparkles,
  TrendingDown,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface TripPlan {
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  travelers: number;
  style: string;
  description: string;
  flights?: FlightOption[];
  hotels?: HotelOption[];
  itinerary?: ItineraryDay[];
  totalCost?: number;
  savings?: number;
}

interface FlightOption {
  id: string;
  from: string;
  to: string;
  airline: string;
  price: number;
  duration: string;
  stops: number;
  departure: string;
  arrival: string;
  class: "economy" | "business" | "first";
}

interface HotelOption {
  id: string;
  name: string;
  city: string;
  price: number;
  rating: number;
  nights: number;
  amenities: string[];
  image: string;
}

interface ItineraryDay {
  day: number;
  title: string;
  activities: string[];
  meals: string[];
  transport: string;
  cost: number;
}

export default function AIPlanPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [savedTrips, setSavedTrips] = useState<TripPlan[]>([]);
  const [showSavedTrips, setShowSavedTrips] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Load initial greeting
    setMessages([
      {
        id: "1",
        role: "assistant",
        content:
          "Hello! I'm Roamie, your AI travel planner. Tell me about your dream trip and I'll create the perfect itinerary with the best deals on flights, hotels, and experiences. What are you thinking?",
        timestamp: new Date(),
      },
    ]);
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Call OpenAI API via your backend
      const response = await fetch("/api/ai-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          conversationHistory: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) throw new Error("Failed to plan trip");

      const data = await response.json();

      // Add AI response
      const aiMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      // If we got a trip plan, update it
      if (data.tripPlan) {
        setTripPlan(data.tripPlan);
      }
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content:
          "Sorry, I encountered an error planning your trip. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTrip = async () => {
    if (!tripPlan || !supabase) return;

    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        alert("Please login to save trips");
        return;
      }

      const { error } = await supabase.from("trips").insert([
        {
          user_id: authData.user.id,
          destination: tripPlan.destination,
          start_date: tripPlan.startDate,
          end_date: tripPlan.endDate,
          budget: tripPlan.budget,
          travelers: tripPlan.travelers,
          trip_style: tripPlan.style,
          ai_plan: tripPlan,
          status: "planning",
        },
      ]);

      if (error) throw error;

      setSavedTrips([...savedTrips, tripPlan]);
      alert("Trip saved successfully!");
    } catch (error) {
      console.error("Error saving trip:", error);
      alert("Failed to save trip");
    }
  };

  const handleBookNow = async () => {
    if (!tripPlan || !supabase) return;

    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        alert("Please login to book trips");
        return;
      }

      // Save the trip first
      const { error } = await supabase.from("trips").insert([
        {
          user_id: authData.user.id,
          destination: tripPlan.destination,
          start_date: tripPlan.startDate,
          end_date: tripPlan.endDate,
          budget: tripPlan.budget,
          travelers: tripPlan.travelers,
          trip_style: tripPlan.style,
          ai_plan: tripPlan,
          status: "booking",
        },
      ]);

      if (error) throw error;

      // Redirect to checkout
      window.location.href = "/checkout";
    } catch (error) {
      console.error("Error booking trip:", error);
      alert("Failed to proceed to checkout");
    }
  };

  return (
    <div className="h-screen flex bg-gradient-to-br from-slate-50 to-slate-100">
      {/* ══════════════════════════════════ SIDEBAR: CHAT ══════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, x: -400 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full md:w-96 bg-white border-r border-gray-200 flex flex-col shadow-sm"
      >
        {/* Header */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-[#FF6B35] flex items-center justify-center">
                <Sparkles size={18} className="text-white" />
              </div>
              <span className="font-bold text-lg">roamie</span>
            </Link>
          </div>

          <button className="w-full px-4 py-2 rounded-lg bg-[#FF6B35] text-white font-semibold flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors">
            <span className="text-base">+</span>
            New Trip
          </button>
        </div>

        {/* Saved Trips Toggle */}
        {savedTrips.length > 0 && (
          <div className="border-b border-gray-200 p-4">
            <button
              onClick={() => setShowSavedTrips(!showSavedTrips)}
              className="w-full flex items-center justify-between text-sm font-semibold text-gray-700 hover:text-gray-900"
            >
              <span>Previous Trips ({savedTrips.length})</span>
              <ChevronDown
                size={18}
                className={`transition-transform ${
                  showSavedTrips ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {showSavedTrips && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 space-y-2"
                >
                  {savedTrips.map((trip, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => setTripPlan(trip)}
                      className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                      whileHover={{ x: 4 }}
                    >
                      <p className="font-semibold text-sm text-gray-900">
                        {trip.destination}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {trip.startDate} • ${trip.budget}
                      </p>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                    message.role === "user"
                      ? "bg-[#FF6B35] text-white rounded-br-none"
                      : "bg-gray-100 text-gray-900 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.role === "user"
                        ? "text-white/60"
                        : "text-gray-500"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </motion.div>
            ))}

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-2 items-center"
              >
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <Loader size={16} className="animate-spin text-gray-600" />
                </div>
                <p className="text-sm text-gray-500">Roamie is thinking...</p>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your dream trip..."
              className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] text-sm"
              disabled={loading}
            />
            <motion.button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-10 h-10 rounded-full bg-[#FF6B35] text-white flex items-center justify-center hover:bg-orange-600 disabled:opacity-50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? (
                <Loader size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </motion.button>
          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-3 bg-gray-50 flex gap-2 text-xs text-gray-600">
          <Home size={16} />
          <span>Ready to book? Save your trip and proceed to checkout</span>
        </div>
      </motion.div>

      {/* ══════════════════════════════════ MAIN CONTENT ══════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="hidden md:flex flex-1 flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="border-b border-gray-200 bg-white p-6 flex items-center justify-between shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Trip Planner</h1>
            <p className="text-sm text-gray-600 mt-1">
              AI-powered itineraries with real-time pricing
            </p>
          </div>
          <div className="flex gap-3">
            <motion.button
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
            >
              <Settings size={18} />
              <span className="hidden sm:inline">Settings</span>
            </motion.button>
            <motion.button
              className="px-4 py-2 rounded-lg bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition-colors flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </motion.button>
          </div>
        </div>

        {/* Content */}
        {tripPlan ? (
          <div className="flex-1 overflow-y-auto">
            {/* Trip Overview */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-[#FF6B35]/10 to-transparent">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      {tripPlan.destination}
                    </h2>
                    <div className="flex gap-6 mt-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>
                          {tripPlan.startDate} - {tripPlan.endDate}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={16} />
                        <span>{tripPlan.travelers} travelers</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign size={16} />
                        <span>${tripPlan.budget} budget</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <motion.button
                      onClick={handleSaveTrip}
                      className="px-6 py-2 border-2 border-[#FF6B35] text-[#FF6B35] rounded-full font-semibold hover:bg-orange-50 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Save Trip
                    </motion.button>
                    <motion.button
                      onClick={handleBookNow}
                      className="px-6 py-2 bg-[#FF6B35] text-white rounded-full font-semibold hover:bg-orange-600 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Book Now
                    </motion.button>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-4 mt-6">
                  <StatCard
                    icon={<Plane size={20} />}
                    label="Flights"
                    value={tripPlan.flights?.length || 0}
                  />
                  <StatCard
                    icon={<Hotel size={20} />}
                    label="Hotels"
                    value={tripPlan.hotels?.length || 0}
                  />
                  <StatCard
                    icon={<TrendingDown size={20} />}
                    label="Estimated Savings"
                    value={`$${tripPlan.savings || 0}`}
                  />
                  <StatCard
                    icon={<DollarSign size={20} />}
                    label="Total Cost"
                    value={`$${tripPlan.totalCost || tripPlan.budget}`}
                    highlight
                  />
                </div>
              </motion.div>
            </div>

            {/* Flights Section */}
            {tripPlan.flights && tripPlan.flights.length > 0 && (
              <TripSection title="Flights" icon={<Plane size={20} />}>
                <div className="space-y-4">
                  {tripPlan.flights.map((flight, idx) => (
                    <FlightCard key={idx} flight={flight} />
                  ))}
                </div>
              </TripSection>
            )}

            {/* Hotels Section */}
            {tripPlan.hotels && tripPlan.hotels.length > 0 && (
              <TripSection title="Hotels" icon={<Hotel size={20} />}>
                <div className="grid grid-cols-2 gap-4">
                  {tripPlan.hotels.map((hotel, idx) => (
                    <HotelCard key={idx} hotel={hotel} />
                  ))}
                </div>
              </TripSection>
            )}

            {/* Itinerary Section */}
            {tripPlan.itinerary && tripPlan.itinerary.length > 0 && (
              <TripSection
                title="Day-by-Day Itinerary"
                icon={<Calendar size={20} />}
              >
                <div className="space-y-4">
                  {tripPlan.itinerary.map((day) => (
                    <ItineraryCard key={day.day} day={day} />
                  ))}
                </div>
              </TripSection>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <MapPin size={40} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Start Planning Your Trip
              </h3>
              <p className="text-gray-600 max-w-sm mx-auto">
                Describe your dream destination, dates, budget, and travel style
                in the chat. I'll create the perfect itinerary for you.
              </p>
            </motion.div>
          </div>
        )}
      </motion.div>

      {/* ══════════════════════════════════ RIGHT SIDEBAR: BOOKING SUMMARY ══════════════════════════════════ */}
      {tripPlan && (
        <motion.div
          initial={{ opacity: 0, x: 400 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden lg:flex flex-col w-80 border-l border-gray-200 bg-white shadow-sm overflow-hidden"
        >
          {/* Header */}
          <div className="border-b border-gray-200 p-4">
            <h3 className="font-bold text-lg text-gray-900">Trip Summary</h3>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Destination */}
            <SummaryItem
              icon={<MapPin size={18} />}
              label="Destination"
              value={tripPlan.destination}
            />

            {/* Dates */}
            <SummaryItem
              icon={<Calendar size={18} />}
              label="Dates"
              value={`${tripPlan.startDate} - ${tripPlan.endDate}`}
            />

            {/* Travelers */}
            <SummaryItem
              icon={<Users size={18} />}
              label="Travelers"
              value={`${tripPlan.travelers} person${tripPlan.travelers > 1 ? "s" : ""}`}
            />

            {/* Travel Style */}
            <SummaryItem
              icon={<Sparkles size={18} />}
              label="Travel Style"
              value={tripPlan.style}
            />

            {/* Divider */}
            <div className="border-t border-gray-200 my-4" />

            {/* Budget Breakdown */}
            <div>
              <h4 className="font-semibold text-sm text-gray-900 mb-3">
                Budget Breakdown
              </h4>
              <div className="space-y-2 text-sm">
                <CostItem
                  label="Flights"
                  amount={
                    tripPlan.flights?.reduce((sum, f) => sum + f.price, 0) || 0
                  }
                />
                <CostItem
                  label="Accommodation"
                  amount={
                    tripPlan.hotels?.reduce((sum, h) => sum + h.price, 0) || 0
                  }
                />
                <CostItem label="Activities" amount={300} />
                <CostItem label="Food" amount={200} />
                <CostItem label="Transport" amount={150} />
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">
                      Total Estimated
                    </span>
                    <span className="text-lg font-bold text-[#FF6B35]">
                      ${tripPlan.totalCost || tripPlan.budget}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Savings Badge */}
            {tripPlan.savings && tripPlan.savings > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-200 rounded-lg p-3 text-center"
              >
                <p className="text-2xl font-bold text-green-600">
                  ${tripPlan.savings}
                </p>
                <p className="text-xs text-green-700 mt-1">Estimated Savings</p>
              </motion.div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="border-t border-gray-200 p-4 bg-gray-50 space-y-2">
            <motion.button
              onClick={handleBookNow}
              className="w-full px-4 py-3 bg-[#FF6B35] text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Sparkles size={18} />
              Book Now
            </motion.button>

            <motion.button
              onClick={handleSaveTrip}
              className="w-full px-4 py-2 border-2 border-[#FF6B35] text-[#FF6B35] rounded-lg font-semibold hover:bg-orange-50 transition-colors flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Heart size={18} />
              Save Trip
            </motion.button>

            <motion.button
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Share2 size={18} />
              Share
            </motion.button>

            <motion.button
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download size={18} />
              Export PDF
            </motion.button>

            <motion.button
              className="w-full px-4 py-2 bg-[#004E89] text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Proceed to Checkout</span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ══════════════════════════════════ COMPONENTS ══════════════════════════════════

function StatCard({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-3 rounded-lg border ${
        highlight
          ? "bg-[#FF6B35]/20 border-[#FF6B35]/50"
          : "bg-gray-50 border-gray-200"
      }`}
    >
      <div className={`text-lg ${highlight ? "text-[#FF6B35]" : "text-gray-600"}`}>
        {icon}
      </div>
      <p className="text-xs text-gray-600 mt-1">{label}</p>
      <p
        className={`text-lg font-bold ${
          highlight ? "text-[#FF6B35]" : "text-gray-900"
        }`}
      >
        {value}
      </p>
    </motion.div>
  );
}

function TripSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="border-b border-gray-200 p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="text-[#FF6B35]">{icon}</div>
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

function FlightCard({ flight }: { flight: FlightOption }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
      whileHover={{ y: -4 }}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="font-semibold text-gray-900">
            {flight.from} → {flight.to}
          </p>
          <p className="text-sm text-gray-600 mt-1">{flight.airline}</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-[#FF6B35]">${flight.price}</p>
          <p className="text-xs text-gray-500">{flight.class}</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600 border-t border-gray-100 pt-3">
        <div>
          <p className="font-semibold text-gray-900">{flight.departure}</p>
          <p className="text-xs">Departure</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-0.5 bg-gradient-to-r from-[#FF6B35] to-transparent" />
          <span className="text-xs text-gray-500">{flight.stops} stops</span>
          <div className="flex-1 h-0.5 bg-gradient-to-l from-[#FF6B35] to-transparent" />
        </div>
        <div className="text-right">
          <p className="font-semibold text-gray-900">{flight.arrival}</p>
          <p className="text-xs">Arrival</p>
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-3">Duration: {flight.duration}</p>
    </motion.div>
  );
}

function HotelCard({ hotel }: { hotel: HotelOption }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
      whileHover={{ y: -4 }}
    >
      <div className="relative h-40 w-full bg-gray-300">
        <Image
          src={hotel.image}
          alt={hotel.name}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2 bg-white px-3 py-1 rounded-full text-sm font-semibold text-[#FF6B35]">
          ${hotel.price}/night
        </div>
      </div>

      <div className="p-3">
        <h4 className="font-semibold text-gray-900">{hotel.name}</h4>
        <p className="text-xs text-gray-600 mt-1">{hotel.city}</p>

        <div className="flex items-center gap-1 mt-2">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`text-xs ${
                i < Math.floor(hotel.rating) ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              ★
            </span>
          ))}
          <span className="text-xs text-gray-600 ml-1">
            {hotel.rating.toFixed(1)}
          </span>
        </div>

        <p className="text-xs text-gray-600 mt-2">
          {hotel.nights} nights • {hotel.amenities.slice(0, 2).join(", ")}
        </p>
      </div>
    </motion.div>
  );
}

function ItineraryCard({ day }: { day: ItineraryDay }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      onClick={() => setExpanded(!expanded)}
      className="border border-gray-200 rounded-lg cursor-pointer hover:shadow-md transition-all"
    >
      <div className="p-4 flex justify-between items-center bg-gradient-to-r from-gray-50 to-transparent">
        <div>
          <p className="font-bold text-lg text-gray-900">Day {day.day}</p>
          <p className="text-sm text-gray-600">{day.title}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-[#FF6B35]">${day.cost}</p>
          <ChevronDown
            size={20}
            className={`text-gray-600 transition-transform mt-1 ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-200 p-4 bg-gray-50"
          >
            <div className="space-y-3">
              {day.activities.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">
                    Activities
                  </p>
                  <ul className="space-y-1">
                    {day.activities.map((activity, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex gap-2">
                        <span className="text-[#FF6B35]">•</span>
                        <span>{activity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {day.meals.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">
                    Meals
                  </p>
                  <ul className="space-y-1">
                    {day.meals.map((meal, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex gap-2">
                        <span className="text-[#FF6B35]">•</span>
                        <span>{meal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {day.transport && (
                <div>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-900">Transport:</span>{" "}
                    {day.transport}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SummaryItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-[#FF6B35] mt-1">{icon}</div>
      <div>
        <p className="text-xs text-gray-600">{label}</p>
        <p className="text-sm font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function CostItem({ label, amount }: { label: string; amount: number }) {
  return (
    <div className="flex justify-between items-center text-gray-600">
      <span>{label}</span>
      <span className="font-semibold text-gray-900">${amount}</span>
    </div>
  );
}
