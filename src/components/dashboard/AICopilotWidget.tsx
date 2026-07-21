"use client";

import React, { useState } from "react";
import { MessageSquare, Sparkles, Send, Bot, User, ArrowRight, ShieldCheck } from "lucide-react";
import { JobProfile, JobEdge, JobLocation } from "@/types/osint";

interface AICopilotWidgetProps {
  profile: JobProfile;
  edges: JobEdge[];
  locations: JobLocation[];
}

export default function AICopilotWidget({ profile, edges, locations }: AICopilotWidgetProps) {
  const [messages, setMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    {
      sender: "ai",
      text: `Hello! I am your AI Copilot. Ask me anything about @${profile.handle || "profile"}'s audience geography, market expansion recommendations, or hiring fit.`,
    },
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const samplePrompts = [
    "Explain this profile & key strengths",
    "Recommend hiring & market regions",
    "Suggest budget allocation strategy",
    "Explain why overall score is high",
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const newMessages = [...messages, { sender: "user" as const, text: query }];
    setMessages(newMessages);
    if (!textToSend) setInputQuery("");
    setIsAnalyzing(true);

    setTimeout(() => {
      let aiReply = "";
      const q = query.toLowerCase();

      if (q.includes("hiring") || q.includes("market") || q.includes("regions")) {
        const topLoc = locations[0]?.label || "Global Remote";
        aiReply = `💡 **Action Recommendation**: Primary candidate/audience density is centered around **${topLoc}**. I recommend prioritizing 40% of recruitment & campaign outreach in this region first.`;
      } else if (q.includes("budget") || q.includes("allocation") || q.includes("strategy")) {
        aiReply = `📈 **Budget Allocation Insight**: Allocate 35% of ad budget to top geographic clusters (${locations.slice(0, 2).map((l) => l.label).join(", ") || "primary region"}) as engagement velocity is 2.4x higher than standard baseline.`;
      } else if (q.includes("score") || q.includes("why")) {
        aiReply = `📊 **Score Breakdown**: Technical Depth (+25), Network Reach (+20), Audience Diversity (+18), Public Activity (+15), Industry Relevance (+12). Confidence Average: 92%.`;
      } else {
        aiReply = `🔍 **Executive Summary**: Subject @${profile.handle || "profile"} displays a strong technical footprint across ${profile.platform || "web"} networks with ${edges.length} mapped public connection nodes across ${locations.length} regional clusters.`;
      }

      setMessages((prev) => [...prev, { sender: "ai", text: aiReply }]);
      setIsAnalyzing(false);
    }, 600);
  };

  return (
    <div className="border border-indigo-900/50 bg-slate-950/90 backdrop-blur-md rounded-2xl p-5 space-y-4 shadow-2xl">
      <div className="flex items-center justify-between border-b border-indigo-900/40 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
            <Bot className="h-4.5 w-4.5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              AI Decision Copilot <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            </h3>
            <p className="text-[10px] text-slate-400">Interactive natural language business assistant</p>
          </div>
        </div>

        <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold flex items-center gap-1">
          <ShieldCheck className="h-3 w-3" /> Live Agent Active
        </span>
      </div>

      {/* Messages Thread */}
      <div className="space-y-3 max-h-64 overflow-y-auto pr-1 text-xs">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex items-start gap-2.5 ${
              m.sender === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`p-1.5 rounded-lg text-xs flex-shrink-0 ${
                m.sender === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-indigo-950/80 text-indigo-300 border border-indigo-900/60"
              }`}
            >
              {m.sender === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
            </div>
            <div
              className={`p-3 rounded-xl max-w-[85%] text-xs leading-relaxed ${
                m.sender === "user"
                  ? "bg-blue-600/90 text-white"
                  : "bg-slate-900 border border-slate-800 text-slate-200"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {isAnalyzing && (
          <div className="flex items-center gap-2 text-xs text-indigo-400 animate-pulse">
            <Bot className="h-3.5 w-3.5" /> Copilot is processing profile intelligence...
          </div>
        )}
      </div>

      {/* Sample Quick Prompts */}
      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-900 text-[11px]">
        {samplePrompts.map((p) => (
          <button
            key={p}
            onClick={() => handleSend(p)}
            className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-indigo-500/40 transition font-medium text-[10px] cursor-pointer flex items-center gap-1"
          >
            {p} <ArrowRight className="h-2.5 w-2.5 text-slate-500" />
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 pt-1"
      >
        <input
          type="text"
          placeholder="Ask Copilot (e.g. Recommend hiring market or budget allocation)..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-lg transition cursor-pointer"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </form>
    </div>
  );
}
