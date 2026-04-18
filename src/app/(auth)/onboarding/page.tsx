"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Loader2, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { TravelStyle } from "@/types/database";

// ============================================
// TYPES
// ============================================

interface OnboardingData {
  firstName: string;
  homeCountry: string;
  homeCity: string;
  homeAirport: string;
  profilePhoto: File | null;
  profilePhotoUrl: string | null;
  travelStyle: TravelStyle | null;
  vibeTags: string[];
}

type TravelStyleType = "budget" | "comfort" | "luxury";

interface TravelStyleCard {
  id: TravelStyleType;
  emoji: string;
  title: string;
  description: string;
}

interface VibeTag {
  id: string;
  emoji: string;
  label: string;
}

// ============================================
// CONSTANTS
// ============================================

const TRAVEL_STYLES: TravelStyleCard[] = [
  {
    id: "budget",
    emoji: "🎒",
    title: "Budget Explorer",
    description: "Hostels, local food,\nmaximum adventure",
  },
  {
    id: "comfort",
    emoji: "🏨",
    title: "Comfort Seeker",
    description: "Good hotels, mix of\nlocal and comfortable",
  },
  {
    id: "luxury",
    emoji: "✨",
    title: "Luxury Traveler",
    description: "Best hotels, premium\nexperiences",
  },
];

const VIBE_TAGS: VibeTag[] = [
  { id: "beach", emoji: "🏖️", label: "Beach" },
  { id: "hiking", emoji: "🥾", label: "Hiking" },
  { id: "foodie", emoji: "🍜", label: "Foodie" },
  { id: "photography", emoji: "📸", label: "Photography" },
  { id: "music", emoji: "🎵", label: "Music" },
  { id: "culture", emoji: "🎭", label: "Culture" },
  { id: "nightlife", emoji: "🎉", label: "Nightlife" },
  { id: "wellness", emoji: "🧘", label: "Wellness" },
  { id: "wildlife", emoji: "🦁", label: "Wildlife" },
  { id: "art", emoji: "🎨", label: "Art" },
  { id: "adventure", emoji: "🏄", label: "Adventure" },
  { id: "roadtrips", emoji: "🚂", label: "Road Trips" },
  { id: "shopping", emoji: "🛍️", label: "Shopping" },
  { id: "gaming", emoji: "🎮", label: "Gaming" },
  { id: "history", emoji: "📚", label: "History" },
  { id: "nature", emoji: "🌿", label: "Nature" },
];

const COUNTRIES = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Argentina",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Cape Verde",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "East Timor",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hong Kong",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Korea, North",
  "Korea, South",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

// ============================================
// COMPONENT
// ============================================

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  const [formData, setFormData] = useState<OnboardingData>({
    firstName: "",
    homeCountry: "",
    homeCity: "",
    homeAirport: "",
    profilePhoto: null,
    profilePhotoUrl: null,
    travelStyle: null,
    vibeTags: [],
  });

  // ============================================
  // HANDLERS
  // ============================================

  const handleInputChange = (
    field: keyof OnboardingData,
    value: string | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError(null);
  };

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          profilePhoto: file,
          profilePhotoUrl: event.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStyleSelect = (style: TravelStyleType) => {
    setFormData((prev) => ({
      ...prev,
      travelStyle: style,
    }));
  };

  const handleVibeToggle = (vibeId: string) => {
    setFormData((prev) => ({
      ...prev,
      vibeTags: prev.vibeTags.includes(vibeId)
        ? prev.vibeTags.filter((id) => id !== vibeId)
        : prev.vibeTags.length < 6
          ? [...prev.vibeTags, vibeId]
          : prev.vibeTags,
    }));
  };

  const handleNextStep = () => {
    // Validation
    if (currentStep === 1 && !formData.firstName.trim()) {
      setError("Please enter your name");
      return;
    }
    if (currentStep === 2 && (!formData.homeCountry || !formData.homeCity)) {
      setError("Please fill in all required fields");
      return;
    }
    if (currentStep === 3 && !formData.travelStyle) {
      setError("Please select your travel style");
      return;
    }
    if (currentStep === 4 && formData.vibeTags.length === 0) {
      setError("Please select at least one vibe");
      return;
    }

    setError(null);
    setDirection("forward");
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrevStep = () => {
    setError(null);
    setDirection("backward");
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFinish = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get current user
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        setError("User not found");
        return;
      }

      // Upload profile photo if exists
      let photoUrl = null;
      if (formData.profilePhoto) {
        const fileName = `${authData.user.id}-${Date.now()}`;
        const { error: uploadError } = await supabase.storage
          .from("profile-photos")
          .upload(fileName, formData.profilePhoto);

        if (!uploadError) {
          const { data } = supabase.storage
            .from("profile-photos")
            .getPublicUrl(fileName);
          photoUrl = data.publicUrl;
        }
      }

      // Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: formData.firstName,
          country: formData.homeCountry,
          home_city: formData.homeCity,
          home_airport: formData.homeAirport || null,
          travel_style: [formData.travelStyle],
          vibe_tags: formData.vibeTags,
          avatar_url: photoUrl,
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", authData.user.id);

      if (profileError) {
        setError(profileError.message || "Failed to save profile");
        return;
      }

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // RENDER STEP CONTENT
  // ============================================

  const renderStepContent = () => {
    const variants = {
      enter: (dir: string) => ({
        x: dir === "forward" ? 1000 : -1000,
        opacity: 0,
      }),
      center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
      },
      exit: (dir: string) => ({
        zIndex: 0,
        x: dir === "forward" ? -1000 : 1000,
        opacity: 0,
      }),
    };

    return (
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentStep}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="w-full"
        >
          {currentStep === 1 && (
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-6xl mb-6"
              >
                👋
              </motion.div>
              <h2 className="text-3xl font-bold text-[#1c1c1e] mb-8">
                Hey there! What should we call you?
              </h2>
              <input
                type="text"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className="w-full px-6 py-4 text-xl border-2 border-gray-200 rounded-xl focus:border-[#FF6B35] focus:outline-none mb-6 text-center"
              />

              {/* Profile Photo Upload */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-600 mb-4">
                  Profile Photo (Optional)
                </label>
                <label className="cursor-pointer flex flex-col items-center justify-center">
                  <div
                    className={`w-24 h-24 rounded-full flex items-center justify-center border-2 border-dashed transition-colors ${
                      formData.profilePhotoUrl
                        ? "border-[#FF6B35] bg-orange-50"
                        : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    {formData.profilePhotoUrl ? (
                      <img
                        src={formData.profilePhotoUrl}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <Upload className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {error && (
                <p className="text-red-600 text-sm font-medium mb-4">
                  {error}
                </p>
              )}

              <button
                onClick={handleNextStep}
                className="w-full bg-[#FF6B35] text-white py-4 rounded-full font-bold text-lg hover:bg-[#ff5820] transition-colors flex items-center justify-center gap-2"
              >
                Continue <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-6xl mb-6"
              >
                🌍
              </motion.div>
              <h2 className="text-3xl font-bold text-[#1c1c1e] mb-8">
                Where do you travel from?
              </h2>

              {/* Country Select */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-600 mb-2 text-left">
                  Country
                </label>
                <select
                  value={formData.homeCountry}
                  onChange={(e) =>
                    handleInputChange("homeCountry", e.target.value)
                  }
                  className="w-full px-6 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FF6B35] focus:outline-none text-lg bg-white"
                >
                  <option value="">Select your country</option>
                  {COUNTRIES.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              {/* City Input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-600 mb-2 text-left">
                  Home City
                </label>
                <input
                  type="text"
                  placeholder="e.g. New York, Mumbai, London"
                  value={formData.homeCity}
                  onChange={(e) =>
                    handleInputChange("homeCity", e.target.value)
                  }
                  className="w-full px-6 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FF6B35] focus:outline-none text-lg"
                />
              </div>

              {/* Airport Input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-600 mb-2 text-left">
                  Nearest Airport (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. JFK, LHR, DXB"
                  value={formData.homeAirport}
                  onChange={(e) =>
                    handleInputChange("homeAirport", e.target.value)
                  }
                  className="w-full px-6 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FF6B35] focus:outline-none text-lg"
                />
              </div>

              {error && (
                <p className="text-red-600 text-sm font-medium mb-4">
                  {error}
                </p>
              )}

              <div className="flex gap-4">
                <button
                  onClick={handlePrevStep}
                  className="flex-1 border-2 border-gray-200 text-[#1c1c1e] py-4 rounded-full font-bold text-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" /> Back
                </button>
                <button
                  onClick={handleNextStep}
                  className="flex-1 bg-[#FF6B35] text-white py-4 rounded-full font-bold text-lg hover:bg-[#ff5820] transition-colors flex items-center justify-center gap-2"
                >
                  Continue <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-6xl mb-6"
              >
                🎒
              </motion.div>
              <h2 className="text-3xl font-bold text-[#1c1c1e] mb-2">
                How do you travel?
              </h2>
              <p className="text-gray-600 mb-8">Select your travel style</p>

              {/* Travel Style Cards */}
              <div className="grid grid-cols-1 gap-4 mb-6">
                {TRAVEL_STYLES.map((style) => (
                  <motion.button
                    key={style.id}
                    onClick={() => handleStyleSelect(style.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-6 rounded-2xl border-2 transition-all text-left ${
                      formData.travelStyle === style.id
                        ? "border-[#FF6B35] bg-orange-50"
                        : "border-gray-200 bg-white hover:border-orange-200"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-4xl">{style.emoji}</span>
                      <div>
                        <h3 className="text-xl font-bold text-[#1c1c1e]">
                          {style.title}
                        </h3>
                        <p className="text-gray-600 text-sm whitespace-pre-line">
                          {style.description}
                        </p>
                      </div>
                      {formData.travelStyle === style.id && (
                        <div className="ml-auto w-6 h-6 rounded-full bg-[#FF6B35] flex items-center justify-center">
                          <span className="text-white text-sm">✓</span>
                        </div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              {error && (
                <p className="text-red-600 text-sm font-medium mb-4">
                  {error}
                </p>
              )}

              <div className="flex gap-4">
                <button
                  onClick={handlePrevStep}
                  className="flex-1 border-2 border-gray-200 text-[#1c1c1e] py-4 rounded-full font-bold text-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" /> Back
                </button>
                <button
                  onClick={handleNextStep}
                  className="flex-1 bg-[#FF6B35] text-white py-4 rounded-full font-bold text-lg hover:bg-[#ff5820] transition-colors flex items-center justify-center gap-2"
                >
                  Continue <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-6xl mb-6"
              >
                🎭
              </motion.div>
              <h2 className="text-3xl font-bold text-[#1c1c1e] mb-2">
                What&apos;s your travel vibe?
              </h2>
              <p className="text-gray-600 mb-8">
                Pick all that apply (up to 6)
              </p>

              {/* Vibe Tags Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                {VIBE_TAGS.map((tag) => (
                  <motion.button
                    key={tag.id}
                    onClick={() => handleVibeToggle(tag.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`py-3 px-4 rounded-full font-semibold transition-all text-sm ${
                      formData.vibeTags.includes(tag.id)
                        ? "bg-[#FF6B35] text-white"
                        : "bg-gray-100 text-[#1c1c1e] hover:bg-gray-200"
                    } ${formData.vibeTags.length >= 6 && !formData.vibeTags.includes(tag.id) ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={
                      formData.vibeTags.length >= 6 &&
                      !formData.vibeTags.includes(tag.id)
                    }
                  >
                    <span className="mr-1">{tag.emoji}</span> {tag.label}
                  </motion.button>
                ))}
              </div>

              {error && (
                <p className="text-red-600 text-sm font-medium mb-4">
                  {error}
                </p>
              )}

              <div className="flex gap-4">
                <button
                  onClick={handlePrevStep}
                  className="flex-1 border-2 border-gray-200 text-[#1c1c1e] py-4 rounded-full font-bold text-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  disabled={isLoading}
                >
                  <ChevronLeft className="w-5 h-5" /> Back
                </button>
                <button
                  onClick={handleFinish}
                  disabled={isLoading}
                  className="flex-1 bg-[#FF6B35] text-white py-4 rounded-full font-bold text-lg hover:bg-[#ff5820] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Finishing...
                    </>
                  ) : (
                    <>
                      Finish Setup 🚀
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col p-6">
      {/* Progress Bar */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          {[1, 2, 3, 4].map((step) => (
            <motion.div
              key={step}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: step * 0.1 }}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                step <= currentStep
                  ? "bg-[#FF6B35] text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {step}
            </motion.div>
          ))}
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: `${(currentStep / 4) * 100}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-[#FF6B35]"
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 flex items-center justify-center max-w-2xl mx-auto w-full">
        {renderStepContent()}
      </div>

      {/* Step Indicator */}
      <div className="mt-12 text-center text-gray-500 text-sm">
        Step {currentStep} of 4
      </div>
    </div>
  );
}
