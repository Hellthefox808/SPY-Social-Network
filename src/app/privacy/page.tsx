"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Privacy Policy</h1>
          <p className="text-xs text-slate-400 mt-2">Last updated: July 2026</p>
        </div>

        <section className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <h2 className="text-lg font-bold text-white">1. Data Privacy & Compliance Principle</h2>
          <p>
            SocialGraph Atlas is an AI-powered profile intelligence and geo-analytics SaaS platform. We strictly adhere to ethical data practices: our platform exclusively processes public data, consented metadata, or platform-approved API access points.
          </p>

          <h2 className="text-lg font-bold text-white">2. Information We Process</h2>
          <p>
            When you enter a public profile identifier, our pipeline parses publicly available metadata (e.g. public bio text, declared location tags, and public organizational affiliations) to generate aggregate network analytics.
          </p>

          <h2 className="text-lg font-bold text-white">3. How We Use Data</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To generate geographic distribution insights and market density scores.</li>
            <li>To synthesize high-level business intelligence recommendations for HR and marketing teams.</li>
            <li>To deliver exportable PDF/JSON reports to authorized platform subscribers.</li>
          </ul>

          <h2 className="text-lg font-bold text-white">4. Data Protection & Security</h2>
          <p>
            All session data is encrypted in transit via SSL/TLS and at rest using industry-standard AES-256 protocols. We do not sell personal data to third parties.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
