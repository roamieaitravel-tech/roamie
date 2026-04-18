"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, ArrowLeft, Send, Circle, Loader2 } from "lucide-react";
import { createClient, getSupabaseConfigError } from "@/lib/supabase/client";

interface ChatWindowProps {
  open: boolean;
  matchId: string;
  matchName: string;
  currentUserId: string;
  recipientId?: string;
  onClose: () => void;
}

interface MatchMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
}

export default function ChatWindow({ open, matchId, matchName, currentUserId, recipientId, onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<MatchMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [showNotice, setShowNotice] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const groupedMessages = useMemo(() => {
    return messages.reduce<Record<string, MatchMessage[]>>((acc, message) => {
      const date = new Date(message.created_at).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      acc[date] = acc[date] ? [...acc[date], message] : [message];
      return acc;
    }, {});
  }, [messages]);

  useEffect(() => {
    if (!open || !matchId) {
      return;
    }

    const supabase = createClient();
    if (!supabase) {
      setErrorMessage(getSupabaseConfigError());
      setLoading(false);
      return;
    }

    let isMounted = true;

    const loadMessages = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("messages")
        .select("id,sender_id,recipient_id,content,created_at")
        .eq("match_id", matchId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error loading chat messages", error);
        if (isMounted) {
          setErrorMessage("Error loading chat messages.");
        }
      } else if (isMounted && data) {
        setMessages(data);
        setErrorMessage(null);
      }
      setLoading(false);
    };

    loadMessages();

    const channel = supabase
      .channel(`chat-window-${matchId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `match_id=eq.${matchId}`,
        },
        (payload: { new: MatchMessage }) => {
          const message = payload.new as MatchMessage;
          setMessages((current) => [...current, message]);
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [open, matchId]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [groupedMessages]);

  const handleSend = async () => {
    const content = draft.trim();
    if (!content || !matchId) {
      return;
    }

    const supabase = createClient();
    if (!supabase) {
      setErrorMessage(getSupabaseConfigError());
      return;
    }

    const now = new Date().toISOString();

    const { error } = await supabase.from("messages").insert([
      {
        match_id: matchId,
        sender_id: currentUserId,
        recipient_id: recipientId ?? null,
        content,
        read: false,
        created_at: now,
        updated_at: now,
      },
    ]);

    if (error) {
      console.error("Error sending message", error);
      setErrorMessage("Error sending message.");
      return;
    }

    setDraft("");
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end bg-slate-950/60 sm:items-center">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative z-10 h-full w-full bg-white shadow-2xl sm:max-w-[380px] sm:rounded-l-3xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <button type="button" onClick={onClose} className="text-slate-500 transition hover:text-slate-700">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <p className="text-sm font-semibold text-slate-900">{matchName}</p>
              <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Online
              </div>
            </div>
          </div>
        </div>

        {showNotice ? (
          <div className="border-b border-slate-200 bg-amber-50 px-6 py-4 text-sm text-slate-700">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-700" />
              <div>
                <p className="font-semibold text-slate-900">Safety notice</p>
                <p>Never share personal info like phone number or social media until you meet in person.</p>
              </div>
              <button type="button" onClick={() => setShowNotice(false)} className="text-slate-500 hover:text-slate-700">
                <span className="sr-only">Dismiss</span>
                ×
              </button>
            </div>
          </div>
        ) : null}

        <div className="flex h-[calc(100%-240px)] flex-col overflow-hidden">
          <div ref={listRef} className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
            {loading ? (
              <div className="flex h-full items-center justify-center text-slate-500">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading messages
              </div>
            ) : errorMessage ? (
              <div className="rounded-3xl border border-orange-100 bg-orange-50 p-4 text-sm text-orange-700">
                {errorMessage}
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-slate-500">Start the conversation and get to know your match.</div>
            ) : (
              Object.entries(groupedMessages).map(([date, items]) => (
                <div key={date} className="space-y-4">
                  <div className="text-center text-xs uppercase tracking-[0.24em] text-slate-400">{date}</div>
                  {items.map((message) => {
                    const isMine = message.sender_id === currentUserId;
                    return (
                      <div key={message.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] rounded-3xl px-4 py-3 text-sm leading-6 ${isMine ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-900"}`}>
                          <p>{message.content}</p>
                          <div className="mt-2 text-xs text-slate-400">{new Date(message.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="border-t border-slate-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Type a message..."
              className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-orange-500"
            />
            <button
              type="button"
              onClick={handleSend}
              className="inline-flex h-11 items-center justify-center rounded-full bg-orange-500 px-4 text-white transition hover:bg-orange-600"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
