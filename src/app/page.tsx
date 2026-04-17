"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

const stats = [
  "10,000+ Trips Planned",
  "₹2Cr+ Saved",
  "50,000+ Travelers",
  "4.9★ Rating",
];

const deals = [
  {
    route: "✈️ Delhi → Paris",
    price: "₹32,000",
    original: "was ₹52,000",
    savings: "Save ₹20,000",
  },
  {
    route: "🚂 Mumbai → Goa",
    price: "₹800",
    original: "was ₹2,400",
    savings: "Save ₹1,600",
  },
  {
    route: "🚢 Chennai → Andamans",
    price: "₹18,000",
    original: "was ₹32,000",
    savings: "Save ₹14,000",
  },
];

const steps = [
  {
    number: "01.",
    title: "Tell Roamie AI 🗣️",
    description:
      "Just say where you want to go and your budget — that's it.",
  },
  {
    number: "02.",
    title: "AI Finds Best Deals 🤖",
    description:
      "Searches flights, trains, ships and hotels across 500+ sites.",
  },
  {
    number: "03.",
    title: "Book & Meet Buddies 🤝",
    description:
      "One tap books everything + matches you with same-vibe travelers.",
  },
];

const travelModes = [
  {
    icon: "✈️",
    title: "By Air",
    description: "200+ airlines, cheapest fares with price prediction",
    tone: "bg-[#FF6B35]",
  },
  {
    icon: "🚂",
    title: "By Train",
    description: "Indian Railways + international trains, instant booking",
    tone: "bg-[#004E89]",
  },
  {
    icon: "🚢",
    title: "By Cruise",
    description: "Cruise packages at lowest prices guaranteed",
    tone: "bg-[#1A936F]",
  },
];

const travelers = [
  {
    name: "Arjun 🇮🇳",
    details: "Destination: Goa | Dec 20-25",
    budget: "Budget: ₹12,000",
    tags: ["🏖️ Beach", "🎵 Music", "🎉 Party"],
    match: "95% Vibe Match",
  },
  {
    name: "Sarah 🇬🇧",
    details: "Destination: Goa | Dec 21-26",
    budget: "Budget: ₹15,000",
    tags: ["📸 Photography", "🏖️ Beach", "🍜 Foodie"],
    match: "91% Match",
  },
  {
    name: "Rahul 🇮🇳",
    details: "Destination: Goa | Dec 20-27",
    budget: "Budget: ₹10,000",
    tags: ["🏄 Surfing", "🎵 Music", "🥾 Adventure"],
    match: "88% Match",
  },
];

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

export default function Home() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [waitlistMessage, setWaitlistMessage] = useState("");
  const [waitlistError, setWaitlistError] = useState("");

  useEffect(() => {
    const onScroll = () => {
      setNavScrolled(window.scrollY > 16);
    };

    onScroll();
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    const onResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [mobileMenuOpen]);

  const handleWaitlistSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);

    if (!isValidEmail) {
      setWaitlistError("Enter a valid email address to join the early access list.");
      setWaitlistMessage("");
      return;
    }

    try {
      const existingEntries = JSON.parse(
        window.localStorage.getItem("roamie_waitlist") ?? "[]",
      ) as string[];
      const alreadyJoined = existingEntries.includes(normalizedEmail);
      const nextEntries = alreadyJoined
        ? existingEntries
        : [...existingEntries, normalizedEmail];

      window.localStorage.setItem(
        "roamie_waitlist",
        JSON.stringify(nextEntries),
      );

      setWaitlistError("");
      setWaitlistMessage(
        alreadyJoined
          ? "You're already on the Roamie early access list."
          : "You're on the list. We'll reach out as soon as early access opens.",
      );
      setEmail("");
    } catch {
      setWaitlistError(
        "We couldn't save your request on this device. Please try again.",
      );
      setWaitlistMessage("");
    }
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <main className="bg-[#F7F8FC] text-[#1C1C1E]">
      <motion.header
        className={`sticky top-0 z-50 border-b border-transparent transition-all duration-300 ${
          navScrolled
            ? "bg-white/95 shadow-[0_14px_38px_rgba(0,0,0,0.08)] backdrop-blur-xl"
            : "bg-white/90"
        }`}
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-xl font-extrabold tracking-tight text-[#1C1C1E]">
            🌍 roamie
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-semibold text-[#3A4151] md:flex">
            <a href="#features" className="hover:text-[#FF6B35]">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-[#FF6B35]">
              How It Works
            </a>
            <a href="#pricing" className="hover:text-[#FF6B35]">
              Pricing
            </a>
          </nav>
          <a
            href="#pricing"
            className="inline-flex items-center justify-center rounded-full bg-[#FF6B35] px-5 py-3 text-sm font-bold text-white shadow-[0_10px_24px_rgba(255,107,53,0.35)] hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(255,107,53,0.45)]"
          >
            Start Free →
          </a>
          <button
            type="button"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#D9E1EE] text-[#1C1C1E] md:hidden"
          >
            <span className="text-lg">{mobileMenuOpen ? "✕" : "☰"}</span>
          </button>
        </div>
        {mobileMenuOpen ? (
          <div className="border-t border-[#E9EEF6] bg-white px-4 py-4 shadow-[0_16px_40px_rgba(14,30,57,0.08)] md:hidden">
            <nav className="flex flex-col gap-3 text-sm font-semibold text-[#3A4151]">
              <a href="#features" onClick={closeMobileMenu} className="rounded-2xl px-3 py-3 hover:bg-[#F7F8FC]">
                Features
              </a>
              <a href="#how-it-works" onClick={closeMobileMenu} className="rounded-2xl px-3 py-3 hover:bg-[#F7F8FC]">
                How It Works
              </a>
              <a href="#pricing" onClick={closeMobileMenu} className="rounded-2xl px-3 py-3 hover:bg-[#F7F8FC]">
                Pricing
              </a>
              <a
                href="#pricing"
                onClick={closeMobileMenu}
                className="mt-2 inline-flex items-center justify-center rounded-full bg-[#FF6B35] px-5 py-3 text-sm font-bold text-white shadow-[0_10px_24px_rgba(255,107,53,0.35)]"
              >
                Start Free →
              </a>
            </nav>
          </div>
        ) : null}
      </motion.header>

      <section className="relative overflow-hidden bg-[#004E89]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.16),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(255,107,53,0.24),_transparent_28%)]" />
        <div className="relative mx-auto flex max-w-7xl flex-col px-4 pb-18 pt-16 sm:px-6 lg:px-8 lg:pb-24 lg:pt-24">
          <RevealSection className="max-w-4xl">
            <span className="mb-5 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold tracking-[0.2em] text-white/80 uppercase">
              AI-powered budget travel
            </span>
            <h1 className="max-w-4xl text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-7xl">
              Plan Your Dream Trip
              <br />
              With <span className="text-[#FF6B35]">AI</span> — Flights, Trains
              <br />
              &amp; Cruises at Lowest Price
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#DBECFF] sm:text-xl">
              Tell us your destination and budget. Our AI plans everything,
              finds cheapest options and matches you with travel buddies.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="#pricing"
                className="inline-flex items-center justify-center rounded-full bg-[#FF6B35] px-7 py-4 text-base font-bold text-white shadow-[0_18px_45px_rgba(255,107,53,0.35)] hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(255,107,53,0.4)]"
              >
                Plan My Trip Free 🚀
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-full border border-white/60 px-7 py-4 text-base font-bold text-white hover:-translate-y-1 hover:bg-white hover:text-[#004E89]"
              >
                Watch Demo ▶
              </a>
            </div>
          </RevealSection>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {deals.map((deal, index) => (
              <motion.article
                key={deal.route}
                className="rounded-[28px] border border-[#FF6B35]/15 bg-white p-6 shadow-[0_24px_60px_rgba(0,0,0,0.14)]"
                initial={{ opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: [0, -8, 0] }}
                transition={{
                  opacity: { duration: 0.5, delay: 0.2 + index * 0.12 },
                  y: {
                    duration: 3.6,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "mirror",
                    ease: "easeInOut",
                    delay: index * 0.25,
                  },
                }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 32px 70px rgba(0,0,0,0.18)",
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-extrabold text-[#1C1C1E]">
                      {deal.route}
                    </p>
                    <p className="mt-3 text-3xl font-extrabold text-[#004E89]">
                      {deal.price}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#FFF1EB] px-3 py-1 text-xs font-bold text-[#FF6B35]">
                    lowest fare
                  </span>
                </div>
                <div className="mt-5 border-t border-[#EDF1F8] pt-4">
                  <p className="text-sm text-[#7C8495] line-through">
                    {deal.original}
                  </p>
                  <p className="mt-2 inline-flex rounded-full bg-[#E8FFF7] px-3 py-1 text-sm font-bold text-[#1A936F]">
                    {deal.savings}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <RevealSection className="bg-[#FF6B35]">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 text-center sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {stats.map((stat) => (
            <div key={stat} className="text-lg font-extrabold text-white sm:text-xl">
              {stat}
            </div>
          ))}
        </div>
      </RevealSection>

      <RevealSection id="how-it-works" className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#FF6B35]">
              Simple flow
            </p>
            <h2 className="mt-4 text-3xl font-extrabold text-[#1C1C1E] sm:text-5xl">
              How Roamie Works
            </h2>
          </div>
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {steps.map((step) => (
              <motion.article
                key={step.number}
                whileHover={{ scale: 1.02, y: -6 }}
                className="rounded-[32px] border border-[#E8EDF6] bg-[#FDFEFF] p-8 shadow-[0_18px_50px_rgba(0,48,87,0.08)]"
              >
                <p className="text-5xl font-black text-[#D6E0EE]">{step.number}</p>
                <h3 className="mt-6 text-2xl font-extrabold text-[#1C1C1E]">
                  {step.title}
                </h3>
                <p className="mt-4 text-base leading-8 text-[#596273]">
                  {step.description}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </RevealSection>

      <RevealSection className="bg-[#EEF2F7]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#004E89]">
              Travel modes
            </p>
            <h2 className="mt-4 text-3xl font-extrabold text-[#1C1C1E] sm:text-5xl">
              Every Way To Get There
            </h2>
          </div>
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {travelModes.map((mode) => (
              <motion.article
                key={mode.title}
                whileHover={{ scale: 1.03, y: -8 }}
                className="rounded-[32px] bg-white p-8 shadow-[0_22px_55px_rgba(17,35,62,0.1)]"
              >
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl text-3xl text-white ${mode.tone}`}
                >
                  {mode.icon}
                </div>
                <h3 className="mt-6 text-2xl font-extrabold text-[#1C1C1E]">
                  {mode.title}
                </h3>
                <p className="mt-4 text-base leading-8 text-[#5D6678]">
                  {mode.description}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </RevealSection>

      <RevealSection className="bg-[#004E89]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#A9CBF0]">
              Travel together
            </p>
            <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-5xl">
              Find Your Travel Crew 🤝
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#D9ECFF]">
              AI matches you with travelers going same place with same vibe.
            </p>
          </div>
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {travelers.map((traveler) => (
              <motion.article
                key={traveler.name}
                whileHover={{ scale: 1.03, y: -8 }}
                className="rounded-[30px] bg-white p-7 text-left shadow-[0_22px_55px_rgba(0,0,0,0.16)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-2xl font-extrabold text-[#1C1C1E]">
                    {traveler.name}
                  </h3>
                  <span className="rounded-full bg-[#E8FFF7] px-3 py-2 text-xs font-extrabold text-[#1A936F]">
                    {traveler.match}
                  </span>
                </div>
                <p className="mt-6 text-sm font-semibold text-[#4C5670]">
                  {traveler.details}
                </p>
                <p className="mt-3 text-sm font-semibold text-[#4C5670]">
                  {traveler.budget}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {traveler.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[#F4F7FB] px-3 py-2 text-sm font-semibold text-[#3E4758]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <a
              href="#pricing"
              className="inline-flex items-center justify-center rounded-full bg-[#FF6B35] px-7 py-4 text-base font-bold text-white shadow-[0_18px_45px_rgba(255,107,53,0.35)] hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(255,107,53,0.42)]"
            >
              Find My Match →
            </a>
          </div>
        </div>
      </RevealSection>

      <RevealSection id="features" className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#1A936F]">
              Core platform
            </p>
            <h2 className="mt-4 text-3xl font-extrabold text-[#1C1C1E] sm:text-5xl">
              Everything You Need
            </h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => (
              <motion.article
                key={feature.title}
                whileHover={{ scale: 1.03, y: -8 }}
                className="rounded-[28px] border border-[#E7EDF6] bg-[#FBFCFE] p-7 shadow-[0_18px_48px_rgba(12,33,58,0.08)]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF3EE] text-2xl">
                  {feature.icon}
                </div>
                <h3 className="mt-6 text-2xl font-extrabold text-[#1C1C1E]">
                  {feature.title}
                </h3>
                <p className="mt-3 text-base leading-8 text-[#5D6678]">
                  {feature.description}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </RevealSection>

      <RevealSection id="pricing" className="bg-[#F7F8FC]">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="overflow-hidden rounded-[36px] bg-[linear-gradient(135deg,#FF6B35_0%,#FF8A5B_45%,#FFB36F_100%)] p-[1px] shadow-[0_24px_70px_rgba(255,107,53,0.3)]"
          >
            <div className="rounded-[35px] bg-[linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.06))] px-6 py-12 text-center sm:px-10 lg:px-16">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-white/80">
                Early access
              </p>
              <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-5xl">
                Join 5,000+ Early Travelers
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/90">
                First 500 users get 3 months FREE
              </p>
              <form
                onSubmit={handleWaitlistSubmit}
                className="mx-auto mt-10 flex max-w-2xl flex-col gap-4 sm:flex-row"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (waitlistError) {
                      setWaitlistError("");
                    }
                    if (waitlistMessage) {
                      setWaitlistMessage("");
                    }
                  }}
                  placeholder="Enter your email"
                  aria-label="Email address"
                  required
                  className="h-14 flex-1 rounded-full border border-white/30 bg-white px-6 text-base font-semibold text-[#1C1C1E] outline-none ring-0 placeholder:text-[#7C8495] focus:border-[#004E89]"
                />
                <button
                  type="submit"
                  className="h-14 rounded-full bg-[#1C1C1E] px-8 text-base font-bold text-white hover:-translate-y-0.5 hover:bg-[#111214]"
                >
                  Get Early Access
                </button>
              </form>
              <p className="mt-4 text-sm font-semibold text-white/85">
                No credit card required
              </p>
              {waitlistError ? (
                <p className="mt-3 text-sm font-semibold text-[#2B1107]">
                  {waitlistError}
                </p>
              ) : null}
              {waitlistMessage ? (
                <p className="mt-3 text-sm font-semibold text-white">
                  {waitlistMessage}
                </p>
              ) : null}
            </div>
          </motion.div>
        </div>
      </RevealSection>

      <footer className="bg-[#1C1C1E]">
        <div className="mx-auto max-w-7xl px-4 py-16 text-white sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_repeat(4,1fr)]">
            <div>
              <Link href="/" className="text-2xl font-extrabold tracking-tight text-white">
                🌍 roamie
              </Link>
              <p className="mt-4 max-w-xs text-sm leading-7 text-white/65">
                Travel Planned. People Matched. Budget journeys, upgraded by AI.
              </p>
            </div>
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h3 className="text-sm font-bold uppercase tracking-[0.25em] text-white/80">
                  {column.title}
                </h3>
                <div className="mt-5 space-y-3 text-sm text-white/65">
                  {column.links.map((link) => (
                    <p key={link}>{link}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 border-t border-white/10 pt-6 text-sm text-white/65">
            <p>Made with ❤️ in West Bengal, India 🇮🇳</p>
            <p className="mt-2">© 2025 Roamie. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
