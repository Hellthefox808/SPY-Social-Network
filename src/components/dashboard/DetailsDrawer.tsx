"use client";

import { X, Sparkles, MapPin, Network, ExternalLink, ShieldCheck } from "lucide-react";

export interface NodeDetailData {
  name?: string | null;
  label?: string | null;
  confidence: number;
  platform?: string | null;
  lat?: number | null;
  lng?: number | null;
  evidenceText?: string | null;
  evidence?: string | null;
  sourceUrl?: string | null;
}

export interface DetailsDrawerProps {
  selectedNode: { type: "entity" | "location"; data: NodeDetailData } | null;
  onClose: () => void;
}

export default function DetailsDrawer({ selectedNode, onClose }: DetailsDrawerProps) {
  if (!selectedNode) return null;

  const { type, data } = selectedNode;
  const confidencePercent = (data.confidence * 100).toFixed(0);

  const getConfidenceLevel = (score: number) => {
    if (score >= 0.9) return { label: "Verified (API/Direct)", color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10" };
    if (score >= 0.7) return { label: "Observed (Scraped/Public)", color: "text-blue-400 border-blue-500/20 bg-blue-500/10" };
    if (score >= 0.4) return { label: "Inferred (Co-mentions/Context)", color: "text-yellow-400 border-yellow-500/20 bg-yellow-500/10" };
    return { label: "Estimated (Low)", color: "text-red-400 border-red-500/20 bg-red-500/10" };
  };

  const level = getConfidenceLevel(data.confidence);

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 border-l border-slate-800 bg-slate-950 p-6 shadow-2xl transition duration-300 flex flex-col space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-4">
        <div className="flex items-center gap-2">
          {type === "entity" ? (
            <Network className="h-4.5 w-4.5 text-blue-500" />
          ) : (
            <MapPin className="h-4.5 w-4.5 text-teal-500" />
          )}
          <span className="font-bold text-slate-200 text-sm uppercase tracking-wider">
            {type} Info
          </span>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1 text-slate-500 hover:bg-slate-900 hover:text-slate-300 transition"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto space-y-5 pr-1 text-sm">
        {/* Name / Title */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            Name / Label
          </label>
          <p className="text-base font-bold text-slate-100">{data.name || data.label}</p>
        </div>

        {/* Confidence Block */}
        <div className="space-y-2">
          <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-yellow-500" /> Confidence Level
          </label>
          <div className="flex items-center gap-2.5">
            <span className="text-lg font-extrabold text-slate-100">{confidencePercent}%</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${level.color}`}>
              {level.label}
            </span>
          </div>
        </div>

        {/* Platform or Coordinates */}
        {type === "entity" ? (
          data.platform && (
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Source Platform
              </label>
              <p className="font-semibold text-slate-300 uppercase text-xs">{data.platform}</p>
            </div>
          )
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Latitude
              </label>
              <p className="font-mono text-slate-300 text-xs">{data.lat?.toFixed(5)}</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Longitude
              </label>
              <p className="font-mono text-slate-300 text-xs">{data.lng?.toFixed(5)}</p>
            </div>
          </div>
        )}

        {/* Evidence details */}
        <div className="space-y-3 pt-3 border-t border-slate-900">
          <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-400" /> OSINT Provenance
          </div>

          <div className="bg-slate-900/30 border border-slate-900 rounded-lg p-3 space-y-2">
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "{data.evidenceText || data.evidence || "No additional text logs found."}"
            </p>
            {data.sourceUrl && (
              <a
                href={data.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:underline"
              >
                Inspect original source URL <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
