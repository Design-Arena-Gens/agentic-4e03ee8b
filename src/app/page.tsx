"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type ChatRole = "user" | "assistant";

interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  intent?: string;
  suggestions?: string[];
}

const defaultAssistantMessage: ChatMessage = {
  id: "assistant-welcome",
  role: "assistant",
  intent: "greeting",
  content:
    "Welcome to McDonald's AI crew member! I can recommend meals, share nutrition stats, surface the latest app deals, or check store hours. Tell me what you're craving or tap a quick suggestion below.",
  suggestions: ["Suggest a lunch combo", "Share breakfast ideas", "Find current deals"],
};

const suggestionPresets = [
  "Recommend a high-protein lunch",
  "What are the calories in a Big Mac?",
  "Find family-friendly meals",
  "Any current McDonald's deals?",
  "Check Chicago store hours",
];

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([defaultAssistantMessage]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
    };
    const optimisticMessages = [...messages, userMessage];
    setMessages(optimisticMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: optimisticMessages.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to reach the agent.");
      }

      const data = await response.json();
      const assistantPayload = data?.message;
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          assistantPayload?.content ??
          "Crew systems are warming up—please try asking that again in a moment.",
        intent: assistantPayload?.intent ?? "unknown",
        suggestions: assistantPayload?.suggestions ?? suggestionPresets.slice(0, 3),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      const fallbackMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        intent: "error",
        content:
          "Whoops, I couldn't connect to the crew systems. Double-check your connection and we can give it another shot.",
        suggestions: ["Suggest a combo meal", "Share dessert ideas", "Look up store hours"],
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (text: string) => {
    setInput(text);
  };

  const activeSuggestions =
    messages
      .slice()
      .reverse()
      .find((message) => message.role === "assistant" && message.suggestions?.length)?.suggestions ??
    suggestionPresets.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-white to-amber-200">
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-12 sm:px-6 lg:px-10">
        <header className="flex flex-col gap-3 rounded-3xl bg-white/70 p-6 shadow-sm ring-1 ring-yellow-200 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-amber-600">McDonald&apos;s Agent</p>
              <h1 className="text-3xl font-semibold text-zinc-900 sm:text-4xl">
                Digital Crew for Cravings, Nutrition & Deals
              </h1>
            </div>
            <div className="rounded-full bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-700">
              Always-on service · Powered by playfully smart heuristics
            </div>
          </div>
          <p className="max-w-3xl text-base leading-relaxed text-zinc-600">
            Ask for personalized meal ideas, filter by dietary goals, surface the hottest mobile app offers, or
            check a location’s hours. Your assistant keeps track of preferences during the chat—just speak naturally.
          </p>
        </header>

        <section className="flex flex-1 flex-col overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-amber-100">
          <div className="flex h-full flex-1 flex-col">
            <div className="scrollbar-thin flex-1 space-y-4 overflow-y-auto px-4 py-6 sm:px-8">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              <div ref={endRef} />
            </div>

            <div className="border-t border-amber-100 bg-amber-50/60 px-4 py-4 sm:px-8">
              <div className="mb-4 flex flex-wrap gap-2">
                {activeSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="rounded-full border border-amber-200 bg-white px-4 py-2 text-sm font-medium text-amber-700 transition hover:border-amber-300 hover:bg-amber-100"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
              <form onSubmit={handleSubmit} className="flex items-end gap-3">
                <div className="relative flex-1">
                  <textarea
                    required
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    rows={1}
                    placeholder="Ask me for a combo, nutrition facts, deals, or store info..."
                    className="h-14 w-full resize-none rounded-2xl border border-amber-200 bg-white px-5 py-4 text-base leading-tight text-zinc-800 shadow-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="h-14 rounded-2xl bg-amber-500 px-6 text-base font-semibold text-white shadow-md transition hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-amber-300"
                >
                  {isLoading ? "Thinking..." : "Send"}
                </button>
              </form>
            </div>
          </div>
        </section>

        <footer className="pb-6 text-center text-sm text-amber-700/80">
          Menu data modeled on iconic McDonald&apos;s offerings. Always verify pricing and availability with your local
          restaurant or the McDonald&apos;s app.
        </footer>
      </main>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isAssistant = message.role === "assistant";
  const bubbleClasses = isAssistant
    ? "bg-amber-100 text-zinc-900 border border-amber-200"
    : "bg-amber-500 text-white";

  return (
    <div className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}>
      <div className="max-w-xl space-y-2 sm:max-w-2xl">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-semibold uppercase tracking-widest ${
              isAssistant ? "text-amber-600" : "text-amber-100"
            }`}
          >
            {isAssistant ? "Crew AI" : "You"}
          </span>
          {isAssistant && message.intent && (
            <span className="rounded-full border border-amber-300 bg-white/70 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-amber-700">
              {message.intent}
            </span>
          )}
        </div>
        <div className={`rounded-3xl px-5 py-4 text-sm leading-relaxed shadow-sm ${bubbleClasses}`}>
          {message.content.split("\n").map((line, index) =>
            line.trim().startsWith("-") ? (
              <p key={index} className="pl-2">
                {line}
              </p>
            ) : line === "" ? (
              <div key={index} className="py-1" />
            ) : (
              <p key={index}>{line}</p>
            )
          )}
        </div>
      </div>
    </div>
  );
}
