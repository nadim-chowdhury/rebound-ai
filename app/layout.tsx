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
  title: "Rebound AI — Recover Lost Revenue Automatically",
  description:
    "AI-powered failed payment recovery for Stripe & Shopify. Rebound AI analyzes why payments fail, sends personalized recovery messages, and wins back your lost revenue on autopilot.",
  keywords: [
    "failed payment recovery",
    "stripe dunning",
    "revenue recovery",
    "AI payment recovery",
    "subscription churn",
    "shopify payments",
    "dunning management",
  ],
  openGraph: {
    title: "Rebound AI — Recover Lost Revenue Automatically",
    description:
      "Stop losing money to failed payments. Rebound AI recovers revenue you didn't even know you were losing.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
