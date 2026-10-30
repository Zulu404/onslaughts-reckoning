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
  title: "Onslaught's Reckoning — EU PvP Guild",
  description:
    "A World of Warcraft forever guild on EU PvP. We raid, we conquer, we endure. Now recruiting.",
  openGraph: {
    title: "Onslaught's Reckoning",
    description:
      "A World of Warcraft forever guild on EU PvP. We raid, we conquer, we endure.",
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
    description: "A World of Warcraft forever guild on EU PvP.",
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
