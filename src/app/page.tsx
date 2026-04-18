"use client";

import { motion, useInView, useScroll } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  Play,
  ChevronDown,
  Check,
  Star,
  Menu,
  X,
  Hash,
  AtSign,
  Link as LinkIcon,
} from "lucide-react";
import Link from "next/link";

const destinations = [
  {
    name: "Bali",
    country: "Indonesia",
    price: "From $299",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    tall: true,
  },
  {
    name: "Paris",
    country: "France",
    price: "From $450",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
  },
  {
    name: "Santorini",
    country: "Greece",
    price: "From $380",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80",
  },
  {
    name: "Tokyo",
    country: "Japan",
    price: "From $520",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
  },
  {
    name: "New York",
    country: "USA",
    price: "From $350",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80",
  },
  {
    name: "Maldives",
    country: "Maldives",
    price: "From $600",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80",
  },
];

const transportTypes = [
  {
    title: "Fly There",
    description: "500+ airlines. Real-time prices. AI predicts the best time to book.",
    stat: "Avg savings: 40%",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80",
  },
  {
    title: "Train It",
    description: "Scenic routes worldwide. European rail to Asian bullet trains. Often faster than flying city-to-city.",
    stat: "200+ rail networks",
    image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=600&q=80",
  },
  {
    title: "Sail Away",
    description: "Cruise packages from budget to luxury. Wake up in a new port every morning.",
    stat: "50+ cruise lines",
    image: "https://images.unsplash.com/photo-1548438294-1ad5d5f4f063?w=600&q=80",
  },
];

const testimonials = [
  {
    quote: "I planned a 10-day Europe trip in literally 3 minutes. The AI found routes I never would have thought of and saved me over $600 compared to what I was going to pay.",
    author: "Sarah K.",
    role: "Solo Traveler, 28 trips",
  },
  {
    quote: "The vibe matching is unreal. Met two people going to the same hostel in Bangkok. We split the costs and had the best week of our lives.",
    author: "Marcus T.",
    role: "Adventure Traveler",
  },
  {
    quote: "As someone who hates planning, this is a dream. Told it my budget, dates and style. Had a full itinerary with bookings in under a minute.",
    author: "Priya R.",
    role: "Digital Nomad",
  },
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState("");

  const { scrollY } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setScrolled(latest > 50);
    });
    return unsubscribe;
  }, [scrollY]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email signup
    console.log("Email:", email);
  };

  return (
    <div className="min-h-screen bg-white font-['Plus_Jakarta_Sans']">
      {/* Navbar */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 h-18 transition-all duration-300 ${
          scrolled ? "bg-white shadow-lg" : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="16" cy="16" r="16" fill="#FF6B35" />
              <path
                d="M8 16l8-8 8 8M8 16l8 8 8-8"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className={`text-xl font-bold ${scrolled ? "text-gray-900" : "text-white"}`}>
              roamie
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className={`text-sm font-medium transition-colors ${scrolled ? "text-gray-700 hover:text-gray-900" : "text-white hover:text-gray-200"}`}>
              Features
            </a>
            <a href="#how-it-works" className={`text-sm font-medium transition-colors ${scrolled ? "text-gray-700 hover:text-gray-900" : "text-white hover:text-gray-200"}`}>
              How It Works
            </a>
            <a href="#matching" className={`text-sm font-medium transition-colors ${scrolled ? "text-gray-700 hover:text-gray-900" : "text-white hover:text-gray-200"}`}>
              Matching
            </a>
            <a href="#pricing" className={`text-sm font-medium transition-colors ${scrolled ? "text-gray-700 hover:text-gray-900" : "text-white hover:text-gray-200"}`}>
              Pricing
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <a href="/login" className={`px-4 py-2 text-sm font-medium transition-colors ${scrolled ? "text-gray-700 hover:text-gray-900" : "text-white hover:text-gray-200"}`}>
              Sign in
            </a>
            <motion.button
              className="bg-[#FF6B35] text-white px-5 py-2 rounded-full font-medium hover:bg-[#e55a2b] transition-colors"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Get Started
            </motion.button>
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className={`w-6 h-6 ${scrolled ? "text-gray-900" : "text-white"}`} />
            ) : (
              <Menu className={`w-6 h-6 ${scrolled ? "text-gray-900" : "text-white"}`} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden bg-white shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="px-4 py-4 space-y-4">
              <a href="#features" className="block text-gray-700 hover:text-gray-900">Features</a>
              <a href="#how-it-works" className="block text-gray-700 hover:text-gray-900">How It Works</a>
              <a href="#matching" className="block text-gray-700 hover:text-gray-900">Matching</a>
              <a href="#pricing" className="block text-gray-700 hover:text-gray-900">Pricing</a>
              <a href="/login" className="block w-full text-left text-gray-700 hover:text-gray-900">Sign in</a>
              <button className="block w-full bg-[#FF6B35] text-white px-4 py-2 rounded-full font-medium">
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80"
          alt="Scenic road trip"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-55" />

        <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="inline-block bg-white/10 backdrop-blur-sm border border-white/30 rounded-full px-6 py-3 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-semibold tracking-wide">AI-Powered Travel Planning</span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-center"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
          >
            <motion.span
              className="block"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              Your World,
            </motion.span>
            <motion.span
              className="block"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              Your Journey,
            </motion.span>
            <motion.span
              className="block"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              Your Budget.
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Roamie AI plans complete trips across flights, trains and cruises — finding the lowest prices and connecting you with travelers who share your spirit.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <motion.button
              className="bg-[#FF6B35] text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 text-center w-full sm:w-auto"
              style={{ boxShadow: "0 8px 30px rgba(255,107,53,0.4)" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Planning Free
            </motion.button>
            <motion.button
              className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-white hover:text-gray-900 transition-colors w-full sm:w-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-5 h-5" />
              Watch How It Works
            </motion.button>
          </motion.div>

          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-opacity-70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm">Scroll to explore</span>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ChevronDown className="w-6 h-6" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Floating Stats */}
      <section className="relative -mt-16 z-20">
        <motion.div
          className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8 md:p-12"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#FF6B35] mb-2">10,000+</div>
              <div className="text-sm text-gray-500">Trips Planned</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#004E89] mb-2">$2M+</div>
              <div className="text-sm text-gray-500">Saved on Travel</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#1A936F] mb-2">50,000+</div>
              <div className="text-sm text-gray-500">Happy Travelers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#FF6B35] mb-2">4.9/5</div>
              <div className="text-sm text-gray-500">Average Rating</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Destinations Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-[#FF6B35] text-sm font-medium tracking-wider uppercase mb-4">
              POPULAR DESTINATIONS
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Explore The World
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover incredible destinations with AI-optimized travel plans at prices that surprise you
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Row 1 */}
            <motion.div
              className="md:col-span-1 relative overflow-hidden rounded-2xl h-96 md:h-[500px] group cursor-pointer"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
            >
              <Image
                src={destinations[0].image}
                alt={destinations[0].name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-xl font-bold mb-1">{destinations[0].name}</h3>
                <p className="text-sm opacity-70 mb-3">{destinations[0].country}</p>
                <span className="bg-[#FF6B35] text-white px-3 py-1 rounded-full text-sm font-medium">
                  {destinations[0].price}
                </span>
              </div>
            </motion.div>

            <div className="md:col-span-2 space-y-6">
              <motion.div
                className="relative overflow-hidden rounded-2xl h-44 md:h-56 group cursor-pointer"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Image
                  src={destinations[1].image}
                  alt={destinations[1].name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-lg font-bold mb-1">{destinations[1].name}</h3>
                  <p className="text-sm opacity-70 mb-2">{destinations[1].country}</p>
                  <span className="bg-[#FF6B35] text-white px-3 py-1 rounded-full text-sm font-medium">
                    {destinations[1].price}
                  </span>
                </div>
              </motion.div>

              <motion.div
                className="relative overflow-hidden rounded-2xl h-44 md:h-56 group cursor-pointer"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ scale: 1.02 }}
              >
                <Image
                  src={destinations[2].image}
                  alt={destinations[2].name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-lg font-bold mb-1">{destinations[2].name}</h3>
                  <p className="text-sm opacity-70 mb-2">{destinations[2].country}</p>
                  <span className="bg-[#FF6B35] text-white px-3 py-1 rounded-full text-sm font-medium">
                    {destinations[2].price}
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Row 2 */}
            <motion.div
              className="relative overflow-hidden rounded-2xl h-44 md:h-56 group cursor-pointer"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <Image
                src={destinations[3].image}
                alt={destinations[3].name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-lg font-bold mb-1">{destinations[3].name}</h3>
                <p className="text-sm opacity-70 mb-2">{destinations[3].country}</p>
                <span className="bg-[#FF6B35] text-white px-3 py-1 rounded-full text-sm font-medium">
                  {destinations[3].price}
                </span>
              </div>
            </motion.div>

            <motion.div
              className="relative overflow-hidden rounded-2xl h-44 md:h-56 group cursor-pointer"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
            >
              <Image
                src={destinations[4].image}
                alt={destinations[4].name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-lg font-bold mb-1">{destinations[4].name}</h3>
                <p className="text-sm opacity-70 mb-2">{destinations[4].country}</p>
                <span className="bg-[#FF6B35] text-white px-3 py-1 rounded-full text-sm font-medium">
                  {destinations[4].price}
                </span>
              </div>
            </motion.div>

            <motion.div
              className="relative overflow-hidden rounded-2xl h-44 md:h-56 group cursor-pointer"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
            >
              <Image
                src={destinations[5].image}
                alt={destinations[5].name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-lg font-bold mb-1">{destinations[5].name}</h3>
                <p className="text-sm opacity-70 mb-2">{destinations[5].country}</p>
                <span className="bg-[#FF6B35] text-white px-3 py-1 rounded-full text-sm font-medium">
                  {destinations[5].price}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-[#F7F8FC] px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-[#FF6B35] text-sm font-medium tracking-wider uppercase mb-4">
              HOW IT WORKS
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Travel Smarter in Three Steps
            </h2>
            <p className="text-lg text-gray-600">
              From idea to booked trip in under 60 seconds
            </p>
          </motion.div>

          {/* Step 1 */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-6xl font-bold text-[#FF6B35] text-opacity-20 mb-4">01</div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Tell Us Your Dream</h3>
              <p className="text-lg text-gray-600 mb-6">
                Simply describe where you want to go, when, and how much you want to spend. Our AI understands natural language — no forms, no filters.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#1A936F]" />
                  <span className="text-gray-700">Works with any destination worldwide</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#1A936F]" />
                  <span className="text-gray-700">Understands any budget range</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#1A936F]" />
                  <span className="text-gray-700">Plans for solo, couples or groups</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl shadow-xl p-6"
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-4">
                <div className="bg-orange-50 rounded-lg p-4">
                  <p className="text-gray-800">Plan a 7-day trip to Bali for 2 people, budget $1500</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600">Perfect! Finding the best options for Bali...</p>
                  <div className="flex gap-1 mt-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Step 2 */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <motion.div
              className="bg-white rounded-2xl shadow-xl p-6 space-y-4"
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold">✈️</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Flight: Delhi → Paris</p>
                  <p className="text-sm text-gray-600">$450 • 8h 30m</p>
                </div>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">BEST DEAL</span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-bold">🚂</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Train: Paris → Nice</p>
                  <p className="text-sm text-gray-600">$85 • 6h 45m</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 font-bold">🚢</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Cruise: Nice → Rome</p>
                  <p className="text-sm text-gray-600">$120 • 2 nights</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-6xl font-bold text-[#004E89] text-opacity-20 mb-4">02</div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">AI Finds The Best Deals</h3>
              <p className="text-lg text-gray-600 mb-6">
                Our AI simultaneously searches 500+ providers for flights, trains and cruises — comparing prices, timing and comfort to find your perfect match.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#1A936F]" />
                  <span className="text-gray-700">Searches 500+ travel providers</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#1A936F]" />
                  <span className="text-gray-700">Price prediction to book at right time</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#1A936F]" />
                  <span className="text-gray-700">Shows total trip cost instantly</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Step 3 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-6xl font-bold text-[#1A936F] text-opacity-20 mb-4">03</div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Book & Meet Your Crew</h3>
              <p className="text-lg text-gray-600 mb-6">
                Book everything with one click. Then our matching system connects you with travelers heading to the same destination with the same travel personality.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#1A936F]" />
                  <span className="text-gray-700">Single-tap booking for everything</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#1A936F]" />
                  <span className="text-gray-700">AI vibe matching algorithm</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#1A936F]" />
                  <span className="text-gray-700">Save up to 35% traveling together</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-white rounded-2xl shadow-lg p-6 transform rotate-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                    AM
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Alex M.</p>
                    <p className="text-sm text-gray-500">From New York</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">Heading to: Bali, Indonesia</p>
                  <p className="text-sm text-gray-600">Dates: Jun 15 - Jun 22</p>
                  <p className="text-sm text-gray-600">Budget: $800 - $1000</p>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">Hiking</span>
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">Foodie</span>
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">Photography</span>
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">Wellness</span>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Vibe Match</span>
                    <span className="text-green-600 font-medium">94%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 bg-[#FF6B35] text-white px-4 py-2 rounded-lg text-sm font-medium">
                    Say Hello
                  </button>
                  <button className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium">
                    View Profile
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Transport Types */}
      <section className="py-20 bg-[#004E89] text-white px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-white text-sm font-medium tracking-wider uppercase mb-4">
              ALL WAYS TO TRAVEL
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              One App,<br />Every Journey.
            </h2>
            <p className="text-lg text-white text-opacity-70 max-w-2xl mx-auto">
              Whether you prefer to fly, take the scenic route by train, or sail the open sea — Roamie has you covered.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {transportTypes.map((transport, index) => (
              <motion.div
                key={index}
                className="bg-white bg-opacity-8 backdrop-blur-sm border border-white border-opacity-15 rounded-3xl p-8 hover:bg-opacity-13 transition-all duration-300"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <div className="relative h-48 rounded-xl overflow-hidden mb-6">
                  <Image
                    src={transport.image}
                    alt={transport.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-4">{transport.title}</h3>
                <p className="text-white text-opacity-80 mb-4 leading-relaxed">
                  {transport.description}
                </p>
                <p className="text-[#FF6B35] font-medium">{transport.stat}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vibe Matching */}
      <section id="matching" className="py-20 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-[#FF6B35] text-sm font-medium tracking-wider uppercase mb-4">
                VIBE MATCHING
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Find People Who Travel Like You
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Most travel apps just book trips. Roamie does something different — it reads your travel personality from your conversations with AI and finds others heading to the same place with the same spirit.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Split costs, share experiences, and make connections that last beyond the trip.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-[#FF6B35]">68%</span>
                  <span className="text-gray-700">of solo travelers want companionship but not a tour group</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-[#004E89]">35%</span>
                  <span className="text-gray-700">average savings when sharing accommodation with a match</span>
                </div>
              </div>
              <motion.button
                className="bg-[#FF6B35] text-white px-8 py-4 rounded-full font-bold text-lg"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Find My Match
              </motion.button>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative">
                <motion.div
                  className="bg-white rounded-2xl shadow-lg p-6 transform rotate-1"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                      AM
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Alex M.</p>
                      <p className="text-sm text-gray-500">From New York</p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">Heading to: Bali, Indonesia</p>
                    <p className="text-sm text-gray-600">Dates: Jun 15 - Jun 22</p>
                    <p className="text-sm text-gray-600">Budget: $800 - $1000</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">Hiking</span>
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">Foodie</span>
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">Photography</span>
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">Wellness</span>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Vibe Match</span>
                      <span className="text-green-600 font-medium">94%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-[#FF6B35] text-white px-4 py-2 rounded-lg text-sm font-medium">
                      Say Hello
                    </button>
                    <button className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium">
                      View Profile
                    </button>
                  </div>
                </motion.div>

                <motion.div
                  className="bg-white rounded-2xl shadow-lg p-6 transform -rotate-1 absolute top-8 left-8 opacity-80"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      SJ
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Sarah J.</p>
                      <p className="text-sm text-gray-500">From London</p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">Heading to: Bali, Indonesia</p>
                    <p className="text-sm text-gray-600">Dates: Jun 16 - Jun 23</p>
                    <p className="text-sm text-gray-600">Budget: $900 - $1200</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">Adventure</span>
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">Culture</span>
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">Nature</span>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Vibe Match</span>
                      <span className="text-green-600 font-medium">89%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '89%' }}></div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-[#FF6B35] text-white px-4 py-2 rounded-lg text-sm font-medium">
                      Say Hello
                    </button>
                    <button className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium">
                      View Profile
                    </button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-[#F7F8FC] px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-[#FF6B35] text-sm font-medium tracking-wider uppercase mb-4">
              WHAT TRAVELERS SAY
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Real Trips. Real Savings.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-8"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#FF6B35] text-[#FF6B35]" />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-6 leading-relaxed">
                  &quot;{testimonial.quote}&quot;
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {testimonial.author.split(' ')[0][0]}{testimonial.author.split(' ')[1][0]}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{testimonial.author.split(',')[0]}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4">
        <Image
          src="https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=1920&q=80"
          alt="Group of travelers"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-75" />

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto">
          <motion.h2
            className="text-4xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Your Next Adventure<br />
            Starts Here.
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-white text-opacity-70 mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Join thousands of travelers who plan smarter, spend less, and experience more.
          </motion.p>

          <motion.form
            className="max-w-md mx-auto mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            onSubmit={handleSubmit}
          >
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-6 py-4 rounded-l-full bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                required
              />
              <button
                type="submit"
                className="bg-[#FF6B35] text-white px-8 py-4 rounded-r-full font-bold hover:bg-[#e55a2b] transition-colors"
              >
                Get Started
              </button>
            </div>
          </motion.form>

          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-6 text-sm text-white text-opacity-80"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#1A936F]" />
              <span>Free to start</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#1A936F]" />
              <span>No credit card</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#1A936F]" />
              <span>Cancel anytime</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1C1C1E] text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <svg
                  width="32"
                  height="32"
                  viewBox="0.0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="16" cy="16" r="16" fill="#FF6B35" />
                  <path
                    d="M8 16l8-8 8 8M8 16l8 8 8-8"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-xl font-bold">roamie</span>
              </div>
              <p className="text-white text-opacity-50 text-sm leading-relaxed mb-6 max-w-md">
                Find Your People. Find Your Place.
              </p>
              <div className="flex gap-4">
                <button className="w-10 h-10 bg-white bg-opacity-10 rounded-full flex items-center justify-center hover:bg-[#FF6B35] transition-colors">
                  <Hash className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-white bg-opacity-10 rounded-full flex items-center justify-center hover:bg-[#FF6B35] transition-colors">
                  <AtSign className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-white bg-opacity-10 rounded-full flex items-center justify-center hover:bg-[#FF6B35] transition-colors">
                  <LinkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-white text-xs font-medium tracking-wider uppercase mb-4">Product</h4>
              <div className="space-y-3">
                <Link href="#" className="block text-white text-opacity-50 hover:text-white text-sm transition-colors">Features</Link>
                <Link href="#" className="block text-white text-opacity-50 hover:text-white text-sm transition-colors">How It Works</Link>
                <Link href="#" className="block text-white text-opacity-50 hover:text-white text-sm transition-colors">Pricing</Link>
                <Link href="#" className="block text-white text-opacity-50 hover:text-white text-sm transition-colors">Changelog</Link>
                <Link href="#" className="block text-white text-opacity-50 hover:text-white text-sm transition-colors">Download App</Link>
              </div>
            </div>

            <div>
              <h4 className="text-white text-xs font-medium tracking-wider uppercase mb-4">Company</h4>
              <div className="space-y-3">
                <Link href="#" className="block text-white text-opacity-50 hover:text-white text-sm transition-colors">About Us</Link>
                <Link href="#" className="block text-white text-opacity-50 hover:text-white text-sm transition-colors">Blog</Link>
                <Link href="#" className="block text-white text-opacity-50 hover:text-white text-sm transition-colors">Careers</Link>
                <Link href="#" className="block text-white text-opacity-50 hover:text-white text-sm transition-colors">Press</Link>
                <Link href="#" className="block text-white text-opacity-50 hover:text-white text-sm transition-colors">Contact</Link>
              </div>
            </div>

            <div>
              <h4 className="text-white text-xs font-medium tracking-wider uppercase mb-4">Legal</h4>
              <div className="space-y-3">
                <Link href="#" className="block text-white text-opacity-50 hover:text-white text-sm transition-colors">Privacy Policy</Link>
                <Link href="#" className="block text-white text-opacity-50 hover:text-white text-sm transition-colors">Terms of Service</Link>
                <Link href="#" className="block text-white text-opacity-50 hover:text-white text-sm transition-colors">Cookie Policy</Link>
                <Link href="#" className="block text-white text-opacity-50 hover:text-white text-sm transition-colors">Refund Policy</Link>
              </div>
            </div>
          </div>

          <div className="border-t border-white border-opacity-10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-white text-opacity-40 text-sm">
                © 2025 Roamie Technologies. All rights reserved.
              </p>
              <div className="flex gap-6 mt-4 md:mt-0">
                <Link href="#" className="text-white text-opacity-40 hover:text-white text-sm transition-colors">Privacy</Link>
                <Link href="#" className="text-white text-opacity-40 hover:text-white text-sm transition-colors">Terms</Link>
                <Link href="#" className="text-white text-opacity-40 hover:text-white text-sm transition-colors">Cookies</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: "🤖",
    title: "AI Planning",
    description: "Complete itinerary in seconds",
  },
  {
    icon: "💰",
    title: "Budget Tracker",
    description: "Never overspend again",
  },
  {
    icon: "🎁",
    title: "Trip Rewards",
    description: "Earn discounts together",
  },
  {
    icon: "🔔",
    title: "Price Alerts",
    description: "Get notified on price drops",
  },
  {
    icon: "🛡️",
    title: "Safe Matching",
    description: "Verified traveler profiles",
  },
  {
    icon: "📱",
    title: "One Tap Book",
    description: "Book everything instantly",
  },
];

const footerColumns = [
  {
    title: "Product",
    links: ["Features", "How It Works", "Pricing"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Contact"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "Cookies"],
  },
  {
    title: "Social",
    links: ["Instagram", "X", "LinkedIn"],
  },
];

function RevealSection({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <motion.section
      id={id}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  );
}
