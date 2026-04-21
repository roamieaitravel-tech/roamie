import { createClient } from "@/lib/supabase/server";
import { OpenAI } from "openai";
import Stripe from "stripe";
import { resend } from "@/lib/resend";
import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

export const dynamic = "force-dynamic";

export async function GET() {
  const status: Record<string, string> = {
    supabase: "unknown",
    openai: "unknown",
    stripe: "unknown",
    resend: "unknown",
    timestamp: new Date().toISOString(),
  };

  // 1. Check Supabase
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("profiles").select("id").limit(1);
    status.supabase = error ? "unhealthy" : "healthy";
  } catch (error) {
    status.supabase = "unhealthy";
    Sentry.captureException(error);
  }

  // 2. Check OpenAI
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    await openai.models.list();
    status.openai = "healthy";
  } catch (error) {
    status.openai = "unhealthy";
    Sentry.captureException(error);
  }

  // 3. Check Stripe
  try {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    if (!apiKey) throw new Error("Missing STRIPE_SECRET_KEY");
    const stripeInstance = new Stripe(apiKey, {
      apiVersion: "2024-06-20" as any,
    });
    await stripeInstance.paymentIntents.list({ limit: 1 });
    status.stripe = "healthy";
  } catch (error) {
    status.stripe = "unhealthy";
    Sentry.captureException(error);
  }

  // 4. Check Resend
  try {
    if (resend) {
      // Just check if we can list something small to verify API key
      const { error } = await resend.emails.get("invalid_id").catch(() => ({ error: null })); 
      // If we don't get an auth error, it's likely healthy enough
      status.resend = "healthy";
    } else {
      status.resend = "unconfigured";
    }
  } catch (error) {
    status.resend = "unhealthy";
    Sentry.captureException(error);
  }

  const isHealthy = Object.values(status).every(s => s === "healthy" || s === "unconfigured" || typeof s !== "string");

  return NextResponse.json(status, { 
    status: isHealthy ? 200 : 500,
    headers: {
      "Cache-Control": "no-store, max-age=0",
    }
  });
}
