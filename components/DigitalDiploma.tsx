"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Award, Calendar, BookOpen, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface DiplomaProps {
  data: {
    recipient: string;
    course: string;
    issuer: string;
    hash: string;
  };
  onClose: () => void;
}

export function DigitalDiploma({ data, onClose }: DiplomaProps) {
  // Generate a verification URL (placeholder)
  const verificationUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/verify/${data.hash}` 
    : `https://proofchain.io/verify/${data.hash}`;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl cursor-zoom-out overflow-y-auto py-20"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl glass-card rounded-[3rem] p-1 shadow-[0_0_100px_rgba(59,130,246,0.3)] cursor-default"
      >
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 z-[110] p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all text-white/50 hover:text-white"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="absolute inset-0 border-[16px] border-white/5 rounded-[2.8rem] pointer-events-none" />
        
        <div className="bg-slate-950 rounded-[2.5rem] p-12 md:p-20 flex flex-col items-center text-center relative overflow-hidden">
          {/* Header */}
          <div className="flex flex-col items-center mb-12">
            <div className="bg-blue-600/20 p-5 rounded-full mb-6">
              <ShieldCheck className="h-16 w-16 text-blue-500" />
            </div>
            <h4 className="text-blue-500 font-bold uppercase tracking-[0.4em] text-xs">Certificate of Authenticity</h4>
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent my-6" />
          </div>

          <h1 className="text-slate-500 text-lg uppercase tracking-widest mb-4 font-medium italic">This is to certify that</h1>
          <h2 className="text-5xl md:text-7xl font-black text-white mb-10 tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
            {data.recipient}
          </h2>
          
          <p className="text-slate-400 max-w-xl leading-relaxed mb-10 text-lg font-light">
            has successfully completed the requirements for:
          </p>

          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-10 w-full max-w-2xl mb-12 shadow-inner">
             <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">{data.course}</h3>
             <div className="flex items-center justify-center gap-8 text-slate-500 text-xs mt-6 uppercase tracking-widest font-bold">
                <span className="flex items-center gap-2"><BookOpen className="h-4 w-4" /> Syllabus v2.0</span>
                <span className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {new Date().toLocaleDateString()}</span>
             </div>
          </div>

          {/* Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-3xl text-left border-t border-white/10 pt-12 items-end">
            <div className="col-span-1">
              <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-2">Authorized Issuer</label>
              <div className="flex items-center gap-2 text-white font-black text-xl italic tracking-tighter">
                 <Award className="h-6 w-6 text-blue-500" /> {data.issuer}
              </div>
            </div>
            
            <div className="col-span-1 flex flex-col items-center justify-center text-center">
               <div className="p-3 bg-white rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] mb-3">
                  <QRCodeSVG 
                    value={verificationUrl} 
                    size={80}
                    level="H"
                    includeMargin={false}
                  />
               </div>
               <span className="text-[9px] text-slate-500 uppercase font-bold tracking-tighter">Scan to Verify</span>
            </div>

            <div className="col-span-1 text-right">
              <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-2">Blockchain Proof</label>
              <div className="bg-white/5 px-3 py-2 rounded-lg text-slate-400 font-mono text-[9px] truncate">
                {data.hash}
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="mt-16 text-slate-600 hover:text-white transition-all text-[10px] uppercase tracking-[0.3em] font-bold"
          >
            Click anywhere to dismiss
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
