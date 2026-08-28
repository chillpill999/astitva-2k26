// ============================================================================
// ASTITVA 2K26 - AI Fest Assistant Chat Widget
// Path: components/ai/AiChatWidget.tsx
// ============================================================================

"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Send, X, Bot, User as UserIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
  "What's the prize pool?",
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
    } catch (err) {
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
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-black font-bold shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all px-5 py-3"
          aria-label="Open AstitvaBot"
        >
          <Sparkles className="h-4 w-4" />
          <span className="text-sm">AstitvaBot</span>
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[min(420px,calc(100vw-3rem))] h-[min(640px,calc(100vh-6rem))] rounded-2xl border border-cyan-500/30 bg-slate-950/95 backdrop-blur-2xl shadow-2xl shadow-cyan-500/20 flex flex-col overflow-hidden animate-in fade-in-50 slide-in-from-bottom-4">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-gradient-to-r from-cyan-950/40 to-purple-950/40">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">AstitvaBot</p>
                <p className="text-[10px] font-mono text-cyan-300">AST26 · Local RAG</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-white"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="space-y-3">
                <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3">
                  <p className="text-sm text-white">
                    Namaste! I'm AstitvaBot, your festival guide. Ask me about schedules, venues,
                    rules, registrations, teams, results, or certificates.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">
                    Try a prompt
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_PROMPTS.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => sendMessage(p)}
                        className="rounded-full border border-cyan-500/30 bg-cyan-500/5 px-3 py-1 text-[11px] text-cyan-200 hover:bg-cyan-500/15 transition"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                className={cn("flex gap-2", m.role === "user" ? "justify-end" : "justify-start")}
              >
                {m.role === "assistant" && (
                  <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                    <Bot className="h-3.5 w-3.5 text-white" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-3 py-2 text-sm",
                    m.role === "user"
                      ? "bg-cyan-500/20 text-white border border-cyan-500/30"
                      : "bg-slate-900/80 text-slate-100 border border-white/10"
                  )}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                  {m.relatedEvents && m.relatedEvents.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {m.relatedEvents.map((e) => (
                        <Link
                          key={e.id}
                          href={`/events/${e.id}`}
                          className="block rounded-lg border border-white/10 bg-slate-950/60 px-2 py-1.5 text-[11px] hover:border-cyan-500/30"
                        >
                          <p className="font-bold text-cyan-200">{e.title}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{e.venue}</p>
                        </Link>
                      ))}
                    </div>
                  )}
                  {m.suggestedActions && m.suggestedActions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {m.suggestedActions.map((a) => (
                        <Link
                          key={a.url}
                          href={a.url}
                          className="rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 text-[10px] text-purple-200 hover:bg-purple-500/20"
                        >
                          {a.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                {m.role === "user" && (
                  <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center">
                    <UserIcon className="h-3.5 w-3.5 text-cyan-300" />
                  </div>
                )}
              </div>
            ))}

            {pending && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Loader2 className="h-3 w-3 animate-spin" /> AstitvaBot is thinking...
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="border-t border-white/10 p-3 flex items-center gap-2"
          >
            <Input
              placeholder="Ask about schedule, venue, rules…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="bg-slate-900/60 border-white/10 text-white text-sm"
              disabled={pending}
            />
            <Button
              type="submit"
              variant="neonCyan"
              size="icon"
              disabled={pending || !input.trim()}
              className="flex-shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
