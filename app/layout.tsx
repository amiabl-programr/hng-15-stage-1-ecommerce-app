import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Roofing Construction Shop | Industrial & Residential Materials",
    template: "%s | Roofing Construction Shop",
  },
  description:
    "Factory-direct supplier of Longspan aluminium, Metcopo, Step tiles, Stone-coated shingles, and mobile on-site roll-forming services.",
  keywords: [
    "roofing sheets",
    "longspan aluminium",
    "metcopo roofing",
    "step tiles",
    "roofing shingles",
    "roll forming service",
    "sheet bending",
    "ridge caps",
    "valley trimmers",
  ],
  authors: [{ name: "Roofing Construction Shop" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950 font-sans">
        {children}
      </body>
    </html>
  );
}
