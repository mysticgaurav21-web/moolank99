import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Flame, Compass, AlertTriangle, CheckCircle, Volume2, Sparkles } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";

interface ChakraData {
  id: number;
  name: string;
  translation: string;
  sanskrit: string;
  element: string;
  seedSound: string;
  color: string;
  glowColor: string;
  untransmuted: string;
  sublimated: string;
  practice: string;
  physiological: string;
  spiritualInsight: string;
}

interface KundaliniChakraMapProps {
  streakDays: number;
  language?: string;
}

export default function KundaliniChakraMap({ streakDays, language = "english" }: KundaliniChakraMapProps) {
  const [selectedChakra, setSelectedChakra] = useState<number>(0);

  const chakras = useMemo<ChakraData[]>(() => {
    const isHinglish = language === "hinglish";
    return [
      {
        id: 1,
        name: isHinglish ? "Muladhara (मूलाधार)" : "Muladhara (Root Chakra)",
        translation: isHinglish ? "Root Support / Base of Spine" : "Root Support",
        sanskrit: "मूलाधार",
        element: isHinglish ? "Earth (Prithvi / पृथ्वी)" : "Earth (Prithvi)",
        seedSound: "LAM (लँ)",
        color: "#f87171", // Red
        glowColor: "rgba(248,113,113,0.4)",
        untransmuted: isHinglish 
          ? "Manasik restlessness, darr, gussa aur baar-baar physical attraction ke urges ka aana." 
          : "Severe sexual restlessness, fear, physical lethargy, and raw reactive impulses.",
        sublimated: isHinglish 
          ? "Unshakable vishwas, adbhut dharana shakti, physical strength, aur darr par vijay." 
          : "Grounded stability, massive physical stamina, unbreakable willpower, and dynamic fearlessness.",
        practice: isHinglish 
          ? "Mula Bandha (Anus muscles contraction), Ashwini Mudra, aur cold water shower." 
          : "Mula Bandha (Perineal Lock), Ashwini Mudra, and lower body hatha yoga poses (Tadasana).",
        physiological: isHinglish ? "Gonads, Adrenal Glands, aur Pelvic plexus nerve channels." : "Adrenal glands, pelvic nerve plexus, and cellular bone marrow density.",
        spiritualInsight: isHinglish 
          ? "Semen (Shukra) ka primal energy bank yahin hota hai. Isko lock karke hi urja upar uthti hai." 
          : "The foundational storehouse of sexual fluids. Locking this gate is the absolute prerequisite for sublimation."
      },
      {
        id: 2,
        name: isHinglish ? "Svadhishthana (स्वाधिष्ठान)" : "Svadhishthana (Sacral Chakra)",
        translation: isHinglish ? "Her Own Abode / Lower Abdomen" : "Her Own Abode",
        sanskrit: "स्वाधिष्ठान",
        element: isHinglish ? "Water (Apas / आपः)" : "Water (Apas)",
        seedSound: "VAM (वँ)",
        color: "#fb923c", // Orange
        glowColor: "rgba(251,146,60,0.4)",
        untransmuted: isHinglish 
          ? "Obsessive sexual thoughts, creative dryness, emotional mood swings, and digital addiction." 
          : "Fantasy obsession, heavy dream-state emissions, creative blockages, and emotional codependency.",
        sublimated: isHinglish 
          ? "Adbhut kalaatmak (artistic) kshamta, clear cognitive creativity, aur charm." 
          : "Superb aesthetic creativity, effortless wit, deep personal magnetics, and emotional autonomy.",
        practice: isHinglish 
          ? "Pranayama, Uddiyana Bandha, aur cold water application on lower abdomen." 
          : "Vajrasana, Paschimottanasana (seated forward bend), and deep retention-free Pranayama.",
        physiological: isHinglish ? "Prostate, Ovaries, Sacral nerve plexus." : "Prostate gland, lymphatic system, and pelvic circulation.",
        spiritualInsight: isHinglish 
          ? "Yahan shukra shakti sansarik kamvasna banti hai. Isko transmute karne se creative power milti hai." 
          : "Where raw reproductive vitality translates into creative life-force. Sublimation here fuels artistic genius."
      },
      {
        id: 3,
        name: isHinglish ? "Manipura (मणिपूर)" : "Manipura (Solar Plexus)",
        translation: isHinglish ? "City of Jewels / Navel" : "City of Jewels",
        sanskrit: "मणिपूर",
        element: isHinglish ? "Fire (Tejas / तेजस)" : "Fire (Tejas)",
        seedSound: "RAM (रँ)",
        color: "#facc15", // Yellow
        glowColor: "rgba(250,204,21,0.4)",
        untransmuted: isHinglish 
          ? "Kamzor hazma (digestion), laziness, aalsi man, aur egoistic tendencies." 
          : "Weak metabolic heat, physical laziness, indecision, and digestive toxins (Ama) buildup.",
        sublimated: isHinglish 
          ? "Prachand Jatharagni, high confidence, netritva (leadership) power, aur intense action drive." 
          : "Blazing digestive fire, peak physical energy, total self-confidence, and powerful leadership magnetism.",
        practice: isHinglish 
          ? "Uddiyana Bandha (Abdominal lock), Nauli Kriya, Surya Namaskar, aur ginger tea intake." 
          : "Uddiyana Bandha (Abdominal Vacuum), Kapalabhati, and intense core conditioning workouts.",
        physiological: isHinglish ? "Pancreas, Liver, Solar Plexus nerve bundle." : "Pancreas gland, digestion system, liver, and metabolic rate controllers.",
        spiritualInsight: isHinglish 
          ? "Sadhana ki aag (Tapas) yahin banti hai. Retained energy yahan aakar 'heat' bankar upar climb karti hai." 
          : "The furnace of Tapas. Sexual fluid is refined here by metabolic fire, turning into steam that climbs the spine."
      },
      {
        id: 4,
        name: isHinglish ? "Anahata (अनाहत)" : "Anahata (Heart Chakra)",
        translation: isHinglish ? "Unstruck Sound / Heart" : "Unstruck Sound",
        sanskrit: "अनाहत",
        element: isHinglish ? "Air (Vayu / वायु)" : "Air (Vayu)",
        seedSound: "YAM (यँ)",
        color: "#4ade80", // Green
        glowColor: "rgba(74,222,128,0.4)",
        untransmuted: isHinglish 
          ? "Selfishness, emotional pain, jealous nature, aur shallow breath patterns." 
          : "Selfishness, grief, constant anxiety, co-dependent attachment patterns, and shallow breathing.",
        sublimated: isHinglish 
          ? "Universal love, profound compassion, heavy emotional resilience, aur sweet sound tone." 
          : "Supreme empathy, deep cosmic connection, total psychological security, and a beautiful verbal vibration.",
        practice: isHinglish 
          ? "Anahata dhyan (Heart meditation), Bhastrika Pranayama, and acts of selfless service (Seva)." 
          : "Bhastrika Pranayama, chest-opening yoga postures (Ustrasana), and unconditional selfless service.",
        physiological: isHinglish ? "Thymus Gland, Cardiac Plexus, and lungs capacity." : "Thymus gland (core of immunity), cardiac nerve plexus, and alveolar capacity.",
        spiritualInsight: isHinglish 
          ? "Prana aur Veerya yahan aakar milte hain. Aura me aisi shanti banti hai jo doosron ko attract karti hai." 
          : "The bridge between physical and spiritual. Sublimated energy turns into pure love, creating a magnetic shield."
      },
      {
        id: 5,
        name: isHinglish ? "Vishuddha (विशुद्ध)" : "Vishuddha (Throat Chakra)",
        translation: isHinglish ? "Especially Pure / Throat" : "Especially Pure",
        sanskrit: "विशुद्ध",
        element: isHinglish ? "Space (Akasha / आकाश)" : "Space (Akasha)",
        seedSound: "HAM (हँ)",
        color: "#22d3ee", // Blue
        glowColor: "rgba(34,211,238,0.4)",
        untransmuted: isHinglish 
          ? "Vocal shakiness, stammering, fear of speech, aur toxic communications." 
          : "Vocal trembling, lying, inability to express, and throat/thyroid dysfunction.",
        sublimated: isHinglish 
          ? "Adbhut Swara Tejas (commanding voice), satyavaadita (truth-power), aur deep cell rejuvenation." 
          : "Commanding and resonant voice, absolute truth-speech (Saraswati Siddhi), and cellular detoxification.",
        practice: isHinglish 
          ? "Jalandhara Bandha (Chin lock), chanting OM with deep throat vibration, and Sarvangasana." 
          : "Jalandhara Bandha (Throat Lock), Khechari Mudra, thyroid-toning chants, and shoulder stand.",
        physiological: isHinglish ? "Thyroid, Parathyroid Glands, Pharyngeal nerve plexus." : "Thyroid and parathyroid glands, vocal cords, and lymphatic drainage pathways.",
        spiritualInsight: isHinglish 
          ? "Veerya ki shakti yahan aakar 'Nectar' me convert hoti hai, jo body ko complete youthfulness deti hai." 
          : "Here, sublimated power is converted into Amrita (cosmic nectar) which delays biological aging and purifies speech."
      },
      {
        id: 6,
        name: isHinglish ? "Ajna (आज्ञा)" : "Ajna (Third Eye Chakra)",
        translation: isHinglish ? "Command / Eyebrow Center" : "Command",
        sanskrit: "आज्ञा",
        element: isHinglish ? "Mind (Manas / मनस)" : "Mind",
        seedSound: "OM (ॐ)",
        color: "#818cf8", // Indigo
        glowColor: "rgba(129,140,248,0.4)",
        untransmuted: isHinglish 
          ? "Brain fog, low memory, night-emission dreams, aur constant mental distraction." 
          : "Severe brain fog, weak recall, chaotic dream state, and compulsive sensory distractions.",
        sublimated: isHinglish 
          ? "Medha Shakti (photographic memory), acute premonitions, laser focus, aur master sensory command." 
          : "Medha Shakti (super-intellect), supreme focal control, active premonitions, and complete dream control.",
        practice: isHinglish 
          ? "Shambhavi Mudra, Trataka (gazing at candle or ghee lamp), and deep third-eye dhyan." 
          : "Shambhavi Mahamudra, Trataka (fixed-point gazing), and direct pituitary gland meditation.",
        physiological: isHinglish ? "Pituitary Gland, Hypothalamus, Cavernous plexus." : "Pituitary gland (master controller), hypothalamus, and frontal lobe cortex volume.",
        spiritualInsight: isHinglish 
          ? "Mental focus ka ultimate peak. Sublimated energy yahan direct cognitive memory bank ban jati hai." 
          : "The seat of Medha. Direct conversion of seminal energy into neural networks of high intelligence."
      },
      {
        id: 7,
        name: isHinglish ? "Sahasrara (सहस्रार)" : "Sahasrara (Crown Chakra)",
        translation: isHinglish ? "Thousand-Petalled Lotus / Head Top" : "Thousand-Petalled Lotus",
        sanskrit: "सहस्रार",
        element: isHinglish ? "Pure Consciousness / चेतना" : "Pure Consciousness",
        seedSound: "OM / Silence (मौन)",
        color: "#a855f7", // Purple/Violet
        glowColor: "rgba(168,85,247,0.4)",
        untransmuted: isHinglish 
          ? "Sense of separation, spiritual vacuum, existential crisis, and mental fatigue." 
          : "Existential isolation, spiritual emptiness, severe mental depression, and lack of cosmic purpose.",
        sublimated: isHinglish 
          ? "Urdhvareta state achieved. Permanently happy mind, total silence, and connection with Divine." 
          : "The ultimate Urdhvareta state. Complete alchemical unification, absolute mental stillness, and self-realization.",
        practice: isHinglish 
          ? "Nirvikalpa Dhyan (silent thoughtless meditation) and Mahabandha (combining all locks)." 
          : "Nirvikalpa Dhyan (pure silence meditation), and Maha Bandha (the great triple lock).",
        physiological: isHinglish ? "Pineal Gland, Cerebral Cortex, Brain nervous grid." : "Pineal gland (source of melatonin/serotonin), cerebral cortex, and master nervous matrix.",
        spiritualInsight: isHinglish 
          ? "Sexual energy ka absolute final destination. Primal urge becomes spiritual illumination." 
          : "The final alchemical portal. Primal survival energy transforms fully into divine self-awareness."
      }
    ];
  }, [language]);

  const activeChakra = chakras[selectedChakra];
  const [activeToast, setActiveToast] = useState<string | null>(null);

  const transmutationData = useMemo(() => {
    const id = activeChakra.id;
    const primalUrge = Math.max(10, Math.round(90 - (id * 12) - (streakDays * 0.2)));
    const sublimationCoeff = Math.min(100, Math.round(15 + (id * 11) + (streakDays * 0.4)));
    const ojasRecharging = Math.min(100, Math.round(10 + (id * 13) + (streakDays * 0.3)));
    
    return [
      { name: "Primal Urge", value: primalUrge, color: "#f87171" },
      { name: "Sublimation", value: sublimationCoeff, color: "#fb923c" },
      { name: "Ojas Conversion", value: ojasRecharging, color: "#c084fc" }
    ];
  }, [activeChakra.id, streakDays]);

  const triggerMantraVibration = (text: string) => {
    setActiveToast(text);
    setTimeout(() => {
      setActiveToast((current) => current === text ? null : current);
    }, 4000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* LEFT SIDE: GRAPHICAL CHAKRA ASCENT TRACK */}
      <div className="lg:col-span-5 bg-white/[0.02] border border-white/5 rounded-3xl p-6 flex flex-col items-center relative overflow-hidden min-h-[580px] justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent pointer-events-none" />
        <h3 className="text-xs font-mono font-bold text-amber-500 tracking-widest uppercase mb-8 flex items-center gap-1.5 z-10">
          <Flame size={14} className="animate-pulse text-amber-500" /> Sushumna Nadi Ascent
        </h3>

        {/* Vertical Spine Pipeline Track */}
        <div className="relative w-24 h-[420px] flex items-center justify-center z-10">
          {/* Background spinal canal */}
          <div className="absolute w-1.5 h-full bg-neutral-900 border border-white/5 rounded-full" />
          
          {/* Active prana fluid glow rising depending on streak */}
          {(() => {
            const flowPct = Math.min(100, (streakDays / 120) * 100);
            return (
              <motion.div 
                className="absolute w-1 bg-gradient-to-t from-red-500 via-amber-400 via-emerald-400 via-cyan-400 to-purple-500 rounded-full bottom-0"
                style={{ 
                  height: `${flowPct}%`,
                  boxShadow: "0 0 12px rgba(212, 175, 55, 0.6)"
                }}
                animate={{ opacity: [0.6, 0.9, 0.6] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              />
            );
          })()}

          {/* Vertical Loop mapping each Chakra node */}
          <div className="absolute inset-0 flex flex-col justify-between items-center py-2">
            {chakras.slice().reverse().map((chakra, idx) => {
              const realIdx = 6 - idx; // reversed to show Sahasrara on top
              const isSelected = selectedChakra === realIdx;
              const isUnlocked = streakDays >= [0, 3, 7, 30, 60, 90, 120][realIdx];
              
              return (
                <button
                  key={chakra.id}
                  onClick={() => setSelectedChakra(realIdx)}
                  className="relative group cursor-pointer"
                >
                  {/* Glowing ring */}
                  <div 
                    className={`w-9.5 h-9.5 rounded-full border flex items-center justify-center transition-all ${
                      isSelected 
                        ? "bg-neutral-950 scale-110" 
                        : isUnlocked 
                          ? "bg-neutral-950/95 border-white/20 hover:border-white/50" 
                          : "bg-neutral-950 border-white/5 opacity-50"
                    }`}
                    style={{ 
                      boxShadow: isSelected ? `0 0 15px ${chakra.color}` : "none",
                      borderColor: isSelected ? chakra.color : undefined
                    }}
                  >
                    {/* Inner seed text */}
                    <span 
                      className="text-[9.5px] font-mono font-bold leading-none select-none"
                      style={{ color: isSelected || isUnlocked ? chakra.color : "#475569" }}
                    >
                      {chakra.seedSound.split(" ")[0]}
                    </span>
                  </div>

                  {/* Side Label */}
                  <div className={`absolute left-11 top-1/2 -translate-y-1/2 whitespace-nowrap px-2 py-0.5 rounded-md border text-[8.5px] font-mono font-bold transition-all flex items-center gap-1 ${
                    isSelected 
                      ? "bg-white/10 text-white border-white/20" 
                      : "bg-black/40 text-slate-500 border-white/5 group-hover:text-slate-300"
                  }`}>
                    <span className="w-1 h-1 rounded-full" style={{ backgroundColor: chakra.color }} />
                    {chakra.name.split(" ")[0]}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend bar */}
        <div className="mt-6 text-center text-[10px] font-mono text-slate-500 z-10 bg-neutral-950/80 px-3 py-1.5 rounded-full border border-white/5">
          Active Node: <span className="text-white font-bold">{chakras[Math.min(6, Math.floor(streakDays / 18))].name.split(" ")[0]}</span>
        </div>
      </div>

      {/* RIGHT SIDE: SELECTED CHAKRA DETAILS PANEL */}
      <div className="lg:col-span-7 bg-white/[0.02] border border-white/5 rounded-3xl p-6 lg:p-8 space-y-6 glow-purple relative min-h-[580px] flex flex-col justify-between">
        <div className="space-y-5 flex-1 flex flex-col justify-between">
          {/* Header */}
          <div className="space-y-1 pb-4 border-b border-white/5 relative">
            <div className="absolute top-0 right-0 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10 text-[9px] font-mono font-bold text-slate-400">
              ELEMENT: {activeChakra.element}
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider block" style={{ color: activeChakra.color }}>
              CHAKRA {activeChakra.id} • {activeChakra.translation}
            </span>
            <h4 className="text-xl font-serif font-bold text-white flex items-center gap-2">
              {activeChakra.name} 
              <span className="text-xs font-mono font-normal text-slate-500">({activeChakra.sanskrit})</span>
            </h4>
          </div>

          {/* Central Grid details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-1 flex-1">
            {/* Untransmuted */}
            <div className="bg-red-500/[0.01] border border-red-500/10 rounded-2xl p-4 space-y-2 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-red-400/30" />
              <h5 className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-widest flex items-center gap-1">
                <AlertTriangle size={12} /> Untransmuted (Descent Wave)
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {activeChakra.untransmuted}
              </p>
            </div>

            {/* Sublimated */}
            <div className="bg-emerald-500/[0.01] border border-emerald-500/10 rounded-2xl p-4 space-y-2 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-400/30" />
              <h5 className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                <CheckCircle size={12} /> Sublimated (Ojas Ascent)
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {activeChakra.sublimated}
              </p>
            </div>

            {/* Daily Sadhana practice */}
            <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 space-y-2 col-span-1 md:col-span-2 relative overflow-hidden">
              <h5 className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1">
                <Compass size={12} /> Alchemical Sublimation Practice
              </h5>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">
                {activeChakra.practice}
              </p>
            </div>

            {/* Transmutation Spectrum Chart */}
            <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 space-y-3 col-span-1 md:col-span-2 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <h5 className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1">
                  <Flame size={12} className="text-cyan-400 animate-pulse" /> Alchemical Transmutation Spectrum
                </h5>
                <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">Sublimation State</span>
              </div>
              <div className="h-28 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={transmutationData}
                    margin={{ top: 0, right: 10, left: -25, bottom: 0 }}
                  >
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      stroke="#64748b" 
                      fontSize={9} 
                      fontFamily="monospace"
                      tickLine={false}
                      axisLine={false}
                      width={100}
                    />
                    <RechartsTooltip
                      cursor={{ fill: "rgba(255,255,255,0.01)" }}
                      contentStyle={{
                        backgroundColor: "#0a0a0a",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "12px",
                        color: "#fff",
                        fontFamily: "monospace",
                        fontSize: "9px"
                      }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={8}>
                      {transmutationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {activeToast && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-cyan-950/40 border border-cyan-500/20 rounded-xl flex items-center gap-2.5"
            >
              <Sparkles size={14} className="text-cyan-400 animate-spin-slow shrink-0" />
              <p className="text-[11px] text-cyan-200 font-mono leading-normal">
                {activeToast}
              </p>
            </motion.div>
          )}

          {/* Footer section: Scientific correlate */}
          <div className="bg-neutral-950/80 border border-white/5 rounded-2xl p-4 space-y-3">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1 text-xs">
                <span className="text-[9px] font-mono text-slate-500 uppercase font-bold tracking-wider block">Physiological Plexus Link</span>
                <span className="text-slate-300 font-sans font-medium">{activeChakra.physiological}</span>
              </div>
              
              <button
                onClick={() => {
                  const synthText = language === "hinglish"
                    ? `Mantra "${activeChakra.seedSound}" ka dhyan lagayein. Spinal cord me vibration generate kijiye.`
                    : `Chant "${activeChakra.seedSound}" and focus at the chakra trigger point.`;
                  triggerMantraVibration(synthText);
                }}
                className="bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-xl text-[11.5px] font-mono font-bold text-white flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Volume2 size={12} className="text-gold" />
                <span>Mantra: {activeChakra.seedSound.split(" ")[0]}</span>
              </button>
            </div>

            <div className="text-[11px] text-slate-400 border-t border-white/5 pt-2 font-sans italic">
              <strong>Vedic Essence:</strong> {activeChakra.spiritualInsight}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
