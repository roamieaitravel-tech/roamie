/**
 * Advanced travel companion matching algorithm
 * Scores user compatibility based on travel style, preferences, budget, etc.
 */

export interface TravelerProfile {
  id: string;
  fullName: string;
  country: string;
  vibeTags: string[];
  preferredDestinations: string[];
  travelStyle: "budget" | "comfort" | "luxury";
  budgetRange: { min: number; max: number };
  tripDates?: { start: string; end: string };
}

export interface MatchScore {
  userId: string;
  score: number;
  breakdown: {
    vibeMatch: number;
    budgetMatch: number;
    travelStyleMatch: number;
    destinationMatch: number;
    overallCompatibility: number;
  };
  matchLevel: "perfect" | "great" | "good" | "fair" | "low";
}

/**
 * Calculate vibe tag compatibility (0-100)
 * More shared interests = higher score
 */
const calculateVibeMatch = (
  userVibes: string[],
  targetVibes: string[]
): number => {
  if (userVibes.length === 0 && targetVibes.length === 0) return 100;
  if (userVibes.length === 0 || targetVibes.length === 0) return 0;

  const commonVibes = userVibes.filter((vibe) =>
    targetVibes.includes(vibe)
  ).length;
  const totalUnique = new Set([...userVibes, ...targetVibes]).size;

  return Math.round((commonVibes / totalUnique) * 100);
};

/**
 * Calculate budget compatibility (0-100)
 * If budgets overlap significantly, score is high
 */
const calculateBudgetMatch = (
  userBudget: { min: number; max: number },
  targetBudget: { min: number; max: number }
): number => {
  // Check if budgets overlap
  const overlapStart = Math.max(userBudget.min, targetBudget.min);
  const overlapEnd = Math.min(userBudget.max, targetBudget.max);

  if (overlapStart > overlapEnd) {
    // No overlap - check how far apart they are
    const maxDistance = Math.max(
      Math.abs(userBudget.max - targetBudget.min),
      Math.abs(targetBudget.max - userBudget.min)
    );
    return Math.max(0, 100 - maxDistance / 100);
  }

  // Calculate overlap percentage
  const userRange = userBudget.max - userBudget.min;
  const targetRange = targetBudget.max - targetBudget.min;
  const overlapRange = overlapEnd - overlapStart;

  const userOverlapPercent = (overlapRange / userRange) * 100;
  const targetOverlapPercent = (overlapRange / targetRange) * 100;

  return Math.round((userOverlapPercent + targetOverlapPercent) / 2);
};

/**
 * Calculate travel style compatibility (0-100)
 * Same style = 100, adjacent styles = 50, opposite = 0
 */
const calculateTravelStyleMatch = (
  userStyle: string,
  targetStyle: string
): number => {
  if (userStyle === targetStyle) return 100;

  const styleHierarchy = ["budget", "comfort", "luxury"];
  const userIndex = styleHierarchy.indexOf(userStyle);
  const targetIndex = styleHierarchy.indexOf(targetStyle);

  if (userIndex === -1 || targetIndex === -1) return 50;

  const distance = Math.abs(userIndex - targetIndex);
  return Math.max(0, 100 - distance * 50);
};

/**
 * Calculate destination preference match (0-100)
 * Shared destination interests indicate good pairing
 */
const calculateDestinationMatch = (
  userDestinations: string[],
  targetDestinations: string[]
): number => {
  if (userDestinations.length === 0 && targetDestinations.length === 0) return 75;
  if (userDestinations.length === 0 || targetDestinations.length === 0) return 50;

  const commonDestinations = userDestinations.filter((dest) =>
    targetDestinations.includes(dest)
  ).length;

  const totalUnique = new Set([
    ...userDestinations,
    ...targetDestinations,
  ]).size;

  return Math.round((commonDestinations / totalUnique) * 100);
};

/**
 * Main matching algorithm
 * Weights different compatibility factors
 */
export const calculateMatchScore = (
  userProfile: TravelerProfile,
  targetProfile: TravelerProfile
): MatchScore => {
  const vibeMatch = calculateVibeMatch(
    userProfile.vibeTags,
    targetProfile.vibeTags
  );
  const budgetMatch = calculateBudgetMatch(
    userProfile.budgetRange,
    targetProfile.budgetRange
  );
  const travelStyleMatch = calculateTravelStyleMatch(
    userProfile.travelStyle,
    targetProfile.travelStyle
  );
  const destinationMatch = calculateDestinationMatch(
    userProfile.preferredDestinations,
    targetProfile.preferredDestinations
  );

  // Weighted score (vibe and budget most important)
  const overallCompatibility = Math.round(
    vibeMatch * 0.35 +
      budgetMatch * 0.3 +
      travelStyleMatch * 0.2 +
      destinationMatch * 0.15
  );

  // Determine match level
  let matchLevel: "perfect" | "great" | "good" | "fair" | "low";
  if (overallCompatibility >= 85) matchLevel = "perfect";
  else if (overallCompatibility >= 70) matchLevel = "great";
  else if (overallCompatibility >= 55) matchLevel = "good";
  else if (overallCompatibility >= 40) matchLevel = "fair";
  else matchLevel = "low";

  return {
    userId: targetProfile.id,
    score: overallCompatibility,
    breakdown: {
      vibeMatch,
      budgetMatch,
      travelStyleMatch,
      destinationMatch,
      overallCompatibility,
    },
    matchLevel,
  };
};

/**
 * Find best matches for a user from a pool of candidates
 */
export const findBestMatches = (
  userProfile: TravelerProfile,
  candidates: TravelerProfile[],
  limit: number = 10
): MatchScore[] => {
  return candidates
    .map((candidate) => calculateMatchScore(userProfile, candidate))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

/**
 * Filter matches by minimum score threshold
 */
export const filterMatchesByThreshold = (
  matches: MatchScore[],
  minScore: number = 50
): MatchScore[] => {
  return matches.filter((match) => match.score >= minScore);
};

/**
 * Get matches by match level
 */
export const getMatchesByLevel = (
  matches: MatchScore[],
  level: "perfect" | "great" | "good" | "fair" | "low"
): MatchScore[] => {
  return matches.filter((match) => match.matchLevel === level);
};

/**
 * Calculate average compatibility across multiple dimensions
 */
export const getAverageCompatibility = (matches: MatchScore[]): number => {
  if (matches.length === 0) return 0;
  const sum = matches.reduce((acc, match) => acc + match.score, 0);
  return Math.round(sum / matches.length);
};
