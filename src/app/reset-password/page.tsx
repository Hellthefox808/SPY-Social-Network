"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import { UnderwaterCanvas, AvatarMotionBackground, PasswordStrengthMeter } from "@/components/ui";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isCapsLock, setIsCapsLock] = useState(false);
  const router = useRouter();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setIsCapsLock(e.getModifierState("CapsLock"));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 relative overflow-hidden">
      <UnderwaterCanvas />
      <AvatarMotionBackground />
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md glassmorphism rounded-2xl p-8 relative z-10 shadow-2xl transition-all duration-300"
      >
        <div className="flex flex-col items-center text-center space-y-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-xl shadow-blue-500/25">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white">Set New Password</h2>
            <p className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-400" /> Create a new secure password
            </p>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-xs text-red-400 bg-red-950/30 border border-red-900/60 rounded-lg p-3 flex items-start gap-2"
          >
            <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5 text-red-400" />
            <span>{error}</span>
          </motion.div>
        )}

        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-emerald-950/30 border border-emerald-900/60 rounded-xl text-emerald-400 text-xs flex flex-col items-center space-y-2 text-center"
          >
            <CheckCircle2 className="h-8 w-8 text-emerald-400" />
            <p className="font-semibold text-sm">Password Updated Successfully</p>
            <p className="text-slate-300 text-[11px]">
              Redirecting you to the sign-in page...
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="reset-new-password" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  id="reset-new-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onKeyUp={handleKeyDown}
                  disabled={loading}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-lg py-2.5 px-3.5 pr-10 text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {isCapsLock && (
                <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-amber-400 font-semibold bg-amber-950/20 border border-amber-800/40 rounded px-2 py-1">
                  <AlertTriangle className="h-3 w-3" /> Caps Lock is ON
                </div>
              )}
              <PasswordStrengthMeter password={password} />
            </div>

            <div>
              <label htmlFor="reset-confirm-password" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Confirm Password
              </label>
              <input
                id="reset-confirm-password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-lg py-2.5 px-3.5 text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg py-2.5 text-sm font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-blue-500/20 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving Password
                </>
              ) : (
                "Save & Reset Password"
              )}
            </button>

            <div className="mt-6 text-center text-xs text-slate-400">
              Back to{" "}
              <Link href="/login" className="text-blue-400 font-medium hover:text-blue-300 transition-colors">
                Sign in
              </Link>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}

