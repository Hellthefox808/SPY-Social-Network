"use client";

import React from "react";
import Link from "next/link";
import { Network, ShieldCheck, Activity, Github, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-900 bg-slate-950/90 backdrop-blur-md relative z-10 py-8 text-slate-400 text-xs">
      <div className="container mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Brand info */}
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 shadow-md shadow-blue-500/20">
            <Network className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-sm text-slate-200 tracking-tight">
            SocialGraph Atlas
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-[11px] text-slate-500">Live OSINT & Geointelligence Engine v4.0</span>
        </div>

        {/* Center Links */}
        <div className="flex items-center gap-6 text-[11px]">
          <Link href="/" className="hover:text-slate-200 transition">
            Home
          </Link>
          <Link href="/reports" className="hover:text-slate-200 transition">
            Reports
          </Link>
          <Link href="/login" className="hover:text-slate-200 transition">
            Login
          </Link>
          <Link href="/signup" className="hover:text-slate-200 transition">
            Sign Up
          </Link>
        </div>

        {/* Right Status & Socials */}
        <div className="flex items-center gap-4 text-[11px]">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 font-semibold">
            <Activity className="h-3 w-3 animate-pulse" /> Operational 99.9%
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-slate-300 transition">
              <Github className="h-4 w-4" />
            </a>
            <a href="https://x.com" target="_blank" rel="noreferrer" className="hover:text-slate-300 transition">
              <Twitter className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
