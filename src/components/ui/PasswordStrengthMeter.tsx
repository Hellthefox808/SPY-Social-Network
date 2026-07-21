"use client";

import React from "react";
import { Check, X } from "lucide-react";

interface PasswordStrengthMeterProps {
  password?: string;
}

export function PasswordStrengthMeter({ password = "" }: PasswordStrengthMeterProps) {
  if (!password) return null;

  const checks = [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "Contains a number", valid: /\d/.test(password) },
    { label: "Contains uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "Contains special character", valid: /[^A-Za-z0-9]/.test(password) },
  ];

  const score = checks.filter((c) => c.valid).length;

  const getLabel = () => {
    switch (score) {
      case 0:
      case 1:
        return { label: "Weak", color: "bg-red-500", text: "text-red-400" };
      case 2:
        return { label: "Fair", color: "bg-amber-500", text: "text-amber-400" };
      case 3:
        return { label: "Good", color: "bg-blue-500", text: "text-blue-400" };
      case 4:
        return { label: "Strong", color: "bg-emerald-500", text: "text-emerald-400" };
      default:
        return { label: "Weak", color: "bg-red-500", text: "text-red-400" };
    }
  };

  const info = getLabel();

  return (
    <div className="mt-2.5 space-y-2">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-slate-400 font-medium">Password Strength</span>
        <span className={`font-bold ${info.text}`}>{info.label}</span>
      </div>

      {/* Progress Bars */}
      <div className="grid grid-cols-4 gap-1.5">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              step <= score ? info.color : "bg-slate-800"
            }`}
          />
        ))}
      </div>

      {/* Criteria Checklist */}
      <div className="grid grid-cols-2 gap-1 pt-1 text-[10px]">
        {checks.map((item, idx) => (
          <div key={idx} className="flex items-center gap-1">
            {item.valid ? (
              <Check className="h-3 w-3 text-emerald-400 flex-shrink-0" />
            ) : (
              <X className="h-3 w-3 text-slate-600 flex-shrink-0" />
            )}
            <span className={item.valid ? "text-slate-300 font-medium" : "text-slate-500"}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
