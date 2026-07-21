"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Loader2,
  AlertCircle,
  Download,
  FileCode,
  Network as GraphIcon,
  MapPin,
  ListTodo,
  TrendingUp,
} from "lucide-react";
import SidebarFilters from "@/components/dashboard/SidebarFilters";
import OverviewTab from "@/components/dashboard/OverviewTab";
import EvidenceTab from "@/components/dashboard/EvidenceTab";
import RawDataTab from "@/components/dashboard/RawDataTab";
import MapTab from "@/components/dashboard/MapTab";
import NetworkTab from "@/components/dashboard/NetworkTab";
import KnowledgeGraphTab from "@/components/dashboard/KnowledgeGraphTab";
import DetailsDrawer from "@/components/dashboard/DetailsDrawer";
import { UnderwaterCanvas } from "@/components/ui";
import { Share2 } from "lucide-react";

import { NodeDetailData } from "@/components/dashboard/DetailsDrawer";
import { AnalysisJobData, JobLocation, JobEntity, JobEdge } from "@/types/osint";

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) || "";

  const [job, setJob] = useState<AnalysisJobData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // Filters state
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [minConfidence, setMinConfidence] = useState<number>(0.2);
  const [selectedLocTypes, setSelectedLocTypes] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Selected Detail Drawer state
  const [selectedNode, setSelectedNode] = useState<{
    type: "entity" | "location";
    data: NodeDetailData;
  } | null>(null);

  // Poll for job updates if not completed
  useEffect(() => {
    if (!id) return;
    let timer: NodeJS.Timeout;

    const poll = async () => {
      try {
        const res = await fetch(`/api/analyze?jobId=${id}`);
        if (!res.ok) throw new Error("Failed to load analysis details.");
        const data = await res.json();
        setJob(data);

        if (data.status === "COMPLETED" || data.status === "FAILED") {
          setLoading(false);
        } else {
          timer = setTimeout(poll, 2000);
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "An error occurred.";
        setError(message);
        setLoading(false);
      }
    };

    poll();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [id]);

  if (loading && (!job || job.status !== "COMPLETED")) {
    const status = job?.status || "PENDING";
    const platform = job?.detectedPlatform || "unknown";

    let stageText = "Validating profile URL...";
    if (status === "RUNNING") {
      stageText = `Connecting to ${platform.toUpperCase()} adapter & downloading metadata...`;
    }

    return (
      <div className="relative flex-1 flex flex-col items-center justify-center p-6 space-y-6 min-h-[600px] bg-slate-950 overflow-hidden">
        <UnderwaterCanvas />
        <div className="fixed inset-0 bg-slate-950/65 backdrop-blur-[1px] pointer-events-none z-0" />
        <div className="relative z-10 flex flex-col items-center justify-center space-y-6 w-full">
          <div className="relative flex items-center justify-center">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-500/25 border-t-blue-500" />
            <Loader2 className="absolute h-6 w-6 animate-pulse text-blue-400" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-lg text-slate-200">Analyzing Social Graph</h3>
            <p className="text-sm text-slate-500 max-w-sm">{stageText}</p>
          </div>

          <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-400">Pipeline Stage Progress</span>
              <span className="text-blue-400">
                {status === "PENDING" ? "20%" : "60%"}
              </span>
            </div>
            <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: status === "PENDING" ? "20%" : "60%" }}
              />
            </div>
            <ul className="text-[11px] text-slate-500 space-y-1.5">
              <li className="flex items-center gap-1.5 text-blue-400">
                ● Validating URL & parsing domain
              </li>
              <li
                className={`flex items-center gap-1.5 ${
                  status === "RUNNING" ? "text-blue-400" : ""
                }`}
              >
                {status === "RUNNING" ? "●" : "○"} Querying platform adapter endpoints
              </li>
              <li className="flex items-center gap-1.5">○ Harvesting geo text coordinates</li>
              <li className="flex items-center gap-1.5">○ Building relational graph edges</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (error || (job && job.status === "FAILED") || !job) {
    return (
      <div className="relative flex-1 flex flex-col items-center justify-center min-h-[600px] space-y-4 px-4 bg-slate-950 overflow-hidden">
        <UnderwaterCanvas />
        <div className="fixed inset-0 bg-slate-950/65 backdrop-blur-[1px] pointer-events-none z-0" />
        <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-200">Job Execution Failed</h2>
          <p className="text-xs text-slate-400 max-w-md text-center bg-slate-900/80 backdrop-blur-md border border-slate-800 p-4 rounded-xl font-mono text-red-300">
            {error || job?.errorMessage || "Target profile could not be fetched or analyzed."}
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-slate-800 hover:bg-slate-700 text-white rounded-lg px-4 py-2 text-xs font-semibold transition"
          >
            Return to Home Search
          </button>
        </div>
      </div>
    );
  }

  const profile = job.profiles[0];
  if (!profile) return null;

  // Filtered connections & locations based on Sidebar Filters & Search Query
  const filteredConnections: JobEdge[] = job.edges
    .map((edge) => {
      const targetEntity = job.entities.find((e) => e.id === edge.targetEntityId);
      return {
        ...edge,
        target: targetEntity ? { name: targetEntity.name, platform: targetEntity.platform } : undefined,
      };
    })
    .filter((edge) => {
      if (edge.confidence < minConfidence) return false;
      if (selectedPlatforms.length > 0) {
        const plat = (edge.target?.platform || "").toLowerCase();
        if (plat && !selectedPlatforms.includes(plat)) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = edge.target?.name?.toLowerCase().includes(q);
        const evMatch = edge.evidenceText?.toLowerCase().includes(q);
        if (!nameMatch && !evMatch) return false;
      }
      return true;
    });

  const filteredLocations: JobLocation[] = job.locations.filter((loc) => {
    if (selectedLocTypes.length > 0 && !selectedLocTypes.includes(loc.locationType)) {
      return false;
    }
    if (loc.confidence < minConfidence) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const labelMatch = loc.label.toLowerCase().includes(q);
      const evMatch = loc.evidenceText?.toLowerCase().includes(q);
      if (!labelMatch && !evMatch) return false;
    }
    return true;
  });

  const exportUrl = (format: string) => {
    return `/api/exports?jobId=${job.id}&format=${format}`;
  };

  return (
    <div className="relative flex-1 flex flex-col lg:flex-row bg-slate-950/85 text-slate-100 min-h-screen overflow-hidden">
      <UnderwaterCanvas />
      <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-[1px] pointer-events-none z-0" />
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row w-full min-h-screen">
        {/* Left Sidebar Filters */}
        <SidebarFilters
          selectedPlatforms={selectedPlatforms}
          setSelectedPlatforms={setSelectedPlatforms}
          minConfidence={minConfidence}
          setMinConfidence={setMinConfidence}
          selectedLocTypes={selectedLocTypes}
          setSelectedLocTypes={setSelectedLocTypes}
          detectedPlatform={job.detectedPlatform}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 space-y-6 overflow-hidden">
        {/* Profile Header Card */}
        <div className="bg-slate-900/60 border border-slate-900 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.displayName || "Avatar"}
                className="h-16 w-16 rounded-full object-cover border-2 border-slate-800"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-slate-800 flex items-center justify-center text-xl font-bold text-slate-400">
                {(profile.displayName || profile.handle || "U")[0]}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-white">
                  {profile.displayName || profile.handle}
                </h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
                  {profile.platform}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {profile.handle ? `@${profile.handle} • ` : ""}
                <a
                  href={profile.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:underline inline-flex items-center gap-1"
                >
                  {profile.sourceUrl}
                </a>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={exportUrl("pdf")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-500/30 bg-blue-600/10 text-xs font-semibold text-blue-400 hover:bg-blue-600/20 transition"
            >
              <Download className="h-3.5 w-3.5" /> Export PDF
            </a>
            <a
              href={exportUrl("json")}
              download
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
            >
              <Download className="h-3.5 w-3.5" /> Export JSON
            </a>
            <a
              href={exportUrl("csv")}
              download
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
            >
              <Download className="h-3.5 w-3.5" /> Export CSV
            </a>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-900 pb-1 overflow-x-auto">
          {[
            { id: "overview", label: "Overview", icon: TrendingUp },
            { id: "kg", label: "Knowledge Graph Matrix", icon: Share2 },
            { id: "network", label: "Network Graph", icon: GraphIcon },
            { id: "map", label: "Geointelligence Map", icon: MapPin },
            { id: "evidence", label: "Evidence Logs", icon: ListTodo },
            { id: "raw", label: "Raw JSON Payload", icon: FileCode },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/60"
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 min-h-[450px]">
          {activeTab === "overview" && (
            <OverviewTab
              job={job}
              profile={profile}
              filteredConnections={filteredConnections}
              filteredLocations={filteredLocations}
            />
          )}

          {activeTab === "kg" && (
            <KnowledgeGraphTab
              profile={profile}
              edges={filteredConnections}
              locations={filteredLocations}
            />
          )}

          {activeTab === "network" && (
            <NetworkTab
              profile={profile}
              edges={filteredConnections}
              entities={job.entities}
              onNodeClick={(node) => setSelectedNode({ type: "entity", data: node as JobEntity })}
            />
          )}

          {activeTab === "map" && (
            <MapTab
              profile={profile}
              locations={filteredLocations}
              edges={filteredConnections}
              onMarkerClick={(loc) => setSelectedNode({ type: "location", data: loc })}
            />
          )}

          {activeTab === "evidence" && <EvidenceTab evidenceItems={job.evidenceItems} />}

          {activeTab === "raw" && <RawDataTab job={job} />}
        </div>
      </div>
    </div>

      {/* Slide-out details drawer */}
      {selectedNode && (
        <DetailsDrawer
          selectedNode={selectedNode}
          onClose={() => setSelectedNode(null)}
        />
      )}
    </div>
  );
}
