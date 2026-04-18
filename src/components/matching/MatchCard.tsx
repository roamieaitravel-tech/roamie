"use client";

import { Calendar, DollarSign, MapPin, ShieldCheck } from "lucide-react";

export interface MatchProfile {
  id: string;
  name: string;
  location: string;
  verified: boolean;
  matchScore: number;
  destination: string;
  travelDates: string;
  budgetRange: string;
  vibeTags: string[];
  sharedInterests: string[];
  bio?: string;
  upcomingTrips: { destination: string; dates: string }[];
}

interface MatchCardProps {
  profile: MatchProfile;
  requestSent?: boolean;
  onConnect: () => void;
  onViewProfile: () => void;
}

const matchBadge = (score: number) => {
  if (score >= 90) {
    return { label: "Top Match", badgeClass: "bg-emerald-500 text-white" };
  }
  if (score >= 75) {
    return { label: "Great Match", badgeClass: "bg-sky-500 text-white" };
  }
  return { label: "Good Match", badgeClass: "bg-slate-200 text-slate-700" };
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .slice(0, 2)
    .map((segment) => segment.charAt(0).toUpperCase())
    .join("");
};

export default function MatchCard({ profile, requestSent, onConnect, onViewProfile }: MatchCardProps) {
  const badge = matchBadge(profile.matchScore);

  return (
    <div className="rounded-2xl border border-[#F0F0F0] bg-white shadow-sm">
      <div className="relative p-6">
        <div className={`absolute right-6 top-6 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${badge.badgeClass}`}>
          {badge.label}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-700 text-xl font-bold text-white">
            {getInitials(profile.name)}
          </div>
          <div className="min-w-0">
            <p className="text-lg font-semibold text-slate-900">{profile.name}</p>
            <p className="mt-1 text-sm text-slate-500">{profile.location}</p>
          </div>
          {profile.verified ? (
            <div className="ml-auto inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              Verified
            </div>
          ) : null}
        </div>

        <div className="mt-6 space-y-4 text-sm text-slate-600">
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-orange-500" />
            <span>Heading to:</span>
            <span className="font-semibold text-slate-900">{profile.destination}</span>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-slate-500" />
            <span>{profile.travelDates}</span>
          </div>
          <div className="flex items-center gap-3">
            <DollarSign className="h-4 w-4 text-slate-500" />
            <span>{profile.budgetRange}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 px-6 py-5">
        <div className="flex flex-wrap gap-2">
          {profile.vibeTags.slice(0, 4).map((tag) => (
            <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-6 rounded-2xl bg-slate-50 p-4">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>Vibe Compatibility</span>
            <span className="font-semibold text-slate-900">{profile.matchScore}%</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-orange-500" style={{ width: `${profile.matchScore}%` }} />
          </div>
        </div>

        <div className="mt-6 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">You both love:</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {profile.sharedInterests.slice(0, 3).map((interest) => (
              <span key={interest} className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                {interest}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onConnect}
            disabled={requestSent}
            className={`inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold text-white transition ${
              requestSent ? "bg-slate-300 text-slate-700 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"
            }`}
          >
            {requestSent ? "Request Sent" : "Connect"}
          </button>
          <button
            type="button"
            onClick={onViewProfile}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
}
