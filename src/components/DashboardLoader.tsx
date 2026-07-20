import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Database, Terminal, Shield, Zap } from 'lucide-react';

interface DashboardLoaderProps {
  onComplete: () => void;
}

export default function DashboardLoader({ onComplete }: DashboardLoaderProps) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    { text: 'Establishing secure pipeline connection to SAP ERP...', icon: Database, color: 'text-indigo-400' },
    { text: 'Initializing Manufacturing Intelligence Engine...', icon: Zap, color: 'text-amber-400' },
    { text: 'Parsing downtime vectors & machine parameters...', icon: Terminal, color: 'text-emerald-400' },
    { text: 'Syncing live telemetry dashboard KPIs...', icon: Shield, color: 'text-cyan-400' },
  ];

  useEffect(() => {
    // Progress increment
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 8) + 4;
      });
    }, 120);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Step transitions
    if (progress >= 100) {
      const timeout = setTimeout(() => {
        onComplete();
      }, 600);
      return () => clearTimeout(timeout);
    } else {
      const targetStep = Math.min(
        Math.floor((progress / 100) * steps.length),
        steps.length - 1
      );
      if (targetStep !== step) {
        setStep(targetStep);
      }
    }
  }, [progress, step, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-slate-100 font-mono select-none">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25" />
      
      <div className="relative max-w-md w-full px-8 text-center space-y-8 z-10">
        {/* Animated Central Node */}
        <div className="flex justify-center">
          <div className="relative w-24 h-24">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full border-2 border-indigo-500/20 border-t-indigo-500"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-2 rounded-full border-2 border-cyan-500/20 border-b-cyan-500"
            />
            <div className="absolute inset-4 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Database className="w-8 h-8 text-indigo-400 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Console Text Box */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 text-left shadow-2xl relative overflow-hidden backdrop-blur-md">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="text-xs text-slate-500 ml-2">NABEEL_PORTFOLIO_INIT_SESSION_2026.sh</span>
          </div>

          <div className="min-h-[4rem]">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
                className="flex items-start gap-3"
              >
                {React.createElement(steps[step].icon, { className: `w-5 h-5 mt-0.5 shrink-0 ${steps[step].color}` })}
                <span className="text-sm font-medium text-slate-300 leading-relaxed">
                  {steps[step].text}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress bar */}
          <div className="mt-6">
            <div className="flex justify-between text-xs text-slate-500 mb-2 font-mono">
              <span className="text-indigo-400">LOADING METRICS ENGINE</span>
              <span>{Math.min(progress, 100)}%</span>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
