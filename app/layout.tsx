import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// Cuerpo de texto.
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// FWC2026 — familia de marca (display), versión UltraCondensed para títulos.
const fwc2026 = localFont({
  variable: "--font-heading",
  display: "swap",
  src: [
    { path: "../public/fonts/FWC2026-NormalRegular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/FWC2026-UltraCondensedMedium.ttf", weight: "500", style: "normal" },
    { path: "../public/fonts/FWC2026-UltraCondensedBold.ttf", weight: "700", style: "normal" },
    { path: "../public/fonts/FWC2026-UltraCondensedBlack.ttf", weight: "900", style: "normal" },
  ],
});

// FWC2026 — variante SemiExpanded Black, para branding grande.
const fwc2026Expanded = localFont({
  variable: "--font-display",
  display: "swap",
  src: [
    { path: "../public/fonts/FWC2026-SemiExpandedBlack.ttf", weight: "900", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: "Prode White – Prode oficial de Las White F.C.",
  description: "Participá en el prode oficial de Las White F.C. y ganá hasta $350.000.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} ${fwc2026.variable} ${fwc2026Expanded.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col w-full" suppressHydrationWarning>{children}</body>
    </html>
  );
}
