import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, 
  Search, 
  Compass, 
  Flame, 
  Leaf, 
  Dumbbell, 
  Sparkles,
  ChevronDown,
  BookMarked
} from "lucide-react";

import { convertToHinglish } from "../utils/hinglish";

interface Article {
  id: string;
  category: "basics" | "planets" | "chakras" | "philosophy" | "habits";
  title: string;
  excerpt: string;
  content: string;
  readingTime: string;
}

interface KnowledgeLibraryTabProps {
  language?: string;
}

export default function KnowledgeLibraryTab({ language }: KnowledgeLibraryTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | "basics" | "planets" | "chakras" | "philosophy" | "habits">("all");
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(null);

  const categories = [
    { id: "all" as const, label: "All Wisdom" },
    { id: "basics" as const, label: "Numerology Basics" },
    { id: "planets" as const, label: "Cosmic Planets" },
    { id: "chakras" as const, label: "The Chakra System" },
    { id: "philosophy" as const, label: "Vedic Philosophy" },
    { id: "habits" as const, label: "Habit & Breath Science" }
  ];

  const articles: Article[] = [
    {
      id: "basics-moolank-bhagyank-namank",
      category: "basics",
      title: "The Trinity of Numbers: Understanding Moolank, Bhagyank, and Namank",
      excerpt: "Your cosmic blueprint is written in three numbers. Learn how your birth date, destiny path, and full name merge to create your life's frequency.",
      readingTime: "5 min read",
      content: `In Vedic numerology (Sankhya Sastra), your energetic constitution is governed by three primary forces represented as numbers:

1. **Moolank (Root / Soul Number):** 
Calculated solely from the day of your birth (reduced to a single digit, e.g., if you are born on the 28th, 2+8 = 10, 1+0 = 1). Moolank represents your core identity, soul personality, natural instincts, emotional makeup, and inner character. It dictates *who you are* when alone.

2. **Bhagyank (Destiny / Karma Number):** 
Calculated by summing your entire date of birth (Day + Month + Year) and reducing it to a single digit (e.g., 28-04-1996 sum is 2+8+0+4+1+9+9+6 = 39 = 3+9 = 12 = 1+2 = 3). Bhagyank represents your destination, your life path, your physical dharma, the lessons you must learn, and the career paths that align with your highest karma.

3. **Namank (Name Vibration Number):** 
Calculated using the Chaldean alphanumeric system from the spelling of your full name. Each letter vibrates with a specific planetary code (A=1, B=2, C=3, D=4, E=5, U=6, O=7, F=8, etc.). Namank acts as your public frequency, governing how people perceive you, your professional branding alignment, and your social interactions. 

By balancing your Moolank's inner nature, fulfilling your Bhagyank's outer path, and aligning your Namank name spelling with a supportive planetary number, you achieve absolute resonance with cosmic abundance.`
    },
    {
      id: "planets-governing-elements",
      category: "planets",
      title: "Cosmic Planets & Their Governing Elements",
      excerpt: "Every number vibrates under a specific celestial lord. Learn the planetary energies and elements that govern leadership, emotionality, and action.",
      readingTime: "6 min read",
      content: `Each number from 1 to 9 is direct evidence of a planetary lord (Graha) influencing your subtle aura and physical system. Understanding their element and frequency is key to self-realization:

- **Number 1: Sun (Surya) - Fire Element.** 
Represents willpower, leadership, sovereignty, father-principles, health, and clean solar heat.
- **Number 2: Moon (Chandra) - Water Element.** 
Represents intuition, deep empathy, domestic care, subconscious desires, and fluid emotions.
- **Number 3: Jupiter (Guru) - Ether/Space Element.** 
Represents expansion, scriptural wisdom, public mentoring, ethical laws, and physical abundance.
- **Number 4: Rahu (North Node) - Wind Element.** 
Represents revolutionary ideas, unconventional breakthroughs, meticulous engineering, but can bring sudden disruption.
- **Number 5: Mercury (Budha) - Earth/Air Blend.** 
Represents commercial strategy, analytical speed, rapid communications, humor, and flexible adaptation.
- **Number 6: Venus (Shukra) - Aesthetic Water.** 
Represents refined arts, design harmony, loving relationships, comfort, and physical attractions.
- **Number 7: Ketu (South Node) - Spiritual Ether.** 
Represents intense introspection, deep research, detachments, psychic fields, and ultimate liberation (Moksha).
- **Number 8: Saturn (Shani) - Dense Earth.** 
Represents hard-won discipline, karmic lessons, patience, administrative endurance, and long-term structures.
- **Number 9: Mars (Mangal) - Intense Fire.** 
Represents executive courage, military action, protection, competitive drive, but can trigger explosive anger.

By aligning your lifestyle to balance your ruling Graha (through diet, color remedies, and charity), you neutralize negative alignments and manifest the highest potential of your element.`
    },
    {
      id: "chakras-vibration-alignments",
      category: "chakras",
      title: "The Chakra System: Re-tuning Your Energy Centers",
      excerpt: "Your physical body houses seven subtle energy wheels. Discover how your numerical frequencies direct the flow of your Chakras and vitality.",
      readingTime: "7 min read",
      content: `Your chakras are energetic vortices that transform cosmic light into biological health and nervous system vitality. Your Moolank and Bhagyank directly indicate which chakras represent your superpowers and which ones carry karmic blockages:

1. **Muladhara (Root Chakra) - Saturn/Earth Vibration:** 
Governs physical survival, grounding, and material security. Balanced when you release fear and establish regular daily grounding routines.
2. **Svadhisthana (Sacral Chakra) - Moon/Venus/Water Vibration:** 
Governs fluid emotion, creativity, sexual expression, and relational warmth. Balanced when you allow healthy emotional release.
3. **Manipura (Solar Plexus) - Sun/Mars/Fire Vibration:** 
The furnace of your willpower, confidence, digestions, and action. An overactive Manipura leads to anger; an underactive one leads to passivity.
4. **Anahata (Heart Chakra) - Mercury/Venus/Air Vibration:** 
Governs compassionate love, healing, emotional empathy, and inner peace. Balanced through selfless service and deep pranayama.
5. **Vishuddha (Throat Chakra) - Jupiter/Wind Vibration:** 
Governs verbal expression, singing, authentic writing, and divine alignment. Balanced when you speak the absolute truth without ego.
6. **Ajna (Third Eye Chakra) - Ketu/Moon/Space Vibration:** 
The seat of intuition, dreams, psychic insights, and clear foresight. Balanced when you practice silent breath awareness.
7. **Sahasrara (Crown Chakra) - Divine Solar Void:** 
Connection with absolute cosmic consciousness.

To clear a blocked chakra, identify the number governing that specific element in your profile, chant its seed mantra (e.g., LAM, VAM, RAM, YAM, HAM, OM), and perform physical yoga poses to release physical tissues.`
    },
    {
      id: "philosophy-karma-dharma",
      category: "philosophy",
      title: "Karma, Dharma, and the Vedic Laws of Personal Evolution",
      excerpt: "Explore the ancient spiritual mechanics of cause, duty, and destiny. Understand why challenges repeat and how to resolve karmic loops.",
      readingTime: "8 min read",
      content: `In the Vedic tradition, life is not a random sequence of physical events. It is a highly organized, compassionate matrix designed to help your soul expand through the application of two core laws:

**Dharma (Righteous Path / Duty):**
Dharma is your cosmic alignment. It is the specific actions, careers, and responsibilities you must undertake to support the natural balance of society and your own soul. Your Bhagyank is a direct indicator of your Dharma. If you ignore your Bhagyank's lessons (e.g., a Bhagyank 3 ignoring the path of education to pursue shallow vanity), you experience spiritual decay and severe friction.

**Karma (Law of Cause and Effect):**
Every thought, word, and physical action sets off an energetic ripple across the universe. What you emit returns to you. There are three types of Karma:
1. *Sanchita Karma:* The massive accumulated store of all past action.
2. *Prarabdha Karma:* The specific portion of past karma allocated to be lived and resolved in this current lifetime. Your Moolank strengths and weaknesses are the exact tools and challenges of your Prarabdha Karma.
3. *Agami Karma:* The new karma you actively create right now with your current free-will choices.

To resolve a repeating negative karma loop, you must meet the trial with absolute patience, perform daily charity, and shift your state from egoic reaction to deep, selfless public service.`
    },
    {
      id: "habits-breathwork-science",
      category: "habits",
      title: "The Neuro-Somatic Science of Breathwork & Habit Building",
      excerpt: "Bridging ancient Pranayama with modern neuroplasticity. Learn why 21-day cycles rewrite habits and how breath patterns alter brainwaves.",
      readingTime: "6 min read",
      content: `To translate ancient Vedic wisdom into tangible, real-world success, we must bridge spiritual remedies with modern neuro-somatic sciences:

**The Science of Pranayama:**
Your respiratory rhythm directly dictates your heart rate variability (HRV) and nervous system mode.
- *Nadi Shodhana (Alternate Nostril Breathing)* balances the left and right hemispheres of your brain, inducing Alpha-wave patterns of calm focus.
- *Kapalabhati (Skull Shining Breath)* fires up your sympathetic nervous system, boosting oxygen saturation, cortisol clearing, and metabolic flame.
- *Bhramari (Humming Bee Breath)* stimulates the vagus nerve, immediately dropping blood pressure and triggering the release of serotonin and melatonin.

**The 21/41/90-Day Neuroplasticity Cycles:**
- **21 Days to Form:** When you practice a daily habit (like drinking sunrise copper water or chanting your mantra), your brain builds new synaptic pathways (neural pathways). It takes 21 days of continuous friction to cement this connection.
- **41 Days to Solidify:** Known in Sanskrit as a 'Mandala' cycle. This aligns with standard cellular cycles. 41 days of Continuous Practice locks the habit into your biological muscle memory.
- **90 Days to Master:** The habit transitions from an effortful practice to an organic part of your subconscious character. 

By committing to your custom roadmaps (the 7/21/90 day programs), you are literally restructuring your brain's physical networks, dissolving old self-sabotaging karma, and installing a new, sovereign state of high-vibrational reality.`
    }
  ];

  const translatedArticles = React.useMemo(() => {
    if (language !== "hinglish") return articles;
    return articles.map(art => ({
      ...art,
      title: convertToHinglish(art.title),
      excerpt: convertToHinglish(art.excerpt),
      content: convertToHinglish(art.content),
    }));
  }, [language]);

  const filteredArticles = translatedArticles.filter(art => {
    const matchesCategory = activeCategory === "all" || art.category === activeCategory;
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          art.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="knowledge-library-container" className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 md:p-8 space-y-8 backdrop-blur-md glow-purple">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/25 text-gold px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
            <BookMarked size={12} />
            <span>Wisdom Library</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-serif font-light text-white tracking-tight">
            The Codex of <span className="text-gold italic font-medium">Cosmic Knowledge</span>
          </h3>
          <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
            Unpack textbook-grade articles bridging traditional Vedic sciences, Western depth psychology, somatic breathwork, and practical personal development.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full md:max-w-xs">
          <Search size={14} className="absolute left-4 top-3.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles & secrets..."
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all placeholder-slate-500"
          />
        </div>
      </div>

      {/* Category filters */}
      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            id={`library-cat-filter-${cat.id}`}
            onClick={() => setActiveCategory(cat.id)}
            className={`relative px-4 py-2 rounded-xl text-xs font-display font-semibold whitespace-nowrap transition-all duration-300 cursor-pointer ${
              activeCategory === cat.id
                ? "text-gold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {activeCategory === cat.id && (
              <motion.div
                layoutId="active-library-cat"
                className="absolute inset-0 bg-amber-500/10 border border-amber-500/25 rounded-xl shadow-inner shadow-amber-500/5"
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
              />
            )}
            <span className="relative z-10">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Articles List / Accordions */}
      <motion.div 
        layout
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.05
            }
          }
        }}
        className="space-y-4"
      >
        {filteredArticles.length > 0 ? (
          filteredArticles.map((art, idx) => {
            const isExpanded = expandedArticleId === art.id;
            return (
              <motion.div 
                key={art.id}
                id={`library-article-card-${art.id}`}
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: { opacity: 1, y: 0 }
                }}
                layout="position"
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className="bg-neutral-950/40 hover:bg-neutral-950/60 border border-white/5 hover:border-gold/25 rounded-2xl transition-all duration-300"
              >
                {/* Article Header (Clickable) */}
                <button
                  onClick={() => setExpandedArticleId(isExpanded ? null : art.id)}
                  className="w-full text-left p-5 md:p-6 flex justify-between items-start gap-4 cursor-pointer"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] font-bold font-mono text-gold bg-amber-500/10 border border-gold/15 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {art.category === "basics" && "Basics"}
                        {art.category === "planets" && "Planets"}
                        {art.category === "chakras" && "Chakras"}
                        {art.category === "philosophy" && "Vedic Philosophy"}
                        {art.category === "habits" && "Habit Science"}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{art.readingTime}</span>
                    </div>
                    <h4 className="text-base font-serif font-semibold text-white tracking-tight hover:text-gold transition-colors">
                      {art.title}
                    </h4>
                    {!isExpanded && (
                      <p className="text-xs text-slate-400 font-sans leading-relaxed line-clamp-2">
                        {art.excerpt}
                      </p>
                    )}
                  </div>
                  <div className={`p-1.5 rounded-lg bg-white/5 border border-white/5 text-slate-400 transform transition-transform duration-300 shrink-0 mt-1 ${isExpanded ? "rotate-180 text-gold" : ""}`}>
                    <ChevronDown size={14} />
                  </div>
                </button>

                {/* Article Body */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden border-t border-white/5"
                    >
                      <div className="p-6 md:p-8 space-y-5 text-sm leading-relaxed text-slate-300 font-sans whitespace-pre-line bg-white/[0.01]">
                        {art.content}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            );
          })
        ) : (
          <div className="py-12 text-center text-slate-500 space-y-2">
            <BookOpen size={24} className="mx-auto text-slate-600 animate-pulse" />
            <p className="text-xs">No articles found matching "{searchQuery}". Try searching general topics like 'Moolank' or 'breath'.</p>
          </div>
        )}
      </motion.div>

    </div>
  );
}
