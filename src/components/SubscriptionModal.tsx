import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Check, 
  X, 
  CreditCard, 
  Lock, 
  ShieldCheck, 
  Coins, 
  Target, 
  Star, 
  HelpCircle, 
  ChevronRight, 
  TrendingUp, 
  Sparkle
} from "lucide-react";

export type SubscriptionTier = "sutra" | "chakra" | "brahmanda";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: SubscriptionTier;
  onUpgrade: (tier: SubscriptionTier) => void;
  language: string;
}

export default function SubscriptionModal({
  isOpen,
  onClose,
  currentTier,
  onUpgrade,
  language
}: SubscriptionModalProps) {
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>("chakra");
  const [checkoutStep, setCheckoutStep] = useState<"plans" | "checkout" | "success">("plans");
  
  // Checkout Form State
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setSelectedTier(currentTier === "sutra" ? "chakra" : currentTier);
      setCheckoutStep("plans");
      setCardNumber("");
      setCardName("");
      setCardExpiry("");
      setCardCvv("");
      setIsCardFlipped(false);
      setFormErrors({});
    }
  }, [isOpen, currentTier]);

  const t = (en: string, hinglish: string) => {
    return language === "hinglish" ? hinglish : en;
  };

  // Card formatting and validations
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const formatted = raw.match(/.{1,4}/g)?.join(" ") || raw;
    if (raw.length <= 16) {
      setCardNumber(formatted);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\//g, "").replace(/[^0-9]/gi, "");
    let formatted = raw;
    if (raw.length > 2) {
      formatted = `${raw.slice(0, 2)}/${raw.slice(2, 4)}`;
    }
    if (raw.length <= 4) {
      setCardExpiry(formatted);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/gi, "");
    if (raw.length <= 4) {
      setCardCvv(raw);
    }
  };

  const detectCardType = (num: string) => {
    const cleanNum = num.replace(/\s/g, "");
    if (cleanNum.startsWith("4")) return "Visa";
    if (cleanNum.startsWith("5")) return "Mastercard";
    if (cleanNum.startsWith("3")) return "American Express";
    if (cleanNum.startsWith("6")) return "RuPay";
    return "Credit Card";
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    const cleanNum = cardNumber.replace(/\s/g, "");
    
    if (cleanNum.length < 15) {
      errors.cardNumber = t("Card number must be 15 or 16 digits", "Card number kam se kam 15 ya 16 digits ka hona chahiye");
    }
    if (!cardName.trim()) {
      errors.cardName = t("Cardholder name is required", "Naam enter karna zaroori hai");
    }
    if (cardExpiry.length < 5) {
      errors.cardExpiry = t("Invalid expiry date (MM/YY)", "Expiry date sahi format mein likhein (MM/YY)");
    } else {
      const [month, year] = cardExpiry.split("/").map(Number);
      if (month < 1 || month > 12) {
        errors.cardExpiry = t("Invalid month", "Month sahi nahi hai");
      }
    }
    if (cardCvv.length < 3) {
      errors.cardCvv = t("CVV must be 3 or 4 digits", "CVV 3 ya 4 digits ka hona chahiye");
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    // Simulate authentic merchant payment verification
    setTimeout(() => {
      setIsSubmitting(false);
      onUpgrade(selectedTier);
      setCheckoutStep("success");
    }, 2000);
  };

  const planPricing = {
    sutra: { price: "$0", label: t("Sutra (Basic)", "Sutra (Mool-Sthan)") },
    chakra: { price: "$9.99", label: t("Chakra Premium", "Chakra Pro") },
    brahmanda: { price: "$29.99", label: t("Brahmanda Divine", "Brahmanda Shrishti") }
  };

  if (!isOpen) return null;

  return (
    <div id="subscription-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        id="subscription-modal-container"
        className="relative w-full max-w-4xl bg-neutral-900 border border-white/5 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] lg:flex-row"
      >
        {/* Left/Top Interactive Info Sidebar */}
        <div className="w-full lg:w-5/12 bg-gradient-to-b from-purple-950/30 to-amber-950/20 border-b lg:border-b-0 lg:border-r border-white/5 p-6 sm:p-8 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                <Sparkles size={14} className="animate-pulse" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-white tracking-widest text-sm uppercase">EVOLVE CLUB</h4>
                <p className="text-[10px] text-gold font-mono uppercase tracking-widest">{t("Cosmic Memberships", "Bhagya Chakra Members")}</p>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="text-xl sm:text-2xl font-serif font-medium text-white italic leading-tight">
                {t("Unlock Your True Cosmic Blueprint", "Apna Sahi Grah-Chakra Unlock Karein")}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {t(
                  "Move beyond basic calculations. Deepen your self-discovery with unlimited AI queries, full relational match matrices, and structured daily spiritual sadhana trackers.",
                  "Generic predictions ko chhodein. Unlimited AI Mentor Chats, detailed Kundali Match aur Daily Sadhana goals ke saath sahi spiritual tarakki paayein."
                )}
              </p>
            </div>

            {/* Testimonial / Cosmic validation text */}
            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2 mt-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={10} fill="#D4AF37" className="text-gold" />
                ))}
              </div>
              <p className="text-[11px] text-slate-400 italic leading-relaxed font-sans">
                "{t("The relationship match and daily advice was shockingly accurate. It felt like talking to a real Vedic guru.", "Mujhe pehle laga normal report hogi, par iska Kundali Milaap aur AI Coach bohot hi real aur helpful tha!")}"
              </p>
              <p className="text-[9px] text-gold font-mono tracking-wider">- Gaurav M., Delhi, India</p>
            </div>
          </div>

          <div className="pt-6 lg:pt-0 space-y-2 border-t border-white/5 lg:border-none mt-6 lg:mt-0">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="text-emerald-400" size={14} />
              <span>{t("Secure 256-Bit SSL Checkout", "100% Safe Aur Secure SSL Checkout")}</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-500 pl-5">
              <span>{t("Cancel anytime with 1-click inside settings.", "Ek click mein kabhi bhi cancel karein.")}</span>
            </div>
          </div>
        </div>

        {/* Right/Bottom Main Subscription Flow */}
        <div className="w-full lg:w-7/12 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          {/* Close trigger */}
          <button 
            id="close-subscription-button"
            onClick={onClose}
            className="absolute top-6 right-6 text-slate-400 hover:text-white hover:scale-105 transition-all cursor-pointer z-10"
          >
            <X size={20} />
          </button>

          <AnimatePresence mode="wait">
            {/* STEP 1: PLANS SELECTION */}
            {checkoutStep === "plans" && (
              <motion.div 
                key="plans"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-serif font-semibold text-white">
                    {t("Select Your Cosmic Plan", "Apna Cosmic Plan Chunein")}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {t("Choose the depth of cosmic wisdom you wish to access.", "Vedic gyaan aur features ki depth select karein.")}
                  </p>
                </div>

                {/* Pricing Grid */}
                <div className="space-y-3">
                  {/* Sutra Plan */}
                  <motion.div 
                    id="plan-sutra"
                    onClick={() => setSelectedTier("sutra")}
                    whileHover={{ scale: 1.015, borderColor: "rgba(255,255,255,0.2)" }}
                    whileTap={{ scale: 0.995 }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex items-center justify-between ${
                      selectedTier === "sutra" 
                        ? "bg-white/[0.04] border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.05)]" 
                        : "bg-white/[0.01] border-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        selectedTier === "sutra" ? "border-white bg-white text-neutral-900" : "border-white/20"
                      }`}>
                        {selectedTier === "sutra" && <Check size={12} strokeWidth={3} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-white text-sm">{planPricing.sutra.label}</h4>
                          <span className="text-[9px] bg-white/10 text-slate-300 px-2 py-0.5 rounded-md uppercase font-semibold font-mono tracking-wider">{t("Basic", "Mool")}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-snug mt-0.5">{t("Basic root numbers & simple daily rating", "Basic counts aur general rashifal themes")}</p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-white text-base">{planPricing.sutra.price}</span>
                  </motion.div>

                  {/* Chakra Plan - Recommended */}
                  <motion.div 
                    id="plan-chakra"
                    onClick={() => setSelectedTier("chakra")}
                    whileHover={{ scale: 1.015, borderColor: "rgba(16,185,129,0.4)" }}
                    whileTap={{ scale: 0.995 }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex items-center justify-between ${
                      selectedTier === "chakra" 
                        ? "bg-emerald-950/20 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]" 
                        : "bg-white/[0.01] border-white/5"
                    }`}
                  >
                    {/* Golden Popular Badge */}
                    <div className="absolute top-0 right-0 bg-emerald-500 text-neutral-950 text-[8px] font-mono font-bold px-3 py-1 uppercase rounded-bl-xl tracking-widest">
                      {t("MOST POPULAR", "SUBSE POPULAR")}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        selectedTier === "chakra" ? "border-emerald-500 bg-emerald-500 text-neutral-950" : "border-white/20"
                      }`}>
                        {selectedTier === "chakra" && <Check size={12} strokeWidth={3} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-semibold text-white text-sm">{planPricing.chakra.label}</h4>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-snug mt-0.5">{t("Unlimited AI coach, deep insights, sadhana, compatibility", "Unlimited AI coach, deep secrets, match maker & sadhana")}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-emerald-400 text-base">{planPricing.chakra.price}</span>
                      <p className="text-[9px] text-slate-400 font-sans leading-none">{t("/month", "/month")}</p>
                    </div>
                  </motion.div>

                  {/* Brahmanda Plan */}
                  <motion.div 
                    id="plan-brahmanda"
                    onClick={() => setSelectedTier("brahmanda")}
                    whileHover={{ scale: 1.015, borderColor: "rgba(212,175,55,0.4)" }}
                    whileTap={{ scale: 0.995 }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex items-center justify-between ${
                      selectedTier === "brahmanda" 
                        ? "bg-amber-950/20 border-gold/50 shadow-[0_0_15px_rgba(212,175,55,0.15)]" 
                        : "bg-white/[0.01] border-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        selectedTier === "brahmanda" ? "border-gold bg-gold text-neutral-950" : "border-white/20"
                      }`}>
                        {selectedTier === "brahmanda" && <Check size={12} strokeWidth={3} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-white text-sm">{planPricing.brahmanda.label}</h4>
                          <span className="text-[9px] bg-amber-500/10 text-gold px-2 py-0.5 rounded-md uppercase font-semibold font-mono tracking-wider">{t("ULTIMATE", "ANANT")}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-snug mt-0.5">{t("Chakra unlocked + priority streaming + gemstone blueprints", "Chakra features + priority AI advice + gemstone activation")}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-gold text-base">{planPricing.brahmanda.price}</span>
                      <p className="text-[9px] text-slate-400 font-sans leading-none">{t("/month", "/month")}</p>
                    </div>
                  </motion.div>
                </div>

                {/* Plan Feature Matrix list based on selection */}
                <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 space-y-3">
                  <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">{t("Included in Plan", "Features jo aapko milenge")}</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedTier === "sutra" && (
                      <>
                        <FeatureItem text={t("Core traits (Moolank 1-9)", "Core traits (Moolank 1-9)")} />
                        <FeatureItem text={t("Ruling deities check", "Devta details")} />
                        <FeatureItem text={t("Standard daily forecast theme", "Standard daily forecast theme")} />
                        <FeatureItem text={t("2 AI Mentor questions daily", "Daily 2 AI Mentor questions")} />
                      </>
                    )}
                    {selectedTier === "chakra" && (
                      <>
                        <FeatureItem text={t("Everything in Sutra plan", "Sutra plan ka sab kuch")} />
                        <FeatureItem text={t("Unlimited AI Coach chat", "Unlimited AI Coach chat")} />
                        <FeatureItem text={t("Full Relational Compatibility matching", "Detailed Kundali Milaap report")} />
                        <FeatureItem text={t("Sadhana Tracker full history & reminders", "Sadhana goals tracking & history")} />
                        <FeatureItem text={t("Deep Transformation Hub access", "Life secrets & remedies hub")} />
                        <FeatureItem text={t("Detailed forecast with daily Dos & Don'ts", "Daily weather with full Dos & Don'ts")} />
                      </>
                    )}
                    {selectedTier === "brahmanda" && (
                      <>
                        <FeatureItem text={t("Everything in Chakra plan", "Chakra plan ka sab kuch")} />
                        <FeatureItem text={t("Priority streaming answers", "Priority fast AI advice")} />
                        <FeatureItem text={t("Custom gemstone activation rituals", "Gemstone activation formulas")} />
                        <FeatureItem text={t("Simulated blueprint PDF generator", "Custom report PDF export")} />
                        <FeatureItem text={t("Celestial priority servers", "Advanced server speed limits")} />
                        <FeatureItem text={t("Extended AI context memory", "Deeper context memory support")} />
                      </>
                    )}
                  </div>
                </div>

                {/* Call to Action button */}
                <div className="pt-2 flex items-center justify-between gap-4">
                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 font-sans block">{t("Total Due Now:", "Aaj ka Total:")}</span>
                    <span className="text-lg font-mono font-black text-white">
                      {selectedTier === "sutra" ? "$0" : selectedTier === "chakra" ? "$9.99" : "$29.99"}
                    </span>
                  </div>

                  {selectedTier === "sutra" ? (
                    <button
                      id="sutra-downgrade-button"
                      onClick={() => {
                        onUpgrade("sutra");
                        onClose();
                      }}
                      className="bg-white/10 hover:bg-white/20 text-white font-semibold text-sm py-3 px-6 rounded-xl cursor-pointer transition-all active:scale-98"
                    >
                      {currentTier === "sutra" ? t("Currently Active", "Abhi Active Hai") : t("Downgrade to Basic", "Downgrade Karein")}
                    </button>
                  ) : (
                    <button
                      id="plans-continue-button"
                      onClick={() => setCheckoutStep("checkout")}
                      className="bg-gradient-to-r from-gold-dark via-gold to-gold-light hover:brightness-110 text-cosmic-bg font-bold text-sm py-3 px-8 rounded-xl cursor-pointer transition-all active:scale-98 flex items-center gap-1.5 shadow-lg glow-gold"
                    >
                      <span>{t("Continue to Secure Checkout", "Checkout Karein")}</span>
                      <ChevronRight size={16} />
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* STEP 2: SECURE CHECKOUT FORM */}
            {checkoutStep === "checkout" && (
              <motion.div 
                key="checkout"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Back button */}
                <button 
                  id="checkout-back-button"
                  onClick={() => setCheckoutStep("plans")}
                  className="inline-flex items-center gap-1 text-slate-400 hover:text-white text-xs transition-all cursor-pointer"
                >
                  &larr; {t("Back to Plans", "Plans Par Waapas Jayein")}
                </button>

                <div>
                  <h3 className="text-lg font-serif font-semibold text-white">
                    {t("Secure Payment Portal", "Secure Payment Option")}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {t("Activating your ", "Aapka ")} <span className="text-gold font-semibold uppercase font-mono text-[11px]">{planPricing[selectedTier].label}</span>
                  </p>
                </div>

                {/* 3D-Like Flipping Credit Card Visualizer */}
                <div className="flex justify-center py-2">
                  <div className="w-full max-w-[340px] h-[190px] [perspective:1000px] cursor-pointer" onClick={() => setIsCardFlipped(!isCardFlipped)}>
                    <motion.div 
                      className="w-full h-full relative [transform-style:preserve-3d] transition-all duration-700"
                      animate={{ rotateY: isCardFlipped ? 180 : 0 }}
                    >
                      {/* CARD FRONT */}
                      <div className="absolute inset-0 w-full h-full rounded-2xl p-5 flex flex-col justify-between [backface-visibility:hidden] text-white bg-gradient-to-br from-neutral-800 via-neutral-900 to-neutral-950 border border-white/10 shadow-xl overflow-hidden">
                        {/* Shimmer background */}
                        <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/[0.02] transform skew-y-12 pointer-events-none" />
                        
                        <div className="flex justify-between items-start relative z-10">
                          <div className="space-y-1">
                            <span className="text-[9px] font-mono font-bold text-slate-400 tracking-widest uppercase">COSMIC LEDGER</span>
                            <div className="flex items-center gap-1.5">
                              <Sparkle size={12} className="text-gold animate-spin-slow" />
                              <span className="text-xs font-serif italic text-gold">{planPricing[selectedTier].label}</span>
                            </div>
                          </div>
                          {/* Chip */}
                          <div className="w-9 h-7 rounded-md bg-gradient-to-br from-yellow-600 to-amber-400 opacity-85 flex items-center justify-center p-1">
                            <div className="grid grid-cols-3 gap-0.5 w-full h-full border border-neutral-950/20" />
                          </div>
                        </div>

                        {/* Card digits */}
                        <div className="font-mono text-base tracking-[0.18em] text-center my-4 relative z-10 text-slate-100">
                          {cardNumber || "•••• •••• •••• ••••"}
                        </div>

                        <div className="flex justify-between items-end relative z-10">
                          <div className="space-y-0.5 text-left">
                            <span className="text-[8px] text-slate-500 uppercase font-mono block tracking-wider">Cardholder</span>
                            <p className="text-xs font-semibold uppercase tracking-wider truncate max-w-[170px] text-slate-200">
                              {cardName || "YOUR NAME"}
                            </p>
                          </div>
                          <div className="flex gap-4">
                            <div className="space-y-0.5 text-right">
                              <span className="text-[8px] text-slate-500 uppercase font-mono block tracking-wider">Expires</span>
                              <p className="text-xs font-mono font-semibold text-slate-200">{cardExpiry || "MM/YY"}</p>
                            </div>
                            <div className="space-y-0.5 text-right">
                              <span className="text-[8px] text-slate-500 uppercase font-mono block tracking-wider">Brand</span>
                              <p className="text-[10px] font-mono font-bold text-gold uppercase tracking-widest leading-none mt-1">
                                {detectCardType(cardNumber)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* CARD BACK */}
                      <div className="absolute inset-0 w-full h-full rounded-2xl py-5 [backface-visibility:hidden] [transform:rotateY(180deg)] text-white bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-800 border border-white/10 shadow-xl flex flex-col justify-between">
                        {/* Magnetic Strip */}
                        <div className="w-full h-10 bg-neutral-950 mt-1" />

                        {/* Signature strip and CVV */}
                        <div className="px-5 space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 bg-slate-300 rounded-md w-9/12 flex items-center justify-end px-3">
                              <span className="font-mono italic text-neutral-800 text-xs select-none tracking-widest">evolve club signature</span>
                            </div>
                            <div className="h-8 bg-gold text-neutral-950 font-mono font-bold text-sm rounded-md w-3/12 flex items-center justify-center">
                              {cardCvv || "•••"}
                            </div>
                          </div>
                          
                          <p className="text-[8px] text-slate-500 leading-normal text-center">
                            {t(
                              "This simulation verifies credentials against structural sandboxes. No real currency is deducted. Unauthorized reproduction is bound by cosmic karma laws.",
                              "Ye ek mock secure transaction simulation hai. Koi real paise nahi katenge. Sabhi features premium test state mein unlock ho jayenge."
                            )}
                          </p>
                        </div>

                        {/* SSL watermark */}
                        <div className="px-5 flex justify-between items-center text-slate-400">
                          <span className="text-[8px] font-mono tracking-widest">SECURE PORTAL</span>
                          <span className="text-[8px] text-emerald-400 font-mono font-bold">SSL ENCRYPTED</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Form fields */}
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  {/* Card Number */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex justify-between">
                      <span>{t("Credit Card Number", "Credit Card Number")}</span>
                      <span className="text-gold font-mono">{detectCardType(cardNumber)}</span>
                    </label>
                    <div className="relative">
                      <input 
                        type="text"
                        required
                        placeholder="4111 2222 3333 4444"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        onFocus={() => setIsCardFlipped(false)}
                        className={`w-full bg-white/[0.02] border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all ${
                          formErrors.cardNumber ? "border-rose-500" : "border-white/10"
                        }`}
                      />
                      <CreditCard className="absolute right-4 top-3 text-slate-500" size={16} />
                    </div>
                    {formErrors.cardNumber && <p className="text-[10px] text-rose-500 mt-0.5">{formErrors.cardNumber}</p>}
                  </div>

                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("Cardholder Name", "Naam (Jaisa card par ho)")}</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. Gaurav Mishra"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      onFocus={() => setIsCardFlipped(false)}
                      className={`w-full bg-white/[0.02] border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all ${
                        formErrors.cardName ? "border-rose-500" : "border-white/10"
                      }`}
                    />
                    {formErrors.cardName && <p className="text-[10px] text-rose-500 mt-0.5">{formErrors.cardName}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Expiry */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Expiry Date</label>
                      <input 
                        type="text"
                        required
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        onFocus={() => setIsCardFlipped(false)}
                        className={`w-full bg-white/[0.02] border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all ${
                          formErrors.cardExpiry ? "border-rose-500" : "border-white/10"
                        }`}
                      />
                      {formErrors.cardExpiry && <p className="text-[10px] text-rose-500 mt-0.5">{formErrors.cardExpiry}</p>}
                    </div>

                    {/* CVV */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CVV / CVC</label>
                      <div className="relative">
                        <input 
                          type="password"
                          required
                          placeholder="•••"
                          value={cardCvv}
                          onChange={handleCvvChange}
                          onFocus={() => setIsCardFlipped(true)}
                          onBlur={() => setIsCardFlipped(false)}
                          className={`w-full bg-white/[0.02] border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all ${
                            formErrors.cardCvv ? "border-rose-500" : "border-white/10"
                          }`}
                        />
                        <Lock className="absolute right-4 top-3 text-slate-500" size={14} />
                      </div>
                      {formErrors.cardCvv && <p className="text-[10px] text-rose-500 mt-0.5">{formErrors.cardCvv}</p>}
                    </div>
                  </div>

                  {/* Verify Checkbox warning */}
                  <p className="text-[10px] text-slate-500 leading-relaxed font-sans text-center">
                    {t(
                      "By clicking the button below, you authorize a mock subscription activation. Real currency is NEVER billed. Your local browser state will immediately be authorized for Premium benefits.",
                      "Is payment simulation ko confirm karne par aapke premium benefits turant active ho jayenge. Koi real paise nahi katenge."
                    )}
                  </p>

                  <button
                    type="submit"
                    id="submit-payment-button"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-gold-dark via-gold to-gold-light hover:brightness-110 disabled:opacity-50 text-cosmic-bg font-bold py-3 px-6 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2 shadow-lg glow-gold mt-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-cosmic-bg border-t-transparent rounded-full animate-spin" />
                        <span>{t("Verifying Secure Tokens...", "Grahon Se Transaction Verify Ho Raha Hai...")}</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={16} />
                        <span>{t(`Pay & Activate ${planPricing[selectedTier].label}`, `Pay Karein Aur Premium Active Karein`)}</span>
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {/* STEP 3: SUCCESS PANEL */}
            {checkoutStep === "success" && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="py-12 flex flex-col items-center justify-center text-center space-y-6"
              >
                {/* Custom glowing crown / orbit vector */}
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gold/10 rounded-full blur-xl animate-pulse" />
                  <div className="absolute inset-0 border-2 border-gold/40 rounded-full animate-spin-slow" />
                  <div className="w-14 h-14 rounded-full bg-gold/15 flex items-center justify-center text-gold border border-gold/30">
                    <Sparkles size={26} className="animate-pulse" />
                  </div>
                </div>

                <div className="space-y-2 max-w-sm">
                  <h3 className="text-2xl font-serif font-bold text-white tracking-tight">
                    {t("Celestial Realm Activated!", "Vedic Premium Gyaan Unlocked!")}
                  </h3>
                  <p className="text-xs text-gold font-mono font-semibold uppercase tracking-wider">
                    {t(`Your ${planPricing[selectedTier].label} is live!`, `Aapka ${planPricing[selectedTier].label} active ho chuka hai!`)}
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans pt-2">
                    {t(
                      "Thank you for upgrading! Your profile now has full authorizations. Enjoy unlimited AI mentor chats, full compatibilities, and detailed daily forecasts.",
                      "Congrats! Aapke premium benefits ab active hain. Aap bina kisi limit ke AI Coach aur reports ka access kar sakte hain."
                    )}
                  </p>
                </div>

                <button
                  id="checkout-success-close"
                  onClick={onClose}
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold text-sm py-3 px-8 rounded-xl cursor-pointer transition-all active:scale-95"
                >
                  {t("Enter Cosmic Dashboard", "Cosmic Dashboard Mein Jayein")}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 text-xs text-slate-300">
      <div className="w-4 h-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
        <Check size={10} strokeWidth={3} />
      </div>
      <span>{text}</span>
    </div>
  );
}
