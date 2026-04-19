/**
 * Date and time utilities for travel app
 */

export const dateUtils = {
  /**
   * Format date to readable string
   */
  format: (date: Date | string, locale: string = "en-US"): string => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  },

  /**
   * Format date and time
   */
  formatDateTime: (date: Date | string, locale: string = "en-US"): string => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  },

  /**
   * Get day of week
   */
  getDayOfWeek: (date: Date | string, locale: string = "en-US"): string => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString(locale, { weekday: "long" });
  },

  /**
   * Format time only
   */
  formatTime: (date: Date | string, locale: string = "en-US"): string => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleTimeString(locale, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  },

  /**
   * Check if date is in the past
   */
  isPast: (date: Date | string): boolean => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d < new Date();
  },

  /**
   * Check if date is today
   */
  isToday: (date: Date | string): boolean => {
    const d = typeof date === "string" ? new Date(date) : date;
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  },

  /**
   * Check if date is tomorrow
   */
  isTomorrow: (date: Date | string): boolean => {
    const d = typeof date === "string" ? new Date(date) : date;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return (
      d.getDate() === tomorrow.getDate() &&
      d.getMonth() === tomorrow.getMonth() &&
      d.getFullYear() === tomorrow.getFullYear()
    );
  },

  /**
   * Get days remaining until date
   */
  daysUntil: (date: Date | string): number => {
    const d = typeof date === "string" ? new Date(date) : date;
    const today = new Date();
    const diff = d.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  },

  /**
   * Get duration between two dates
   */
  getDuration: (start: Date | string, end: Date | string): string => {
    const startDate = typeof start === "string" ? new Date(start) : start;
    const endDate = typeof end === "string" ? new Date(end) : end;
    const days = Math.floor(
      (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
    );
    return `${days} day${days !== 1 ? "s" : ""}`;
  },

  /**
   * Get number of nights
   */
  getNights: (checkIn: Date | string, checkOut: Date | string): number => {
    const startDate = typeof checkIn === "string" ? new Date(checkIn) : checkIn;
    const endDate = typeof checkOut === "string" ? new Date(checkOut) : checkOut;
    return Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
    );
  },

  /**
   * Check if dates overlap
   */
  datesOverlap: (
    start1: Date | string,
    end1: Date | string,
    start2: Date | string,
    end2: Date | string
  ): boolean => {
    const s1 = typeof start1 === "string" ? new Date(start1) : start1;
    const e1 = typeof end1 === "string" ? new Date(end1) : end1;
    const s2 = typeof start2 === "string" ? new Date(start2) : start2;
    const e2 = typeof end2 === "string" ? new Date(end2) : end2;

    return s1 <= e2 && s2 <= e1;
  },

  /**
   * Format date range
   */
  formatDateRange: (start: Date | string, end: Date | string, locale: string = "en-US"): string => {
    const startDate = typeof start === "string" ? new Date(start) : start;
    const endDate = typeof end === "string" ? new Date(end) : end;

    const startStr = startDate.toLocaleDateString(locale, {
      month: "short",
      day: "numeric",
    });
    const endStr = endDate.toLocaleDateString(locale, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    return `${startStr} - ${endStr}`;
  },

  /**
   * Get relative time string (e.g., "2 days ago")
   */
  getRelativeTime: (date: Date | string, locale: string = "en-US"): string => {
    const d = typeof date === "string" ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;

    const diffInDays = Math.floor(diffInSeconds / 86400);
    if (diffInDays === 1) return "yesterday";
    if (diffInDays < 7) return `${diffInDays}d ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`;

    return d.toLocaleDateString(locale);
  },

  /**
   * Add days to a date
   */
  addDays: (date: Date | string, days: number): Date => {
    const d = typeof date === "string" ? new Date(date) : new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  },

  /**
   * Get season from date
   */
  getSeason: (date: Date | string): "spring" | "summer" | "fall" | "winter" => {
    const d = typeof date === "string" ? new Date(date) : date;
    const month = d.getMonth();

    if (month >= 2 && month < 5) return "spring";
    if (month >= 5 && month < 8) return "summer";
    if (month >= 8 && month < 11) return "fall";
    return "winter";
  },

  /**
   * Check if date is a weekend
   */
  isWeekend: (date: Date | string): boolean => {
    const d = typeof date === "string" ? new Date(date) : date;
    const day = d.getDay();
    return day === 0 || day === 6;
  },

  /**
   * Convert date to ISO string
   */
  toISO: (date: Date | string): string => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toISOString().split("T")[0];
  },

  /**
   * Parse date from string
   */
  parse: (dateString: string): Date => {
    return new Date(dateString);
  },
};

/**
 * Time zone utilities
 */
export const timeZoneUtils = {
  /**
   * Get current time in specific timezone
   */
  getTimeInZone: (timezone: string): Date => {
    return new Date(
      new Date().toLocaleString("en-US", { timeZone: timezone })
    );
  },

  /**
   * Format date in specific timezone
   */
  formatInZone: (date: Date | string, timezone: string): string => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleString("en-US", { timeZone: timezone });
  },

  /**
   * Get timezone offset
   */
  getOffset: (timezone: string): number => {
    const now = new Date();
    const utcDate = new Date(
      now.toLocaleString("en-US", { timeZone: "UTC" })
    );
    const tzDate = new Date(
      now.toLocaleString("en-US", { timeZone: timezone })
    );
    return (tzDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60);
  },
};

/**
 * Duration utilities
 */
export const durationUtils = {
  /**
   * Format duration in hours and minutes
   */
  formatDuration: (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  },

  /**
   * Parse duration string to minutes
   */
  parseDuration: (durationStr: string): number => {
    const hourMatch = durationStr.match(/(\d+)h/);
    const minMatch = durationStr.match(/(\d+)m/);

    const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
    const minutes = minMatch ? parseInt(minMatch[1]) : 0;

    return hours * 60 + minutes;
  },

  /**
   * Format seconds as time string
   */
  formatSeconds: (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours === 0 && minutes === 0) return `${secs}s`;
    if (hours === 0) return `${minutes}m ${secs}s`;
    return `${hours}h ${minutes}m`;
  },
};
