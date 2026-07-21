"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MailCheck, Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import { UnderwaterCanvas, AvatarMotionBackground } from "@/components/ui";

export default function VerifyEmailPage() {
  const [resent, setResent] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const handleResend = () => {
    if (cooldown > 0) return;
    setResent(true);
    setCooldown(30);

    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
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
        className="w-full max-w-md glassmorphism rounded-2xl p-8 relative z-10 shadow-2xl text-center flex flex-col items-center"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-xl shadow-blue-500/25 mb-4">
          <MailCheck className="text-white w-7 h-7" />
        </div>

        <h2 className="text-2xl font-extrabold text-white mb-2">Verify Your Email</h2>
        <p className="text-xs text-slate-400 mb-6 max-w-xs leading-relaxed">
          We sent a verification link to your email address. Please click the link to activate your account.
        </p>

        {resent && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-900/60 rounded-lg p-2.5 flex items-center gap-2 w-full justify-center"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>New verification link dispatched!</span>
          </motion.div>
        )}

        <button
          onClick={handleResend}
          disabled={cooldown > 0}
          className="w-full border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-white rounded-lg py-2.5 text-xs font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          {cooldown > 0 ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Resend available in {cooldown}s
            </>
          ) : (
            "Resend Verification Link"
          )}
        </button>

        <div className="mt-6 text-xs text-slate-400">
          Already verified?{" "}
          <Link href="/login" className="text-blue-400 font-medium hover:text-blue-300 transition-colors inline-flex items-center gap-1">
            Sign in <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

