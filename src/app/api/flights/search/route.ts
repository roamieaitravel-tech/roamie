import { NextResponse } from "next/server";
import { z } from "zod";
import { searchFlights } from "@/lib/amadeus";
import { getMockFlights, FlightOption } from "@/utils/api/flights";

const searchSchema = z.object({
  origin: z.string().length(3, "Origin must be a 3-letter IATA code").toUpperCase(),
  destination: z.string().length(3, "Destination must be a 3-letter IATA code").toUpperCase(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must strictly map to YYYY-MM-DD format"),
  returnDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  passengers: z.number().int().min(1).max(9).default(1),
  cabin: z.enum(["ECONOMY", "PREMIUM_ECONOMY", "BUSINESS", "FIRST"]).optional(),
});

function parseAmadeusDuration(ptDuration: string): string {
  // Regex explicitly mapping Amadeus ISO 8601 Strings: PT16H50M -> 16h 50m
  const match = ptDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return ptDuration;
  const h = match[1] ? `${match[1]}h` : "";
  const m = match[2] ? `${match[2]}m` : "";
  return `${h} ${m}`.trim();
}

function formatAmadeusTime(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' });
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const validated = searchSchema.parse(payload);

    try {
      const result = await searchFlights({
        originLocationCode: validated.origin,
        destinationLocationCode: validated.destination,
        departureDate: validated.date,
        returnDate: validated.returnDate,
        adults: validated.passengers,
        travelClass: validated.cabin,
        max: 10,
      });

      // Handle totally valid requests that simply had zero logical available routes!
      if (!result.data || result.data.length === 0) {
        return NextResponse.json({
          data: [],
          message: "No exact flights found matching your exact parameters.",
          suggestions: getMockFlights(validated.origin, validated.destination)
        });
      }

      // Map Amadeus complex multidimensional JSON schemas explicitly into our simplified Native FlightOption.
      const flights: FlightOption[] = result.data.map((offer: any) => {
        const itinerary = offer.itineraries[0];
        const segments = itinerary.segments;
        const firstSegment = segments[0];
        const lastSegment = segments[segments.length - 1];

        const carrierCode = firstSegment.carrierCode;
        // Amadeus dictionaries expose raw keys like BA -> British Airways
        const airlineName = result.dictionaries?.carriers?.[carrierCode] || carrierCode;

        let badge = undefined;
        if (Number(offer.price.total) < 250) badge = "Best Price";
        else if (validated.cabin && validated.cabin !== "ECONOMY") badge = "Premium Choice";

        return {
          id: offer.id,
          airline: airlineName,
          departure: firstSegment.departure.iataCode,
          departureTime: formatAmadeusTime(firstSegment.departure.at),
          arrival: lastSegment.arrival.iataCode,
          arrivalTime: formatAmadeusTime(lastSegment.arrival.at),
          duration: parseAmadeusDuration(itinerary.duration),
          stops: segments.length - 1,
          price: parseFloat(offer.price.total),
          currency: offer.price.currency,
          badge,
          // Since GDS arrays rarely send native passenger-facing ratings gracefully, render native mocks.
          rating: Number((Math.random() * (5 - 3.8) + 3.8).toFixed(1)), 
        };
      });

      return NextResponse.json({ data: flights });

    } catch (apiError: any) {
      if (apiError.message === 'RATE_LIMIT') {
        return NextResponse.json({
          error: "Try again in 30 seconds (Amadeus API Rate Limit hit)",
          isRateLimit: true 
        }, { status: 429 });
      }
      if (apiError.message === 'AMADEUS_CREDENTIALS_MISSING') {
         console.warn("Gracefully routing to mock fallbacks. Amadeus ENV values are explicitly null.");
      } else {
         console.error("Amadeus Gateway Transport Exception:", apiError);
      }
      
      // Fallback explicitly delivering mock payload transparently protecting UI capabilities
      return NextResponse.json({ 
        data: getMockFlights(validated.origin, validated.destination), 
        isFallback: true 
      });
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Invalid Query Formatter Payload" }, { status: 400 });
  }
}
