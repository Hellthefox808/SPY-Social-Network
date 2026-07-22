"use client";

import Link from "next/link";
import { Check, Shield, Zap, Building2, Sparkles } from "lucide-react";

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "For individual researchers and initial exploration.",
      icon: Zap,
      features: [
        "5 Profile Searches / day",
        "Basic Geointelligence Map",
        "Standard Network Graph View",
        "Community Support",
      ],
      cta: "Get Started Free",
      href: "/signup",
      popular: false,
    },
    {
      name: "Pro",
      price: "$29",
      period: "/month",
      description: "For growth marketers, talent sourcers & analysts.",
      icon: Sparkles,
      features: [
        "150 Profile Searches / month",
        "AI Business Growth Recommendations",
        "High-density Geo Map Clustering",
        "PDF, JSON & CSV Report Exports",
        "Priority Support",
      ],
      cta: "Start 14-Day Trial",
      href: "/signup?plan=pro",
      popular: true,
    },
    {
      name: "Business",
      price: "$99",
      period: "/month",
      description: "For teams, HR agencies & intelligence operations.",
      icon: Building2,
      features: [
        "1,000 Profile Searches / month",
        "Anonymized HR & Recruitment Privacy Mode",
        "Team Workspace (5 Seats)",
        "Automated PDF Executive Briefings",
        "Dedicated Account Manager",
      ],
      cta: "Upgrade to Business",
      href: "/signup?plan=business",
      popular: false,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "Custom data pipelines, SLA & dedicated infrastructure.",
      icon: Shield,
      features: [
        "Unlimited Searches & API Access",
        "Custom Data Adapter Connectors",
        "On-Premise / Isolated Cloud Deployments",
        "99.9% Uptime SLA",
        "24/7 Enterprise Support",
      ],
      cta: "Contact Enterprise",
      href: "/signup?plan=enterprise",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-500/30">
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            Flexible & Scalable Pricing
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Turn Raw Profile Data Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Business Intelligence</span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg">
            Choose the right tier for your growth, recruitment, or research team. Upgrade or cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col justify-between rounded-2xl p-6 transition-all duration-300 ${
                plan.popular
                  ? "bg-slate-900/90 border-2 border-blue-500 shadow-xl shadow-blue-500/10 scale-105"
                  : "bg-slate-900/40 border border-slate-800 hover:border-slate-700"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-blue-500 text-white text-[11px] font-bold uppercase tracking-wider shadow-md">
                  Most Popular
                </div>
              )}

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-white">{plan.name}</span>
                  <div className="p-2 rounded-xl bg-slate-800/80 text-blue-400">
                    <plan.icon className="h-5 w-5" />
                  </div>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                  <span className="text-sm text-slate-400">{plan.period}</span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">{plan.description}</p>

                <ul className="space-y-3 pt-4 border-t border-slate-800 text-xs">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2.5 text-slate-300">
                      <Check className="h-4 w-4 text-blue-400 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <Link
                  href={plan.href}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-center block transition-all ${
                    plan.popular
                      ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-200"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
