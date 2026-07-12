import React, { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { 
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { DailyForecast } from "../types";
import { Sun, ShieldCheck, ShieldAlert, Sparkles, Clock, Calendar, Shield, HelpCircle, AlertTriangle } from "lucide-react";

interface DailyWeatherTabProps {
  userDob: string;
  language: string;
}

export default function DailyWeatherTab({ userDob, language }: DailyWeatherTabProps) {
  const [forecast, setForecast] = useState<DailyForecast | null>(null);
  const [loading, setLoading] = useState(false);
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState("");

  const energyData = useMemo(() => {
    if (!forecast) return [];
    const num = forecast.personalDayNumber || 1;
    return [
      { time: "04:00", name: "Brahma Muhurat", energy: ((num * 14 + 40) % 35) + 55, desc: "Peak Spiritual receptivity." },
      { time: "08:00", name: "Solar Ascent", energy: ((num * 8 + 30) % 25) + 60, desc: "Rising cognitive energy, ideal for strategic decisions." },
      { time: "12:00", name: "Solar Peak", energy: ((num * 19 + 50) % 30) + 65, desc: "Peak metabolic and logical vigor. Take decisive action." },
      { time: "16:00", name: "Prana Sandhya", energy: ((num * 11 + 25) % 20) + 45, desc: "Twilight transition phase. Excellent for grounding." },
      { time: "20:00", name: "Lunar Ascent", energy: ((num * 15 + 40) % 30) + 50, desc: "Highly creative & intuitive peak." },
      { time: "00:00", name: "Nishita Kaal", energy: ((num * 6 + 15) % 25) + 25, desc: "Deep sleep cycle. Subconscious consolidation." },
    ];
  }, [forecast]);

  const pranaElements = useMemo(() => {
    if (!forecast) return [];
    const num = forecast.personalDayNumber || 1;
    // Deterministic prana distribution out of 100%
    const spiritual = 22 + ((num * 11) % 18);
    const mental = 18 + ((num * 7) % 15);
    const physical = 15 + ((num * 9) % 20);
    const emotional = 100 - (spiritual + mental + physical);
    
    return [
      { name: "Spiritual", value: spiritual, color: "#c084fc", desc: "Aura high connection & cosmic light" },
      { name: "Mental Focus", value: mental, color: "#60a5fa", desc: "Intellectual drive & analytical strategy" },
      { name: "Vital Stamina", value: physical, color: "#f87171", desc: "Physical stamina, heat, and courage" },
      { name: "Emotional protection", value: emotional, color: "#f472b6", desc: "Aura filter & somatic empathy" },
    ];
  }, [forecast]);

  const chakraActivation = useMemo(() => {
    if (!forecast) return [];
    const num = forecast.personalDayNumber || 1;
    
    return [
      { name: "Muladhara (Root)", level: 50 + ((num * 12) % 45), color: "#f87171", element: "Earth", attribute: "Stability" },
      { name: "Svadhisthana (Sacral)", level: 55 + ((num * 7) % 40), color: "#fb923c", element: "Water", attribute: "Creation" },
      { name: "Manipura (Solar Plexus)", level: 45 + ((num * 15) % 50), color: "#facc15", element: "Fire", attribute: "Willpower" },
      { name: "Anahata (Heart)", level: 60 + ((num * 9) % 35), color: "#4ade80", element: "Air", attribute: "Empathy" },
      { name: "Vishuddha (Throat)", level: 40 + ((num * 13) % 55), color: "#22d3ee", element: "Ether", attribute: "Expression" },
      { name: "Ajna (Third Eye)", level: 65 + ((num * 6) % 30), color: "#818cf8", element: "Light", attribute: "Intuition" },
      { name: "Sahasrara (Crown)", level: 70 + ((num * 8) % 25), color: "#a855f7", element: "Cosmic", attribute: "Spirit" },
    ];
  }, [forecast]);

  const fetchForecast = async (dateStr: string) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/moolank/daily-forecast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dob: userDob, date: dateStr, language }),
      });
      const data = await response.json();
      if (data.success) {
        setForecast(data);
      } else {
        setError(data.error || "Failed to load daily forecast.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Could not connect to cosmic forecast.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userDob) {
      fetchForecast(targetDate);
    }
  }, [userDob, targetDate, language]);

  return (
    <div id="daily-weather-wrapper" className="space-y-6">
      <div className="bg-white/[0.02] backdrop-blur-md rounded-2xl border border-white/5 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 glow-purple">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sun className="text-amber-500 animate-spin-slow" size={24} />
            <h3 className="text-xl font-serif font-semibold text-white tracking-tight">Your Daily Cosmic Weather</h3>
          </div>
          <p className="text-xs text-slate-400">Discover your current day's personal vibration count and action plan.</p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <Calendar size={14} className="text-gold" />
          <input 
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="bg-white/[0.03] border border-white/10 text-xs text-white rounded-xl px-3 py-1.5 focus:outline-none focus:border-gold"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin glow-gold" />
          <p className="text-sm font-display text-slate-400 animate-pulse">Reading daily stellar alignments...</p>
        </div>
      ) : error ? (
        <div className="bg-rose-950/20 border border-rose-500/20 rounded-xl p-4 text-center">
          <p className="text-sm text-rose-300">{error}</p>
        </div>
      ) : forecast ? (
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          {/* Main Forecast Body */}
          <div className="lg:col-span-8 space-y-6">
            {forecast.isFallback && (
              <div id="fallback-forecast-alert" className="bg-amber-500/5 border border-amber-500/25 rounded-2xl p-4 flex gap-3 items-start shadow-md relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500/60" />
                <AlertTriangle className="text-gold shrink-0 mt-0.5" size={16} />
                <div className="space-y-0.5">
                  <h5 className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider">Vedic Forecast Database Active</h5>
                  <p className="text-[11px] text-slate-300 leading-normal font-sans">
                    The daily forecast is operating in offline mode due to temporary AI rate-limits. Day theme and advice are loaded accurately from pre-calculated formulas.
                  </p>
                </div>
              </div>
            )}

            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0 }
              }}
              className="bg-white/[0.02] hover:bg-white/[0.03] transition-colors duration-300 backdrop-blur-md rounded-2xl border border-white/5 p-6 space-y-4 glow-purple"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] bg-amber-500/10 border border-amber-500/30 text-gold px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                  Theme of the Day
                </span>
                <div className="flex items-center gap-1 bg-white/5 border border-gold/15 px-3 py-1 rounded-full">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest">Personal Day Count:</span>
                  <span className="text-xs font-mono font-bold text-gold">{forecast.personalDayNumber}</span>
                </div>
              </div>
              
              <h4 className="text-2xl font-serif font-semibold text-white tracking-tight">{forecast.theme}</h4>
              <p className="text-[14px] text-slate-200 leading-relaxed font-sans">{forecast.forecast}</p>
            </motion.div>

            {/* Vedic Chrono-Aura Fluctuations Chart */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0 }
              }}
              className="bg-white/[0.02] hover:bg-white/[0.03] transition-colors duration-300 backdrop-blur-md rounded-2xl border border-white/5 p-6 space-y-4 glow-purple animate-fade-in"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-serif font-bold text-gold tracking-wider uppercase flex items-center gap-2">
                    <Clock size={16} /> Vedic Chrono-Aura Wave
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">
                    Real-time hourly energetic tide fluctuations mapped according to your personal day count vibration.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest block font-bold leading-none">Resonance</span>
                  <span className="text-xs font-mono font-bold text-white mt-1 block">Dynamic Tide</span>
                </div>
              </div>

              <div className="h-[180px] w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={energyData} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#d4af37" stopOpacity={0.35}/>
                        <stop offset="95%" stopColor="#d4af37" stopOpacity={0.01}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" stroke="#64748b" fontSize={9} tickLine={false} />
                    <YAxis domain={[0, 100]} stroke="#64748b" fontSize={9} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0a0a0a",
                        border: "1px solid rgba(212, 175, 55, 0.25)",
                        borderRadius: "12px",
                        color: "#fff",
                        fontSize: "11px",
                        maxWidth: "240px",
                        whiteSpace: "normal"
                      }}
                      formatter={(value) => [`${value}% Vibration`, "Power"]}
                      labelFormatter={(label) => {
                        const item = energyData.find(d => d.time === label);
                        return item ? `${item.time} - ${item.name}` : label;
                      }}
                    />
                    <Area type="monotone" dataKey="energy" stroke="#d4af37" strokeWidth={2} fillOpacity={1} fill="url(#colorEnergy)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-2 border-t border-white/5">
                {energyData.map((item, idx) => (
                  <div key={idx} className="p-2 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 rounded-xl text-center transition-all duration-300">
                    <span className="text-[10px] font-bold text-slate-500 block font-mono">{item.time}</span>
                    <span className="text-[10px] text-white font-semibold block truncate mt-0.5">{item.name}</span>
                    <span className="text-[11px] text-gold font-mono font-bold mt-0.5 block">{item.energy}%</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Prana & Chakra Synergy Infographics */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Daily Prana Aura Composition */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="lg:col-span-5 bg-white/[0.02] backdrop-blur-md rounded-2xl border border-white/5 p-6 space-y-4 glow-purple flex flex-col justify-between"
              >
                <div>
                  <h4 className="text-sm font-serif font-bold text-gold tracking-wider uppercase flex items-center gap-2">
                    <Sparkles size={16} /> Prana Aura Composition
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">
                    The volumetric balance of vital force energies in your aura today based on your diurnal vibration index.
                  </p>
                </div>

                <div className="h-[180px] w-full flex items-center justify-center relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pranaElements}
                        cx="50%"
                        cy="50%"
                        innerRadius="50%"
                        outerRadius="75%"
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {pranaElements.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(10,10,10,0.8)" strokeWidth={2} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0a0a0a",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: "12px",
                          color: "#fff",
                          fontSize: "11px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Absolute Center personal day indicator */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[9px] text-slate-500 uppercase font-mono font-bold">VIBE</span>
                    <span className="text-lg font-black text-white font-mono">#{forecast.personalDayNumber}</span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {pranaElements.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs border-b border-white/5 pb-1.5 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-slate-300 font-medium">{item.name}</span>
                      </div>
                      <div className="text-right flex items-center gap-2">
                        <span className="text-white font-semibold font-mono">{item.value}%</span>
                        <span className="text-[9px] text-slate-500 max-w-[120px] truncate">{item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Chakra Activation Levels */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="lg:col-span-7 bg-white/[0.02] backdrop-blur-md rounded-2xl border border-white/5 p-6 space-y-4 glow-purple flex flex-col justify-between"
              >
                <div>
                  <h4 className="text-sm font-serif font-bold text-cyan-400 tracking-wider uppercase flex items-center gap-2">
                    <Shield size={16} /> Chakra Activation Levels
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">
                    Today's dynamic prana distribution across the seven vital energy centers of your subtle nervous system.
                  </p>
                </div>

                <div className="space-y-3.5 pt-2">
                  {chakraActivation.map((chakra, idx) => (
                    <div key={idx} className="space-y-1 group">
                      <div className="flex justify-between items-center text-[11px] leading-none">
                        <div className="flex items-center gap-2">
                          <span 
                            className="w-2 h-2 rounded-full animate-pulse shrink-0" 
                            style={{ 
                              backgroundColor: chakra.color,
                              boxShadow: `0 0 6px ${chakra.color}`
                            }} 
                          />
                          <span className="font-semibold text-slate-200 group-hover:text-white transition-colors">{chakra.name}</span>
                          <span className="text-[9px] text-slate-500 font-mono">({chakra.element})</span>
                        </div>
                        <div className="flex items-center gap-2 font-mono">
                          <span className="text-[9px] bg-white/5 px-1.5 py-0.5 rounded text-slate-400 border border-white/5">{chakra.attribute}</span>
                          <span className="font-bold" style={{ color: chakra.color }}>{chakra.level}%</span>
                        </div>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${chakra.level}%` }}
                          transition={{ duration: 1, ease: "easeOut", delay: idx * 0.08 }}
                          className="h-full rounded-full"
                          style={{ 
                            backgroundColor: chakra.color,
                            boxShadow: `0 0 8px ${chakra.color}80`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-[10px] text-slate-500 italic text-center border-t border-white/5 pt-2.5 flex items-center justify-center gap-1">
                  <HelpCircle size={12} className="text-cyan-400" />
                  <span>Activation level corresponds to today's cosmic vibration. Wear matching gemstone colors for alignment.</span>
                </p>
              </motion.div>
            </div>

            {/* Dos and Don'ts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                variants={{
                  hidden: { opacity: 0, x: -15 },
                  visible: { opacity: 1, x: 0 }
                }}
                className="bg-emerald-950/[0.04] hover:bg-emerald-950/[0.06] transition-colors border border-emerald-500/10 rounded-2xl p-6 space-y-4"
              >
                <h5 className="text-sm font-serif font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck size={16} /> Cosmic Dos
                </h5>
                <ul className="space-y-3">
                  {forecast.dos?.map((item, i) => (
                    <motion.li 
                      key={i} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08, type: "spring", stiffness: 100, damping: 15 }}
                      whileHover={{ x: 3 }}
                      className="flex items-start gap-2.5 text-[13px] text-slate-300 leading-relaxed cursor-default group"
                    >
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 group-hover:scale-125 transition-transform" />
                      <span className="group-hover:text-white transition-colors">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <motion.div 
                variants={{
                  hidden: { opacity: 0, x: 15 },
                  visible: { opacity: 1, x: 0 }
                }}
                className="bg-rose-950/[0.04] hover:bg-rose-950/[0.06] transition-colors border border-rose-500/10 rounded-2xl p-6 space-y-4"
              >
                <h5 className="text-sm font-serif font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert size={16} /> Cosmic Don'ts
                </h5>
                <ul className="space-y-3">
                  {forecast.donts?.map((item, i) => (
                    <motion.li 
                      key={i} 
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08, type: "spring", stiffness: 100, damping: 15 }}
                      whileHover={{ x: 3 }}
                      className="flex items-start gap-2.5 text-[13px] text-slate-300 leading-relaxed cursor-default group"
                    >
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 group-hover:scale-125 transition-transform" />
                      <span className="group-hover:text-white transition-colors">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>

          {/* Quick variables sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ scale: 1.01 }}
              className="bg-white/[0.02] backdrop-blur-md rounded-2xl border border-white/5 p-6 text-center space-y-4 glow-purple transition-all duration-300"
            >
              <Clock className="text-gold mx-auto animate-pulse" size={28} />
              <div className="space-y-1">
                <h5 className="text-xs uppercase tracking-widest text-slate-400 font-medium">Lucky Daily Hours</h5>
                <p className="text-xl font-serif font-bold text-white tracking-tight">{forecast.luckyHours}</p>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Vedic Muhurat systems indicate that these hours carry peak energetic coherence to make key decisions or write crucial drafts.
              </p>
            </motion.div>

            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0 }
              }}
              className="bg-white/[0.02] border border-gold/15 rounded-2xl p-6 space-y-3"
            >
              <h5 className="text-xs uppercase tracking-widest text-gold font-bold flex items-center gap-1">
                <Sparkles size={12} /> Cosmic Tip
              </h5>
              <p className="text-[13px] text-slate-300 leading-relaxed font-sans">
                Every personal day carries a specific resonance. Ground yourself in quiet morning meditation to let these energies integrate smoothly with your chakras.
              </p>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </div>
  );
}
