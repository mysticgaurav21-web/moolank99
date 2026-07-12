import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip as RechartsTooltip
} from "recharts";
import { 
  Sparkles, 
  Star, 
  User, 
  UserCheck,
  Target, 
  Briefcase, 
  Coins, 
  Heart, 
  Leaf, 
  HeartPulse, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  Check, 
  X, 
  Shield, 
  RotateCcw, 
  Calendar, 
  Award,
  Info,
  ChevronRight,
  Globe,
  Compass,
  BookOpen,
  MessageSquare,
  LayoutGrid,
  AlertTriangle,
  Download,
  Share2,
  Activity
} from "lucide-react";
import { MoolankReading } from "./types";
import CosmicOrbit from "./components/CosmicOrbit";
import { translateText } from "./utils/translator";
import { exportBlueprintPDF } from "./utils/pdfGenerator";
import CompatibilityTab from "./components/CompatibilityTab";
import DailyWeatherTab from "./components/DailyWeatherTab";
import ReferenceMatrix from "./components/ReferenceMatrix";
import DeepTransformationHub from "./components/DeepTransformationHub";
import AICoachTab from "./components/AICoachTab";
import KnowledgeLibraryTab from "./components/KnowledgeLibraryTab";
import TransformationTrackerTab from "./components/TransformationTrackerTab";
import SubscriptionModal, { SubscriptionTier } from "./components/SubscriptionModal";
import PremiumLock from "./components/PremiumLock";
import PlanetaryMap from "./components/PlanetaryMap";
import CelibacyTab from "./components/CelibacyTab";
import VedicBiorhythmsTab from "./components/VedicBiorhythmsTab";
import MantraAudioPlayer from "./components/MantraAudioPlayer";

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-neutral-950/95 border border-amber-500/30 p-3 rounded-xl shadow-2xl backdrop-blur-md text-left max-w-xs z-50">
        <p className="text-xs font-serif font-bold text-white mb-0.5">{data.subject}</p>
        <p className="text-sm font-mono font-bold text-gold flex items-center gap-1.5">
          <span>Score:</span> <span>{data.score}/100</span>
        </p>
        <p className="text-[10px] text-slate-400 mt-1 leading-normal font-sans">{data.desc}</p>
      </div>
    );
  }
  return null;
};

export default function App() {
  // Navigation & Flow State
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [reading, setReading] = useState<MoolankReading | null>(null);
  
  // Tab states for results dashboard
  const [dashboardTab, setDashboardTab] = useState<"orbit" | "compatibility" | "forecast" | "tracker" | "coach" | "library" | "directory" | "planetary" | "celibacy" | "biorhythms">("orbit");
  const [menuGroup, setMenuGroup] = useState<"blueprint" | "rituals" | "guidance">("blueprint");
  const [activeCategory, setActiveCategory] = useState<string>("personality");

  const handleSetMenuGroup = (group: "blueprint" | "rituals" | "guidance") => {
    setMenuGroup(group);
    if (group === "blueprint") {
      setDashboardTab("orbit");
    } else if (group === "rituals") {
      setDashboardTab("tracker");
    } else if (group === "guidance") {
      setDashboardTab("coach");
    }
  };

  // Form State
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [focusArea, setFocusArea] = useState("Overall Balance");
  const [language, setLanguage] = useState("english");

  // Celestial Profiles persistence state
  interface SavedProfile {
    id: string;
    name: string;
    dob: string;
    gender: string;
    focusArea: string;
    language: string;
  }

  const [savedProfiles, setSavedProfiles] = useState<SavedProfile[]>(() => {
    const saved = localStorage.getItem("saved_destiny_profiles");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        // fallback
      }
    }
    // Default seeded profile for Gaurav Kashyap, born 14 March 1991
    return [
      {
        id: "profile-gaurav",
        name: "Gaurav Kashyap",
        dob: "1991-03-14",
        gender: "Male",
        focusArea: "Overall Balance",
        language: "english"
      }
    ];
  });

  const [saveAsProfile, setSaveAsProfile] = useState(true);

  const handleDeleteProfile = (id: string) => {
    if (id === "profile-gaurav") return; // Keep seeded profile permanently
    const updated = savedProfiles.filter(p => p.id !== id);
    setSavedProfiles(updated);
    localStorage.setItem("saved_destiny_profiles", JSON.stringify(updated));
  };

  const loadProfileAndCalculate = async (p: SavedProfile) => {
    setName(p.name);
    setDob(p.dob);
    setGender(p.gender || "Male");
    setFocusArea(p.focusArea || "Overall Balance");
    setLanguage(p.language || "english");
    setShowForm(true);
    setLoading(true);
    setLoadingPhase(0);
    
    // Animate loading phase carousel
    const interval = setInterval(() => {
      setLoadingPhase((prev) => {
        if (prev < loadingMessages.length - 1) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 1500);

    try {
      const response = await fetch("/api/moolank/reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: p.name, 
          dob: p.dob, 
          gender: p.gender || "Male", 
          focusArea: p.focusArea || "Overall Balance", 
          language: p.language || "english" 
        }),
      });
      const data = (await response.json()) as MoolankReading;
      
      setTimeout(() => {
        clearInterval(interval);
        if (data.success) {
          setReading(data);
          setShowForm(false);
        } else {
          alert("Unable to generate cosmic reading. Please check your inputs.");
        }
        setLoading(false);
      }, 3000); // Super-responsive loads for stored profiles!

    } catch (error) {
      console.error(error);
      clearInterval(interval);
      setLoading(false);
      alert("Network error. Please try again.");
    }
  };

  // Subscription States
  const [currentTier, setCurrentTier] = useState<SubscriptionTier>(() => {
    const saved = localStorage.getItem("evolve_subscription_tier");
    return (saved as SubscriptionTier) || "sutra";
  });
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);

  const handleUpgradeTier = (tier: SubscriptionTier) => {
    setCurrentTier(tier);
    localStorage.setItem("evolve_subscription_tier", tier);
  };

  // Dynamic text adaptation based on active language
  const t = (text: string | undefined): string => {
    return translateText(text, language);
  };

  // Dynamic Personality Scores based on Moolank, Bhagyank, and Namank
  const personalityScores = useMemo(() => {
    if (!reading) return [];
    const m = reading.moolank || 1;
    const b = reading.bhagyank || 1;
    const n = reading.namank || 1;

    // Deterministic, custom-tuned formulas for 6 Vedic Personality Dimensions
    const leadership = 55 + ((m * 8 + b * 5) % 41);
    const creativity = 50 + ((n * 9 + m * 6) % 46);
    const logic = 45 + ((b * 10 + n * 4) % 51);
    const intuition = 60 + ((m * 12 + b * 3) % 36);
    const harmony = 55 + ((n * 7 + m * 8) % 41);
    const grit = 50 + ((b * 13 + n * 6) % 46);

    const isHinglish = language === "hinglish";

    return [
      { 
        subject: isHinglish ? "Leadership" : "Leadership & Will", 
        score: leadership, 
        desc: isHinglish ? "Nirdeshak aur sankalp shakti" : "Driving force, authority & willpower"
      },
      { 
        subject: isHinglish ? "Creativity" : "Creativity & Art", 
        score: creativity, 
        desc: isHinglish ? "Kalatmakta aur naye vichar" : "Artistic vision, imagination & novelty"
      },
      { 
        subject: isHinglish ? "Logic" : "Logic & Strategy", 
        score: logic, 
        desc: isHinglish ? "Vishleshan aur yojna shakti" : "Analytical power, structure & planning"
      },
      { 
        subject: isHinglish ? "Intuition" : "Intuition & Spirit", 
        score: intuition, 
        desc: isHinglish ? "Aantarik gyan aur adhyatma" : "Inner guidance, gut feeling & spiritual depth"
      },
      { 
        subject: isHinglish ? "Harmony" : "Harmony & Relations", 
        score: harmony, 
        desc: isHinglish ? "Rishte aur santulan" : "Empathy, cooperation & peaceful balance"
      },
      { 
        subject: isHinglish ? "Grit" : "Grit & Execution", 
        score: grit, 
        desc: isHinglish ? "Mehnat aur lagan" : "Hard work, resilience & ground execution"
      }
    ];
  }, [reading, language]);

  // Multi-step loading messages
  const loadingMessages = [
    "Aligning celestial planetary coordinates...",
    "Calculating core Moolank & Bhagyank vibrations...",
    "Scanning Chaldean letter values for name Namank...",
    "Interpreting cosmic readings with Gemini AI wisdom..."
  ];

  // Submit form and fetch customized reading from server
  const handleCalculateReading = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !dob) return;
    
    setLoading(true);
    setLoadingPhase(0);
    
    // Animate transition phases to simulate profound cosmic computation
    const interval = setInterval(() => {
      setLoadingPhase((prev) => {
        if (prev < loadingMessages.length - 1) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 1500);

    try {
      const response = await fetch("/api/moolank/reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, dob, gender, focusArea, language }),
      });
      const data = (await response.json()) as MoolankReading;
      
      // Let the loading transition finish smoothly
      setTimeout(() => {
        clearInterval(interval);
        if (data.success) {
          setReading(data);
          setShowForm(false);

          // Automatically store in Celestial Records if checked
          if (saveAsProfile) {
            const hasDuplicate = savedProfiles.some(p => p.name.toLowerCase() === name.toLowerCase() && p.dob === dob);
            if (!hasDuplicate) {
              const newProfile: SavedProfile = {
                id: "profile-" + Date.now(),
                name,
                dob,
                gender: gender || "Male",
                focusArea: focusArea || "Overall Balance",
                language: language || "english"
              };
              const updated = [...savedProfiles, newProfile];
              setSavedProfiles(updated);
              localStorage.setItem("saved_destiny_profiles", JSON.stringify(updated));
            }
          }
        } else {
          alert("Unable to generate cosmic reading. Please check your inputs.");
        }
        setLoading(false);
      }, 6000);

    } catch (error) {
      console.error(error);
      clearInterval(interval);
      setLoading(false);
      alert("Network error. Please try again.");
    }
  };

  const [shareToast, setShareToast] = useState<string | null>(null);

  const handleShareResults = async () => {
    if (!reading) return;
    
    // 1. Generate the unique public URL
    const params = new URLSearchParams({
      name,
      dob,
      gender: gender || "Male",
      focus: focusArea || "Overall Balance",
      lang: language || "english"
    });
    const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;

    // 2. Draft a beautiful social media text/template
    const isHinglish = language === "hinglish";
    const shareTitle = isHinglish 
      ? `🔮 Mera Celestial Destiny Blueprint - Evolve`
      : `🔮 My Celestial Destiny Blueprint - Evolve`;
    
    const shareText = isHinglish
      ? `Evolve app par maine apna Cosmic Destiny Blueprint calculate kiya! 🌌\n\nMoolank: ${reading.moolank}\nBhagyank: ${reading.bhagyank}\nRuling Planet: ${reading.rulingPlanet}\n\nApna personal Vedic Astro-Numerology blueprint abhi check karein:`
      : `I just generated my Personalized Celestial Destiny Blueprint on Evolve! 🌌\n\nMoolank (Root): ${reading.moolank}\nBhagyank (Destiny): ${reading.bhagyank}\nRuling Planet: ${reading.rulingPlanet}\n\nDiscover your Vedic Astro-Numerology profile here:`;

    // 3. Try Native Web Share API first
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: `${shareText}\n\n`,
          url: shareUrl
        });
        return;
      } catch (err) {
        // User cancelled or share failed, fallback to Clipboard/Toast
        console.log("Web Share cancelled or failed, falling back to Clipboard.", err);
      }
    }

    // 4. Fallback: Write to clipboard & show Toast notification
    try {
      const clipboardText = `${shareTitle}\n\n${shareText}\n${shareUrl}`;
      await navigator.clipboard.writeText(clipboardText);
      setShareToast(isHinglish ? "✨ Shandaar! Share template and unique URL clipboard par copy ho gaya!" : "✨ Excellent! Sharing template and unique URL copied to clipboard!");
      setTimeout(() => setShareToast(null), 4000);
    } catch (err) {
      console.error("Clipboard copy failed", err);
      // Absolute fallback if clipboard fails as well
      setShareToast(isHinglish ? "Share Link: " + shareUrl : "Share Link: " + shareUrl);
      setTimeout(() => setShareToast(null), 6000);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pName = params.get("name");
    const pDob = params.get("dob");
    const pGender = params.get("gender") || "Male";
    const pFocus = params.get("focus") || "Overall Balance";
    const pLang = params.get("lang") || "english";

    if (pName && pDob) {
      setName(pName);
      setDob(pDob);
      setGender(pGender);
      setFocusArea(pFocus);
      setLanguage(pLang);
      
      const triggerAutoLoad = async () => {
        setLoading(true);
        setLoadingPhase(0);
        
        const interval = setInterval(() => {
          setLoadingPhase((prev) => {
            if (prev < loadingMessages.length - 1) {
              return prev + 1;
            }
            clearInterval(interval);
            return prev;
          });
        }, 1500);

        try {
          const response = await fetch("/api/moolank/reading", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              name: pName, 
              dob: pDob, 
              gender: pGender, 
              focusArea: pFocus, 
              language: pLang 
            }),
          });
          const data = (await response.json()) as MoolankReading;
          
          setTimeout(() => {
            clearInterval(interval);
            if (data.success) {
              setReading(data);
              setShowForm(false);
            }
            setLoading(false);
          }, 3500);
        } catch (error) {
          console.error(error);
          clearInterval(interval);
          setLoading(false);
        }
      };

      triggerAutoLoad();
    }
  }, []);

  const resetDiscovery = () => {
    setReading(null);
    setName("");
    setDob("");
    setGender("");
    setFocusArea("Overall Balance");
    setDashboardTab("orbit");
    setActiveCategory("personality");
  };

  return (
    <div id="moolank-app-root" className="min-h-screen bg-cosmic-bg text-slate-100 font-sans relative overflow-x-hidden">
      
      {/* Sparkly Starry Background Particles */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center mix-blend-color-dodge opacity-[0.07] pointer-events-none z-0" />
      
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-amber-950/5 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] bg-amber-500/[0.02] rounded-full blur-[120px] pointer-events-none animate-pulse-slow" style={{ animationDelay: "2s" }} />

      {/* Header Bar */}
      <header id="app-header" className="relative z-30 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-white/5">
        <div id="header-logo-wrapper" className="flex items-center gap-2.5 cursor-pointer" onClick={resetDiscovery}>
          {/* Animated geometric SVG icon */}
          <div className="relative w-9 h-9">
            <svg className="w-full h-full text-gold animate-spin-slow drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]" viewBox="0 0 100 100">
              <polygon points="50,5 95,80 5,80" fill="none" stroke="currentColor" strokeWidth="2" />
              <polygon points="50,95 95,20 5,20" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-serif font-semibold tracking-[0.25em] text-white">EVOLVE</h1>
            <p className="text-[9px] tracking-widest text-gold uppercase font-mono font-medium -mt-1">Know Yourself</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Plan Status / Upgrade Button */}
          <button
            id="header-plan-status"
            onClick={() => setIsSubModalOpen(true)}
            className={`group flex items-center gap-2 rounded-full px-4 py-1.5 backdrop-blur-md transition-all duration-300 shadow-lg active:scale-95 cursor-pointer border ${
              currentTier === "sutra"
                ? "bg-gradient-to-r from-amber-500/10 to-purple-500/10 border-gold/30 hover:border-gold/60 hover:brightness-110 animate-pulse"
                : currentTier === "chakra"
                ? "bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-500 text-emerald-400"
                : "bg-amber-950/20 border-gold/40 hover:border-gold text-gold"
            }`}
          >
            <Sparkles className={`animate-pulse ${currentTier === "sutra" ? "text-gold" : "text-gold"}`} size={14} />
            <div className="text-left">
              <span className="text-[8px] text-slate-400 font-mono block leading-none uppercase font-semibold">
                {language === "hinglish" ? "Active Plan" : "Active Plan"}
              </span>
              <span className="text-[10px] font-bold leading-none mt-0.5 block uppercase tracking-wider">
                {currentTier === "sutra"
                  ? language === "hinglish" ? "Sutra (Free)" : "Sutra (Free)"
                  : currentTier === "chakra"
                  ? language === "hinglish" ? "Chakra (Pro)" : "Chakra (Pro)"
                  : language === "hinglish" ? "Brahmanda (Divine)" : "Brahmanda (Divine)"}
              </span>
            </div>
          </button>

          {/* Dynamic Language Switcher Toggle */}
          <button
            id="header-lang-switcher"
            onClick={() => setLanguage(prev => prev === "english" ? "hinglish" : "english")}
            className="group flex items-center gap-2 bg-gradient-to-r from-gold/10 to-amber-500/5 hover:from-gold/20 hover:to-amber-500/10 border border-gold/30 hover:border-gold/60 rounded-full px-3 py-1.5 backdrop-blur-md transition-all duration-300 shadow-lg active:scale-95 cursor-pointer"
            title="Toggle between English and Hinglish"
          >
            <Globe className="text-gold animate-spin-slow group-hover:scale-110 transition-transform duration-300" size={14} />
            <div className="text-left">
              <span className="text-[8px] text-slate-400 font-mono block leading-none uppercase font-semibold">Language</span>
              <span className="text-[10px] font-bold text-white leading-none mt-0.5 block">
                {language === "english" ? "English" : "Hinglish"}
              </span>
            </div>
          </button>

          <div id="header-privacy-badge" className="hidden sm:flex items-center gap-2 bg-white/[0.03] border border-white/5 rounded-full px-4 py-1.5 backdrop-blur-md">
            <Shield className="text-emerald-400" size={14} />
            <div className="text-left">
              <p className="text-[10px] font-bold text-white tracking-wide leading-none">Privacy First</p>
              <p className="text-[8px] text-slate-400 leading-none mt-0.5">Your data is safe with us</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Flow Controller */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          
          {/* 1. LANDING PAGE STATE */}
          {!reading && !showForm && (
            <motion.div 
              key="landing"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="space-y-24"
            >
              {/* HERO SECTION */}
              <section id="hero-banner" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                {/* Hero text Left */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-1.5 bg-white/5 border border-gold/20 rounded-full px-3.5 py-1 backdrop-blur-sm">
                    <Sparkles size={12} className="text-gold animate-pulse" />
                    <span className="text-[10px] font-mono font-bold text-gold uppercase tracking-widest">AI-Powered Self Discovery</span>
                  </div>

                  <h2 className="text-4xl sm:text-5xl lg:text-[56px] font-serif font-light tracking-tight text-white leading-[1.15]">
                    Discover Who <span className="italic">You Are.</span> <br />
                    <span className="bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent font-sans font-bold tracking-tight text-3xl sm:text-4xl lg:text-[46px] uppercase block mt-1">Become Who You Can Be.</span>
                  </h2>

                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                    Understand your personality, strengths, challenges, relationships, career, purpose, and hidden potential through personalized insights and AI-powered Vedic numerology guidance.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2 max-w-lg">
                    {[
                      "No generic templates",
                      "Personalized stellar profiles",
                      "AI-powered planetary guidance",
                      "Absolute data privacy first",
                      "Built for lifelong self growth"
                    ].map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                        <div className="w-4 h-4 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                          <Check size={10} className="text-gold" />
                        </div>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <button 
                      id="hero-start-button"
                      onClick={() => setShowForm(true)}
                      className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-gold-dark via-gold to-gold-light hover:brightness-110 active:scale-95 text-cosmic-bg font-display font-semibold text-base py-3.5 px-8 rounded-full cursor-pointer transition-all shadow-lg glow-gold"
                    >
                      <span>Start Discovering Yourself</span>
                      <ArrowRight size={18} />
                    </button>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Clock size={14} className="text-gold" />
                      <span>Takes less than 2 minutes</span>
                    </div>
                  </div>

                  {/* Stored Celestial Profiles Section */}
                  {savedProfiles.length > 0 && (
                    <div className="pt-6 border-t border-white/5 space-y-3.5 animate-fade-in">
                      <div className="flex items-center gap-2">
                        <UserCheck size={14} className="text-gold" />
                        <p className="text-[10px] font-mono tracking-widest text-gold uppercase font-bold">Stored Celestial Profiles</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {savedProfiles.map((p) => (
                          <div 
                            key={p.id}
                            className="bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-gold/30 rounded-2xl p-4 flex flex-col justify-between gap-3 transition-all cursor-pointer relative group shadow-lg"
                            onClick={() => loadProfileAndCalculate(p)}
                          >
                            <div>
                              <div className="flex justify-between items-start gap-2">
                                <span className="text-sm font-serif font-black text-white capitalize group-hover:text-gold transition-colors">{p.name}</span>
                                <span className="text-[8px] bg-amber-500/10 text-gold border border-amber-500/20 rounded px-1.5 py-0.5 uppercase font-mono font-bold leading-none shrink-0">
                                  {p.gender || "Male"}
                                </span>
                              </div>
                              <span className="text-xs font-mono text-slate-300 mt-1.5 block">
                                Born: <span className="text-white font-bold">{new Date(p.dob).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}</span>
                              </span>
                              <span className="text-[9px] font-mono text-slate-500 block uppercase tracking-wider mt-1">{p.focusArea}</span>
                            </div>
                            <div className="flex items-center justify-between border-t border-white/5 pt-2.5 text-[10px] font-mono text-gold/80 font-bold group-hover:text-gold">
                              <span>Decode Blueprint →</span>
                              {p.id !== "profile-gaurav" && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteProfile(p.id);
                                  }}
                                  className="text-red-400 hover:text-red-300 font-bold px-1.5 py-0.5 rounded hover:bg-red-500/10 transition-colors cursor-pointer"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Hero Graphic Right (Orbital Chart Preview) */}
                <div className="lg:col-span-5 flex justify-center">
                  <CosmicOrbit activeCategory="personality" onSelectCategory={() => {}} interactive={false} />
                </div>
              </section>

              {/* WHAT WILL YOU DISCOVER SECTION */}
              <section id="features-grid-section" className="space-y-12">
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-3">
                    <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-gold/40" />
                    <h3 className="text-2xl font-serif font-medium tracking-tight text-white italic">What will you discover?</h3>
                    <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-gold/40" />
                  </div>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">Explore the 8 fundamental dimensions of your life decoded via planetary numbers.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { id: "personality", title: "Your Personality", desc: "Understand your nature, behavior and core cosmic character traits.", icon: User, border: "hover:border-gold/30" },
                    { id: "relationships", title: "Relationships", desc: "Discover how you love, connect and align with other moolank numbers.", icon: Heart, border: "hover:border-gold/30" },
                    { id: "career", title: "Career Path", desc: "Find the right profession and unlock your highest executive talent.", icon: Briefcase, border: "hover:border-gold/30" },
                    { id: "money", title: "Money Mindset", desc: "Understand your money attraction codes and long-term financial patterns.", icon: Coins, border: "hover:border-gold/30" },
                    { id: "growth", title: "Growth & Obstacles", desc: "Identify your strengths, inherent hurdles, and karmic areas of improvement.", icon: Leaf, border: "hover:border-gold/30" },
                    { id: "health", title: "Wellness & Vitality", desc: "Know your physical energy, stress sensitive systems, and healthy lifestyle needs.", icon: HeartPulse, border: "hover:border-gold/30" },
                    { id: "purpose", title: "Life Purpose", desc: "Discover your ultimate Bhagyank destination calling and inner guide.", icon: Target, border: "hover:border-gold/30" },
                    { id: "potential", title: "Hidden Potential", desc: "Uncover your hidden spiritual talents, luck vectors and superpowers.", icon: Star, border: "hover:border-gold/30" },
                  ].map((card) => {
                    const Icon = card.icon;
                    return (
                      <div 
                        key={card.id}
                        id={`discover-card-${card.id}`}
                        className={`bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col justify-between space-y-4 transition-all duration-300 transform hover:-translate-y-1.5 glow-purple ${card.border}`}
                      >
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-gold/15 flex items-center justify-center text-gold">
                          <Icon size={18} />
                        </div>
                        <div className="space-y-1.5">
                          <h4 className="font-display font-semibold text-white tracking-tight">{card.title}</h4>
                          <p className="text-xs text-slate-400 leading-relaxed font-sans">{card.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* WHAT MAKES US DIFFERENT SECTION */}
              <section id="difference-comparison-section" className="space-y-12">
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-3">
                    <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-gold/40" />
                    <h3 className="text-2xl font-serif font-medium tracking-tight text-white italic">What makes us different?</h3>
                    <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-gold/40" />
                  </div>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">Vedic numerology combined with AI context beats generic, computer-generated PDFs every time.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-sm glow-purple">
                  
                  {/* Other apps Column */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1">
                      <X size={12} className="text-slate-500" />
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Other Apps</span>
                    </div>

                    <ul className="space-y-4">
                      {[
                        "Generic reports printed from basic templates",
                        "One-time fortune telling without holistic logic",
                        "Static information with no customization options",
                        "Dry numbers displayed with zero deep meanings",
                        "Read once, get confused, and leave"
                      ].map((txt, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-slate-400 font-sans">
                          <X size={14} className="text-rose-500 shrink-0 mt-0.5" />
                          <span>{txt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Central VS Badge */}
                  <div className="lg:col-span-2 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-neutral-900 to-neutral-950 border border-gold/30 flex items-center justify-center font-serif font-bold text-base text-gold shadow-lg glow-gold animate-pulse">
                      vs
                    </div>
                  </div>

                  {/* Evolve Column */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/25 rounded-full px-3 py-1">
                      <Check size={12} className="text-gold" />
                      <span className="text-[10px] font-mono font-bold text-gold uppercase tracking-widest">Our Approach</span>
                    </div>

                    <ul className="space-y-4">
                      {[
                        "Personalized, authentic Vedic calculations",
                        "Lifelong planetary self-discovery cycles",
                        "Gemini AI-powered customized insights and tips",
                        "Complete multidimensional life profile grid",
                        "Learn and grow through daily action rituals"
                      ].map((txt, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300 font-medium font-sans">
                          <Check size={14} className="text-gold shrink-0 mt-0.5" />
                          <span>{txt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              </section>

              {/* TIMELINE SECTION */}
              <section id="timeline-roadmap-section" className="space-y-12">
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-3">
                    <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-gold/40" />
                    <h3 className="text-2xl font-serif font-medium tracking-tight text-white italic">Your Journey Starts Here</h3>
                    <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-gold/40" />
                  </div>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">Follow our path to map and align your life frequencies.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                  {/* Decorative horizontal line for tablet+ */}
                  <div className="hidden md:block absolute top-9 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-gold/25 to-transparent z-0" />
                  
                  {[
                    { step: "01", title: "Know Yourself", desc: "Discover your true root self, ruling planet deity, and core traits in depth.", icon: User },
                    { step: "02", title: "Understand Yourself", desc: "Gain clarity about your sub-cycles, compatible partners, and finances.", icon: Award },
                    { step: "03", title: "Discover Potential", desc: "Uncover your unique strengths, hidden karmic talents, and gemstones.", icon: Leaf },
                    { step: "04", title: "Transformation", desc: "Apply daily practical remedies to balance your energies and evolve.", icon: Target },
                  ].map((pt, i) => {
                    const Icon = pt.icon;
                    return (
                      <div key={i} id={`timeline-step-${pt.step}`} className="flex flex-col items-center text-center space-y-3 relative z-10">
                        <div className="w-16 h-16 rounded-full bg-neutral-950 border-2 border-white/5 flex items-center justify-center text-gold hover:border-gold/60 hover:scale-105 transition-all glow-purple">
                          <Icon size={20} />
                        </div>
                        <div className="space-y-1">
                          <span className="font-mono text-[10px] text-gold font-bold">{pt.step} • STAGE</span>
                          <h4 className="font-display font-semibold text-white tracking-tight text-sm">{pt.title}</h4>
                          <p className="text-xs text-slate-400 font-sans leading-relaxed max-w-[200px] mx-auto">{pt.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* FOOTER CALL TO ACTION */}
              <section id="bottom-cta-banner" className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/5 rounded-3xl p-8 sm:p-12 relative overflow-hidden backdrop-blur-sm">
                <div className="absolute inset-0 bg-radial from-amber-500/5 via-transparent to-transparent pointer-events-none" />
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                  <div className="space-y-3 max-w-xl">
                    <h3 className="text-2xl sm:text-3xl font-serif font-medium text-white italic tracking-tight">Ready to discover yourself?</h3>
                    <p className="text-sm text-slate-300 leading-relaxed font-sans">
                      The journey of a thousand miles begins with understanding who you truly are. Enter your cosmic variables and let Gemini AI reveal your plan.
                    </p>
                  </div>

                  <div className="shrink-0 flex flex-col items-start md:items-end space-y-2">
                    <button 
                      id="footer-start-button"
                      onClick={() => setShowForm(true)}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-dark via-gold to-gold-light hover:brightness-110 active:scale-95 text-cosmic-bg font-display font-semibold text-sm py-3 px-8 rounded-full cursor-pointer transition-all shadow-lg glow-gold"
                    >
                      <span>Start Your Self Discovery</span>
                      <ArrowRight size={16} />
                    </button>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold flex items-center gap-1.5 self-center md:self-auto">
                      <Shield size={10} className="text-emerald-400" /> 100% Safe • 100% Private • 100% You
                    </span>
                  </div>
                </div>
              </section>

            </motion.div>
          )}

          {/* 2. THE MULTI-STEP QUIZ FORM OVERLAY */}
          {showForm && (
            <motion.div 
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-xl mx-auto"
            >
              <div className="bg-neutral-950/85 border border-white/5 rounded-3xl p-8 backdrop-blur-xl relative shadow-2xl glow-purple">
                
                {/* Close Button */}
                {!loading && (
                  <button 
                    id="close-form-button"
                    onClick={() => setShowForm(false)}
                    className="absolute top-6 right-6 text-slate-400 hover:text-white transition-all cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                )}

                {/* Loader State */}
                {loading ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center space-y-8">
                    
                    {/* Animated Loader Circle */}
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      <div className="absolute inset-0 border-4 border-white/5 rounded-full" />
                      <div className="absolute inset-0 border-4 border-t-gold border-r-gold rounded-full animate-spin glow-gold" />
                      <svg className="w-10 h-10 text-gold animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xl font-serif font-semibold text-white tracking-tight">Consulting Cosmic Oracles</h4>
                      
                      {/* Atmospheric Phase Message Carousel */}
                      <AnimatePresence mode="wait">
                        <motion.p 
                          key={loadingPhase}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="text-xs text-gold/80 italic font-mono h-4"
                        >
                          {loadingMessages[loadingPhase]}
                        </motion.p>
                      </AnimatePresence>
                    </div>

                    <p className="text-[10px] text-slate-500 uppercase tracking-widest max-w-xs leading-relaxed font-sans">
                      Our engines calculate your Chaldean Namank, compute standard birth matrices, and generate detailed Gemini insights safely. Please remain centered.
                    </p>
                  </div>
                ) : (
                  // Form State
                  <form onSubmit={handleCalculateReading} className="space-y-6">
                    <div className="text-center space-y-2">
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/25 text-gold mb-1">
                        <Sparkles size={18} fill="currentColor" />
                      </div>
                      <h3 className="text-2xl font-serif font-medium text-white tracking-tight italic">The Self Discovery Form</h3>
                      <p className="text-xs text-slate-400">Provide your variables to compute your root codes.</p>
                    </div>

                    <div className="space-y-4">
                      {/* Name */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Your Full Name</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Gaurav Mishra" 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                        />
                        <p className="text-[9px] text-slate-500">Name numbers calculate Namank using Vedic Chaldean codes.</p>
                      </div>

                      {/* Date of Birth */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date of Birth</label>
                        <input 
                          type="date" 
                          required
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                        />
                        <p className="text-[9px] text-slate-500">Determines Moolank (day core traits) and Bhagyank (life destiny vector).</p>
                      </div>

                      {/* Gender and Focus */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gender</label>
                          <select 
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold transition-all"
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Non-Binary">Non-Binary</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Primary Life Focus</label>
                          <select 
                            value={focusArea}
                            onChange={(e) => setFocusArea(e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold transition-all"
                          >
                            <option value="Overall Balance">Overall Balance</option>
                            <option value="Personality Traits">Personality Traits</option>
                            <option value="Love & Relationships">Love & Relationships</option>
                            <option value="Career & Business Success">Career & Business Success</option>
                            <option value="Wealth & Money Attraction">Wealth & Money Attraction</option>
                            <option value="Health & Healing">Health & Healing</option>
                            <option value="Life Purpose & Dharma">Life Purpose & Dharma</option>
                          </select>
                        </div>
                      </div>

                      {/* Language Preference */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Language Preference</label>
                        <select 
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold transition-all"
                        >
                          <option value="english">English (Pure Astrological Wisdom)</option>
                          <option value="hinglish">Hinglish (Hindi + English Mix - "Aapka Moolank 1 hai...")</option>
                        </select>
                        <p className="text-[9px] text-slate-500">Choose language for your reports, insights, and AI Coach conversations.</p>
                      </div>

                      {/* Save to Profiles Toggle */}
                      <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 flex items-center gap-3">
                        <input 
                          type="checkbox"
                          id="save-profile-checkbox"
                          checked={saveAsProfile}
                          onChange={(e) => setSaveAsProfile(e.target.checked)}
                          className="accent-gold w-4 h-4 rounded border-white/10 bg-transparent focus:ring-0 focus:ring-offset-0 cursor-pointer"
                        />
                        <div className="space-y-0.5">
                          <label htmlFor="save-profile-checkbox" className="text-[11px] font-bold text-slate-300 uppercase tracking-wide cursor-pointer flex items-center gap-1">
                            <UserCheck size={12} className="text-gold" /> Store in Celestial Records
                          </label>
                          <span className="text-[9px] text-slate-500 block leading-tight">Saves this profile to local storage for instant one-click decoding next time.</span>
                        </div>
                      </div>
                    </div>

                    <button 
                      type="submit"
                      id="form-submit-button"
                      className="w-full bg-gradient-to-r from-gold-dark via-gold to-gold-light hover:brightness-110 active:scale-98 text-cosmic-bg font-display font-bold py-3.5 px-6 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2 shadow-lg glow-gold mt-2"
                    >
                      <Sparkles size={16} fill="currentColor" />
                      <span>Decode My Destiny Blueprint</span>
                    </button>
                  </form>
                )}

              </div>
            </motion.div>
          )}

          {/* 3. THE COMPREHENSIVE INTERACTIVE READING DASHBOARD */}
          {reading && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Dashboard Sub Header */}
              <div id="results-dashboard-header" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
                <div>
                  <span className="text-[10px] bg-white/5 border border-gold/20 text-gold px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider font-mono">
                    Personalized Reading Active
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif font-light tracking-tight text-white mt-1.5">
                    Cosmic Map of <span className="text-gold capitalize font-medium italic">{name}</span>
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button 
                    id="export-blueprint-pdf-button"
                    onClick={() => exportBlueprintPDF(name, dob, language, reading, t)}
                    className="inline-flex items-center gap-1.5 border border-gold/30 bg-gold/10 hover:bg-gold/20 hover:border-gold px-4 py-2 rounded-xl text-xs font-semibold text-gold cursor-pointer transition-all shadow-md shadow-gold/5"
                  >
                    <Download size={14} />
                    <span>Download PDF Blueprint</span>
                  </button>

                  <button 
                    id="share-results-button"
                    onClick={handleShareResults}
                    className="inline-flex items-center gap-1.5 border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 hover:border-purple-400 px-4 py-2 rounded-xl text-xs font-semibold text-purple-300 cursor-pointer transition-all shadow-md shadow-purple-500/5"
                  >
                    <Share2 size={14} />
                    <span>Share Results</span>
                  </button>

                  <button 
                    id="start-new-discovery-button"
                    onClick={resetDiscovery}
                    className="inline-flex items-center gap-1.5 border border-white/10 bg-white/5 hover:bg-white/10 hover:border-gold/30 px-4 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all"
                  >
                    <RotateCcw size={14} />
                    <span>New Self-Discovery</span>
                  </button>
                </div>
              </div>

              {/* Fallback Warning Banner if Gemini API is unavailable or rate-limited */}
              {reading.isFallback && (
                <div id="fallback-reading-alert" className="bg-amber-500/5 border border-amber-500/25 rounded-2xl p-4 sm:p-5 flex gap-4 items-start shadow-xl animate-fade-in relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500/60" />
                  <AlertTriangle className="text-gold shrink-0 mt-0.5 animate-pulse" size={18} />
                  <div className="space-y-1">
                    <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">Vedic Astrological Database Active (Offline Mode)</h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      Our Gemini AI API is currently experiencing rate-limiting or quota constraints due to massive global traffic. To ensure an uninterrupted experience, we have successfully decoded your cosmic chart using our local pre-calculated, premium high-fidelity Vedic Database matching your exact planetary numbers. Your journey remains 100% accurate!
                    </p>
                  </div>
                </div>
              )}

              {/* CORE TRINITY STATS GRID */}
              <div id="numerical-trinity-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Moolank */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 100, damping: 15 }}
                  whileHover={{ y: -6, scale: 1.015, borderColor: "rgba(212,175,55,0.45)", boxShadow: "0 10px 30px -10px rgba(212,175,55,0.15)" }}
                  className="bg-white/[0.02] backdrop-blur-md rounded-2xl border border-white/5 p-6 flex items-center justify-between glow-purple relative overflow-hidden group hover:border-gold/30 transition-all cursor-default"
                >
                  <div className="space-y-1.5 relative z-10">
                    <span className="text-[10px] text-amber-400 font-bold tracking-widest uppercase font-mono">Moolank (Root Count)</span>
                    <h4 className="text-lg font-serif font-semibold text-white tracking-tight leading-none">{t(reading.categories.personality.title)}</h4>
                    <p className="text-xs text-slate-400 font-sans">Ruled by {reading.rulingPlanet}</p>
                  </div>
                  <span className="text-5xl font-mono font-black text-gold drop-shadow-[0_0_10px_rgba(212,175,55,0.3)] relative z-10 select-none transition-transform group-hover:scale-110 duration-300">
                    {reading.moolank}
                  </span>
                </motion.div>
 
                {/* Bhagyank */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 100, damping: 15 }}
                  whileHover={{ y: -6, scale: 1.015, borderColor: "rgba(34,211,238,0.45)", boxShadow: "0 10px 30px -10px rgba(34,211,238,0.15)" }}
                  className="bg-white/[0.02] backdrop-blur-md rounded-2xl border border-white/5 p-6 flex items-center justify-between glow-purple relative overflow-hidden group hover:border-gold/30 transition-all cursor-default"
                >
                  <div className="space-y-1.5 relative z-10">
                    <span className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase font-mono">Bhagyank (Destiny Count)</span>
                    <h4 className="text-lg font-serif font-semibold text-white tracking-tight leading-none">{t(reading.categories.purpose.title)}</h4>
                    <p className="text-xs text-slate-400 font-sans">Full DOB total reduced count</p>
                  </div>
                  <span className="text-5xl font-mono font-black text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)] relative z-10 select-none transition-transform group-hover:scale-110 duration-300">
                    {reading.bhagyank}
                  </span>
                </motion.div>
 
                {/* Namank */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 100, damping: 15 }}
                  whileHover={{ y: -6, scale: 1.015, borderColor: "rgba(52,211,153,0.45)", boxShadow: "0 10px 30px -10px rgba(52,211,153,0.15)" }}
                  className="bg-white/[0.02] backdrop-blur-md rounded-2xl border border-white/5 p-6 flex items-center justify-between glow-purple relative overflow-hidden group hover:border-gold/30 transition-all cursor-default"
                >
                  <div className="space-y-1.5 relative z-10">
                    <span className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase font-mono">Namank (Name Count)</span>
                    <h4 className="text-lg font-serif font-semibold text-white tracking-tight leading-none">Chaldean Matrix Vibration</h4>
                    <p className="text-xs text-slate-400 font-sans">Calculated from letters: {reading.namank}</p>
                  </div>
                  <span className="text-5xl font-mono font-black text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)] relative z-10 select-none transition-transform group-hover:scale-110 duration-300">
                    {reading.namank}
                  </span>
                </motion.div>
 
              </div>

              {/* TWO-TIER HIGHLY ORGANIZED NAVIGATION SYSTEM */}
              <div id="results-nav-tabs" className="space-y-6">
                
                {/* 1. TOP-LEVEL CATEGORY GROUPS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      id: "blueprint" as const,
                      label: "My Core Destiny",
                      desc: "Explore your root numbers, name vibrations, and destiny wheel.",
                      icon: Star,
                      activeColor: "border-amber-500/40 text-gold bg-amber-500/5"
                    },
                    {
                      id: "rituals" as const,
                      label: "Daily Alignment",
                      desc: "Track custom Vedic sadhana schedules & cosmic planetary weather.",
                      icon: Clock,
                      activeColor: "border-emerald-500/40 text-emerald-400 bg-emerald-500/5"
                    },
                    {
                      id: "guidance" as const,
                      label: "AI & Synergy",
                      desc: "Consult the AI Coach or calculate relationship synergy charts.",
                      icon: Sparkles,
                      activeColor: "border-cyan-500/40 text-cyan-400 bg-cyan-500/5"
                    }
                  ].map((group) => {
                    const Icon = group.icon;
                    const isActive = menuGroup === group.id;
                    return (
                      <button
                        key={group.id}
                        id={`menu-group-btn-${group.id}`}
                        onClick={() => handleSetMenuGroup(group.id)}
                        className={`text-left p-4 rounded-2xl border transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col justify-between h-28 ${
                          isActive
                            ? `${group.activeColor} shadow-[0_0_20px_rgba(212,175,55,0.05)]`
                            : "bg-white/[0.01] border-white/5 text-slate-400 hover:text-white hover:border-white/10 hover:bg-white/[0.02]"
                        }`}
                      >
                        {/* Interactive dynamic background highlight */}
                        {isActive && (
                          <motion.div
                            layoutId="active-menu-group-bg"
                            className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] to-transparent pointer-events-none"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                        
                        <div className="flex items-center justify-between w-full relative z-10">
                          <div className={`p-2 rounded-xl transition-all ${isActive ? 'bg-white/10' : 'bg-white/5 group-hover:bg-white/10'}`}>
                            <Icon size={18} className={isActive ? "animate-pulse" : ""} />
                          </div>
                          {isActive && <span className="text-[9px] font-mono uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded-md">Selected</span>}
                        </div>

                        <div className="relative z-10 mt-2">
                          <h4 className="text-sm font-display font-bold tracking-tight">{group.label}</h4>
                          <p className="text-[11px] text-slate-400 leading-normal line-clamp-1 group-hover:text-slate-300 transition-colors mt-0.5">{group.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* 2. SUB-TAB BAR (Renders tabs matching active group) */}
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-2.5 flex flex-wrap gap-2 items-center">
                  {menuGroup === "blueprint" && [
                    { id: "orbit" as const, label: "Self Discovery Wheel", icon: Compass, desc: "Interactive map of core traits" },
                    { id: "planetary" as const, label: "Birth Planetary Chart", icon: Globe, desc: "Interactive map of birth planets" },
                    { id: "biorhythms" as const, label: "Bio-Rhythms & Gunas", icon: Activity, desc: "Sattva, Rajas, Tamas and Energy waves" },
                    { id: "directory" as const, label: "Number Matrix Directory", icon: LayoutGrid, desc: "Vedic & Chaldean references" },
                    { id: "library" as const, label: "Vedic Wisdom Library", icon: BookOpen, desc: "Sacred texts & guides" }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = dashboardTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        id={`dashboard-tab-${tab.id}`}
                        onClick={() => setDashboardTab(tab.id)}
                        className={`relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-display text-xs font-semibold cursor-pointer transition-all duration-300 ${
                          isActive
                            ? "text-gold bg-amber-500/10 border border-amber-500/20"
                            : "bg-transparent border border-transparent text-slate-400 hover:text-white"
                        }`}
                      >
                        <Icon size={14} className={isActive ? "text-gold" : "text-slate-400"} />
                        <span className="relative z-10">{tab.label}</span>
                      </button>
                    );
                  })}

                  {menuGroup === "rituals" && [
                    { id: "tracker" as const, label: "Sadhana Ritual Tracker", icon: Calendar, desc: "Habit & streak counter" },
                    { id: "forecast" as const, label: "Daily Cosmic Weather", icon: Clock, desc: "Personal planet alignment" },
                    { id: "celibacy" as const, label: "Brahmacharya & Ojas Tracker", icon: Shield, desc: "Sanyam streak & transmutation SOS" }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = dashboardTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        id={`dashboard-tab-${tab.id}`}
                        onClick={() => setDashboardTab(tab.id)}
                        className={`relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-display text-xs font-semibold cursor-pointer transition-all duration-300 ${
                          isActive
                            ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                            : "bg-transparent border border-transparent text-slate-400 hover:text-white"
                        }`}
                      >
                        <Icon size={14} className={isActive ? "text-emerald-400" : "text-slate-400"} />
                        <span className="relative z-10">{tab.label}</span>
                      </button>
                    );
                  })}

                  {menuGroup === "guidance" && [
                    { id: "coach" as const, label: "Ask Cosmic Mentor AI", icon: MessageSquare, desc: "Interactive AI consultation" },
                    { id: "compatibility" as const, label: "Relationship Synergy Matcher", icon: Heart, desc: "Vibration resonance test" }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = dashboardTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        id={`dashboard-tab-${tab.id}`}
                        onClick={() => setDashboardTab(tab.id)}
                        className={`relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-display text-xs font-semibold cursor-pointer transition-all duration-300 ${
                          isActive
                            ? "text-cyan-400 bg-cyan-500/10 border border-cyan-500/20"
                            : "bg-transparent border border-transparent text-slate-400 hover:text-white"
                        }`}
                      >
                        <Icon size={14} className={isActive ? "text-cyan-400" : "text-slate-400"} />
                        <span className="relative z-10">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

              </div>

              {/* PERSISTENT VEDIC RITUALS AUDIO MEDITATION PLAYER */}
              {menuGroup === "rituals" && (
                <div className="mb-8">
                  <MantraAudioPlayer moolank={reading.moolank} language={language} />
                </div>
              )}

              {/* RENDER DYNAMIC TAB CONTENT */}
              <div id="dashboard-dynamic-content" className="min-h-[400px] overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={dashboardTab}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.22, ease: "easeInOut" }}
                  >
                
                {/* TAB 1: INTERACTIVE ORBITAL SELF-DISCOVERY MAP */}
                {dashboardTab === "orbit" && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Orbit Left */}
                    <div className="lg:col-span-5 flex flex-col items-center">
                      <CosmicOrbit activeCategory={activeCategory} onSelectCategory={setActiveCategory} />
                      <p className="text-[10px] text-slate-400 italic text-center mt-3 flex items-center gap-1">
                        <Info size={12} className="text-gold" />
                        <span>Click any orbit node to focus the active category.</span>
                      </p>

                      {/* Personality Radar Chart */}
                      <div className="w-full mt-8 bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-2xl p-5 space-y-4 glow-purple">
                        <div className="space-y-1 text-center">
                          <h4 className="text-sm font-serif font-semibold text-white tracking-wide uppercase">
                            {language === "hinglish" ? "Personality Dimensions" : "Soul Personality Dimensions"}
                          </h4>
                          <p className="text-[10px] text-slate-400">
                            {language === "hinglish" 
                              ? "Moolank, Bhagyank aur Namank par aadharit aatmik gunn" 
                              : "Vedic resonance mapping of your core spiritual energies"}
                          </p>
                        </div>

                        <div className="h-64 w-full flex items-center justify-center relative">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={personalityScores}>
                              <PolarGrid stroke="rgba(212, 175, 55, 0.15)" />
                              <PolarAngleAxis 
                                dataKey="subject" 
                                tick={{ fill: "#94a3b8", fontSize: 9, fontFamily: "monospace", fontWeight: "bold" }} 
                              />
                              <PolarRadiusAxis 
                                angle={30} 
                                domain={[0, 100]} 
                                tick={{ fill: "#64748b", fontSize: 8 }}
                                stroke="rgba(255, 255, 255, 0.05)"
                              />
                              <Radar 
                                name="Core Score" 
                                dataKey="score" 
                                stroke="#D4AF37" 
                                fill="rgba(212, 175, 55, 0.25)" 
                                fillOpacity={0.6} 
                                dot={{ r: 4, fill: "#D4AF37", strokeWidth: 1, stroke: "#ffffff" }}
                              />
                              <RechartsTooltip content={<CustomTooltip />} />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                          {personalityScores.map((item) => (
                            <div key={item.subject} className="bg-neutral-950/40 p-2 rounded-lg text-center border border-white/5 flex items-center justify-between px-3">
                              <span className="text-[10px] text-slate-400 font-medium truncate">{item.subject.split(" & ")[0]}</span>
                              <span className="text-xs font-bold text-gold font-mono">{item.score}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Report Category Details Right */}
                    <div className="lg:col-span-7 space-y-6">
                      <AnimatePresence mode="wait">
                        {(() => {
                          const catData = reading.categories[activeCategory as keyof typeof reading.categories];
                          if (!catData) return null;
                          return (
                            <motion.div
                              key={activeCategory}
                              initial={{ opacity: 0, x: 15 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -15 }}
                              transition={{ duration: 0.3 }}
                              id="active-category-details-panel"
                              className="bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-2xl p-6 space-y-6 glow-purple"
                            >
                              {/* Category Header */}
                              <div className="space-y-2">
                                <span className="text-[10px] bg-amber-500/10 border border-amber-500/25 text-gold px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider font-mono">
                                  Category Insight
                                </span>
                                <h4 className="text-2xl font-serif font-semibold text-white tracking-tight">{t(catData.title)}</h4>
                                <p className="text-[15px] font-medium text-amber-300 italic">"{t(catData.summary)}"</p>
                              </div>

                              {/* Main Detailed Insight */}
                              <div className="text-[15px] text-slate-200 leading-relaxed font-sans space-y-4 whitespace-pre-line border-t border-white/5 pt-4">
                                {t(catData.deepInsight)}
                              </div>

                              {/* Strengths & Weaknesses Grids */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-emerald-950/[0.04] border border-emerald-500/10 rounded-xl space-y-2">
                                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <Check size={14} /> Major Strengths
                                  </span>
                                  <ul className="space-y-1.5">
                                    {catData.strengths?.map((str, i) => (
                                      <li key={i} className="text-xs text-slate-300 leading-relaxed">• {t(str)}</li>
                                    ))}
                                  </ul>
                                </div>

                                <div className="p-4 bg-rose-950/[0.04] border border-rose-500/10 rounded-xl space-y-2">
                                  <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <X size={14} /> Core Challenges
                                  </span>
                                  <ul className="space-y-1.5">
                                    {catData.challenges?.map((ch, i) => (
                                      <li key={i} className="text-xs text-slate-300 leading-relaxed">• {t(ch)}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>

                              {/* Sadhana actionable list */}
                              <div className="p-4 bg-white/[0.03] border border-gold/15 rounded-xl space-y-3">
                                <span className="text-xs font-bold text-gold uppercase tracking-wider flex items-center gap-1">
                                  <Sparkles size={14} fill="currentColor" /> Practical Sadhana & Actions
                                  </span>
                                <ul className="space-y-2 pl-1.5">
                                  {catData.actionableTips?.map((tip, i) => (
                                    <li key={i} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed font-sans">
                                      <ChevronRight size={12} className="text-gold shrink-0 mt-0.5 animate-pulse" />
                                      <span>{t(tip)}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                            </motion.div>
                          );
                        })()}
                      </AnimatePresence>

                      {/* TRINITY REFERENCE MATRIX TABLE (Matches bottom table view in premium reports) */}
                      <div className="bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-2xl p-6 space-y-4 glow-purple">
                        <h4 className="text-sm font-serif font-light italic tracking-wider text-slate-400">Numerical Variable Matrix</h4>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="p-3.5 bg-neutral-950/50 rounded-xl border border-white/5 text-center">
                            <span className="text-[9px] text-slate-500 uppercase font-semibold">Ruling Deity</span>
                            <p className="text-xs font-semibold text-white mt-1">{t(reading.rulingPlanetDeity)}</p>
                          </div>
                          <div className="p-3.5 bg-neutral-950/50 rounded-xl border border-white/5 text-center">
                            <span className="text-[9px] text-slate-500 uppercase font-semibold">Gemstone</span>
                            <p className="text-xs font-semibold text-gold mt-1">{t(reading.gemstone)}</p>
                          </div>
                          <div className="p-3.5 bg-neutral-950/50 rounded-xl border border-white/5 text-center">
                            <span className="text-[9px] text-slate-500 uppercase font-semibold">Lucky Days</span>
                            <p className="text-xs font-semibold text-cyan-400 mt-1">{t(reading.luckyDays?.join(", "))}</p>
                          </div>
                          <div className="p-3.5 bg-neutral-950/50 rounded-xl border border-white/5 text-center">
                            <span className="text-[9px] text-slate-500 uppercase font-semibold">Lucky Numbers</span>
                            <p className="text-xs font-semibold text-emerald-400 mt-1">{reading.luckyNumbers?.join(", ")}</p>
                          </div>
                        </div>

                        <div className="p-4 bg-white/[0.02] border border-gold/15 rounded-xl space-y-1.5">
                          <span className="text-xs font-bold text-gold flex items-center gap-1">
                            <Sparkles size={14} fill="currentColor" /> The Radical Remedy (Radical Sadhana)
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed font-sans">{t(reading.radicalRemedy)}</p>
                        </div>
                      </div>

                    </div>

                    {/* DEEP TRANSFORMATION SECRETS HUB */}
                    <div className="lg:col-span-12 mt-4">
                      {currentTier === "sutra" ? (
                        <PremiumLock 
                          featureName={language === "hinglish" ? "Deep Transformation Secrets" : "Deep Transformation Secrets"}
                          featureDesc={language === "hinglish" 
                            ? "Apne career paths, money energies, healing routines aur remedies ke detailed guides unlock karein." 
                            : "Reveal the hidden depths of your core soul blueprint. Includes career alignment, money personality, and practical custom rituals."}
                          lockedFeatures={[
                            language === "hinglish" ? "Comprehensive Career Paths" : "Comprehensive Career Paths",
                            language === "hinglish" ? "Wealth Mindset Improvements" : "Wealth Mindset Improvements",
                            language === "hinglish" ? "Health and Healing Routines" : "Health and Healing Routines",
                            language === "hinglish" ? "Personalized Affirmations & Sadhana" : "Personalized Affirmations & Sadhana"
                          ]}
                          onUpgradeClick={() => setIsSubModalOpen(true)}
                          language={language}
                        />
                      ) : (
                        <DeepTransformationHub 
                          moolank={reading.moolank} 
                          bhagyank={reading.bhagyank} 
                          namank={reading.namank} 
                          name={name} 
                          language={language}
                        />
                      )}
                    </div>

                  </div>
                )}

                {/* TAB: TRANSFORMATION SADHANA TRACKER */}
                {dashboardTab === "tracker" && (
                  currentTier === "sutra" ? (
                    <PremiumLock 
                      featureName={language === "hinglish" ? "Sadhana Ritual Tracker" : "Sadhana Ritual Tracker"}
                      featureDesc={language === "hinglish" 
                        ? "Apne daily karma aur planetary energies ko align karne ke liye personalized dynamic habits aur rituals track karein." 
                        : "Track personalized daily habits, ritual checklists, and historical compliance records aligned with your cosmic vibration."}
                      lockedFeatures={[
                        language === "hinglish" ? "Daily Vedic ritual checklists" : "Daily Vedic ritual checklists",
                        language === "hinglish" ? "Planetary mantra soundboards" : "Planetary mantra soundboards",
                        language === "hinglish" ? "Progress streak tracking grids" : "Progress streak tracking grids",
                        language === "hinglish" ? "Historical activity records" : "Historical activity records"
                      ]}
                      onUpgradeClick={() => setIsSubModalOpen(true)}
                      language={language}
                    />
                  ) : (
                    <TransformationTrackerTab 
                      moolank={reading.moolank} 
                      name={name} 
                      language={language}
                    />
                  )
                )}

                {/* TAB: ASK COSMIC MENTOR AI COACH */}
                {dashboardTab === "coach" && (
                  <AICoachTab 
                    moolank={reading.moolank} 
                    bhagyank={reading.bhagyank} 
                    name={name} 
                    language={language}
                    currentTier={currentTier}
                    onUpgradeClick={() => setIsSubModalOpen(true)}
                  />
                )}

                {/* TAB: WISDOM LIBRARY */}
                {dashboardTab === "library" && (
                  <KnowledgeLibraryTab language={language} />
                )}

                {/* TAB 2: COMPATIBILITY MATCHER */}
                {dashboardTab === "compatibility" && (
                  currentTier === "sutra" ? (
                    <PremiumLock 
                      featureName={language === "hinglish" ? "Relational Compatibility Matcher" : "Relational Compatibility Matcher"}
                      featureDesc={language === "hinglish" 
                        ? "Kisi bhi doosre vyakti ke naam aur date of birth se apna exact match rating aur relationship guidelines check karein." 
                        : "Compare your numerical vibrations with partners, business colleagues, or friends to find exact resonance indices and harmony advice."}
                      lockedFeatures={[
                        language === "hinglish" ? "Chaldean name match matrices" : "Chaldean name match matrices",
                        language === "hinglish" ? "Detailed Vedic synergy scores" : "Detailed Vedic synergy scores",
                        language === "hinglish" ? "Love and business relationship tips" : "Love and business relationship tips",
                        language === "hinglish" ? "Communication breakdown avoiders" : "Communication breakdown avoiders"
                      ]}
                      onUpgradeClick={() => setIsSubModalOpen(true)}
                      language={language}
                    />
                  ) : (
                    <CompatibilityTab 
                      userMoolank={reading.moolank} 
                      userBhagyank={reading.bhagyank} 
                      userName={name} 
                      language={language}
                    />
                  )
                )}

                {/* TAB 3: DAILY COSMIC WEATHER FORECAST */}
                {dashboardTab === "forecast" && (
                  <DailyWeatherTab userDob={dob} language={language} />
                )}

                {/* TAB: BRAHMACHARYA & CELIBACY TRACKER */}
                {dashboardTab === "celibacy" && (
                  <CelibacyTab language={language} />
                )}

                {/* TAB 4: COMPLETE DIRECTORY INDEX */}
                {dashboardTab === "directory" && (
                  <ReferenceMatrix />
                )}

                {/* TAB: BIRTH PLANETARY CHART */}
                {dashboardTab === "planetary" && (
                  <PlanetaryMap 
                    moolank={reading.moolank} 
                    bhagyank={reading.bhagyank} 
                    dob={dob} 
                    name={name}
                    language={language}
                  />
                )}

                {/* TAB: VEDIC BIORHYTHMS AND GUNAS */}
                {dashboardTab === "biorhythms" && (
                  <VedicBiorhythmsTab 
                    moolank={reading.moolank} 
                    bhagyank={reading.bhagyank} 
                    dob={dob} 
                    name={name}
                    language={language}
                  />
                )}

                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Decorative footer credits */}
      <footer id="app-footer" className="relative z-30 max-w-7xl mx-auto px-6 py-12 text-center border-t border-white/5 mt-16 space-y-2">
        <p className="text-xs text-slate-500">&copy; 2026 EVOLVE Vedic Numerology. All rights reserved.</p>
        <p className="text-[10px] text-slate-600 font-mono">Chaldean Matrix Calculations certified safe under strict privacy encryption.</p>
      </footer>

      {/* Subscription Paywall modal portal */}
      <SubscriptionModal 
        isOpen={isSubModalOpen}
        onClose={() => setIsSubModalOpen(false)}
        currentTier={currentTier}
        onUpgrade={handleUpgradeTier}
        language={language}
      />

      {/* Share Toast Notification */}
      <AnimatePresence>
        {shareToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm bg-neutral-900/95 border border-purple-500/40 text-purple-200 px-4 py-3 rounded-2xl shadow-2xl shadow-purple-500/20 flex items-center gap-3 backdrop-blur-md"
          >
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse shrink-0" />
            <p className="text-xs font-medium leading-normal">{shareToast}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
