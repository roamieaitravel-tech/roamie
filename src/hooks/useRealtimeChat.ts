import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { ChatMessage } from "@/utils/chat";
import { RealtimeChannel } from "@supabase/supabase-js";

interface UseRealtimeChatProps {
  matchId: string;
  currentUserId: string;
  recipientId?: string;
  initialMessages?: ChatMessage[];
}

export function useRealtimeChat({ matchId, currentUserId, recipientId, initialMessages = [] }: UseRealtimeChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClient();
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!supabase || !matchId) return;

    let isMounted = true;

    // Load initial messages if not provided natively by the component mapping
    const loadMessages = async () => {
      if (initialMessages.length > 0) return;
      const { data, error: fetchError } = await supabase
        .from("messages")
        .select("*")
        .eq("match_id", matchId)
        .order("created_at", { ascending: true });

      if (fetchError) {
        if (isMounted) setError("Error loading chat messages.");
      } else if (data && isMounted) {
        setMessages(data as ChatMessage[]);
      }
    };
    loadMessages();

    // Configure presence tracking mapping specific recipient
    const chatChannel = supabase.channel(`chat_${matchId}`, {
      config: {
        presence: {
          key: currentUserId,
        },
      },
    });

    chatChannel
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          if (isMounted) {
            setMessages((current) => {
              // Deduplicate if optimistic update already ran tracking similar timestamps!
              const exists = current.some((msg) => 
                msg.id === newMessage.id || 
                (msg.content === newMessage.content && 
                 msg.sender_id === newMessage.sender_id && 
                 Math.abs(new Date(newMessage.created_at).getTime() - new Date(msg.created_at).getTime()) < 5000)
              );
              
              if (exists) {
                // If it was an optimistic temp insertion update the real ID backing the UI.
                return current.map(msg => 
                  (msg.id.startsWith("temp_") && msg.content === newMessage.content) ? newMessage : msg
                );
              }
              return [...current, newMessage];
            });
          }
        }
      )
      .on(
        "broadcast",
        { event: "typing" },
        (payload) => {
          if (isMounted && payload.payload.userId !== currentUserId) {
            setIsTyping(payload.payload.isTyping);
          }
        }
      )
      .on("presence", { event: "sync" }, () => {
        if (!isMounted) return;
        const state = chatChannel.presenceState();
        if (recipientId) {
           const isRecipientOnline = Object.keys(state).some(key => key === recipientId);
           setIsOnline(isRecipientOnline);
        } else {
           const otherUsers = Object.keys(state).filter(id => id !== currentUserId);
           setIsOnline(otherUsers.length > 0);
        }
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await chatChannel.track({ online_at: new Date().toISOString() });
        }
      });

    setChannel(chatChannel);

    return () => {
      isMounted = false;
      supabase.removeChannel(chatChannel);
    };
  }, [matchId, currentUserId, recipientId, supabase, initialMessages.length]);

  const sendTypingStatus = useCallback(
    async (typing: boolean) => {
      if (channel) {
        await channel.send({
          type: "broadcast",
          event: "typing",
          payload: { userId: currentUserId, isTyping: typing },
        });
      }
    },
    [channel, currentUserId]
  );

  const sendMessage = async (content: string) => {
    if (!content.trim() || !matchId) return;

    const tempId = `temp_${Date.now()}`;
    const optimisticMessage: any = {
      id: tempId,
      match_id: matchId,
      sender_id: currentUserId,
      recipient_id: recipientId || "",
      content: content.trim(),
      created_at: new Date().toISOString(),
      read: false,
      isOptimistic: true // UI flag natively handled
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    sendTypingStatus(false);

    try {
      const res = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId,
          recipientId,
          content: content.trim(),
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setMessages((prev) => 
        prev.map((msg) => (msg.id === tempId ? data.message : msg))
      );
      
      return data.message;
    } catch (err) {
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
      setError(err instanceof Error ? err.message : "Failed to send message");
      throw err;
    }
  };

  return {
    messages,
    sendMessage,
    isTyping,
    isOnline,
    sendTypingStatus,
    error,
  };
}
