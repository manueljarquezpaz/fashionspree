import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-poppins)"],
        brand: ["var(--font-vidaloka)"],
      },
      animation: {
        dim: "dim 2s infinite",
      },
      keyframes: {
        dim: {
          "0%, 100%": { backgroundColor: "#952370" },
          "50%": { backgroundColor: "#4652b9" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
