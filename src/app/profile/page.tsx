"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { User, Mail, MapPin, LogOut, Settings, ChevronRight, Upload, Save, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  country: string | null;
  bio: string | null;
  avatar_url: string | null;
  vibe_tags: string[];
  travel_style: string[];
  preferred_destinations: string[];
  budget_range: { min: number; max: number } | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    full_name: "",
    bio: "",
    country: "",
  });

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const supabase = createClient();
        if (!supabase) throw new Error("Supabase not initialized");

        const { data: authData } = await supabase.auth.getUser();
        if (!authData.user) {
          router.push("/login");
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", authData.user.id)
          .maybeSingle();

        if (profileError) throw profileError;

        if (profileData) {
          setUser(profileData);
          setFormData({
            full_name: profileData.full_name || "",
            bio: profileData.bio || "",
            country: profileData.country || "",
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [router]);

  const handleSaveProfile = async () => {
    if (!user) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const supabase = createClient();
      if (!supabase) throw new Error("Supabase not initialized");

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          bio: formData.bio,
          country: formData.country,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setUser((prev) =>
        prev
          ? {
              ...prev,
              full_name: formData.full_name,
              bio: formData.bio,
              country: formData.country,
            }
          : null
      );

      setSuccess("Profile updated successfully!");
      setEditMode(false);

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      if (!supabase) throw new Error("Supabase not initialized");

      await supabase.auth.signOut();
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to logout");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="mx-auto max-w-2xl">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-center py-12"
          >
            <p className="text-slate-600">Loading profile...</p>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ChevronRight className="h-5 w-5 rotate-180" />
            Back
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
          <button
            onClick={() => (editMode ? setEditMode(false) : setEditMode(true))}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF6B35] text-white font-semibold hover:shadow-lg transition-all duration-300"
          >
            <Settings className="h-5 w-5" />
            {editMode ? "Cancel" : "Edit"}
          </button>
        </motion.div>

        {/* Error/Success Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-red-700 flex items-center gap-3"
          >
            <X className="h-5 w-5 flex-shrink-0" />
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-xl bg-green-50 border border-green-200 p-4 text-green-700"
          >
            ✓ {success}
          </motion.div>
        )}

        {/* Profile Card */}
        {user && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl bg-white shadow-lg overflow-hidden mb-6"
          >
            {/* Avatar Section */}
            <div className="relative h-32 bg-gradient-to-r from-[#FF6B35] to-orange-500">
              <div className="absolute bottom-0 left-6 translate-y-1/2">
                <div className="w-24 h-24 rounded-full border-4 border-white bg-slate-200 flex items-center justify-center overflow-hidden">
                  {user.avatar_url ? (
                    <Image
                      src={user.avatar_url}
                      alt={user.full_name || "Profile"}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-12 w-12 text-slate-400" />
                  )}
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-8 pt-16">
              {editMode ? (
                // Edit Mode
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#FF6B35] focus:outline-none transition-colors"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Bio</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#FF6B35] focus:outline-none transition-colors resize-none"
                      placeholder="Tell us about your travel style and interests..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Country</label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#FF6B35] focus:outline-none transition-colors"
                      placeholder="Your country"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#FF6B35] text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    <Save className="h-5 w-5" />
                    {saving ? "Saving..." : "Save Changes"}
                  </motion.button>
                </div>
              ) : (
                // View Mode
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-1">{user.full_name || "Traveler"}</h2>
                    <p className="text-slate-600 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {user.email}
                    </p>
                  </div>

                  {user.country && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="h-5 w-5 flex-shrink-0 text-[#FF6B35]" />
                      <span>{user.country}</span>
                    </div>
                  )}

                  {user.bio && (
                    <div>
                      <h3 className="text-sm font-semibold text-slate-700 mb-2">About</h3>
                      <p className="text-slate-600">{user.bio}</p>
                    </div>
                  )}

                  {user.vibe_tags && user.vibe_tags.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-slate-700 mb-2">Travel Vibes</h3>
                      <div className="flex flex-wrap gap-2">
                        {user.vibe_tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {user.preferred_destinations && user.preferred_destinations.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-slate-700 mb-2">Preferred Destinations</h3>
                      <div className="flex flex-wrap gap-2">
                        {user.preferred_destinations.map((dest) => (
                          <span
                            key={dest}
                            className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium"
                          >
                            {dest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Logout Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </motion.button>
      </div>
    </main>
  );
}
