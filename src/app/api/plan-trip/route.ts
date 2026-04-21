import { OpenAI } from "openai";
import { createClient } from "@/lib/supabase/server";

const systemPrompt = `You are Roamie AI, the world's best budget travel planning expert.
Your mission: Create the most value-packed trip plan possible within the given budget.

Return only valid JSON. Do not include markdown or explanatory text.

The JSON object must include:
{
  "tripSummary": {
    "destination": string,
    "duration": string,
    "totalCost": number,
    "savings": number,
    "currency": string
  },
  "transportOptions": [
    {
      "type": string,
      "provider": string,
      "route": string,
      "departureTime": string,
      "arrivalTime": string,
      "duration": string,
      "price": number,
      "class": string,
      "highlights": [string],
      "bookingUrl": string,
      "badge": string
    }
  ],
  "hotelOptions": [
    {
      "name": string,
      "type": string,
      "location": string,
      "pricePerNight": number,
      "totalPrice": number,
      "rating": number,
      "reviewCount": number,
      "amenities": [string],
      "highlights": [string],
      "imageKeyword": string,
      "badge": string
    }
  ],
  "itinerary": [
    {
      "day": number,
      "date": string,
      "title": string,
      "description": string,
      "activities": [
        {
          "time": string,
          "title": string,
          "description": string,
          "cost": number,
          "type": string,
          "duration": string,
          "location": string
        }
      ],
      "meals": [
        {
          "type": string,
          "suggestion": string,
          "estimatedCost": number,
          "isLocal": boolean
        }
      ],
      "transport": string,
      "estimatedDayCost": number,
      "weatherNote": string
    }
  ],
  "budgetBreakdown": {
    "transport": number,
    "accommodation": number,
    "food": number,
    "activities": number,
    "misc": number,
    "total": number
  },
  "savingTips": [string],
  "bestTimeToBook": string,
  "localTips": [string],
  "packingEssentials": [string],
  "vibeMatchNote": string
}`;

type PlanTripBody = {
  destination: string;
  origin: string;
  startDate: string;
  endDate: string;
  adults: number;
  children: number;
  budgetPerPerson: number;
  transportTypes: string[];
  travelStyle: string;
  specialRequests: string;
  tripId: string;
};

const schema = {
  destination: "string",
  origin: "string",
  startDate: "string",
  endDate: "string",
  adults: "number",
  children: "number",
  budgetPerPerson: "number",
  transportTypes: "object",
  travelStyle: "string",
  specialRequests: "string",
  tripId: "string",
};

async function parseBody(request: Request) {
  const payload = await request.json();

  if (!payload || typeof payload !== "object") {
    throw new Error("Invalid request body.");
  }

  for (const key of Object.keys(schema)) {
    const expected = schema[key as keyof typeof schema];
    const value = (payload as Record<string, unknown>)[key];

    if (value == null) {
      throw new Error(`Missing required field: ${key}`);
    }

    if (expected === "object") {
      if (!Array.isArray(value)) {
        throw new Error(`Invalid field type for ${key}.`);
      }
      continue;
    }

    if (typeof value !== expected) {
      throw new Error(`Invalid field type for ${key}. Expected ${expected}.`);
    }
  }

  return payload as PlanTripBody;
}

function buildPrompt(body: PlanTripBody) {
  return `Trip request:
Destination: ${body.destination}
Origin: ${body.origin}
Dates: ${body.startDate} to ${body.endDate}
Travelers: ${body.adults} adults, ${body.children} children
Budget per person: $${body.budgetPerPerson}
Transport preferences: ${body.transportTypes.join(", ")}
Travel style: ${body.travelStyle}
Special requests: ${body.specialRequests || "None"}

Return only a clean JSON object exactly matching the schema provided in the system prompt.`;
}

export async function POST(request: Request) {
  try {
    const body = await parseBody(request);
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing OpenAI API key." }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError) {
      return new Response(JSON.stringify({ error: authError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const openai = new OpenAI({ apiKey });
    const prompt = buildPrompt(body);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
      max_tokens: 1500,
      stream: true,
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let fullResponse = "";
        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              fullResponse += content;
              controller.enqueue(encoder.encode(content));
            }
          }

          // At the end of the stream, save to Database
          try {
            const aiItinerary = JSON.parse(fullResponse);
            const transportType = body.transportTypes.length === 1 ? body.transportTypes[0] : "mixed";
            const tripData = {
              id: body.tripId,
              destination: body.destination,
              origin: body.origin,
              start_date: body.startDate,
              end_date: body.endDate,
              budget: body.budgetPerPerson,
              currency: "USD",
              transport_type: transportType as string,
              status: "planning",
              ai_itinerary: aiItinerary,
              user_id: authData?.user?.id ?? null,
            };

            const { error: insertError } = await supabase.from("trips").insert(tripData);
            if (insertError) console.error("Trips Insert Error: ", insertError);
          } catch(e) {
            console.error("AI Response JSON Parse Error:", e);
          }
        } catch (error) {
          console.error("Stream generation error:", error);
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      status: 200,
      headers: { 
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error.";
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
