"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  Trash2,
  ExternalLink,
  Github,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Globe,
  Tv2,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { AnalysisJobData } from "@/types/osint";

export default function Reports() {
  const [jobs, setJobs] = useState<AnalysisJobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/reports");
      if (!res.ok) throw new Error("Failed to load reports history.");
      const data = await res.json();
      setJobs(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load reports history.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!confirm("Are you sure you want to delete this report?")) return;

    try {
      const res = await fetch(`/api/reports?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete request failed.");
      setJobs((prev) => prev.filter((j) => j.id !== id));
      alert("Report deleted successfully.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error deleting report.";
      alert(`Error: ${msg}`);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "github":
        return <Github className="h-4 w-4 text-slate-200" />;
      case "x":
        return <Twitter className="h-4 w-4 text-slate-400" />;
      case "instagram":
        return <Instagram className="h-4 w-4 text-pink-500" />;
      case "linkedin":
        return <Linkedin className="h-4 w-4 text-blue-400" />;
      case "youtube":
        return <Youtube className="h-4 w-4 text-red-500" />;
      case "reddit":
        return <Tv2 className="h-4 w-4 text-orange-500" />;
      case "tiktok":
        return <Tv2 className="h-4 w-4 text-teal-400" />;
      default:
        return <Globe className="h-4 w-4 text-emerald-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="h-3 w-3" /> Completed
          </span>
        );
      case "RUNNING":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full animate-pulse">
            <Clock className="h-3 w-3" /> Processing
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full">
            <AlertCircle className="h-3 w-3" /> Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-slate-500/10 border border-slate-500/20 px-2 py-0.5 rounded-full">
            <Clock className="h-3 w-3" /> Queued
          </span>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 max-w-5xl flex-1 flex flex-col space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <FileText className="h-6 w-6 text-blue-500" /> Saved OSINT Reports
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Review and explore previously executed profile analyses. Click on any report to open its dashboard.
        </p>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
            <p className="text-sm text-slate-400">Loading saved reports...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-950/20 border border-red-900/50 rounded-xl p-6 text-center text-red-400 space-y-2">
          <AlertCircle className="h-10 w-10 mx-auto" />
          <h3 className="font-semibold text-lg">Failed to Load Reports</h3>
          <p className="text-sm">{error}</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-slate-900/20 border border-slate-900 rounded-xl p-12 text-center text-slate-400 space-y-3">
          <FileText className="h-12 w-12 mx-auto text-slate-600" />
          <h3 className="font-semibold text-lg text-slate-300">No Saved Reports Found</h3>
          <p className="text-sm max-w-md mx-auto">
            You haven't run any analyses yet. Head back to the homepage and paste a profile URL to get started.
          </p>
          <div className="pt-2">
            <button
              onClick={() => router.push("/")}
              className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 py-2 text-xs font-semibold transition"
            >
              Analyze New Profile
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              onClick={() => router.push(`/dashboard/${job.id}`)}
              className="group relative flex flex-col sm:flex-row sm:items-center justify-between border border-slate-900 bg-slate-900/30 hover:border-slate-800 hover:bg-slate-900/60 rounded-xl p-5 transition cursor-pointer shadow-sm hover:shadow-md"
            >
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-900 border border-slate-800">
                    {getPlatformIcon(job.detectedPlatform)}
                  </div>
                  <h3 className="font-semibold text-slate-200 group-hover:text-blue-400 transition text-sm">
                    {job.profiles[0]?.displayName || job.profiles[0]?.handle || job.inputUrl}
                  </h3>
                  {getStatusBadge(job.status)}
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(job.createdAt).toLocaleDateString(undefined, {
                      dateStyle: "medium",
                    })}
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="truncate max-w-[280px] sm:max-w-xs">{job.inputUrl}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4 sm:mt-0 self-end sm:self-center">
                <button
                  onClick={(e) => handleDelete(job.id, e)}
                  className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                  title="Delete Report"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </button>
                <button className="flex items-center gap-1 text-xs bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-300 hover:text-white transition">
                  Open Report <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
