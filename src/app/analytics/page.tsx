"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  Globe,
  Zap,
  MapPin,
  Hash,
  RefreshCw,
  ChevronDown,
  Database,
  Layers,
  Network,
} from "lucide-react";

// ─── Types matching the API response ────────────────────────────────────────
interface AnalyticsSummary {
  totalJobs: number;
  totalProfiles: number;
  totalEntities: number;
  completedJobs: number;
  failedJobs: number;
  pendingJobs: number;
  runningJobs: number;
  errorRate: number;
  successRate: number;
  timeWindowDays: number;
}

interface PlatformBreakdownItem {
  platform: string;
  count: number;
}

interface StatusBreakdownItem {
  status: string;
  count: number;
}

interface PerformanceAverages {
  fetchMs: number;
  geocodeMs: number;
  transformMs: number;
  totalMs: number;
  retryCount: number;
  entitiesPerJob: number;
  locationsPerJob: number;
  edgesPerJob: number;
}

interface DailyTrendItem {
  date: string;
  count: number;
}

interface TopLocationItem {
  label: string;
  count: number;
}

interface RecentJobItem {
  id: string;
  inputUrl: string;
  detectedPlatform: string;
  status: string;
  createdAt: string;
  errorMessage?: string | null;
}

interface AuditLogItem {
  id: string;
  action: string;
  resource: string;
  createdAt: string;
}

interface AnalyticsData {
  summary: AnalyticsSummary;
  platformBreakdown: PlatformBreakdownItem[];
  statusBreakdown: StatusBreakdownItem[];
  performance: {
    metricsCount: number;
    averages: PerformanceAverages;
  };
  trends: {
    daily: DailyTrendItem[];
  };
  topLocations: TopLocationItem[];
  recentActivity: RecentJobItem[];
  auditLog: AuditLogItem[];
  meta: {
    latencyMs: number;
    generatedAt: string;
  };
}

// ─── Color mapping helpers ──────────────────────────────────────────────────
const statusColors: Record<string, { bar: string; text: string; bg: string }> = {
  COMPLETED: { bar: "bg-emerald-500", text: "text-emerald-400", bg: "bg-emerald-500/10" },
  FAILED: { bar: "bg-red-500", text: "text-red-400", bg: "bg-red-500/10" },
  PENDING: { bar: "bg-amber-500", text: "text-amber-400", bg: "bg-amber-500/10" },
  RUNNING: { bar: "bg-blue-500", text: "text-blue-400", bg: "bg-blue-500/10" },
};

const platformColors = [
  { bar: "bg-blue-500", text: "text-blue-400" },
  { bar: "bg-violet-500", text: "text-violet-400" },
  { bar: "bg-emerald-500", text: "text-emerald-400" },
  { bar: "bg-rose-500", text: "text-rose-400" },
  { bar: "bg-amber-500", text: "text-amber-400" },
  { bar: "bg-cyan-500", text: "text-cyan-400" },
  { bar: "bg-fuchsia-500", text: "text-fuchsia-400" },
  { bar: "bg-teal-500", text: "text-teal-400" },
];

// ─── Small helper components ────────────────────────────────────────────────
function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
  color,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subtext?: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 flex flex-col gap-3 hover:border-slate-700/80 transition-colors group"
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
        <div className={`p-2 rounded-xl ${color}/10 ${color.replace("text", "border")}/20 border group-hover:scale-110 transition-transform`}>
          <Icon className={`h-4 w-4 ${color}`} />
        </div>
      </div>
      <div className="space-y-1">
        <span className="text-2xl font-extrabold text-white tracking-tight">{value}</span>
        {subtext && <p className="text-[11px] text-slate-500">{subtext}</p>}
      </div>
    </motion.div>
  );
}

function SimpleBarChart({
  data,
  maxValue,
  colorMap,
  labelKey,
  valueKey,
}: {
  data: Record<string, unknown>[];
  maxValue: number;
  colorMap: (item: Record<string, unknown>, index: number) => { bar: string; text: string };
  labelKey: string;
  valueKey: string;
}) {
  return (
    <div className="space-y-2.5">
      {data.map((item, i) => {
        const label = String(item[labelKey]);
        const value = Number(item[valueKey]);
        const pct = maxValue > 0 ? (value / maxValue) * 100 : 0;
        const colors = colorMap(item, i);
        return (
          <div key={label} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-300 truncate capitalize">{label.toLowerCase()}</span>
              <span className={`font-bold ${colors.text}`}>{value}</span>
            </div>
            <div className="h-2 w-full bg-slate-800/60 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, delay: i * 0.05, ease: "easeOut" }}
                className={`h-full rounded-full ${colors.bar}`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DailyTrendChart({ data }: { data: DailyTrendItem[] }) {
  if (data.length === 0) {
    return <p className="text-xs text-slate-500 text-center py-8">No daily trend data available yet.</p>;
  }
  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const barCount = data.length;
  const barWidth = Math.max(8, Math.min(28, 480 / barCount));
  const chartHeight = 160;

  return (
    <div className="relative w-full overflow-x-auto pb-2" style={{ minHeight: chartHeight + 40 }}>
      <svg
        width={Math.max(barCount * (barWidth + 4) + 32, 200)}
        height={chartHeight + 24}
        className="text-slate-800"
      >
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
          <line
            key={pct}
            x1={0}
            y1={chartHeight - chartHeight * pct}
            x2={Math.max(barCount * (barWidth + 4) + 16, 184)}
            y2={chartHeight - chartHeight * pct}
            stroke="currentColor"
            strokeWidth="0.5"
            strokeDasharray="4 4"
            opacity={0.3}
          />
        ))}
        {/* Bars */}
        {data.map((d, i) => {
          const x = 16 + i * (barWidth + 4);
          const barH = (d.count / maxCount) * (chartHeight - 8);
          return (
            <g key={d.date}>
              <motion.rect
                initial={{ height: 0, y: chartHeight }}
                animate={{ height: barH, y: chartHeight - barH }}
                transition={{ duration: 0.6, delay: i * 0.02, ease: "easeOut" }}
                x={x}
                y={chartHeight - barH}
                width={barWidth}
                rx={3}
                fill="url(#barGradient)"
              />
              <text
                x={x + barWidth / 2}
                y={chartHeight + 14}
                textAnchor="middle"
                fill="#64748b"
                fontSize="8"
                fontFamily="monospace"
              >
                {d.date.slice(5)}
              </text>
            </g>
          );
        })}
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

// ─── Main Page Component ─────────────────────────────────────────────────────
export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState(30);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async (window: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/analytics?days=${window}`);
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || `HTTP ${res.status}`);
      }
      const json: AnalyticsData = await res.json();
      setData(json);
      setFetchedAt(new Date().toLocaleTimeString());
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load analytics";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics(days);
  }, [days, fetchAnalytics]);

  const timeRanges = [
    { label: "7d", value: 7 },
    { label: "30d", value: 30 },
    { label: "90d", value: 90 },
  ];

  // ─── Loading state ──────────────────────────────────────────────────────
  if (loading && !data) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[80vh] bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500/25 border-t-blue-500" />
          <p className="text-sm text-slate-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // ─── Error / unauthenticated state ──────────────────────────────────────
  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[80vh] bg-slate-950">
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
            <XCircle className="h-7 w-7 text-red-400" />
          </div>
          <h2 className="text-lg font-bold text-slate-200">Could not load analytics</h2>
          <p className="text-xs text-slate-400 bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono">
            {error}
          </p>
          <button
            onClick={() => fetchAnalytics(days)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { summary, platformBreakdown, statusBreakdown, performance, trends, topLocations, recentActivity } = data;
  const maxPlatformCount = Math.max(...platformBreakdown.map((p) => p.count), 1);
  const maxStatusCount = Math.max(...statusBreakdown.map((s) => s.count), 1);

  return (
    <div className="flex-1 bg-slate-950 text-slate-100">
      {/* ── Sticky Header ────────────────────────────────────────────── */}
      <div className="sticky top-16 z-30 border-b border-slate-800/60 bg-slate-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/20">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-white tracking-tight">Analytics Dashboard</h1>
              <p className="text-[11px] text-slate-500 font-mono">
                {fetchedAt && `Updated ${fetchedAt} · ${performance.metricsCount} jobs with metrics`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchAnalytics(days)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Refresh"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
              {timeRanges.map((r) => (
                <button
                  key={r.value}
                  onClick={() => setDays(r.value)}
                  className={`px-3 py-1.5 rounded-md text-[11px] font-semibold transition ${
                    days === r.value
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <ChevronDown className="h-4 w-4 text-slate-600" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* ── Summary Stat Cards ──────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard icon={Database} label="Total Jobs" value={summary.totalJobs} color="text-blue-400" delay={0} />
          <StatCard icon={CheckCircle2} label="Completed" value={summary.completedJobs} subtext={`${summary.successRate}% success`} color="text-emerald-400" delay={0.05} />
          <StatCard icon={XCircle} label="Failed" value={summary.failedJobs} subtext={`${summary.errorRate}% error rate`} color="text-red-400" delay={0.1} />
          <StatCard icon={Activity} label="Pending" value={summary.pendingJobs} color="text-amber-400" delay={0.15} />
          <StatCard icon={Layers} label="Profiles" value={summary.totalProfiles} color="text-violet-400" delay={0.2} />
          <StatCard icon={Network} label="Entities" value={summary.totalEntities} color="text-cyan-400" delay={0.25} />
        </div>

        {/* ── Charts Grid ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-400" />
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Status Breakdown</h3>
              </div>
            </div>
            <SimpleBarChart
              data={statusBreakdown as unknown as Record<string, unknown>[]}
              maxValue={maxStatusCount}
              colorMap={(item) => statusColors[String(item.status)] || { bar: "bg-slate-500", text: "text-slate-400" }}
              labelKey="status"
              valueKey="count"
            />
          </motion.div>

          {/* Platform Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-violet-400" />
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Platforms</h3>
              </div>
            </div>
            <SimpleBarChart
              data={platformBreakdown as unknown as Record<string, unknown>[]}
              maxValue={maxPlatformCount}
              colorMap={(_, i) => platformColors[i % platformColors.length]}
              labelKey="platform"
              valueKey="count"
            />
          </motion.div>

          {/* Performance Averages */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-400" />
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Performance (avg)</h3>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Fetch", value: `${performance.averages.fetchMs}ms`, color: "text-blue-400" },
                { label: "Geocode", value: `${performance.averages.geocodeMs}ms`, color: "text-emerald-400" },
                { label: "Transform", value: `${performance.averages.transformMs}ms`, color: "text-violet-400" },
                { label: "Total", value: `${performance.averages.totalMs}ms`, color: "text-amber-400" },
                { label: "Retries", value: performance.averages.retryCount, color: "text-red-400" },
                { label: "Entities", value: performance.averages.entitiesPerJob, color: "text-cyan-400" },
                { label: "Locations", value: performance.averages.locationsPerJob, color: "text-teal-400" },
                { label: "Edges", value: performance.averages.edgesPerJob, color: "text-fuchsia-400" },
              ].map((m) => (
                <div key={m.label} className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/50">
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{m.label}</p>
                  <p className={`text-base font-extrabold mt-0.5 ${m.color}`}>{m.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Daily Trends ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Daily Jobs Trend</h3>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">{trends.daily.length} days</span>
          </div>
          <DailyTrendChart data={trends.daily} />
        </motion.div>

        {/* ── Bottom Grid: Top Locations & Recent Activity ───────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Locations */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-4"
          >
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-teal-400" />
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Top Locations</h3>
            </div>
            {topLocations.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No location data yet.</p>
            ) : (
              <div className="space-y-2">
                {topLocations.map((loc, i) => (
                  <div key={loc.label} className="flex items-center justify-between py-1.5 border-b border-slate-800/40 last:border-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[10px] font-mono text-slate-600 w-5 text-right">{i + 1}.</span>
                      <span className="text-xs text-slate-300 truncate">{loc.label}</span>
                    </div>
                    <span className="text-xs font-bold text-teal-400 ml-2 shrink-0">{loc.count}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-4"
          >
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-400" />
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Recent Activity</h3>
            </div>
            {recentActivity.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No recent activity.</p>
            ) : (
              <div className="space-y-2 max-h-[320px] overflow-y-auto">
                {recentActivity.map((job) => {
                  const sc = statusColors[job.status] || { text: "text-slate-400", bg: "bg-slate-500/10" };
                  return (
                    <div key={job.id} className="flex items-center justify-between py-2 border-b border-slate-800/40 last:border-0">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-slate-300 truncate font-medium">{job.inputUrl}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${sc.bg} ${sc.text}`}>
                            {job.status}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">{job.detectedPlatform}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-600 font-mono shrink-0 ml-2">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>

        {/* ── Footer Meta ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-between text-[10px] text-slate-600 font-mono border-t border-slate-800/40 pt-4">
          <span>Generated {new Date(data.meta.generatedAt).toLocaleString()}</span>
          <span>Queried in {data.meta.latencyMs}ms</span>
          <span>Showing last {summary.timeWindowDays} days</span>
        </div>
      </div>
    </div>
  );
}
