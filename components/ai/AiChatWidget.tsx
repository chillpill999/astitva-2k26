// ============================================================================
// ASTITVA 2K26 - AI Fest Assistant Chat Widget (Exteta Luxury Aesthetic)
// Path: components/ai/AiChatWidget.tsx
// ============================================================================

"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Send, X, Bot, User as UserIcon, Loader2 } from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  relatedEvents?: Array<{ id: string; title: string; venue: string }>;
  suggestedActions?: Array<{ label: string; url: string }>;
}

const SUGGESTED_PROMPTS = [
  "When is BGMI?",
  "Where is Chess?",
  "How do I create a team?",
  "Verify my certificate",
  "What awards are given?",
];

export function AiChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const sessionId = useRef<string>(
    typeof window !== "undefined"
      ? `sess-${localStorage.getItem("ast26_ai_session") ?? Date.now()}`
      : "sess-server"
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("ast26_ai_session")) {
      localStorage.setItem("ast26_ai_session", sessionId.current);
    }
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 1e6, behavior: "smooth" });
  }, [messages, open]);

  async function sendMessage(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || pending) return;
    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, role: "user", content: msg },
    ]);
    setInput("");
    setPending(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, sessionId: sessionId.current }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: data.answer,
          relatedEvents: data.relatedEvents,
          suggestedActions: data.suggestedActions,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-err-${Date.now()}`,
          role: "assistant",
          content: "I'm having trouble connecting right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2 rounded-full bg-[#E85A4F] text-white font-mono text-xs font-bold tracking-wider uppercase shadow-2xl hover:bg-[#C94A40] transition-all px-3.5 py-2.5 sm:px-4 sm:py-3 border border-[#E85A4F] cursor-pointer active:scale-95"
          aria-label="Open AI Fest Assistant"
        >
          <Sparkles className="w-4 h-4 text-white animate-pulse" />
          <span className="sm:inline">AI ASSISTANT</span>
        </button>
      )}

      {/* Floating Chat Window */}
      {open && (
        <div className="fixed inset-x-3 bottom-3 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[420px] max-h-[86vh] h-[600px] bg-[#F6F4EE] text-[#1A1918] border border-[#8E8D8A]/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-3.5 sm:p-4 bg-[#EAE7DC] border-b border-[#8E8D8A]/25">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-[#E85A4F] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                AI
              </div>
              <div>
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-[#1A1918]">
                  ASTITVA CONCIERGE
                </h3>
                <p className="text-[10px] font-mono text-[#8E8D8A]">
                  24/7 AI Fest Assistant
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded text-[#8E8D8A] hover:text-[#1A1918] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Message Stream */}
          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.length === 0 && (
              <div className="space-y-4 pt-4">
                <div className="p-4 rounded-2xl bg-[#EAE7DC] border border-[#8E8D8A]/20 space-y-2">
                  <p className="text-xs font-semibold text-[#1A1918]">
                    Namaste! I am your ASTITVA 2K26 assistant. Ask me anything about tournament rules, venue locations, schedule, or team registrations.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-[#8E8D8A] uppercase tracking-wider block">
                    SUGGESTED INQUIRIES:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTED_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => sendMessage(prompt)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-[#EAE7DC] border border-[#8E8D8A]/30 text-[#1A1918] hover:border-[#E85A4F] hover:text-[#E85A4F] transition-colors text-left"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 text-xs ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 ${
                    m.role === "user"
                      ? "bg-[#1A1918] text-[#EAE7DC]"
                      : "bg-[#EAE7DC] border border-[#8E8D8A]/25 text-[#1A1918]"
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{m.content}</p>

                  {m.relatedEvents && m.relatedEvents.length > 0 && (
                    <div className="pt-2 border-t border-[#8E8D8A]/20 space-y-1">
                      <span className="text-[10px] font-mono text-[#8E8D8A] uppercase block">
                        Related Tournaments:
                      </span>
                      {m.relatedEvents.map((evt) => (
                        <Link
                          key={evt.id}
                          href={`/events/${evt.id}`}
                          className="block p-1.5 rounded bg-[#F6F4EE] border border-[#8E8D8A]/20 text-[11px] font-mono text-[#E85A4F] hover:underline"
                        >
                          {evt.title} ({evt.venue}) →
                        </Link>
                      ))}
                    </div>
                  )}

                  {m.suggestedActions && m.suggestedActions.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-1">
                      {m.suggestedActions.map((act) => (
                        <Link
                          key={act.url}
                          href={act.url}
                          className="px-2 py-1 rounded bg-[#E85A4F] text-white text-[10px] font-mono uppercase font-bold"
                        >
                          {act.label} →
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {pending && (
              <div className="flex items-center space-x-2 text-xs text-[#8E8D8A] font-mono p-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#E85A4F]" />
                <span>Consulting festival knowledge base...</span>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-[#EAE7DC] border-t border-[#8E8D8A]/25 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask about events, venues, schedule..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-[#F6F4EE] border border-[#8E8D8A]/30 text-xs font-mono text-[#1A1918] placeholder:text-[#8E8D8A]/70 focus:outline-none focus:border-[#E85A4F]"
            />
            <button
              onClick={() => sendMessage()}
              disabled={pending || !input.trim()}
              className="p-2 rounded-xl bg-[#E85A4F] text-white disabled:opacity-50 hover:bg-[#C94A40] transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
