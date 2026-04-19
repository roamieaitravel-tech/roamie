/**
 * Notification management system
 * Handles in-app and push notifications
 */

export enum NotificationType {
  MESSAGE = "message",
  BOOKING = "booking",
  PAYMENT = "payment",
  MATCH = "match",
  TRIP = "trip",
  PROMOTION = "promotion",
  SYSTEM = "system",
}

export enum NotificationPriority {
  LOW = "low",
  NORMAL = "normal",
  HIGH = "high",
  URGENT = "urgent",
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  createdAt: Date;
  expiresAt?: Date;
  metadata?: Record<string, unknown>;
}

// Notification templates
export const notificationTemplates = {
  newMessage: (senderName: string) => ({
    type: NotificationType.MESSAGE,
    title: "New Message",
    message: `${senderName} sent you a message`,
    priority: NotificationPriority.NORMAL,
  }),

  newMatch: (userName: string) => ({
    type: NotificationType.MATCH,
    title: "New Travel Match!",
    message: `You matched with ${userName}! Start planning together.`,
    priority: NotificationPriority.HIGH,
  }),

  bookingConfirmed: (tripName: string) => ({
    type: NotificationType.BOOKING,
    title: "Booking Confirmed",
    message: `Your ${tripName} booking is confirmed!`,
    priority: NotificationPriority.HIGH,
  }),

  paymentSuccessful: (amount: number) => ({
    type: NotificationType.PAYMENT,
    title: "Payment Successful",
    message: `Payment of $${amount} has been processed.`,
    priority: NotificationPriority.HIGH,
  }),

  tripReminder: (tripName: string, daysUntil: number) => ({
    type: NotificationType.TRIP,
    title: "Trip Reminder",
    message: `Your ${tripName} trip is in ${daysUntil} days!`,
    priority: NotificationPriority.NORMAL,
  }),

  specialOffer: (discount: number) => ({
    type: NotificationType.PROMOTION,
    title: "Special Offer",
    message: `Save ${discount}% on your next trip!`,
    priority: NotificationPriority.LOW,
  }),
};

// Create notification object
export const createNotification = (
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  options?: {
    priority?: NotificationPriority;
    actionUrl?: string;
    actionLabel?: string;
    metadata?: Record<string, unknown>;
    expiresIn?: number; // minutes
  }
): Notification => {
  const now = new Date();
  const expiresAt = options?.expiresIn
    ? new Date(now.getTime() + options.expiresIn * 60000)
    : undefined;

  return {
    id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    userId,
    type,
    title,
    message,
    priority: options?.priority || NotificationPriority.NORMAL,
    read: false,
    actionUrl: options?.actionUrl,
    actionLabel: options?.actionLabel,
    createdAt: now,
    expiresAt,
    metadata: options?.metadata,
  };
};

// Filter notifications by priority
export const filterNotificationsByPriority = (
  notifications: Notification[],
  priority: NotificationPriority
): Notification[] => {
  return notifications.filter((n) => n.priority === priority);
};

// Get unread count
export const getUnreadCount = (notifications: Notification[]): number => {
  return notifications.filter((n) => !n.read).length;
};

// Get unread by type
export const getUnreadByType = (
  notifications: Notification[],
  type: NotificationType
): number => {
  return notifications.filter((n) => !n.read && n.type === type).length;
};

// Sort by date
export const sortByDate = (
  notifications: Notification[],
  order: "asc" | "desc" = "desc"
): Notification[] => {
  return [...notifications].sort((a, b) => {
    const diff = b.createdAt.getTime() - a.createdAt.getTime();
    return order === "asc" ? -diff : diff;
  });
};

// Filter expired notifications
export const removeExpiredNotifications = (notifications: Notification[]): Notification[] => {
  const now = new Date();
  return notifications.filter((n) => !n.expiresAt || n.expiresAt > now);
};

// Group by type
export const groupByType = (
  notifications: Notification[]
): Record<NotificationType, Notification[]> => {
  return Object.values(NotificationType).reduce(
    (acc, type) => {
      acc[type] = notifications.filter((n) => n.type === type);
      return acc;
    },
    {} as Record<NotificationType, Notification[]>
  );
};

// Get high priority unread
export const getHighPriorityUnread = (notifications: Notification[]): Notification[] => {
  return notifications.filter(
    (n) =>
      !n.read && (n.priority === NotificationPriority.HIGH || n.priority === NotificationPriority.URGENT)
  );
};
