/**
 * User settings and preferences management
 */

export interface UserPreferences {
  userId: string;
  // Notification preferences
  notifications: {
    messages: boolean;
    matches: boolean;
    bookings: boolean;
    promotions: boolean;
    pushEnabled: boolean;
    emailEnabled: boolean;
  };
  // Privacy settings
  privacy: {
    profileVisibility: "public" | "friends" | "private";
    showLocation: boolean;
    allowDirectMessages: boolean;
    allowMatchRequests: boolean;
  };
  // Travel preferences
  travel: {
    preferredLanguages: string[];
    travelFrequency: "frequently" | "occasionally" | "rarely";
    flexibleDates: boolean;
    maxGroupSize: number;
  };
  // Display preferences
  display: {
    theme: "light" | "dark" | "system";
    currency: string;
    timeZone: string;
    distanceUnit: "km" | "miles";
  };
  // Safety & security
  security: {
    twoFactorEnabled: boolean;
    lastPasswordChange: string;
    loginNotifications: boolean;
    newDeviceNotifications: boolean;
  };
}

// Default preferences
export const defaultPreferences: Omit<UserPreferences, "userId"> = {
  notifications: {
    messages: true,
    matches: true,
    bookings: true,
    promotions: false,
    pushEnabled: true,
    emailEnabled: true,
  },
  privacy: {
    profileVisibility: "public",
    showLocation: false,
    allowDirectMessages: true,
    allowMatchRequests: true,
  },
  travel: {
    preferredLanguages: ["en"],
    travelFrequency: "occasionally",
    flexibleDates: true,
    maxGroupSize: 6,
  },
  display: {
    theme: "system",
    currency: "USD",
    timeZone: "UTC",
    distanceUnit: "km",
  },
  security: {
    twoFactorEnabled: false,
    lastPasswordChange: new Date().toISOString(),
    loginNotifications: true,
    newDeviceNotifications: true,
  },
};

/**
 * Update specific preference
 */
export const updatePreference = <K extends keyof UserPreferences>(
  preferences: UserPreferences,
  category: K,
  updates: Partial<UserPreferences[K]>
): UserPreferences => {
  const categoryData = preferences[category];
  if (typeof categoryData !== "object" || categoryData === null) {
    return preferences;
  }

  return {
    ...preferences,
    [category]: {
      ...categoryData,
      ...updates,
    } as UserPreferences[K],
  };
};

/**
 * Reset preferences to default
 */
export const resetPreferences = (userId: string): UserPreferences => {
  return {
    userId,
    ...defaultPreferences,
  };
};

/**
 * Check if user allows a specific notification type
 */
export const allowsNotification = (
  preferences: UserPreferences,
  type: keyof UserPreferences["notifications"]
): boolean => {
  if (!preferences.notifications[type]) return false;
  if (type === "messages" || type === "matches" || type === "bookings") {
    return preferences.notifications.pushEnabled || preferences.notifications.emailEnabled;
  }
  if (type === "promotions") {
    return preferences.notifications.emailEnabled;
  }
  return true;
};

/**
 * Check if profile is visible to others
 */
export const isProfileVisible = (
  preferences: UserPreferences,
  viewerIsMatch: boolean = false
): boolean => {
  const { profileVisibility } = preferences.privacy;
  if (profileVisibility === "public") return true;
  if (profileVisibility === "private") return false;
  return viewerIsMatch; // "friends" only
};

/**
 * Validate preferences object
 */
export const validatePreferences = (preferences: UserPreferences): boolean => {
  try {
    // Check required fields
    if (!preferences.userId) return false;
    if (!preferences.notifications) return false;
    if (!preferences.privacy) return false;
    if (!preferences.travel) return false;
    if (!preferences.display) return false;
    if (!preferences.security) return false;

    // Validate specific values
    if (!["light", "dark", "system"].includes(preferences.display.theme)) return false;
    if (!["public", "friends", "private"].includes(preferences.privacy.profileVisibility)) return false;
    if (!["frequently", "occasionally", "rarely"].includes(preferences.travel.travelFrequency)) return false;

    return true;
  } catch {
    return false;
  }
};

/**
 * Get privacy-aware profile data
 */
export const getPrivateProfileData = (
  fullProfile: Record<string, unknown>,
  preferences: UserPreferences,
  isViewer: boolean = false
): Record<string, unknown> => {
  if (preferences.privacy.profileVisibility === "public" || isViewer) {
    return fullProfile;
  }

  if (preferences.privacy.profileVisibility === "private" && !isViewer) {
    return {}; // Hide everything
  }

  // "friends" visibility
  return {
    fullName: fullProfile.fullName,
    country: fullProfile.country,
    vibeTags: fullProfile.vibeTags,
  };
};

/**
 * Export user data (GDPR)
 */
export const exportUserData = (
  preferences: UserPreferences,
  profile: Record<string, unknown>,
  bookings: Record<string, unknown>[],
  messages: Record<string, unknown>[]
): Record<string, unknown> => {
  return {
    exportDate: new Date().toISOString(),
    preferences,
    profile,
    bookings,
    messages,
    totalDataSize: JSON.stringify({ preferences, profile, bookings, messages }).length,
  };
};

/**
 * Get privacy policy acceptance status
 */
export const hasAcceptedPolicies = (
  preferences: UserPreferences
): { privacy: boolean; terms: boolean } => {
  // This would typically be tracked separately in the database
  return {
    privacy: true,
    terms: true,
  };
};
