import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Sparkles, RefreshCw, RotateCcw, Compass, Shield, Activity, Flame } from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from "recharts";

interface OjasQuotientQuizProps {
  language?: string;
}

export default function OjasQuotientQuiz({ language = "english" }: OjasQuotientQuizProps) {
  const [quizAnswers, setQuizAnswers] = useState<number[]>([3, 3, 3, 3, 3]);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [calculatingQuiz, setCalculatingQuiz] = useState<boolean>(false);

  const questions = [
    {
      q: language === "hinglish" 
        ? "1. Indriya Sanyam: Triggers aur Stimulating digital content se dhyan hatane me kitni aasani hoti hai?" 
        : "1. Indriya Sanyam: How easily do you steer away from highly stimulating digital feeds, triggers, or sensory cravings?",
      low: language === "hinglish" ? "Chhatpatahat / Immediate Surrender" : "Instant surrender / Weak resistance",
      high: language === "hinglish" ? "Unshakable, Shant man" : "Unshakable, calm focus"
    },
    {
      q: language === "hinglish" 
        ? "2. Prataha Urja: Subah (Brahma Muhurta) ke waqt physical body kaisa feel karti hai?" 
        : "2. Prataha Urja: How does your physical frame feel immediately upon waking up early in the morning?",
      low: language === "hinglish" ? "Bhari pan / Low Vitality" : "Heavy / Sluggish / Foggy",
      high: language === "hinglish" ? "Halka aur crisp absolute energetic" : "Super light, alert & crisp energy"
    },
    {
      q: language === "hinglish" 
        ? "3. Manas Shuddhi: Karya ke samay kitni baar compulsive urges mind distract karti hain?" 
        : "3. Manas Shuddhi: How often do involuntary sexual fantasies or intrusive thoughts disrupt your silent focus?",
      low: language === "hinglish" ? "Hamesha, Brain fog" : "Constant distraction / Brain fog",
      high: language === "hinglish" ? "Perfect silence / Laser clarity" : "Pristine mental peace"
    },
    {
      q: language === "hinglish" 
        ? "4. Tejas Swara: Kya voice ki gambhirta ya face aura brightness me progress lagti hai?" 
        : "4. Tejas Swara: Have you noticed deep vocal resonance or brightness (aura glow) in your skin and eyes?",
      low: language === "hinglish" ? "Weak voice / Dull eyes" : "Weak voice / Pale aura",
      high: language === "hinglish" ? "Magnetic deep voice / Radiant glow" : "Commanding resonance / Bright skin glow"
    },
    {
      q: language === "hinglish" 
        ? "5. Dharana Bala: Stress, gussa aur sudden mental triggers par react kaisa hota hai?" 
        : "5. Dharana Bala: How is your psychological resilience and patience when hit by sudden anger or stress?",
      low: language === "hinglish" ? "Turant gussa / Deep anxiety" : "Explosive response / Deep anxiety",
      high: language === "hinglish" ? "Shant, Witness/Sakshi observation" : "Unshakable patient observer"
    }
  ];

  const handleCalculate = () => {
    setCalculatingQuiz(true);
    setTimeout(() => {
      setCalculatingQuiz(false);
      setQuizSubmitted(true);
    }, 1200);
  };

  const handleReset = () => {
    setQuizAnswers([3, 3, 3, 3, 3]);
    setQuizSubmitted(false);
  };

  // Score calculation
  const totalPoints = quizAnswers.reduce((a, b) => a + b, 0);
  const ojasPct = Math.round((totalPoints / 25) * 100);

  // Breakdown sub-indices (scaled 0-100)
  const pranaIndex = Math.round(((quizAnswers[0] + quizAnswers[1]) / 10) * 100);
  const tejasIndex = Math.round(((quizAnswers[2] + quizAnswers[3]) / 10) * 100);
  const ojasIndex = Math.round(((quizAnswers[4] + quizAnswers[1]) / 10) * 100);

  let stateLabel = "";
  let stateColor = "";
  let stateDescription = "";

  if (ojasPct >= 85) {
    stateLabel = language === "hinglish" ? "GOLDEN OJAS SHIELD (दिव्य ओजस)" : "GOLDEN OJAS SHIELD (Siddha)";
    stateColor = "text-amber-400";
    stateDescription = language === "hinglish" 
      ? "Aapki vital urja supreme divine levels par hai. Apka Swara command prachand hai aur magnetic presence natural command commands karti hai." 
      : "Your life energy is fully alchemized into spiritual armor. Brain cells are myelinated, and your prefrontal cortex commands pristine operational control.";
  } else if (ojasPct >= 60) {
    stateLabel = language === "hinglish" ? "FIRE TEJAS FORCE (तेजस्वी)" : "FIRE TEJAS FORCE (Tejasvi)";
    stateColor = "text-orange-400";
    stateDescription = language === "hinglish" 
      ? "Mind me focus accha hai aur energy levels active hain. Is retained force ko physical workouts ya scriptures study me flow karein." 
      : "Your cognitive drive and confidence are highly refined. Maintain strict eyes control (Drishti Sanyam) to refine this power into absolute, permanent Ojas.";
  } else if (ojasPct >= 40) {
    stateLabel = language === "hinglish" ? "STABLE PRANA RHYTHM (प्राणिक स्थिरता)" : "STABLE PRANA RHYTHM (Sadhak)";
    stateColor = "text-emerald-400";
    stateDescription = language === "hinglish" 
      ? "Apna basic energetic baseline stable hai, par waves ke dauran dhyan bhatakta hai. Pranayama and Ashwini Mudra par dhyan badhayein." 
      : "Basic bio-physical baseline is intact, but restless thought waves arise occasionally. Practice Uddiyana Bandha to pull the physical energies upward.";
  } else {
    stateLabel = language === "hinglish" ? "RESTLESS RAJASIC WAVES (चंचल प्राण)" : "RESTLESS RAJASIC WAVES (Rajasic)";
    stateColor = "text-red-400";
    stateDescription = language === "hinglish" 
      ? "Prana abhi unstable hai aur sensory organs dhyan distract kar rhe hain. Immediate cold water splash and mantras chanting jaruri hai." 
      : "Vata/Rajas forces are heavily agitated in your base plexus. Seminal energy is leaking into mental fantasies. Instantly reduce stimulants and practice SOS Box Breath.";
  }

  return (
    <div className="space-y-8">
      {!quizSubmitted ? (
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 lg:p-8 space-y-6 glow-purple">
          <div className="border-b border-white/5 pb-4 space-y-1 text-center max-w-xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-gold text-[10px] uppercase font-mono font-bold tracking-wider">
              <Sparkles size={12} /> Vedic Energy Checkup
            </span>
            <h3 className="text-xl font-serif font-bold text-white">Ojas Quotient self-assessment</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Diagnose your current alchemical containment index on three crucial axes: Prana (respiratory force), Tejas (focus combustion), and Ojas (immunity shield).
            </p>
          </div>

          <div className="space-y-6 max-w-3xl mx-auto pt-4">
            {questions.map((item, idx) => (
              <div key={idx} className="bg-neutral-950/40 border border-white/5 p-5 rounded-2xl space-y-3">
                <h4 className="text-xs font-mono font-bold text-white leading-relaxed">{item.q}</h4>
                <div className="grid grid-cols-5 gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map((val) => {
                    const isActive = quizAnswers[idx] === val;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => {
                          const newAns = [...quizAnswers];
                          newAns[idx] = val;
                          setQuizAnswers(newAns);
                        }}
                        className={`py-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                          isActive 
                            ? "bg-amber-500 text-black border-amber-400 shadow-[0_0_10px_rgba(212,175,55,0.4)]" 
                            : "bg-neutral-950/80 border-white/5 text-slate-400 hover:border-white/10"
                        }`}
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
                <div className="flex justify-between text-[8px] text-slate-500 font-mono">
                  <span>{item.low}</span>
                  <span>{item.high}</span>
                </div>
              </div>
            ))}

            <div className="text-center pt-4">
              <button
                onClick={handleCalculate}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold px-8 py-3 rounded-xl text-xs uppercase tracking-widest font-mono transition-all shadow-lg cursor-pointer flex items-center gap-2 mx-auto"
                disabled={calculatingQuiz}
              >
                {calculatingQuiz ? (
                  <>
                    <RefreshCw className="animate-spin" size={14} />
                    <span>Aligning Pranic Grid...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    <span>Calculate Ojas Quotient</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 lg:p-8 space-y-6 glow-purple">
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="text-center space-y-2">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">DIAGNOSTIC REPORT</span>
              <h3 className="text-2xl font-serif font-black text-white">Your Alchemical Energy Signature</h3>
              <p className={`text-xs sm:text-sm font-mono font-bold uppercase tracking-wider ${stateColor}`}>{stateLabel}</p>
            </div>

            {/* Central Gauge Card */}
            <div className="bg-neutral-950/80 border border-white/5 rounded-3xl p-6 text-center space-y-6 max-w-2xl mx-auto relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent pointer-events-none" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                
                {/* Column 1: Circular Progress Ring */}
                <div className="space-y-4">
                  <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                      <circle cx="72" cy="72" r="64" stroke="rgba(255,255,255,0.02)" strokeWidth="6" fill="transparent" />
                      <circle 
                        cx="72" 
                        cy="72" 
                        r="64" 
                        stroke="#D4AF37" 
                        strokeWidth="6" 
                        fill="transparent" 
                        strokeDasharray={2 * Math.PI * 64} 
                        strokeDashoffset={2 * Math.PI * 64 * (1 - ojasPct / 100)} 
                        className="transition-all duration-1000" 
                        style={{ filter: "drop-shadow(0 0 6px #D4AF37)" }} 
                      />
                    </svg>
                    <div className="flex flex-col items-center">
                      <span className="text-4xl font-mono font-black text-white">{ojasPct}%</span>
                      <span className="text-[8px] font-mono text-slate-500 tracking-widest uppercase">OJAS QUOTIENT</span>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    Overall Alchemical Containment
                  </div>
                </div>

                {/* Column 2: Recharts Radar Chart */}
                <div className="h-44 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
                      { subject: "Prana (Breath)", value: pranaIndex },
                      { subject: "Tejas (Focus)", value: tejasIndex },
                      { subject: "Ojas (Aura)", value: ojasIndex }
                    ]}>
                      <PolarGrid stroke="rgba(255, 255, 255, 0.08)" />
                      <PolarAngleAxis 
                        dataKey="subject" 
                        stroke="#94a3b8" 
                        fontSize={9} 
                        fontFamily="monospace"
                      />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(255, 255, 255, 0.12)" fontSize={7} />
                      <Radar 
                        name="Alchemical Level" 
                        dataKey="value" 
                        stroke="#D4AF37" 
                        fill="#D4AF37" 
                        fillOpacity={0.25} 
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans px-4 border-t border-white/5 pt-4">
                {stateDescription}
              </p>
            </div>

            {/* Three Core Indices Progress meters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-neutral-950/40 border border-white/5 p-4 rounded-2xl space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono font-bold text-slate-400 uppercase">
                  <span>Prana (Vital Force)</span>
                  <span className="text-emerald-400">{pranaIndex}%</span>
                </div>
                <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400" style={{ width: `${pranaIndex}%` }} />
                </div>
                <span className="text-[9px] text-slate-500 leading-tight block font-sans">Physical respiration, breath rhythm, and raw life-span cellular energy.</span>
              </div>

              <div className="bg-neutral-950/40 border border-white/5 p-4 rounded-2xl space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono font-bold text-slate-400 uppercase">
                  <span>Tejas (Intellectual Brilliance)</span>
                  <span className="text-orange-400">{tejasIndex}%</span>
                </div>
                <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-400" style={{ width: `${tejasIndex}%` }} />
                </div>
                <span className="text-[9px] text-slate-500 leading-tight block font-sans">Frontal brain metabolism, cognitive photographic recall, and vocal gravity.</span>
              </div>

              <div className="bg-neutral-950/40 border border-white/5 p-4 rounded-2xl space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono font-bold text-slate-400 uppercase">
                  <span>Ojas (Spiritual Immunity)</span>
                  <span className="text-amber-400">{ojasIndex}%</span>
                </div>
                <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400" style={{ width: `${ojasIndex}%` }} />
                </div>
                <span className="text-[9px] text-slate-500 leading-tight block font-sans">Subtle bio-magnetic field (Aura shield), cell immunity, and mental peace.</span>
              </div>
            </div>

            {/* Alchemical prescription card */}
            <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 space-y-2">
              <h4 className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1.5">
                <Compass size={14} /> Vedic Alchemical Prescription
              </h4>
              <ul className="text-xs text-slate-300 space-y-2 list-disc pl-4 leading-relaxed font-sans">
                <li><strong>Daily Ashwini Mudra:</strong> Contract and release perineum muscles 50 times during Brahma Muhurta to pull vital life liquids up.</li>
                <li><strong>Trataka (Eye Command):</strong> Spend 5 minutes gazing at a single point (candles or ghee lamp). It locks eyes-energy and preserves core strength.</li>
                <li><strong>Sound Shielding:</strong> Practice silent mantra chanting <strong>"OM URDHVARETAYA NAMAH"</strong> internally when a temptation wave arises.</li>
              </ul>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={handleReset}
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono font-bold px-6 py-2 rounded-xl text-[11px] transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                <RotateCcw size={12} /> Retake Diagnostic Checkup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
