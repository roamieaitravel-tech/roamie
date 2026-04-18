"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, User, Mail, Lock, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/ThemeToggle";

// ============================================
// VALIDATION SCHEMA
// ============================================

const signupSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name is too long"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d)/,
        "Password must contain at least one letter and one number"
      ),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and privacy policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

// ============================================
// FEATURE PILLS DATA
// ============================================

const features = [
  {
    emoji: "🤖",
    title: "AI Plans Your Trip",
    delay: 0,
  },
  {
    emoji: "💰",
    title: "Find Lowest Prices",
    delay: 0.2,
  },
  {
    emoji: "🤝",
    title: "Meet Travel Buddies",
    delay: 0.4,
  },
];

// ============================================
// COMPONENT
// ============================================

export default function SignupPage(): React.JSX.Element {
  const router = useRouter();
  const supabase = createClient();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  // ============================================
  // FORM SUBMISSION
  // ============================================

  const onSubmit = async (data: SignupFormData): Promise<void> => {
    try {
      setIsLoading(true);
      setGeneralError(null);
      setSuccessMessage(null);

      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          },
        },
      });

      if (error) {
        setGeneralError(error.message || "Failed to create account");
        return;
      }

      setSuccessMessage(
        "Account created! Check your email to confirm your account."
      );
      reset();

      // Redirect to onboarding after short delay
      setTimeout(() => {
        router.push("/onboarding");
      }, 2000);
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

  const handleGoogleSignUp = async (): Promise<void> => {
    try {
      setIsGoogleLoading(true);
      setGeneralError(null);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/onboarding`,
        },
      });

      if (error) {
        setGeneralError(error.message || "Failed to sign up with Google");
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
            Start Your Journey
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-blue-100 mb-12"
          >
            Join 50,000+ smart travelers
          </motion.p>

          {/* Feature Pills */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: feature.delay,
                }}
                whileHover={{
                  scale: 1.05,
                  y: -5,
                }}
                className="inline-block bg-white text-[#004E89] px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                <span className="mr-2">{feature.emoji}</span>
                {feature.title}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Floating background elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute bottom-10 left-10 w-20 h-20 bg-white bg-opacity-5 rounded-full blur-2xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
          className="absolute top-20 right-10 w-32 h-32 bg-white bg-opacity-5 rounded-full blur-3xl"
        />
      </div>

      {/* ============================================ */}
      {/* RIGHT SIDE - FULL WIDTH ON MOBILE */}
      {/* ============================================ */}

      <div className="w-full lg:w-1/2 flex flex-col justify-center p-6 sm:p-8 lg:p-12 overflow-y-auto max-h-screen bg-white dark:bg-gray-900 transition-colors">
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
            Create your account
          </h2>

          {/* Success Message */}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-gap-2"
            >
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mr-2" />
              <p className="text-green-600 dark:text-green-400 text-sm font-medium">
                {successMessage}
              </p>
            </motion.div>
          )}

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

          {/* Google Sign Up Button */}
          <button
            onClick={handleGoogleSignUp}
            disabled={isGoogleLoading || isLoading}
            className="w-full flex items-center justify-center gap-2 border-2 border-[#1c1c1e] dark:border-gray-600 text-[#1c1c1e] dark:text-white py-3 rounded-full font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            {isGoogleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span className="text-lg">🔍</span>
                Sign up with Google
              </>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              or sign up with email
            </p>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* Full Name Input */}
          <div className="mb-4">
            <label
              htmlFor="fullName"
              className="block text-sm font-semibold text-[#1c1c1e] dark:text-white mb-2"
            >
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                {...register("fullName")}
                id="fullName"
                type="text"
                placeholder="John Doe"
                className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg font-medium placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none transition-colors ${
                  errors.fullName
                    ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                    : "border-gray-200 dark:border-gray-700 focus:border-[#FF6B35] bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                }`}
              />
            </div>
            {errors.fullName && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1 font-medium">
                {errors.fullName.message}
              </p>
            )}
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
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-[#1c1c1e] dark:text-white mb-2"
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

          {/* Confirm Password Input */}
          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-semibold text-[#1c1c1e] dark:text-white mb-2"
            >
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                {...register("confirmPassword")}
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`w-full pl-10 pr-12 py-3 border-2 rounded-lg font-medium placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none transition-colors ${
                  errors.confirmPassword
                    ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                    : "border-gray-200 dark:border-gray-700 focus:border-[#FF6B35] bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1 font-medium">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Terms Checkbox */}
          <div className="mb-6">
            <label
              htmlFor="terms"
              className="flex items-start gap-3 cursor-pointer"
            >
              <input
                {...register("terms")}
                id="terms"
                type="checkbox"
                className={`mt-1 w-5 h-5 rounded accent-[#FF6B35] cursor-pointer flex-shrink-0 ${
                  errors.terms ? "border-red-500" : ""
                }`}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                I agree to the{" "}
                <a
                  href="/terms"
                  className="text-[#FF6B35] font-semibold hover:opacity-80 transition-opacity"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  className="text-[#FF6B35] font-semibold hover:opacity-80 transition-opacity"
                >
                  Privacy Policy
                </a>
              </span>
            </label>
            {errors.terms && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1 font-medium">
                {errors.terms.message}
              </p>
            )}
          </div>

          {/* Create Account Button */}
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading || isGoogleLoading}
            className="w-full bg-[#FF6B35] text-white py-3 rounded-full font-bold text-lg hover:bg-[#ff5820] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-6"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </button>

          {/* Sign In Link */}
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-[#FF6B35] font-bold hover:opacity-80 transition-opacity"
            >
              Sign in &rarr;
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
