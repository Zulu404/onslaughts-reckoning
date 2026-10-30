import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Onslaught's Reckoning",
  description: "A World of Warcraft forever guild. We raid, we conquer, we endure.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cinzel.variable} ${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#0a0a0f] text-stone-100 antialiased">
        {children}
      </body>
    </html>
  );
}
