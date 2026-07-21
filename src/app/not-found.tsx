import Link from "next/link";
import { FileQuestion, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] p-6 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-0" />
      
      <div className="relative z-10 max-w-md w-full glassmorphism p-8 rounded-2xl border border-slate-800 shadow-2xl space-y-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/10">
          <FileQuestion className="h-10 w-10 text-blue-400" />
        </div>

        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20">
            HTTP 404 RESOURCE ERROR
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">Page Not Found</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            The target intelligence route or job report you requested does not exist or has been moved.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl px-5 py-3 text-xs font-semibold shadow-lg shadow-blue-500/20 transition"
          >
            <Search className="h-4 w-4" />
            New OSINT Search
          </Link>
          <Link
            href="/reports"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl px-5 py-3 text-xs font-semibold border border-slate-800 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Saved Reports
          </Link>
        </div>
      </div>
    </div>
  );
}

