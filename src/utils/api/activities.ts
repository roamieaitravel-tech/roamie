/**
 * Activities and experiences integration
 * Currently using mock data - integrate with real APIs (Viator, GetYourGuide, etc.)
 */

export interface Activity {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  currency: string;
  location: string;
  rating: number;
  reviewCount: number;
  category: "tour" | "experience" | "food" | "adventure" | "culture";
  image: string;
  included: string[];
}

// Mock activities data for demo
export const getMockActivities = (destination: string): Activity[] => {
  return [
    {
      id: "AC001",
      title: "Grand Palace & Temple Tour",
      description: "Visit the iconic Grand Palace and sacred temples with expert guide",
      duration: "3 hours",
      price: 45,
      currency: "USD",
      location: destination,
      rating: 4.7,
      reviewCount: 3421,
      category: "culture",
      image: "/images/activity-palace.jpg",
      included: ["Professional Guide", "Entrance Fees", "Transport"],
    },
    {
      id: "AC002",
      title: "Muay Thai Boxing Class",
      description: "Learn traditional Muay Thai from certified instructors",
      duration: "2 hours",
      price: 30,
      currency: "USD",
      location: destination,
      rating: 4.8,
      reviewCount: 2156,
      category: "experience",
      image: "/images/activity-muay-thai.jpg",
      included: ["Instruction", "Equipment", "Towel & Water"],
    },
    {
      id: "AC003",
      title: "Riverside Dinner Cruise",
      description: "Scenic cruise with dinner buffet and evening entertainment",
      duration: "3 hours",
      price: 50,
      currency: "USD",
      location: destination,
      rating: 4.6,
      reviewCount: 1843,
      category: "experience",
      image: "/images/activity-cruise.jpg",
      included: ["Dinner", "Drinks", "Transportation"],
    },
    {
      id: "AC004",
      title: "Street Food & Market Tour",
      description: "Explore local markets and taste authentic street food",
      duration: "2.5 hours",
      price: 35,
      currency: "USD",
      location: destination,
      rating: 4.9,
      reviewCount: 2945,
      category: "food",
      image: "/images/activity-food.jpg",
      included: ["Guide", "Food Tastings", "Drinks"],
    },
    {
      id: "AC005",
      title: "Jungle Adventure Trek",
      description: "Hike through rainforest with waterfall swimming",
      duration: "4 hours",
      price: 60,
      currency: "USD",
      location: destination,
      rating: 4.5,
      reviewCount: 1234,
      category: "adventure",
      image: "/images/activity-jungle.jpg",
      included: ["Guide", "Equipment", "Meals"],
    },
  ];
};

// Real API integration template (when API credentials are available)
export const searchActivities = async (destination: string): Promise<Activity[]> => {
  // TODO: Replace with actual API call
  // const response = await fetch('https://api.viator.com/v2/attractions/search', {
  //   method: 'GET',
  //   headers: {
  //     'Authorization': `Bearer ${process.env.VIATOR_API_KEY}`,
  //   },
  //   params: {
  //     destination,
  //     currency: 'USD'
  //   }
  // });

  // For now, return mock data
  return getMockActivities(destination);
};

// Get activities by category
export const getActivitiesByCategory = (
  activities: Activity[],
  category: Activity["category"]
): Activity[] => {
  return activities.filter((activity) => activity.category === category);
};
