"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyButton({ data }: { data: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(data);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-2 text-zinc-600 hover:text-white transition-colors duration-200">
      <span className="text-[9px] uppercase tracking-widest font-bold">
        {copied ? "Copied" : "Copy"}
      </span>
      {copied ? (
        <Check className="w-3 h-3 text-green-500" />
      ) : (
        <Copy className="w-3 h-3" />
      )}
    </button>
  );
}
