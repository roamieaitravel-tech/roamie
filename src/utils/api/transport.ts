/**
 * Ground transport integration (trains, buses, car rentals)
 * Currently using mock data - integrate with real APIs (Trainline, BlaBlaCar, Hertz, etc.)
 */

export interface TransportOption {
  id: string;
  type: "train" | "bus" | "car";
  provider: string;
  departureLocation: string;
  arrivalLocation: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  currency: string;
  stops: number;
  amenities: string[];
  rating: number;
  class?: string;
}

// Mock train data
export const getMockTrains = (
  origin: string,
  destination: string
): TransportOption[] => {
  return [
    {
      id: "TR001",
      type: "train",
      provider: "Eurostar",
      departureLocation: origin,
      arrivalLocation: destination,
      departureTime: "09:00 AM",
      arrivalTime: "02:30 PM",
      duration: "5h 30m",
      price: 89,
      currency: "USD",
      stops: 0,
      amenities: ["WiFi", "Dining Car", "Power Outlets"],
      rating: 4.6,
      class: "Standard",
    },
    {
      id: "TR002",
      type: "train",
      provider: "Thalys",
      departureLocation: origin,
      arrivalLocation: destination,
      departureTime: "02:15 PM",
      arrivalTime: "08:45 PM",
      duration: "6h 30m",
      price: 75,
      currency: "USD",
      stops: 1,
      amenities: ["WiFi", "Snacks"],
      rating: 4.3,
      class: "Economy",
    },
  ];
};

// Mock bus data
export const getMockBuses = (
  origin: string,
  destination: string
): TransportOption[] => {
  return [
    {
      id: "BS001",
      type: "bus",
      provider: "FlixBus",
      departureLocation: origin,
      arrivalLocation: destination,
      departureTime: "10:30 AM",
      arrivalTime: "08:00 PM",
      duration: "9h 30m",
      price: 35,
      currency: "USD",
      stops: 2,
      amenities: ["WiFi", "USB Charging", "Toilet"],
      rating: 4.1,
    },
    {
      id: "BS002",
      type: "bus",
      provider: "BlaBlaCar",
      departureLocation: origin,
      arrivalLocation: destination,
      departureTime: "07:00 AM",
      arrivalTime: "03:30 PM",
      duration: "8h 30m",
      price: 28,
      currency: "USD",
      stops: 0,
      amenities: ["Air Conditioning", "Music Player"],
      rating: 4.5,
    },
  ];
};

// Mock car rental data
export const getMockCarRentals = (destination: string): TransportOption[] => {
  return [
    {
      id: "CR001",
      type: "car",
      provider: "Hertz",
      departureLocation: destination,
      arrivalLocation: destination,
      departureTime: "24/7",
      arrivalTime: "24/7",
      duration: "Per Day",
      price: 45,
      currency: "USD",
      stops: 0,
      amenities: ["Automatic", "Air Conditioning", "GPS"],
      rating: 4.4,
      class: "Economy",
    },
    {
      id: "CR002",
      type: "car",
      provider: "Europcar",
      departureLocation: destination,
      arrivalLocation: destination,
      departureTime: "24/7",
      arrivalTime: "24/7",
      duration: "Per Day",
      price: 38,
      currency: "USD",
      stops: 0,
      amenities: ["Automatic", "Air Conditioning"],
      rating: 4.2,
      class: "Economy",
    },
  ];
};

// Real API integration template
export const searchTransport = async (
  origin: string,
  destination: string,
  transportType: "train" | "bus" | "car" = "train"
): Promise<TransportOption[]> => {
  // TODO: Replace with actual API calls
  // For Trainline: https://api.thetrainline.com
  // For BlaBlaCar: https://api.blablacar.com
  // For Hertz: https://api.hertz.com

  switch (transportType) {
    case "train":
      return getMockTrains(origin, destination);
    case "bus":
      return getMockBuses(origin, destination);
    case "car":
      return getMockCarRentals(destination);
    default:
      return [];
  }
};

// Calculate total transport cost
export const calculateTransportCost = (
  pricePerUnit: number,
  quantity: number
): number => {
  return pricePerUnit * quantity;
};
