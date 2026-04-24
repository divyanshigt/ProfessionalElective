import React, { useState } from "react";
import { assistantService } from "../services/api";

const Assistant = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! You can ask me about resume improvement, career paths, internships, academic performance, or placement readiness.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!query.trim()) return;

    const userMsg = { role: "user", content: query };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await assistantService.ask(query);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.data.response },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, assistant response failed." },
      ]);
    } finally {
      setLoading(false);
      setQuery("");
    }
  };

  return (
    <div className="text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="mb-2 inline-block rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1 text-sm text-cyan-300">
            AI Academic Assistant
          </p>
          <h1 className="bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 bg-clip-text text-4xl font-extrabold text-transparent">
            Smart Student Assistant
          </h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            Ask questions about placement, internships, resumes, career
            planning, or academics.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
          <div className="max-h-[500px] space-y-4 overflow-y-auto pr-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`rounded-2xl p-4 text-sm ${
                  msg.role === "user"
                    ? "ml-auto max-w-[75%] bg-cyan-500/20 text-cyan-100"
                    : "mr-auto max-w-[75%] bg-slate-900/50 text-slate-200"
                }`}
              >
                {msg.content}
              </div>
            ))}

            {loading && (
              <div className="mr-auto max-w-[75%] rounded-2xl bg-slate-900/50 p-4 text-sm text-slate-300">
                Thinking...
              </div>
            )}
          </div>

          <div className="mt-6 flex gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything about your student profile..."
              className="flex-1 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none focus:border-cyan-400"
            />
            <button
              onClick={handleAsk}
              className="rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 px-6 py-3 font-semibold text-white"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assistant;