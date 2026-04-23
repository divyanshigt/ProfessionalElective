import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { assistantService } from "../services/api";

const quickPrompts = [
  "How do I improve my academic performance and GPA?",
  "How can I make my resume stronger?",
  "What should I do for placements?",
  "Suggest projects for AI/ML students.",
  "How do I get better internships?",
  "Which career path suits my skills?",
];

const Assistant = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "## Hi! I’m StudentPlus AI 👋\nAsk me anything about **academics**, **resume**, **placements**, **internships**, **projects**, or **career direction**.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const finalText = text.trim();
    if (!finalText) return;

    setMessages((prev) => [...prev, { role: "user", content: finalText }]);
    setQuery("");
    setLoading(true);

    try {
      const res = await assistantService.ask(finalText);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: res?.data?.response || "No response from assistant.",
        },
      ]);
    } catch (err) {
      console.error("Assistant API error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            err?.response?.data?.details ||
            err?.response?.data?.error ||
            "Assistant failed.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(query);
    }
  };

  return (
    <div className="text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <p className="mb-2 inline-block rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1 text-sm text-cyan-300">
            AI Assistant
          </p>
          <h1 className="bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 bg-clip-text text-4xl font-extrabold text-transparent">
            Smart Student AI Assistant
          </h1>
          <p className="mt-3 max-w-3xl text-slate-300">
            Ask natural questions about academics, placements, resume,
            internships, projects, and career planning.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
              <h3 className="text-xl font-bold text-white">Quick Prompts</h3>
              <p className="mt-2 text-sm text-slate-300">
                Start instantly with guided prompts.
              </p>

              <div className="mt-4 space-y-3">
                {quickPrompts.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => sendMessage(item)}
                    className="w-full rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-left text-sm text-cyan-200 transition hover:bg-cyan-400/20"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
              <h3 className="text-xl font-bold text-white">Assistant Scope</h3>
              <div className="mt-4 grid gap-3">
                <InfoCard
                  title="Academics"
                  text="GPA improvement, study methods, consistency, attendance."
                />
                <InfoCard
                  title="Career"
                  text="Role suggestions, growth paths, missing skills."
                />
                <InfoCard
                  title="Placements"
                  text="DSA, aptitude, projects, interview preparation."
                />
                <InfoCard
                  title="Resume & Internships"
                  text="ATS improvement, projects, internships, profile building."
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Live AI Chat</h3>
                <p className="mt-1 text-sm text-slate-300">
                  Chat naturally like a modern AI assistant.
                </p>
              </div>
              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-xs text-cyan-300">
                AI Online
              </div>
            </div>

            <div
              ref={chatRef}
              className="h-[520px] space-y-4 overflow-y-auto rounded-2xl bg-slate-950/40 p-4"
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[82%] rounded-3xl px-5 py-4 text-sm leading-7 shadow-lg ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                        : "border border-white/10 bg-slate-900/70 text-slate-200"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-invert max-w-none text-sm leading-7 prose-p:my-2 prose-li:my-1 prose-headings:mt-3 prose-headings:mb-2 prose-strong:text-white prose-ul:pl-5 prose-ol:pl-5">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">
                    Thinking...
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 flex gap-3">
              <textarea
                rows="2"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about your student journey..."
                className="flex-1 resize-none rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              />
              <button
                onClick={() => sendMessage(query)}
                disabled={loading}
                className="rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 px-6 py-3 font-semibold text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function InfoCard({ title, text }) {
  return (
    <div className="rounded-2xl bg-slate-900/40 p-4">
      <p className="text-sm font-semibold text-cyan-300">{title}</p>
      <p className="mt-2 text-sm text-slate-300">{text}</p>
    </div>
  );
}

export default Assistant;