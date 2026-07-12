import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  CheckSquare, 
  Square, 
  Smile, 
  Battery, 
  BedDouble, 
  Droplet, 
  Compass, 
  Award,
  Sparkles,
  Flame,
  UserCheck,
  Calendar,
  CheckCircle,
  Plus,
  Minus,
  TrendingUp,
  BrainCircuit,
  RotateCcw
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  Legend 
} from "recharts";
import { getTransformationProfile } from "../data/transformationData";

export interface CosmicMilestone {
  days: number;
  title: string;
  sanskrit: string;
  badge: string;
  desc: string;
  color: string;
  glowColor: string;
  quote: string;
}

export const COSMIC_MILESTONES: CosmicMilestone[] = [
  {
    days: 1,
    title: "Prana Ignited",
    sanskrit: "प्राण जागृति",
    badge: "🔥",
    desc: "First light of discipline. Prana energy starts flowing harmoniously.",
    color: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-300 bg-cyan-950/20",
    glowColor: "shadow-cyan-500/20",
    quote: "Every long ascent begins with a single conscious breath."
  },
  {
    days: 3,
    title: "Tejas Seeker",
    sanskrit: "तेजस् साधक",
    badge: "⚡",
    desc: "Your mental fire is stabilizing. Focus becomes a steady laser.",
    color: "from-orange-500/20 to-amber-500/20 border-orange-500/30 text-orange-300 bg-orange-950/20",
    glowColor: "shadow-orange-500/20",
    quote: "Where your attention flows, divine energy multiplies."
  },
  {
    days: 7,
    title: "Ojas Accumulator",
    sanskrit: "ओजस् संचय",
    badge: "🛡️",
    desc: "Vital fluids refine into baseline physical aura and metabolic vitality.",
    color: "from-pink-500/20 to-purple-500/20 border-pink-500/30 text-pink-300 bg-pink-950/20",
    glowColor: "shadow-pink-500/20",
    quote: "Aura acts as the shield against negative external vibrations."
  },
  {
    days: 15,
    title: "Indriya Sanyam",
    sanskrit: "इन्द्रिय संयम",
    badge: "👁️",
    desc: "Sensory mastery. External triggers lose their grip on your intellect.",
    color: "from-teal-500/20 to-emerald-500/20 border-teal-500/30 text-teal-300 bg-teal-950/20",
    glowColor: "shadow-teal-500/20",
    quote: "He who conquers his senses reigns supreme over destiny."
  },
  {
    days: 30,
    title: "Urdhvareta Yogi",
    sanskrit: "ऊर्ध्वरेतस्",
    badge: "✨",
    desc: "Upward energy transmutation. Lower desires sublime into supreme intellect.",
    color: "from-amber-500/25 to-yellow-500/25 border-amber-500/40 text-amber-300 bg-amber-950/20",
    glowColor: "shadow-gold/30",
    quote: "Retained energy becomes deep intuition and spiritual radiance."
  },
  {
    days: 108,
    title: "Cosmic Siddha",
    sanskrit: "सिद्ध पुरुष",
    badge: "👑",
    desc: "Full Golden Kundalini Shield. Raw creative power completely merged with pure consciousness.",
    color: "from-violet-600/30 via-fuchsia-600/30 to-rose-600/30 border-rose-500/50 text-rose-300 bg-purple-950/25 animate-pulse",
    glowColor: "shadow-rose-500/30",
    quote: "The individual drop has merged into the celestial cosmic ocean."
  }
];

interface TransformationTrackerTabProps {
  moolank: number;
  name: string;
  language: string;
}

interface DayLog {
  dateString: string; // YYYY-MM-DD
  habits: Record<string, boolean>;
  mood: number;    // 1-10
  energy: number;  // 1-10
  sleep: number;   // 1-10
  water: number;   // Liters (e.g., 0 to 4)
  meditation: number; // Minutes
  score: number;   // 0-100 calculated
}

export default function TransformationTrackerTab({ moolank, name, language }: TransformationTrackerTabProps) {
  const profile = getTransformationProfile(moolank);
  
  // Base core daily habits/remedies for their Moolank
  const defaultHabits = [
    `Rise before sunrise & ground (Element: ${profile.identity.dominantElement})`,
    `Hydration (Copper/Structured water: ${profile.healthProfile.waterIntake})`,
    `Recite Moolank Mantra: "${profile.spiritualProfile.dailyMantra.split(" (")[0]}"`,
    `Yoga Practice: ${profile.healthProfile.yogaPoses[0]}`,
    `Pranayama Practice: ${profile.healthProfile.pranayama[0]}`,
    `Selfless Charity: ${profile.spiritualProfile.charityAndDonation.split(" on ")[0]}`,
    `Digital Detox (At least 1 hour of quiet mauna space)`
  ];

  const todayStr = new Date().toISOString().split("T")[0];

  // State
  const [history, setHistory] = useState<Record<string, DayLog>>({});
  const [habitsChecked, setHabitsChecked] = useState<Record<string, boolean>>({});
  const [mood, setMood] = useState(7);
  const [energy, setEnergy] = useState(7);
  const [sleep, setSleep] = useState(7);
  const [water, setWater] = useState(1.5);
  const [meditation, setMeditation] = useState(10);
  const [score, setScore] = useState(0);
  const [successMsg, setSuccessMsg] = useState("");
  const [streakBoost, setStreakBoost] = useState<number>(0);
  const [unlockedMilestone, setUnlockedMilestone] = useState<CosmicMilestone | null>(null);
  const [previousStreak, setPreviousStreak] = useState<number>(0);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`transformation_logs_moolank_${moolank}`);
      if (stored) {
        const parsed = JSON.parse(stored) as Record<string, DayLog>;
        setHistory(parsed);
        
        // Populate today if exists
        if (parsed[todayStr]) {
          const todayLog = parsed[todayStr];
          setHabitsChecked(todayLog.habits);
          setMood(todayLog.mood);
          setEnergy(todayLog.energy);
          setSleep(todayLog.sleep);
          setWater(todayLog.water);
          setMeditation(todayLog.meditation);
        } else {
          // Default empty for today
          const emptyHabits: Record<string, boolean> = {};
          defaultHabits.forEach(h => { emptyHabits[h] = false; });
          setHabitsChecked(emptyHabits);
        }
      } else {
        // First initialization
        const emptyHabits: Record<string, boolean> = {};
        defaultHabits.forEach(h => { emptyHabits[h] = false; });
        setHabitsChecked(emptyHabits);
      }
    } catch (e) {
      console.error("Failed loading logs", e);
    }
  }, [moolank]);

  // Recalculate daily score dynamically
  useEffect(() => {
    // 50% from habits (weighted evenly)
    const habitCount = Object.keys(habitsChecked).length;
    const checkedCount = Object.values(habitsChecked).filter(Boolean).length;
    const habitScore = habitCount > 0 ? (checkedCount / habitCount) * 50 : 0;

    // 15% from mood/energy/sleep checks
    const averageVitals = (mood + energy + sleep) / 3; // out of 10
    const vitalsScore = (averageVitals / 10) * 15;

    // 15% from water target (e.g., target 3.2 liters)
    const waterTarget = parseFloat(profile.healthProfile.waterIntake) || 3.0;
    const waterRatio = Math.min(water / waterTarget, 1.0);
    const waterScore = waterRatio * 15;

    // 20% from meditation target (e.g., target 20 minutes)
    const meditationRatio = Math.min(meditation / 20, 1.0);
    const meditationScore = meditationRatio * 20;

    const finalScore = Math.round(habitScore + vitalsScore + waterScore + meditationScore);
    setScore(finalScore);
  }, [habitsChecked, mood, energy, sleep, water, meditation]);

  // Toggle habit checkbox
  const toggleHabit = (habitName: string) => {
    setHabitsChecked(prev => {
      const updated = { ...prev, [habitName]: !prev[habitName] };
      return updated;
    });
  };

  // Save/log today's progress
  const saveProgress = () => {
    const todayLog: DayLog = {
      dateString: todayStr,
      habits: habitsChecked,
      mood,
      energy,
      sleep,
      water,
      meditation,
      score
    };

    const updatedHistory = { ...history, [todayStr]: todayLog };
    setHistory(updatedHistory);
    
    try {
      localStorage.setItem(`transformation_logs_moolank_${moolank}`, JSON.stringify(updatedHistory));
      setSuccessMsg("Deep transformation progress saved to cosmic ledger!");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (e) {
      console.error("Save failed", e);
    }
  };

  // Generate mock past week logs for visualization if history is empty
  const getDisplayHistory = () => {
    const weekDays: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      weekDays.push(d.toISOString().split("T")[0]);
    }

    return weekDays.map((dateStr, idx) => {
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const dayLabel = dayNames[new Date(dateStr).getDay()];

      if (history[dateStr]) {
        return {
          ...history[dateStr],
          label: dayLabel
        };
      }
      // Return a beautiful dynamic placeholder for past logs so they can see the chart right away!
      const pseudoRandomSeed = (moolank + idx) % 5;
      const pseudoScore = 55 + (pseudoRandomSeed * 8) + (idx * 2);
      
      return {
        dateString: dateStr,
        score: Math.min(pseudoScore, 100),
        label: dayLabel,
        mood: 6 + (pseudoRandomSeed % 3),
        energy: 5 + ((pseudoRandomSeed + 1) % 4),
        sleep: 7 + (idx % 3),
        water: 1.5 + (idx * 0.2),
        meditation: 10 + (idx * 2)
      };
    });
  };

  const chartLogs = getDisplayHistory();

  // Calculate consecutive logged days streak
  const getRealStreak = () => {
    const dates = Object.keys(history).sort();
    if (dates.length === 0) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const todayStrForm = today.toISOString().split("T")[0];
    const yesterdayStrForm = yesterday.toISOString().split("T")[0];
    
    if (!history[todayStrForm] && !history[yesterdayStrForm]) {
      return 0;
    }
    
    let activeStreak = 0;
    const tempDate = history[todayStrForm] ? new Date(today) : new Date(yesterday);
    tempDate.setHours(0, 0, 0, 0);
    
    while (true) {
      const formatted = tempDate.toISOString().split("T")[0];
      if (history[formatted]) {
        activeStreak++;
        tempDate.setDate(tempDate.getDate() - 1);
      } else {
        break;
      }
    }
    return activeStreak;
  };

  const realStreak = getRealStreak();
  const totalStreak = realStreak + streakBoost;

  // Track unlocking milestones
  useEffect(() => {
    if (totalStreak > 0) {
      const newlyUnlocked = COSMIC_MILESTONES.find(
        (m) => totalStreak >= m.days && previousStreak < m.days
      );
      if (newlyUnlocked) {
        setUnlockedMilestone(newlyUnlocked);
      }
    }
    setPreviousStreak(totalStreak);
  }, [totalStreak, previousStreak]);

  return (
    <div id="transformation-tracker-container" className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 md:p-8 space-y-8 backdrop-blur-md glow-purple">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/25 text-gold px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
            <UserCheck size={12} />
            <span>Progress Ledger</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-serif font-light text-white tracking-tight">
            The Transformation <span className="text-gold italic font-medium">Sadhana Tracker</span>
          </h3>
          <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
            Record your daily physical routines, check off remedial activities, track somatic vitals, and log your progress score to visualize your weekly evolution.
          </p>
        </div>

        {/* Current score badge */}
        <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl shrink-0 self-center md:self-auto">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="28" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="4" />
              <circle cx="32" cy="32" r="28" fill="transparent" stroke="url(#goldGradient)" strokeWidth="4" 
                strokeDasharray={`${2 * Math.PI * 28}`}
                strokeDashoffset={`${2 * Math.PI * 28 * (1 - score / 100)}`}
                className="transition-all duration-500 ease-out"
              />
              <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D4AF37" />
                  <stop offset="100%" stopColor="#AA7C11" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute text-sm font-mono font-bold text-gold">{score}%</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block font-mono font-bold uppercase">SADHANA SCORE</span>
            <span className="text-sm font-bold text-white block">Today's Alignment</span>
            <span className="text-[10px] text-emerald-400 font-semibold block flex items-center gap-1">
              <Sparkles size={10} /> Active Growth Mode
            </span>
          </div>
        </div>
      </div>

      {/* Main interactive grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Daily checklists & Somatic inputs */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Daily Remedies checklist */}
          <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4">
            <h4 className="text-sm font-serif font-bold text-gold tracking-wider uppercase flex items-center gap-2 border-b border-white/5 pb-2">
              <CheckSquare size={16} /> Daily Remedies & Habits Check-in
            </h4>
            <div className="space-y-3">
              {Object.keys(habitsChecked).map((habit, i) => {
                const isChecked = habitsChecked[habit];
                return (
                  <motion.button
                    key={i}
                    id={`habits-check-item-${i}`}
                    onClick={() => toggleHabit(habit)}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, type: "spring", stiffness: 100, damping: 15 }}
                    whileHover={{ scale: 1.01, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full text-left flex items-start gap-3 p-3 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-gold/25 rounded-xl transition-all duration-300 cursor-pointer text-xs font-sans text-slate-300 hover:text-white"
                  >
                    <div className="mt-0.5 shrink-0 text-gold">
                      {isChecked ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 250, damping: 12 }}
                        >
                          <CheckCircle size={15} fill="currentColor" className="text-gold bg-cosmic-bg rounded-full" />
                        </motion.div>
                      ) : (
                        <Square size={15} className="text-slate-500" />
                      )}
                    </div>
                    <span className={isChecked ? "line-through text-slate-500 transition-all" : ""}>{habit}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Vital Energies sliders & water/meditation controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Vitals */}
            <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4">
              <h4 className="text-sm font-serif font-bold text-white tracking-wider uppercase flex items-center gap-2 border-b border-white/5 pb-2">
                <BrainCircuit size={16} className="text-gold" /> Subtle Energies (1-10)
              </h4>
              <div className="space-y-4 text-xs">
                {/* Mood */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-slate-400 font-medium">
                    <span className="flex items-center gap-1.5"><Smile size={14} className="text-gold" /> Emotional Peace (Mood)</span>
                    <span className="text-gold font-bold">{mood}/10</span>
                  </div>
                  <input
                    type="range" min="1" max="10" step="1"
                    value={mood} onChange={(e) => setMood(Number(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold"
                  />
                </div>

                {/* Energy */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-slate-400 font-medium">
                    <span className="flex items-center gap-1.5"><Battery size={14} className="text-cyan-400" /> Physical Energy Level</span>
                    <span className="text-cyan-400 font-bold">{energy}/10</span>
                  </div>
                  <input
                    type="range" min="1" max="10" step="1"
                    value={energy} onChange={(e) => setEnergy(Number(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>

                {/* Sleep */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-slate-400 font-medium">
                    <span className="flex items-center gap-1.5"><BedDouble size={14} className="text-purple-400" /> Sleep Deepness & Quality</span>
                    <span className="text-purple-400 font-bold">{sleep}/10</span>
                  </div>
                  <input
                    type="range" min="1" max="10" step="1"
                    value={sleep} onChange={(e) => setSleep(Number(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-400"
                  />
                </div>
              </div>
            </div>

            {/* Somatic Counters */}
            <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4">
              <h4 className="text-sm font-serif font-bold text-white tracking-wider uppercase flex items-center gap-2 border-b border-white/5 pb-2">
                <Compass size={16} className="text-gold" /> Somatic Intake & Stillness
              </h4>
              <div className="space-y-4 text-xs">
                {/* Water counter */}
                <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="text-slate-400 font-bold block flex items-center gap-1"><Droplet size={13} className="text-cyan-400" /> Water Hydration</span>
                    <span className="text-[10px] text-slate-500">Target: {profile.healthProfile.waterIntake}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setWater(prev => Math.max(0, prev - 0.25))}
                      className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer transition-all active:scale-90"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-xs font-mono font-bold text-white w-14 text-center">{water.toFixed(2)} L</span>
                    <button
                      onClick={() => setWater(prev => prev + 0.25)}
                      className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer transition-all active:scale-90"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                {/* Meditation counter */}
                <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="text-slate-400 font-bold block flex items-center gap-1"><Flame size={13} className="text-gold" /> Breath & Meditation</span>
                    <span className="text-[10px] text-slate-500">Target: 20 min</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setMeditation(prev => Math.max(0, prev - 5))}
                      className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer transition-all active:scale-90"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-xs font-mono font-bold text-white w-14 text-center">{meditation} min</span>
                    <button
                      onClick={() => setMeditation(prev => prev + 5)}
                      className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer transition-all active:scale-90"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                {/* Save Button */}
                <button
                  onClick={saveProgress}
                  className="w-full bg-gradient-to-r from-gold-dark via-gold to-gold-light text-cosmic-bg font-display font-bold py-3 px-4 rounded-xl cursor-pointer hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 shadow-md shadow-gold/25"
                >
                  <Award size={14} />
                  <span>Log Today's Alignments</span>
                </button>
              </div>
            </div>

          </div>

          {/* Custom feedback messages */}
          <AnimatePresence>
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl text-xs text-center font-semibold flex items-center justify-center gap-2"
              >
                <CheckCircle size={16} />
                <span>{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Right column: Weekly trends & charts */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 block font-mono font-bold uppercase">SOMATIC CORRELATION</span>
              <h4 className="text-sm font-serif font-bold text-white tracking-wider uppercase flex items-center gap-1.5">
                <TrendingUp size={16} className="text-gold" /> 7-Day Evolution Trend
              </h4>
              <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                Correlate your overall Sadhana Alignment Score (left axis, 0-100%) with somatic indices like mood, energy, and sleep (right axis, 0-10).
              </p>
            </div>

            {/* Premium Recharts Interactive Dual Axis Chart */}
            <div className="h-60 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartLogs} margin={{ top: 10, right: -5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSadhana" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.03)" vertical={false} />
                  <XAxis 
                    dataKey="label" 
                    stroke="#475569" 
                    fontSize={9} 
                    fontFamily="monospace"
                    tickLine={false}
                  />
                  <YAxis 
                    yAxisId="left"
                    stroke="#D4AF37" 
                    fontSize={9} 
                    fontFamily="monospace"
                    tickLine={false}
                    domain={[0, 100]}
                    width={25}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    stroke="#38bdf8" 
                    fontSize={9} 
                    fontFamily="monospace"
                    tickLine={false}
                    domain={[0, 10]}
                    width={25}
                  />
                  <RechartsTooltip 
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
                    yAxisId="left"
                    type="monotone" 
                    name="Sadhana"
                    dataKey="score" 
                    stroke="#D4AF37" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorSadhana)" 
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    name="Mood"
                    dataKey="mood" 
                    stroke="#fb923c" 
                    strokeWidth={1.5}
                    dot={{ r: 1.5 }}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    name="Energy"
                    dataKey="energy" 
                    stroke="#22d3ee" 
                    strokeWidth={1.5}
                    dot={{ r: 1.5 }}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    name="Sleep"
                    dataKey="sleep" 
                    stroke="#c084fc" 
                    strokeWidth={1.5}
                    dot={{ r: 1.5 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Simple stats */}
            <div className="grid grid-cols-2 gap-4 text-xs text-center font-sans">
              <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl">
                <span className="text-slate-500 block text-[9px] uppercase font-bold font-mono">Current Streak</span>
                <span className="text-white font-bold text-base mt-1 block font-mono">
                  {totalStreak} {totalStreak === 1 ? "Day" : "Days"}
                </span>
                {streakBoost > 0 && (
                  <span className="text-[9px] text-amber-400/80 font-mono block">(+{streakBoost} simulated)</span>
                )}
              </div>
              <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl">
                <span className="text-slate-500 block text-[9px] uppercase font-bold font-mono">Ledger Average</span>
                <span className="text-gold font-bold text-base mt-1 block font-mono">
                  {Object.keys(history).length > 0 
                    ? `${Math.round(Object.keys(history).reduce((acc: number, k: string) => acc + (history[k]?.score || 0), 0) / Object.keys(history).length)}%`
                    : "72%"}
                </span>
              </div>
            </div>

            {/* Streak Booster Simulator */}
            <div className="p-3.5 bg-purple-500/5 border border-purple-500/10 rounded-xl space-y-2.5 text-xs font-sans">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-purple-300 font-bold uppercase font-mono tracking-wider flex items-center gap-1">
                  <Sparkles size={10} className="text-purple-400" /> Sadhana Simulator
                </span>
                <span className="text-[9px] text-slate-500 font-mono">Verify Milestones</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                <button
                  onClick={() => setStreakBoost(prev => prev + 1)}
                  className="bg-white/5 hover:bg-white/10 hover:text-white text-[10px] font-mono py-1 rounded-md text-slate-300 cursor-pointer active:scale-95 transition-all border border-white/5"
                  title="Simulate +1 day"
                >
                  +1d
                </button>
                <button
                  onClick={() => setStreakBoost(prev => prev + 7)}
                  className="bg-white/5 hover:bg-white/10 hover:text-white text-[10px] font-mono py-1 rounded-md text-slate-300 cursor-pointer active:scale-95 transition-all border border-white/5"
                  title="Simulate +7 days"
                >
                  +7d
                </button>
                <button
                  onClick={() => setStreakBoost(prev => prev + 30)}
                  className="bg-white/5 hover:bg-white/10 hover:text-white text-[10px] font-mono py-1 rounded-md text-slate-300 cursor-pointer active:scale-95 transition-all border border-white/5"
                  title="Simulate +30 days"
                >
                  +30d
                </button>
                <button
                  onClick={() => setStreakBoost(0)}
                  disabled={streakBoost === 0}
                  className="bg-white/5 hover:bg-white/10 hover:text-white disabled:opacity-40 disabled:pointer-events-none text-[10px] font-mono py-1 rounded-md text-rose-400 cursor-pointer active:scale-95 transition-all border border-white/5"
                  title="Reset simulated boost"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Clear logs option */}
            {Object.keys(history).length > 0 && (
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to clear your local ledger? This is irreversible.")) {
                    localStorage.removeItem(`transformation_logs_moolank_${moolank}`);
                    setHistory({});
                    const emptyHabits: Record<string, boolean> = {};
                    defaultHabits.forEach(h => { emptyHabits[h] = false; });
                    setHabitsChecked(emptyHabits);
                  }
                }}
                className="w-full text-slate-600 hover:text-rose-400 text-[10px] uppercase tracking-widest font-bold flex items-center justify-center gap-1.5 hover:bg-rose-500/5 py-2 rounded-lg transition-all cursor-pointer border border-transparent hover:border-rose-500/10"
              >
                <RotateCcw size={10} />
                <span>Reset Progress Ledger</span>
              </button>
            )}

          </div>
        </div>

      </div>

      {/* ------------------------------------------- */}
      {/* COSMIC MILESTONES & AESTHETIC BADGES SECTION */}
      {/* ------------------------------------------- */}
      <div className="border-t border-white/5 pt-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-xl font-serif font-light text-white flex items-center justify-center md:justify-start gap-2.5">
              <Award className="text-gold" size={20} />
              <span>Cosmic <span className="text-gold italic font-medium">Sadhana Milestones</span></span>
            </h4>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed font-sans">
              Unlock sacred aesthetic badges, titles, and spiritual alignments as your active sadhana streak expands. Complete daily remedies to ascend further!
            </p>
          </div>
          <div className="flex justify-center shrink-0">
            <div className="px-3.5 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-xs font-mono font-bold text-gold text-center">
              Active Streak: {totalStreak} {totalStreak === 1 ? "Day" : "Days"}
            </div>
          </div>
        </div>

        {/* Milestones Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {COSMIC_MILESTONES.map((milestone, index) => {
            const isUnlocked = totalStreak >= milestone.days;
            let progressPercent = 0;
            if (isUnlocked) {
              progressPercent = 100;
            } else {
              const prevMilestoneDays = index === 0 ? 0 : COSMIC_MILESTONES[index - 1].days;
              const range = milestone.days - prevMilestoneDays;
              const completedInRange = totalStreak - prevMilestoneDays;
              progressPercent = Math.min(Math.max((completedInRange / range) * 100, 0), 100);
            }

            return (
              <motion.div
                key={milestone.days}
                id={`milestone-badge-card-${milestone.days}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, type: "spring", stiffness: 90 }}
                className={`relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 flex flex-col justify-between h-56 ${
                  isUnlocked 
                    ? `bg-gradient-to-br ${milestone.color} shadow-lg ${milestone.glowColor} border-white/10` 
                    : "bg-white/[0.01] border-white/5 opacity-50 grayscale select-none"
                }`}
              >
                {/* Decorative subtle background icon */}
                <div className="absolute right-3 top-3 opacity-10 text-6xl font-bold select-none">
                  {milestone.badge}
                </div>

                <div className="space-y-3">
                  {/* Badge & Sanskrit Header */}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl" role="img" aria-label={milestone.title}>
                      {milestone.badge}
                    </span>
                    <span className="text-[10px] font-sans font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400">
                      {milestone.days} {milestone.days === 1 ? "Day" : "Days"}
                    </span>
                  </div>

                  {/* Title & Sanskrit */}
                  <div>
                    <h5 className="font-serif text-lg font-bold text-white leading-snug flex items-center gap-2">
                      {milestone.title}
                    </h5>
                    <p className="text-[11px] font-sans text-gold/80 font-bold italic tracking-wide">
                      {milestone.sanskrit}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed font-sans line-clamp-2">
                    {milestone.desc}
                  </p>
                </div>

                {/* Footer Quote or Progress bar */}
                <div className="mt-4 space-y-2 pt-2 border-t border-white/5">
                  {isUnlocked ? (
                    <p className="text-[10px] italic text-slate-400 text-center line-clamp-1 font-sans">
                      "{milestone.quote}"
                    </p>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-mono font-bold text-slate-500">
                        <span>LOCKED</span>
                        <span>{totalStreak}/{milestone.days} Days</span>
                      </div>
                      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-gold/50 to-gold rounded-full transition-all duration-500" 
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Sparkle Glow effect for unlocked state */}
                {isUnlocked && (
                  <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none">
                    <div className="w-full h-full bg-gold/10 blur-xl rounded-full" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------- */}
      {/* GORGEOUS CELEBRATION MODAL OVERLAY */}
      {/* ------------------------------------------- */}
      <AnimatePresence>
        {unlockedMilestone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 40 }}
              transition={{ type: "spring", damping: 18 }}
              className="relative max-w-md w-full bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-900 border border-gold/40 rounded-3xl p-6 md:p-8 text-center space-y-6 shadow-2xl shadow-gold/20 overflow-hidden"
            >
              {/* Outer glowing aura */}
              <div className="absolute -inset-10 bg-gold/5 blur-3xl rounded-full pointer-events-none" />

              {/* Celebrating elements */}
              <div className="relative space-y-2">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gold/10 border border-gold/40 text-4xl mb-2 shadow-inner shadow-gold/10 animate-pulse">
                  {unlockedMilestone.badge}
                </div>
                <div className="text-[10px] font-mono tracking-widest text-gold font-bold uppercase">
                  ✨ NEW COSMIC MILESTONE UNLOCKED ✨
                </div>
                <h3 className="text-2xl font-serif text-white font-bold leading-tight">
                  {unlockedMilestone.title}
                </h3>
                <h4 className="text-base font-serif italic text-gold/95 tracking-wider">
                  {unlockedMilestone.sanskrit}
                </h4>
              </div>

              {/* Description quote box */}
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2 relative z-10 font-sans">
                <p className="text-xs text-slate-300 leading-relaxed">
                  {unlockedMilestone.desc}
                </p>
                <div className="border-t border-white/5 my-2 pt-2" />
                <p className="text-xs italic text-gold/80 font-serif">
                  "{unlockedMilestone.quote}"
                </p>
              </div>

              {/* Streak badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300 font-mono font-bold">
                <Flame size={12} className="text-amber-500" />
                <span>Achieved on a {unlockedMilestone.days}-Day Sadhana Streak</span>
              </div>

              {/* Claim / Blessings button */}
              <button
                onClick={() => setUnlockedMilestone(null)}
                className="w-full bg-gradient-to-r from-gold-dark via-gold to-gold-light text-cosmic-bg font-serif font-bold py-3 rounded-xl cursor-pointer hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 shadow-lg shadow-gold/20 text-xs uppercase tracking-wider"
              >
                <Sparkles size={14} />
                <span>Absorb Cosmic Blessing</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
