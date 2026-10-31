"use client";
import { useRouter } from "next/navigation";
import { ShieldAlert, Terminal, ArrowLeft, Lock } from "lucide-react";
import { useEffect, useState } from "react";

export default function UnauthorizedPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const [traceId, setTraceId] = useState("");

  useEffect(() => {
    // 1. Mark as mounted to prevent hydration errors
    setMounted(true);

    // 2. Generate the ID only once on the client
    setTraceId(Math.random().toString(36).substring(2, 11).toUpperCase());

    // 3. Glitch effect interval
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 150);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // If we aren't mounted yet, return a black screen to avoid content flash
  if (!mounted) return <div className="min-h-screen bg-[#050505]" />;

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 font-mono overflow-hidden relative">
      {/* Background Security Text Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none overflow-hidden text-[8px] leading-tight text-red-500 flex flex-wrap gap-2 p-2">
        {Array(100)
          .fill("UNAUTHORIZED_ACCESS_DETECTED_")
          .map((t, i) => (
            <span key={i}>{t}</span>
          ))}
      </div>

      <div
        className={`relative z-10 w-full max-w-md text-center transition-all duration-75 ${
          glitch ? "translate-x-1 skew-x-2 brightness-150" : ""
        }`}>
        {/* Pulsing Shield Icon */}
        <div className="bg-red-500/10 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto border border-red-500/20 mb-8 shadow-[0_0_60px_-15px_rgba(239,68,68,0.5)]">
          <ShieldAlert className="w-12 h-12 text-red-500 animate-pulse" />
        </div>

        <h1 className="text-white text-4xl font-black tracking-tighter mb-2 uppercase italic">
          Access_Denied
        </h1>

        <div className="flex items-center justify-center gap-2 text-red-600/60 text-[10px] font-bold uppercase tracking-[0.4em] mb-10">
          <Lock className="w-3 h-3" />
          Node_Security_Protocol_403
        </div>

        {/* System Log Terminal Card */}
        <div className="bg-black/60 border border-zinc-900 rounded-2xl p-6 mb-10 text-left space-y-4 shadow-2xl backdrop-blur-md relative overflow-hidden">
          {/* Top terminal bar */}
          <div className="flex items-center gap-2 text-zinc-500 border-b border-zinc-900/50 pb-3">
            <Terminal className="w-4 h-4" />
            <span className="text-[10px] uppercase font-bold tracking-widest">
              Incident_Report_Log
            </span>
          </div>

          <div className="space-y-3">
            <p className="text-xs leading-relaxed text-zinc-400">
              <span className="text-red-500 font-bold">ERROR:</span> Remote host
              attempted to bypass administrative encryption. Security clearance{" "}
              <span className="text-red-500 font-bold underline">LEVEL_0</span>{" "}
              detected.
            </p>

            <div className="text-[10px] space-y-1 font-bold">
              <p className="text-zinc-600 flex justify-between">
                <span>TRACE_ID:</span>
                <span className="text-zinc-400">{traceId}</span>
              </p>
              <p className="text-zinc-600 flex justify-between">
                <span>STATUS:</span>
                <span className="text-red-600">BLACKLISTED</span>
              </p>
              <p className="text-zinc-600 flex justify-between">
                <span>ACTION:</span>
                <span className="text-zinc-400 uppercase font-mono">
                  Access_Permanently_Blocked
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          className="group flex items-center gap-3 mx-auto text-[11px] font-black text-zinc-600 hover:text-white transition-all uppercase tracking-widest bg-zinc-900/30 px-6 py-3 rounded-full border border-zinc-800/50 hover:border-zinc-700">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Return to Entry
        </button>
      </div>

      {/* Red Scanline Animation (controlled via tailwind.config.ts) */}
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-transparent via-red-500/[0.07] to-transparent h-2 w-full animate-scanline z-50" />
    </div>
  );
}
