import React, { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, Star, Award, ShieldAlert } from "lucide-react";

export default function ReferenceMatrix() {
  const [selectedNum, setSelectedNum] = useState<number>(1);

  const database: Record<number, {
    name: string;
    planet: string;
    deity: string;
    gem: string;
    colors: string[];
    friendly: number[];
    neutral: number[];
    enemy: number[];
    vibe: string;
    remedy: string;
  }> = {
    1: {
      name: "The Leader", planet: "Sun (Surya)", deity: "Lord Rama", gem: "Ruby (Manikya)",
      colors: ["Gold", "Orange", "Yellow"], friendly: [1, 2, 3, 9], neutral: [5, 6], enemy: [4, 7, 8],
      vibe: "Ambitious, pioneering, independent, and high determination, but can struggle with ego or impatience.",
      remedy: "Worship the rising Sun daily and respect teachers/father."
    },
    2: {
      name: "The Peacemaker", planet: "Moon (Chandra)", deity: "Lord Shiva", gem: "Pearl (Moti)",
      colors: ["White", "Silver", "Sea Green"], friendly: [1, 2, 3, 5], neutral: [6, 8, 9], enemy: [4, 7],
      vibe: "Sensitive, cooperative, intuitive, and highly artistic, but prone to frequent emotional fluctuations.",
      remedy: "Pour water on a plant daily and keep a silver coin."
    },
    3: {
      name: "The Guru", planet: "Jupiter (Guru)", deity: "Lord Vishnu", gem: "Yellow Sapphire (Pukhraj)",
      colors: ["Yellow", "Golden", "Pink"], friendly: [1, 2, 3, 9], neutral: [5, 7], enemy: [4, 6, 8],
      vibe: "Wise, expressive, cheerful, highly intellectual, but prone to scattering energies or being too preachy.",
      remedy: "Wear yellow on Thursdays and honor elders."
    },
    4: {
      name: "The Rebel", planet: "Rahu", deity: "Lord Ganesha", gem: "Hessonite (Gomed)",
      colors: ["Blue", "Grey", "Brown"], friendly: [5, 6, 8], neutral: [7, 3], enemy: [1, 2, 9],
      vibe: "Unconventional, analytical, revolutionary, system builders, but prone to sudden changes and isolation.",
      remedy: "Feed black stray dogs and practice grounding yoga."
    },
    5: {
      name: "The Messenger", planet: "Mercury (Budha)", deity: "Lord Vishnu", gem: "Emerald (Panna)",
      colors: ["Green", "Turquoise"], friendly: [1, 2, 4, 6, 8], neutral: [3, 7, 9], enemy: [],
      vibe: "Versatile, commercial genius, excellent speaker, quick-witted, but easily bored and restless.",
      remedy: "Feed green grass to cows on Wednesdays and support students."
    },
    6: {
      name: "The Nurturer", planet: "Venus (Shukra)", deity: "Goddess Lakshmi", gem: "Diamond (Heera)",
      colors: ["Pink", "White", "Light Blue"], friendly: [5, 8, 9], neutral: [1, 2, 3, 7], enemy: [4],
      vibe: "Charming, artistic, romantic, family-centric, magnetic, but can be highly stubborn or overly protective.",
      remedy: "Donate white items like rice or sugar on Fridays."
    },
    7: {
      name: "The Mystic", planet: "Ketu", deity: "Lord Shiva", gem: "Cat's Eye (Lahsuniya)",
      colors: ["Pastel Grey", "Light Yellow"], friendly: [1, 2, 3, 5], neutral: [6, 9], enemy: [4, 8],
      vibe: "Introspective, spiritual, deep researchers, mystical insights, but prone to anxiety and detachment.",
      remedy: "Spend time in silent meditation and help physically challenged."
    },
    8: {
      name: "The Architect", planet: "Saturn (Shani)", deity: "Lord Hanuman", gem: "Blue Sapphire (Neelam)",
      colors: ["Dark Blue", "Black", "Purple"], friendly: [5, 6], neutral: [3, 7], enemy: [1, 2, 4, 9],
      vibe: "Disciplined, patient, philosophical, durable executioners, facing early delays leading to massive late success.",
      remedy: "Recite Shani Chalisa on Saturdays and be extremely fair to workers."
    },
    9: {
      name: "The Warrior", planet: "Mars (Mangal)", deity: "Lord Hanuman", gem: "Red Coral (Moonga)",
      colors: ["Red", "Orange", "White"], friendly: [1, 2, 3, 6], neutral: [5, 7], enemy: [4, 8],
      vibe: "Courageous, protective, humanitarian, action-oriented dynamos, but prone to short temper or impulsive action.",
      remedy: "Donate blood, help siblings, and wear red on Tuesdays."
    }
  };

  const selectedData = database[selectedNum];

  return (
    <div id="reference-matrix-wrapper" className="space-y-6">
      <div className="bg-white/[0.02] backdrop-blur-md rounded-2xl border border-white/5 p-6 glow-purple text-center space-y-2">
        <h3 className="text-xl font-serif font-semibold text-white tracking-tight">The 9 Master Vibrations</h3>
        <p className="text-xs text-slate-400">Select any Moolank to explore its cosmic signatures, rulers, friendly numbers, and karma remedies.</p>
      </div>

      {/* Grid of Number Buttons */}
      <div className="grid grid-cols-5 md:grid-cols-9 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
          const isSelected = selectedNum === num;
          return (
            <motion.button
              key={num}
              id={`ref-btn-${num}`}
              onClick={() => setSelectedNum(num)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={`relative w-full py-3.5 rounded-xl font-mono text-base font-bold tracking-wider cursor-pointer transition-all flex items-center justify-center ${
                isSelected
                  ? "text-cosmic-bg font-black"
                  : "bg-neutral-950 border border-white/10 text-slate-400 hover:text-white hover:border-gold/30"
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="active-matrix-num"
                  className="absolute inset-0 bg-gradient-to-br from-gold-light via-gold to-gold-dark rounded-xl glow-gold"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}
              <span className="relative z-10">{num}</span>
            </motion.button>
          );
        })}
      </div>

      <motion.div
        key={selectedNum}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
      >
        {/* Main Details */}
        <div className="lg:col-span-8 bg-white/[0.02] backdrop-blur-md rounded-2xl border border-white/5 p-6 space-y-6 glow-purple">
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-mono text-2xl font-bold text-gold">
              {selectedNum}
            </span>
            <div>
              <h4 className="text-lg font-serif font-bold text-white tracking-tight">{selectedData.name}</h4>
              <p className="text-xs text-slate-400 uppercase tracking-widest">Ruled by {selectedData.planet}</p>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed font-sans">{selectedData.vibe}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-neutral-950/50 border border-white/5 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Planetary Deity</span>
              <p className="text-xs font-semibold text-white">{selectedData.deity}</p>
            </div>
            <div className="p-4 bg-neutral-950/50 border border-white/5 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Gemstone Recommendation</span>
              <p className="text-xs font-semibold text-gold">{selectedData.gem}</p>
            </div>
            <div className="p-4 bg-neutral-950/50 border border-white/5 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Lucky Colors</span>
              <p className="text-xs font-semibold text-cyan-400">{selectedData.colors.join(", ")}</p>
            </div>
          </div>

          <div className="p-4 bg-white/[0.02] border border-gold/15 rounded-xl space-y-2">
            <span className="text-xs font-bold text-gold flex items-center gap-1">
              <Sparkles size={14} fill="currentColor" /> Recommended Karma Remedy / Daily Sadhana
            </span>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">{selectedData.remedy}</p>
          </div>
        </div>

        {/* Compatible numbers sidebar */}
        <div className="lg:col-span-4 bg-white/[0.02] backdrop-blur-md rounded-2xl border border-white/5 p-6 space-y-6 glow-purple flex flex-col justify-between">
          <h5 className="text-sm font-serif font-semibold text-slate-400 uppercase tracking-widest text-center">Compatible Vectors</h5>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-xs text-emerald-400 font-bold tracking-wide flex items-center gap-1.5">
                <Star size={14} className="fill-emerald-400" /> Friendly
              </span>
              <div className="flex gap-1.5">
                {selectedData.friendly.map((n) => (
                  <span key={n} className="w-6 h-6 rounded-lg bg-emerald-950/30 border border-emerald-500/20 flex items-center justify-center font-mono text-xs font-bold text-emerald-400">{n}</span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-xs text-slate-400 font-bold tracking-wide flex items-center gap-1.5">
                <Award size={14} /> Neutral
              </span>
              <div className="flex gap-1.5">
                {selectedData.neutral.map((n) => (
                  <span key={n} className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-mono text-xs font-bold text-slate-400">{n}</span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pb-1">
              <span className="text-xs text-rose-400 font-bold tracking-wide flex items-center gap-1.5">
                <ShieldAlert size={14} /> Enemy
              </span>
              <div className="flex gap-1.5">
                {selectedData.enemy.length > 0 ? selectedData.enemy.map((n) => (
                  <span key={n} className="w-6 h-6 rounded-lg bg-rose-950/30 border border-rose-500/20 flex items-center justify-center font-mono text-xs font-bold text-rose-400">{n}</span>
                )) : (
                  <span className="text-xs text-slate-500 italic">None</span>
                )}
              </div>
            </div>
          </div>

          <p className="text-[10px] text-slate-500 leading-relaxed font-sans text-center mt-4 border-t border-white/5 pt-4">
            Keep friendly numbers close for partnerships. Take caution or establish solid clarity during direct business with enemy vectors.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
