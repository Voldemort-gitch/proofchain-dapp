import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "ProofChain | Decentralized Verification",
  description: "Secure and immutable certificate verification on Ethereum Sepolia.",
};

import { Providers } from "../components/Providers";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${outfit.variable} h-full antialiased dark`} suppressHydrationWarning>
      <body className="font-sans min-h-full flex flex-col transition-colors duration-500">
        <Providers>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
