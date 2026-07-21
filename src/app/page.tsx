"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Github,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Tv2,
  Globe,
  Loader2,
  FileSearch2,
  Network,
  MapPin,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";
import { UnderwaterCanvas } from "@/components/ui";

export default function Home() {
  const [urlInput, setUrlInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setLoading(true);
    setError("");

    let targetUrl = urlInput.trim();
    if (!targetUrl.includes(".") && !targetUrl.includes("/")) {
      targetUrl = `https://github.com/${targetUrl}`;
    }

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to enqueue analysis job.");
      }

      // Redirect to the dashboard for that job ID
      router.push(`/dashboard/${data.jobId}`);
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
      setLoading(false);
    }
  };

  const platforms = [
    { name: "GitHub", icon: Github, color: "text-slate-200" },
    { name: "X / Twitter", icon: Twitter, color: "text-slate-400" },
    { name: "Instagram", icon: Instagram, color: "text-pink-500" },
    { name: "LinkedIn", icon: Linkedin, color: "text-blue-400" },
    { name: "YouTube", icon: Youtube, color: "text-red-500" },
    { name: "Reddit", icon: Tv2, color: "text-orange-500" },
    { name: "TikTok", icon: Tv2, color: "text-teal-400" },
    { name: "Website/Blog", icon: Globe, color: "text-emerald-400" },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden py-12 px-4 sm:px-6 min-h-[calc(100vh-4rem)]">
      <UnderwaterCanvas />
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[1px] pointer-events-none z-0" />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-4xl text-center space-y-6 relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-xs font-semibold text-blue-300">
          <ShieldCheck className="h-4 w-4" /> Live OSINT & Intelligence Engine
        </div>
        <h1 className="text-4xl font-extrabold sm:text-6xl tracking-tight bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
          Map Real Social Graphs
        </h1>
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400">
          Paste any public GitHub username/URL, Reddit profile, or website URL. 
          Extract real public connections, geo-signals, and render an interactive graph.
        </p>
      </motion.div>

      {/* Input Box */}
      <div className="w-full max-w-2xl mt-10 relative z-10">
        <form onSubmit={handleSubmit} className="relative group">
          <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 opacity-40 blur transition duration-1000 group-hover:opacity-60" />
          <div className="relative flex items-center bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-xl overflow-hidden shadow-2xl p-1">
            <Search className="h-5 w-5 text-slate-400 ml-4 flex-shrink-0" />
            <input
              type="text"
              placeholder="Paste a profile or website URL (e.g. torvalds or https://github.com/torvalds)"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              disabled={loading}
              className="w-full bg-transparent border-0 outline-0 py-3.5 px-4 text-slate-200 placeholder-slate-500 text-sm focus:ring-0"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg px-6 py-2.5 text-sm font-semibold transition flex items-center gap-2 flex-shrink-0 disabled:opacity-50 cursor-pointer shadow-lg shadow-blue-500/20"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Analyzing
                </>
              ) : (
                "Analyze Real Data"
              )}
            </button>
          </div>
        </form>

        {error && (
          <p className="mt-3 text-sm text-red-400 text-center bg-red-950/40 backdrop-blur-md border border-red-900/50 rounded-lg py-2">
            {error}
          </p>
        )}

        {/* Quick Sample Target Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
          <span className="text-slate-400 font-semibold">Try sample:</span>
          {[
            { label: "torvalds (GitHub)", val: "https://github.com/torvalds" },
            { label: "spez (Reddit)", val: "https://www.reddit.com/user/spez" },
            { label: "facebook (GitHub)", val: "https://github.com/facebook" },
            { label: "Hacker News", val: "https://news.ycombinator.com" },
          ].map((sample) => (
            <button
              key={sample.val}
              type="button"
              onClick={() => {
                setUrlInput(sample.val);
              }}
              className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-slate-300 hover:text-white hover:border-blue-500/50 transition font-mono text-[11px] cursor-pointer"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      {/* Supported Platforms */}
      <div className="w-full max-w-3xl mt-12 text-center relative z-10">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Supported Live Platforms
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
          {platforms.map((p) => (
            <div
              key={p.name}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-800 bg-slate-950/60 backdrop-blur-md text-xs font-medium text-slate-300 shadow-sm"
            >
              <p.icon className={`h-3.5 w-3.5 ${p.color}`} />
              {p.name}
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="w-full max-w-5xl mt-20 border-t border-slate-900/80 pt-16 relative z-10">
        <h2 className="text-2xl font-bold text-center text-slate-200">Live OSINT Pipeline</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          <div className="bg-slate-950/60 backdrop-blur-md border border-slate-900 p-6 rounded-xl space-y-3 shadow-lg">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
              <FileSearch2 className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-slate-200">1. Real API Extraction</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fetches live GitHub endpoints, public Reddit JSON feeds, or page metadata with 
              exponential backoff and zero mock fallbacks.
            </p>
          </div>
          <div className="bg-slate-950/60 backdrop-blur-md border border-slate-900 p-6 rounded-xl space-y-3 shadow-lg">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
              <Network className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-slate-200">2. Relationship Mapping</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Discovers authentic organization ties, user repos, linked social profiles, 
              and active subreddit participations.
            </p>
          </div>
          <div className="bg-slate-950/60 backdrop-blur-md border border-slate-900 p-6 rounded-xl space-y-3 shadow-lg">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
              <MapPin className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-slate-200">3. Live Geocoding</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Declared profile location fields are geocoded using OpenStreetMap Nominatim 
              with confidence scoring metrics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

