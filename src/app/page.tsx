"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Play,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [lanternPos, setLanternPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      setScrolled(latest > 50);
    });
    return () => unsubscribe();
  }, [scrollY]);

  useEffect(() => {
    if (darkMode) {
      const handleMouseMove = (e: MouseEvent) => {
        setLanternPos({ x: e.clientX, y: e.clientY });
      };
      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }
  }, [darkMode]);

  const navBg = useTransform(
    scrollY,
    [0, 100],
    ["rgba(0,0,0,0)", "rgba(255,255,255,1)"]
  );

  const navTextColor = useTransform(scrollY, [0, 100], ["#FFFFFF", "#1C1C1E"]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${
        darkMode ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Lantern Effect for Dark Mode */}
      {darkMode && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-50"
          style={{
            background: `radial-gradient(circle 300px at ${lanternPos.x}px ${lanternPos.y}px, rgba(255, 107, 53, 0.15) 0%, rgba(255, 107, 53, 0.08) 15%, transparent 80%)`,
          }}
        />
      )}

      {/* ══════════════════════════════════ NAVBAR ══════════════════════════════════ */}
      <motion.nav
        style={{ backgroundColor: navBg }}
        className={`fixed top-0 left-0 right-0 z-40 h-[72px] backdrop-blur-sm transition-all duration-300 ${
          scrolled && !darkMode ? "shadow-lg" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full bg-[#FF6B35] flex items-center justify-center">
              <motion.div
                className="w-4 h-4 rounded-full bg-white"
                whileHover={{ scale: 1.2 }}
              />
            </div>
            <span
              style={{ color: navTextColor as any }} className="font-bold text-xl transition-colors duration-300"
            >
              roamie
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-8">
            {["Features", "How It Works", "Matching", "Pricing"].map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                style={{ color: navTextColor }}
                className="text-sm font-medium transition-colors duration-300 hover:text-[#FF6B35]"
                whileHover={{ y: -2 }}
              >
                {item}
              </motion.a>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle */}
            <motion.button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                darkMode
                  ? "bg-yellow-500 text-slate-900"
                  : "bg-gray-200 text-gray-900"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {darkMode ? "sun" : "moon"}
            </motion.button>

            <motion.a
              href="/login"
              style={{ color: navTextColor }}
              className="hidden sm:block text-sm font-medium transition-colors duration-300 hover:text-[#FF6B35]"
            >
              Sign in
            </motion.a>

            <motion.a
              href="/signup"
              className="hidden sm:block px-6 py-2 bg-[#FF6B35] text-white rounded-full font-semibold text-sm hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.a>

            {/* Mobile Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              {mobileMenuOpen ? (
                <X size={24} color={scrolled && !darkMode ? "#1C1C1E" : "white"} />
              ) : (
                <Menu size={24} color={scrolled && !darkMode ? "#1C1C1E" : "white"} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={mobileMenuOpen ? { height: "auto" } : { height: 0 }}
          className={`md:hidden overflow-hidden ${
            darkMode ? "bg-slate-900" : "bg-white"
          } border-t ${darkMode ? "border-slate-700" : "border-gray-200"}`}
        >
          <div className="px-6 py-4 space-y-3">
            {["Features", "How It Works", "Matching", "Pricing"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className={`block py-2 font-medium ${
                  darkMode ? "text-gray-300 hover:text-[#FF6B35]" : "text-gray-900 hover:text-[#FF6B35]"
                }`}
              >
                {item}
              </a>
            ))}
            <div className="pt-3 space-y-2 border-t border-gray-200">
              <a
                href="/login"
                className="block py-2 font-medium text-gray-900 hover:text-[#FF6B35]"
              >
                Sign in
              </a>
              <a
                href="/signup"
                className="block px-6 py-2 bg-[#FF6B35] text-white rounded-full font-semibold text-center"
              >
                Get Started
              </a>
            </div>
          </div>
        </motion.div>
      </motion.nav>

      {/* ══════════════════════════════════ HERO ══════════════════════════════════ */}
      <section className="relative h-screen w-full overflow-hidden pt-[72px]">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80"
            alt="Hero background"
            fill
            priority
            className="object-cover"
            quality={85}
          />
          <div className={`absolute inset-0 ${darkMode ? "bg-black/65" : "bg-black/55"}`} />
        </div>

        <div className="relative h-full flex flex-col items-center justify-center px-6 text-center">
          {/* Top Label */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md bg-white/10 border border-white/30">
              <div className="w-2 h-2 bg-[#FF6B35] rounded-full" />
              <span className="text-white text-sm font-medium">
                AI-Powered Travel Planning
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div className="max-w-3xl mb-8">
            {["Your World,", "Your Journey,", "Your Budget."].map(
              (line, idx) => (
                <motion.h1
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.15 * (idx + 1),
                  }}
                  className="text-5xl md:text-7xl font-bold text-white mb-2 leading-tight"
                >
                  {line}
                </motion.h1>
              )
            )}
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-white/70 max-w-2xl mb-10 leading-relaxed"
          >
            Roamie AI plans complete trips across flights, trains and cruises —
            finding the lowest prices and connecting you with travelers who
            share your spirit.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.75 }}
            className="flex flex-col sm:flex-row gap-4 mb-12 justify-center items-center sm:justify-start"
          >
            <Link href="/signup">
              <motion.button
                className="w-full sm:w-auto px-8 py-3 md:px-10 md:py-4 bg-[#FF6B35] text-white font-bold rounded-full text-base md:text-lg shadow-xl hover:shadow-2xl transition-shadow duration-300"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Start Planning Free
              </motion.button>
            </Link>

            <motion.button
              className="px-8 py-3 md:px-10 md:py-4 border-2 border-white text-white font-bold rounded-full text-base md:text-lg flex items-center justify-center gap-2 hover:bg-white/10 transition-colors duration-300"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Play size={20} />
              Watch How It Works
            </motion.button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-white/60 text-center"
          >
            <p className="text-sm mb-2">Scroll to explore</p>
            <ChevronDown size={24} className="mx-auto" />
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════ STATS SECTION ══════════════════════════════════ */}
      <section className="relative -mt-16 mb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={`${
              darkMode
                ? "bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700"
                : "bg-white"
            } rounded-3xl shadow-2xl p-8 md:p-12`}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: "10,000+", label: "Trips Planned" },
                { number: "$2M+", label: "Saved on Travel" },
                { number: "50,000+", label: "Happy Travelers" },
                { number: "4.9/5", label: "Average Rating" },
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <p className="text-3xl md:text-4xl font-bold mb-2 text-[#FF6B35]">
                    {stat.number}
                  </p>
                  <p className={`text-sm md:text-base ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════ FOOTER ══════════════════════════════════ */}
      <footer className={`${
        darkMode ? "bg-slate-950 border-t border-slate-800" : "bg-[#1C1C1E]"
      } text-white py-12`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#FF6B35] flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-white" />
              </div>
              <span className="font-bold text-xl">roamie</span>
            </div>
            <p className="text-white/50">© 2025 Roamie. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

