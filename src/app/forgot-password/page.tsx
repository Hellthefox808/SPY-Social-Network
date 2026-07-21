"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { KeyRound, ArrowLeft, Mail, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { UnderwaterCanvas, AvatarMotionBackground } from "@/components/ui";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);

  const isValidEmail = !touched || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    setError("");

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
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
            <KeyRound className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white">Reset Password</h2>
            <p className="text-xs text-slate-400 mt-1">Enter your email address to receive password recovery instructions.</p>
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
            className="space-y-4 text-center py-2"
          >
            <div className="p-4 bg-emerald-950/30 border border-emerald-900/60 rounded-xl text-emerald-400 text-xs flex flex-col items-center space-y-2">
              <CheckCircle2 className="h-8 w-8 text-emerald-400" />
              <p className="font-semibold text-sm">Reset Link Dispatched</p>
              <p className="text-slate-300 text-[11px]">
                We sent password reset instructions to <span className="font-mono text-emerald-300">{email}</span>. Please check your inbox.
              </p>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors mt-2"
            >
              <ArrowLeft className="h-4 w-4" /> Return to Sign In
            </Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="forgot-email" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Account Email
              </label>
              <div className="relative">
                <input
                  id="forgot-email"
                  type="email"
                  placeholder="e.g. alex@socialgraph.local"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched(true)}
                  disabled={loading}
                  aria-invalid={!isValidEmail}
                  className={`w-full bg-slate-950/60 border rounded-lg py-2.5 px-3.5 pl-10 text-slate-200 placeholder-slate-600 text-sm focus:outline-none transition-all ${
                    !isValidEmail
                      ? "border-red-500/60 focus:ring-1 focus:ring-red-500/50"
                      : "border-slate-800 focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50"
                  }`}
                />
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              </div>
              {!isValidEmail && (
                <p className="mt-1 text-[11px] text-red-400">Please enter a valid email address.</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg py-2.5 text-sm font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-blue-500/20 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Sending Instructions
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>

            <div className="mt-6 text-center text-xs text-slate-400">
              Remembered your password?{" "}
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

