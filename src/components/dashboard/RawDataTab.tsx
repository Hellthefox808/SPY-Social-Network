"use client";

import { FileCode, Clipboard, Check } from "lucide-react";
import { useState } from "react";
import { AnalysisJobData } from "@/types/osint";

export interface RawDataTabProps {
  job: AnalysisJobData;
}

export default function RawDataTab({ job }: RawDataTabProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(job, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-900 pb-3">
        <div>
          <h3 className="font-bold text-slate-200 text-sm">Raw Payload Response</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Full database record containing raw JSON model outputs for integrations.
          </p>
        </div>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition hover:text-white"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" /> Copied!
            </>
          ) : (
            <>
              <Clipboard className="h-3.5 w-3.5" /> Copy JSON
            </>
          )}
        </button>
      </div>

      <pre className="bg-slate-950 border border-slate-900 rounded-xl p-5 text-xs text-slate-300 font-mono overflow-auto max-h-[500px]">
        {JSON.stringify(job, null, 2)}
      </pre>
    </div>
  );
}
