"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Network, Shield, LogOut, Loader2, Sparkles, FileText, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, loading: authLoading } = useAuth();
  const [sessionUser, setSessionUser] = useState<{ email?: string } | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/login")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setSessionUser(data.user);
        } else {
          setSessionUser(null);
        }
      })
      .catch(() => setSessionUser(null))
      .finally(() => setSessionLoading(false));
  }, [pathname]);

  const isAuthRoute = ["/login", "/signup", "/forgot-password", "/reset-password", "/verify-email"].includes(pathname);

  if (isAuthRoute) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setSessionUser(null);
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const isHomeActive = pathname === "/";
  const isReportsActive = pathname.startsWith("/reports");
  const isAuthenticated = !!(sessionUser || currentUser);
  const displayEmail = currentUser?.email || sessionUser?.email || "admin@socialgraph.local";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 transition hover:opacity-90 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <Network className="h-5 w-5 text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-blue-300 bg-clip-text text-transparent">
              SocialGraph Atlas
            </span>
          </Link>
          <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> AI Gateway 99.9%
          </span>
        </div>

        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/pricing"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              pathname === "/pricing"
                ? "bg-blue-600/20 text-blue-300 border border-blue-500/30 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
            }`}
          >
            <span>Pricing</span>
          </Link>

          {isAuthenticated && (
            <>
              <Link
                href="/"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  isHomeActive
                    ? "bg-blue-600/20 text-blue-300 border border-blue-500/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>New Analysis</span>
              </Link>
              
              <Link
                href="/reports"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  isReportsActive
                    ? "bg-blue-600/20 text-blue-300 border border-blue-500/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Saved Reports</span>
              </Link>
            </>
          )}

          <div className="h-4 w-px bg-slate-800 mx-1" />

          <div className="flex items-center gap-3">
            {authLoading || sessionLoading ? (
              <Loader2 className="animate-spin h-4 w-4 text-slate-400" />
            ) : isAuthenticated ? (
              <>
                <span className="hidden text-xs text-slate-300 sm:inline-flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 px-3 py-1 rounded-full font-mono text-[11px]">
                  <Shield className="h-3 w-3 text-emerald-400" /> {displayEmail}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 hover:bg-red-500/10 px-2.5 py-1 rounded-lg transition cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" /> Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/70 hover:bg-slate-800 transition"
                >
                  <LogIn className="h-3.5 w-3.5 text-blue-400" /> Sign In
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center gap-1.5 text-xs text-white px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-semibold shadow-md shadow-blue-500/20 transition"
                >
                  <UserPlus className="h-3.5 w-3.5" /> Sign Up
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

