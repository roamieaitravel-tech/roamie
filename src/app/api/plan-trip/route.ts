import { OpenAI } from "openai";

const systemPrompt = `You are Roamie AI, the world's best budget travel planning expert.
Your mission: Create the most value-packed trip plan possible within the given budget.

Always return a valid JSON object with:
{
  tripSummary: {
    destination: string,
    duration: string,
    totalCost: number,
    savings: number,
    currency: string
  },
  transportOptions: [
    {
      type: string,
      provider: string,
      route: string,
      departureTime: string,
      arrivalTime: string,
      duration: string,
      price: number,
      class: string,
      highlights: string[],
      bookingUrl: string,
      badge: string
    }
  ],
  hotelOptions: [
    {
      name: string,
      type: string,
      location: string,
      pricePerNight: number,
      totalPrice: number,
      rating: number,
      reviewCount: number,
      amenities: string[],
      highlights: string[],
      imageKeyword: string,
      badge: string
    }
  ],
  itinerary: [
    {
      day: number,
      date: string,
      title: string,
      description: string,
      activities: [
        {
          time: string,
          title: string,
          description: string,
          cost: number,
          type: string,
          duration: string,
          location: string
        }
      ],
      meals: [
        {
          type: string,
          suggestion: string,
          estimatedCost: number,
          isLocal: boolean
        }
      ],
      transport: string,
      estimatedDayCost: number,
      weatherNote: string
    }
  ],
  budgetBreakdown: {
    transport: number,
    accommodation: number,
    food: number,
    activities: number,
    misc: number,
    total: number
  },
  savingTips: string[],
  bestTimeToBook: string,
  localTips: string[],
  packingEssentials: string[],
  vibeMatchNote: string
}

Be specific with real providers, realistic prices, actual locations.`;

const schema = {
  destination: "string",
  origin: "string",
  startDate: "string",
  endDate: "string",
  adults: "number",
  children: "number",
  budget: "number",
  transportTypes: "object",
  travelStyle: "string",
  specialRequests: "string",
};


async function parseBody(request: Request): Promise<{
  destination: string;
  origin: string;
  startDate: string;
  endDate: string;
  adults: number;
  children: number;
  budget: number;
  transportTypes: string[];
  travelStyle: string;
  specialRequests: string;
}> {
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

  return payload as {
    destination: string;
    origin: string;
    startDate: string;
    endDate: string;
    adults: number;
    children: number;
    budget: number;
    transportTypes: string[];
    travelStyle: string;
    specialRequests: string;
  };
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await parseBody(request);

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response("Missing OpenAI API key.", { status: 500 });
    }

    const openai = new OpenAI({ apiKey });

    const prompt = `Trip request:
Destination: ${body.destination}
Origin: ${body.origin}
Dates: ${body.startDate} to ${body.endDate}
Travelers: ${body.adults} adults, ${body.children} children
Budget: $${body.budget} per person
Transport preferences: ${body.transportTypes.join(", ")}
Travel style: ${body.travelStyle}
Special requests: ${body.specialRequests || "None"}

Return only a clean JSON object exactly matching the schema provided.`;

    const stream = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      stream: true,
      temperature: 0.3,
      max_tokens: 1500,
    });

    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            controller.enqueue(new TextEncoder().encode(content));
          }
        }
        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error.";
    return new Response(message, { status: 400 });
  }
}
