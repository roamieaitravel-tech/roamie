"use client";

import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  Map,
  Search,
  Users,
  MessageSquare,
  Wallet,
  Bell,
  Settings,
  LogOut,
  Crown,
} from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import type { User } from "@supabase/supabase-js";

interface SidebarProps {
  activeItem?: string;
}

const navigationItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Map, label: "My Trips", href: "/dashboard/trips" },
  { icon: Search, label: "Plan Trip", href: "/dashboard/plan" },
  { icon: Users, label: "Matches", href: "/dashboard/matches" },
  { icon: MessageSquare, label: "Messages", href: "/dashboard/messages" },
  { icon: Wallet, label: "Budget", href: "/dashboard/budget" },
  { icon: Bell, label: "Alerts", href: "/dashboard/alerts" },
];

export default function Sidebar({ activeItem = "Dashboard" }: SidebarProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user ?? null);
      setLoading(false);
    };

    getUser();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-[#1C1C1E] text-white z-40 hidden md:block">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-bold">roamie</h1>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-white/10">
          {loading ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full animate-pulse" />
              <div className="flex-1">
                <div className="h-4 bg-white/20 rounded animate-pulse mb-1" />
                <div className="h-3 bg-white/20 rounded animate-pulse" />
              </div>
            </div>
          ) : user ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                {user.user_metadata?.avatar_url ? (
                  <Image
                    src={user.user_metadata.avatar_url}
                    alt="Avatar"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  user.user_metadata?.full_name?.charAt(0) || (user.email ?? "").charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user.user_metadata?.full_name ?? "Traveler"}
                </p>
                <p className="text-xs text-white/60 truncate">
                  {user.email ?? ""}
                </p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.label === activeItem;

              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${
                    isActive
                      ? "bg-[#FF6B35] text-white"
                      : "text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </a>
              );
            })}
          </div>

          <div className="border-t border-white/10 my-4" />

          <div className="space-y-1">
            <a
              href="/dashboard/settings"
              className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${
                activeItem === "Settings"
                  ? "bg-[#FF6B35] text-white"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="text-sm font-medium">Settings</span>
            </a>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-3 py-2 rounded-xl transition-colors text-white/60 hover:bg-white/10 hover:text-white w-full text-left"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </nav>

        {/* Upgrade Card */}
        <div className="p-4 border-t border-white/10">
          <div className="bg-orange-500/15 border border-orange-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-medium text-orange-400">Upgrade to Pro</span>
            </div>
            <p className="text-xs text-white/70 mb-3">
              Unlock AI features and unlimited trips
            </p>
            <button className="w-full bg-[#FF6B35] text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors">
              Upgrade
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}