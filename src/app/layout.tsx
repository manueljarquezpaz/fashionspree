import type { Metadata } from "next";
import { Poppins, Vidaloka } from "next/font/google";
import "./globals.css";

// Configure Poppins for general text (Great for body copy)
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

// Configure Vidaloka (Perfect for the high-end Fashion Council headings)
const vidaloka = Vidaloka({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-vidaloka",
});

export const metadata: Metadata = {
  title: "Arab Fashion Council | Vote for Excellence",
  description:
    "Empowering Arab Fashion: Uniting 22 Nations to Foster Creative Economy and Style Innovation. Explore the vibrant world of Arab fashion heritage and contemporary design.",
  icons: {
    icon: "/image/favicon.png", // Updated to match your Code A structure
    apple: "/image/favicon.png",
  },
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${poppins.variable} ${vidaloka.variable} font-sans antialiased bg-white text-gray-900`}>
        {/* The children prop renders your page.tsx and all its components */}
        {children}
      </body>
    </html>
  );
}
