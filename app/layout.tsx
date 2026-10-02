import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "../public/fonts/Geist-latin.woff2",
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = localFont({
  src: "../public/fonts/GeistMono-latin.woff2",
  variable: "--font-geist-mono",
  display: "swap",
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
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900 selection:bg-blue-600 selection:text-white font-sans">
        {children}
      </body>
    </html>
  );
}
