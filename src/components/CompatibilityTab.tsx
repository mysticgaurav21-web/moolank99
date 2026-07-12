import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import { CompatibilityResult } from "../types";
import { 
  Heart, 
  Users, 
  Briefcase, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle,
  Plus,
  Trash2,
  Calendar,
  Layers,
  User,
  RefreshCw,
  Compass,
  ArrowRight,
  UserPlus
} from "lucide-react";

interface CompatibilityTabProps {
  userMoolank: number;
  userBhagyank: number;
  userName: string;
  language: string;
}

interface PartnerProfile {
  id: string;
  name: string;
  moolank: number;
  bhagyank: number;
  dob?: string;
}

export default function CompatibilityTab({ userMoolank, userBhagyank, userName, language }: CompatibilityTabProps) {
  const isHinglish = language === "hinglish";

  // Form inputs
  const [partnerName, setPartnerName] = useState("");
  const [partnerDob, setPartnerDob] = useState("");
  const [partnerMoolank, setPartnerMoolank] = useState<number>(1);
  const [partnerBhagyank, setPartnerBhagyank] = useState<number>(1);
  const [inputType, setInputType] = useState<"dob" | "manual">("dob");

  // App state
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [error, setError] = useState("");
  const [activePartnerId, setActivePartnerId] = useState<string | null>(null);

  // LocalStorage-backed Partner Profiles list
  const [savedPartners, setSavedPartners] = useState<PartnerProfile[]>(() => {
    try {
      const saved = localStorage.getItem("moolank_partner_profiles_v1");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem("moolank_partner_profiles_v1", JSON.stringify(savedPartners));
  }, [savedPartners]);

  // Client-side Numerology Calculations for live previews
  const clientReduceToSingleDigit = (num: number): number => {
    let current = num;
    while (current > 9) {
      current = current.toString().split('').reduce((sum, d) => sum + parseInt(d, 10), 0);
    }
    return current;
  };

  const clientCalculateMoolank = (dob: string): number => {
    if (!dob) return 1;
    const parts = dob.split('-');
    const day = parseInt(parts[2], 10);
    return clientReduceToSingleDigit(day);
  };

  const clientCalculateBhagyank = (dob: string): number => {
    if (!dob) return 1;
    const cleanStr = dob.replace(/-/g, '');
    let sum = 0;
    for (let i = 0; i < cleanStr.length; i++) {
      const digit = parseInt(cleanStr[i], 10);
      if (!isNaN(digit)) {
        sum += digit;
      }
    }
    return clientReduceToSingleDigit(sum);
  };

  // Live calculation values for UI feedback
  const liveMoolank = useMemo(() => {
    if (inputType === "dob" && partnerDob) {
      return clientCalculateMoolank(partnerDob);
    }
    return partnerMoolank;
  }, [inputType, partnerDob, partnerMoolank]);

  const liveBhagyank = useMemo(() => {
    if (inputType === "dob" && partnerDob) {
      return clientCalculateBhagyank(partnerDob);
    }
    return partnerBhagyank;
  }, [inputType, partnerDob, partnerBhagyank]);

  // Recharts synergy mapping
  const synergyData = useMemo(() => {
    if (!result) return [];
    return [
      { subject: isHinglish ? "Baudhik Milan" : "Intellectual Conn.", score: Math.round(55 + (result.friendshipScore * 0.35)) },
      { subject: isHinglish ? "Bhavnatmak" : "Emotional Resonance", score: Math.round(50 + (result.loveScore * 0.45)) },
      { subject: isHinglish ? "Sanyam & Trust" : "Long-Term Trust", score: Math.round(60 + (result.loveScore * 0.3)) },
      { subject: isHinglish ? "Pragati Synergy" : "Growth Synergy", score: Math.round(45 + (result.businessScore * 0.45)) },
      { subject: isHinglish ? "Mulya Alignment" : "Values Alignment", score: Math.round(50 + (result.friendshipScore * 0.4)) }
    ];
  }, [result, isHinglish]);

  // API Calculator Trigger
  const calculateCompatibilityForProfile = async (partner: PartnerProfile) => {
    setError("");
    setLoading(true);
    setActivePartnerId(partner.id);

    try {
      const response = await fetch("/api/moolank/compatibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name1: userName,
          moolank1: userMoolank,
          bhagyank1: userBhagyank,
          name2: partner.name,
          moolank2: partner.moolank,
          bhagyank2: partner.bhagyank,
          ...(partner.dob ? { dob2: partner.dob } : {}),
          language,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || "Failed to calculate compatibility.");
      }
    } catch (err) {
      console.error(err);
      setError(isHinglish ? "Network error. Kripya firse koshish karein." : "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle addition of partner profile
  const handleAddPartnerProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerName.trim()) {
      setError(isHinglish ? "Kripya partner ka naam likhein." : "Please enter a name for the partner.");
      return;
    }

    let calculatedMoolank = 1;
    let calculatedBhagyank = 1;

    if (inputType === "dob") {
      if (!partnerDob) {
        setError(isHinglish ? "Kripya partner ka Date of Birth select karein." : "Please select your partner's date of birth.");
        return;
      }
      calculatedMoolank = clientCalculateMoolank(partnerDob);
      calculatedBhagyank = clientCalculateBhagyank(partnerDob);
    } else {
      calculatedMoolank = Number(partnerMoolank);
      calculatedBhagyank = Number(partnerBhagyank);
    }

    const newPartner: PartnerProfile = {
      id: Date.now().toString(),
      name: partnerName.trim(),
      moolank: calculatedMoolank,
      bhagyank: calculatedBhagyank,
      ...(inputType === "dob" ? { dob: partnerDob } : {})
    };

    setSavedPartners(prev => [newPartner, ...prev]);
    calculateCompatibilityForProfile(newPartner);

    // Reset Form Input Fields (keep name / resets others)
    setPartnerName("");
    setPartnerDob("");
  };

  // Handle deletion of saved partner profile
  const handleDeletePartner = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedPartners(prev => prev.filter(p => p.id !== id));
    if (activePartnerId === id) {
      setResult(null);
      setActivePartnerId(null);
    }
  };

  return (
    <div id="compatibility-tab-wrapper" className="space-y-8">
      {/* Dynamic Header Badge showing user's own details */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/[0.02] border border-white/5 rounded-2xl p-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Compass size={18} className="animate-spin-slow" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest leading-none">
              {isHinglish ? "AAPKA COSMIC IDENTITY CODE" : "YOUR COSMIC ENERGY PROFILE"}
            </span>
            <h4 className="text-sm font-semibold text-white tracking-tight mt-1">
              {userName} <span className="text-slate-500">•</span> Moolank <span className="text-gold font-mono font-bold">{userMoolank}</span> <span className="text-slate-500">•</span> Bhagyank <span className="text-cyan-400 font-mono font-bold">{userBhagyank}</span>
            </h4>
          </div>
        </div>
        <div className="text-xs text-slate-400 font-serif italic text-right hidden sm:block">
          {isHinglish ? "Apne vibhinn sambandho ki urja ko parakhein" : "Align and check harmony with partners & friends"}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Input Forms & Saved Profiles */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Add Partner Profile Form Card */}
          <div className="bg-white/[0.02] backdrop-blur-md rounded-2xl border border-white/5 p-5 glow-purple">
            <div className="flex items-center gap-2.5 mb-3">
              <UserPlus className="text-gold" size={18} />
              <h4 className="text-sm font-serif font-semibold text-white uppercase tracking-wider">
                {isHinglish ? "Naya Partner Add Karein" : "Add Partner Profile"}
              </h4>
            </div>
            
            <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
              {isHinglish 
                ? "Dob ya direct Moolank aur Bhagyank daalkar partner ka profile save karein." 
                : "Enter birth details or manual numbers to save & compare a partner profile."}
            </p>

            {/* Input Method Toggle */}
            <div className="flex bg-white/[0.02] p-1 rounded-xl border border-white/5 font-mono text-[10px] uppercase font-bold mb-4">
              <button
                type="button"
                onClick={() => setInputType("dob")}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  inputType === "dob"
                    ? "bg-amber-500/15 text-gold border border-amber-500/10"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Calendar size={11} />
                <span>{isHinglish ? "DOB Se" : "By DOB"}</span>
              </button>
              <button
                type="button"
                onClick={() => setInputType("manual")}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  inputType === "manual"
                    ? "bg-amber-500/15 text-gold border border-amber-500/10"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Layers size={11} />
                <span>{isHinglish ? "Manual No." : "Manual Numbers"}</span>
              </button>
            </div>

            <form onSubmit={handleAddPartnerProfile} className="space-y-4">
              {/* Partner Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  {isHinglish ? "Partner ka Naam" : "Partner's Name"}
                </label>
                <input 
                  type="text" 
                  placeholder={isHinglish ? "e.g. Priyanka" : "e.g. Priyanka"} 
                  value={partnerName}
                  required
                  onChange={(e) => setPartnerName(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold transition-all"
                />
              </div>

              {/* Dynamic input field depending on type */}
              {inputType === "dob" ? (
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    {isHinglish ? "Janam Tarikh (DOB) *" : "Date of Birth *"}
                  </label>
                  <input 
                    type="date" 
                    required={inputType === "dob"}
                    value={partnerDob}
                    onChange={(e) => setPartnerDob(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold transition-all"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      Moolank
                    </label>
                    <select
                      value={partnerMoolank}
                      onChange={(e) => setPartnerMoolank(Number(e.target.value))}
                      className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold transition-all"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                        <option key={n} value={n} className="bg-neutral-950 text-white">Moolank {n}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      Bhagyank
                    </label>
                    <select
                      value={partnerBhagyank}
                      onChange={(e) => setPartnerBhagyank(Number(e.target.value))}
                      className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold transition-all"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                        <option key={n} value={n} className="bg-neutral-950 text-white">Bhagyank {n}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Dynamic numbers live preview card */}
              {(partnerDob || inputType === "manual") && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-2.5 bg-amber-500/5 border border-amber-500/10 rounded-xl flex items-center justify-between text-[11px] text-slate-300 font-mono"
                >
                  <span className="text-slate-400 uppercase tracking-widest text-[9px] font-bold">
                    {isHinglish ? "PARAKHA GAYA CODE:" : "CALCULATED CODES:"}
                  </span>
                  <div className="flex gap-2">
                    <span className="bg-neutral-950 px-2 py-0.5 rounded text-gold border border-gold/15">M: {liveMoolank}</span>
                    <span className="bg-neutral-950 px-2 py-0.5 rounded text-cyan-400 border border-cyan-400/15">B: {liveBhagyank}</span>
                  </div>
                </motion.div>
              )}

              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 active:scale-95 text-neutral-950 font-display font-black uppercase text-[10px] tracking-widest py-2.5 px-4 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Plus size={14} strokeWidth={3} />
                <span>{isHinglish ? "Add aur Match Karein" : "Add & Calculate Harmony"}</span>
              </button>
            </form>

            {error && (
              <p className="text-[10px] font-medium text-rose-400 mt-2.5 flex items-center gap-1 leading-normal">
                <ShieldAlert size={12} className="shrink-0" />
                <span>{error}</span>
              </p>
            )}
          </div>

          {/* Saved Partner Profiles List Card */}
          <div className="bg-white/[0.02] backdrop-blur-md rounded-2xl border border-white/5 p-5 glow-purple">
            <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
              <div className="flex items-center gap-2">
                <Users className="text-cyan-400" size={16} />
                <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  {isHinglish ? "Saved Partner Profiles" : "Saved Connections"}
                </h4>
              </div>
              <span className="text-[9px] font-mono font-bold bg-white/5 px-2 py-0.5 rounded text-slate-400">
                {savedPartners.length}
              </span>
            </div>

            {savedPartners.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs flex flex-col items-center justify-center space-y-1.5 font-sans">
                <Heart size={20} className="text-slate-600/60 animate-pulse mb-1" />
                <p className="font-semibold">{isHinglish ? "Koi profile saved nahi hai" : "No partner profiles saved"}</p>
                <p className="text-[10px] text-slate-600 px-3">
                  {isHinglish ? "Upar details daal kar dosto aur partner ke profile banayein." : "Enter details above to check multiple companionships."}
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                {savedPartners.map((partner) => {
                  const isActive = activePartnerId === partner.id;
                  return (
                    <div
                      key={partner.id}
                      onClick={() => calculateCompatibilityForProfile(partner)}
                      className={`p-3 rounded-xl border transition-all duration-300 cursor-pointer flex items-center justify-between group ${
                        isActive
                          ? "bg-amber-500/10 border-gold/40 shadow-md shadow-gold/5"
                          : "bg-white/[0.01] border-white/5 hover:bg-white/[0.03] hover:border-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`p-1.5 rounded-lg shrink-0 ${isActive ? "bg-gold text-neutral-950" : "bg-white/5 text-slate-400"}`}>
                          <User size={12} />
                        </div>
                        <div className="min-w-0">
                          <h5 className="text-xs font-semibold text-white truncate">{partner.name}</h5>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[9px] font-mono text-slate-400">M: <strong className="text-gold">{partner.moolank}</strong></span>
                            <span className="text-slate-700 text-[8px]">•</span>
                            <span className="text-[9px] font-mono text-slate-400">B: <strong className="text-cyan-400">{partner.bhagyank}</strong></span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            calculateCompatibilityForProfile(partner);
                          }}
                          className={`p-1.5 rounded-md hover:bg-white/5 text-slate-400 hover:text-gold transition-colors ${
                            isActive && loading ? "animate-spin text-gold" : ""
                          }`}
                          title="Recalculate Synergy"
                        >
                          <RefreshCw size={11} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDeletePartner(partner.id, e)}
                          className="p-1.5 rounded-md hover:bg-rose-500/15 text-slate-500 hover:text-rose-400 transition-colors"
                          title="Delete Profile"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: Compatibility Synergy Dashboard */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div 
                key="result-block"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                {/* Fallback mode message banner */}
                {result.isFallback && (
                  <div id="fallback-compatibility-alert" className="bg-amber-500/5 border border-amber-500/25 rounded-2xl p-4 flex gap-3 items-start shadow-md relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-500/60" />
                    <AlertTriangle className="text-gold shrink-0 mt-0.5" size={16} />
                    <div className="space-y-0.5">
                      <h5 className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">Vedic Compatibility Database Active</h5>
                      <p className="text-[11px] text-slate-300 leading-normal font-sans">
                        The relationship resonance matcher is operating in offline-compatibility mode due to AI rate limits. We calculated your score dynamically using Vedic astrological matrices matching both birth planets.
                      </p>
                    </div>
                  </div>
                )}

                {/* Sub-grid of scores on top & Analysis on bottom */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                  {/* Gauge Card */}
                  <div className="xl:col-span-4 bg-white/[0.02] backdrop-blur-md rounded-2xl border border-white/5 p-5 flex flex-col justify-between space-y-6 glow-purple">
                    <h4 className="text-[11px] font-serif font-light italic text-slate-400 uppercase tracking-widest text-center">
                      {isHinglish ? "SYNERGY RATING" : "COMPATIBILITY SCORES"}
                    </h4>
                    
                    <div className="grid grid-cols-3 gap-2 xl:flex xl:flex-col xl:space-y-5 xl:items-center">
                      {/* Love Gauge */}
                      <div className="flex flex-col items-center">
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="40" cy="40" r="34" className="text-white/5" strokeWidth="6" stroke="currentColor" fill="transparent" />
                            <motion.circle 
                              cx="40" 
                              cy="40" 
                              r="34" 
                              className="text-pink-500" 
                              strokeWidth="6" 
                              strokeDasharray={2 * Math.PI * 34} 
                              initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
                              animate={{ strokeDashoffset: 2 * Math.PI * 34 * (1 - result.loveScore / 100) }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                              strokeLinecap="round" 
                              stroke="currentColor" 
                              fill="transparent" 
                            />
                          </svg>
                          <div className="absolute flex flex-col items-center">
                            <Heart size={12} className="text-pink-500 fill-pink-500/20" />
                            <span className="text-xs sm:text-sm font-mono font-bold text-white">{result.loveScore}%</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-display text-slate-400 font-medium mt-1">{isHinglish ? "Prem Milan" : "Love Affinity"}</span>
                      </div>

                      {/* Friendship Gauge */}
                      <div className="flex flex-col items-center">
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="40" cy="40" r="34" className="text-white/5" strokeWidth="6" stroke="currentColor" fill="transparent" />
                            <motion.circle 
                              cx="40" 
                              cy="40" 
                              r="34" 
                              className="text-amber-500" 
                              strokeWidth="6" 
                              strokeDasharray={2 * Math.PI * 34} 
                              initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
                              animate={{ strokeDashoffset: 2 * Math.PI * 34 * (1 - result.friendshipScore / 100) }}
                              transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                              strokeLinecap="round" 
                              stroke="currentColor" 
                              fill="transparent" 
                            />
                          </svg>
                          <div className="absolute flex flex-col items-center">
                            <Users size={12} className="text-amber-500" />
                            <span className="text-xs sm:text-sm font-mono font-bold text-white">{result.friendshipScore}%</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-display text-slate-400 font-medium mt-1">{isHinglish ? "Dosti / Sahyog" : "Friendship"}</span>
                      </div>

                      {/* Business Gauge */}
                      <div className="flex flex-col items-center">
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="40" cy="40" r="34" className="text-white/5" strokeWidth="6" stroke="currentColor" fill="transparent" />
                            <motion.circle 
                              cx="40" 
                              cy="40" 
                              r="34" 
                              className="text-cyan-500" 
                              strokeWidth="6" 
                              strokeDasharray={2 * Math.PI * 34} 
                              initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
                              animate={{ strokeDashoffset: 2 * Math.PI * 34 * (1 - result.businessScore / 100) }}
                              transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
                              strokeLinecap="round" 
                              stroke="currentColor" 
                              fill="transparent" 
                            />
                          </svg>
                          <div className="absolute flex flex-col items-center">
                            <Briefcase size={12} className="text-cyan-500" />
                            <span className="text-xs sm:text-sm font-mono font-bold text-white">{result.businessScore}%</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-display text-slate-400 font-medium mt-1">{isHinglish ? "Vyapaar Compatibility" : "Business/Work"}</span>
                      </div>
                    </div>

                    <div className="text-center p-2.5 bg-white/[0.03] border border-white/5 rounded-xl text-[11px] font-mono">
                      <span className="text-slate-400">{isHinglish ? "Moolank: " : "Partner Moolank: "}</span>
                      <strong className="text-gold">{result.person2.moolank}</strong>
                      <span className="text-slate-600 mx-1">•</span>
                      <span className="text-slate-400">B: </span>
                      <strong className="text-cyan-400">{result.person2.bhagyank}</strong>
                    </div>
                  </div>

                  {/* Analysis Card */}
                  <div className="xl:col-span-8 bg-white/[0.02] backdrop-blur-md rounded-2xl border border-white/5 p-5 space-y-5 glow-purple">
                    <div>
                      <span className="text-[9px] bg-white/5 border border-gold/20 text-gold px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider font-mono">
                        {isHinglish ? "Chaldean Astrology Alignment" : "Celestial Integration"}
                      </span>
                      <h4 className="text-base font-serif font-semibold text-white mt-2 mb-2">
                        {isHinglish ? "Sambandh Synergy Vishleshan" : "Relationship Synergy Analysis"}
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">{result.summary}</p>
                    </div>

                    {/* Radar chart of dynamics */}
                    <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl space-y-2">
                      <span className="text-[10px] text-gold uppercase tracking-widest font-mono font-bold block">
                        {isHinglish ? "Grahic Milan Map" : "Synergy Dynamics Map"}
                      </span>
                      <div className="h-[180px] w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={synergyData}>
                            <PolarGrid stroke="#ffffff10" />
                            <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={9} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#ffffff20" fontSize={8} />
                            <Radar
                              name="Synergy"
                              dataKey="score"
                              stroke="#ec4899"
                              fill="#ec4899"
                              fillOpacity={0.15}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#0a0a0a",
                                border: "1px solid rgba(236, 72, 153, 0.25)",
                                borderRadius: "12px",
                                color: "#fff",
                                fontSize: "10px",
                              }}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Strengths & Weaknesses */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-emerald-950/[0.04] border border-emerald-500/10 rounded-xl p-3.5 space-y-1.5">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle2 size={12} /> {isHinglish ? "Upyogi Shaktiyaan" : "Mutual Strengths"}
                        </span>
                        <ul className="text-[11px] text-slate-300 space-y-1 pl-1">
                          {result.mutualStrengths?.map((str, i) => (
                            <li key={i} className="leading-relaxed flex items-start gap-1">
                              <span className="text-emerald-400 shrink-0 select-none">•</span>
                              <span>{str}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-rose-950/[0.04] border border-rose-500/10 rounded-xl p-3.5 space-y-1.5">
                        <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                          <ShieldAlert size={12} /> {isHinglish ? "Asurakshatmak Chunautiyan" : "Mutual Challenges"}
                        </span>
                        <ul className="text-[11px] text-slate-300 space-y-1 pl-1">
                          {result.mutualChallenges?.map((ch, i) => (
                            <li key={i} className="leading-relaxed flex items-start gap-1">
                              <span className="text-rose-400 shrink-0 select-none">•</span>
                              <span>{ch}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Advice */}
                    <div className="bg-white/[0.03] border border-gold/15 rounded-xl p-3.5 space-y-1.5">
                      <span className="text-[10px] font-bold text-gold uppercase tracking-wider flex items-center gap-1">
                        <Sparkles size={12} /> {isHinglish ? "Harmonizing Margdarshan" : "Cosmic Harmonizing Advice"}
                      </span>
                      <p className="text-[11px] text-slate-300 leading-relaxed italic">{result.cosmicAdvice}</p>
                    </div>

                  </div>
                </div>

              </motion.div>
            ) : (
              <motion.div 
                key="placeholder-block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white/[0.02] border border-white/5 rounded-2xl p-10 flex flex-col items-center justify-center text-center space-y-5 min-h-[450px]"
              >
                <div className="w-20 h-20 rounded-full bg-pink-500/5 border border-pink-500/15 flex items-center justify-center relative">
                  <motion.div 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full bg-pink-500/5 blur-md"
                  />
                  <Heart size={32} className="text-pink-500 fill-pink-500/10 animate-pulse" />
                </div>
                
                <div className="max-w-md space-y-2">
                  <h4 className="text-lg font-serif font-semibold text-white">
                    {isHinglish ? "Cosmic Harmony Matcher Sakriya Karein" : "Cosmic Compatibility Matrix"}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {isHinglish 
                      ? "Apne kisi dost, jeevansathi, ya vyapaari partner ke details left pane me add karke dosti aur prem ka shubh sanket rating check karein."
                      : "Add a partner profile on the left by date of birth or direct numbers, then click their card to compute love, friendship, and business harmony indexes."}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-slate-500 bg-white/5 border border-white/5 px-4 py-1.5 rounded-full uppercase tracking-wider">
                  <span>{isHinglish ? "Waiting For Profile" : "Waiting for companion profile selection"}</span>
                  <ArrowRight size={12} className="animate-bounce" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
