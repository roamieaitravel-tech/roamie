"use client";

import { motion, AnimatePresence, useScroll } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
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
  Plane,
  Train,
  Ship,
  ArrowRight,
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
    image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&q=80",
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
    author: "Maya R.",
    role: "Digital Nomad",
  },
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const { scrollY } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setScrolled(latest > 50);
    });
    return unsubscribe;
  }, [scrollY]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribed(true);
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-white font-['Plus_Jakarta_Sans'] selection:bg-[#FF6B35]/30">
      {/* ══════════════════════════════════
          SECTION 1: NAVBAR
          ══════════════════════════════════ */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 h-[72px] transition-all duration-300 flex items-center ${
          scrolled ? "bg-white shadow-lg" : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 rounded-full bg-[#FF6B35] flex items-center justify-center transition-transform group-hover:scale-110">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4L4 12L12 20L20 12L12 4Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className={`text-xl font-bold tracking-tight ${scrolled ? "text-[#1C1C1E]" : "text-white"}`}>
              roamie
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {["Features", "How It Works", "Matching", "Pricing"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className={`text-[15px] font-medium transition-colors hover:text-[#FF6B35] ${
                  scrolled ? "text-[#1C1C1E]" : "text-white"
                }`}
              >
                {item}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/login"
              className={`text-[15px] font-medium transition-colors hover:text-[#FF6B35] ${
                scrolled ? "text-[#1C1C1E]" : "text-white"
              }`}
            >
              Sign in
            </Link>
            <motion.button
              whileHover={{ scale: 1.03, backgroundColor: "#ff7b4d" }}
              whileTap={{ scale: 0.97 }}
              className="bg-[#FF6B35] text-white px-5 py-2.5 rounded-full text-[15px] font-bold transition-shadow hover:shadow-lg"
            >
              Get Started
            </motion.button>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className={`w-6 h-6 ${scrolled ? "text-[#1C1C1E]" : "text-white"}`} />
            ) : (
              <Menu className={`w-6 h-6 ${scrolled ? "text-[#1C1C1E]" : "text-white"}`} />
            )}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-[72px] left-0 right-0 bg-white shadow-2xl md:hidden overflow-hidden border-t border-gray-100"
            >
              <div className="px-6 py-8 space-y-6">
                {["Features", "How It Works", "Matching", "Pricing"].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                    className="block text-lg font-semibold text-[#1C1C1E] hover:text-[#FF6B35]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item}
                  </a>
                ))}
                <div className="pt-6 border-t border-gray-100 space-y-4">
                  <Link href="/login" className="block text-lg font-semibold text-[#1C1C1E]">
                    Sign in
                  </Link>
                  <button className="w-full bg-[#FF6B35] text-white py-4 rounded-xl font-bold text-lg">
                    Get Started
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ══════════════════════════════════
          SECTION 2: HERO
          ══════════════════════════════════ */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80"
          alt="Scenic mountain road trip"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center bg-white/10 backdrop-blur-md border border-white/30 rounded-full px-4 py-2 mb-8"
            >
              <span className="text-white text-xs md:text-sm font-bold tracking-wider uppercase">
                AI-Powered Travel Planning
              </span>
            </motion.div>

            <motion.h1
              className="text-[40px] md:text-[72px] font-extrabold text-white leading-[1.1] tracking-tight mb-8"
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
              <motion.span variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }} className="block">Your World,</motion.span>
              <motion.span variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }} className="block">Your Journey,</motion.span>
              <motion.span variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }} className="block text-[#FF6B35]">Your Budget.</motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg md:text-xl text-white/70 max-w-[560px] leading-[1.7] mb-12"
            >
              Roamie AI plans complete trips across flights, trains and cruises — finding the lowest prices and connecting you with travelers who share your spirit.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <motion.button
                whileHover={{ scale: 1.03, backgroundColor: "#ff7b4d" }}
                whileTap={{ scale: 0.97 }}
                className="h-[52px] px-8 bg-[#FF6B35] text-white rounded-full font-bold text-lg shadow-[0_8px_30px_rgba(255,107,53,0.4)] transition-all"
              >
                Start Planning Free
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,1)", color: "#1C1C1E" }}
                whileTap={{ scale: 0.97 }}
                className="h-[52px] px-8 border-[1.5px] border-white text-white rounded-full font-bold text-lg flex items-center justify-center gap-2 transition-all"
              >
                <Play className="w-5 h-5 fill-current" />
                Watch How It Works
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50"
        >
          <span className="text-xs font-bold tracking-widest uppercase">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════
          SECTION 3: FLOATING STATS
          ══════════════════════════════════ */}
      <section className="relative z-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-[900px] mx-auto bg-white rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] -mt-[60px]"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 items-center p-8 md:p-0">
            {[
              { value: "10,000+", label: "Trips Planned", color: "#FF6B35" },
              { value: "$2M+", label: "Saved on Travel", color: "#004E89" },
              { value: "50,000+", label: "Happy Travelers", color: "#1A936F" },
              { value: "4.9/5", label: "Average Rating", color: "#FF6B35" },
            ].map((stat, i) => (
              <div
                key={i}
                className={`flex flex-col items-center text-center py-8 px-4 ${
                  i < 3 ? "md:border-r border-gray-100" : ""
                }`}
              >
                <span className="text-2xl md:text-[32px] font-black mb-1" style={{ color: stat.color }}>
                  {stat.value}
                </span>
                <span className="text-[14px] font-semibold text-gray-500 uppercase tracking-tight">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════
          SECTION 4: DESTINATIONS GRID
          ══════════════════════════════════ */}
      <section id="features" className="py-24 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[#FF6B35] text-sm font-black tracking-[0.2em] uppercase mb-4 block">
              POPULAR DESTINATIONS
            </span>
            <h2 className="text-[40px] md:text-[48px] font-black text-[#1C1C1E] mb-6 tracking-tight">
              Explore The World
            </h2>
            <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Discover incredible destinations with AI-optimized travel plans at prices that surprise you.
            </p>
          </motion.div>

          {/* Masonry-style Grid */}
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Row 1: Bali (Tall) and Paris/Santorini */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="w-full md:w-[40%] h-[400px] md:h-[500px] relative rounded-3xl overflow-hidden group cursor-pointer"
              >
                <Image src={destinations[0].image} alt="Bali" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-8 left-8 text-white">
                  <h3 className="text-2xl font-bold mb-1">{destinations[0].name}</h3>
                  <p className="text-sm opacity-70 font-medium mb-4">{destinations[0].country}</p>
                  <div className="flex items-center gap-4">
                    <span className="bg-[#FF6B35] text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
                      {destinations[0].price}
                    </span>
                    <span className="text-sm font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                      Explore <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </motion.div>

              <div className="w-full md:w-[60%] flex flex-col gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="h-[240px] relative rounded-3xl overflow-hidden group cursor-pointer"
                >
                  <Image src={destinations[1].image} alt="Paris" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-xl font-bold mb-1">{destinations[1].name}</h3>
                    <p className="text-sm opacity-70 font-medium mb-3">{destinations[1].country}</p>
                    <div className="flex items-center gap-4">
                      <span className="bg-[#FF6B35] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                        {destinations[1].price}
                      </span>
                      <span className="text-xs font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                        Explore <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="h-[240px] relative rounded-3xl overflow-hidden group cursor-pointer"
                >
                  <Image src={destinations[2].image} alt="Santorini" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-xl font-bold mb-1">{destinations[2].name}</h3>
                    <p className="text-sm opacity-70 font-medium mb-3">{destinations[2].country}</p>
                    <div className="flex items-center gap-4">
                      <span className="bg-[#FF6B35] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                        {destinations[2].price}
                      </span>
                      <span className="text-xs font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                        Explore <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Row 2: Tokyo, NY, Maldives */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[3, 4, 5].map((index, i) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 + 0.4 }}
                  className="h-[280px] relative rounded-3xl overflow-hidden group cursor-pointer"
                >
                  <Image src={destinations[index].image} alt={destinations[index].name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-xl font-bold mb-1">{destinations[index].name}</h3>
                    <p className="text-sm opacity-70 font-medium mb-3">{destinations[index].country}</p>
                    <div className="flex items-center gap-4">
                      <span className="bg-[#FF6B35] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                        {destinations[index].price}
                      </span>
                      <span className="text-xs font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                        Explore <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          SECTION 5: HOW IT WORKS
          ══════════════════════════════════ */}
      <section id="how-it-works" className="py-24 bg-[#F7F8FC] px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <span className="text-[#FF6B35] text-sm font-black tracking-[0.2em] uppercase mb-4 block">
              HOW IT WORKS
            </span>
            <h2 className="text-[40px] md:text-[48px] font-black text-[#1C1C1E] mb-6 tracking-tight">
              Travel Smarter in Three Steps
            </h2>
            <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto">
              From idea to booked trip in under 60 seconds.
            </p>
          </motion.div>

          <div className="space-y-32">
            {/* Step 1 */}
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <span className="text-[80px] font-black text-[#FF6B35]/20 leading-none mb-4 block tracking-tighter">01</span>
                <h3 className="text-3xl font-black text-[#1C1C1E] mb-6">Tell Us Your Dream</h3>
                <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                  Simply describe where you want to go, when, and how much you want to spend. Our AI understands natural language — no forms, no filters.
                </p>
                <ul className="space-y-4">
                  {[
                    "Works with any destination worldwide",
                    "Understands any budget range",
                    "Plans for solo, couples or groups",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-[#1A936F]" />
                      </div>
                      <span className="text-[#1C1C1E] font-semibold">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="bg-white rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] p-8 border border-gray-100"
              >
                <div className="space-y-6">
                  <div className="flex justify-end">
                    <div className="bg-[#FF6B35] text-white px-5 py-3 rounded-2xl rounded-tr-none max-w-[80%] shadow-lg">
                      <p className="text-sm font-semibold">Plan a 7-day trip to Bali for 2 people, budget $1500</p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-800 px-5 py-3 rounded-2xl rounded-tl-none max-w-[80%]">
                      <p className="text-sm font-semibold mb-2">Perfect! Finding the best options for Bali...</p>
                      <div className="flex gap-1.5">
                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                      </div>
                    </div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-4"
                  >
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                      <Plane className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-0.5">Recommended Flight</p>
                      <p className="text-sm font-bold text-[#1C1C1E]">London (LHR) → Bali (DPS)</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-[#1A936F]">$742</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Step 2 */}
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="order-2 md:order-1 relative">
                <div className="space-y-4">
                  {[
                    { icon: <Plane className="w-5 h-5" />, title: "Flight: LHR → CDG", price: "$45", color: "blue", delay: 0 },
                    { icon: <Train className="w-5 h-5" />, title: "Train: Paris → Nice", price: "$85", color: "green", delay: 0.1, best: true },
                    { icon: <Ship className="w-5 h-5" />, title: "Cruise: Nice → Rome", price: "$120", color: "purple", delay: 0.2 },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -60 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: item.delay }}
                      className={`p-5 bg-white border border-gray-100 rounded-2xl shadow-lg flex items-center gap-5`}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        item.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                        item.color === 'green' ? 'bg-green-50 text-green-600' :
                        'bg-purple-50 text-purple-600'
                      }`}>
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <p className="font-bold text-[#1C1C1E]">{item.title}</p>
                          {item.best && (
                            <span className="bg-green-100 text-[#1A936F] text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">Best Deal</span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-gray-400 mt-0.5 tracking-tight">AI Predicted Low</p>
                      </div>
                      <div className="text-right font-black text-[#1C1C1E]">{item.price}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="order-1 md:order-2"
              >
                <span className="text-[80px] font-black text-[#004E89]/10 leading-none mb-4 block tracking-tighter">02</span>
                <h3 className="text-3xl font-black text-[#1C1C1E] mb-6">AI Finds The Best Deals</h3>
                <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                  Our AI simultaneously searches 500+ providers for flights, trains and cruises — comparing prices, timing and comfort to find your perfect match.
                </p>
                <ul className="space-y-4">
                  {[
                    "Searches 500+ travel providers",
                    "Price prediction to book at right time",
                    "Shows total trip cost instantly",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-[#1A936F]" />
                      </div>
                      <span className="text-[#1C1C1E] font-semibold">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Step 3 */}
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <span className="text-[80px] font-black text-[#1A936F]/10 leading-none mb-4 block tracking-tighter">03</span>
                <h3 className="text-3xl font-black text-[#1C1C1E] mb-6">Book & Meet Your Crew</h3>
                <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                  Book everything with one click. Then our matching system connects you with travelers heading to the same destination with the same travel personality.
                </p>
                <ul className="space-y-4">
                  {[
                    "Single-tap booking for everything",
                    "AI vibe matching algorithm",
                    "Save up to 35% traveling together",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-[#1A936F]" />
                      </div>
                      <span className="text-[#1C1C1E] font-semibold">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
              <div className="relative h-[320px]">
                {[
                  { initials: "AM", color: "from-orange-400 to-pink-500", match: "94%", x: 0, y: 0, delay: 0 },
                  { initials: "SK", color: "from-blue-400 to-indigo-500", match: "88%", x: 40, y: 60, delay: 0.1 },
                  { initials: "MT", color: "from-emerald-400 to-teal-500", match: "91%", x: -40, y: 120, delay: 0.2 },
                ].map((profile, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: profile.delay }}
                    style={{ left: `calc(50% + ${profile.x}px)`, top: profile.y }}
                    className="absolute w-[240px] -translate-x-1/2 bg-white rounded-2xl shadow-[0_24px_48px_-12px_rgba(0,0,0,0.12)] p-4 border border-gray-50"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${profile.color} flex items-center justify-center text-white text-xs font-black`}>
                        {profile.initials}
                      </div>
                      <span className="bg-green-100 text-[#1A936F] text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">
                        Match: {profile.match}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-2 w-3/4 bg-gray-100 rounded-full" />
                      <div className="h-2 w-1/2 bg-gray-50 rounded-full" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          SECTION 6: TRANSPORT TYPES
          ══════════════════════════════════ */}
      <section id="matching" className="py-24 bg-[#004E89] text-white px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-white/60 text-sm font-black tracking-[0.2em] uppercase mb-4 block">
              ALL WAYS TO TRAVEL
            </span>
            <h2 className="text-[40px] md:text-[48px] font-black leading-tight mb-6 tracking-tight">
              One App,<br />Every Journey.
            </h2>
            <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
              Whether you prefer to fly, take the scenic route by train, or sail the open sea — Roamie has you covered.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {transportTypes.map((transport, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ y: -8, backgroundColor: "rgba(255,255,255,0.13)" }}
                className="bg-white/10 backdrop-blur-md border border-white/15 rounded-[32px] p-10 transition-all duration-300"
              >
                <div className="relative h-[200px] w-full rounded-2xl overflow-hidden mb-8">
                  <Image src={transport.image} alt={transport.title} fill className="object-cover" />
                </div>
                <h3 className="text-2xl font-black mb-4 tracking-tight">{transport.title}</h3>
                <p className="text-white/60 leading-relaxed mb-6 font-medium">
                  {transport.description}
                </p>
                <p className="text-[#FF6B35] font-black text-sm uppercase tracking-wider">{transport.stat}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          SECTION 7: VIBE MATCHING
          ══════════════════════════════════ */}
      <section id="pricing" className="py-24 bg-white px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-[#FF6B35] text-sm font-black tracking-[0.2em] uppercase mb-4 block">
                VIBE MATCHING
              </span>
              <h2 className="text-[40px] md:text-[48px] font-black text-[#1C1C1E] mb-8 leading-tight tracking-tight">
                Find People Who Travel Like You
              </h2>
              <div className="space-y-6 mb-12">
                <p className="text-lg text-gray-500 leading-relaxed">
                  Most travel apps just book trips. Roamie does something different — it reads your travel personality from your conversations with AI and finds others heading to the same place with the same spirit.
                </p>
                <p className="text-lg text-gray-500 leading-relaxed">
                  Split costs, share experiences, and make connections that last beyond the trip.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
                <div>
                  <div className="text-[32px] font-black text-[#FF6B35] leading-none mb-2">68%</div>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-tight leading-tight">of solo travelers want companionship but not a tour group</p>
                </div>
                <div>
                  <div className="text-[32px] font-black text-[#004E89] leading-none mb-2">35%</div>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-tight leading-tight">average savings when sharing accommodation with a match</p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.03, backgroundColor: "#ff7b4d" }}
                whileTap={{ scale: 0.97 }}
                className="h-[56px] px-10 bg-[#FF6B35] text-white rounded-full font-black text-lg shadow-[0_8px_30px_rgba(255,107,53,0.4)] transition-all"
              >
                Find My Match
              </motion.button>
            </motion.div>

            <div className="relative">
              <div className="relative h-[540px]">
                {/* Main Match Card */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-0 left-0 w-full sm:w-[380px] bg-white rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] p-8 border border-gray-100 z-30"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#ff9e35] flex items-center justify-center text-white text-lg font-black shadow-lg">
                      AM
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-[#1C1C1E]">Alex M.</h4>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">From New York</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-gray-400">Heading to</span>
                      <span className="font-black text-[#1C1C1E]">Bali, Indonesia</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-gray-400">Dates</span>
                      <span className="font-black text-[#1C1C1E]">Jun 15 - Jun 22</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-gray-400">Budget</span>
                      <span className="font-black text-[#1C1C1E]">$800 - $1000</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {["Hiking", "Foodie", "Photography", "Wellness"].map((tag) => (
                      <span key={tag} className="px-3 py-1.5 bg-gray-100 text-[#1C1C1E] text-[10px] font-black rounded-full uppercase tracking-wider">{tag}</span>
                    ))}
                  </div>

                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Vibe Match</span>
                      <span className="text-xs font-black text-[#1A936F]">94%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "94%" }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-[#1A936F] rounded-full"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 h-12 bg-[#FF6B35] text-white rounded-xl font-black text-sm transition-transform hover:scale-105">Say Hello</button>
                    <button className="flex-1 h-12 border border-gray-200 text-[#1C1C1E] rounded-xl font-black text-sm transition-transform hover:scale-105">View Profile</button>
                  </div>
                </motion.div>

                {/* Background Cards */}
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute top-20 left-20 w-[380px] bg-white rounded-3xl shadow-xl p-8 border border-gray-100 z-20 opacity-40 hidden sm:block"
                />
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute top-40 left-40 w-[380px] bg-white rounded-3xl shadow-xl p-8 border border-gray-100 z-10 opacity-20 hidden sm:block"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          SECTION 8: SOCIAL PROOF
          ══════════════════════════════════ */}
      <section className="py-24 bg-[#F7F8FC] px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[#FF6B35] text-sm font-black tracking-[0.2em] uppercase mb-4 block">
              WHAT TRAVELERS SAY
            </span>
            <h2 className="text-[40px] md:text-[48px] font-black text-[#1C1C1E] mb-6 tracking-tight">
              Real Trips. Real Savings.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-white rounded-3xl p-10 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.06)]"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, starI) => (
                    <Star key={starI} className="w-5 h-5 fill-[#FF6B35] text-[#FF6B35]" />
                  ))}
                </div>
                <blockquote className="text-[#1C1C1E] text-lg font-bold leading-relaxed mb-8">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-[#1C1C1E] font-black text-sm">
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-black text-[#1C1C1E]">{testimonial.author}</h4>
                    <p className="text-sm font-bold text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          SECTION 9: CTA SECTION
          ══════════════════════════════════ */}
      <section className="relative py-32 px-4 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=1920&q=80"
          alt="Group of travelers laughing"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#001E3C]/75" />

        <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[48px] md:text-[64px] font-black leading-tight mb-8 tracking-tight"
          >
            Your Next Adventure<br />Starts Here.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/70 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Join thousands of travelers who plan smarter, spend less, and experience more.
          </motion.p>

          <div className="max-w-[500px] mx-auto mb-12">
            {isSubscribed ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-500/20 backdrop-blur-md border border-green-500/50 rounded-2xl p-6"
              >
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-xl font-black mb-1">You&apos;re on the list!</h4>
                <p className="text-white/60 font-semibold">Check your inbox for your welcome guide.</p>
              </motion.div>
            ) : (
              <motion.form
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                onSubmit={handleSubmit}
                className="flex p-2 bg-white rounded-full shadow-2xl"
              >
                <label htmlFor="cta-email" className="sr-only">Email address</label>
                <input
                  id="cta-email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent px-6 py-4 text-[#1C1C1E] focus:outline-none font-bold placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="bg-[#FF6B35] text-white px-8 rounded-full font-black text-sm uppercase tracking-widest transition-transform hover:scale-105 active:scale-95 shadow-lg"
                >
                  Get Started
                </button>
              </motion.form>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-x-12 gap-y-6"
          >
            {[
              "Free to start",
              "No credit card",
              "Cancel anytime",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-5 h-5 bg-[#1A936F] rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm font-bold tracking-tight">{item}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════
          SECTION 10: FOOTER
          ══════════════════════════════════ */}
      <footer className="bg-[#1C1C1E] text-white pt-24 pb-12 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
            <div className="md:col-span-4">
              <Link href="/" className="flex items-center space-x-2 mb-6 group w-fit">
                <div className="w-8 h-8 rounded-full bg-[#FF6B35] flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4L4 12L12 20L20 12L12 4Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-2xl font-black tracking-tight">roamie</span>
              </Link>
              <p className="text-white/50 text-[15px] leading-[1.7] font-medium max-w-xs mb-10">
                Find Your People. Find Your Place.
              </p>
              <div className="flex gap-4">
                {[
                  { icon: <Hash className="w-5 h-5" />, label: "Twitter" },
                  { icon: <AtSign className="w-5 h-5" />, label: "Instagram" },
                  { icon: <LinkIcon className="w-5 h-5" />, label: "LinkedIn" },
                ].map((social, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.1, backgroundColor: "#FF6B35" }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={`Follow us on ${social.label}`}
                    className="w-11 h-11 bg-white/10 rounded-full flex items-center justify-center transition-colors"
                  >
                    {social.icon}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-12">
              {[
                {
                  title: "Product",
                  links: ["Features", "How It Works", "Pricing", "Changelog", "Download App"],
                },
                {
                  title: "Company",
                  links: ["About Us", "Blog", "Careers", "Press", "Contact"],
                },
                {
                  title: "Legal",
                  links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Refund Policy"],
                },
              ].map((column, i) => (
                <div key={i}>
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-8 text-white/40">
                    {column.title}
                  </h4>
                  <ul className="space-y-4">
                    {column.links.map((link) => (
                      <li key={link}>
                        <Link href="#" className="text-white/50 hover:text-white font-bold transition-colors text-sm">
                          {link}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-white/40 text-sm font-bold">
              © 2025 Roamie Technologies. All rights reserved.
            </p>
            <div className="flex gap-8">
              {["Privacy", "Terms", "Cookies"].map((item) => (
                <Link key={item} href="#" className="text-white/40 hover:text-white text-sm font-bold transition-colors">
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
