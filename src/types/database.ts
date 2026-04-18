/**
 * Database Types for Roamie Travel App
 * TypeScript interfaces for all Supabase tables and helper types
 */

// ============================================
// ENUM TYPES
// ============================================

export type TravelStyle = "budget" | "comfort" | "luxury";

export type TripStatus =
  | "planning"
  | "booked"
  | "ongoing"
  | "completed"
  | "cancelled";

export type TransportType = "flight" | "train" | "cruise" | "mixed";

export type BookingType =
  | "flight"
  | "hotel"
  | "train"
  | "cruise"
  | "transfer"
  | "activity";

export type MatchStatus = "pending" | "accepted" | "declined" | "blocked";

export type RewardType =
  | "trip_completion"
  | "referral"
  | "review"
  | "group_booking"
  | "early_adopter";

export type ExpenseCategory =
  | "flight"
  | "hotel"
  | "food"
  | "transport"
  | "activity"
  | "shopping"
  | "other";

// ============================================
// HELPER TYPES
// ============================================

export interface BudgetRange {
  min: number;
  max: number;
}

export interface SplitInfo {
  user_id: string;
  amount: number;
  settled: boolean;
}

export interface ConfirmationDetails {
  [key: string]: string | number | boolean;
}

// ============================================
// TABLE INTERFACES
// ============================================

/**
 * Profiles Table
 * Stores user profile information and preferences
 */
export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string;
  avatar_url: string | null;
  bio: string | null;
  travel_style: TravelStyle[];
  preferred_destinations: string[];
  budget_range: BudgetRange;
  languages: string[];
  phone: string | null;
  country: string | null;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Trips Table
 * Stores trip information and planning details
 */
export interface Trip {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  destination: string;
  origin: string | null;
  start_date: string;
  end_date: string;
  budget: number;
  currency: string;
  transport_type: TransportType;
  status: TripStatus;
  is_public: boolean;
  max_participants: number | null;
  current_participants: number;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Bookings Table
 * Stores booking information for trips
 */
export interface Booking {
  id: string;
  trip_id: string;
  user_id: string;
  booking_type: BookingType;
  provider: string;
  reference_number: string;
  confirmation_details: ConfirmationDetails;
  cost: number;
  currency: string;
  booking_date: string;
  check_in_date: string | null;
  check_out_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Vibe Matches Table
 * Stores buddy matching information
 */
export interface VibeMatch {
  id: string;
  trip_id: string;
  user_id_1: string;
  user_id_2: string;
  status: MatchStatus;
  match_score: number;
  shared_interests: string[];
  matched_at: string;
  responded_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Messages Table
 * Stores messages between users
 */
export interface Message {
  id: string;
  trip_id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  read: boolean;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Rewards Table
 * Stores user rewards and loyalty points
 */
export interface Reward {
  id: string;
  user_id: string;
  reward_type: RewardType;
  points: number;
  description: string;
  trip_id: string | null;
  claimed: boolean;
  claimed_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Expenses Table
 * Tracks expenses during trips
 */
export interface Expense {
  id: string;
  trip_id: string;
  user_id: string;
  category: ExpenseCategory;
  amount: number;
  currency: string;
  description: string;
  date: string;
  paid_by: string | null;
  split_info: SplitInfo[];
  receipt_url: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Price Alerts Table
 * Stores price alert preferences
 */
export interface PriceAlert {
  id: string;
  user_id: string;
  route: string;
  origin: string;
  destination: string;
  target_price: number;
  currency: string;
  is_active: boolean;
  last_checked_at: string | null;
  alert_triggered: boolean;
  triggered_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Waitlist Table
 * Stores pre-launch waitlist signups
 */
export interface Waitlist {
  id: string;
  email: string;
  destination: string | null;
  travel_date: string | null;
  budget: number | null;
  preferred_style: TravelStyle | null;
  referral_code: string | null;
  notified: boolean;
  notified_at: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================
// EXTENDED TYPES (Joined Data)
// ============================================

/**
 * Trip with creator profile information
 */
export interface TripWithProfile extends Trip {
  profiles: Profile;
}

/**
 * Booking with trip information
 */
export interface BookingWithTrip extends Booking {
  trips: Trip;
  profiles: Profile;
}

/**
 * Vibe Match with user profile information
 */
export interface VibeMatchWithProfiles extends VibeMatch {
  profiles_1: Profile;
  profiles_2: Profile;
}

/**
 * Message with sender and recipient info
 */
export interface MessageWithProfiles extends Message {
  profiles_sender: Profile;
  profiles_recipient: Profile;
}

/**
 * Expense with user and payer information
 */
export interface ExpenseWithProfiles extends Expense {
  profiles: Profile;
}

// ============================================
// DATABASE QUERY TYPES
// ============================================

export interface DatabaseQueryOptions {
  select?: string;
  filter?: Record<string, unknown>;
  order?: {
    column: string;
    ascending?: boolean;
  };
  limit?: number;
  offset?: number;
}

export interface DatabaseResponse<T> {
  data: T | null;
  error: {
    message: string;
    code?: string;
  } | null;
}

export interface DatabaseListResponse<T> {
  data: T[];
  error: {
    message: string;
    code?: string;
  } | null;
  count?: number;
}
