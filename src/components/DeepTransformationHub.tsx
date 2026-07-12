import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  AreaChart,
  Area,
  CartesianGrid
} from "recharts";
import { 
  getTransformationProfile, 
  FullMoolankProfile 
} from "../data/transformationData";
import { 
  User, 
  Award, 
  HeartPulse, 
  Flame, 
  Calendar,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  Dumbbell,
  Compass,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  Compass as CompassIcon,
  Info
} from "lucide-react";
import { convertToHinglish } from "../utils/hinglish";

interface DeepTransformationHubProps {
  moolank: number;
  bhagyank: number;
  namank: number;
  name: string;
  language?: string;
}

export default function DeepTransformationHub({ moolank, bhagyank, namank, name, language }: DeepTransformationHubProps) {
  const profile = useMemo(() => {
    const raw = getTransformationProfile(moolank);
    if (language !== "hinglish") return raw;

    const translateDeep = (obj: any): any => {
      if (typeof obj === "string") {
        return convertToHinglish(obj);
      }
      if (Array.isArray(obj)) {
        return obj.map(item => translateDeep(item));
      }
      if (obj && typeof obj === "object") {
        const result: any = {};
        for (const key of Object.keys(obj)) {
          result[key] = translateDeep(obj[key]);
        }
        return result;
      }
      return obj;
    };

    return translateDeep(raw) as FullMoolankProfile;
  }, [moolank, language]);

  const [activeTab, setActiveTab] = useState<"identity" | "strengths" | "health" | "spiritual" | "roadmap">("identity");

  const resonanceData = useMemo(() => {
    // Deterministic custom scores based on their actual numerology coordinates
    const prana = 65 + ((moolank * 7) % 31);
    const gyaan = 70 + ((namank * 5) % 26);
    const artha = 60 + ((bhagyank * 8) % 36);
    const bhakti = 65 + (((moolank + bhagyank) * 4) % 31);
    const karma = 55 + ((moolank * 9) % 41);
    const dharma = 70 + ((bhagyank * 6) % 26);

    return [
      { name: "Prana (Vitality)", value: prana, fullMark: 100 },
      { name: "Gyaan (Wisdom)", value: gyaan, fullMark: 100 },
      { name: "Artha (Abundance)", value: artha, fullMark: 100 },
      { name: "Bhakti (Empathy)", value: bhakti, fullMark: 100 },
      { name: "Karma (Execution)", value: karma, fullMark: 100 },
      { name: "Dharma (Purpose)", value: dharma, fullMark: 100 },
    ];
  }, [moolank, bhagyank, namank]);

  const weightData = useMemo(() => {
    return [
      { name: "Moolank (Root)", value: 15, actualNum: moolank, desc: "Immediate Persona", color: "#fbbf24" },
      { name: "Bhagyank (Destiny)", value: 45, actualNum: bhagyank, desc: "Soul Mission", color: "#22d3ee" },
      { name: "Namank (Name)", value: 40, actualNum: namank, desc: "Social Expression", color: "#34d399" },
    ];
  }, [moolank, bhagyank, namank]);

  const circadianData = useMemo(() => {
    const baseHourLevels: Record<number, number[]> = {
      1: [35, 85, 95, 75, 45, 15], // Solar Peak at noon
      2: [45, 70, 60, 80, 85, 20], // Reflective Moon peaks morning & evening
      3: [40, 80, 85, 80, 65, 20], // Wise, steady growth
      4: [30, 60, 90, 70, 75, 15], // Analytical spikes
      5: [35, 90, 75, 95, 65, 10], // Multi-peak mental agility
      6: [40, 75, 80, 90, 80, 25], // Aesthetic, harmonious evening peak
      7: [65, 55, 65, 70, 85, 30], // Deep introspective morning & night peaks
      8: [25, 50, 75, 90, 65, 15], // Slow-building afternoon stamina
      9: [55, 95, 80, 85, 50, 10], // Massive physical morning drive
    };
    
    const levels = baseHourLevels[moolank] || baseHourLevels[1];
    return [
      { time: "04:00", name: "Brahmamuhurta", level: levels[0], desc: "Spiritual Gate / Mantra Sadhana" },
      { time: "08:00", name: "Solar Rise", level: levels[1], desc: "Prana Activation & Hydration" },
      { time: "12:00", name: "Zenith Focus", level: levels[2], desc: "Peak Execution & Healthy Lunch" },
      { time: "16:00", name: "Resilience Drive", level: levels[3], desc: "Secondary Action / Mindful Break" },
      { time: "20:00", name: "Dusk Quietude", level: levels[4], desc: "Digital Detox & Evening Rejuvenation" },
      { time: "23:00", name: "Lunar Repair", level: levels[5], desc: "Deep Ojas Recharging Sleep" },
    ];
  }, [moolank]);

  const tabItems = [
    { id: "identity" as const, label: "Identity & Soul", icon: User },
    { id: "strengths" as const, label: "Strengths & Talents", icon: Star },
    { id: "health" as const, label: "Lifestyle & Routines", icon: HeartPulse },
    { id: "spiritual" as const, label: "Spiritual Remedies", icon: Flame },
    { id: "roadmap" as const, label: "Evolution Roadmap", icon: Calendar }
  ];

  return (
    <div id="deep-transformation-hub" className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 md:p-8 space-y-8 backdrop-blur-md glow-purple">
      {/* Header section */}
      <div className="text-center md:text-left space-y-2 border-b border-white/5 pb-6">
        <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/25 text-gold px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
          <Sparkles size={12} className="animate-pulse" />
          <span>Life Transformation Engine</span>
        </div>
        <h3 className="text-2xl md:text-3xl font-serif font-light text-white tracking-tight">
          Your Personalized <span className="text-gold italic font-medium">Evolution Blueprint</span>
        </h3>
        <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
          This comprehensive blueprint decodes why you are wired this way, what your hidden assets are, and maps an actionable pathway to transform your career, money, health, and relationships.
        </p>
      </div>

      {/* Internal Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-white/5 pb-3 scrollbar-none relative">
        {tabItems.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-display text-xs font-semibold whitespace-nowrap transition-all duration-300 cursor-pointer ${
                isActive
                  ? "text-gold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="active-hub-tab"
                  className="absolute inset-0 bg-amber-500/15 border border-amber-500/30 rounded-xl"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Icon size={14} className="relative z-10" />
              <span className="relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="min-h-[300px]">
        <AnimatePresence mode="wait">
          {activeTab === "identity" && (
            <motion.div
              key="identity"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="space-y-6">
                <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4">
                  <h4 className="text-sm font-serif font-bold text-gold tracking-wider uppercase flex items-center gap-2">
                    <Compass size={16} /> Cosmic Soul Architecture
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl">
                      <span className="text-slate-500 block uppercase font-mono text-[9px] font-semibold">Dominant Planet</span>
                      <span className="text-white font-semibold mt-1 block">{profile.identity.dominantPlanet}</span>
                    </div>
                    <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl">
                      <span className="text-slate-500 block uppercase font-mono text-[9px] font-semibold">Dominant Element</span>
                      <span className="text-white font-semibold mt-1 block">{profile.identity.dominantElement}</span>
                    </div>
                    <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl col-span-2">
                      <span className="text-slate-500 block uppercase font-mono text-[9px] font-semibold">Energy Vibration Type</span>
                      <span className="text-cyan-400 font-bold mt-1 block">{profile.identity.energyType}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3.5">
                  <h4 className="text-sm font-serif font-bold text-white tracking-wider uppercase flex items-center gap-2">
                    <CompassIcon size={16} className="text-gold" /> Behavioral Blueprints
                  </h4>
                  <div className="space-y-3 text-xs leading-relaxed">
                    <div>
                      <span className="text-gold font-bold block mb-0.5">Leadership Style</span>
                      <p className="text-slate-300">{profile.identity.leadershipStyle}</p>
                    </div>
                    <div>
                      <span className="text-gold font-bold block mb-0.5">Communication Style</span>
                      <p className="text-slate-300">{profile.identity.communicationStyle}</p>
                    </div>
                    <div>
                      <span className="text-gold font-bold block mb-0.5">Thinking Pattern</span>
                      <p className="text-slate-300">{profile.identity.thinkingPattern}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3.5">
                  <h4 className="text-sm font-serif font-bold text-white tracking-wider uppercase flex items-center gap-2">
                    <Award size={16} className="text-gold" /> Learning & Decision Style
                  </h4>
                  <div className="space-y-3 text-xs leading-relaxed">
                    <div>
                      <span className="text-cyan-400 font-bold block mb-0.5">Learning Style</span>
                      <p className="text-slate-300">{profile.identity.learningStyle}</p>
                    </div>
                    <div>
                      <span className="text-cyan-400 font-bold block mb-0.5">Emotional Nature</span>
                      <p className="text-slate-300">{profile.identity.emotionalNature}</p>
                    </div>
                    <div>
                      <span className="text-cyan-400 font-bold block mb-0.5">Decision Making Style</span>
                      <p className="text-slate-300">{profile.identity.decisionMakingStyle}</p>
                    </div>
                    <div>
                      <span className="text-cyan-400 font-bold block mb-0.5">Spiritual Nature</span>
                      <p className="text-slate-300">{profile.identity.spiritualNature}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "strengths" && (
            <motion.div
              key="strengths"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              {/* COSMIC RESONANCE & DESTINY WEIGHTS CHARTS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* 1. Life Energy Resonance Radar Chart */}
                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col justify-between space-y-4 glow-purple">
                  <div>
                    <h4 className="text-sm font-serif font-bold text-gold tracking-wider uppercase flex items-center gap-2">
                      <Sparkles size={16} /> Cosmic Energy Resonance
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                      Vedic energy metrics mapping your current cosmic life force indices across key worldly and spiritual spheres.
                    </p>
                  </div>
                  
                  <div className="h-[260px] w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="75%" data={resonanceData}>
                        <PolarGrid stroke="#ffffff10" />
                        <PolarAngleAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#ffffff20" fontSize={8} />
                        <Radar
                          name="Resonance Score"
                          dataKey="value"
                          stroke="#d4af37"
                          fill="#d4af37"
                          fillOpacity={0.2}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#0a0a0a",
                            border: "1px solid rgba(212, 175, 55, 0.2)",
                            borderRadius: "12px",
                            color: "#fff",
                            fontSize: "11px",
                          }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 2. Core Trinity Destiny Weights Infographic Chart */}
                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col justify-between space-y-4 glow-purple">
                  <div>
                    <h4 className="text-sm font-serif font-bold text-white tracking-wider uppercase flex items-center gap-2">
                      <Compass size={16} className="text-gold" /> Destiny Weights Infographic
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                      How your Core Trinity coordinates (Moolank, Bhagyank, and Namank) combine to forge your life's destiny spectrum.
                    </p>
                  </div>

                  <div className="h-[180px] w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart layout="vertical" data={weightData} margin={{ left: 10, right: 30, top: 10, bottom: 10 }}>
                        <XAxis type="number" domain={[0, 50]} hide />
                        <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={10} width={110} tickLine={false} axisLine={false} />
                        <Tooltip
                          cursor={{ fill: "rgba(255,255,255,0.02)" }}
                          contentStyle={{
                            backgroundColor: "#0a0a0a",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "12px",
                            color: "#fff",
                            fontSize: "11px"
                          }}
                          formatter={(value) => [`${value}% Contribution`, `Weight`] }
                        />
                        <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={16}>
                          {weightData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center border-t border-white/5 pt-4">
                    {weightData.map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <span className="text-[10px] text-slate-500 block uppercase font-mono font-bold leading-none">{item.name.split(" ")[0]}</span>
                        <span className="text-lg font-mono font-bold block" style={{ color: item.color }}>#{item.actualNum}</span>
                        <span className="text-[9px] text-slate-400 block leading-tight">{item.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Strengths & Gifts lists (at least 15 strengths!) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 bg-emerald-950/[0.03] border border-emerald-500/10 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-emerald-500/10 pb-2.5">
                    <CheckCircle2 size={14} /> 15 Core Strengths
                  </h4>
                  <ul className="space-y-2.5 max-h-[350px] overflow-y-auto scrollbar-none pr-1">
                    {profile.strengthsProfile.strengths.map((str, i) => (
                      <motion.li 
                        key={i} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: Math.min(i * 0.04, 0.6), type: "spring", stiffness: 100, damping: 15 }}
                        whileHover={{ x: 4, transition: { duration: 0.2 } }}
                        className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed font-sans cursor-default group"
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 group-hover:scale-125 transition-transform" />
                        <span className="group-hover:text-white transition-colors">{str}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 bg-amber-950/[0.03] border border-gold/10 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold text-gold uppercase tracking-widest flex items-center gap-1.5 border-b border-gold/10 pb-2.5">
                    <Star size={14} fill="currentColor" /> 15 Hidden Talents
                  </h4>
                  <ul className="space-y-2.5 max-h-[350px] overflow-y-auto scrollbar-none pr-1">
                    {profile.strengthsProfile.hiddenTalents.map((str, i) => (
                      <motion.li 
                        key={i} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: Math.min(i * 0.04, 0.6), type: "spring", stiffness: 100, damping: 15 }}
                        whileHover={{ x: 4, transition: { duration: 0.2 } }}
                        className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed font-sans cursor-default group"
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold shrink-0 group-hover:scale-125 transition-transform" />
                        <span className="group-hover:text-white transition-colors">{str}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 bg-cyan-950/[0.03] border border-cyan-500/10 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-cyan-500/10 pb-2.5">
                    <Sparkles size={14} /> 15 Natural Gifts
                  </h4>
                  <ul className="space-y-2.5 max-h-[350px] overflow-y-auto scrollbar-none pr-1">
                    {profile.strengthsProfile.naturalGifts.map((str, i) => (
                      <motion.li 
                        key={i} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: Math.min(i * 0.04, 0.6), type: "spring", stiffness: 100, damping: 15 }}
                        whileHover={{ x: 4, transition: { duration: 0.2 } }}
                        className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed font-sans cursor-default group"
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 group-hover:scale-125 transition-transform" />
                        <span className="group-hover:text-white transition-colors">{str}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Shadow Elements & Weaknesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white/5 pt-6">
                <div className="p-5 bg-rose-950/[0.03] border border-rose-500/10 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold text-rose-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-rose-500/10 pb-2.5">
                    <ShieldAlert size={14} /> Shadow Archetypes & Weaknesses
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {profile.weaknessesProfile.weaknesses.map((str, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 bg-orange-950/[0.03] border border-orange-500/10 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold text-orange-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-orange-500/10 pb-2.5">
                    <XCircle size={14} /> Triggers & Self-Sabotaging Habits
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] text-orange-400 block font-bold uppercase mb-1.5 tracking-wider">Emotional Triggers</span>
                      <ul className="space-y-1 text-xs text-slate-300">
                        {profile.weaknessesProfile.emotionalTriggers.map((t, i) => (
                          <li key={i}>• {t}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-[10px] text-orange-400 block font-bold uppercase mb-1.5 tracking-wider">Self-Sabotaging Habits</span>
                      <ul className="space-y-1 text-xs text-slate-300">
                        {profile.weaknessesProfile.selfSabotagingHabits.map((h, i) => (
                          <li key={i}>• {h}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "health" && (
            <motion.div
              key="health"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Routines Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4">
                  <h4 className="text-sm font-serif font-bold text-gold tracking-wider uppercase flex items-center gap-2 border-b border-white/5 pb-2">
                    <Clock size={16} /> Daily Lifestyle Recommendation
                  </h4>
                  <div className="space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl">
                        <span className="text-slate-500 block uppercase font-mono text-[9px] font-semibold">Ideal Wake-up</span>
                        <span className="text-white font-bold mt-1 block">{profile.healthProfile.idealWakeUpTime}</span>
                      </div>
                      <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl">
                        <span className="text-slate-500 block uppercase font-mono text-[9px] font-semibold">Ideal Sleep</span>
                        <span className="text-white font-bold mt-1 block">{profile.healthProfile.idealSleepTime}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-gold font-bold block mb-1">Morning Routine</span>
                      <p className="text-slate-300 leading-relaxed">{profile.healthProfile.morningRoutine}</p>
                    </div>
                    <div>
                      <span className="text-gold font-bold block mb-1">Night Routine</span>
                      <p className="text-slate-300 leading-relaxed">{profile.healthProfile.nightRoutine}</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4">
                  <h4 className="text-sm font-serif font-bold text-white tracking-wider uppercase flex items-center gap-2 border-b border-white/5 pb-2">
                    <Dumbbell size={16} className="text-gold" /> Body & Mind Vitality
                  </h4>
                  <div className="space-y-3.5 text-xs">
                    <div>
                      <span className="text-cyan-400 font-bold block mb-1">Somatic Movement & Yoga</span>
                      <p className="text-slate-300">Asanas: {profile.healthProfile.yogaPoses.join(", ")}</p>
                    </div>
                    <div>
                      <span className="text-cyan-400 font-bold block mb-1">Pranayama (Breathwork)</span>
                      <p className="text-slate-300">Technique: {profile.healthProfile.pranayama.join(", ")}</p>
                    </div>
                    <div>
                      <span className="text-cyan-400 font-bold block mb-1">Dietary Code</span>
                      <p className="text-slate-300 leading-relaxed">{profile.healthProfile.dietAdvice}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <span className="text-slate-500 block font-semibold text-[9px]">WATER TARGET</span>
                        <span className="text-white font-bold block">{profile.healthProfile.waterIntake}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block font-semibold text-[9px]">DIGITAL DETOX</span>
                        <span className="text-white font-bold block">{profile.healthProfile.digitalDetox}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Circadian Prana Wave Infographic */}
              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-6 glow-purple">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
                  <div>
                    <h4 className="text-sm font-serif font-bold text-gold tracking-wider uppercase flex items-center gap-2">
                      <Sparkles size={16} className="text-gold animate-pulse" /> Ideal Circadian Prana Wave
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">
                      Your personalized, cosmic daily energy wave based on Moolank #{moolank}. Sync your activities with these peaks to maximize vitality (Ojas) and spiritual focus.
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                      <span className="text-slate-400 font-semibold">Active Prana Peak</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span className="text-slate-400 font-semibold">Sadhana & Renewal</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                  {/* Recharts Area Chart */}
                  <div className="lg:col-span-2 h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={circadianData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorPrana" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#d4af37" stopOpacity={0.05} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.03)" vertical={false} />
                        <XAxis 
                          dataKey="time" 
                          stroke="#64748b" 
                          fontSize={10} 
                          fontFamily="monospace"
                          tickLine={false}
                        />
                        <YAxis 
                          stroke="#64748b" 
                          fontSize={10} 
                          fontFamily="monospace"
                          tickLine={false}
                          domain={[0, 100]}
                          tickCount={5}
                          width={25}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#0a0a0a",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            borderRadius: "12px",
                            color: "#fff",
                            fontFamily: "sans-serif",
                            fontSize: "11px"
                          }}
                        />
                        <Area 
                          type="monotone" 
                          name="Prana Level"
                          dataKey="level" 
                          stroke="#22d3ee" 
                          strokeWidth={2.5}
                          fillOpacity={1} 
                          fill="url(#colorPrana)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Descriptions of the phases */}
                  <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1 scrollbar-none">
                    {circadianData.map((phase, idx) => (
                      <div key={idx} className="p-3 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 rounded-xl transition-all duration-300">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-cyan-400 font-mono text-[10px] font-bold">{phase.time} - {phase.name}</span>
                          <span className="text-gold font-mono text-[10px] font-semibold">{phase.level}% Prana</span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-1 leading-normal">{phase.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "spiritual" && (
            <motion.div
              key="spiritual"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4">
                <h4 className="text-sm font-serif font-bold text-gold tracking-wider uppercase flex items-center gap-2 border-b border-white/5 pb-2">
                  <Flame size={16} /> Remedial & Vibrational Practices
                </h4>
                <div className="space-y-4 text-xs">
                  <div className="p-3 bg-amber-500/5 border border-gold/15 rounded-xl space-y-1">
                    <span className="text-gold font-mono text-[9px] block uppercase font-bold">Daily Sound Mandala (Mantra)</span>
                    <p className="text-white font-semibold italic text-xs">"{profile.spiritualProfile.dailyMantra}"</p>
                  </div>
                  <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl space-y-1">
                    <span className="text-cyan-400 font-mono text-[9px] block uppercase font-bold">Weekly Karma Healing Mantra</span>
                    <p className="text-slate-300 italic text-xs">"{profile.spiritualProfile.weeklyMantra}"</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-500 block text-[9px] font-semibold">PLANETARY DEITY</span>
                      <span className="text-white font-bold">{profile.spiritualProfile.planetaryDeity}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px] font-semibold">RUDRAKSHA TYPE</span>
                      <span className="text-white font-bold">{profile.spiritualProfile.rudraksha}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px] font-semibold">GEMSTONE</span>
                      <span className="text-white font-bold">{profile.spiritualProfile.gemstone}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px] font-semibold">FASTING REMEDY</span>
                      <span className="text-white font-bold">{profile.spiritualProfile.fastingDay}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4">
                <h4 className="text-sm font-serif font-bold text-white tracking-wider uppercase flex items-center gap-2 border-b border-white/5 pb-2">
                  <Sparkles size={16} className="text-gold" /> Daily Inner Alchemies
                </h4>
                <div className="space-y-3.5 text-xs leading-relaxed">
                  <div>
                    <span className="text-gold font-bold block mb-1">Divine Charity & Service (Seva)</span>
                    <p className="text-slate-300">{profile.spiritualProfile.charityAndDonation}</p>
                  </div>
                  <div>
                    <span className="text-cyan-400 font-bold block mb-1">Journal Reflection Prompt</span>
                    <p className="text-slate-300">"{profile.spiritualProfile.journalingPrompt}"</p>
                  </div>
                  <div>
                    <span className="text-cyan-400 font-bold block mb-1">Visualization Mandala</span>
                    <p className="text-slate-300">{profile.spiritualProfile.visualizationExercise}</p>
                  </div>
                  <div className="border-t border-white/5 pt-3.5">
                    <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider mb-1.5">Vibrational Affirmations</span>
                    <ul className="space-y-1">
                      {profile.spiritualProfile.affirmations.map((aff, idx) => (
                        <li key={idx} className="text-xs text-gold/90 font-medium">✨ "{aff}"</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "roadmap" && (
            <motion.div
              key="roadmap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 7-Day Plan */}
                <div className="p-5 bg-neutral-950/40 border border-white/5 rounded-2xl space-y-3">
                  <span className="text-xs font-bold text-gold uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Sparkles size={14} fill="currentColor" /> 7-Day Fast-Track Transformation
                  </span>
                  <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1 scrollbar-none">
                    {profile.roadmap.sevenDayPlan.map((day, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05, type: "spring", stiffness: 100, damping: 15 }}
                        whileHover={{ x: 3 }}
                        className="flex gap-2.5 items-start text-xs text-slate-300 leading-relaxed font-sans border-b border-white/[0.02] pb-2 last:border-0 cursor-default"
                      >
                        <ChevronRight size={12} className="text-gold shrink-0 mt-0.5" />
                        <span>{day}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* 21-Day Habit Deepener */}
                <div className="p-5 bg-neutral-950/40 border border-white/5 rounded-2xl space-y-3">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> 21-Day Neural Rewiring Routine
                  </span>
                  <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
                    {profile.roadmap.twentyOneDayPlan.map((phase, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1, type: "spring", stiffness: 100, damping: 15 }}
                        whileHover={{ y: -2 }}
                        className="p-2.5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-cyan-500/20 border border-white/5 rounded-xl space-y-1 transition-all duration-300 cursor-default"
                      >
                        <span className="text-cyan-400 font-bold block uppercase text-[9px] tracking-wider">PHASE {i + 1}</span>
                        <p>{phase}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* 41-Day and 90-Day Plans */}
                <div className="p-5 bg-neutral-950/40 border border-white/5 rounded-2xl space-y-3">
                  <span className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Clock size={14} className="text-gold" /> 41-Day & 90-Day Master Cycles
                  </span>
                  <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      whileHover={{ x: 2 }}
                    >
                      <span className="text-gold font-bold block uppercase text-[9px] mb-1">41-Day Vedic Sadhana Cycle</span>
                      <p>{profile.roadmap.fortyOneDayPlan.join(" ")}</p>
                    </motion.div>
                    <motion.div 
                      className="border-t border-white/5 pt-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      whileHover={{ x: 2 }}
                    >
                      <span className="text-gold font-bold block uppercase text-[9px] mb-1">90-Day Mind-Body Awakening</span>
                      <p>{profile.roadmap.ninetyDayPlan.join(" ")}</p>
                    </motion.div>
                  </div>
                </div>

                {/* 1-Year Personal Evolution Roadmap */}
                <div className="p-5 bg-neutral-950/40 border border-white/5 rounded-2xl space-y-3">
                  <span className="text-xs font-bold text-gold uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <CompassIcon size={14} /> 1-Year Personal Evolution Roadmap
                  </span>
                  <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                    {profile.roadmap.oneYearRoadmap.map((quarter, i) => (
                      <div key={i} className="flex gap-2 items-start">
                        <span className="text-gold font-bold shrink-0 font-mono">Q{i + 1}:</span>
                        <p>{quarter}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
