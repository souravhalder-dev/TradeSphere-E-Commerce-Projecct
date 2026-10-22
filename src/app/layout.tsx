import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TradeSphere — Enterprise Global B2B & B2C Marketplace",
  description:
    "Leading wholesale e-commerce platform for verified manufacturers, industrial sourcing, RFQ negotiation, and secure Trade Assurance purchasing.",
  openGraph: {
    title: "TradeSphere — Global Multi-Vendor Marketplace",
    description: "Sourcing direct from verified global manufacturers with MOQ and tiered wholesale pricing.",
    siteName: "TradeSphere",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-slate-50 text-slate-900`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
