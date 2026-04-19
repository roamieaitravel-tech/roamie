/**
 * Hotel search and booking integration utilities
 * Currently using mock data - integrate with real APIs (Booking.com, Expedia, etc.)
 */

export interface HotelOption {
  id: string;
  name: string;
  location: string;
  pricePerNight: number;
  currency: string;
  rating: number;
  reviewCount: number;
  image: string;
  amenities: string[];
  badge?: string;
  description: string;
}

// Mock hotel data for demo
export const getMockHotels = (destination: string): HotelOption[] => {
  return [
    {
      id: "HT001",
      name: "Luxury Beachfront Resort",
      location: destination,
      pricePerNight: 180,
      currency: "USD",
      rating: 4.8,
      reviewCount: 2543,
      image: "/images/hotel-luxury.jpg",
      amenities: ["Pool", "Beach Access", "Spa", "Restaurant", "WiFi"],
      badge: "Premium",
      description: "5-star beachfront resort with world-class amenities",
    },
    {
      id: "HT002",
      name: "Comfort City Hotel",
      location: destination,
      pricePerNight: 85,
      currency: "USD",
      rating: 4.4,
      reviewCount: 1842,
      image: "/images/hotel-comfort.jpg",
      amenities: ["WiFi", "Restaurant", "Gym", "Business Center"],
      badge: "Best Value",
      description: "Mid-range hotel with excellent location and service",
    },
    {
      id: "HT003",
      name: "Budget Backpackers Hostel",
      location: destination,
      pricePerNight: 35,
      currency: "USD",
      rating: 4.1,
      reviewCount: 945,
      image: "/images/hotel-budget.jpg",
      amenities: ["Shared Kitchen", "WiFi", "Social Area", "Laundry"],
      badge: "Budget",
      description: "Affordable hostel perfect for solo travelers and backpackers",
    },
    {
      id: "HT004",
      name: "Boutique Style Hotel",
      location: destination,
      pricePerNight: 120,
      currency: "USD",
      rating: 4.6,
      reviewCount: 1124,
      image: "/images/hotel-boutique.jpg",
      amenities: ["Rooftop Bar", "Unique Design", "WiFi", "Concierge"],
      badge: "Unique",
      description: "Trendy boutique hotel with character and style",
    },
  ];
};

// Real API integration template (when API credentials are available)
export const searchHotels = async (
  destination: string,
  checkInDate: string,
  checkOutDate: string,
  guests: number
): Promise<HotelOption[]> => {
  // TODO: Replace with actual API call
  // const response = await fetch('https://api.booking.com/v1/hotels/search', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${process.env.BOOKING_API_KEY}`,
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({
  //     destination,
  //     checkIn: checkInDate,
  //     checkOut: checkOutDate,
  //     guests,
  //     currency: 'USD'
  //   })
  // });

  // For now, return mock data
  return getMockHotels(destination);
};

// Calculate total hotel cost
export const calculateHotelCost = (
  pricePerNight: number,
  nights: number,
  taxes: number = 1.15
): number => {
  return Math.round(pricePerNight * nights * taxes);
};
