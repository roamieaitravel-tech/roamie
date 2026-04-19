/**
 * Chat utilities and helpers
 */

export interface ChatMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
  read_at?: string;
  attachments?: string[];
}

export interface ChatSession {
  id: string;
  match_id: string;
  user_id_1: string;
  user_id_2: string;
  last_message?: ChatMessage;
  unread_count: number;
  created_at: string;
}

// Format timestamp for display
export const formatChatTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

  if (diffInMinutes < 1) return "now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "yesterday";
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

// Group messages by date
export const groupMessagesByDate = (messages: ChatMessage[]): Record<string, ChatMessage[]> => {
  return messages.reduce<Record<string, ChatMessage[]>>((acc, message) => {
    const date = new Date(message.created_at).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    acc[date] = acc[date] ? [...acc[date], message] : [message];
    return acc;
  }, {});
};

// Detect if message contains links
export const detectLinks = (message: string): string[] => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return message.match(urlRegex) || [];
};

// Sanitize message content (basic)
export const sanitizeMessage = (message: string): string => {
  return message.replace(/<[^>]*>/g, "").trim();
};

// Check if user is currently online (based on last activity)
export const isUserOnline = (lastActivity: string, threshold: number = 5): boolean => {
  const lastActivityTime = new Date(lastActivity).getTime();
  const now = new Date().getTime();
  return now - lastActivityTime < threshold * 60 * 1000; // 5 minutes by default
};

// Generate typing indicator animation (HTML string for now, convert to JSX in component)
export const getTypingIndicator = (): string => {
  return '<span class="flex gap-1"><span class="w-2 h-2 rounded-full bg-slate-400 animate-bounce" /><span class="w-2 h-2 rounded-full bg-slate-400 animate-bounce" /><span class="w-2 h-2 rounded-full bg-slate-400 animate-bounce" /></span>';
};

// Calculate unread message count
export const getUnreadCount = (messages: ChatMessage[], currentUserId: string): number => {
  return messages.filter((msg) => msg.recipient_id === currentUserId && !msg.read_at).length;
};

// Sort conversations by most recent
export const sortChatSessions = (sessions: ChatSession[]): ChatSession[] => {
  return [...sessions].sort((a, b) => {
    const aTime = new Date(a.last_message?.created_at || a.created_at).getTime();
    const bTime = new Date(b.last_message?.created_at || b.created_at).getTime();
    return bTime - aTime;
  });
};

// Suggested responses for quick replies
export const getSuggestedResponses = (): string[] => {
  return [
    "Sounds great! 👍",
    "When are you thinking of going?",
    "What's your budget range?",
    "I love that destination!",
    "Let's plan together!",
    "What's your travel style?",
  ];
};
