import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Flame, 
  Brain, 
  Activity, 
  Heart, 
  TrendingUp, 
  Clock, 
  Compass, 
  Info, 
  HelpCircle,
  Zap,
  Leaf,
  Moon,
  Sun
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from "recharts";

interface VedicBiorhythmsTabProps {
  moolank: number;
  bhagyank: number;
  dob: string;
  name: string;
  language: string;
}

export default function VedicBiorhythmsTab({ moolank, bhagyank, dob, name, language }: VedicBiorhythmsTabProps) {
  const [selectedBiorhythm, setSelectedBiorhythm] = useState<"all" | "prana" | "medha" | "bhava" | "ojas">("all");
  const [activeTabSection, setActiveTabSection] = useState<"biorhythms" | "gunas">("biorhythms");

  const isHinglish = language === "hinglish";

  // Parse DOB parameters
  const birthParams = useMemo(() => {
    const parts = dob.split("-");
    const year = parseInt(parts[0]) || 1995;
    const month = parseInt(parts[1]) || 11;
    const day = parseInt(parts[2]) || 23;
    return { year, month, day };
  }, [dob]);

  // 1. Calculate 7-day Cosmic Bio-rhythms (Prana, Medha, Bhava, Ojas)
  const biorhythmForecast = useMemo(() => {
    const today = new Date();
    const daysList = [];
    const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dateStr = d.toISOString().split("T")[0];
      const label = `${weekdayNames[d.getDay()]} ${d.getDate()}`;

      // Personalize periods using Vedic numbers
      // 23 days for Physical (Prana)
      // 33 days for Intellectual (Medha)
      // 28 days for Emotional (Bhava)
      // 38 days for Intuitional/Ojas
      const tPrana = (d.getTime() / (1000 * 60 * 60 * 24) + birthParams.day * 3 + moolank) % 23;
      const tMedha = (d.getTime() / (1000 * 60 * 60 * 24) + birthParams.month * 5 + bhagyank) % 33;
      const tBhava = (d.getTime() / (1000 * 60 * 60 * 24) + moolank * 4 + bhagyank * 2) % 28;
      const tOjas = (d.getTime() / (1000 * 60 * 60 * 24) + (birthParams.year % 100) + moolank * 7) % 38;

      const prana = Math.round(50 + 45 * Math.sin((tPrana / 23) * 2 * Math.PI));
      const medha = Math.round(50 + 45 * Math.sin((tMedha / 33) * 2 * Math.PI));
      const bhava = Math.round(50 + 45 * Math.sin((tBhava / 28) * 2 * Math.PI));
      const ojas = Math.round(50 + 45 * Math.sin((tOjas / 38) * 2 * Math.PI));

      daysList.push({
        date: dateStr,
        label,
        "Prana (Vigor)": prana,
        "Medha (Intellect)": medha,
        "Bhava (Emotion)": bhava,
        "Ojas (Intuition)": ojas,
      });
    }
    return daysList;
  }, [birthParams, moolank, bhagyank]);

  // Today's composite scores and peaks
  const todayRhythms = useMemo(() => {
    const today = biorhythmForecast[0];
    const prana = today["Prana (Vigor)"];
    const medha = today["Medha (Intellect)"];
    const bhava = today["Bhava (Emotion)"];
    const ojas = today["Ojas (Intuition)"];

    const average = Math.round((prana + medha + bhava + ojas) / 4);

    // Peak Hora (Hour of high energy) determined by planetary moolank
    const horaHours: Record<number, string> = {
      1: "06:00 AM - 07:00 AM (Surya Hora)",
      2: "08:00 PM - 09:00 PM (Chandra Hora)",
      3: "09:00 AM - 10:00 AM (Guru Hora)",
      4: "10:00 PM - 11:00 PM (Rahu Shadows)",
      5: "11:00 AM - 12:00 PM (Budha Hora)",
      6: "05:00 PM - 06:00 PM (Shukra Hora)",
      7: "04:00 AM - 05:00 AM (Ketu Brahma Muhurta)",
      8: "07:00 AM - 08:00 AM (Shani Hora)",
      9: "01:00 PM - 02:00 PM (Mangal Hora)"
    };

    const peakHour = horaHours[moolank] || "05:00 AM - 06:00 AM (Brahma Muhurta)";

    return { prana, medha, bhava, ojas, average, peakHour };
  }, [biorhythmForecast, moolank]);

  // 2. Calculate the Three Gunas (Sattva, Rajas, Tamas) balance
  const gunasBalance = useMemo(() => {
    // Deterministic calculation based on birthday, moolank and bhagyank
    let sattva = 35;
    let rajas = 35;
    let tamas = 30;

    // Spiritual numbers (3, 7, 9) favor Sattva (transmutation/sublimation)
    if ([3, 7, 9].includes(moolank)) sattva += 15;
    if ([3, 7].includes(bhagyank)) sattva += 10;

    // Action/ambitious numbers (1, 5, 6, 9) favor Rajas (movement/passion)
    if ([1, 5, 6].includes(moolank)) rajas += 15;
    if ([1, 9].includes(bhagyank)) rajas += 10;

    // Structure/heavy numbers (4, 8) favor Tamas (structure/inertia)
    if ([4, 8].includes(moolank)) tamas += 15;
    if ([4, 8].includes(bhagyank)) tamas += 10;

    // Normalize to 100%
    const total = sattva + rajas + tamas;
    const sPct = Math.round((sattva / total) * 100);
    const rPct = Math.round((rajas / total) * 100);
    const tPct = 100 - sPct - rPct;

    return [
      {
        subject: "Sattva (Purity)",
        score: sPct,
        fullMark: 100,
        color: "#fbbf24", // Gold
        desc: isHinglish
          ? "Purity, calm state, clear thinking, aur spiritual upliftment ko represent karta hai."
          : "Represents pure awareness, clarity, peaceful concentration, and sublimation of energies."
      },
      {
        subject: "Rajas (Passion)",
        score: rPct,
        fullMark: 100,
        color: "#f97316", // Saffron / Orange
        desc: isHinglish
          ? "Ambition, actions, physical movement, aur worldly desires ko direct karta hai."
          : "Governs worldly activity, ambition, dynamic movement, and passion."
      },
      {
        subject: "Tamas (Inertia)",
        score: tPct,
        fullMark: 100,
        color: "#64748b", // Slate / Charcoal
        desc: isHinglish
          ? "Stability, resting state, structural sleep, par dhyan na dene se aalsi man banta hai."
          : "Provides biological grounding, deep rest, and consolidation of materials, but leads to lethargy when imbalanced."
      }
    ];
  }, [moolank, bhagyank, isHinglish]);

  // Detailed suggestions based on Guna state
  const prominentGuna = useMemo(() => {
    const sorted = [...gunasBalance].sort((a, b) => b.score - a.score);
    return sorted[0];
  }, [gunasBalance]);

  return (
    <div className="space-y-8 animate-fade-in" id="vedic-biorhythms-tab-root">
      
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-neutral-950/60 to-neutral-900/40 border border-white/5 p-6 rounded-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <span className="text-[10px] bg-amber-500/10 border border-amber-500/20 text-gold px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider font-mono">
            {isHinglish ? "Cosmic Energy Infographic" : "Cosmic Bio-Energy & Gunas Analysis"}
          </span>
          <h3 className="text-xl font-serif font-semibold text-white tracking-tight flex items-center gap-2">
            <Zap className="text-gold animate-pulse" size={20} />
            {isHinglish ? "Aapke Guna aur Bio-Rhythms ki Chitra-Pradarshani" : "Vedic Bio-Rhythm & Three Gunas Infographic"}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            {isHinglish 
              ? "Aapki birth date aur planetary values ke anusaar aapke subtle body ki energy peaks, physical vigor, mental efficiency aur spiritual focus ka dynamic 7-day forecast."
              : "Explore how the core Vedic attributes (Pancha-Pranas, Medha, Bhava, and Ojas) and the three Gunas (Sattva, Rajas, Tamas) fluctuate. Optimize your daily activities and yogic practices with celestial accuracy."}
          </p>
        </div>

        {/* Dynamic Composite Score Circle Indicator */}
        <div className="flex items-center gap-4 border-l border-white/10 pl-6 shrink-0 font-mono">
          <div className="relative flex items-center justify-center">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle cx="32" cy="32" r="28" className="text-white/5" strokeWidth="4" fill="transparent" stroke="currentColor" />
              <motion.circle 
                cx="32" 
                cy="32" 
                r="28" 
                className="text-amber-500" 
                strokeWidth="4" 
                fill="transparent" 
                strokeDasharray={176}
                strokeDashoffset={176 - (176 * todayRhythms.average) / 100}
                stroke="currentColor" 
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-sm font-black text-white">{todayRhythms.average}%</span>
              <span className="text-[7px] text-slate-400 font-bold uppercase leading-none">AURA</span>
            </div>
          </div>
          <div>
            <span className="text-[9px] text-slate-500 block uppercase font-bold">{isHinglish ? "Aaj ki Prana Urja" : "Today's Aura Peak"}</span>
            <span className="text-xs font-semibold text-gold block mt-0.5">
              {todayRhythms.average >= 75 ? (isHinglish ? "Prachand (High Peak)" : "Radiant Peak") : (isHinglish ? "Sthir (Stable)" : "Harmonious Stable")}
            </span>
            <span className="text-[8px] text-slate-400 block max-w-[120px] truncate">{todayRhythms.peakHour}</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs (Bio-rhythms forecast vs. Three Gunas Balance) */}
      <div className="flex border-b border-white/5 gap-4">
        <button
          onClick={() => setActiveTabSection("biorhythms")}
          className={`pb-3 text-sm font-serif font-semibold tracking-wide border-b-2 transition-all cursor-pointer ${
            activeTabSection === "biorhythms"
              ? "border-amber-500 text-gold font-bold"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          {isHinglish ? "7-Day Energy Bio-Rhythms" : "7-Day Cosmic Bio-Rhythms"}
        </button>
        <button
          onClick={() => setActiveTabSection("gunas")}
          className={`pb-3 text-sm font-serif font-semibold tracking-wide border-b-2 transition-all cursor-pointer ${
            activeTabSection === "gunas"
              ? "border-amber-500 text-gold font-bold"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          {isHinglish ? "Three Gunas Balance (सत्व-रज-तम)" : "Vedic Guna Profile (Sattva-Rajas-Tamas)"}
        </button>
      </div>

      {/* SECTION 1: 7-DAY FORECAST GRAPH */}
      {activeTabSection === "biorhythms" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Chart Card */}
          <div className="lg:col-span-8 bg-white/[0.02] border border-white/5 p-6 rounded-2xl flex flex-col justify-between space-y-6 glow-purple relative overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h4 className="text-sm font-serif font-bold text-white tracking-wider uppercase flex items-center gap-2">
                  <Activity size={16} className="text-gold" />
                  {isHinglish ? "7-Day Cosmic Wave Pattern" : "7-Day Cosmic Biorhythm Waves"}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                  {isHinglish 
                    ? "Aapke physical, mental, emotional aur intuitional levels ke utaar-chadaav ka graphical analysis."
                    : "The intersecting curves show how your internal bio-electrical currents flow over the week. Align key events accordingly."}
                </p>
              </div>

              {/* Filter controls */}
              <div className="flex flex-wrap gap-1.5 bg-neutral-950 p-1 rounded-xl border border-white/5 self-start sm:self-center">
                {(["all", "prana", "medha", "bhava", "ojas"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setSelectedBiorhythm(mode)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                      selectedBiorhythm === mode
                        ? "bg-amber-500/15 text-gold border border-amber-500/20 font-bold"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Recharts Area Chart */}
            <div className="h-[280px] w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={biorhythmForecast} margin={{ left: -15, right: 10, top: 15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="pranaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f87171" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="medhaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fb923c" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#fb923c" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="bhavaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34d399" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="ojasGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#c084fc" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#c084fc" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="label" stroke="#64748b" fontSize={9} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="#64748b" fontSize={9} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0a0a0a",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "12px",
                      color: "#fff",
                      fontSize: "11px",
                    }}
                  />
                  
                  {(selectedBiorhythm === "all" || selectedBiorhythm === "prana") && (
                    <Area 
                      type="monotone" 
                      dataKey="Prana (Vigor)" 
                      stroke="#f87171" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#pranaGrad)" 
                    />
                  )}
                  {(selectedBiorhythm === "all" || selectedBiorhythm === "medha") && (
                    <Area 
                      type="monotone" 
                      dataKey="Medha (Intellect)" 
                      stroke="#fb923c" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#medhaGrad)" 
                    />
                  )}
                  {(selectedBiorhythm === "all" || selectedBiorhythm === "bhava") && (
                    <Area 
                      type="monotone" 
                      dataKey="Bhava (Emotion)" 
                      stroke="#34d399" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#bhavaGrad)" 
                    />
                  )}
                  {(selectedBiorhythm === "all" || selectedBiorhythm === "ojas") && (
                    <Area 
                      type="monotone" 
                      dataKey="Ojas (Intuition)" 
                      stroke="#c084fc" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#ojasGrad)" 
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="text-[10px] text-slate-500 border-t border-white/5 pt-3 leading-relaxed flex flex-wrap gap-4 items-center justify-between">
              <span className="flex items-center gap-1">
                <Info size={12} className="text-gold" />
                {isHinglish ? "*Waves 75% se upar high peaks dikhaate hain, 35% se neeche low caution points." : "*Values above 75% indicate high peaks; values below 35% indicate recharge days."}
              </span>
              <div className="flex gap-3 text-[9px] font-mono uppercase font-bold">
                <span className="text-red-400">● Prana</span>
                <span className="text-orange-400">● Medha</span>
                <span className="text-emerald-400">● Bhava</span>
                <span className="text-purple-400">● Ojas</span>
              </div>
            </div>
          </div>

          {/* Side Info Cards */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Interactive Stats Block */}
            <div className="bg-white/[0.01] border border-white/5 p-5 rounded-2xl space-y-4">
              <span className="text-[10px] text-amber-500 font-mono tracking-widest uppercase font-bold block">
                {isHinglish ? "Vedic Hora (Urja-kaal)" : "Cosmic Peak Metrics"}
              </span>

              <div className="space-y-3.5">
                <div className="p-3 bg-neutral-950/45 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[9px] text-slate-500 uppercase font-mono font-bold">{isHinglish ? "Daily Peak Hora" : "Daily peak hour"}</span>
                  <p className="text-xs font-semibold text-gold leading-normal">{todayRhythms.peakHour}</p>
                  <p className="text-[9px] text-slate-400 leading-normal font-sans">
                    {isHinglish 
                      ? "Aapke Moolank graha ke anusaar yah ghanta aapke sanyam aur dhyan ke liye sarvottam hai."
                      : "Your ruling planet grants extreme protection and heightened neural alertness during this specific hour."}
                  </p>
                </div>

                <div className="p-3 bg-neutral-950/45 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[9px] text-slate-500 uppercase font-mono font-bold">{isHinglish ? "Intuitional Aura" : "Intuitional (Ojas) Strength"}</span>
                  <p className="text-xs font-semibold text-purple-400 leading-none flex items-center gap-1">
                    <Sparkles size={12} fill="currentColor" /> {todayRhythms.ojas}% Power
                  </p>
                  <p className="text-[9px] text-slate-400 leading-normal font-sans mt-1">
                    {isHinglish 
                      ? "Sublimated energy level. Jab ye 70% se upar ho, to creative aur meditative results prachand aate hain."
                      : "Reflects your active transmutation potential. Perfect days to practice deep Pranayama and mudras."}
                  </p>
                </div>
              </div>
            </div>

            {/* Sublimation Wisdom Card */}
            <div className="bg-gradient-to-br from-neutral-950/60 to-neutral-900/40 border border-white/5 p-5 rounded-2xl relative overflow-hidden">
              <div className="absolute right-0 top-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
              <span className="text-[10px] text-gold font-mono tracking-widest uppercase font-bold block mb-2">
                {isHinglish ? "Weekly Sadhana Nirdesh" : "Yogic Flow Recommendation"}
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">
                {isHinglish 
                  ? `Sriman ${name}, aapka Prana cycle abhi ${todayRhythms.prana}% hai aur Medha (dhyan-shakti) ${todayRhythms.medha}% par hai. ${
                      todayRhythms.prana > todayRhythms.medha 
                        ? "Physical energy prachand hai! Iska upyog hatha yoga ya hard sanyam sadhana me kijiye." 
                        : "Mental focus behtareen hai! Deep reading, self study, aur silent mantra jap ke liye ye samay uttam hai."
                    }`
                  : `${name}, with Prana at ${todayRhythms.prana}% and Medha intellect at ${todayRhythms.medha}%, your bio-rhythm recommends focusing on ${
                      todayRhythms.prana > todayRhythms.medha 
                        ? "Physical transmutation - practice poses like Sarvangasana and deep Kumbhaka to utilize high vigor." 
                        : "Silent mental sadhana - perform detailed study of scriptures, silent mantra jap, and third-eye meditation."
                    }`}
              </p>
            </div>

          </div>

        </div>
      )}

      {/* SECTION 2: THREE GUNAS RADAR */}
      {activeTabSection === "gunas" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Radar Chart (lg:col-span-6) */}
          <div className="lg:col-span-6 p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col items-center justify-center min-h-[380px] glow-purple relative">
            
            <div className="absolute top-4 left-4">
              <h4 className="text-sm font-serif font-bold text-white tracking-wider uppercase flex items-center gap-2">
                <Compass size={16} className="text-gold" />
                {isHinglish ? "Sattva-Rajas-Tamas Diagram" : "Trigunatmika Energy Map"}
              </h4>
            </div>

            <div className="w-full h-[260px] flex items-center justify-center mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={gunasBalance}>
                  <PolarGrid stroke="rgba(255,255,255,0.08)" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: "#94a3b8", fontSize: 10, fontFamily: "monospace", fontWeight: "bold" }} 
                  />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} stroke="rgba(255,255,255,0.03)" />
                  <Radar 
                    name="My Guna Balance" 
                    dataKey="score" 
                    stroke="#D4AF37" 
                    fill="rgba(212, 175, 55, 0.2)" 
                    fillOpacity={0.6} 
                    dot={{ r: 4, strokeWidth: 1, stroke: "#fff", fill: "#D4AF37" }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    wrapperStyle={{ fontSize: "10px", fontFamily: "monospace", color: "#64748b" }} 
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="text-center text-[10px] text-slate-500 italic mt-3">
              {isHinglish ? "*Sattva ko badhaane ke liye Rajas aur Tamas ka balanced sublimation zaroori hai." : "*Aim to elevate Sattva. This is achieved by refining and balancing Rajas and Tamas."}
            </div>

          </div>

          {/* Details & remedies list (lg:col-span-6) */}
          <div className="lg:col-span-6 space-y-4">
            
            <div className="bg-gradient-to-br from-white/[0.02] to-transparent border border-white/5 rounded-2xl p-6 space-y-4 glow-purple">
              <div>
                <span className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase font-bold block">
                  {isHinglish ? "Sanyam aur Triguna Alchemi" : "Your Dominant Vibe Attribute"}
                </span>
                <h4 className="text-lg font-serif font-semibold text-white mt-1">
                  {prominentGuna.subject} is Highly Active ({prominentGuna.score}%)
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  {prominentGuna.desc}
                </p>
              </div>

              {/* Individual breakdown list */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                {gunasBalance.map((item, idx) => (
                  <div key={idx} className="space-y-1.5 group">
                    <div className="flex justify-between items-center text-xs leading-none">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: item.color, boxShadow: `0 0 6px ${item.color}` }} />
                        <span className="font-semibold text-slate-200 group-hover:text-white transition-colors">{item.subject}</span>
                      </div>
                      <span className="font-mono font-bold" style={{ color: item.color }}>{item.score}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.score}%` }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: idx * 0.1 }}
                        className="h-full rounded-full"
                        style={{ 
                          backgroundColor: item.color,
                          boxShadow: `0 0 8px ${item.color}80`
                        }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 font-sans leading-normal pl-4">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Ayurvedic Sadhana Remedy Panel */}
            <div className="bg-neutral-950/60 p-4 border border-gold/15 rounded-xl space-y-2 relative overflow-hidden">
              <span className="text-[10px] font-bold text-gold uppercase tracking-wider flex items-center gap-1 leading-none">
                <Leaf size={12} className="text-gold" />
                {isHinglish ? "Moolank Guna Sudhaar (Remedy)" : "Sattvic Sublimation Diet & Routine"}
              </span>
              <p className="text-[10px] text-slate-300 leading-relaxed font-sans">
                {isHinglish 
                  ? "Sattva ko badhaane ke liye shuddh gehu, dahi, kela, ghee aur nuts ka sewan kijiye. Pyaz, lehsun aur zyada mirch-masale se rajasic urges teez hoti hain, unhe sanyam se avoid karein. Subah surya uday ke samay dhyan lagane se Tamas shuddh Sattva banta hai."
                  : "To naturally boost Sattva, incorporate pure honey, soaked almonds, dates, and fresh organic fruits into your diet. Minimize highly spiced foods and deep fried items as they trigger rajasic passions and lower-chakra restlessness. Chanting during sunrise converts Tamas into high-frequency spiritual grounding."}
              </p>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
