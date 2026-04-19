import { OpenAI } from "openai";

const systemPrompt = `You are Roamie, a friendly and knowledgeable AI travel planner. Your role is to:

1. Engage in natural conversation to understand the user's travel dreams
2. Ask clarifying questions about: destination, dates, budget, number of travelers, travel style (luxury/budget/adventure), and special interests
3. Extract trip details from casual conversation

When you have enough information (destination, dates, budget, travelers), provide:
- A summary of the trip they want
- Initial suggestions for flights, hotels, activities
- Estimated costs and savings opportunities
- Questions to refine the plan

Format your response as JSON:
{
  "message": "Your conversational response",
  "extractedInfo": {
    "destination": "string or null",
    "startDate": "string or null",
    "endDate": "string or null",
    "budget": "number or null",
    "travelers": "number or null",
    "style": "string or null",
    "interests": ["array of interests"]
  },
  "tripPlan": null or {
    "destination": "string",
    "startDate": "string",
    "endDate": "string",
    "budget": number,
    "travelers": number,
    "style": "string",
    "flights": [
      {
        "id": "string",
        "from": "string",
        "to": "string",
        "airline": "string",
        "price": number,
        "duration": "string",
        "stops": number,
        "departure": "string",
        "arrival": "string",
        "class": "economy"
      }
    ],
    "hotels": [
      {
        "id": "string",
        "name": "string",
        "city": "string",
        "price": number,
        "rating": number,
        "nights": number,
        "amenities": ["string"],
        "image": "string"
      }
    ],
    "itinerary": [
      {
        "day": number,
        "title": "string",
        "activities": ["string"],
        "meals": ["string"],
        "transport": "string",
        "cost": number
      }
    ],
    "totalCost": number,
    "savings": number
  }
}

Always respond with valid JSON. Be warm, encouraging, and enthusiastic about travel.`;

interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

interface TripPlan {
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  travelers: number;
  style: string;
  flights?: Array<{
    id: string;
    from: string;
    to: string;
    airline: string;
    price: number;
    duration: string;
    stops: number;
    departure: string;
    arrival: string;
    class: "economy" | "business" | "first";
  }>;
  hotels?: Array<{
    id: string;
    name: string;
    city: string;
    price: number;
    rating: number;
    nights: number;
    amenities: string[];
    image: string;
  }>;
  itinerary?: Array<{
    day: number;
    title: string;
    activities: string[];
    meals: string[];
    transport: string;
    cost: number;
  }>;
  totalCost?: number;
  savings?: number;
}

interface AIResponse {
  message: string;
  extractedInfo: {
    destination: string | null;
    startDate: string | null;
    endDate: string | null;
    budget: number | null;
    travelers: number | null;
    style: string | null;
    interests: string[];
  };
  tripPlan: TripPlan | null;
}

function generateMockTripPlan(info: {
  destination?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  budget?: number | null;
  travelers?: number | null;
  style?: string | null;
}): TripPlan {
  const destination = info.destination || "Bali";
  const startDate = info.startDate || "2025-06-15";
  const endDate = info.endDate || "2025-06-22";
  const budget = info.budget || 2000;
  const travelers = info.travelers || 1;
  const style = info.style || "adventure";

  const days = Math.ceil(
    (new Date(endDate).getTime() - new Date(startDate).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const perPersonBudget = budget / travelers;

  return {
    destination,
    startDate,
    endDate,
    budget: perPersonBudget,
    travelers,
    style,
    flights: [
      {
        id: "FL1",
        from: "NYC",
        to: destination,
        airline: "Emirates",
        price: Math.floor(perPersonBudget * 0.25),
        duration: "16h 30m",
        stops: 1,
        departure: "2025-06-15 09:00",
        arrival: "2025-06-17 08:00",
        class: "economy",
      },
    ],
    hotels: [
      {
        id: "HT1",
        name: `${destination} Beach Resort`,
        city: destination,
        price: Math.floor((perPersonBudget * 0.35) / (days - 2)),
        rating: 4.5,
        nights: days - 2,
        amenities: ["WiFi", "Pool", "Restaurant", "Beach Access"],
        image: "https://images.unsplash.com/photo-1518809185704-38aa08922e97?w=500&q=80",
      },
    ],
    itinerary: Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      title:
        i === 0
          ? "Arrival"
          : i === days - 1
            ? "Departure"
            : `${destination} Exploration Day ${i}`,
      activities:
        i === 0
          ? ["Arrive", "Check-in", "Settle in"]
          : i === days - 1
            ? ["Pack", "Depart"]
            : [
                "Local market visit",
                `${destination} sightseeing`,
                "Traditional dining",
              ],
      meals: ["Breakfast", "Lunch", "Dinner"],
      transport: i === 0 ? "Airport transfer" : "Local transport",
      cost:
        i === 0
          ? Math.floor(perPersonBudget * 0.1)
          : Math.floor((perPersonBudget * 0.2) / (days - 2)),
    })),
    totalCost: budget,
    savings: Math.floor(budget * 0.15),
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, conversationHistory } = body;

    if (!message || typeof message !== "string") {
      return new Response(
        JSON.stringify({ error: "Missing or invalid message" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing OpenAI API key" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const openai = new OpenAI({ apiKey });

    const messages: ConversationMessage[] = [
      ...(conversationHistory || []),
      { role: "user", content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const responseText =
      completion.choices?.[0]?.message?.content || "Sorry, I couldn't plan your trip.";

    let aiResponse: AIResponse;

    try {
      aiResponse = JSON.parse(responseText);
    } catch {
      // If response isn't JSON, create a basic response
      aiResponse = {
        message: responseText,
        extractedInfo: {
          destination: null,
          startDate: null,
          endDate: null,
          budget: null,
          travelers: null,
          style: null,
          interests: [],
        },
        tripPlan: null,
      };
    }

    // Generate mock trip plan if we have enough info
    if (
      aiResponse.extractedInfo &&
      aiResponse.extractedInfo.destination &&
      aiResponse.extractedInfo.startDate &&
      aiResponse.extractedInfo.endDate &&
      aiResponse.extractedInfo.budget &&
      aiResponse.extractedInfo.travelers &&
      !aiResponse.tripPlan
    ) {
      aiResponse.tripPlan = generateMockTripPlan(aiResponse.extractedInfo);
    }

    return new Response(JSON.stringify(aiResponse), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
