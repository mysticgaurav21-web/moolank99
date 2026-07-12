import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from "recharts";
import { 
  Sparkles, 
  Info, 
  Orbit, 
  Award, 
  Compass, 
  Calendar, 
  HelpCircle,
  TrendingUp,
  Volume2
} from "lucide-react";

interface PlanetaryMapProps {
  moolank: number;
  bhagyank: number;
  dob: string;
  name: string;
  language: string;
}

// 27 Vedic Nakshatras
const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", 
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", 
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", 
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravan", "Dhanishta", "Shatabhisha", 
  "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

// 12 Astrological Zodiac Signs
const ZODIAC_SIGNS = [
  { name: "Aries (Mesh)", ruler: "Mars" },
  { name: "Taurus (Vrishabh)", ruler: "Venus" },
  { name: "Gemini (Mithun)", ruler: "Mercury" },
  { name: "Cancer (Kark)", ruler: "Moon" },
  { name: "Leo (Simha)", ruler: "Sun" },
  { name: "Virgo (Kanya)", ruler: "Mercury" },
  { name: "Libra (Tula)", ruler: "Venus" },
  { name: "Scorpio (Vrishchik)", ruler: "Mars" },
  { name: "Sagittarius (Dhanu)", ruler: "Jupiter" },
  { name: "Capricorn (Makar)", ruler: "Saturn" },
  { name: "Aquarius (Kumbha)", ruler: "Saturn" },
  { name: "Pisces (Meen)", ruler: "Jupiter" }
];

// Planets base dictionary
const GRAHAS_DATA = [
  {
    id: 1,
    name: "Surya",
    englishName: "Sun",
    number: 1,
    color: "#eab308", // Yellow-Gold
    rulingDeity: "Lord Shiva & Agni",
    gemstone: "Ruby (Manik)",
    day: "Sunday",
    colorAspect: "Gold / Red",
    shloka: "ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः",
    shlokaTranslation: "Ohr moolank Surya, the self-luminous king, grant authority, clear health blocks, and awaken my soul vitality.",
    significance: "Represents absolute soul consciousness, executive decision power, vitality, administrative charisma, and self-expression.",
    vibe: "Divine Authority & Leadership"
  },
  {
    id: 2,
    name: "Chandra",
    englishName: "Moon",
    number: 2,
    color: "#60a5fa", // Light Blue
    rulingDeity: "Goddess Parvati",
    gemstone: "Pearl (Moti)",
    day: "Monday",
    colorAspect: "Silver / White",
    shloka: "ॐ श्रां श्रीं श्रौं सः चन्द्राय नमः",
    shlokaTranslation: "Divine Mother Chandra, bestow tranquility on my mind, emotional balance, and unlock my deep intuitive pools.",
    significance: "Governs emotional resonance, mental peace, subconscious healing, pure imagination, and artistic capabilities.",
    vibe: "Peace, Mind & Deep Intuition"
  },
  {
    id: 3,
    name: "Guru",
    englishName: "Jupiter",
    number: 3,
    color: "#fb923c", // Warm Saffron
    rulingDeity: "Lord Brahma",
    gemstone: "Yellow Sapphire (Pukhraj)",
    day: "Thursday",
    colorAspect: "Bright Saffron / Yellow",
    shloka: "ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः",
    shlokaTranslation: "Teacher of the cosmos, expansion matrix, shine wisdom upon my paths, bringing spiritual wealth and growth.",
    significance: "Brings supreme expansion, philosophical growth, wisdom, prosperity, and divine protective shield (Kavach).",
    vibe: "Wisdom, Fortune & Spiritual Expansion"
  },
  {
    id: 4,
    name: "Rahu",
    englishName: "North Node",
    number: 4,
    color: "#c084fc", // Smoke Violet
    rulingDeity: "Goddess Durga",
    gemstone: "Hessonite (Gomed)",
    day: "Saturday",
    colorAspect: "Steel Grey / Smoke",
    shloka: "ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः",
    shlokaTranslation: "Dynamic agent of destiny, remove illusory clouds and grant technological prowess, research skill, and swift luck.",
    significance: "Governs worldly ambition, modern innovation, radical breakthroughs, psychological depth, and karmic expansion.",
    vibe: "Innovation, Ambition & Destiny Catalyst"
  },
  {
    id: 5,
    name: "Budha",
    englishName: "Mercury",
    number: 5,
    color: "#34d399", // Emerald Green
    rulingDeity: "Lord Vishnu",
    gemstone: "Emerald (Panna)",
    day: "Wednesday",
    colorAspect: "Emerald Green",
    shloka: "ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः",
    shlokaTranslation: "Lord of intellect and speech, sharpen my articulation, mathematical wisdom, and business adaptive wit.",
    significance: "Influences analytical intelligence, Supreme commercial prowess, speech eloquence, and technical communication logic.",
    vibe: "Intellect, Logic & supreme Speech"
  },
  {
    id: 6,
    name: "Shukra",
    englishName: "Venus",
    number: 6,
    color: "#f472b6", // Pastel Pink
    rulingDeity: "Goddess Lakshmi",
    gemstone: "Diamond / White Zircon",
    day: "Friday",
    colorAspect: "Translucent Pink / Radiant White",
    shloka: "ॐ द्रां द्रीं द्रौं सः शुक्राय नमः",
    shlokaTranslation: "Giver of arts, luxury and harmony, balance my personal ties, attract abundance, and enrich my creative talents.",
    significance: "Dictates interpersonal harmony, aesthetic excellence, wealth, relationship compatibility, and luxurious resources.",
    vibe: "Luxury, Arts, Harmony & Magnetism"
  },
  {
    id: 7,
    name: "Ketu",
    englishName: "South Node",
    number: 7,
    color: "#22d3ee", // Electric Cyan
    rulingDeity: "Lord Ganesha",
    gemstone: "Cat's Eye (Lehsuniya)",
    day: "Tuesday",
    colorAspect: "Spotted / Metallic Blue",
    shloka: "ॐ स्रां स्रीं स्रौं सः केतवे नमः",
    shlokaTranslation: "Deep mystic Ketu, lead me from earthly attachments to complete inner freedom and occult intuition.",
    significance: "Brings spiritual liberation, metaphysical deep research, detachment, karmic release, and intuitive premonitions.",
    vibe: "Liberation, Occult & Deep Insight"
  },
  {
    id: 8,
    name: "Shani",
    englishName: "Saturn",
    number: 8,
    color: "#818cf8", // Cosmic Indigo
    rulingDeity: "Lord Yama",
    gemstone: "Blue Sapphire (Neelam)",
    day: "Saturday",
    colorAspect: "Dark Charcoal / Indigo",
    shloka: "ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः",
    shlokaTranslation: "Karmic auditor and keeper of structures, bless my patience, discipline my efforts, and lead to eternal mastery.",
    significance: "Instills rigorous discipline, long-term focus, cosmic lessons, structural persistence, and resilient patience.",
    vibe: "Patience, Discipline & lasting Mastery"
  },
  {
    id: 9,
    name: "Mangal",
    englishName: "Mars",
    number: 9,
    color: "#f87171", // Coral Red
    rulingDeity: "Lord Hanuman",
    gemstone: "Red Coral (Moonga)",
    day: "Tuesday",
    colorAspect: "Coral / Vermillion Red",
    shloka: "ॐ क्रां क्रीं क्रौं सः भौमाय नमः",
    shlokaTranslation: "Radiant commander of courage, clear blockages of fear, ignite protective action, and align my physical drives.",
    significance: "Generates physical stamina, dynamic courage, administrative vigor, engineering skills, and defensive leadership.",
    vibe: "Courage, Vigor & decisive Action"
  }
];

export default function PlanetaryMap({ moolank, bhagyank, dob, name, language }: PlanetaryMapProps) {
  const [selectedPlanetId, setSelectedPlanetId] = useState<number>(1);
  const [mantraAudioActive, setMantraAudioActive] = useState<number | null>(null);

  // Parsing DOB parameters
  const birthParams = useMemo(() => {
    const parts = dob.split("-");
    const year = parseInt(parts[0]) || 1995;
    const month = parseInt(parts[1]) || 11;
    const day = parseInt(parts[2]) || 23;
    return { year, month, day };
  }, [dob]);

  // Friendship arrays corresponding to Vedic numerology compatibility mapping
  const getRelationToUser = (planetNum: number) => {
    if (planetNum === moolank && planetNum === bhagyank) {
      return { type: "EXALTED RULER", desc: "Dual Sovereign Guard - both your Root & Destiny guide.", bg: "bg-amber-500/15 border-amber-500/30 text-amber-400" };
    }
    if (planetNum === moolank) {
      return { type: "RULING GRAHA", desc: "Ruling Planet (Moolank) - influences your physical persona and immediate self.", bg: "bg-yellow-500/10 border-yellow-500/20 text-yellow-300" };
    }
    if (planetNum === bhagyank) {
      return { type: "DESTINY GRAHA", desc: "Destiny Planet (Bhagyank) - guides your life purpose and cosmic path.", bg: "bg-cyan-500/10 border-cyan-500/20 text-cyan-300" };
    }

    // Friendships
    const friendsMap: Record<number, number[]> = {
      1: [2, 3, 9],
      2: [1, 3, 5],
      3: [1, 2, 9],
      4: [5, 6, 8],
      5: [1, 6, 4],
      6: [4, 5, 8],
      7: [1, 3, 5],
      8: [4, 5, 6],
      9: [1, 2, 3]
    };

    const enemyMap: Record<number, number[]> = {
      1: [4, 6, 8],
      2: [4, 7, 8],
      3: [6, 7],
      4: [1, 2, 9],
      5: [2],
      6: [1, 2],
      7: [2, 8],
      8: [1, 2, 9],
      9: [4, 5]
    };

    const isFriend = friendsMap[moolank]?.includes(planetNum) || friendsMap[bhagyank]?.includes(planetNum);
    const isEnemy = enemyMap[moolank]?.includes(planetNum) || enemyMap[bhagyank]?.includes(planetNum);

    if (isFriend) {
      return { type: "MITRA GRAHA", desc: "Friendly Planet - provides supportive vibrations and ease in your ventures.", bg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" };
    }
    if (isEnemy) {
      return { type: "SHATRU GRAHA", desc: "Challenging Planet - represents lessons, friction, and opportunities to build karma.", bg: "bg-rose-500/10 border-rose-500/20 text-rose-400" };
    }
    return { type: "SAMA GRAHA", desc: "Neutral Guardian - balanced, steady energy that remains steady and constant.", bg: "bg-slate-500/10 border-slate-500/20 text-slate-400" };
  };

  // Coordinates calculation for planets
  const personalPlanets = useMemo(() => {
    return GRAHAS_DATA.map((planet) => {
      const relation = getRelationToUser(planet.number);
      
      // Deterministic degree (angle) of birth time position based on actual DOB and numbers
      // This is a highly personalized astronomical degree!
      const rawDegree = (birthParams.day * 13 + birthParams.month * 19 + birthParams.year % 100 + planet.number * 41 + moolank * 17 + bhagyank * 23) % 360;
      const zodiacIdx = Math.floor(rawDegree / 30);
      const signInfo = ZODIAC_SIGNS[zodiacIdx];
      const signDegree = rawDegree % 30;

      // Nakshatra Index (27 nakshatras in 360 degrees)
      const nakshatraIdx = Math.floor(rawDegree / (360 / 27));
      const nakshatra = NAKSHATRAS[nakshatraIdx];
      const charan = 1 + Math.floor((rawDegree % (360 / 27)) / (360 / 108)); // Charan 1 to 4

      // Orbit radial track allocation: 
      // 1 (inner): Sun, Moon, Mercury
      // 2 (middle): Venus, Mars, Ketu
      // 3 (outer): Jupiter, Saturn, Rahu
      let track = 2;
      if ([1, 2, 5].includes(planet.id)) track = 1;
      if ([3, 8, 4].includes(planet.id)) track = 3;

      // Strength (Bala) calculation (deterministic based on friendship)
      let strength = 60; // neutral base
      if (planet.number === moolank && planet.number === bhagyank) strength = 96;
      else if (planet.number === moolank) strength = 90;
      else if (planet.number === bhagyank) strength = 88;
      else if (relation.type === "MITRA GRAHA") strength = 70 + ((birthParams.day * planet.id) % 15);
      else if (relation.type === "SHATRU GRAHA") strength = 35 + ((birthParams.day * planet.id) % 15);
      else strength = 52 + ((birthParams.day * planet.id) % 12);

      return {
        ...planet,
        degree: rawDegree,
        sign: signInfo.name,
        signRuler: signInfo.ruler,
        signDegree: Math.round(signDegree * 10) / 10,
        nakshatra,
        charan,
        track,
        strength,
        relation
      };
    });
  }, [birthParams, moolank, bhagyank]);

  // Selected planet reference
  const activePlanet = useMemo(() => {
    return personalPlanets.find((p) => p.id === selectedPlanetId) || personalPlanets[0];
  }, [personalPlanets, selectedPlanetId]);

  // Synergy notes on the Root/Destiny Planetary Conjunction
  const trinityPlanetarySynergy = useMemo(() => {
    const rootPlanet = GRAHAS_DATA.find((p) => p.number === moolank);
    const destinyPlanet = GRAHAS_DATA.find((p) => p.number === bhagyank);
    if (!rootPlanet || !destinyPlanet) return "";

    if (moolank === bhagyank) {
      return {
        title: `Deep Sovereignty of ${rootPlanet.name} (${rootPlanet.englishName})`,
        summary: "Your physical life-drive and your spiritual destiny path are perfectly aligned under a single divine ruler.",
        description: `Since both your Moolank and Bhagyank are ${moolank}, you possess a singular, high-integrity focus. There is very little internal conflict between 'what you want' and 'where you are going'. Your challenges are simply the amplified lessons of ${rootPlanet.englishName}, demanding total alignment and absolute purity of intention.`
      };
    }

    // Custom pairings
    const pairKey = [moolank, bhagyank].sort().join("-");
    const pairs: Record<string, { title: string; summary: string; description: string }> = {
      "1-2": {
        title: "The Royal Solar-Lunar Alignment (Surya & Chandra)",
        summary: "A spectacular union of conscious willpower (Sun) and subconscious emotional intelligence (Moon).",
        description: "You balance authoritative action with incredible empathy. You possess the executive focus to lead organizations, coupled with a deep, intuitive understanding of human nature. Use the Sun to initiate, and the Moon to build caring, lasting relationships."
      },
      "1-3": {
        title: "The Sovereign Spiritual Council (Surya & Guru)",
        summary: "A combination of divine light (Sun) and profound cosmic wisdom (Jupiter).",
        description: "This is a classical 'Rajyoga' vibration. You are built for leadership, spiritual teachings, mentoring, and administrative power. You hold yourself to an exceptionally high standard of ethics and thrive when sharing your wisdom."
      },
      "1-5": {
        title: "The Prince & The Sovereign (Surya & Budha)",
        summary: "The Budhaditya alignment, joining supreme vitality (Sun) with sharp analytical intellect (Mercury).",
        description: "You are a master communicator, public speaker, or strategist. Your sharp business intelligence is backed by undeniable charisma. You can easily dissect complex systems and explain them with royal confidence."
      },
      "2-3": {
        title: "The Intuitive Sage (Chandra & Guru)",
        summary: "Harmonizing the fluid subconscious mind (Moon) with expanding philosophical wisdom (Jupiter).",
        description: "Your life is driven by an incredible thirst for healing, compassion, and emotional depth. You make an exceptional counselor, healer, creative writer, or spiritual guide. People naturally trust your warm, nurturing aura."
      },
      "2-5": {
        title: "The Articulate Dreamer (Chandra & Budha)",
        summary: "A dynamic synergy of liquid emotion (Moon) and rigid practical intelligence (Mercury).",
        description: "You possess a highly creative and adaptive mind. You can translate emotional nuances into brilliant business strategies, marketing narratives, or artistic writing. Balancing mental logic with emotional trust is your master-key."
      },
      "3-5": {
        title: "The Ultimate Strategist (Guru & Budha)",
        summary: "Fusing deep, long-term philosophical vision (Jupiter) with tactical, rapid-fire logic (Mercury).",
        description: "You excel in academic, financial, or strategic consulting fields. You understand both the broad 'macro' vision of life and the granular 'micro' execution paths. This combination makes you a highly valued advisor."
      },
      "5-6": {
        title: "The Magnetic Commercial Genius (Budha & Shukra)",
        summary: "The ultimate alliance of logical business wit (Mercury) and aesthetic relationship luxury (Venus).",
        description: "You have a natural gift for attracting abundance, beauty, and luxury through clever negotiation, media, design, or commercial ventures. You understand what people desire and have the administrative brilliance to deliver it beautifully."
      },
      "8-9": {
        title: "The Resilient Commander (Shani & Mangal)",
        summary: "Vedic friction turned to steel: patience and structure (Saturn) joined with fiery courage (Mars).",
        description: "This is a heavy, power-packed alignment of grit. You face lessons with iron resolve. You can organize immense resources, execute massive engineering projects, or withstand intense trials. Cultivating patient, calculated action converts any crisis to triumph."
      }
    };

    return pairs[pairKey] || {
      title: `${rootPlanet.englishName} & ${destinyPlanet.englishName} Cosmic Bridge`,
      summary: `Merging the immediate, physical persona of ${rootPlanet.name} with the destiny destination of ${destinyPlanet.name}.`,
      description: `Your life represents a beautiful cosmic bridge. Your physical self (ruled by ${rootPlanet.englishName}) acts as the vessel, while your soul's destination (guided by ${destinyPlanet.englishName}) acts as the compass. Integrating these two distinct forces is your key to complete self-realization and abundance.`
    };
  }, [moolank, bhagyank]);

  const elementalForces = useMemo(() => {
    const sunStr = personalPlanets.find((p) => p.id === 1)?.strength || 60;
    const moonStr = personalPlanets.find((p) => p.id === 2)?.strength || 60;
    const jupStr = personalPlanets.find((p) => p.id === 3)?.strength || 60;
    const rahuStr = personalPlanets.find((p) => p.id === 4)?.strength || 60;
    const mercStr = personalPlanets.find((p) => p.id === 5)?.strength || 60;
    const venStr = personalPlanets.find((p) => p.id === 6)?.strength || 60;
    const ketuStr = personalPlanets.find((p) => p.id === 7)?.strength || 60;
    const satStr = personalPlanets.find((p) => p.id === 8)?.strength || 60;
    const marsStr = personalPlanets.find((p) => p.id === 9)?.strength || 60;

    const fire = Math.round((sunStr + marsStr + ketuStr) / 3);
    const water = Math.round((moonStr + venStr) / 2);
    const air = Math.round((satStr + rahuStr) / 2);
    const earth = Math.round(mercStr);
    const ether = Math.round(jupStr);

    return [
      { name: "Agni (Fire)", value: fire, color: "#f87171", description: "Willpower, executive stamina, metabolic drive and decisive courage." },
      { name: "Jal (Water)", value: water, color: "#60a5fa", description: "Emotional harmony, artistic wisdom, subconscious intuition and empathy." },
      { name: "Vayu (Air)", value: air, color: "#34d399", description: "Rational logic, vocal expression, mental flexibility and analytical focus." },
      { name: "Prithvi (Earth)", value: earth, color: "#fb923c", description: "Resilient patience, structural grounding, consistency and physical order." },
      { name: "Akasha (Ether)", value: ether, color: "#c084fc", description: "Cosmic integration, spiritual intelligence, broad vision and divine protection." }
    ];
  }, [personalPlanets]);

  // Audio chanter trigger
  const triggerMantraVibration = (planetId: number) => {
    setMantraAudioActive(planetId);
    // Silent trigger effect
    setTimeout(() => {
      setMantraAudioActive(null);
    }, 1800);
  };

  return (
    <div className="space-y-8 animate-fade-in" id="planetary-map-tab-root">
      
      {/* Intro Header banner */}
      <div className="bg-gradient-to-r from-neutral-950/60 to-neutral-900/40 border border-white/5 p-6 rounded-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <span className="text-[10px] bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider font-mono">
            Vedic Astro-Numerology Chart
          </span>
          <h3 className="text-xl font-serif font-semibold text-white tracking-tight flex items-center gap-2">
            <Orbit className="text-gold animate-spin-slow" size={20} /> Personal Celestial Planetary Map
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            Your personal date of birth and core cosmic coordinates have been cast onto the 360° celestial sphere. Explore how the 9 Grahas (planetary forces) are positioned across the Nakshatra mansions to form your energetic matrix at birth.
          </p>
        </div>
        <div className="flex gap-4 border-l border-white/10 pl-6 shrink-0 font-mono text-center">
          <div>
            <span className="text-[9px] text-slate-500 block uppercase font-bold">Moolank Graha</span>
            <span className="text-lg font-black text-amber-400 block mt-0.5">#{moolank}</span>
            <span className="text-[9px] text-slate-400 block truncate max-w-[80px]">
              {GRAHAS_DATA.find(p => p.number === moolank)?.englishName}
            </span>
          </div>
          <div className="border-l border-white/5 pl-4">
            <span className="text-[9px] text-slate-500 block uppercase font-bold">Bhagyank Graha</span>
            <span className="text-lg font-black text-cyan-400 block mt-0.5">#{bhagyank}</span>
            <span className="text-[9px] text-slate-400 block truncate max-w-[80px]">
              {GRAHAS_DATA.find(p => p.number === bhagyank)?.englishName}
            </span>
          </div>
        </div>
      </div>

      {/* Main Split Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* 1. INTERACTIVE ORBITAL SPHERE CANVAS (lg:col-span-6) */}
        <div className="lg:col-span-6 bg-white/[0.01] border border-white/5 p-6 rounded-2xl flex flex-col items-center justify-center relative glow-purple min-h-[460px]">
          
          {/* Legend indicator */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
            <span className="text-[10px] text-slate-500 tracking-wider uppercase font-mono flex items-center gap-1.5">
              <Compass size={12} className="text-gold" /> Spherical Coordinates
            </span>
            <div className="flex gap-2">
              <span className="text-[9px] bg-yellow-500/10 text-yellow-300 px-2 py-0.5 rounded-full font-mono font-bold">Ruling</span>
              <span className="text-[9px] bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded-full font-mono font-bold">Destiny</span>
            </div>
          </div>

          {/* Interactive Celestial Canvas stage */}
          <div className="relative w-full aspect-square max-w-[400px] flex items-center justify-center p-4">
            
            {/* Background Nebulae glowing rings */}
            <div className="absolute inset-0 bg-radial from-amber-500/[0.02] via-purple-500/[0.02] to-transparent rounded-full pointer-events-none" />
            
            {/* 3 Concentric Orbit Rings */}
            <svg className="absolute w-full h-full pointer-events-none" viewBox="0 0 400 400">
              {/* Inner Orbit */}
              <circle cx="200" cy="200" r="70" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="2 3" />
              {/* Middle Orbit */}
              <circle cx="200" cy="200" r="120" fill="none" stroke="rgba(212, 175, 55, 0.08)" strokeWidth="1.5" strokeDasharray="4 4" />
              {/* Outer Orbit */}
              <circle cx="200" cy="200" r="170" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="5 7" />

              {/* Major Axes lines */}
              <line x1="200" y1="30" x2="200" y2="370" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="1 5" />
              <line x1="30" y1="200" x2="370" y2="200" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="1 5" />
            </svg>

            {/* Central Atman Core Node */}
            <div className="absolute flex flex-col items-center justify-center z-10 pointer-events-none">
              <motion.div 
                animate={{ scale: [0.95, 1.05, 0.95] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="w-14 h-14 rounded-full bg-radial from-amber-500/30 to-amber-950/40 border border-gold/30 flex items-center justify-center relative shadow-[0_0_20px_rgba(212,175,55,0.2)]"
              >
                <div className="w-8 h-8 rounded-full bg-cosmic-bg border border-gold/10 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-gold font-serif">ATMAN</span>
                </div>
              </motion.div>
            </div>

            {/* Orbiting Planet Spheres */}
            {personalPlanets.map((planet) => {
              // Convert orbit track to pixels
              // Inner: 70px, Middle: 120px, Outer: 170px
              let radius = 120;
              if (planet.track === 1) radius = 70;
              if (planet.track === 3) radius = 170;

              // Convert degree to radians (offset by -90 to start at the top)
              const radians = ((planet.degree - 90) * Math.PI) / 180;
              const x = radius * Math.cos(radians);
              const y = radius * Math.sin(radians);

              const isActive = planet.id === selectedPlanetId;
              const isRuling = planet.number === moolank;
              const isDestiny = planet.number === bhagyank;

              return (
                <motion.button
                  key={planet.id}
                  id={`planetary-sphere-node-${planet.id}`}
                  onClick={() => setSelectedPlanetId(planet.id)}
                  className={`absolute w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 z-20 group`}
                  style={{
                    left: "calc(50% - 18px)",
                    top: "calc(50% - 18px)",
                  }}
                  animate={{ 
                    x, 
                    y,
                    scale: isActive ? 1.25 : 1
                  }}
                  whileHover={{ scale: isActive ? 1.3 : 1.15 }}
                  transition={{ type: "spring", stiffness: 80, damping: 15 }}
                >
                  {/* Glowing Orbit ring for active or important planets */}
                  {isActive && (
                    <span 
                      className="absolute inset-[-5px] rounded-full border border-dashed animate-spin-slow opacity-60" 
                      style={{ borderColor: planet.color }}
                    />
                  )}
                  {isRuling && (
                    <span className="absolute inset-[-3px] rounded-full border border-yellow-500/40 animate-ping opacity-45 pointer-events-none" />
                  )}
                  {isDestiny && (
                    <span className="absolute inset-[-3px] rounded-full border border-cyan-400/40 animate-ping opacity-45 pointer-events-none" style={{ animationDelay: "1s" }} />
                  )}

                  {/* Planet Core Sphere */}
                  <div 
                    className="w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all relative border"
                    style={{ 
                      backgroundColor: isActive ? planet.color : "rgba(10,10,10,0.85)", 
                      borderColor: planet.color,
                      color: isActive ? "#050505" : planet.color,
                      boxShadow: isActive ? `0 0 14px ${planet.color}a0` : `0 0 6px ${planet.color}30`
                    }}
                  >
                    {planet.name[0]}
                  </div>

                  {/* Premium Hover Interactive Tooltips */}
                  <div 
                    className="absolute bottom-11 left-1/2 -translate-x-1/2 w-64 p-4 bg-neutral-950/95 backdrop-blur-xl border rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.85)] opacity-0 scale-90 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out z-50 text-left space-y-3"
                    style={{ borderColor: `${planet.color}40` }}
                  >
                    {/* Header: Name & Role Badge */}
                    <div className="flex justify-between items-center gap-2 border-b border-white/5 pb-2">
                      <div className="space-y-0.5">
                        <span className="text-xs font-serif font-bold text-white block">
                          {planet.name} <span className="text-slate-400 font-sans font-normal text-[10px]">({planet.englishName})</span>
                        </span>
                        <span className="text-[9px] font-mono block leading-none animate-pulse" style={{ color: planet.color }}>
                          "{planet.vibe}"
                        </span>
                      </div>
                      <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-white/5 border border-white/10" style={{ color: planet.color }}>
                        #{planet.number}
                      </span>
                    </div>

                    {/* Vedic Coordinates */}
                    <div className="grid grid-cols-2 gap-2 text-[9px] font-mono leading-tight">
                      <div className="bg-white/[0.01] p-1.5 rounded border border-white/5">
                        <span className="text-slate-500 block uppercase font-bold leading-none mb-1">Rashi/Sign</span>
                        <span className="text-gold block font-semibold truncate">{planet.sign.split(" ")[0]}</span>
                        <span className="text-slate-400 block">{planet.signDegree}°</span>
                      </div>
                      <div className="bg-white/[0.01] p-1.5 rounded border border-white/5">
                        <span className="text-slate-500 block uppercase font-bold leading-none mb-1">Nakshatra</span>
                        <span className="text-cyan-400 block font-semibold truncate">{planet.nakshatra}</span>
                        <span className="text-slate-400 block">Pada {planet.charan}</span>
                      </div>
                    </div>

                    {/* Role & Influence Badge */}
                    <div className="text-[10px] bg-white/5 px-2 py-1 rounded border border-white/5 flex flex-col gap-0.5">
                      <span className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-wider">Influence Rank</span>
                      <span className="text-slate-200 font-medium truncate">{planet.relation.type}</span>
                    </div>

                    {/* Strength Indicator & Mini Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 leading-none">
                        <span>Graha Bala (Strength)</span>
                        <span className="font-bold" style={{ color: planet.color }}>{planet.strength}%</span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500" 
                          style={{ 
                            width: `${planet.strength}%`, 
                            backgroundColor: planet.color,
                            boxShadow: `0 0 6px ${planet.color}` 
                          }}
                        />
                      </div>
                    </div>

                    {/* Tooltip Arrow */}
                    <div 
                      className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-r border-b bg-neutral-950"
                      style={{ borderColor: `${planet.color}40` }}
                    />
                  </div>
                </motion.button>
              );
            })}
          </div>

          <div className="text-center mt-3 max-w-sm">
            <p className="text-[10px] text-slate-500 italic flex items-center justify-center gap-1">
              <Info size={12} className="text-gold shrink-0" />
              <span>Click any orbiting node to load its detailed planetary coordinates.</span>
            </p>
          </div>
        </div>

        {/* 2. DYNAMIC DETAILS & MANTRA SHLOKA SOUNDBOARD (lg:col-span-6) */}
        <div className="lg:col-span-6 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePlanet.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.28 }}
              className="bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-2xl p-6 space-y-6 glow-purple relative overflow-hidden"
              id="active-graha-details-panel"
            >
              {/* Planetary Glow Accent background decoration */}
              <div 
                className="absolute right-0 top-0 w-32 h-32 rounded-full blur-[80px] pointer-events-none opacity-20"
                style={{ backgroundColor: activePlanet.color }}
              />

              {/* Header Title with english name & Sanskrit Graha name */}
              <div className="flex justify-between items-start border-b border-white/5 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-2.5 h-2.5 rounded-full shadow-inner animate-pulse" 
                      style={{ backgroundColor: activePlanet.color, boxShadow: `0 0 8px ${activePlanet.color}` }}
                    />
                    <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase leading-none">
                      GRAHA COORDINATES
                    </span>
                  </div>
                  <h4 className="text-2xl font-serif font-semibold text-white tracking-tight">
                    {activePlanet.name} <span className="text-slate-400 font-light text-lg">({activePlanet.englishName})</span>
                  </h4>
                  <p className="text-[11px] italic font-medium" style={{ color: activePlanet.color }}>
                    "{activePlanet.vibe}"
                  </p>
                </div>
                
                <span className="text-4xl font-black font-mono leading-none select-none opacity-25" style={{ color: activePlanet.color }}>
                  #{activePlanet.number}
                </span>
              </div>

              {/* Coordinates Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-neutral-950/45 p-3 rounded-xl border border-white/5 text-center">
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-bold">Longitude Degree</span>
                  <span className="text-sm font-mono font-bold text-white block mt-0.5">{activePlanet.degree}°</span>
                </div>
                <div className="bg-neutral-950/45 p-3 rounded-xl border border-white/5 text-center">
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-bold">Zodiac Sign</span>
                  <span className="text-xs font-semibold text-gold block mt-0.5 truncate">{activePlanet.sign}</span>
                  <span className="text-[8px] text-slate-400 block font-mono">{activePlanet.signDegree}° of Rashi</span>
                </div>
                <div className="bg-neutral-950/45 p-3 rounded-xl border border-white/5 text-center col-span-2 sm:col-span-1">
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-bold">Nakshatra Star</span>
                  <span className="text-xs font-semibold text-cyan-300 block mt-0.5 truncate">{activePlanet.nakshatra}</span>
                  <span className="text-[8px] text-slate-400 block font-mono">Pada {activePlanet.charan}</span>
                </div>
              </div>

              {/* Relationship with User Indicator Banner */}
              <div className={`p-4 rounded-xl border font-sans text-xs flex gap-3 items-start ${activePlanet.relation.bg}`}>
                <Award size={18} className="shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-mono font-bold uppercase tracking-widest block text-[10px]">
                    {activePlanet.relation.type}
                  </span>
                  <p className="leading-relaxed opacity-90">{activePlanet.relation.desc}</p>
                </div>
              </div>

              {/* Mantra Soundboard/Card block */}
              <div className="bg-neutral-950/60 p-4 border border-white/5 rounded-xl space-y-3.5 relative overflow-hidden">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase flex items-center gap-1">
                    <Volume2 size={12} className="text-gold" /> Chanting Soundboard Mantra
                  </span>
                  <span className="text-[9px] text-slate-500">108 Chants Recommended</span>
                </div>
                
                {/* Shloka Mantra text display */}
                <div className="text-center space-y-2 py-1.5 relative z-10">
                  <h5 className="text-base font-serif font-bold text-amber-100 tracking-wide select-all">
                    {activePlanet.shloka}
                  </h5>
                  <p className="text-[10px] text-slate-400 font-sans italic leading-relaxed max-w-md mx-auto">
                    "{activePlanet.shlokaTranslation}"
                  </p>
                </div>

                {/* Simulate audio vibration trigger */}
                <button
                  id={`chant-mantra-btn-${activePlanet.id}`}
                  onClick={() => triggerMantraVibration(activePlanet.id)}
                  className="w-full py-2 bg-white/[0.03] hover:bg-gold/10 border border-white/5 hover:border-gold/30 rounded-lg text-[10px] font-mono tracking-widest uppercase font-semibold text-gold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {mantraAudioActive === activePlanet.id ? (
                    <>
                      <span className="inline-flex gap-0.5 items-end justify-center h-2 w-3">
                        <span className="w-0.5 h-1.5 bg-gold animate-pulse" />
                        <span className="w-0.5 h-3 bg-gold animate-pulse" style={{ animationDelay: "0.2s" }} />
                        <span className="w-0.5 h-2 bg-gold animate-pulse" style={{ animationDelay: "0.4s" }} />
                      </span>
                      <span>Chanting Resonance active...</span>
                    </>
                  ) : (
                    <>
                      <Volume2 size={12} className="animate-pulse" />
                      <span>Trigger Mantra Aura Chanting Resonance</span>
                    </>
                  )}
                </button>
              </div>

              {/* Significance */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono font-bold block">Cosmic Significance</span>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">{activePlanet.significance}</p>
              </div>

              {/* Practical Sadhana remedies for this planet */}
              <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-500 uppercase font-mono font-bold">Recommended Gemstone</span>
                  <p className="text-xs font-semibold text-gold">{activePlanet.gemstone}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-500 uppercase font-mono font-bold">Auspicious Day & Color</span>
                  <p className="text-xs font-semibold text-cyan-300">{activePlanet.day} ({activePlanet.colorAspect})</p>
                </div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* 3. SHANI BALA (PLANETARY STRENGTHS) GRAPH */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Graha Bala Strengths Recharts Chart (lg:col-span-6) */}
        <div className="lg:col-span-6 p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col justify-between space-y-4 glow-purple">
          <div>
            <h4 className="text-sm font-serif font-bold text-white tracking-wider uppercase flex items-center gap-2">
              <TrendingUp size={16} className="text-gold" /> Graha Bala (Planetary Strengths)
            </h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-normal">
              A detailed numerical assessment of each planet's vibration strength based on their alignments and friendliness with your soul coordinates.
            </p>
          </div>

          <div className="h-[260px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={personalPlanets} margin={{ left: -15, right: 10, top: 10, bottom: 0 }}>
                <XAxis dataKey="englishName" stroke="#64748b" fontSize={9} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#64748b" fontSize={9} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.02)" }}
                  contentStyle={{
                    backgroundColor: "#0a0a0a",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "11px"
                  }}
                  formatter={(value) => [`${value}% Strength`, `Graha Bala`] }
                />
                <Bar dataKey="strength" radius={[6, 6, 0, 0]} barSize={20}>
                  {personalPlanets.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[10px] text-slate-500 border-t border-white/5 pt-3 leading-relaxed">
            *Planets with strengths above 75% are your high-frequency guardians, bringing natural luck. Forces below 50% indicate areas where discipline, shlokas, and sadhana act as powerful remedies.
          </div>
        </div>

        {/* Root-Destiny Synergy Narrative (lg:col-span-6) */}
        <div className="lg:col-span-6 p-6 bg-gradient-to-br from-white/[0.02] to-transparent border border-white/5 rounded-2xl space-y-5 glow-purple min-h-[340px] flex flex-col justify-between">
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] text-amber-400 font-mono tracking-widest uppercase font-bold block">
                TRINITY PLANETARY CONJUNCTION
              </span>
              <h4 className="text-lg font-serif font-semibold text-white tracking-tight">
                {trinityPlanetarySynergy.title}
              </h4>
              <p className="text-xs text-slate-400 italic font-medium">
                "{trinityPlanetarySynergy.summary}"
              </p>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-line border-t border-white/5 pt-4">
              {trinityPlanetarySynergy.description}
            </p>
          </div>

          <div className="p-3 bg-white/[0.02] border border-gold/15 rounded-xl space-y-1.5 mt-2">
            <span className="text-[10px] font-bold text-gold uppercase tracking-wider flex items-center gap-1 leading-none">
              <Sparkles size={12} fill="currentColor" /> Dual-Graha Remedial Action
            </span>
            <p className="text-[10px] text-slate-300 leading-relaxed font-sans">
              To harmonize this cosmic pair, chant the shloka of your Root and Destiny planets daily. Keeping a small metal token or wearing the colors of these planets on their respective days creates an energetic bridge of complete prosperity.
            </p>
          </div>
        </div>

      </div>

      {/* 4. VEDIC PANCHA-MAHABHUTA (ELEMENTAL BALANCE) GRAPH */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
        
        {/* Elemental Balance Donut Chart (lg:col-span-5) */}
        <div className="lg:col-span-5 p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col justify-between space-y-4 glow-purple min-h-[350px]">
          <div>
            <h4 className="text-sm font-serif font-bold text-white tracking-wider uppercase flex items-center gap-2">
              <Sparkles size={16} className="text-gold" /> Pancha-MahaBhuta Aura Balance
            </h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-normal">
              The balance of the five sacred elements in your subtle body computed from your planetary coordinates.
            </p>
          </div>

          <div className="h-[200px] w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={elementalForces}
                  cx="50%"
                  cy="50%"
                  innerRadius="50%"
                  outerRadius="75%"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {elementalForces.map((entry, index) => (
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
                  formatter={(value) => [`${value}% Strength`, "Cosmic Vibe"]}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Absolute Center personal indicator */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[9px] text-slate-500 uppercase font-mono font-bold">ELEMENTS</span>
              <span className="text-xs font-black text-white font-mono">BALANCED</span>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-white/5">
            {elementalForces.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs animate-fade-in">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300 font-medium">{item.name}</span>
                </div>
                <span className="text-white font-semibold font-mono">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Elemental Infographics (lg:col-span-7) */}
        <div className="lg:col-span-7 p-6 bg-gradient-to-br from-white/[0.02] to-transparent border border-white/5 rounded-2xl space-y-4 glow-purple min-h-[350px]">
          <div>
            <h4 className="text-sm font-serif font-bold text-cyan-400 tracking-wider uppercase">
              Celestial Elemental Affinities
            </h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-normal">
              How the classical elemental vibrations govern your physical stamina, emotional intelligence, and spiritual vision.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {elementalForces.map((item, idx) => (
              <div key={idx} className="space-y-1.5 group">
                <div className="flex justify-between items-center text-xs leading-none">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: item.color, boxShadow: `0 0 6px ${item.color}` }} />
                    <span className="font-semibold text-slate-200 group-hover:text-white transition-colors">{item.name}</span>
                  </div>
                  <span className="font-mono font-bold" style={{ color: item.color }}>{item.value}% Power</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: idx * 0.1 }}
                    className="h-full rounded-full"
                    style={{ 
                      backgroundColor: item.color,
                      boxShadow: `0 0 8px ${item.color}80`
                    }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-sans leading-normal pl-4">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
