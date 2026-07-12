import React from "react";
import { motion } from "motion/react";
import { Lock, Sparkles, ShieldAlert, ArrowRight, Check } from "lucide-react";

interface PremiumLockProps {
  featureName: string;
  featureDesc: string;
  lockedFeatures: string[];
  onUpgradeClick: () => void;
  language: string;
}

export default function PremiumLock({
  featureName,
  featureDesc,
  lockedFeatures,
  onUpgradeClick,
  language
}: PremiumLockProps) {
  const isHinglish = language === "hinglish";

  const t = (en: string, hing: string) => {
    return isHinglish ? hing : en;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      id={`premium-lock-${featureName.toLowerCase().replace(/\s+/g, "-")}`}
      className="max-w-2xl mx-auto bg-neutral-950/60 border border-gold/15 rounded-3xl p-6 sm:p-10 text-center relative overflow-hidden backdrop-blur-xl shadow-2xl glow-gold mt-6"
    >
      {/* Radiant golden backdrop */}
      <div className="absolute -top-12 -left-12 w-32 h-32 bg-gold/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Golden Padlock circle */}
      <div className="relative w-16 h-16 mx-auto mb-6 flex items-center justify-center">
        <div className="absolute inset-0 border border-gold/25 rounded-full animate-ping opacity-35" style={{ animationDuration: "3s" }} />
        <div className="absolute inset-0 border-2 border-dashed border-gold/30 rounded-full animate-spin-slow" />
        <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
          <Lock size={20} className="animate-pulse" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full px-3 py-1">
          <Sparkles size={11} fill="currentColor" className="text-gold" />
          <span className="text-[9px] font-mono font-bold text-gold uppercase tracking-widest">{t("Celestial Premium Feature", "Celestial Premium Gyaan")}</span>
        </div>
        
        <h3 className="text-2xl font-serif font-semibold text-white tracking-tight">
          {t(`Unlock ${featureName}`, `${featureName} Unlock Karein`)}
        </h3>
        
        <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
          {featureDesc}
        </p>
      </div>

      {/* Bullet features list */}
      <div className="max-w-md mx-auto bg-white/[0.01] border border-white/5 rounded-2xl p-5 my-6 text-left space-y-3">
        <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">{t("What's waiting for you:", "Premium features jo aapko milenge:")}</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {lockedFeatures.map((feat, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
              <div className="w-4 h-4 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shrink-0 mt-0.5">
                <Check size={10} strokeWidth={3} />
              </div>
              <span className="leading-tight">{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Glowing Upgrade CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          id={`lock-upgrade-button-${featureName.toLowerCase().replace(/\s+/g, "-")}`}
          onClick={onUpgradeClick}
          className="w-full sm:w-auto bg-gradient-to-r from-gold-dark via-gold to-gold-light hover:brightness-110 active:scale-95 text-cosmic-bg font-bold text-sm py-3 px-8 rounded-xl cursor-pointer transition-all shadow-lg glow-gold flex items-center justify-center gap-2"
        >
          <span>{t("Upgrade Plan Now", "Premium Active Karein")}</span>
          <ArrowRight size={16} />
        </button>

        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
          <ShieldAlert size={12} className="text-gold" />
          <span>{t("No real currency billed", "Simulation: Koi real paise nahi katenge")}</span>
        </div>
      </div>
    </motion.div>
  );
}
