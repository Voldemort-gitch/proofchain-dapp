"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { 
  PlusCircle, Search, Award, CheckCircle2, Zap, Loader2, ExternalLink, 
  Copy, Check, ShieldAlert, ShieldCheck, Clock, Trash2, Upload, 
  FileText, Globe, Activity, Database, Server, Vote, Code2, Key, Terminal 
} from "lucide-react";
import { useProofChain } from "@/hooks/useProofChain";
import { useAccount } from "wagmi";
import { DigitalDiploma } from "@/components/DigitalDiploma";
import { QRCodeSVG } from "qrcode.react";

// --- Interactive Card Component ---
function TiltCard({ children, className, isLocked }: { children: React.ReactNode, className?: string, isLocked?: boolean }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
    e.currentTarget.style.setProperty("--mouse-x-card", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--mouse-y-card", `${e.clientY - rect.top}px`);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`glass-card p-6 sm:p-10 rounded-[2.5rem] sm:rounded-[3rem] relative ${className}`}
    >
      <div style={{ transform: "translateZ(50px)" }}>{children}</div>
      {isLocked && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-30 flex flex-col items-center justify-center p-8 text-center rounded-[3rem]">
          <ShieldAlert className="h-16 w-16 text-yellow-500 mb-4 animate-pulse" />
          <h3 className="text-2xl font-bold text-white mb-2 italic">Restricted Access</h3>
          <p className="text-slate-400 max-w-xs text-sm">Only Protocol Authority can issue new records.</p>
        </div>
      )}
    </motion.div>
  );
}

// --- Stat Counter Component ---
function StatItem({ icon: Icon, label, value, subtext, color }: any) {
  return (
    <div className="flex flex-col gap-4 p-6 sm:p-8 rounded-[2rem] bg-white/[0.02] border border-white/[0.03] hover:border-white/10 transition-all">
      <div className={`p-3 rounded-xl w-fit ${color} shadow-lg`}><Icon className="h-6 w-6 text-white" /></div>
      <div>
        <div className="text-4xl font-black text-white tracking-tighter mb-1">{value}</div>
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{label}</div>
        <div className="text-xs text-slate-600 font-medium">{subtext}</div>
      </div>
    </div>
  );
}

export default function Home() {
  const { isConnected } = useAccount();
  const { 
    addCertificate, generateCertHash, isWritePending, 
    isConfirming, isConfirmed, txHash, isOwner 
  } = useProofChain();

  // State
  const [issueData, setIssueData] = useState({ recipient: "", course: "", issuer: "" });
  const [verifyHash, setVerifyHash] = useState("");
  const [lastGeneratedHash, setLastGeneratedHash] = useState("");
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [showDiploma, setShowDiploma] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [ipfsCid, setIpfsCid] = useState("");
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      document.body.style.setProperty("--mouse-x", `${(e.clientX / window.innerWidth) * 100}%`);
      document.body.style.setProperty("--mouse-y", `${(e.clientY / window.innerHeight) * 100}%`);
    };
    window.addEventListener("mousemove", handleGlobalMouseMove);
    return () => window.removeEventListener("mousemove", handleGlobalMouseMove);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("proofchain_history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (isConfirmed && txHash && lastGeneratedHash) {
      const newItem = { ...issueData, hash: lastGeneratedHash, txHash: txHash as string, timestamp: Date.now(), ipfsCid: ipfsCid };
      const updatedHistory = [newItem, ...history].slice(0, 5);
      setHistory(updatedHistory);
      localStorage.setItem("proofchain_history", JSON.stringify(updatedHistory));
    }
  }, [isConfirmed]);

  const handleIssue = async () => {
    if (!issueData.recipient || !issueData.course || !issueData.issuer) return;
    const hash = generateCertHash(issueData.recipient, issueData.course, issueData.issuer);
    setLastGeneratedHash(hash);
    await addCertificate(hash);
  };

  const generateKey = () => {
    setApiKey("pc_" + Math.random().toString(36).substring(2, 20) + "_" + Math.random().toString(36).substring(2, 10));
  };

  return (
    <main className="relative flex min-h-[calc(100vh-80px)] flex-col items-center px-4 py-16 scroll-smooth">
      <div className="mesh-gradient" />
      <div className="noise" />

      {/* Hero Section */}
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="text-center mb-20 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
          <Zap className="h-3 w-3 fill-current" />
          Decentralized Verification Engine
        </div>
        <h1 className="text-5xl font-black tracking-tighter text-white mb-6 leading-none sm:text-7xl lg:text-8xl">PROOFCHAIN <br /><span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-500 to-emerald-400 italic font-black">PROTOCOL</span></h1>
        <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto font-medium tracking-tight px-4">The ultimate ecosystem for decentralized governance, API automation, and cryptographic issuance.</p>
      </motion.div>

      {/* Main Dashboard Section */}
      <div className="flex flex-col gap-32 w-full max-w-7xl relative z-10">
        
        {/* Connection Notice for Guests */}
        {!isConnected && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl text-center">
             <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center justify-center gap-2">
                <ShieldAlert className="h-3 w-3" /> 
                Public Read-Only Mode: Connect wallet to access Admin Issuance
             </p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Issue Section - Locked for Guests or Non-Owners */}
          <TiltCard isLocked={!isConnected || !isOwner} className={isOwner && isConnected ? "border-beam" : ""}>
               <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-5 rounded-[1.5rem] w-fit mb-10 shadow-xl shadow-blue-500/20"><PlusCircle className="h-9 w-9 text-white" /></div>
               <h2 className="text-4xl font-black text-white mb-2 italic tracking-tighter uppercase">Mint Record</h2>
               <p className="text-slate-500 mb-10 font-medium tracking-tight">Secure a credential on the immutable ledger.</p>
               <div className="space-y-6 w-full">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Recipient</label><input value={issueData.recipient} onChange={(e) => setIssueData({...issueData, recipient: e.target.value})} type="text" placeholder="Name" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white text-sm outline-none" /></div>
                    <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Issuer</label><input value={issueData.issuer} onChange={(e) => setIssueData({...issueData, issuer: e.target.value})} type="text" placeholder="Org" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white text-sm outline-none" /></div>
                  </div>
                  <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Title</label><input value={issueData.course} onChange={(e) => setIssueData({...issueData, course: e.target.value})} type="text" placeholder="Achievement" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white text-sm outline-none" /></div>
                  
                  {/* IPFS Upload Box */}
                  <div className="relative">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Attachment (IPFS)</label>
                    <div className={`border-2 border-dashed rounded-[2rem] p-8 transition-all flex flex-col items-center gap-3 ${selectedFile ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-white/5 bg-white/[0.03] hover:bg-white/[0.05]'}`}>
                      <input type="file" onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setSelectedFile(e.target.files[0]);
                          setIsUploading(true);
                          setTimeout(() => { setIpfsCid("Qm" + Math.random().toString(36).substring(2, 15)); setIsUploading(false); }, 2000);
                        }
                      }} className="absolute inset-0 opacity-0 cursor-pointer" />
                      {isUploading ? <Loader2 className="h-8 w-8 text-blue-500 animate-spin" /> : selectedFile ? <FileText className="h-8 w-8 text-emerald-500" /> : <Upload className="h-8 w-8 text-slate-600" />}
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isUploading ? "Uploading..." : selectedFile ? selectedFile.name : "Deposit Certificate PDF / JPG"}</span>
                    </div>
                  </div>

                  <button onClick={handleIssue} disabled={isWritePending || isConfirming || !issueData.recipient || isUploading} className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-20 text-white font-black py-5 rounded-2xl transition-all shadow-lg">
                    {isWritePending || isConfirming ? <Loader2 className="h-6 w-6 animate-spin" /> : <Award className="h-6 w-6" />}
                    MINT PROTOCOL RECORD
                  </button>
                  {isConfirmed && (<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-emerald-500/5 border border-emerald-500/20 p-5 rounded-2xl mt-8 flex gap-4 items-center"><div className="flex-1 overflow-hidden"><span className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2 block underline">MINT SUCCESS</span><code className="text-[10px] text-emerald-300 truncate font-mono block">{lastGeneratedHash}</code></div><div className="p-2 bg-white rounded-xl shrink-0"><QRCodeSVG value={`${window.location.origin}/verify/${lastGeneratedHash}`} size={60} /></div></motion.div>)}
               </div>
            </TiltCard>

            <TiltCard className="border-emerald-500/10">
              <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-5 rounded-[1.5rem] w-fit mb-10 shadow-xl shadow-emerald-500/20"><Search className="h-9 w-9 text-white" /></div>
              <h2 className="text-4xl font-black text-white mb-2 italic tracking-tighter uppercase">Audit</h2>
              <p className="text-slate-500 mb-10 font-medium tracking-tight">Perform cryptographic validation.</p>
              <div className="space-y-6 w-full"><div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Input Hash</label><input value={verifyHash} onChange={(e) => setVerifyHash(e.target.value)} type="text" placeholder="0x..." className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white text-sm outline-none" /></div><VerifyButton hash={verifyHash as `0x${string}`} history={history} onVerify={(data) => setShowDiploma(data)} /></div>
            </TiltCard>
          </div>

          {/* Platform Analytics */}
          <section id="stats" className="py-20 border-t border-white/[0.03]">
             <div className="flex flex-col gap-12">
                <div className="flex flex-col gap-4">
                   <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase underline decoration-blue-500 decoration-8 underline-offset-8">Network Analytics</h2>
                   <p className="text-slate-500 font-medium">Real-time health of the global ProofChain cluster.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                   <StatItem icon={Database} label="RECORDS MINTED" value="1.2M+" color="bg-blue-600/20" subtext="Total on-chain hashes." />
                   <StatItem icon={Server} label="NODES ACTIVE" value="4,892" color="bg-indigo-600/20" subtext="Global validators." />
                   <StatItem icon={Activity} label="VERIFY LATENCY" value="1.4s" color="bg-emerald-600/20" subtext="Average scan speed." />
                   <StatItem icon={Globe} label="REGIONS" value="142" color="bg-purple-600/20" subtext="Active jurisdictions." />
                </div>
             </div>
          </section>

          {/* Governance Section */}
          <section id="governance" className="py-20 border-t border-white/[0.03]">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-1 flex flex-col gap-6">
                   <div className="bg-purple-600/20 p-5 rounded-2xl w-fit mb-4"><Vote className="h-8 w-8 text-purple-500" /></div>
                   <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase">Governance</h2>
                   <p className="text-slate-500 leading-relaxed font-medium">The community-driven engine that controls protocol evolution and issuer whitelisting.</p>
                   <div className="p-6 bg-white/[0.02] border border-white/10 rounded-3xl mt-4">
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Your Voting Power</div>
                      <div className="text-3xl font-black text-white">4.2% <span className="text-xs text-purple-500">vTokens</span></div>
                      <button className="w-full mt-6 bg-purple-600/10 hover:bg-purple-600 text-purple-500 hover:text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Stake to Vote</button>
                   </div>
                </div>
                <div className="lg:col-span-2 flex flex-col gap-6">
                   <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Active Proposals</div>
                   <div className="space-y-4">
                      {[
                        { title: "Whitelist: Stanford University as Issuer", status: "Voting Open", votes: "82% Yes" },
                        { title: "Upgrade: L2 Settlement Layer integration", status: "Discussion", votes: "N/A" },
                        { title: "Protocol: Increase max metadata size to 512KB", status: "Execution", votes: "Passed" }
                      ].map((p, i) => (
                        <div key={i} className="p-6 bg-white/[0.02] border border-white/[0.03] hover:border-white/10 rounded-[2rem] flex items-center justify-between group transition-all">
                           <div>
                              <h4 className="text-white font-bold mb-1">{p.title}</h4>
                              <span className="text-[10px] text-purple-500 uppercase font-black">{p.status}</span>
                           </div>
                           <div className="text-right">
                              <div className="text-white font-black">{p.votes}</div>
                              <button className="text-[10px] text-slate-500 hover:text-white uppercase font-black mt-1">View Details</button>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </section>

          {/* API Console Section */}
          <section id="api" className="py-20 border-t border-white/[0.03]">
             <div className="glass-card p-8 sm:p-12 rounded-[3rem] sm:rounded-[4rem] border-white/[0.05] bg-gradient-to-tr from-emerald-600/[0.02] to-transparent overflow-hidden relative">
                <div className="absolute -top-24 -right-24 h-64 w-64 bg-emerald-500/5 blur-[100px] rounded-full" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
                   <div className="flex flex-col gap-8">
                      <div className="bg-emerald-600/20 p-5 rounded-2xl w-fit"><Terminal className="h-8 w-8 text-emerald-500" /></div>
                      <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">Developer<br /><span className="text-emerald-500">API Console</span></h2>
                      <p className="text-slate-500 font-medium">Integrate cryptographic verification into any platform with three lines of code.</p>
                      
                      <div className="space-y-4">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Your Protocol Key</label>
                            <div className="flex gap-4">
                               <input readOnly value={apiKey} placeholder="Generate a key..." className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-emerald-400 font-mono text-xs outline-none" />
                               <button onClick={generateKey} className="bg-emerald-600 p-4 rounded-2xl hover:bg-emerald-500 transition-all shadow-lg"><Key className="h-5 w-5 text-white" /></button>
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="bg-black/60 rounded-[2.5rem] border border-white/5 p-8 font-mono text-sm overflow-hidden shadow-2xl">
                      <div className="flex items-center gap-2 mb-6">
                         <div className="h-3 w-3 rounded-full bg-red-500/50" />
                         <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
                         <div className="h-3 w-3 rounded-full bg-emerald-500/50" />
                         <span className="ml-2 text-[10px] text-slate-600 uppercase font-black tracking-widest">verify_certificate.js</span>
                      </div>
                      <pre className="text-emerald-400/80 leading-relaxed">
                         <code>
{`const verify = async (hash) => {
  const response = await fetch('https://api.proofchain.io/v1/verify', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ certHash: hash })
  });

  return await response.json();
};`}
                         </code>
                      </pre>
                      <button className="mt-8 flex items-center gap-2 text-[10px] text-slate-500 hover:text-white uppercase font-black transition-all"><Copy className="h-4 w-4" /> Copy Snippet</button>
                   </div>
                </div>
             </div>
          </section>

          {/* Activity Log (Moved to bottom) */}
          <section className="py-20 border-t border-white/[0.03]">
             <div className="flex items-center justify-between mb-10"><div className="flex items-center gap-4"><div className="bg-slate-800 p-3 rounded-2xl shadow-inner"><Clock className="h-6 w-6 text-slate-400" /></div><h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Recent Mints</h3></div>{history.length > 0 && (<button onClick={() => { setHistory([]); localStorage.removeItem("proofchain_history"); }} className="text-xs text-red-500/40 hover:text-red-500 flex items-center gap-2 font-bold transition-all uppercase tracking-widest"><Trash2 className="h-4 w-4" /> Wipe History</button>)}</div>
             {history.length === 0 ? (<div className="text-center py-20 border-2 border-dashed border-white/[0.03] rounded-[2.5rem]"><p className="text-slate-700 text-sm italic font-medium">No recent mints detected on the local cluster.</p></div>) : (
                <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="text-[11px] text-slate-600 uppercase tracking-[0.2em] border-b border-white/[0.03] font-black"><th className="pb-6 pl-4">HOLDER</th><th className="pb-6">CREDENTIAL</th><th className="pb-6">STATUS</th><th className="pb-6 text-right pr-4">ACTION</th></tr></thead><tbody className="divide-y divide-white/[0.03]">{history.map((item, i) => (<tr key={i} className="group hover:bg-white/[0.01] transition-colors"><td className="py-6 pl-4 font-black text-white text-lg tracking-tight">{item.recipient}</td><td className="py-6 text-slate-400 font-bold">{item.course}</td><td className="py-6"><span className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black text-emerald-400 w-fit"><ShieldCheck className="h-3 w-3" /> SECURED</span></td><td className="py-6 text-right pr-4"><button onClick={() => setShowDiploma(item)} className="bg-blue-600/10 hover:bg-blue-600 text-blue-500 hover:text-white px-6 py-3 rounded-2xl text-[10px] font-black transition-all shadow-lg uppercase tracking-widest">Open Record</button></td></tr>))}</tbody></table></div>
             )}
          </section>

        </div>
      </div>

      {/* Diploma Modal */}
      <AnimatePresence>{showDiploma && (<DigitalDiploma data={showDiploma} onClose={() => setShowDiploma(null)} />)}</AnimatePresence>
    </main>
  );
}

function VerifyButton({ hash, history, onVerify }: { hash: `0x${string}`, history: any[], onVerify: (data: any) => void }) {
  const { verifyCertificate } = useProofChain();
  const { data: isValid, isFetching, refetch, isFetched } = verifyCertificate(hash);
  return (
    <div className="space-y-6">
      <button onClick={async () => { const { data } = await refetch(); if (data === true) { const existing = history.find(item => item.hash.toLowerCase() === hash.toLowerCase()); onVerify(existing || { recipient: "Verified Holder", course: "Verified Achievement", issuer: "ProofChain Protocol", hash: hash, txHash: "0x...", timestamp: Date.now() }); } }} disabled={isFetching || !hash.startsWith("0x")} className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-20 text-white font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)]">
        {isFetching ? <Loader2 className="h-6 w-6 animate-spin" /> : <Search className="h-6 w-6" />}
        VALIDATE RECORD
      </button>
      {isFetched && !isFetching && (<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`p-5 rounded-2xl text-center font-black border uppercase tracking-widest text-sm ${isValid ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 glow-emerald' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>{isValid ? "AUTHENTICITY CONFIRMED" : "RECORD NOT FOUND"}</motion.div>)}
    </div>
  );
}
