"use client";
import { useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";

export function PurgeButton({ onPurge }: { onPurge: () => void }) {
  const [confirm, setConfirm] = useState(false);

  const handlePurge = async () => {
    if (!confirm) {
      setConfirm(true);
      setTimeout(() => setConfirm(false), 3000);
      return;
    }

    // Call the actual delete API
    await fetch("/api/loot", { method: "DELETE" });
    onPurge();
    setConfirm(false);
  };

  return (
    <button
      onClick={handlePurge}
      className={`flex items-center gap-2 px-4 py-2 rounded border transition-all duration-300 ${
        confirm
          ? "bg-red-500/10 border-red-500/50 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
          : "bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:text-zinc-300"
      }`}>
      <span className="text-[9px] uppercase tracking-[0.2em] font-bold">
        {confirm ? "Confirm Purge?" : "Purge Buffer"}
      </span>
      {confirm ? (
        <AlertTriangle className="w-3 h-3 animate-pulse" />
      ) : (
        <Trash2 className="w-3 h-3" />
      )}
    </button>
  );
}
