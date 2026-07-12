import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, Brain, Shield, Sparkles, Zap, Activity } from "lucide-react";

interface BrahmacharyaScienceLibraryProps {
  language?: string;
}

export default function BrahmacharyaScienceLibrary({ language = "english" }: BrahmacharyaScienceLibraryProps) {
  const isHinglish = language === "hinglish";
  const [activeDhatuIndex, setActiveDhatuIndex] = useState<number>(0);

  const dhatus = [
    { name: "Rasa", sanskrit: "रस", translation: "Plasma / Chyme", day: "Days 1-5", color: "from-blue-500 to-cyan-500", desc: "The fluid essence of digested food. Nourishes body temperature, cell hydration, and baseline blood volume.", tip: "Drink pure copper-charged water at dawn." },
    { name: "Rakta", sanskrit: "रक्त", translation: "Blood / Oxygen", day: "Days 5-10", color: "from-red-500 to-rose-500", desc: "Refined blood cells carrying vital oxygen and metabolic fire (Agni) to warm organs and ignite energy.", tip: "Eat organic iron-rich foods and do Surya Namaskar." },
    { name: "Mamsa", sanskrit: "मांस", translation: "Muscle", day: "Days 10-15", color: "from-orange-500 to-amber-500", desc: "Muscular tissue wrapping the skeletal system. Gives physical strength, agility, and motor control.", tip: "Practice weight resistance training or Hatha Yoga." },
    { name: "Meda", sanskrit: "मेद", translation: "Adipose / Fat", day: "Days 15-20", color: "from-yellow-500 to-yellow-600", desc: "Lubricating healthy lipids that wrap around internal organs and isolate nervous pathways.", tip: "Consume premium Ghee and healthy nut fats." },
    { name: "Asthi", sanskrit: "अस्थि", translation: "Bone", day: "Days 20-25", color: "from-stone-500 to-slate-500", desc: "Dense structural bones supporting the skeleton, creating posture gravity, and grounding energies.", tip: "Gaze at the morning rising sun for Vitamin D3." },
    { name: "Majja", sanskrit: "मज्जा", translation: "Bone Marrow & Nerves", day: "Days 25-30", color: "from-teal-500 to-emerald-500", desc: "The inner marrow tissue. Builds red blood cells and constructs the vital myelin sheaths of nerves.", tip: "Practice deep, silent Anulom-Vilom pranayama." },
    { name: "Shukra", sanskrit: "शुक्र", translation: "Seminal / Vital fluid", day: "Days 30-35", color: "from-pink-500 to-purple-500", desc: "The supreme biological extract representing maximum potential energy and raw creative drive.", tip: "Do Drishti Sanyam and protect sensory triggers." },
    { name: "OJAS", sanskrit: "ओजस्", translation: "Spiritual Aura / Shield", day: "Permanent", color: "from-amber-400 via-yellow-400 to-amber-500", desc: "The ultimate alchemical nectar. Radiates as a golden bio-magnetic shield around your subtle body.", tip: "Mantra: OM URDHVARETAYA NAMAH internally." }
  ];

  const currentDhatu = dhatus[activeDhatuIndex];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      {/* ANCIENT VEDIC WISDOM CARD */}
      <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 lg:p-8 space-y-6 glow-purple relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <h3 className="text-xs font-mono font-bold text-amber-500 tracking-widest uppercase flex items-center gap-1.5 z-10 relative">
          <BookOpen size={14} /> Ancient Vedic Scriptures
        </h3>
        
        <div className="space-y-4 text-xs font-sans leading-relaxed text-slate-300 relative z-10">
          <div className="border-l-2 border-amber-500/40 pl-3 italic text-white font-serif bg-white/[0.01] p-3 rounded-r-xl">
            "ब्रह्मचर्यप्रतिष्ठायां वीर्यलाभः" <br/>
            <span className="text-[10px] font-mono text-slate-500 not-italic block mt-1">— Patanjali Yoga Sutras, 2.38</span>
            <p className="not-italic text-[11px] text-slate-300 font-sans mt-1">
              {isHinglish 
                ? "\"Brahmacharya par dheet sthapit hone se infinite, atulya vital energy aur tejasvi buddhi prapt hoti hai.\"" 
                : "\"On being firmly established in Brahmacharya (sexual containment), infinite, unyielding vital vigor and physical-mental stamina is attained.\""}
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-white text-[11px] uppercase tracking-wider font-mono">The Shukra to Ojas Transformation Cycle</h4>
            <p className="text-[11px] text-slate-400">
              The Ayurvedic sages (in Charaka Samhita) teach that consumed food goes through seven progressive refining tissue transformations (Dhatus) before reaching final spiritual containment:
            </p>

            {/* Interactive Seven Dhatus pipeline */}
            <div className="bg-neutral-950/80 border border-white/5 p-4 rounded-2xl space-y-4">
              <span className="text-[9px] text-amber-500 font-mono tracking-wider uppercase font-bold block">
                Interactive Alchemical Pathway (Dhatu-Urdhvareta)
              </span>
              
              {/* Horizontal scroll / overflow-x-auto list of nodes */}
              <div className="flex gap-2.5 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-white/10 snap-x">
                {dhatus.map((d, index) => {
                  const isActive = activeDhatuIndex === index;
                  return (
                    <button
                      key={d.name}
                      type="button"
                      onClick={() => setActiveDhatuIndex(index)}
                      className={`flex-shrink-0 snap-center px-3 py-2 rounded-xl text-left border transition-all duration-300 w-[110px] relative cursor-pointer ${
                        isActive
                          ? "bg-white/[0.04] border-amber-400/40 shadow-[0_0_12px_rgba(212,175,55,0.15)]"
                          : "bg-black/40 border-white/5 hover:border-white/10"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">
                          Step {index + 1}
                        </span>
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        )}
                      </div>
                      <h5 className={`text-[12px] font-bold mt-1 ${isActive ? "text-amber-400" : "text-slate-300"}`}>
                        {d.name}
                      </h5>
                      <span className="text-[8px] font-mono text-slate-500 block truncate">
                        {d.day}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Detail view of active Dhatu with Framer Motion transitions */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeDhatuIndex}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white/[0.01] border border-white/5 rounded-xl p-4 space-y-3 relative overflow-hidden text-left"
                >
                  <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-10 bg-gradient-to-br ${currentDhatu.color}`} />
                  
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono font-black text-amber-400">
                          {currentDhatu.sanskrit}
                        </span>
                        <h6 className="text-xs font-bold text-white">
                          {currentDhatu.name} <span className="text-[9px] text-slate-400 font-normal">({currentDhatu.translation})</span>
                        </h6>
                      </div>
                      <span className="text-[9px] font-mono font-bold uppercase text-slate-400 tracking-wider">
                        Maturation Time: {currentDhatu.day}
                      </span>
                    </div>

                    <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                      Phase {activeDhatuIndex + 1} / 8
                    </span>
                  </div>

                  <p className="text-[10.5px] text-slate-300 leading-normal font-sans">
                    {currentDhatu.desc}
                  </p>

                  <div className="bg-amber-500/5 border border-amber-500/10 p-2 rounded-lg flex items-start gap-2 text-[10px] font-sans">
                    <Zap size={12} className="text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-amber-200/90 leading-relaxed">
                      <strong>Daily Alchemical Sadhana:</strong> {currentDhatu.tip}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <p className="text-[11px] text-slate-400">
              It takes 30 days and 40 drops of blood to create 1 drop of Shukra. When Shukra is retained and sublimated, it turns into <strong>Ojas</strong>—a super-refined spiritual nectar that rises up the spinal canal (Sushumna) and nourishes the pineal and pituitary glands, bathing the brain in creative genius.
            </p>
          </div>

          <div className="bg-neutral-950/40 p-3 rounded-xl border border-white/5 text-[11px] text-slate-400">
            <strong>Prashna Upanishad:</strong> "By Tapas (austerity), Brahmacharya (continence), and Shraddha (unshakable trust), one conquers the cosmic sun and achieves permanent mastery over mind and decay."
          </div>
        </div>
      </div>

      {/* MODERN NEUROSCIENCE & PHYSIOLOGICAL CORRELATES */}
      <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 lg:p-8 space-y-6 glow-purple relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <h3 className="text-xs font-mono font-bold text-cyan-400 tracking-widest uppercase flex items-center gap-1.5 z-10 relative">
          <Brain size={14} /> Modern Neuroscience Correlates
        </h3>

        <div className="space-y-4 text-xs font-sans leading-relaxed text-slate-300 relative z-10">
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-neutral-950/60 border border-white/5 p-4 rounded-2xl space-y-1.5">
              <span className="text-[9px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">Dopamine Homeostasis & Reset</span>
              <p className="text-[11px] text-slate-400">
                Constant exposure to adult visual triggers floods the brain with unnatural dopamine, desensitizing the dopamine D2 receptors. Celibacy allows receptors to upregulate, completely clearing brain fog and restoring genuine motivation.
              </p>
            </div>

            <div className="bg-neutral-950/60 border border-white/5 p-4 rounded-2xl space-y-1.5">
              <span className="text-[9px] font-mono text-amber-500 font-bold uppercase tracking-wider block">Prefrontal Cortex Gray Matter Volume</span>
              <p className="text-[11px] text-slate-400">
                Neuroimaging scans of individuals practicing long-term sexual self-command show increased gray matter density in the prefrontal cortex—the exact seat of willpower, long-term planning, and emotional regulation.
              </p>
            </div>

            <div className="bg-neutral-950/60 border border-white/5 p-4 rounded-2xl space-y-1.5">
              <span className="text-[9px] font-mono text-purple-400 font-bold uppercase tracking-wider block">Androgen Receptor Density in Brain Cells</span>
              <p className="text-[11px] text-slate-400">
                Semen retention triggers upregulation of androgen receptors in the temporal lobe and motor cortex. This enables the nervous system to utilize testosterone far more efficiently, facilitating deep focus and unshakeable confidence.
              </p>
            </div>
          </div>

          <div className="bg-neutral-950/40 p-3 rounded-xl border border-white/5 text-[11px] text-slate-400 text-center">
            <strong>The Biological Seal:</strong> The conservation of seminal lecithin, zinc, and vital lipids directly aids in the synthesis of the myelin sheath—the insulating layer protecting all nerve transmission pathways.
          </div>
        </div>
      </div>

      {/* THE FOUR PILLARS OF DAILY SADHANA ARMOR */}
      <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 lg:p-8 space-y-6 glow-purple col-span-1 md:col-span-2 relative overflow-hidden">
        <h3 className="text-xs font-mono font-bold text-gold tracking-widest uppercase flex items-center gap-1.5 z-10 relative">
          <Shield size={14} /> The Four Pillars of Daily Sadhana Armor
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 z-10 relative">
          <div className="bg-neutral-950/40 border border-white/5 p-4 rounded-2xl space-y-2 text-xs">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-gold flex items-center justify-center font-bold font-mono">1</div>
            <h5 className="font-bold text-white font-mono uppercase tracking-wider text-[11px]">Brahma Muhurta</h5>
            <p className="text-slate-400 leading-relaxed text-[11px] font-sans">
              Wake up between 4:00 AM and 5:30 AM when cosmic prana is clean. It is the gold window for effortless meditation, study, or creative coding before sensory noise begins.
            </p>
          </div>

          <div className="bg-neutral-950/40 border border-white/5 p-4 rounded-2xl space-y-2 text-xs">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold font-mono">2</div>
            <h5 className="font-bold text-white font-mono uppercase tracking-wider text-[11px]">Cold Water Therapy</h5>
            <p className="text-slate-400 leading-relaxed text-[11px] font-sans">
              Take cold showers immediately upon waking or when hit by a severe craving. Cold water instantly forces peripheral blood to surge back to your inner core, breaking any nervous reflex triggers.
            </p>
          </div>

          <div className="bg-neutral-950/40 border border-white/5 p-4 rounded-2xl space-y-2 text-xs">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold font-mono">3</div>
            <h5 className="font-bold text-white font-mono uppercase tracking-wider text-[11px]">Drishti Sanyam</h5>
            <p className="text-slate-400 leading-relaxed text-[11px] font-sans">
              Control of visual sensory pathways. Avoid staring at hyper-stimulating images or short video loops. Visual impressions represent 80% of all subconscious mental agitation.
            </p>
          </div>

          <div className="bg-neutral-950/40 border border-white/5 p-4 rounded-2xl space-y-2 text-xs">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold font-mono">4</div>
            <h5 className="font-bold text-white font-mono uppercase tracking-wider text-[11px]">Pranic Transmutation</h5>
            <p className="text-slate-400 leading-relaxed text-[11px] font-sans">
              Do not let raw sexual heat sit stagnantly in your root. Channel it upwards using Mula Bandha, box breathing, heavy resistance workouts, or intense scriptural reflection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
