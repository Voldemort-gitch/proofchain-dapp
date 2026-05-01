"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/[0.03] bg-black/40 backdrop-blur-xl">
      <div className="container mx-auto flex h-20 items-center justify-between px-6 sm:px-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="relative">
            <ShieldCheck className="h-9 w-9 text-blue-500 relative z-10" />
            <div className="absolute inset-0 bg-blue-500/20 blur-lg rounded-full" />
          </div>
          <Link href="/" className="text-2xl font-black tracking-tighter text-white uppercase italic">
            Proof<span className="text-blue-500">Chain</span>
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-8"
        >
          <div className="hidden md:flex items-center gap-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
            <a href="#stats" onClick={(e) => scrollToSection(e, "stats")} className="hover:text-white transition-colors cursor-pointer">Platform</a>
            <a href="#governance" onClick={(e) => scrollToSection(e, "governance")} className="hover:text-white transition-colors cursor-pointer">Governance</a>
            <a href="#api" onClick={(e) => scrollToSection(e, "api")} className="hover:text-white transition-colors cursor-pointer">API</a>
          </div>

          <div>
            {mounted ? (
              <ConnectButton 
                accountStatus="address"
                showBalance={false}
              />
            ) : (
              <div className="h-10 w-32 bg-white/5 animate-pulse rounded-xl" />
            )}
          </div>
        </motion.div>
      </div>
    </nav>
  );
}
