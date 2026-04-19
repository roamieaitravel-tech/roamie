"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  DollarSign,
  Plane,
  Hotel,
  MapPin,
  Users,
  Calendar,
  Shield,
  Check,
  AlertCircle,
  Download,
  Mail,
  Lock,
  CreditCard,
  Loader,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface BookingSummary {
  flights: {
    id: string;
    from: string;
    to: string;
    price: number;
    date: string;
    airline: string;
  }[];
  hotels: {
    id: string;
    name: string;
    price: number;
    nights: number;
    dates: string;
  }[];
  activities: {
    id: string;
    name: string;
    price: number;
    date: string;
  }[];
  insurance: boolean;
  insurancePrice: number;
}

type CheckoutStep = "review" | "details" | "payment" | "confirmation";

export default function CheckoutPage() {
  const [step, setStep] = useState<CheckoutStep>("review");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  // Mock booking data - in real app this would come from trip plan
  const bookingSummary: BookingSummary = {
    flights: [
      {
        id: "FL1",
        from: "NYC",
        to: "BKK",
        price: 650,
        date: "2025-06-15",
        airline: "Thai Airways",
      },
      {
        id: "FL2",
        from: "BKK",
        to: "NYC",
        price: 650,
        date: "2025-06-22",
        airline: "Thai Airways",
      },
    ],
    hotels: [
      {
        id: "HT1",
        name: "Bangkok Riverside Resort",
        price: 85,
        nights: 7,
        dates: "Jun 17 - Jun 24",
      },
    ],
    activities: [
      {
        id: "AC1",
        name: "Grand Palace Tour",
        price: 45,
        date: "2025-06-18",
      },
      { id: "AC2", name: "Muay Thai Class", price: 30, date: "2025-06-19" },
      {
        id: "AC3",
        name: "River Cruise",
        price: 50,
        date: "2025-06-20",
      },
    ],
    insurance: false,
    insurancePrice: 0,
  };

  const subtotal =
    bookingSummary.flights.reduce((sum, f) => sum + f.price, 0) +
    bookingSummary.hotels.reduce((sum, h) => sum + h.price * h.nights, 0) +
    bookingSummary.activities.reduce((sum, a) => sum + a.price, 0);

  const insurance = bookingSummary.insurance ? bookingSummary.insurancePrice : 0;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = subtotal + insurance + tax;

  const handleProcessPayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        setError("Please login to complete booking");
        return;
      }

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Move to confirmation
      setStep("confirmation");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/ai-plan" className="flex items-center gap-2 group">
            <ChevronLeft size={24} className="text-gray-600 group-hover:text-gray-900" />
            <span className="font-semibold text-gray-900">Back to Trip</span>
          </Link>

          <div className="flex items-center gap-8">
            {/* Progress Steps */}
            {(["review", "details", "payment", "confirmation"] as CheckoutStep[]).map(
              (s, idx, arr) => (
                <div key={s} className="flex items-center gap-2">
                  <motion.div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                      step === s
                        ? "bg-[#FF6B35] text-white"
                        : arr.indexOf(step) > idx
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-600"
                    }`}
                    whileHover={{ scale: 1.1 }}
                  >
                    {arr.indexOf(step) > idx ? (
                      <Check size={18} />
                    ) : (
                      idx + 1
                    )}
                  </motion.div>
                  <span className={`hidden sm:inline text-sm font-semibold ${
                    step === s ? "text-gray-900" : "text-gray-600"
                  }`}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </span>
                  {idx < arr.length - 1 && (
                    <div className="w-8 h-0.5 bg-gray-300 hidden sm:block" />
                  )}
                </div>
              )
            )}
          </div>

          <div className="w-24" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Steps */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {step === "review" && (
              <ReviewStep
                key="review"
                bookingSummary={bookingSummary}
                subtotal={subtotal}
                insurance={insurance}
                tax={tax}
                total={total}
                onNext={() => setStep("details")}
              />
            )}

            {step === "details" && (
              <DetailsStep
                key="details"
                onNext={() => setStep("payment")}
                onBack={() => setStep("review")}
              />
            )}

            {step === "payment" && (
              <PaymentStep
                key="payment"
                total={total}
                loading={loading}
                error={error}
                onPayment={handleProcessPayment}
                onBack={() => setStep("details")}
              />
            )}

            {step === "confirmation" && (
              <ConfirmationStep key="confirmation" total={total} />
            )}
          </AnimatePresence>
        </div>

        {/* Right Column - Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-8">
            <div className="bg-gradient-to-r from-[#FF6B35] to-orange-500 px-6 py-4">
              <h3 className="font-bold text-lg text-white">Order Summary</h3>
            </div>

            <div className="p-6 space-y-6">
              {/* Flights */}
              <div>
                <div className="flex items-center gap-2 font-semibold text-gray-900 mb-3">
                  <Plane size={18} />
                  Flights ({bookingSummary.flights.length})
                </div>
                <div className="space-y-2">
                  {bookingSummary.flights.map((flight) => (
                    <div
                      key={flight.id}
                      className="flex justify-between text-sm text-gray-600"
                    >
                      <span>
                        {flight.from} → {flight.to}
                      </span>
                      <span className="font-semibold text-gray-900">
                        ${flight.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hotels */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center gap-2 font-semibold text-gray-900 mb-3">
                  <Hotel size={18} />
                  Hotels ({bookingSummary.hotels.length})
                </div>
                <div className="space-y-2">
                  {bookingSummary.hotels.map((hotel) => (
                    <div key={hotel.id} className="text-sm text-gray-600">
                      <div className="flex justify-between mb-1">
                        <span>{hotel.name}</span>
                        <span className="font-semibold text-gray-900">
                          ${hotel.price * hotel.nights}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        ${hotel.price}/night × {hotel.nights} nights
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activities */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center gap-2 font-semibold text-gray-900 mb-3">
                  <MapPin size={18} />
                  Activities ({bookingSummary.activities.length})
                </div>
                <div className="space-y-2">
                  {bookingSummary.activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex justify-between text-sm text-gray-600"
                    >
                      <span>{activity.name}</span>
                      <span className="font-semibold text-gray-900">
                        ${activity.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Costs */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                {insurance > 0 && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Travel Insurance</span>
                    <span>${insurance.toFixed(2)}</span>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-[#FF6B35]">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Security Badge */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
                <Shield size={18} className="text-blue-600" />
                <span className="text-xs text-blue-900">
                  Secure checkout powered by Stripe
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ══════════════════════════════════ STEPS ══════════════════════════════════

function ReviewStep({
  bookingSummary,
  subtotal,
  insurance,
  tax,
  total,
  onNext,
}: {
  bookingSummary: BookingSummary;
  subtotal: number;
  insurance: number;
  tax: number;
  total: number;
  onNext: () => void;
}) {
  const [insuranceAdded, setInsuranceAdded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Your Bookings</h2>

        {/* Flights */}
        <div className="mb-8 pb-8 border-b border-gray-200">
          <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
            <Plane size={20} />
            Flights
          </h3>
          <div className="space-y-4">
            {bookingSummary.flights.map((flight, idx) => (
              <motion.div
                key={flight.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {flight.from} → {flight.to}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{flight.airline}</p>
                    <p className="text-sm text-gray-600">{flight.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-[#FF6B35]">
                      ${flight.price}
                    </p>
                    <button className="text-sm text-blue-600 hover:text-blue-700 mt-2">
                      Change
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Hotels */}
        <div className="mb-8 pb-8 border-b border-gray-200">
          <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
            <Hotel size={20} />
            Hotels
          </h3>
          <div className="space-y-4">
            {bookingSummary.hotels.map((hotel, idx) => (
              <motion.div
                key={hotel.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">{hotel.name}</p>
                    <p className="text-sm text-gray-600 mt-1">{hotel.dates}</p>
                    <p className="text-sm text-gray-600">
                      {hotel.nights} nights
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-[#FF6B35]">
                      ${hotel.price * hotel.nights}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      ${hotel.price}/night
                    </p>
                    <button className="text-sm text-blue-600 hover:text-blue-700 mt-2">
                      Change
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Insurance */}
        <div className="mb-8 pb-8 border-b border-gray-200">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-900">Travel Insurance</h3>
              <p className="text-sm text-gray-600 mt-2">
                Protect your trip against cancellations, delays, and emergencies.
              </p>
              <div className="mt-3 space-y-1 text-sm text-gray-700">
                <div className="flex gap-2">
                  <Check size={16} className="text-green-600 flex-shrink-0" />
                  <span>Coverage up to $5,000</span>
                </div>
                <div className="flex gap-2">
                  <Check size={16} className="text-green-600 flex-shrink-0" />
                  <span>Cancellation refund</span>
                </div>
                <div className="flex gap-2">
                  <Check size={16} className="text-green-600 flex-shrink-0" />
                  <span>24/7 emergency support</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="text-2xl font-bold text-[#FF6B35]">
                {insuranceAdded ? "$49" : "Free"}
              </p>
              <motion.button
                onClick={() => setInsuranceAdded(!insuranceAdded)}
                className={`mt-4 px-4 py-2 rounded-lg font-semibold transition-colors ${
                  insuranceAdded
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : "bg-[#FF6B35] text-white hover:bg-orange-600"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {insuranceAdded ? "Added" : "Add Insurance"}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-end">
          <motion.button
            className="px-6 py-3 border border-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Save for Later
          </motion.button>
          <motion.button
            onClick={onNext}
            className="px-6 py-3 bg-[#FF6B35] text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Continue to Details
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function DetailsStep({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.firstName && formData.lastName && formData.email) {
      onNext();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl shadow-lg p-8"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Passenger Details</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              First Name
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Last Name
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none"
          />
        </div>

        {/* Notifications */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="font-semibold text-gray-900 mb-4">Notifications</h3>
          <div className="space-y-3">
            {[
              {
                id: "bookingConfirmation",
                label: "Booking confirmation",
              },
              {
                id: "reminders",
                label: "Trip reminders and updates",
              },
              {
                id: "deals",
                label: "Special travel deals and offers",
              },
            ].map((option) => (
              <label key={option.id} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={
                    option.id === "bookingConfirmation" ||
                    option.id === "reminders"
                  }
                  className="w-4 h-4 rounded border-gray-300 text-[#FF6B35] focus:ring-[#FF6B35]"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-end pt-6 border-t border-gray-200">
          <motion.button
            type="button"
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Back
          </motion.button>
          <motion.button
            type="submit"
            className="px-6 py-3 bg-[#FF6B35] text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Continue to Payment
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}

function PaymentStep({
  total,
  loading,
  error,
  onPayment,
  onBack,
}: {
  total: number;
  loading: boolean;
  error: string | null;
  onPayment: () => void;
  onBack: () => void;
}) {
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiry: "",
    cvc: "",
    name: "",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3"
          >
            <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
            <span className="text-sm text-red-800">{error}</span>
          </motion.div>
        )}

        {/* Card Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Cardholder Name
            </label>
            <input
              type="text"
              value={cardData.name}
              onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] outline-none"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Card Number
            </label>
            <div className="relative">
              <input
                type="text"
                value={cardData.cardNumber}
                onChange={(e) =>
                  setCardData({
                    ...cardData,
                    cardNumber: e.target.value.replace(/\D/g, "").slice(0, 16),
                  })
                }
                maxLength={16}
                placeholder="1234 5678 9012 3456"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] outline-none font-mono"
              />
              <CreditCard size={20} className="absolute right-4 top-3.5 text-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Expiry
              </label>
              <input
                type="text"
                value={cardData.expiry}
                onChange={(e) =>
                  setCardData({ ...cardData, expiry: e.target.value.slice(0, 5) })
                }
                placeholder="MM/YY"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                CVC
              </label>
              <input
                type="text"
                value={cardData.cvc}
                onChange={(e) =>
                  setCardData({
                    ...cardData,
                    cvc: e.target.value.replace(/\D/g, "").slice(0, 3),
                  })
                }
                maxLength={3}
                placeholder="123"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* Security Info */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
          <Lock size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-semibold">Your payment is secure</p>
            <p className="text-xs mt-1">
              This is a demonstration. Real payments are processed through Stripe.
            </p>
          </div>
        </div>

        {/* Terms */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 rounded border-gray-300 text-[#FF6B35] focus:ring-[#FF6B35] mt-1"
            />
            <span className="text-sm text-gray-700">
              I agree to the{" "}
              <a href="#" className="text-[#FF6B35] hover:underline font-semibold">
                booking terms
              </a>{" "}
              and{" "}
              <a href="#" className="text-[#FF6B35] hover:underline font-semibold">
                cancellation policy
              </a>
            </span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-end pt-6 border-t border-gray-200 mt-6">
          <motion.button
            onClick={onBack}
            disabled={loading}
            className="px-6 py-3 border border-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Back
          </motion.button>
          <motion.button
            onClick={onPayment}
            disabled={loading || !cardData.cardNumber || !cardData.cvc}
            className="px-8 py-3 bg-[#FF6B35] text-white rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50 flex items-center gap-2 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading && <Loader size={18} className="animate-spin" />}
            {loading ? "Processing..." : `Pay $${total.toFixed(2)}`}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function ConfirmationStep({ total }: { total: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-6"
    >
      {/* Success Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl shadow-lg p-12 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Check size={40} className="text-white" />
        </motion.div>

        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Booking Confirmed!
        </h2>
        <p className="text-lg text-gray-600 mb-2">Your trip is ready to go</p>

        <div className="my-8 p-4 bg-white rounded-lg border-2 border-green-300">
          <p className="text-sm text-gray-600 mb-1">Booking Reference</p>
          <p className="text-3xl font-bold text-[#FF6B35] font-mono">ROA-2025-78392</p>
        </div>

        <p className="text-lg font-semibold text-gray-900">
          Total Paid: <span className="text-[#FF6B35]">${total.toFixed(2)}</span>
        </p>
      </motion.div>

      {/* Confirmation Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg p-8 space-y-6"
      >
        <h3 className="text-xl font-bold text-gray-900">What's Next?</h3>

        <div className="space-y-4">
          {[
            {
              num: "1",
              title: "Check Your Email",
              desc: "Confirmation email sent to your inbox with all booking details",
              icon: <Mail size={24} />,
            },
            {
              num: "2",
              title: "Download Itinerary",
              desc: "Get your complete trip PDF with all reservations and recommendations",
              icon: <Download size={24} />,
            },
            {
              num: "3",
              title: "Find Your Crew",
              desc: "Connect with other travelers heading to the same destination",
              icon: <Users size={24} />,
            },
          ].map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
              className="flex gap-4 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-full bg-[#FF6B35]/20 flex items-center justify-center text-[#FF6B35] flex-shrink-0">
                {step.icon}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{step.title}</p>
                <p className="text-sm text-gray-600 mt-1">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="grid grid-cols-2 gap-4"
      >
        <motion.a
          href="/dashboard"
          className="px-6 py-3 border border-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Go to Dashboard
        </motion.a>
        <motion.a
          href="/matches"
          className="px-6 py-3 bg-[#FF6B35] text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors text-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Find Travel Buddies
        </motion.a>
      </motion.div>
    </motion.div>
  );
}
