import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/resend";
import { NotificationType, createNotification } from "@/utils/notifications";
import { getWelcomeEmail, getProfileLiveEmail, getBookingConfirmationEmail, getMatchNotificationEmail } from "@/components/emails/templates";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { type, userId, data } = await request.json();

    if (!type || !userId) {
      return NextResponse.json({ error: "Missing type or userId parameters" }, { status: 400 });
    }

    // 1. Fetch user data dynamically if unprovided
    let email = data?.email;
    let name = data?.name || "Traveler";

    if (!email) {
       const { data: profile } = await supabase.from('profiles').select('email, full_name').eq('id', userId).maybeSingle();
       if (profile) {
          email = profile.email;
          name = profile.full_name || name;
       }
    }
    
    if (!email) {
       return NextResponse.json({ error: "Unable to resolve target email address" }, { status: 400 });
    }

    let subject = "Update from Roamie";
    let html = "";
    let notificationTitle = "";
    let notificationMessage = "";

    // 2. Select corresponding beautiful Template HTML via requested Action Tag
    switch (type) {
      case "WELCOME":
        subject = "Welcome to Roamie 🌍";
        html = getWelcomeEmail(name);
        notificationTitle = "Welcome to Roamie";
        notificationMessage = "Get started by building your travel profile.";
        break;
      case "PROFILE_LIVE":
        subject = "Your Roamie Profile is Live ✨";
        html = getProfileLiveEmail(name);
        notificationTitle = "Profile Online";
        notificationMessage = "You can now connect and plan trips.";
        break;
      case "BOOKING":
        subject = `Booking Confirmed: ${data?.tripName}`;
        html = getBookingConfirmationEmail(name, data?.tripName || "Amazing Trip", data?.pdfLink || "#");
        notificationTitle = "Booking Confirmed";
        notificationMessage = `Your ${data?.tripName} booking has been confirmed!`;
        break;
      case "MATCH":
        subject = "You have a new Travel Match! 🤝";
        html = getMatchNotificationEmail(name, data?.matchedUserName || "a fellow traveler");
        notificationTitle = "New Travel Match!";
        notificationMessage = `You matched with ${data?.matchedUserName}!`;
        break;
      default:
        return NextResponse.json({ error: "Unknown architectural notification type" }, { status: 400 });
    }

    // 3. Command native Resend module asynchronously logging standard parameters
    const { error: emailError } = await sendEmail({ to: email, subject, html });
    if (emailError) {
      console.error("Resend API delivery failure via Dispatcher:", emailError);
    }

    // 4. Safely track persistent notification logging for Native UI usages.
    const notifPayload = createNotification(
      userId,
      type === "MATCH" ? NotificationType.MATCH : type === "BOOKING" ? NotificationType.BOOKING : NotificationType.SYSTEM,
      notificationTitle,
      notificationMessage
    );

    // Strip volatile runtime helpers not configured natively for standard Postgres
    const { id, metadata, ...safePayload } = notifPayload as any;

    const { error: dbError } = await supabase.from('notifications').insert([{
      ...safePayload,
      user_id: userId,
      created_at: safePayload.createdAt,
      expires_at: safePayload.expiresAt
    }]);

    if (dbError) {
       console.error("Failed to insert native notification log:", dbError);
    }

    return NextResponse.json({ success: true, delivered: !emailError });
  } catch(error) {
     console.error("Notifications Route failure:", error);
     return NextResponse.json({ error: "Internal notification mapping failure" }, { status: 500 });
  }
}
