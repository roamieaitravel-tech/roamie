"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, ArrowLeft, Send, Check, CheckCheck } from "lucide-react";
import { useRealtimeChat } from "@/hooks/useRealtimeChat";
import { dateUtils } from "@/utils/date";
import { getTypingIndicator } from "@/utils/chat";

interface ChatWindowProps {
  open: boolean;
  matchId: string;
  matchName: string;
  currentUserId: string;
  recipientId?: string;
  onClose: () => void;
}

export default function ChatWindow({ open, matchId, matchName, currentUserId, recipientId, onClose }: ChatWindowProps) {
  const [draft, setDraft] = useState("");
  const [showNotice, setShowNotice] = useState(true);
  const listRef = useRef<HTMLDivElement | null>(null);
  let typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    messages,
    sendMessage,
    isTyping,
    isOnline,
    sendTypingStatus,
    error: chatError
  } = useRealtimeChat({
    matchId,
    currentUserId,
    recipientId,
  });

  const groupedMessages = useMemo(() => {
    return messages.reduce<Record<string, any[]>>((acc, message) => {
      const date = dateUtils.format(message.created_at);
      acc[date] = acc[date] ? [...acc[date], message] : [message];
      return acc;
    }, {});
  }, [messages]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [groupedMessages, isTyping]);

  const handleSend = async () => {
    if (!draft.trim()) return;
    const currentDraft = draft;
    setDraft(""); // Clear instantly for optimal local UI latency impression
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    try {
      await sendMessage(currentDraft);
    } catch (e) {
      // Hook handles graceful degradation / rendering of error states securely
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDraft(e.target.value);
    
    sendTypingStatus(true);
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      sendTypingStatus(false);
    }, 2000); // 2 second typing debounce timeout
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
                <span className={`inline-flex h-2.5 w-2.5 rounded-full ${isOnline ? "bg-emerald-500" : "bg-slate-300"}`} />
                {isOnline ? "Online" : "Offline"}
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
          <div ref={listRef} className="flex-1 space-y-6 overflow-y-auto px-6 py-5 scroll-smooth">
            {chatError ? (
              <div className="rounded-3xl border border-orange-100 bg-orange-50 p-4 text-sm text-orange-700">
                {chatError}
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-slate-500 mt-28">Start the conversation and get to know your match.</div>
            ) : (
              Object.entries(groupedMessages).map(([date, items]) => (
                <div key={date} className="space-y-4">
                  <div className="text-center text-xs uppercase tracking-[0.24em] text-slate-400">{date}</div>
                  {items.map((message) => {
                    const isMine = message.sender_id === currentUserId;
                    const isOptimistic = (message as any).isOptimistic;
                    
                    return (
                      <div key={message.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] rounded-3xl px-4 py-3 text-sm leading-6 transition-all ${isMine ? "bg-[#FF6B35] text-white" : "bg-slate-100 text-slate-900"} ${isOptimistic ? "opacity-70" : "opacity-100"}`}>
                          <p className="whitespace-pre-wrap word-break">{message.content}</p>
                          <div className={`mt-2 text-xs flex items-center justify-end gap-1 ${isMine ? "text-orange-200" : "text-slate-400"}`}>
                            {dateUtils.formatTime(message.created_at)}
                            {isMine && !isOptimistic && <CheckCheck className="h-3 w-3" />}
                            {isMine && isOptimistic && <Check className="h-3 w-3" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))
            )}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-3xl px-6 py-3 bg-slate-100 text-slate-900 h-[48px] flex items-center justify-center">
                  <div dangerouslySetInnerHTML={{ __html: getTypingIndicator() }} />
                </div>
              </div>
            )}
            
          </div>
        </div>

        <div className="border-t border-slate-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <input
              value={draft}
              onChange={handleTyping}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-orange-500"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!draft.trim()}
              className="inline-flex h-11 items-center justify-center rounded-full bg-[#FF6B35] px-4 text-white transition hover:bg-[#ff7a4c] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
