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
  title: "Onslaught's Reckoning — EU Horde PvP Guild",
  description:
    "An EU Horde guild on the PvP ruleset for WoW Forever. Now recruiting.",
  openGraph: {
    title: "Onslaught's Reckoning",
    description:
      "An EU Horde guild on the PvP ruleset for WoW Forever. Now recruiting.",
    type: "website",
    images: [
      {
        url: "/logo.jpg",
        width: 1253,
        height: 1254,
        alt: "Onslaught's Reckoning",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Onslaught's Reckoning",
    description: "An EU Horde guild on the PvP ruleset for WoW Forever.",
    images: ["/logo.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cinzel.variable} ${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-black text-stone-100 antialiased">
        {children}
      </body>
    </html>
  );
}
