"use client";

import React from "react";
import {
  Share2,
  Award,
  CheckCircle2,
  HelpCircle,
  Network,
  Briefcase,
  MapPin,
  Code2,
} from "lucide-react";
import { scoringEngine } from "@/lib/scoring/scoringEngine";
import { JobProfile, JobEdge, JobLocation } from "@/types/osint";

interface KnowledgeGraphTabProps {
  profile: JobProfile;
  edges: JobEdge[];
  locations: JobLocation[];
}

export default function KnowledgeGraphTab({
  profile,
  edges,
  locations,
}: KnowledgeGraphTabProps) {
  // Evaluate explainable 10-metric score
  const scoreResult = scoringEngine.evaluateProfile({
    handle: profile.handle || "subject",
    platform: profile.platform || "social",
    connectionCount: edges.length,
    locationCount: locations.length,
    hasBio: !!profile.bio,
    bioLength: profile.bio?.length || 0,
    verified: !!profile.verified,
    confidenceAvg: 0.92,
  });

  const scoresList = [
    scoreResult.profileQuality,
    scoreResult.networkReach,
    scoreResult.audienceDiversity,
    scoreResult.marketCoverage,
    scoreResult.skillMaturity,
    scoreResult.technicalDepth,
    scoreResult.industryMatch,
    scoreResult.growthPotential,
    scoreResult.brandVisibility,
    scoreResult.dataConfidence,
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner: Overall Score & Knowledge Graph Summary */}
      <div className="rounded-2xl border border-blue-900/50 bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <Network className="h-3.5 w-3.5" /> Enterprise Knowledge Graph &amp; Intelligence Score
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            {profile.displayName || profile.handle} Knowledge Graph Matrix
          </h2>
          <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
            {scoreResult.summaryReasoning}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-950/80 border border-blue-500/30 text-center min-w-[160px]">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
            Overall Score
          </span>
          <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
            {scoreResult.overallScore}
          </span>
          <span className="text-[10px] text-blue-400 font-semibold mt-1">/ 100 Index</span>
        </div>
      </div>

      {/* 10-Metric Score Breakdown Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Award className="h-4.5 w-4.5 text-blue-400" /> Explainable 10-Metric Score Breakdown
          </h3>
          <span className="text-xs text-slate-400">Deterministic Algorithm v2.5</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {scoresList.map((item) => (
            <div
              key={item.scoreName}
              className="bg-slate-900/40 border border-slate-900 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-slate-800 transition"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">{item.scoreName}</span>
                  <span className="font-extrabold text-blue-400">{item.scoreValue}</span>
                </div>

                <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-400 transition-all duration-500"
                    style={{ width: `${item.scoreValue}%` }}
                  />
                </div>
              </div>

              <p className="text-[10px] text-slate-400 leading-tight">{item.explanation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Knowledge Graph Relational Matrix */}
      <div className="border border-slate-900 bg-slate-900/20 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Share2 className="h-4.5 w-4.5 text-indigo-400" /> Discovered Relational Entity Nodes
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Node: Person */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase">
              <Network className="h-4 w-4" /> Node: Person / Profile
            </div>
            <p className="text-sm font-semibold text-white">{profile.displayName || profile.handle}</p>
            <p className="text-xs text-slate-400">Platform: {profile.platform}</p>
          </div>

          {/* Node: Locations */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase">
              <MapPin className="h-4 w-4" /> Node: Geographic Hubs
            </div>
            <p className="text-sm font-semibold text-white">
              {locations.length > 0 ? locations.map((l) => l.label).slice(0, 2).join(", ") : "Remote / Unspecified"}
            </p>
            <p className="text-xs text-slate-400">{locations.length} geocoded location signals</p>
          </div>

          {/* Node: Skills & Tech */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase">
              <Code2 className="h-4 w-4" /> Node: Tech &amp; Domain Alignment
            </div>
            <p className="text-sm font-semibold text-white">
              {profile.platform === "github" ? "Software Engineering & Open Source" : "Enterprise Management"}
            </p>
            <p className="text-xs text-slate-400">{edges.length} public network connections</p>
          </div>
        </div>
      </div>
    </div>
  );
}
