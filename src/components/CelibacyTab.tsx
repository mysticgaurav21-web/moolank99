import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Shield,
  Flame,
  Zap,
  Activity,
  Award,
  Calendar,
  Sparkles,
  TrendingUp,
  RotateCcw,
  AlertTriangle,
  Brain,
  Timer,
  BookOpen,
  UserCheck,
  Compass,
  FileText,
  Heart,
  Plus,
  RefreshCw,
  HelpCircle,
  Eye,
  CheckCircle,
  Play,
  Volume2
} from "lucide-react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  CartesianGrid
} from "recharts";
import KundaliniChakraMap from "./KundaliniChakraMap";
import OjasQuotientQuiz from "./OjasQuotientQuiz";
import BrahmacharyaScienceLibrary from "./BrahmacharyaScienceLibrary";

interface CelibacyLog {
  date: string; // YYYY-MM-DD
  focusLevel: number; // 1-10
  temptationLevel: number; // 1-10
  transmuted: boolean;
  transmuteMethods: string[];
  notes: string;
}

export default function CelibacyTab({ language = "english" }: { language?: string }) {
  // Celibacy State stored in local storage
  const [streakDays, setStreakDays] = useState<number>(() => {
    const saved = localStorage.getItem("celibacy_streak_days");
    return saved ? parseInt(saved, 10) : 7; // Default initial streak for demo/feel
  });

  const [bestStreak, setBestStreak] = useState<number>(() => {
    const saved = localStorage.getItem("celibacy_best_streak");
    return saved ? parseInt(saved, 10) : 15;
  });

  const [startDateStr, setStartDateStr] = useState<string>(() => {
    const saved = localStorage.getItem("celibacy_start_date");
    if (saved) return saved;
    // Default start date is streakDays ago
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split("T")[0];
  });

  // Track daily logs
  const [logs, setLogs] = useState<CelibacyLog[]>(() => {
    const saved = localStorage.getItem("celibacy_logs");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    // Seed standard dummy data for the last 7 days so charts look beautiful immediately
    const today = new Date();
    const mockLogs: CelibacyLog[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      mockLogs.push({
        date: dateStr,
        focusLevel: 5 + (i % 4) + (i === 0 ? 3 : 0),
        temptationLevel: 8 - (i % 5),
        transmuted: i % 2 === 0,
        transmuteMethods: ["Meditation", "Pranayama"],
        notes: i === 0 ? "Felt highly energetic. Chanted Ganesha mantra when a wave arose." : "Stable mind today."
      });
    }
    return mockLogs;
  });

  // Daily Logging form
  const todayStr = new Date().toISOString().split("T")[0];
  const [focusInput, setFocusInput] = useState<number>(7);
  const [temptationInput, setTemptationInput] = useState<number>(3);
  const [notesInput, setNotesInput] = useState<string>("");
  const [transmuteSelected, setTransmuteSelected] = useState<string[]>(["Pranayama"]);
  const [hasLoggedToday, setHasLoggedToday] = useState<boolean>(false);

  // SOS Breath transmutation state
  const [isSosBreathing, setIsSosBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [breathTimer, setBreathTimer] = useState(4);
  const [breathCycles, setBreathCycles] = useState(0);

  // Active Vedic benefit info card index
  const [activeStageIndex, setActiveStageIndex] = useState<number>(1);

  // Celibacy inner sub-tab navigation
  const [subTab, setSubTab] = useState<"tracker" | "kundalini" | "ojas-test" | "science">("tracker");

  // Selected Chakra state for Kundalini Ascent map (0-6)
  const [selectedChakra, setSelectedChakra] = useState<number>(0);

  // Ojas Quotient Quiz state
  const [quizAnswers, setQuizAnswers] = useState<number[]>([3, 3, 3, 3, 3]);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [calculatingQuiz, setCalculatingQuiz] = useState<boolean>(false);

  // Sync state with localStorage
  useEffect(() => {
    localStorage.setItem("celibacy_streak_days", streakDays.toString());
    if (streakDays > bestStreak) {
      setBestStreak(streakDays);
      localStorage.setItem("celibacy_best_streak", streakDays.toString());
    }
  }, [streakDays, bestStreak]);

  useEffect(() => {
    localStorage.setItem("celibacy_start_date", startDateStr);
  }, [startDateStr]);

  useEffect(() => {
    localStorage.setItem("celibacy_logs", JSON.stringify(logs));
    const logged = logs.some(log => log.date === todayStr);
    setHasLoggedToday(logged);
  }, [logs, todayStr]);

  // Breathing loop timer for SOS Transmutation
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isSosBreathing) {
      interval = setInterval(() => {
        setBreathTimer((prev) => {
          if (prev <= 1) {
            // transition phase
            if (breathPhase === "inhale") {
              setBreathPhase("hold");
              return 4; // hold for 4s (Sama Vritti / Box Breath style)
            } else if (breathPhase === "hold") {
              setBreathPhase("exhale");
              return 4; // exhale for 4s
            } else {
              setBreathPhase("inhale");
              setBreathCycles(c => c + 1);
              return 4; // inhale for 4s
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setBreathTimer(4);
      setBreathPhase("inhale");
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSosBreathing, breathPhase]);

  // Handle setting a custom starting date (updates streak accordingly)
  const handleStartDateChange = (dateVal: string) => {
    if (!dateVal) return;
    setStartDateStr(dateVal);
    const start = new Date(dateVal);
    const today = new Date(todayStr);
    const diffTime = Math.abs(today.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setStreakDays(diffDays);
  };

  const handleIncrementStreak = () => {
    setStreakDays(prev => prev + 1);
    // Move start date 1 day back
    const d = new Date(startDateStr);
    d.setDate(d.getDate() - 1);
    setStartDateStr(d.toISOString().split("T")[0]);
  };

  const handleResetStreak = () => {
    if (window.confirm(language === "hinglish" ? "Kya aap sach mein streak reset karna chahte hain?" : "Are you sure you want to reset your streak? It will restore your starting point to today.")) {
      setStreakDays(0);
      setStartDateStr(todayStr);
    }
  };

  const handleSaveDailyLog = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: CelibacyLog = {
      date: todayStr,
      focusLevel: focusInput,
      temptationLevel: temptationInput,
      transmuted: transmuteSelected.length > 0,
      transmuteMethods: transmuteSelected,
      notes: notesInput
    };

    // Replace if already exists, else append
    const updated = logs.filter(log => log.date !== todayStr);
    updated.push(newLog);
    // Sort chronologically
    updated.sort((a, b) => a.date.localeCompare(b.date));
    setLogs(updated);
    setHasLoggedToday(true);
    
    // Auto-boost streak day slightly if logged successfully and streak was 0
    if (streakDays === 0) {
      setStreakDays(1);
    }
  };

  // Vedic Brahmacharya milestones definition
  const stages = useMemo(() => {
    const isHinglish = language === "hinglish";
    return [
      {
        days: 3,
        name: isHinglish ? "Prana Sthirta" : "Prana Stabilization",
        subTitle: "Vata-Pitta Balance",
        quote: "Indriya Nigraha: The restless sensory winds begin to slow down.",
        essence: isHinglish ? "Nerves aur dimag me thandak aane lagti hai." : "Subtle calming of the central nervous system occurs as chaotic sensory energy settles.",
        color: "#f87171",
        physiologicalBenefit: isHinglish ? "Testosterone baseline stable hota hai aur cravings kam hoti hain." : "Stabilization of nervous system reflexes; initial dopamine receptor reset.",
        transmutationTip: "Consume copper-vessel water in the morning. Practice 5 minutes of basic box breathing."
      },
      {
        days: 7,
        name: isHinglish ? "Virya Urja Shuru" : "Vital Surge Peak",
        subTitle: "Hormonal Synthesis & Drive",
        quote: "Tejas Avatara: Retained power begins to refine the blood chemistry.",
        essence: isHinglish ? "Semen retention se physical stamina aur confidence me sudden boost." : "Androgenic receptor upregulation leads to increased focus, clear motivation, and deep metabolic drive.",
        color: "#fb923c",
        physiologicalBenefit: isHinglish ? "Testosterone aur thyroid homeostasis balance me aate hain." : "Peak synthesis of seminal fluids, supporting physical vitality, skeletal strength, and cardiovascular rhythm.",
        transmutationTip: "Engage in active physical workouts. Do 10 rounds of Surya Namaskar to channel the heat."
      },
      {
        days: 14,
        name: isHinglish ? "Buddhi Shuddhi" : "Intellectual Clarity",
        subTitle: "Neuroplastic Rewiring",
        quote: "Medha Shakti: Intellectual brilliance shines like the early morning sun.",
        essence: isHinglish ? "Brain fog poori tarah khatam ho jata hai. Yaadash aur dhyan dugna." : "Elimination of heavy brain-fog. Prefrontal cortex returns to state of pristine operational integrity.",
        color: "#facc15",
        physiologicalBenefit: isHinglish ? "Cognitive performance aur mental endurance ka badhna." : "Decreased neural clutter; synthesis of BDNF (Brain-Derived Neurotrophic Factor) enhances synaptic flexibility.",
        transmutationTip: "Study complex scriptures or codes. Spend 15 minutes of quiet reading during sunset."
      },
      {
        days: 30,
        name: isHinglish ? "Ojas Utpatti" : "Aura Glow & Ojas Creation",
        subTitle: "Refinement of Dhatus",
        quote: "Veeryatva Vardhana: The sacred vital fluid refines into pure aura light.",
        essence: isHinglish ? "Chehre par tej (glow) aur aawaz me gambhirta aati hai." : "The seventh bodily tissue (Shukra Dhatu) begins to undergo transmutation into cosmic Ojas (spiritual vigor).",
        color: "#4ade80",
        physiologicalBenefit: isHinglish ? "Skin complexion me chamak aur immune system majboot." : "Vastly improved immune response (Pratibandhakatva) and tissue regeneration across the physical frame.",
        transmutationTip: "Perform Ashwini Mudra & Mulabandha. Meditate silently in total darkness for 10 minutes."
      },
      {
        days: 60,
        name: isHinglish ? "Sushumna Pravaha" : "Nervous System Armor",
        subTitle: "Psychological Resilience",
        quote: "Dharana Bala: Unshakable patience and spiritual mastery of thoughts.",
        essence: isHinglish ? "Mushkil paristhitiyon me bhi man shant aur dheet rehta hai." : "Nervous pathways are deeply armored against depression, stress, and toxic impulsive cues.",
        color: "#22d3ee",
        physiologicalBenefit: isHinglish ? "Adrenal glands bilkul stress-free ho jate hain." : "Normalized cortisol baseline, complete rejuvenation of exhausted adrenal reserves.",
        transmutationTip: "Maintain total control of eyes (Drishti Sanyam). Avoid staring at stimulating media."
      },
      {
        days: 90,
        name: isHinglish ? "Tejas Jagran" : "Luminous Aura Luster",
        subTitle: "Subtle Body Glow",
        quote: "Yashasvi Bhava: Radiant personality that commands natural respect.",
        essence: isHinglish ? "Aura itna bada ho jata hai ki log aapki taraf aakarshit hote hain." : "The subtle magnetic aura of the individual is fully charged, radiating natural peace, wisdom, and cosmic gravity.",
        color: "#818cf8",
        physiologicalBenefit: isHinglish ? "Nervous and metabolic tissue completely regenerate." : "Optimal functioning of the pineal and pituitary glands, inducing deeper meditative states.",
        transmutationTip: "Focus on higher self-realization (Svadhyaya). Avoid pride or arrogance; direct energy into seva."
      },
      {
        days: 120,
        name: isHinglish ? "Urdhvareta State" : "Alchemical Sublimation",
        subTitle: "Higher Spiritual Ascension",
        quote: "Urdhvaretas: The cosmic sexual current flows upward into Sahasrara.",
        essence: isHinglish ? "Veerya shakti Sahasrara chakra me jakar adhyatmik gyan banti hai." : "The primal energy flows permanently upward through the Sushumna nadi, fueling permanent spiritual bliss and absolute control.",
        color: "#a855f7",
        physiologicalBenefit: isHinglish ? "Man hamesha anandit aur parmatma se juda rehta hai." : "Deep alignment of all subtle koshas; sensory impulses are easily mastered without conflict.",
        transmutationTip: "Devote your life to universal creation. Practice Khechari Mudra and deep cosmic contemplation."
      }
    ];
  }, [language]);

  // 7 Chakras Database for Kundalini Ascent map
  const chakras = useMemo(() => {
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

  // Determine which stage the user is currently at
  const currentStage = useMemo(() => {
    let matched = stages[0];
    for (const stage of stages) {
      if (streakDays >= stage.days) {
        matched = stage;
      }
    }
    return matched;
  }, [streakDays, stages]);

  // Dynamic progress percentage to next milestone
  const nextMilestone = useMemo(() => {
    const next = stages.find(s => s.days > streakDays);
    if (!next) return { days: 120, pct: 100, label: "Infinite Mastery" };
    
    // Find previous milestone days
    const prevDays = [...stages].reverse().find(s => s.days <= streakDays)?.days || 0;
    const totalDiff = next.days - prevDays;
    const currentDiff = streakDays - prevDays;
    const pct = Math.min(100, Math.round((currentDiff / totalDiff) * 100));
    
    return {
      days: next.days,
      pct,
      label: next.name
    };
  }, [streakDays, stages]);

  const transmuteOptions = [
    { name: "Pranayama", desc: "Sohan / Alternate nostril breath" },
    { name: "Physical Exercise", desc: "Yoga / Surya Namaskar / Weights" },
    { name: "Mantra Chanting", desc: "Vedic sound frequency shield" },
    { name: "Scripture Study", desc: "Intellectual sublimation" },
    { name: "Cold Shower", desc: "Instantly routes blood from root" },
    { name: "Mauna (Silence)", desc: "Quiet vocal & mental energy conservation" }
  ];

  const toggleTransmuteOption = (name: string) => {
    setTransmuteSelected(prev => 
      prev.includes(name) ? prev.filter(x => x !== name) : [...prev, name]
    );
  };

  // Safe chart data rendering
  const chartData = useMemo(() => {
    return logs.map(log => {
      // Shorten date to simple MM/DD for visual space
      let dateLabel = log.date;
      try {
        const parts = log.date.split("-");
        if (parts.length === 3) {
          dateLabel = `${parts[1]}/${parts[2]}`;
        }
      } catch (e) {}

      // Calculate days difference between today and log's date to estimate streak day on that day
      let streakOnDate = 1;
      try {
        const logTime = new Date(log.date).getTime();
        const todayTime = new Date(todayStr).getTime();
        const diffDays = Math.round((todayTime - logTime) / (1000 * 60 * 60 * 24));
        streakOnDate = Math.max(1, streakDays - diffDays);
      } catch (err) {
        streakOnDate = streakDays;
      }

      // Base Ojas grows with streak days (e.g. 15% start, +2.5% per streak day, max 80%)
      const baseOjas = Math.min(80, 15 + streakOnDate * 2.5);
      
      // Daily focus level (out of 10) and temptation level (out of 10) adjust the ojas
      // Focus acts as positive transmutation (Tejas), temptation is resistance
      const focusContribution = log.focusLevel * 1.5; // up to +15%
      const temptationDrag = (10 - log.temptationLevel) * 0.5; // up to +5% if temptation is low (0), +0% if temptation is high (10)
      const transmutationBonus = log.transmuted ? 5 : 0; // +5% for active transmutation actions
      
      const ojasValue = Math.max(10, Math.min(100, Math.round(baseOjas + focusContribution + temptationDrag + transmutationBonus)));

      return {
        date: dateLabel,
        "Focus Level": log.focusLevel,
        "Temptation Level": log.temptationLevel,
        "Ojas Level": ojasValue,
        "Streak Day": streakOnDate,
        Notes: log.notes
      };
    });
  }, [logs, streakDays, todayStr]);

  // Average focus, temptation & ojas values
  const averageFocus = useMemo(() => {
    if (!logs.length) return 0;
    const sum = logs.reduce((acc, curr) => acc + curr.focusLevel, 0);
    return Math.round((sum / logs.length) * 10) / 10;
  }, [logs]);

  const averageTemptation = useMemo(() => {
    if (!logs.length) return 0;
    const sum = logs.reduce((acc, curr) => acc + curr.temptationLevel, 0);
    return Math.round((sum / logs.length) * 10) / 10;
  }, [logs]);

  const averageOjas = useMemo(() => {
    if (!chartData.length) return 0;
    const sum = chartData.reduce((acc, curr) => acc + (curr["Ojas Level"] || 0), 0);
    return Math.round(sum / chartData.length);
  }, [chartData]);

  return (
    <div className="space-y-8 pb-12">
      
      {/* HEADER SECTION WITH HERO BANNER */}
      <div className="relative overflow-hidden bg-gradient-to-br from-neutral-950 to-neutral-900 border border-white/5 rounded-3xl p-6 lg:p-8 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl glow-purple">
        {/* Subtle geometric particles background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-10 left-1/4 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl pointer-events-none animate-pulse" />

        <div className="space-y-4 max-w-2xl relative z-10 text-center lg:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-gold text-[10px] uppercase font-mono font-bold tracking-wider">
            <Shield size={12} className="animate-pulse" /> 
            {language === "hinglish" ? "Brahmacharya & Ojas Tracker" : "Brahmacharya Sadhana & Ojas Mastery"}
          </div>
          
          <h2 className="text-2xl lg:text-3xl font-serif font-black text-white tracking-tight leading-tight">
            {language === "hinglish" 
              ? "Apni Virya Urja ko Sublimated Kar Ojas aur Tejas Banayein"
              : "Transmute Sexual Energy into Radiant Aura Glow"}
          </h2>
          
          <p className="text-xs text-slate-400 font-sans leading-relaxed">
            {language === "hinglish"
              ? "Brahmacharya ke madhyam se srishti ki sanyam urja ko dhyan, shakti, aur buddhi me badlein. Apne streaks ko track karein aur Vedic labhon ka anubhav karein."
              : "In the Vedic system, Brahmacharya is not merely suppression, but the active alchemical sublimation of sex energy (Shukra Dhatu) into dynamic mental acuity (Tejas) and spiritual vigor (Ojas). Track your path to absolute mastery."}
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1.5 text-xs">
            <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-2">
              <Flame size={14} className="text-amber-500" />
              <span className="text-slate-300">Dominant force:</span>
              <span className="text-white font-bold font-mono text-[11px]">Kundalini Sublimation</span>
            </div>
            <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-2">
              <Zap size={14} className="text-purple-400" />
              <span className="text-slate-300">Vedic Aura Seal:</span>
              <span className="text-white font-bold font-mono text-[11px]">Ojas Transformed</span>
            </div>
          </div>
        </div>

        {/* INTERACTIVE COMPASS / PROGRESS DIAL */}
        <div className="relative shrink-0 flex flex-col items-center">
          <div className="w-44 h-44 rounded-full border border-white/5 bg-neutral-950 flex flex-col items-center justify-center p-4 relative shadow-inner">
            {/* Ambient gold background aura glow */}
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent blur-xl pointer-events-none" />
            
            {/* Dynamic circle border indicator based on streak progression */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle
                cx="88"
                cy="88"
                r="80"
                stroke="rgba(255,255,255,0.02)"
                strokeWidth="4"
                fill="transparent"
              />
              <circle
                cx="88"
                cy="88"
                r="80"
                stroke="#D4AF37"
                strokeWidth="5"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 80}
                strokeDashoffset={2 * Math.PI * 80 * (1 - Math.min(100, nextMilestone.pct) / 100)}
                className="transition-all duration-1000 ease-out"
                style={{ filter: "drop-shadow(0 0 4px #D4AF37)" }}
              />
            </svg>

            {/* Inner Content */}
            <span className="text-[10px] font-mono text-amber-500 tracking-widest font-bold uppercase">STREAK</span>
            <span className="text-4xl font-mono font-black text-white leading-none my-1 select-none animate-pulse">
              {streakDays}
            </span>
            <span className="text-[10px] text-slate-400 font-sans text-center leading-none">
              {language === "hinglish" ? "Din Sanyam Ke" : "Consecutive Days"}
            </span>

            {/* Micro achievement flag */}
            <div className="absolute -bottom-2 bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-0.5 rounded-full border border-amber-400 text-[9px] font-mono font-bold text-black uppercase tracking-wider shadow-lg flex items-center gap-1">
              <Award size={10} /> {currentStage.name.split(" ")[0]}
            </div>
          </div>

          <div className="text-center mt-4 space-y-1">
            <p className="text-[10px] font-mono text-slate-500">
              {language === "hinglish" ? "Sabse behtareen streak" : "Your All-Time Best Streak"}: <span className="text-gold font-bold">{bestStreak} days</span>
            </p>
          </div>
        </div>
      </div>

      {/* CELIBACY DASHBOARD SUB-TABS */}
      <div className="flex flex-wrap items-center justify-start gap-2 border-b border-white/5 pb-2">
        <button
          onClick={() => setSubTab("tracker")}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 border cursor-pointer ${
            subTab === "tracker"
              ? "bg-amber-500/10 border-amber-500/50 text-gold shadow-[0_0_10px_rgba(212,175,55,0.15)]"
              : "bg-transparent border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <Activity size={14} />
          <span>Sadhana Tracker & SOS Kit</span>
        </button>
        <button
          onClick={() => setSubTab("kundalini")}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 border cursor-pointer ${
            subTab === "kundalini"
              ? "bg-amber-500/10 border-amber-500/50 text-gold shadow-[0_0_10px_rgba(212,175,55,0.15)]"
              : "bg-transparent border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <Flame size={14} />
          <span>Kundalini Chakra Sublimation</span>
        </button>
        <button
          onClick={() => setSubTab("ojas-test")}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 border cursor-pointer ${
            subTab === "ojas-test"
              ? "bg-amber-500/10 border-amber-500/50 text-gold shadow-[0_0_10px_rgba(212,175,55,0.15)]"
              : "bg-transparent border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <Sparkles size={14} />
          <span>Ojas Quotient Assessment</span>
        </button>
        <button
          onClick={() => setSubTab("science")}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 border cursor-pointer ${
            subTab === "science"
              ? "bg-amber-500/10 border-amber-500/50 text-gold shadow-[0_0_10px_rgba(212,175,55,0.15)]"
              : "bg-transparent border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <BookOpen size={14} />
          <span>Vedic & Neuroscience Library</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {subTab === "tracker" && (
          <motion.div
            key="tracker"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-8 w-full"
          >
            {/* THREE INTERACTIVE COLUMN SECTIONS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN (lg:col-span-5): STREAK CONTROL & DAILY LOGGING */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* 1. STREAK ADJUSTMENTS & INITIAL SETTING */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-4 glow-purple">
            <h3 className="text-xs font-mono font-bold text-amber-500 tracking-widest uppercase flex items-center gap-1.5">
              <Calendar size={14} /> Streak Calibration
            </h3>
            
            <p className="text-[11px] text-slate-400 leading-normal">
              Started days ago? Calibrate your starting date to accurately reflect your current Brahmacharya journey, or manually log daily progression below.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="text-[9px] text-slate-500 font-mono uppercase font-bold block">Sadhana Start Date</label>
                <input 
                  type="date"
                  value={startDateStr}
                  max={todayStr}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  className="w-full bg-neutral-950/80 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-gold font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-slate-500 font-mono uppercase font-bold block">Quick Actions</label>
                <div className="flex gap-2">
                  <button 
                    onClick={handleIncrementStreak}
                    className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-gold/30 rounded-lg py-2 px-2.5 text-xs text-white flex items-center justify-center gap-1 transition-all cursor-pointer font-bold"
                  >
                    <Plus size={12} className="text-gold" /> +1 Day
                  </button>
                  <button 
                    onClick={handleResetStreak}
                    className="flex-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg py-2 px-2 text-xs text-red-400 flex items-center justify-center gap-1 transition-all cursor-pointer font-bold"
                  >
                    <RotateCcw size={11} /> Reset
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white/[0.01] border border-white/5 rounded-xl p-3 flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-medium">Progress to next Milestone:</span>
              <span className="text-white font-mono font-bold flex items-center gap-1">
                <span className="text-gold">{nextMilestone.days - streakDays} days left</span> 
                <span className="text-slate-500">({nextMilestone.pct}%)</span>
              </span>
            </div>
          </div>

          {/* 2. DAILY TRANSMUTATION LOGGER FORM */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-4 glow-purple relative">
            <div className="absolute top-4 right-4 flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${hasLoggedToday ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`} />
              <span className="text-[8px] font-mono text-slate-500 uppercase font-bold">
                {hasLoggedToday ? "Logged Today" : "Pending Log"}
              </span>
            </div>

            <h3 className="text-xs font-mono font-bold text-gold tracking-widest uppercase flex items-center gap-1.5">
              <UserCheck size={14} /> Daily Energy & Focus Logger
            </h3>

            <form onSubmit={handleSaveDailyLog} className="space-y-4 text-xs">
              
              {/* Focus Level Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-mono uppercase font-bold">
                  <span className="text-slate-400">Mental Focus & Clarity</span>
                  <span className="text-gold">{focusInput}/10</span>
                </div>
                <input 
                  type="range"
                  min="1"
                  max="10"
                  value={focusInput}
                  onChange={(e) => setFocusInput(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-500 h-1 bg-white/5 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[8px] text-slate-500 font-mono">
                  <span>Scatterbrained / Foggy</span>
                  <span>Perfect Dharana / Laser focus</span>
                </div>
              </div>

              {/* Temptation/Urge Level Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-mono uppercase font-bold">
                  <span className="text-slate-400">Temptation / Mind Urges</span>
                  <span className="text-red-400">{temptationInput}/10</span>
                </div>
                <input 
                  type="range"
                  min="1"
                  max="10"
                  value={temptationInput}
                  onChange={(e) => setTemptationInput(parseInt(e.target.value, 10))}
                  className="w-full accent-red-500 h-1 bg-white/5 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[8px] text-slate-500 font-mono">
                  <span>Absolute Peace / No Urges</span>
                  <span>Severe Temptation / Waves</span>
                </div>
              </div>

              {/* Transmutation Methods Checkboxes */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-mono uppercase font-bold block">Urge Transmutation Actions Done</label>
                <div className="grid grid-cols-2 gap-2">
                  {transmuteOptions.map((opt) => {
                    const isSelected = transmuteSelected.includes(opt.name);
                    return (
                      <button
                        type="button"
                        key={opt.name}
                        onClick={() => toggleTransmuteOption(opt.name)}
                        className={`text-left p-2 rounded-xl border transition-all flex flex-col gap-0.5 cursor-pointer ${
                          isSelected 
                            ? "bg-amber-500/10 border-amber-500/40 text-gold" 
                            : "bg-neutral-950/40 border-white/5 text-slate-400 hover:border-white/10"
                        }`}
                      >
                        <span className="font-bold text-[10px] flex items-center gap-1">
                          <CheckCircle size={10} className={isSelected ? "text-amber-500" : "text-slate-600"} />
                          {opt.name}
                        </span>
                        <span className="text-[8px] text-slate-500 font-sans line-clamp-1">{opt.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Daily Reflections / Notes */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-mono uppercase font-bold block">Reflections / Sadhana Notes</label>
                <textarea
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder={language === "hinglish" ? "Aaj dhyan kaisa raha? Urja ko kaise channelise kiya?" : "Any notable moments, meditation experiences, or trigger transmutation reports..."}
                  rows={2}
                  className="w-full bg-neutral-950/80 border border-white/10 focus:border-gold rounded-xl p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none resize-none font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-amber-500/10 flex items-center justify-center gap-1.5 cursor-pointer text-xs"
              >
                <FileText size={14} /> {hasLoggedToday ? "Update Today's Coordinates" : "Seal Daily Coordinates"}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN (lg:col-span-7): BENEFITS TIMELINE & SOS TRANSMUTER */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* 1. VEDIC BRAHMACHARYA STAGES / MILESTONES (STREAK TIMELINE) */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-6 glow-purple">
            <div>
              <h3 className="text-xs font-mono font-bold text-amber-500 tracking-widest uppercase flex items-center gap-1.5">
                <Award size={14} /> Brahmacharya Stages of Ojas Transformation
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                Vedic rishis mapped the precise alchemical evolution of vital forces as streak days accumulate. Click on any node to reveal daily benefits.
              </p>
            </div>

            {/* Stepper Node Line */}
            <div className="flex flex-wrap items-center gap-2 pb-2">
              {stages.map((stage, idx) => {
                const isReached = streakDays >= stage.days;
                const isActive = activeStageIndex === idx;
                return (
                  <button
                    key={stage.days}
                    onClick={() => setActiveStageIndex(idx)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                      isActive
                        ? "bg-amber-500/10 border-amber-500/50 text-gold"
                        : isReached
                          ? "bg-white/5 border-white/10 text-slate-200"
                          : "bg-transparent border-white/5 text-slate-600 hover:border-white/10"
                    }`}
                  >
                    <span 
                      className="w-1.5 h-1.5 rounded-full shrink-0" 
                      style={{ 
                        backgroundColor: stage.color,
                        boxShadow: isReached ? `0 0 6px ${stage.color}` : "none"
                      }} 
                    />
                    <span>{stage.days} Days</span>
                    {isReached && <span className="text-[9px] text-emerald-400">✓</span>}
                  </button>
                );
              })}
            </div>

            {/* Selected Stage Detail Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStageIndex}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.18 }}
                className="bg-neutral-950/50 border border-white/5 rounded-2xl p-5 space-y-4 relative overflow-hidden"
                style={{ borderLeft: `4px solid ${stages[activeStageIndex].color}` }}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-mono tracking-widest uppercase font-bold" style={{ color: stages[activeStageIndex].color }}>
                      {stages[activeStageIndex].subTitle}
                    </span>
                    <h4 className="text-base font-serif font-bold text-white flex items-center gap-1.5">
                      {stages[activeStageIndex].name}
                      <span className="text-xs font-mono font-normal text-slate-500">({stages[activeStageIndex].days} Days Milestone)</span>
                    </h4>
                  </div>
                  <span className="text-xs font-mono font-black bg-white/5 px-2 py-1 rounded border border-white/10 text-slate-300">
                    STAGE {activeStageIndex + 1}
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-sans italic leading-relaxed bg-white/[0.01] p-3 rounded-xl border border-white/[0.03]">
                  "{stages[activeStageIndex].quote}"
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans leading-relaxed">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono font-bold uppercase text-slate-500 tracking-wider">Vedic Spiritual Essence</span>
                    <p className="text-slate-400">{stages[activeStageIndex].essence}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono font-bold uppercase text-slate-500 tracking-wider">Physiological Evolution</span>
                    <p className="text-slate-400">{stages[activeStageIndex].physiologicalBenefit}</p>
                  </div>
                </div>

                <div className="bg-white/[0.01] border border-white/5 p-3 rounded-xl flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-gold">
                      <Compass size={14} />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono font-bold uppercase text-slate-500 block leading-none">RECOMMENDED TRANSMUTATION</span>
                      <span className="text-slate-300 text-[11px] font-medium leading-none mt-1 inline-block">{stages[activeStageIndex].transmutationTip}</span>
                    </div>
                  </div>
                  {streakDays >= stages[activeStageIndex].days ? (
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase shrink-0">
                      Reached ✓
                    </span>
                  ) : (
                    <span className="bg-white/5 text-slate-500 border border-white/5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase shrink-0">
                      Locked
                    </span>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 2. URGE TRANSMUTATION SOS BREATH RESCUE KIT */}
          <div className="bg-gradient-to-br from-neutral-950 to-neutral-900 border border-white/5 rounded-2xl p-6 space-y-6 glow-purple relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1">
                <h3 className="text-xs font-mono font-bold text-cyan-400 tracking-widest uppercase flex items-center gap-1.5">
                  <Zap size={14} className="animate-bounce" /> Urge Transmutation SOS Rescue Kit
                </h3>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Hit by a sudden wave of temptation? Pranic breath instantly channels raw sexual force from the Root (Muladhara) up the spine into higher centers.
                </p>
              </div>

              <button
                onClick={() => {
                  setIsSosBreathing(!isSosBreathing);
                  setBreathCycles(0);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-lg ${
                  isSosBreathing
                    ? "bg-red-500/10 text-red-400 border border-red-500/30"
                    : "bg-cyan-500 text-black hover:bg-cyan-400"
                }`}
              >
                {isSosBreathing ? (
                  <>
                    <RotateCcw size={12} className="animate-spin" /> Stop SOS
                  </>
                ) : (
                  <>
                    <Play size={12} /> Activate SOS
                  </>
                )}
              </button>
            </div>

            {/* Breathing engine visualizer */}
            <AnimatePresence mode="wait">
              {isSosBreathing ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-neutral-950/80 border border-cyan-500/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-6 overflow-hidden"
                >
                  {/* Dynamic pulsing breathing ring */}
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    
                    {/* Pulsing visual halo */}
                    <motion.div
                      animate={{
                        scale: breathPhase === "inhale" ? [1, 1.4] : breathPhase === "hold" ? 1.4 : [1.4, 1],
                        opacity: breathPhase === "hold" ? 0.8 : [0.4, 0.8]
                      }}
                      transition={{
                        duration: 4,
                        ease: "easeInOut"
                      }}
                      className={`absolute inset-0 rounded-full blur-md ${
                        breathPhase === "inhale" 
                          ? "bg-cyan-500/15" 
                          : breathPhase === "hold" 
                            ? "bg-purple-500/15" 
                            : "bg-amber-500/15"
                      }`}
                    />

                    {/* Core pulsing circle */}
                    <motion.div
                      animate={{
                        scale: breathPhase === "inhale" ? [1, 1.3] : breathPhase === "hold" ? 1.3 : [1.3, 1],
                      }}
                      transition={{
                        duration: 4,
                        ease: "easeInOut"
                      }}
                      className={`w-20 h-20 rounded-full flex flex-col items-center justify-center border text-white font-mono z-10 ${
                        breathPhase === "inhale"
                          ? "bg-cyan-950/80 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                          : breathPhase === "hold"
                            ? "bg-purple-950/80 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                            : "bg-amber-950/80 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                      }`}
                    >
                      <span className="text-xl font-black font-mono leading-none">{breathTimer}s</span>
                      <span className="text-[7px] text-slate-400 uppercase tracking-widest font-bold mt-1">SECONDS</span>
                    </motion.div>
                  </div>

                  <div className="space-y-2 max-w-sm">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-widest" style={{
                      backgroundColor: breathPhase === "inhale" ? "rgba(34,211,238,0.1)" : breathPhase === "hold" ? "rgba(168,85,247,0.1)" : "rgba(245,158,11,0.1)",
                      color: breathPhase === "inhale" ? "#22d3ee" : breathPhase === "hold" ? "#a855f7" : "#fb923c"
                    }}>
                      {breathPhase === "inhale" ? "BREATH IN (Prana)" : breathPhase === "hold" ? "HOLD AT THIRD-EYE (Kumbhaka)" : "BREATH OUT (Sublimation)"}
                    </span>
                    
                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                      {breathPhase === "inhale" 
                        ? "Inhale slowly from your perineum. Visualize cool energy ascending the silver spinal cord."
                        : breathPhase === "hold" 
                          ? "Contract your pelvic muscles (Mula Bandha). Focus light behind your eyebrows, transmuting chemical power into consciousness."
                          : "Exhale smoothly. Radiate golden aura light from your head down into your whole energy shield."}
                    </p>

                    <div className="flex justify-center items-center gap-3 pt-2 text-[10px] text-slate-500 font-mono">
                      <span>Cycles Completed: <span className="text-white font-bold">{breathCycles}</span></span>
                      <span>•</span>
                      <span>Target: <span className="text-white">4 cycles (3 minutes)</span></span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-neutral-950/40 border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
                      <BookOpen size={16} />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-mono text-slate-500 font-bold uppercase leading-none block">Vedic Transmutation Mantra</span>
                      <span className="text-white font-serif font-bold text-xs block leading-tight">"Om Urdhvaretaya Namah"</span>
                      <span className="text-slate-400 text-[10px] block leading-none">Chant internally to direct seminal energies upwards to Sahasrara.</span>
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/10 px-2.5 py-1 rounded text-[10px] font-mono font-bold text-slate-300">
                    SOHAN RHYTHM
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* HISTORIC DATA VISUALIZATION TRENDS (CHARTS) */}
      <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 lg:p-8 space-y-6 glow-purple">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
          <div className="space-y-1">
            <h3 className="text-sm font-serif font-bold text-white tracking-wider uppercase flex items-center gap-2">
              <TrendingUp size={16} className="text-amber-500" /> Pranic Equilibrium & Ojas Evolution
            </h3>
            <p className="text-xs text-slate-400">
              The relation between physical sanyam, active transmutations, focus levels, and your cumulative Ojas energy.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono font-bold">
            <div className="bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-slate-400">Avg Focus:</span>
              <span className="text-gold font-bold">{averageFocus}/10</span>
            </div>
            <div className="bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span className="text-slate-400">Avg Temptation:</span>
              <span className="text-red-400 font-bold">{averageTemptation}/10</span>
            </div>
            <div className="bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              <span className="text-slate-400">Avg Ojas:</span>
              <span className="text-yellow-400 font-bold">{averageOjas}%</span>
            </div>
          </div>
        </div>

        {/* Recharts Area/Line Chart */}
        {chartData.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Pranic Focus vs Temptation Area Chart */}
            <div className="space-y-3 bg-neutral-950/40 p-4 rounded-2xl border border-white/5">
              <div className="flex justify-between items-center px-1">
                <span className="text-xs font-serif font-bold text-slate-300">Pranic Focus vs Temptation</span>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Level (0 - 10)</span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.01} />
                      </linearGradient>
                      <linearGradient id="colorTemptation" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.01} />
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="date" 
                      stroke="#475569" 
                      fontSize={10} 
                      fontFamily="monospace"
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="#475569" 
                      fontSize={10} 
                      fontFamily="monospace"
                      tickLine={false}
                      domain={[0, 10]}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "#0a0a0a",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "12px",
                        color: "#fff",
                        fontFamily: "sans-serif",
                        fontSize: "11px"
                      }}
                    />
                    <ReferenceLine y={5} stroke="rgba(255, 255, 255, 0.04)" strokeDasharray="3 3" />
                    <Area 
                      type="monotone" 
                      dataKey="Focus Level" 
                      stroke="#D4AF37" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorFocus)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="Temptation Level" 
                      stroke="#f87171" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorTemptation)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right: Ojas & Vital Energy Level Evolution Line Chart */}
            <div className="space-y-3 bg-neutral-950/40 p-4 rounded-2xl border border-white/5">
              <div className="flex justify-between items-center px-1">
                <span className="text-xs font-serif font-bold text-slate-300">Ojas & Vital Energy Evolution</span>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Ojas Quotient (0% - 100%)</span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                    <XAxis 
                      dataKey="date" 
                      stroke="#475569" 
                      fontSize={10} 
                      fontFamily="monospace"
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="#475569" 
                      fontSize={10} 
                      fontFamily="monospace"
                      tickLine={false}
                      domain={[0, 100]}
                      unit="%"
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "#0a0a0a",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "12px",
                        color: "#fff",
                        fontFamily: "sans-serif",
                        fontSize: "11px"
                      }}
                      formatter={(value: any, name: string) => {
                        if (name === "Ojas Level") return [`${value}%`, "Ojas Level"];
                        if (name === "Streak Day") return [`${value} Days`, "Streak Day"];
                        return [value, name];
                      }}
                    />
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.03)" vertical={false} />
                    <ReferenceLine y={50} stroke="rgba(245, 158, 11, 0.1)" strokeDasharray="3 3" label={{ value: "Stable Rhythm", fill: "#fb923c", fontSize: 9, position: "insideBottomRight" }} />
                    <ReferenceLine y={85} stroke="rgba(168, 85, 247, 0.1)" strokeDasharray="3 3" label={{ value: "Ojas Shield", fill: "#a855f7", fontSize: 9, position: "insideBottomRight" }} />
                    <Line 
                      type="monotone" 
                      dataKey="Ojas Level" 
                      stroke="#facc15" 
                      strokeWidth={3}
                      dot={{ fill: "#fbbf24", stroke: "#d97706", r: 3, strokeWidth: 1 }}
                      activeDot={{ r: 6, fill: "#fbbf24", stroke: "#ffffff" }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Streak Day" 
                      stroke="#a855f7" 
                      strokeWidth={1}
                      strokeDasharray="4 4"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl text-slate-500 font-sans text-xs">
            <AlertTriangle size={24} className="text-amber-500/50 mb-2" />
            <span>No historic sadhana coordinates saved. Lock today's log to initialize mapping.</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          <div className="bg-neutral-950/40 p-4 border border-white/5 rounded-2xl space-y-1.5 text-xs">
            <span className="text-[9px] font-mono text-slate-500 uppercase font-bold tracking-wider">The Law of Conservation</span>
            <h5 className="font-bold text-white">Shukra to Ojas Alchemical cycle</h5>
            <p className="text-slate-400 leading-relaxed font-sans text-[11px]">
              Every 30 days of sanyam completely transforms the cellular structure of seminal fluid, converting it into active Ojas, which is absorbed directly into the brain tissues for creative work.
            </p>
          </div>

          <div className="bg-neutral-950/40 p-4 border border-white/5 rounded-2xl space-y-1.5 text-xs">
            <span className="text-[9px] font-mono text-slate-500 uppercase font-bold tracking-wider">Psychological Shield</span>
            <h5 className="font-bold text-white">Transmutation over Suppression</h5>
            <p className="text-slate-400 leading-relaxed font-sans text-[11px]">
              Vedic traditions advise against violent mental suppression. It creates toxic tension. Instead, route the vital heat into heavy physical exercise, complex codes, or meditation instantly.
            </p>
          </div>

          <div className="bg-neutral-950/40 p-4 border border-white/5 rounded-2xl space-y-1.5 text-xs col-span-1 md:col-span-2 lg:col-span-1">
            <span className="text-[9px] font-mono text-slate-500 uppercase font-bold tracking-wider">Auditory Shielding</span>
            <h5 className="font-bold text-white">Vedic sound frequency integration</h5>
            <p className="text-slate-400 leading-relaxed font-sans text-[11px]">
              Aural sounds with high bass frequencies (like Shiva Tandava Stotram or Rudrashtakam) vibrate the root chakra cells, forcing the excess heat to climb up into higher nerve channels safely.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )}

    {subTab === "kundalini" && (
      <motion.div
        key="kundalini"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.25 }}
        className="w-full"
      >
        <KundaliniChakraMap streakDays={streakDays} language={language} />
      </motion.div>
    )}

    {subTab === "ojas-test" && (
      <motion.div
        key="ojas-test"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.25 }}
        className="w-full"
      >
        <OjasQuotientQuiz language={language} />
      </motion.div>
    )}

    {subTab === "science" && (
      <motion.div
        key="science"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.25 }}
        className="w-full"
      >
        <BrahmacharyaScienceLibrary language={language} />
      </motion.div>
    )}
  </AnimatePresence>
</div>
  );
}
