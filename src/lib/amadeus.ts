/**
 * Native Amadeus REST API Integration handling strict rate limits and OAuth regenerations gracefully.
 */

interface AmadeusToken {
  type: string;
  username: string;
  application_name: string;
  client_id: string;
  token_type: string;
  access_token: string;
  expires_in: number;
  state: string;
  scope: string;
}

let cachedToken: string | null = null;
let tokenExpiresAt: number = 0;

export async function getAmadeusToken(): Promise<string> {
  const clientId = process.env.AMADEUS_CLIENT_ID;
  const clientSecret = process.env.AMADEUS_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('AMADEUS_CREDENTIALS_MISSING');
  }

  // Use cached token if strictly valid (protected by 60s fallback buffer mapping)
  if (cachedToken && Date.now() < tokenExpiresAt - 60000) {
    return cachedToken;
  }

  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);

  const response = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Amadeus Authentication Failure: ${errorText}`);
  }

  const data = (await response.json()) as AmadeusToken;
  cachedToken = data.access_token;
  tokenExpiresAt = Date.now() + (data.expires_in * 1000);

  return data.access_token;
}

export interface FlightSearchParams {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  travelClass?: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
  max?: number;
}

export async function searchFlights(params: FlightSearchParams) {
  const token = await getAmadeusToken();

  const queryParams = new URLSearchParams({
    originLocationCode: params.originLocationCode,
    destinationLocationCode: params.destinationLocationCode,
    departureDate: params.departureDate,
    adults: params.adults.toString(),
    max: (params.max || 10).toString(),
  });

  if (params.returnDate) {
    queryParams.append('returnDate', params.returnDate);
  }

  if (params.travelClass) {
    queryParams.append('travelClass', params.travelClass);
  }

  const url = `https://test.api.amadeus.com/v2/shopping/flight-offers?${queryParams.toString()}`;

  // Next.js explicitly maps fetch requests out to its external LRU cache array allowing global optimizations! 
  // We can force revalidation caching parameters mapping downstream
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    next: {
      revalidate: 900 // 15 Minute Next.js physical Cache bypassing Amadeus expenditure!
    }
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('RATE_LIMIT');
    }
    const errorText = await response.text();
    throw new Error(`AMADEUS_SEARCH_ERROR: ${errorText}`);
  }

  return response.json();
}
