"use client";

import { ShieldCheck, FileText, CheckCircle2, Clock, ExternalLink } from "lucide-react";
import { JobEvidenceItem } from "@/types/osint";

export interface EvidenceTabProps {
  evidenceItems: JobEvidenceItem[];
}

export default function EvidenceTab({ evidenceItems }: EvidenceTabProps) {
  const getMethodBadge = (method: string) => {
    if (method.includes("API")) return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    if (method.includes("Metadata")) return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    return "bg-slate-500/10 text-slate-400 border-slate-500/20";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-900 pb-3">
        <div>
          <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-blue-500" /> Evidence Audit Trail & Provenance Logs
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographically timestamped raw extraction snippets verifying data authenticity.
          </p>
        </div>
        <span className="text-xs text-slate-400 font-semibold bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
          {evidenceItems.length} verified logs
        </span>
      </div>

      {evidenceItems.length === 0 ? (
        <div className="bg-slate-900/20 border border-slate-900 rounded-xl p-8 text-center text-xs text-slate-500">
          No raw evidence items logged for this execution job.
        </div>
      ) : (
        <div className="space-y-3">
          {evidenceItems.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900/30 border border-slate-900 rounded-xl p-4 space-y-2 hover:border-slate-800 transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-200 text-xs uppercase">{item.evidenceType}</span>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded border ${getMethodBadge(
                      item.extractionMethod
                    )}`}
                  >
                    {item.extractionMethod}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-yellow-500 font-bold bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded">
                    {(item.confidence * 100).toFixed(0)}% Confidence
                  </span>
                </div>
              </div>

              {item.snippet && (
                <div className="bg-slate-950 border border-slate-900/80 rounded-lg p-3 text-xs text-slate-300 font-mono overflow-x-auto">
                  {item.snippet}
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:underline inline-flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" /> {item.sourceUrl}
                </a>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {new Date(item.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
