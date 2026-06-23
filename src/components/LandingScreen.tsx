import React, { useEffect, useState } from "react";
import { Scan, Users, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

interface LandingScreenProps {
  onComplete: () => void;
}

export default function LandingScreen({ onComplete }: LandingScreenProps) {
  const [timeLeft, setTimeLeft] = useState(3);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }
    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, onComplete]);

  return (
    <div 
      id="landing-container"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900 text-white overflow-hidden"
    >
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      {/* Main Branding Section */}
      <div className="relative flex flex-col items-center max-w-md px-6 text-center z-10">
        
        {/* Animated Scanner Radar Logo */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative mb-6 flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 shadow-xl shadow-indigo-500/20"
        >
          {/* Pulsing ring outer */}
          <span className="absolute -inset-2 rounded-2xl border border-indigo-400/30 animate-ping opacity-40 pointer-events-none" />
          
          <div className="relative">
            <Users className="w-10 h-10 text-white stroke-[1.5]" />
            <motion.div 
              id="loader-scan"
              animate={{ 
                top: ["0%", "100%", "0%"],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute left-0 right-0 h-0.5 bg-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
              style={{ top: "50%" }}
            />
            <Scan className="absolute -inset-2 w-14 h-14 text-cyan-400/80 stroke-[1.2] pointer-events-none" />
          </div>
        </motion.div>

        {/* App Title */}
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-indigo-200"
        >
          PresenceIQ
        </motion.h1>

        {/* App Subtitle */}
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-3 text-slate-400 font-medium text-sm leading-relaxed"
        >
          Automated Attendance & Participant Analytics Powered by Vision AI
        </motion.p>

        {/* Loading Indicator */}
        <motion.div 
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "100%", opacity: 1 }}
          transition={{ delay: 0.4, duration: 2.4, ease: "linear" }}
          className="mt-10 h-1 w-48 bg-slate-8 w-full bg-slate-800 rounded-full overflow-hidden"
        >
          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(3 - timeLeft) * 33.3}%` }} />
        </motion.div>

        {/* Bottom brand reassurance */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 flex items-center gap-2 text-xs text-indigo-300 bg-indigo-950/40 border border-indigo-900/40 px-3.5 py-1.5 rounded-full"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Professional-grade Institutional Accuracy</span>
        </motion.div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-6 text-2xs text-slate-500 tracking-wider uppercase font-mono">
        v2.5.0 • Powered by Gemini AI
      </div>
    </div>
  );
}
