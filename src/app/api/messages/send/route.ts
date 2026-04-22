import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { sanitizeMessage } from "@/utils/chat";

const messageSchema = z.object({
  matchId: z.string().min(1, "Match ID is required"),
  recipientId: z.string().optional().nullable(),
  content: z.string().min(1, "Message cannot be empty").max(2000, "Message cannot exceed 2000 characters"),
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await request.json();
    const validated = messageSchema.parse(payload);
    
    // Sanitize the content using existing rules
    const safeContent = sanitizeMessage(validated.content);
    if (!safeContent) {
      return NextResponse.json({ error: "Message cannot be empty" }, { status: 400 });
    }

    const now = new Date().toISOString();
    
    // Insert into Supabase
    const { data, error } = await supabase.from("messages").insert([
      {
        match_id: validated.matchId,
        sender_id: authData.user.id,
        recipient_id: validated.recipientId ?? null,
        content: safeContent,
        read: false,
        created_at: now,
        updated_at: now,
      },
    ]).select().single();

    if (error) {
      console.error("Database insert error:", error);
      return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
    }

    return NextResponse.json({ message: data });
  } catch (error) {
    console.error("Message send error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
