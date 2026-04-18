import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { differenceInCalendarDays, parseISO } from "date-fns";

interface BudgetRange {
  min: number;
  max: number;
}

interface ProfileRow {
  id: string;
  user_id: string;
  full_name: string | null;
  country: string | null;
  verified: boolean | null;
  vibe_tags?: string[];
  travel_style?: string[];
  preferred_destinations?: string[];
  budget_range?: BudgetRange;
  bio?: string | null;
}

interface TripRow {
  id: string;
  user_id: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget: number;
  is_public?: boolean | null;
}

function formatDateLabel(startDate: string, endDate: string): string {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  return `${start.toLocaleDateString(undefined, options)} - ${end.toLocaleDateString(undefined, options)} (${differenceInCalendarDays(end, start) + 1} days)`;
}

function calculateOverlapScore(requestStart: string, requestEnd: string, candidateStart: string, candidateEnd: string): number {
  const start = parseISO(requestStart);
  const end = parseISO(requestEnd);
  const candidateStartDate = parseISO(candidateStart);
  const candidateEndDate = parseISO(candidateEnd);

  const overlapStart = candidateStartDate > start ? candidateStartDate : start;
  const overlapEnd = candidateEndDate < end ? candidateEndDate : end;
  if (overlapEnd < overlapStart) {
    return 0;
  }

  const overlapDays = differenceInCalendarDays(overlapEnd, overlapStart) + 1;
  const totalDays = differenceInCalendarDays(end, start) + 1;
  const ratio = Math.min(1, overlapDays / Math.max(totalDays, 1));
  return Math.round(ratio * 15);
}

function calculateVibeScore(sharedTags: string[], sameStyle: boolean, budgetOverlap: boolean, overlapScore: number): number {
  const tagScore = Math.min(sharedTags.length, 5) * 10;
  const styleScore = sameStyle ? 15 : 0;
  const budgetScore = budgetOverlap ? 20 : 0;
  return Math.min(100, tagScore + styleScore + budgetScore + overlapScore);
}

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const url = new URL(request.url);
    const destination = url.searchParams.get("destination") || "Bali";
    const startDate = url.searchParams.get("startDate") || new Date().toISOString().slice(0, 10);
    const endDate = url.searchParams.get("endDate") || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const budgetMin = Number(url.searchParams.get("budgetMin") ?? 400);
    const budgetMax = Number(url.searchParams.get("budgetMax") ?? 1500);

    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();
    const currentUser = authData.user;
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id,user_id,full_name,country,verified,vibe_tags,travel_style,preferred_destinations,budget_range,bio")
      .eq("user_id", currentUser.id)
      .maybeSingle();

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    const userVibeTags = profileData?.vibe_tags ?? [];
    const userTravelStyles = profileData?.travel_style ?? [];
    const userBudgetRange = profileData?.budget_range ?? { min: 400, max: 1500 };

    const { data: tripsData, error: tripsError } = await supabase
      .from("trips")
      .select("id,user_id,destination,start_date,end_date,budget,is_public")
      .eq("destination", destination)
      .neq("user_id", currentUser.id)
      .order("start_date", { ascending: true })
      .limit(200);

    if (tripsError) {
      return NextResponse.json({ error: tripsError.message }, { status: 500 });
    }

    const { data: matchData, error: matchError } = await supabase
      .from("vibe_matches")
      .select("user_id_1,user_id_2")
      .or(`user_id_1.eq.${currentUser.id},user_id_2.eq.${currentUser.id}`);

    if (matchError) {
      return NextResponse.json({ error: matchError.message }, { status: 500 });
    }

    const alreadyMatchedUserIds = new Set<string>();
    matchData?.forEach((item: { user_id_1: string | null; user_id_2: string | null }) => {
      const userA = item.user_id_1 as string;
      const userB = item.user_id_2 as string;
      alreadyMatchedUserIds.add(userA === currentUser.id ? userB : userA);
    });

    const candidateUserIds = Array.from(new Set(tripsData?.map((trip: { user_id: string }) => trip.user_id) ?? []));
    const { data: profilesData, error: profilesError } = await supabase
      .from("profiles")
      .select("id,user_id,full_name,country,verified,vibe_tags,travel_style,preferred_destinations,budget_range,bio")
      .in("user_id", candidateUserIds);

    if (profilesError) {
      return NextResponse.json({ error: profilesError.message }, { status: 500 });
    }

    const profileByUserId = new Map<string, ProfileRow>(profilesData?.map((profile: ProfileRow) => [profile.user_id, profile]) ?? []);

    const results = (tripsData ?? [])
      .filter((trip: TripRow) => {
        if (!trip.is_public) {
          return false;
        }
        if (alreadyMatchedUserIds.has(trip.user_id)) {
          return false;
        }
        const profile = profileByUserId.get(trip.user_id);
        if (!profile) {
          return false;
        }
        const candidateStart = parseISO(trip.start_date);
        const candidateEnd = parseISO(trip.end_date);
        const requestedStart = parseISO(startDate);
        const requestedEnd = parseISO(endDate);
        const windowStart = new Date(requestedStart.getTime() - 5 * 24 * 60 * 60 * 1000);
        const windowEnd = new Date(requestedEnd.getTime() + 5 * 24 * 60 * 60 * 1000);

        if (candidateEnd < windowStart || candidateStart > windowEnd) {
          return false;
        }

        return !(trip.budget < budgetMin || trip.budget > budgetMax);
      })
      .map((trip: TripRow) => {
        const profile = profileByUserId.get(trip.user_id)!;
        const sharedTags = profile.vibe_tags?.filter((tag: string) => userVibeTags.includes(tag)) ?? [];
        const sameStyle = profile.travel_style?.some((style: string) => userTravelStyles.includes(style)) ?? false;
        const overlapScore = calculateOverlapScore(startDate, endDate, trip.start_date, trip.end_date);
        const budgetOverlap = trip.budget >= Math.max(budgetMin, userBudgetRange.min) && trip.budget <= Math.min(budgetMax, userBudgetRange.max);
        const score = calculateVibeScore(sharedTags, sameStyle, budgetOverlap, overlapScore);

        return {
          id: profile.user_id,
          name: profile.full_name || "Traveler",
          location: profile.country || "Global",
          verified: Boolean(profile.verified),
          matchScore: score,
          destination: trip.destination,
          travelDates: formatDateLabel(trip.start_date, trip.end_date),
          budgetRange: `$${Math.round(Math.max(trip.budget - 100, 300))} - $${Math.round(trip.budget + 100)} per person`,
          vibeTags: profile.vibe_tags ?? ["Adventure", "Culture", "Relaxation", "Cuisine"],
          sharedInterests: sharedTags.slice(0, 3),
          bio: profile.bio || "An engaged traveler with similar interests and a passion for exploring new destinations.",
          upcomingTrips: [
            {
              destination: trip.destination,
              dates: formatDateLabel(trip.start_date, trip.end_date),
            },
          ],
        };
      })
      .sort((a: { matchScore: number }, b: { matchScore: number }) => b.matchScore - a.matchScore)
      .slice(0, 20);

    return NextResponse.json({ results });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to process request";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
