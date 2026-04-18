import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseISO } from "date-fns";

interface RequestBody {
  matchedUserId: string;
  destination: string;
  travelDates: {
    startDate: string;
    endDate: string;
  };
}

async function parseBody(request: Request): Promise<RequestBody> {
  const body = await request.json();
  if (
    !body ||
    typeof body.matchedUserId !== "string" ||
    typeof body.destination !== "string" ||
    !body.travelDates ||
    typeof body.travelDates.startDate !== "string" ||
    typeof body.travelDates.endDate !== "string"
  ) {
    throw new Error("Invalid request body.");
  }

  parseISO(body.travelDates.startDate);
  parseISO(body.travelDates.endDate);
  return body as RequestBody;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await parseBody(request);
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();
    const currentUser = authData.user;

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: existingMatch, error: findError } = await supabase
      .from("vibe_matches")
      .select("id")
      .or(`and(user_id_1.eq.${currentUser.id},user_id_2.eq.${body.matchedUserId}),and(user_id_1.eq.${body.matchedUserId},user_id_2.eq.${currentUser.id})`)
      .limit(1)
      .maybeSingle();

    if (findError) {
      return NextResponse.json({ error: findError.message }, { status: 500 });
    }

    if (existingMatch) {
      return NextResponse.json({ error: "Match request already exists." }, { status: 409 });
    }

    const { data: userTrip } = await supabase
      .from("trips")
      .select("id")
      .eq("user_id", currentUser.id)
      .eq("destination", body.destination)
      .limit(1)
      .maybeSingle();

    const { data: matchedTrip } = await supabase
      .from("trips")
      .select("id")
      .eq("user_id", body.matchedUserId)
      .eq("destination", body.destination)
      .limit(1)
      .maybeSingle();

    const tripId = userTrip?.id || matchedTrip?.id;
    if (!tripId) {
      return NextResponse.json({ error: "Unable to find a matching trip for this destination." }, { status: 400 });
    }

    const { data: matchScoreData } = await supabase
      .from("profiles")
      .select("user_id,vibe_tags,travel_style,budget_range")
      .in("user_id", [currentUser.id, body.matchedUserId]);

    const currentProfile = matchScoreData?.find((item: { user_id: string }) => item.user_id === currentUser.id) as {
      vibe_tags?: string[];
      travel_style?: string[];
      budget_range?: { min: number; max: number };
    } | undefined;
    const matchedProfile = matchScoreData?.find((item: { user_id: string }) => item.user_id === body.matchedUserId) as {
      vibe_tags?: string[];
      travel_style?: string[];
      budget_range?: { min: number; max: number };
    } | undefined;

    const sharedTags = currentProfile?.vibe_tags?.filter((tag: string) => matchedProfile?.vibe_tags?.includes(tag)) ?? [];
    const sameStyle = currentProfile?.travel_style?.some((style) => matchedProfile?.travel_style?.includes(style)) ?? false;
    const budgetOverlap = Boolean(
      currentProfile?.budget_range &&
        matchedProfile?.budget_range &&
        Math.max(currentProfile.budget_range.min, matchedProfile.budget_range.min) <=
          Math.min(currentProfile.budget_range.max, matchedProfile.budget_range.max)
    );

    const score = Math.min(100, sharedTags.length * 10 + (sameStyle ? 15 : 0) + (budgetOverlap ? 20 : 0) + 20);

    const { data: inserted, error: insertError } = await supabase
      .from("vibe_matches")
      .insert([
        {
          trip_id: tripId,
          user_id_1: currentUser.id,
          user_id_2: body.matchedUserId,
          status: "pending",
          match_score: score,
          shared_interests: sharedTags,
          matched_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select("id")
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, matchId: inserted.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to process request.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
