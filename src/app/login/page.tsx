"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin");
    } catch (error: any) {
      alert("Verification Failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 font-sans selection:bg-blue-500/30">
      <div className="w-full max-w-[400px] space-y-8">
        <div className="text-center space-y-1">
          <h1 className="text-zinc-100 text-xl font-medium tracking-tight">
            Administrator Portal
          </h1>
          <p className="text-sm text-zinc-500">Secure sign-in required</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="email"
                placeholder="Email address"
                required
                className="w-full p-3.5 pl-11 bg-[#121212] text-zinc-200 rounded-xl border border-zinc-800/50 focus:border-blue-600 focus:bg-[#161616] outline-none transition-all text-sm placeholder:text-zinc-600"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="password"
                placeholder="Password"
                required
                className="w-full p-3.5 pl-11 bg-[#121212] text-zinc-200 rounded-xl border border-zinc-800/50 focus:border-blue-600 focus:bg-[#161616] outline-none transition-all text-sm placeholder:text-zinc-600"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-zinc-100 hover:bg-white text-black p-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
          </button>
        </form>

        <div className="text-center">
          <span className="text-[10px] text-zinc-700 uppercase tracking-widest font-medium">
            Authorized Personnel Only
          </span>
        </div>
      </div>
    </div>
  );
}
