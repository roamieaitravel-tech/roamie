import { createClient } from "@/lib/supabase/server";
import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

let stripe: Stripe | null = null;

function getStripe() {
  if (!stripe) {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    if (!apiKey) {
      throw new Error("Missing STRIPE_SECRET_KEY");
    }
    stripe = new Stripe(apiKey, {
      apiVersion: "2026-03-25.dahlia",
    });
  }
  return stripe;
}

interface PaymentRequest {
  amount: number;
  currency: string;
  description: string;
  customerEmail: string;
  metadata?: Record<string, string>;
}

export async function POST(request: NextRequest) {
  try {
    const body: PaymentRequest = await request.json();

    const {
      amount,
      currency = "usd",
      description,
      customerEmail,
      metadata = {},
    } = body;

    // Validate required fields
    if (!amount || !description || !customerEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate amount
    if (amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Create or retrieve customer
    let customerId: string;
    const { data: existingCustomer } = await supabase
      .from("stripe_customers")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();

    if (existingCustomer?.stripe_customer_id) {
      customerId = existingCustomer.stripe_customer_id;
    } else {
      // Create new customer
      const customer = await getStripe().customers.create({
        email: customerEmail,
        metadata: {
          user_id: user.id,
        },
      });
      customerId = customer.id;

      // Save customer ID
      await supabase.from("stripe_customers").insert({
        user_id: user.id,
        stripe_customer_id: customerId,
      });
    }

    // Create payment intent
    const paymentIntent = await getStripe().paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      customer: customerId,
      description,
      metadata: {
        user_id: user.id,
        ...metadata,
      },
      receipt_email: customerEmail,
    });

    // Save payment record
    await supabase.from("payments").insert({
      user_id: user.id,
      stripe_payment_intent_id: paymentIntent.id,
      amount,
      currency,
      status: paymentIntent.status,
      description,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Payment error:", error);
    const message =
      error instanceof Error ? error.message : "Payment processing failed";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

// Handle webhook events
export async function handleWebhookEvent(event: Stripe.Event) {
  const supabase = await createClient();

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const userId = paymentIntent.metadata?.user_id;

      if (userId) {
        await supabase
          .from("payments")
          .update({ status: "succeeded" })
          .eq("stripe_payment_intent_id", paymentIntent.id);

        // Create booking record
        await supabase.from("bookings").insert({
          user_id: userId,
          payment_id: paymentIntent.id,
          status: "confirmed",
          metadata: paymentIntent.metadata,
        });
      }
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const userId = paymentIntent.metadata?.user_id;

      if (userId) {
        await supabase
          .from("payments")
          .update({ status: "failed" })
          .eq("stripe_payment_intent_id", paymentIntent.id);
      }
      break;
    }

    case "charge.refunded": {
      const charge = event.data.object as Stripe.Charge;
      if (charge.payment_intent) {
        await supabase
          .from("payments")
          .update({ status: "refunded" })
          .eq("stripe_payment_intent_id", charge.payment_intent);
      }
      break;
    }
  }
}
