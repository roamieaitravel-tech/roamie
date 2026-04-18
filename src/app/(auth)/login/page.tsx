"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/ThemeToggle";

// ============================================
// VALIDATION SCHEMA
// ============================================

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password is too long"),
});

type LoginFormData = z.infer<typeof loginSchema>;

// ============================================
// TRIP CARDS DATA
// ============================================

const tripCards = [
  {
    emoji: "✈️",
    title: "Bali Trip",
    saved: "$340",
    delay: 0,
  },
  {
    emoji: "🚂",
    title: "Europe Rail",
    saved: "$210",
    delay: 0.2,
  },
  {
    emoji: "🚢",
    title: "Caribbean",
    saved: "$480",
    delay: 0.4,
  },
];

// ============================================
// COMPONENT
// ============================================

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // ============================================
  // FORM SUBMISSION
  // ============================================

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setGeneralError(null);

      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        setGeneralError(
          error.message || "Failed to sign in. Please check your credentials."
        );
        return;
      }

      // Clear form and redirect
      reset();
      router.push("/dashboard");
    } catch (err) {
      setGeneralError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // GOOGLE OAUTH
  // ============================================

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      setGeneralError(null);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        setGeneralError(error.message || "Failed to sign in with Google");
      }
    } catch (err) {
      setGeneralError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-900 transition-colors">
      {/* Theme Toggle */}
      <ThemeToggle />

      {/* ============================================ */}
      {/* LEFT SIDE - HIDDEN ON MOBILE */}
      {/* ============================================ */}

      <div className="hidden lg:flex w-1/2 bg-[#004E89] dark:bg-gray-800 flex-col justify-center items-center p-8 relative overflow-hidden">
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#004E89] to-[#003366] dark:from-gray-800 dark:to-gray-900 opacity-50" />

        {/* Content */}
        <div className="relative z-10 text-center max-w-md">
          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-bold text-white mb-4 font-sans"
          >
            Welcome Back!
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-blue-100 dark:text-blue-200 mb-12"
          >
            Continue your journey
          </motion.p>

          {/* Trip Cards */}
          <div className="space-y-4">
            {tripCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.6,
                  delay: card.delay,
                }}
                whileHover={{
                  scale: 1.05,
                  y: -5,
                }}
                className="bg-white/10 dark:bg-gray-700/50 backdrop-blur-md border border-white/20 dark:border-gray-600/50 rounded-xl p-4 cursor-pointer hover:bg-white/20 dark:hover:bg-gray-700/70 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{card.emoji}</span>
                  <div className="text-left flex-1">
                    <p className="text-white font-semibold">{card.title}</p>
                    <p className="text-green-300 text-sm">Saved {card.saved}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Floating background elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute bottom-10 left-10 w-20 h-20 bg-white/5 dark:bg-gray-600/20 rounded-full blur-2xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
          className="absolute top-20 right-10 w-32 h-32 bg-white/5 dark:bg-gray-600/20 rounded-full blur-3xl"
        />
      </div>

      {/* ============================================ */}
      {/* RIGHT SIDE - FULL WIDTH ON MOBILE */}
      {/* ============================================ */}

      <div className="w-full lg:w-1/2 flex flex-col justify-center p-6 sm:p-8 lg:p-12 bg-white dark:bg-gray-900 transition-colors">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto w-full"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <p className="text-3xl font-bold">
              🌍{" "}
              <span className="bg-gradient-to-r from-[#FF6B35] to-[#004E89] dark:from-[#FF6B35] dark:to-[#0066CC] bg-clip-text text-transparent">
                roamie
              </span>
            </p>
          </div>

          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1c1c1e] dark:text-white mb-8 text-center">
            Sign in to your account
          </h2>

          {/* General Error Message */}
          {generalError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
            >
              <p className="text-red-600 dark:text-red-400 text-sm font-medium">{generalError}</p>
            </motion.div>
          )}

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading || isLoading}
            className="w-full flex items-center justify-center gap-2 border-2 border-[#1c1c1e] dark:border-gray-600 text-[#1c1c1e] dark:text-white py-3 rounded-full font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            {isGoogleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span className="text-lg">🔍</span>
                Continue with Google
              </>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              or continue with email
            </p>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* Email Input */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-[#1c1c1e] dark:text-white mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                {...register("email")}
                id="email"
                type="email"
                placeholder="you@example.com"
                className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg font-medium placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none transition-colors ${
                  errors.email
                    ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                    : "border-gray-200 dark:border-gray-700 focus:border-[#FF6B35] bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div className="mb-2">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-[#1c1c1e] mb-2"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                {...register("password")}
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`w-full pl-10 pr-12 py-3 border-2 rounded-lg font-medium placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none transition-colors ${
                  errors.password
                    ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                    : "border-gray-200 dark:border-gray-700 focus:border-[#FF6B35] bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1 font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="text-right mb-6">
            <a
              href="/forgot-password"
              className="text-[#FF6B35] text-sm font-semibold hover:opacity-80 transition-opacity"
            >
              Forgot password?
            </a>
          </div>

          {/* Sign In Button */}
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading || isGoogleLoading}
            className="w-full bg-[#FF6B35] text-white py-3 rounded-full font-bold text-lg hover:bg-[#ff5820] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-6"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>

          {/* Sign Up Link */}
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-[#FF6B35] font-bold hover:opacity-80 transition-opacity"
            >
              Sign up →
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
