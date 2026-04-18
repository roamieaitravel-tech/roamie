"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Calendar, CheckCircle2, DollarSign, Loader2, MapPin, Search, ShieldCheck, X, MessageSquare, Eye } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Sidebar from "@/components/dashboard/Sidebar";
import MatchCard, { MatchProfile } from "@/components/matching/MatchCard";
import VibeCard from "@/components/matching/VibeCard";
import ChatWindow from "@/components/matching/ChatWindow";

interface ProfileSummary {
  id: string;
  user_id: string;
  full_name: string | null;
  country: string | null;
  verified: boolean | null;
  vibe_tags?: string[];
  travel_style?: string[];
  preferred_destinations?: string[];
  budget_range?: { min: number; max: number };
  bio?: string | null;
}

interface ConnectionItem {
  id: string;
  tripId: string | null;
  userId: string;
  otherUser: ProfileSummary;
  status: "pending" | "accepted" | "declined";
  direction: "sent" | "received";
  lastMessage?: string;
  matchedAt: string;
}

const DESTINATIONS = ["Bali", "Lisbon", "Tokyo", "Santorini", "Cape Town"];

const formatDate = (date: Date) => date.toISOString().slice(0, 10);

export default function MatchesPage() {
  const [activeTab, setActiveTab] = useState<"discover" | "connections">("discover");
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileSummary | null>(null);
  const [discoverLoading, setDiscoverLoading] = useState(false);
  const [connectionsLoading, setConnectionsLoading] = useState(false);
  const [matches, setMatches] = useState<MatchProfile[]>([]);
  const [requestSentIds, setRequestSentIds] = useState<Set<string>>(new Set());
  const [selectedProfile, setSelectedProfile] = useState<MatchProfile | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<ConnectionItem | null>(null);
  const [pendingSent, setPendingSent] = useState<ConnectionItem[]>([]);
  const [pendingReceived, setPendingReceived] = useState<ConnectionItem[]>([]);
  const [connected, setConnected] = useState<ConnectionItem[]>([]);
  const [destination, setDestination] = useState(DESTINATIONS[0]);
  const [startDate, setStartDate] = useState(() => formatDate(new Date()));
  const [endDate, setEndDate] = useState(() => formatDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)));
  const [budgetMax, setBudgetMax] = useState(1500);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchMatches = async (destinationValue: string, start: string, end: string, maxBudget: number) => {
    setDiscoverLoading(true);
    setErrorMessage(null);

    try {
      const params = new URLSearchParams({
        destination: destinationValue,
        startDate: start,
        endDate: end,
        budgetMin: "400",
        budgetMax: maxBudget.toString(),
      });

      const response = await fetch(`/api/find-matches?${params.toString()}`);
      const payload = await response.json();
      if (!response.ok || payload.error) {
        setErrorMessage(payload.error || "Unable to load discover matches.");
        setMatches([]);
      } else {
        setMatches(payload.results ?? []);
      }
    } catch (error) {
      setErrorMessage("Unable to load discover matches.");
      setMatches([]);
    } finally {
      setDiscoverLoading(false);
    }
  };

  const loadConnections = async (currentUserId: string) => {
    setConnectionsLoading(true);
    const supabase = createClient();

    const { data: matchesData } = await supabase
      .from("vibe_matches")
      .select("id,trip_id,user_id_1,user_id_2,status,updated_at")
      .or(`user_id_1.eq.${currentUserId},user_id_2.eq.${currentUserId}`);

    if (!matchesData) {
      setPendingSent([]);
      setPendingReceived([]);
      setConnected([]);
      setConnectionsLoading(false);
      return;
    }

    const otherUserIds = Array.from(
      new Set(
        matchesData.flatMap((match) => [match.user_id_1 as string, match.user_id_2 as string]).filter((id) => id !== currentUserId)
      )
    );

    const { data: profilesData } = await supabase
      .from("profiles")
      .select("id,user_id,full_name,country,verified,vibe_tags,bio")
      .in("user_id", otherUserIds);

    const profileById = new Map(profilesData?.map((item) => [item.user_id, item]) ?? []);

    const connections: ConnectionItem[] = matchesData.map((match) => {
      const otherId = match.user_id_1 === currentUserId ? match.user_id_2 : match.user_id_1;
      return {
        id: match.id as string,
        tripId: match.trip_id as string | null,
        userId: otherId as string,
        otherUser: profileById.get(otherId as string) ?? {
          id: "",
          user_id: otherId as string,
          full_name: "Traveler",
          country: null,
          verified: false,
        },
        status: match.status as "pending" | "accepted" | "declined",
        direction: match.user_id_1 === currentUserId ? "sent" : "received",
        lastMessage: "",
        matchedAt: match.updated_at as string,
      };
    });

    setPendingSent(connections.filter((item) => item.status === "pending" && item.direction === "sent"));
    setPendingReceived(connections.filter((item) => item.status === "pending" && item.direction === "received"));
    setConnected(connections.filter((item) => item.status === "accepted"));
    setConnectionsLoading(false);
  };

  useEffect(() => {
    const loadUser = async () => {
      const supabase = createClient();
      setConnectionsLoading(true);
      setDiscoverLoading(true);

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        setErrorMessage("Unable to load your account. Please sign in again.");
        setConnectionsLoading(false);
        setDiscoverLoading(false);
        return;
      }

      setUserId(user.id);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("id,user_id,full_name,country,verified,vibe_tags,travel_style,preferred_destinations,budget_range,bio")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData);
        if (profileData.preferred_destinations?.length) {
          setDestination(profileData.preferred_destinations[0]);
        }
        if (profileData.budget_range) {
          setBudgetMax(profileData.budget_range.max);
        }
      }

      await fetchMatches(destination, startDate, endDate, budgetMax);
      await loadConnections(user.id);
      setConnectionsLoading(false);
    };

    loadUser();
  }, []);

  const handleFilter = async () => {
    await fetchMatches(destination, startDate, endDate, budgetMax);
  };

  const handleConnect = async (profileItem: MatchProfile) => {
    if (requestSentIds.has(profileItem.id)) {
      return;
    }

    try {
      const response = await fetch("/api/send-match-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchedUserId: profileItem.id,
          destination: profileItem.destination,
          travelDates: {
            startDate: startDate,
            endDate: endDate,
          },
        }),
      });

      const payload = await response.json();
      if (!response.ok || payload.error) {
        setErrorMessage(payload.error || "Unable to send request.");
        return;
      }

      setRequestSentIds((current) => new Set(current).add(profileItem.id));
    } catch {
      setErrorMessage("Unable to send request.");
    }
  };

  const handleAccept = async (item: ConnectionItem) => {
    const supabase = createClient();
    await supabase.from("vibe_matches").update({ status: "accepted" }).eq("id", item.id);
    if (userId) {
      await loadConnections(userId);
    }
  };

  const handleDecline = async (item: ConnectionItem) => {
    const supabase = createClient();
    await supabase.from("vibe_matches").update({ status: "declined" }).eq("id", item.id);
    if (userId) {
      await loadConnections(userId);
    }
  };

  const handleCancel = async (item: ConnectionItem) => {
    const supabase = createClient();
    await supabase.from("vibe_matches").delete().eq("id", item.id);
    if (userId) {
      await loadConnections(userId);
    }
  };

  const vibeTags = profile?.vibe_tags ?? ["Adventure", "Local Food", "Culture", "Beach"];
  const vibeName = profile?.full_name ?? "Traveler";
  const tripsCount = 3;

  const connectionSummary = useMemo(() => {
    return {
      totalPending: pendingSent.length + pendingReceived.length,
      totalConnected: connected.length,
    };
  }, [pendingReceived.length, pendingSent.length, connected.length]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar activeItem="Matches" />
      <div className="md:pl-64">
        <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
          <div className="mx-auto flex max-w-[1300px] flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-orange-500">Travel Matches</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">Travelers heading to the same places as you</h1>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {(["discover", "connections"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    activeTab === tab
                      ? "text-slate-900 border-b-2 border-orange-500"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {tab === "discover" ? "Discover" : "My Connections"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <main className="mx-auto max-w-[1300px] px-5 py-8">
          <div className="grid gap-8 xl:grid-cols-[1.6fr_0.95fr]">
            <div className="space-y-8">
              <VibeCard name={vibeName} vibeTags={vibeTags} score={78} tripsCount={tripsCount} onEdit={() => {}} />

              {activeTab === "discover" ? (
                <section className="rounded-3xl bg-white p-6 shadow-sm">
                  <div className="grid gap-4 xl:grid-cols-[1.5fr_0.9fr]">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <label className="space-y-2 text-sm font-medium text-slate-700">
                        Destination
                        <select
                          value={destination}
                          onChange={(event) => setDestination(event.target.value)}
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none"
                        >
                          {DESTINATIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="space-y-2 text-sm font-medium text-slate-700">
                        Start date
                        <input
                          type="date"
                          value={startDate}
                          onChange={(event) => setStartDate(event.target.value)}
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none"
                        />
                      </label>
                      <label className="space-y-2 text-sm font-medium text-slate-700">
                        End date
                        <input
                          type="date"
                          value={endDate}
                          onChange={(event) => setEndDate(event.target.value)}
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none"
                        />
                      </label>
                      <div className="space-y-2 text-sm font-medium text-slate-700">
                        <span>Budget range</span>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                          <div className="flex items-center justify-between text-sm text-slate-600">
                            <span>$400</span>
                            <span>${budgetMax}</span>
                          </div>
                          <input
                            type="range"
                            min={400}
                            max={3000}
                            step={50}
                            value={budgetMax}
                            onChange={(event) => setBudgetMax(Number(event.target.value))}
                            className="mt-3 w-full accent-orange-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-end justify-end">
                      <button
                        type="button"
                        onClick={handleFilter}
                        className="inline-flex items-center justify-center rounded-3xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                      >
                        <Search className="mr-2 h-4 w-4" />
                        Filter
                      </button>
                    </div>
                  </div>
                </section>
              ) : null}

              {activeTab === "discover" ? (
                <section className="rounded-3xl bg-white p-6 shadow-sm">
                  <div className="mb-6 flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-2xl font-semibold text-slate-900">Discover matches</h2>
                      <p className="mt-2 text-sm text-slate-500">
                        Find travel companions with similar interests and overlapping trips.
                      </p>
                    </div>
                    <div className="rounded-3xl bg-slate-100 px-4 py-2 text-sm text-slate-700">
                      {matches.length} results
                    </div>
                  </div>

                  {discoverLoading ? (
                    <div className="grid gap-6 md:grid-cols-2">
                      {[...Array(4)].map((_, index) => (
                        <div key={index} className="h-96 animate-pulse rounded-3xl bg-slate-100" />
                      ))}
                    </div>
                  ) : errorMessage ? (
                    <div className="rounded-3xl border border-orange-100 bg-orange-50 p-6 text-sm text-orange-700">
                      {errorMessage}
                    </div>
                  ) : matches.length === 0 ? (
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center text-slate-700">
                      <p className="text-lg font-semibold">No matches found</p>
                      <p className="mt-2 text-sm text-slate-500">Try adjusting your destination or budget filter to find more travelers.</p>
                    </div>
                  ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                      {matches.map((match) => (
                        <MatchCard
                          key={match.id}
                          profile={match}
                          requestSent={requestSentIds.has(match.id)}
                          onConnect={() => handleConnect(match)}
                          onViewProfile={() => setSelectedProfile(match)}
                        />
                      ))}
                    </div>
                  )}
                </section>
              ) : (
                <section className="space-y-8">
                  <div className="rounded-3xl bg-white p-6 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-semibold text-slate-900">Pending requests</h2>
                        <p className="mt-2 text-sm text-slate-500">Manage the requests you sent and received.</p>
                      </div>
                      <div className="rounded-3xl bg-slate-100 px-4 py-2 text-sm text-slate-700">
                        {connectionSummary.totalPending} pending
                      </div>
                    </div>

                    <div className="mt-6 space-y-4">
                      {connectionsLoading ? (
                        <div className="grid gap-4">
                          {[...Array(2)].map((_, index) => (
                            <div key={index} className="h-28 rounded-3xl bg-slate-100 animate-pulse" />
                          ))}
                        </div>
                      ) : (
                        <>
                          {pendingSent.length === 0 && pendingReceived.length === 0 ? (
                            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-700">
                              No pending match requests yet.
                            </div>
                          ) : null}

                          {pendingSent.length > 0 ? (
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold text-slate-900">Sent requests</h3>
                              <div className="space-y-3">
                                {pendingSent.map((item) => (
                                  <div key={item.id} className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                      <p className="text-sm font-semibold text-slate-900">{item.otherUser.full_name}</p>
                                      <p className="text-sm text-slate-500">Waiting for response</p>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleCancel(item)}
                                      className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                    >
                                      Cancel Request
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : null}

                          {pendingReceived.length > 0 ? (
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold text-slate-900">Received requests</h3>
                              <div className="space-y-3">
                                {pendingReceived.map((item) => (
                                  <div key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                      <div>
                                        <p className="text-sm font-semibold text-slate-900">{item.otherUser.full_name}</p>
                                        <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                                          New Request!
                                        </span>
                                      </div>
                                      <div className="flex flex-wrap gap-3">
                                        <button
                                          type="button"
                                          onClick={() => handleAccept(item)}
                                          className="rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
                                        >
                                          Accept
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleDecline(item)}
                                          className="rounded-2xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                                        >
                                          Decline
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : null}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="rounded-3xl bg-white p-6 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-semibold text-slate-900">Connected travelers</h2>
                        <p className="mt-2 text-sm text-slate-500">Continue conversations with your top matches.</p>
                      </div>
                      <div className="rounded-3xl bg-slate-100 px-4 py-2 text-sm text-slate-700">
                        {connected.length} connected
                      </div>
                    </div>

                    <div className="mt-6 space-y-4">
                      {connected.length === 0 ? (
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-700">
                          No active connections yet. Accept a request to start chatting.
                        </div>
                      ) : (
                        connected.map((item) => (
                          <div key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                <p className="text-sm font-semibold text-slate-900">{item.otherUser.full_name}</p>
                                <p className="mt-1 text-sm text-slate-500">{item.otherUser.country || "International"}</p>
                                <p className="mt-2 text-sm text-slate-500">{item.lastMessage || "Say hello to your travel partner."}</p>
                              </div>
                              <div className="flex flex-wrap gap-3">
                                <button
                                  type="button"
                                  onClick={() => setSelectedConnection(item)}
                                  className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
                                >
                                  <MessageSquare className="h-4 w-4" />
                                  Message
                                </button>
                                <button
                                  type="button"
                                  onClick={() => window.open(item.tripId ? `/trips/${item.tripId}` : "/dashboard/trips", "_blank")}
                                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                  <Eye className="h-4 w-4" />
                                  View Trip
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </section>
              )}
            </div>

            <aside className="space-y-6">
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900">Match summary</h2>
                <div className="mt-5 space-y-4 text-sm text-slate-600">
                  <div className="flex items-center justify-between rounded-3xl bg-slate-50 px-4 py-3">
                    <span>Filter destination</span>
                    <span className="font-semibold text-slate-900">{destination}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-3xl bg-slate-50 px-4 py-3">
                    <span>Search window</span>
                    <span className="font-semibold text-slate-900">{startDate} → {endDate}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-3xl bg-slate-50 px-4 py-3">
                    <span>Budget cap</span>
                    <span className="font-semibold text-slate-900">${budgetMax}</span>
                  </div>
                  <div className="rounded-3xl bg-orange-50 px-4 py-4 text-sm text-orange-700">
                    <p className="font-semibold">Connections</p>
                    <p className="mt-2">{connectionSummary.totalConnected} active / {connectionSummary.totalPending} pending</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900">Your vibe</h2>
                <div className="mt-5 space-y-3 text-sm text-slate-600">
                  {vibeTags.map((tag) => (
                    <div key={tag} className="rounded-2xl bg-slate-50 px-4 py-3">
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>

      {selectedProfile ? (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/50 px-5 py-10">
          <div className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-700 text-3xl font-bold text-white">
                  {selectedProfile.name
                    .split(" ")
                    .slice(0, 2)
                    .map((segment) => segment.charAt(0).toUpperCase())
                    .join("")}
                </div>
                <div>
                  <p className="text-2xl font-semibold text-slate-900">{selectedProfile.name}</p>
                  <div className="mt-2 flex items-center gap-3 text-sm text-slate-500">
                    {selectedProfile.verified ? (
                      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                        <ShieldCheck className="h-4 w-4" /> Verified
                      </span>
                    ) : null}
                    <span>{selectedProfile.location}</span>
                  </div>
                </div>
              </div>
              <button type="button" onClick={() => setSelectedProfile(null)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                Close
              </button>
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-6">
                <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <h3 className="text-lg font-semibold text-slate-900">About</h3>
                  <p className="text-sm leading-7 text-slate-600">{selectedProfile.bio}</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-3xl border border-slate-200 bg-white p-5">
                    <p className="text-sm text-slate-500">Trips completed</p>
                    <p className="mt-4 text-2xl font-semibold text-slate-900">{Math.max(3, Math.round(selectedProfile.matchScore / 10))}</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-white p-5">
                    <p className="text-sm text-slate-500">Countries visited</p>
                    <p className="mt-4 text-2xl font-semibold text-slate-900">{Math.max(5, Math.round(selectedProfile.matchScore / 8))}</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-white p-5">
                    <p className="text-sm text-slate-500">Vibe Score</p>
                    <p className="mt-4 text-2xl font-semibold text-slate-900">{selectedProfile.matchScore}/100</p>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6">
                  <h3 className="text-lg font-semibold text-slate-900">Upcoming trips</h3>
                  <div className="mt-4 space-y-4">
                    {selectedProfile.upcomingTrips.map((trip) => (
                      <div key={trip.destination} className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                        <p className="text-sm text-slate-500">{trip.destination}</p>
                        <p className="mt-2 font-semibold text-slate-900">{trip.dates}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-white p-6">
                  <h3 className="text-lg font-semibold text-slate-900">Vibe tags</h3>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {selectedProfile.vibeTags.map((tag) => (
                      <span key={tag} className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6">
                  <h3 className="text-lg font-semibold text-slate-900">Compatibility breakdown</h3>
                  <div className="mt-4 space-y-3 text-sm text-slate-600">
                    {selectedProfile.sharedInterests.map((interest) => (
                      <div key={interest} className="flex items-center gap-3 rounded-3xl bg-slate-50 p-4">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        <span>{interest}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleConnect(selectedProfile)}
                  className="w-full rounded-3xl bg-orange-500 px-6 py-4 text-sm font-semibold text-white transition hover:bg-orange-600"
                >
                  Send Connection Request
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {selectedConnection ? (
        <ChatWindow
          open={Boolean(selectedConnection)}
          matchId={selectedConnection.id}
          matchName={selectedConnection.otherUser.full_name ?? "Traveler"}
          currentUserId={userId ?? ""}
          recipientId={selectedConnection.otherUser.user_id}
          onClose={() => setSelectedConnection(null)}
        />
      ) : null}
    </div>
  );
}
