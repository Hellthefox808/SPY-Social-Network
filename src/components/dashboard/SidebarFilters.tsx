"use client";

import { Check, SlidersHorizontal, MapPin, Network, Sparkles } from "lucide-react";

export interface SidebarFiltersProps {
  selectedPlatforms: string[];
  setSelectedPlatforms: (plats: string[]) => void;
  minConfidence: number;
  setMinConfidence: (score: number) => void;
  selectedLocTypes: string[];
  setSelectedLocTypes: (types: string[]) => void;
  detectedPlatform?: string;
}

export default function SidebarFilters({
  selectedPlatforms,
  setSelectedPlatforms,
  minConfidence,
  setMinConfidence,
  selectedLocTypes,
  setSelectedLocTypes,
}: SidebarFiltersProps) {
  const platforms = [
    { id: "github", label: "GitHub" },
    { id: "x", label: "X / Twitter" },
    { id: "instagram", label: "Instagram" },
    { id: "linkedin", label: "LinkedIn" },
    { id: "youtube", label: "YouTube" },
    { id: "reddit", label: "Reddit" },
    { id: "tiktok", label: "TikTok" },
    { id: "website", label: "Website / Blog" },
  ];

  const locTypes = [
    { id: "declared", label: "Declared Location" },
    { id: "geotag", label: "Geotagged Posts" },
    { id: "organization", label: "Company HQ" },
    { id: "event", label: "Event Mentions" },
    { id: "inferred", label: "Inferred Locations" },
  ];

  const togglePlatform = (id: string) => {
    if (selectedPlatforms.includes(id)) {
      setSelectedPlatforms(selectedPlatforms.filter((p) => p !== id));
    } else {
      setSelectedPlatforms([...selectedPlatforms, id]);
    }
  };

  const toggleLocType = (id: string) => {
    if (selectedLocTypes.includes(id)) {
      setSelectedLocTypes(selectedLocTypes.filter((t) => t !== id));
    } else {
      setSelectedLocTypes([...selectedLocTypes, id]);
    }
  };

  return (
    <aside className="w-full lg:w-72 border-r border-slate-900 bg-slate-900/10 p-5 space-y-6 flex-shrink-0">
      <div className="flex items-center justify-between border-b border-slate-950 pb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4.5 w-4.5 text-blue-500" />
          <h2 className="font-bold text-slate-200 text-sm tracking-wide">Filters & Parameters</h2>
        </div>
        {(selectedPlatforms.length > 0 || selectedLocTypes.length > 0 || minConfidence !== 0.2) && (
          <button
            onClick={() => {
              setSelectedPlatforms([]);
              setSelectedLocTypes([]);
              setMinConfidence(0.2);
            }}
            className="text-[10px] font-semibold text-slate-400 hover:text-white transition underline"
          >
            Reset
          </button>
        )}
      </div>

      {/* Confidence threshold slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-yellow-500" /> Min Confidence
          </label>
          <span className="text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
            {(minConfidence * 100).toFixed(0)}%
          </span>
        </div>
        <input
          type="range"
          min="0.1"
          max="1.0"
          step="0.05"
          value={minConfidence}
          onChange={(e) => setMinConfidence(parseFloat(e.target.value))}
          className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <div className="flex items-center justify-between text-[10px] text-slate-600">
          <span>Low</span>
          <span>Verified</span>
        </div>
      </div>

      {/* Platform checkboxes */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Network className="h-3.5 w-3.5 text-blue-400" /> Filter Platforms
        </label>
        <div className="grid grid-cols-1 gap-2">
          {platforms.map((plat) => {
            const active = selectedPlatforms.includes(plat.id);
            return (
              <button
                key={plat.id}
                onClick={() => togglePlatform(plat.id)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-medium transition text-left ${
                  active
                    ? "bg-blue-600/15 border-blue-500/30 text-blue-300"
                    : "bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-800 hover:text-slate-200"
                }`}
              >
                <span>{plat.label}</span>
                {active && <Check className="h-3.5 w-3.5 text-blue-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Location types checkboxes */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-teal-400" /> Location Type
        </label>
        <div className="grid grid-cols-1 gap-2">
          {locTypes.map((type) => {
            const active = selectedLocTypes.includes(type.id);
            return (
              <button
                key={type.id}
                onClick={() => toggleLocType(type.id)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-medium transition text-left ${
                  active
                    ? "bg-teal-500/10 border-teal-500/30 text-teal-300"
                    : "bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-800 hover:text-slate-200"
                }`}
              >
                <span>{type.label}</span>
                {active && <Check className="h-3.5 w-3.5 text-teal-400" />}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
