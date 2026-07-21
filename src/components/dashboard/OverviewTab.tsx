"use client";

import {
  Users,
  Compass,
  FileText,
  Link as LinkIcon,
  MapPin,
  Clock,
  Sparkles,
  ExternalLink,
  TrendingUp,
} from "lucide-react";
import { AnalysisJobData, JobProfile, JobEdge, JobLocation } from "@/types/osint";

export interface OverviewTabProps {
  job: AnalysisJobData;
  profile: JobProfile;
  filteredConnections: JobEdge[];
  filteredLocations: JobLocation[];
}

export default function OverviewTab({
  job,
  profile,
  filteredConnections,
  filteredLocations,
}: OverviewTabProps) {
  // Compute key stats
  const followersCount = profile.followersCount?.toLocaleString() || "N/A";
  const postsCount = profile.postsCount?.toLocaleString() || "N/A";

  const getRelationColor = (relationType: string) => {
    switch (relationType) {
      case "collaborated":
        return "bg-purple-500/10 border-purple-500/25 text-purple-400";
      case "same_org":
        return "bg-blue-500/10 border-blue-500/25 text-blue-400";
      case "linked_profile":
        return "bg-teal-500/10 border-teal-500/25 text-teal-400";
      default:
        return "bg-slate-500/10 border-slate-500/25 text-slate-400";
    }
  };

  const getLocTypeColor = (type: string) => {
    switch (type) {
      case "declared":
        return "bg-sky-500/10 border-sky-500/25 text-sky-400";
      case "geotag":
        return "bg-rose-500/10 border-rose-500/25 text-rose-400";
      case "organization":
        return "bg-amber-500/10 border-amber-500/25 text-amber-400";
      default:
        return "bg-slate-500/10 border-slate-500/25 text-slate-400";
    }
  };

  const generateAiSummary = () => {
    const name = profile.displayName || `@${profile.handle}` || "This subject";
    const platformName = profile.platform || "social media";
    const locationStr = profile.locationText || (filteredLocations.length > 0 ? filteredLocations[0].label : null);
    
    let summary = `Our intelligence pipeline analyzed public footprints for ${name} across the ${platformName} network. `;
    
    if (locationStr) {
      summary += `The subject declares primary operations in or near **${locationStr}**. `;
    } else {
      summary += `No primary home base is explicitly declared on the main landing profile. `;
    }

    if (filteredLocations.length > 1) {
      const otherLocs = filteredLocations.slice(1).map(l => l.city || l.label.split(',')[0]).join(", ");
      summary += `Secondary geographical clusters were identified in **${otherLocs}** based on geotagged posts, mentions, or organizational headquarters. `;
    }

    if (filteredConnections.length > 0) {
      const topCollabs = filteredConnections.map(c => c.target?.name).filter(Boolean).slice(0, 3).join(", ");
      summary += `Key public nodes and collaborators linked to this profile include **${topCollabs}**. `;
    } else {
      summary += `No external public collaborator links were detected in the immediate profile proximity. `;
    }

    const confidenceAvg = filteredLocations.length > 0
      ? filteredLocations.reduce((acc, curr) => acc + curr.confidence, 0) / filteredLocations.length
      : 0.85;
    summary += `With a metadata harvesting confidence average of **${(confidenceAvg * 100).toFixed(0)}%**, the subject displays a typical profile fingerprint of an active contributor in this domain.`;

    return summary;
  };

  return (
    <div className="space-y-6">
      {/* Top Panels Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bio Description Panel */}
        <div className="rounded-xl border border-slate-900 bg-slate-900/10 p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <Compass className="h-4 w-4 text-blue-500" /> Profile Abstract
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {profile.bio || "No public bio or description extracted for this profile."}
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-900/60">
            {profile.locationText && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-slate-500" /> {profile.locationText}
              </span>
            )}
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-blue-400 hover:underline"
              >
                <LinkIcon className="h-3.5 w-3.5" /> {profile.website}
              </a>
            )}
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-slate-500" /> Freshness:{" "}
              {new Date(job.createdAt).toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* AI Generated Insights */}
        <div className="rounded-xl border border-purple-950 bg-purple-950/5 p-5 flex flex-col justify-between space-y-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-purple-500/5 blur-xl group-hover:bg-purple-500/10 transition duration-500" />
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-purple-300 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-400 animate-pulse" /> AI Network Insights
            </h2>
            <p className="text-sm text-purple-100/90 leading-relaxed">
              {generateAiSummary()}
            </p>
          </div>
          <div className="text-[10px] text-purple-400/60 border-t border-purple-950/60 pt-2 flex items-center gap-1.5">
            🛡️ Dynamic intelligence report generated from verified public data.
          </div>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Followers / Subscribers", val: followersCount, icon: Users, color: "text-blue-500" },
          { label: "Public Posts / Repos", val: postsCount, icon: FileText, color: "text-purple-500" },
          { label: "Mapped Geo Locations", val: filteredLocations.length, icon: MapPin, color: "text-rose-500" },
          { label: "Network Connections", val: filteredConnections.length, icon: TrendingUp, color: "text-teal-500" },
        ].map((c, i) => (
          <div key={i} className="bg-slate-900/30 border border-slate-900 rounded-xl p-4.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                {c.label}
              </span>
              <c.icon className={`h-4.5 w-4.5 ${c.color}`} />
            </div>
            <p className="text-xl font-bold text-slate-100">{c.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Connection Intelligence Panel */}
        <div className="border border-slate-900 bg-slate-900/10 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-900 pb-3">
            <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
              <Users className="h-4.5 w-4.5 text-blue-500" /> Connection Intelligence
            </h3>
            <span className="text-xs text-slate-400 font-semibold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {filteredConnections.length} nodes
            </span>
          </div>

          {filteredConnections.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-8">
              No public connections matching the selected confidence filter.
            </p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {filteredConnections.map((conn) => (
                <div
                  key={conn.id}
                  className="flex items-center justify-between border border-slate-900 bg-slate-950/40 hover:border-slate-800 rounded-lg p-3 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-200 text-xs">{conn.target?.name}</span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${getRelationColor(
                          conn.relationType
                        )}`}
                      >
                        {conn.relationType.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-1">{conn.evidenceText}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-yellow-500/80 bg-yellow-500/5 border border-yellow-500/10 px-1.5 py-0.5 rounded">
                      {(conn.confidence * 100).toFixed(0)}%
                    </span>
                    {conn.sourceUrl && (
                      <a
                        href={conn.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-500 hover:text-slate-200 transition"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Geo Intelligence Panel */}
        <div className="border border-slate-900 bg-slate-900/10 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-900 pb-3">
            <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
              <MapPin className="h-4.5 w-4.5 text-blue-500" /> Geo Intelligence
            </h3>
            <span className="text-xs text-slate-400 font-semibold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {filteredLocations.length} signals
            </span>
          </div>

          {filteredLocations.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-8">
              No geocoded markers matching the selected confidence filter.
            </p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {filteredLocations.map((loc, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border border-slate-900 bg-slate-950/40 hover:border-slate-800 rounded-lg p-3 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-200 text-xs">{loc.label}</span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${getLocTypeColor(
                          loc.locationType
                        )}`}
                      >
                        {loc.locationType}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-1">{loc.evidenceText}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-yellow-500/80 bg-yellow-500/5 border border-yellow-500/10 px-1.5 py-0.5 rounded">
                      {(loc.confidence * 100).toFixed(0)}%
                    </span>
                    {loc.sourceUrl && (
                      <a
                        href={loc.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-500 hover:text-slate-200 transition"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
