import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Clock, 
  RotateCcw, 
  Compass, 
  Sun, 
  Moon, 
  HelpCircle, 
  Bell, 
  Activity, 
  Flame, 
  Target, 
  UserCheck 
} from "lucide-react";

// Planetary metadata corresponding to Moolank (1-9)
const PLANETARY_MANTRA_DATA: Record<number, {
  planet: string;
  sanskritName: string;
  mantra: string;
  translation: string;
  hinglishTranslation: string;
  frequency: number; // Solfeggio or planetary base frequency
  ambientName: string;
  benefits: string[];
  hinglishBenefits: string[];
  color: string;
  glowColor: string;
  element: string;
  chakra: string;
}> = {
  1: {
    planet: "Sun (Surya)",
    sanskritName: "सूर्य",
    mantra: "ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः",
    translation: "Om Hraam Hreem Hroum Sah Suryaya Namah",
    hinglishTranslation: "Ohr moolank Surya, the self-luminous king, grant authority, clear health blocks, and awaken my soul vitality.",
    frequency: 126.22, // Sun frequency
    ambientName: "Solar Vitality Hum (126.2Hz)",
    benefits: ["Boosts willpower & self-worth", "Amplifies metabolic fire (Agni)", "Awakens solar plexus authority", "Dispels inertia & depression"],
    hinglishBenefits: ["Ichha shakti aur aatmasamman ko badhata hai", "Pachan agni ko jagrut karta hai", "Surya mandal ke tez ko sakriya karta hai", "Aalasya aur mansik dukh ko door karta hai"],
    color: "from-amber-500 to-orange-600",
    glowColor: "rgba(245, 158, 11, 0.4)",
    element: "Tejas (Fire)",
    chakra: "Manipura (Solar Plexus)"
  },
  2: {
    planet: "Moon (Chandra)",
    sanskritName: "चन्द्र",
    mantra: "ॐ श्रां श्रीं श्रौं सः चन्द्राय नमः",
    translation: "Om Shraam Shreem Shroum Sah Chandraya Namah",
    hinglishTranslation: "Divine Mother Chandra, bestow tranquility on my mind, emotional balance, and unlock my deep intuitive pools.",
    frequency: 210.42, // Synodic Moon frequency
    ambientName: "Somatic Lunar Peace (210.4Hz)",
    benefits: ["Deeply calms emotional turbulence", "Harmonizes fluid systems & sleep", "Unlocks intuitive dream recall", "Stabilizes hyperactive thoughts"],
    hinglishBenefits: ["Mann ki chanchalta ko shaant karta hai", "Sone aur dhyan ko behter banata hai", "Intuition (antar-gyan) ko tej karta hai", "Overthinking ko jad se rokta hai"],
    color: "from-blue-400 to-indigo-600",
    glowColor: "rgba(59, 130, 246, 0.4)",
    element: "Apas (Water)",
    chakra: "Anahata / Svadhisthana"
  },
  3: {
    planet: "Jupiter (Guru)",
    sanskritName: "गुरु",
    mantra: "ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः",
    translation: "Om Graam Greem Groum Sah Gurave Namah",
    hinglishTranslation: "Teacher of the cosmos, expansion matrix, shine wisdom upon my paths, bringing spiritual wealth and growth.",
    frequency: 183.58, // Jupiter frequency
    ambientName: "Sattvic Wisdom Drone (183.5Hz)",
    benefits: ["Expands memory & intellectual capacity", "Increases spiritual wisdom", "Constructs a defensive auric shield", "Attracts positive growth & luck"],
    hinglishBenefits: ["Smaran shakti aur buddhi ko badhata hai", "Spiritual gyan aur vivek pradan karta hai", "Aura ko surakshit rakhta hai", "Aksmat safalta aur bhagya lata hai"],
    color: "from-amber-400 to-yellow-600",
    glowColor: "rgba(251, 191, 36, 0.4)",
    element: "Akasha (Ether)",
    chakra: "Vishuddha / Sahasrara"
  },
  4: {
    planet: "Rahu (North Node)",
    sanskritName: "राहु",
    mantra: "ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः",
    translation: "Om Bhraam Bhreem Bhroum Sah Rahave Namah",
    hinglishTranslation: "Dynamic agent of destiny, remove illusory clouds and grant technological prowess, research skill, and swift luck.",
    frequency: 228.0, // Destiny grounding tone
    ambientName: "Shadow Grounding Sound (228Hz)",
    benefits: ["Harmonizes sudden mental anxiety", "Grounds hyperactive sensory currents", "Sharpens analytical research prowess", "Dismantles obsessive illusion loops"],
    hinglishBenefits: ["Achanak aane wale darr ko shaant karta hai", "Indriyo ko thanda aur sthir karta hai", "Anusandhan aur tech skills me dhyan lagata hai", "Bhram aur illusion ko door karta hai"],
    color: "from-violet-500 to-purple-800",
    glowColor: "rgba(168, 85, 247, 0.4)",
    element: "Vayu / Chhaya (Shadow)",
    chakra: "Ajna (Third Eye)"
  },
  5: {
    planet: "Mercury (Budha)",
    sanskritName: "बुध",
    mantra: "ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः",
    translation: "Om Braam Breem Broum Sah Budhaya Namah",
    hinglishTranslation: "Lord of intellect and speech, sharpen my articulation, mathematical wisdom, and business adaptive wit.",
    frequency: 141.27, // Mercury frequency
    ambientName: "Mercury Cognitive Spark (141.2Hz)",
    benefits: ["Sharpens verbal clarity & articulation", "Enhances logical & numeric focus", "Refines nervous system pathways", "Supports mental flexibility"],
    hinglishBenefits: ["Vaani ki madhurta aur clear speech lata hai", "Ganit aur business dhyan ko tej karta hai", "Nervous system ko taakat deta hai", "Faisle lene ki kshamta ko badhata hai"],
    color: "from-emerald-400 to-teal-600",
    glowColor: "rgba(52, 211, 153, 0.4)",
    element: "Prithvi (Earth)",
    chakra: "Vishuddha (Throat)"
  },
  6: {
    planet: "Venus (Shukra)",
    sanskritName: "शुक्र",
    mantra: "ॐ द्रां द्रीं द्रौं सः शुक्राय नमः",
    translation: "Om Draam Dreem Droum Sah Shukraya Namah",
    hinglishTranslation: "Giver of arts, luxury and harmony, balance my personal ties, attract abundance, and enrich my creative talents.",
    frequency: 221.23, // Venus frequency
    ambientName: "Somatic Harmony Resonance (221.2Hz)",
    benefits: ["Ignites artistic inspiration", "Heals interpersonal emotional splits", "Transforms lower-chakra desire to Ojas", "Radiates physical beauty & magnetism"],
    hinglishBenefits: ["Kala, sangit aur srijanatmakta ko jagrut karta hai", "Aapasi sambandho me sanyam aur prem lata hai", "Kaam urja ko Ojas me badalta hai", "Chehre par tej aur aakarshan ko badhata hai"],
    color: "from-pink-400 to-rose-600",
    glowColor: "rgba(244, 114, 182, 0.4)",
    element: "Apas (Water)",
    chakra: "Svadhisthana (Sacral)"
  },
  7: {
    planet: "Ketu (South Node)",
    sanskritName: "केतु",
    mantra: "ॐ स्रां स्रीं स्रौं सः केतवे नमः",
    translation: "Om Sraam Sreem Sroum Sah Ketave Namah",
    hinglishTranslation: "Deep mystic Ketu, lead me from earthly attachments to complete inner freedom and occult intuition.",
    frequency: 160.0, // Mystical void frequency
    ambientName: "Aetheric Occult Void (160Hz)",
    benefits: ["Deepens meditative absorption (Samadhi)", "Unlocks deep somatic cellular memory", "Strengthens psychic perception & dreams", "Releases heavy karmic attachments"],
    hinglishBenefits: ["Dhyan ko samadhi ki gehrai me le jata hai", "Aadhyatmik anubhav ko tej karta hai", "Chhati indriya (Ajna chakra) ko sakriya karta hai", "Purane karmik bandhano se mukti deta hai"],
    color: "from-cyan-400 to-indigo-700",
    glowColor: "rgba(34, 211, 238, 0.4)",
    element: "Akasha / Cosmic Light",
    chakra: "Ajna / Sahasrara"
  },
  8: {
    planet: "Saturn (Shani)",
    sanskritName: "शनि",
    mantra: "ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः",
    translation: "Om Praam Preem Proum Sah Shanaishcharaya Namah",
    hinglishTranslation: "Karmic auditor and keeper of structures, bless my patience, discipline my efforts, and lead to eternal mastery.",
    frequency: 147.85, // Saturn frequency
    ambientName: "Shani Karmic Anchor (147.8Hz)",
    benefits: ["Establishes unshakeable daily patience", "Supports long-duration seated sadhana", "Strengthens bones & spine aura", "Neutralizes chaotic planetary obstacles"],
    hinglishBenefits: ["Apar dhairya aur sanyam pradan karta hai", "Lambi baithak ke dhyan ko asaan banata hai", "Reedh ki haddi aur aura ko majboot karta hai", "Karmik baadhao aur aalasya ko nasht karta hai"],
    color: "from-indigo-500 to-slate-900",
    glowColor: "rgba(99, 102, 241, 0.4)",
    element: "Vayu (Air)",
    chakra: "Muladhara (Root)"
  },
  9: {
    planet: "Mars (Mangal)",
    sanskritName: "मंगल",
    mantra: "ॐ क्रां क्रीं क्रौं सः भौमाय नमः",
    translation: "Om Kraam Kreem Kroom Sah Bhaumaya Namah",
    hinglishTranslation: "Radiant commander of courage, clear blockages of fear, ignite protective action, and align my physical drives.",
    frequency: 144.72, // Mars frequency
    ambientName: "Mangal Courageous Pulse (144.7Hz)",
    benefits: ["Sparks immense vital stamina & courage", "Vanquishes internal fear & cowardice", "Clears blood energetic impurities", "Directs focus on selfless protection"],
    hinglishBenefits: ["Prachand sahas aur aatmabal pradan karta hai", "Darr, ghabrahat aur shanka ko door karta hai", "Sharirik urja aur blood circulation ko shuddh karta hai", "Rakshatmak karyo me dhyaan lagata hai"],
    color: "from-red-500 to-rose-700",
    glowColor: "rgba(239, 68, 68, 0.4)",
    element: "Tejas (Fire)",
    chakra: "Manipura / Muladhara"
  }
};

interface MantraAudioPlayerProps {
  moolank: number;
  language: string;
}

export default function MantraAudioPlayer({ moolank, language }: MantraAudioPlayerProps) {
  const isHinglish = language === "hinglish";
  
  // Selected planetary channel (defaults to user's ruling planet)
  const [selectedMoolank, setSelectedMoolank] = useState<number>(() => {
    const val = Number(moolank);
    return PLANETARY_MANTRA_DATA[val] ? val : 1;
  });

  // Sync state if user's ruling planet prop changes
  useEffect(() => {
    const val = Number(moolank);
    if (PLANETARY_MANTRA_DATA[val]) {
      setSelectedMoolank(val);
    }
  }, [moolank]);

  const data = useMemo(() => {
    return PLANETARY_MANTRA_DATA[selectedMoolank] || PLANETARY_MANTRA_DATA[1];
  }, [selectedMoolank]);

  // UI States
  const [isPlaying, setIsPlaying] = useState(false);
  const [binauralActive, setBinauralActive] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [timerMinutes, setTimerMinutes] = useState<number>(0); // 0 = continuous
  const [timeLeft, setTimeLeft] = useState<number>(0); // seconds
  const [japaCount, setJapaCount] = useState(0);
  const [solfeggioMode, setSolfeggioMode] = useState<"planetary" | "om" | "spiritual">("planetary");
  const [activeTab, setActiveTab] = useState<"meditate" | "philosophy">("meditate");
  const [ringingGong, setRingingGong] = useState(false);

  // Web Audio Nodes refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterVolumeRef = useRef<GainNode | null>(null);
  
  // Left and Right carrier oscillators for binaural brainwave entrainment
  const oscLeftRef = useRef<OscillatorNode | null>(null);
  const oscRightRef = useRef<OscillatorNode | null>(null);
  const panLeftRef = useRef<StereoPannerNode | null>(null);
  const panRightRef = useRef<StereoPannerNode | null>(null);
  
  // Tibetan Singing Bowl Harmonic Oscillators
  const bowlOscsRef = useRef<OscillatorNode[]>([]);
  const bowlGainRef = useRef<GainNode | null>(null);
  
  // Chime triggers and interval timers
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Frequency mapping depending on Solfeggio / planetary settings
  const targetCarrierFrequency = useMemo(() => {
    if (solfeggioMode === "om") return 136.1; // Sacred OM cosmic sound
    if (solfeggioMode === "spiritual") return 432.0; // Universe natural 432Hz focus
    return data.frequency; // Planetary resonant frequency
  }, [solfeggioMode, data.frequency]);

  // Handle ticking timer
  useEffect(() => {
    if (isPlaying && timerMinutes > 0) {
      setTimeLeft(timerMinutes * 60);
    } else {
      setTimeLeft(0);
    }
  }, [timerMinutes, isPlaying]);

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            triggerTempleGong(true); // Ring the beautiful gong!
            stopSynthesizer();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isPlaying, timeLeft]);

  // Real-time canvas animation frames for pulsing visuals
  const [visualizerScale, setVisualizerScale] = useState(1);
  const animationFrameRef = useRef<number | null>(null);

  const updateVisualizerFrame = () => {
    if (isPlaying) {
      // Create a organic breathing rhythm + minor randomness to simulate voice vibrations
      const time = Date.now() / 400;
      const breathing = Math.sin(time) * 0.15 + 1.05;
      const voiceJitter = Math.sin(time * 3) * 0.03;
      setVisualizerScale(breathing + voiceJitter);
      animationFrameRef.current = requestAnimationFrame(updateVisualizerFrame);
    } else {
      setVisualizerScale(1);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      animationFrameRef.current = requestAnimationFrame(updateVisualizerFrame);
    } else {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      setVisualizerScale(1);
    }
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying]);

  // Trigger high-fidelity synthetic temple gong chime!
  const triggerTempleGong = (withBowlResponse = false) => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    
    setRingingGong(true);
    setTimeout(() => setRingingGong(false), 2000);

    // Deep bell strike: combine fundamental frequency (150Hz) and distinct metal harmonics
    const gongGain = ctx.createGain();
    gongGain.gain.setValueAtTime(0, ctx.currentTime);
    gongGain.gain.linearRampToValueAtTime(volume * 0.9, ctx.currentTime + 0.05);
    gongGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 6.0); // Slow long decay
    gongGain.connect(ctx.destination);

    // Base gong tone (warm, resonant)
    const bellFrequencies = [150, 225, 337, 450, 675, 900];
    bellFrequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = idx === 0 ? "sine" : "triangle";
      osc.frequency.value = freq;
      
      // Detune slightly for acoustic authenticity
      osc.detune.value = (Math.random() - 0.5) * 15;
      
      const oscGain = ctx.createGain();
      // Higher partial harmonics fade out much faster
      const durationFactor = 1 / (idx * 0.8 + 1);
      oscGain.gain.setValueAtTime(0, ctx.currentTime);
      oscGain.gain.linearRampToValueAtTime(idx === 0 ? 0.6 : 0.25, ctx.currentTime + 0.03);
      oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (5.0 * durationFactor));
      
      osc.connect(oscGain);
      oscGain.connect(gongGain);
      osc.start();
      osc.stop(ctx.currentTime + 6.0);
    });

    if (withBowlResponse) {
      // Soft ambient response hum
      setTimeout(() => {
        if (!audioCtxRef.current) return;
        const respGain = ctx.createGain();
        respGain.gain.setValueAtTime(0, ctx.currentTime);
        respGain.gain.linearRampToValueAtTime(volume * 0.15, ctx.currentTime + 1);
        respGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 4);
        respGain.connect(ctx.destination);

        const respOsc = ctx.createOscillator();
        respOsc.type = "sine";
        respOsc.frequency.value = targetCarrierFrequency;
        respOsc.connect(respGain);
        respOsc.start();
        respOsc.stop(ctx.currentTime + 5);
      }, 500);
    }
  };

  // Initializing and stopping the Web Audio API Synthesizer
  const startSynthesizer = () => {
    try {
      // 1. Create AudioContext securely on user action
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) {
        alert("Web Audio API not supported in this browser environment.");
        return;
      }
      
      const ctx = new AudioCtxClass();
      audioCtxRef.current = ctx;

      // 2. Setup Master volume controller
      const masterVolume = ctx.createGain();
      masterVolume.gain.setValueAtTime(volume, ctx.currentTime);
      masterVolume.connect(ctx.destination);
      masterVolumeRef.current = masterVolume;

      // 3. Create Binaural Brainwave carrier oscillators
      // Frequency difference of 4Hz (Theta wave) for profound spiritual absorption
      const frequencyOffset = binauralActive ? 4.0 : 0.0;
      const freqL = targetCarrierFrequency - (frequencyOffset / 2);
      const freqR = targetCarrierFrequency + (frequencyOffset / 2);

      // Create Left Channel chain
      const oscL = ctx.createOscillator();
      oscL.type = "sine";
      oscL.frequency.setValueAtTime(freqL, ctx.currentTime);
      
      const pannerL = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      if (pannerL) {
        pannerL.pan.setValueAtTime(-0.8, ctx.currentTime);
        oscL.connect(pannerL);
        pannerL.connect(masterVolume);
        panLeftRef.current = pannerL;
      } else {
        oscL.connect(masterVolume);
      }
      oscLeftRef.current = oscL;

      // Create Right Channel chain
      const oscR = ctx.createOscillator();
      oscR.type = "sine";
      oscR.frequency.setValueAtTime(freqR, ctx.currentTime);

      const pannerR = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      if (pannerR) {
        pannerR.pan.setValueAtTime(0.8, ctx.currentTime);
        oscR.connect(pannerR);
        pannerR.connect(masterVolume);
        panRightRef.current = pannerR;
      } else {
        oscR.connect(masterVolume);
      }
      oscRightRef.current = oscR;

      // Start the deep background carrier hum
      oscL.start();
      oscR.start();

      // 4. Create secondary harmonic Singing Bowl nodes
      const bowlGain = ctx.createGain();
      bowlGain.gain.setValueAtTime(0, ctx.currentTime);
      // Fade in singing bowl harmonics smoothly over 3 seconds
      bowlGain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 3.0);
      bowlGain.connect(masterVolume);
      bowlGainRef.current = bowlGain;

      // Create three harmonics above the carrier frequency to give a rich sonic structure
      const harmonics = [1.5, 2.0, 3.0];
      const tempOscs: OscillatorNode[] = [];
      harmonics.forEach((multiplier, index) => {
        const harmonicOsc = ctx.createOscillator();
        harmonicOsc.type = "sine";
        harmonicOsc.frequency.setValueAtTime(targetCarrierFrequency * multiplier, ctx.currentTime);
        
        // Slightly detune to create a warm beat frequency/chorus effect
        harmonicOsc.detune.setValueAtTime((index === 1 ? 5 : -5), ctx.currentTime);
        
        // Rhythmic breathing of individual harmonics (Low Frequency Modulation)
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(0.08 / harmonics.length, ctx.currentTime);
        
        harmonicOsc.connect(lfoGain);
        lfoGain.connect(bowlGain);
        
        harmonicOsc.start();
        tempOscs.push(harmonicOsc);
      });
      bowlOscsRef.current = tempOscs;

      // 5. Setup periodic Temple Bell chimes (every 14 seconds)
      triggerTempleGong(false); // First chime on start
      intervalRef.current = setInterval(() => {
        triggerTempleGong(false);
      }, 14000);

      setIsPlaying(true);
    } catch (err) {
      console.error("Synthesizer startup failed:", err);
    }
  };

  const stopSynthesizer = () => {
    // Clear all interval timers
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Stop and null oscillators safely with fading
    try {
      if (masterVolumeRef.current && audioCtxRef.current) {
        const ctx = audioCtxRef.current;
        // Fast fade-out (0.2 seconds) to avoid pops and clicks
        masterVolumeRef.current.gain.cancelScheduledValues(ctx.currentTime);
        masterVolumeRef.current.gain.setValueAtTime(masterVolumeRef.current.gain.value, ctx.currentTime);
        masterVolumeRef.current.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      }
    } catch (e) {
      console.warn("Volume fadeout skipped:", e);
    }

    setTimeout(() => {
      // Absolute release of all audio elements
      if (oscLeftRef.current) {
        try { oscLeftRef.current.stop(); } catch (e) {}
        oscLeftRef.current = null;
      }
      if (oscRightRef.current) {
        try { oscRightRef.current.stop(); } catch (e) {}
        oscRightRef.current = null;
      }
      bowlOscsRef.current.forEach((osc) => {
        try { osc.stop(); } catch (e) {}
      });
      bowlOscsRef.current = [];

      if (audioCtxRef.current) {
        try { audioCtxRef.current.close(); } catch (e) {}
        audioCtxRef.current = null;
      }

      setIsPlaying(false);
    }, 400);
  };

  // Apply volume modifications live
  useEffect(() => {
    if (masterVolumeRef.current && audioCtxRef.current) {
      const ctx = audioCtxRef.current;
      masterVolumeRef.current.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.1);
    }
  }, [volume]);

  // Adjust binaural settings or planetary channel live
  useEffect(() => {
    if (isPlaying) {
      // Re-initialize synthesizer with the new configuration
      stopSynthesizer();
      setTimeout(() => {
        startSynthesizer();
      }, 500);
    }
  }, [binauralActive, solfeggioMode, selectedMoolank]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      
      if (oscLeftRef.current) { try { oscLeftRef.current.stop(); } catch(e) {} }
      if (oscRightRef.current) { try { oscRightRef.current.stop(); } catch(e) {} }
      bowlOscsRef.current.forEach((osc) => { try { osc.stop(); } catch (e) {} });
      
      if (audioCtxRef.current) {
        try { audioCtxRef.current.close(); } catch(e) {}
      }
    };
  }, []);

  // Format time remaining MM:SS
  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Progress of timer circle
  const timerPercentage = useMemo(() => {
    if (timerMinutes === 0) return 100;
    const total = timerMinutes * 60;
    return (timeLeft / total) * 100;
  }, [timeLeft, timerMinutes]);

  return (
    <div id="mantra-audio-player-root" className="bg-gradient-to-b from-neutral-950 to-neutral-900 border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden glow-purple">
      {/* Decorative ambient background aura matching the ruling planet */}
      <div 
        className="absolute w-72 h-72 rounded-full blur-[120px] -right-20 -top-20 opacity-30 pointer-events-none transition-all duration-1000"
        style={{ backgroundColor: data.glowColor }}
      />
      <div 
        className="absolute w-56 h-56 rounded-full blur-[100px] -left-20 -bottom-20 opacity-20 pointer-events-none transition-all duration-1000"
        style={{ backgroundColor: data.glowColor }}
      />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-white/5 pb-5">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl bg-gradient-to-tr ${data.color} text-white shadow-lg shadow-gold/10 relative`}>
            <Activity className="animate-pulse" size={18} />
          </div>
          <div>
            <span className="text-[9px] bg-gold/15 border border-gold/30 text-gold px-2.5 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider block w-fit mb-1">
              {isHinglish ? "RULING GRAHA SOUND REMEDY" : "RULING PLANET AUDIO REMEDY"}
            </span>
            <h4 className="text-base font-serif font-bold text-white tracking-tight flex items-center gap-2">
              {data.planet} Meditation Sanctuary
              <span className="text-xs font-mono text-slate-400 font-normal">({data.sanskritName})</span>
            </h4>
          </div>
        </div>

        {/* Local sub-tabs: Interactive player vs Planet Philosophy */}
        <div className="flex bg-neutral-950 p-1 rounded-lg border border-white/5 font-mono text-[10px] uppercase font-bold self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("meditate")}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              activeTab === "meditate" 
                ? "bg-amber-500/15 text-gold border border-amber-500/10" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            {isHinglish ? "Dhyan (Sadhana)" : "Meditate"}
          </button>
          <button
            onClick={() => setActiveTab("philosophy")}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              activeTab === "philosophy" 
                ? "bg-amber-500/15 text-gold border border-amber-500/10" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            {isHinglish ? "Vigyan (Science)" : "Therapeutics"}
          </button>
        </div>
      </div>

      {/* Planetary Mantra Channels Selector */}
      <div className="mb-6 bg-neutral-950/40 p-3 rounded-2xl border border-white/5 space-y-2">
        <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
          {isHinglish ? "MANTRAS SUTRA CHANNEL SELECTOR" : "SELECT PLANETARY MANTRA CHANNEL"}
        </span>
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
          {Object.entries(PLANETARY_MANTRA_DATA).map(([numStr, pData]) => {
            const num = Number(numStr);
            const isSelected = selectedMoolank === num;
            const isUserRuling = Number(moolank) === num;
            return (
              <button
                key={num}
                type="button"
                onClick={() => setSelectedMoolank(num)}
                className={`py-2 px-1 rounded-xl border text-center transition-all cursor-pointer flex flex-col justify-center items-center gap-0.5 relative overflow-hidden group ${
                  isSelected
                    ? "bg-amber-500/10 border-gold/40 text-gold shadow-md shadow-gold/5"
                    : "bg-white/[0.01] border-white/5 text-slate-400 hover:bg-white/[0.03] hover:text-white"
                }`}
              >
                {/* Micro ruling planet badge indicator */}
                {isUserRuling && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-gold animate-pulse" title="Your Ruling Planet" />
                )}
                
                <span className="text-xs font-mono font-bold block">{num}</span>
                <span className="text-[9px] font-sans font-semibold truncate max-w-full block">
                  {pData.planet.split(" ")[0]}
                </span>
                
                {isUserRuling && (
                  <span className="text-[7px] text-amber-400 font-mono scale-90 -mt-0.5 leading-none">
                    {isHinglish ? "Aapka" : "Ruling"}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "meditate" ? (
          <motion.div 
            key="meditate-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
          >
            
            {/* Visualizer and Central controls (md:col-span-6) */}
            <div className="md:col-span-6 flex flex-col items-center justify-center space-y-6 relative py-4">
              
              {/* Primary Pulsing Resonance Circle */}
              <div className="relative w-48 h-48 flex items-center justify-center">
                {/* Simulated dynamic concentric wave rings based on playing state */}
                <AnimatePresence>
                  {isPlaying && (
                    <>
                      <motion.div 
                        initial={{ scale: 0.9, opacity: 0.6 }}
                        animate={{ scale: visualizerScale * 1.35, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
                        className="absolute w-44 h-44 rounded-full border border-gold/40 pointer-events-none"
                      />
                      <motion.div 
                        initial={{ scale: 0.95, opacity: 0.4 }}
                        animate={{ scale: visualizerScale * 1.7, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 3.3, repeat: Infinity, ease: "easeOut", delay: 0.8 }}
                        className="absolute w-44 h-44 rounded-full border border-purple-500/20 pointer-events-none"
                      />
                    </>
                  )}
                </AnimatePresence>

                {/* Main Ring Canvas and buttons */}
                <motion.div 
                  animate={{ scale: visualizerScale }}
                  transition={{ type: "spring", stiffness: 100, damping: 25 }}
                  className={`w-40 h-40 rounded-full bg-neutral-900 border-2 flex flex-col items-center justify-center relative transition-colors duration-500 ${
                    isPlaying ? "border-gold shadow-2xl" : "border-white/10"
                  }`}
                  style={{ 
                    boxShadow: isPlaying ? `0 0 35px ${data.glowColor}` : "none" 
                  }}
                >
                  {/* Digital timer remaining overlay or dynamic OM */}
                  {isPlaying && timerMinutes > 0 ? (
                    <div className="absolute top-4 flex flex-col items-center">
                      <Clock size={10} className="text-gold/60 animate-spin-slow" />
                      <span className="text-[10px] font-mono text-slate-400 font-bold mt-0.5">{formatTime(timeLeft)}</span>
                    </div>
                  ) : (
                    <span className="absolute top-4 text-[9px] font-mono text-slate-500 uppercase tracking-widest font-black">
                      {data.element}
                    </span>
                  )}

                  {/* Play / Pause Toggle Button */}
                  <button
                    onClick={isPlaying ? stopSynthesizer : startSynthesizer}
                    className={`p-5 rounded-full bg-gradient-to-tr text-white shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer z-10 ${
                      isPlaying 
                        ? "from-rose-600 to-red-500 shadow-rose-950/40" 
                        : `from-amber-400 to-orange-500 shadow-gold/20`
                    }`}
                  >
                    {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                  </button>

                  <div className="absolute bottom-4 flex flex-col items-center">
                    <span className="text-[9px] font-mono font-bold text-gold uppercase tracking-wider">
                      {solfeggioMode === "planetary" ? `${targetCarrierFrequency}Hz` : solfeggioMode.toUpperCase()}
                    </span>
                    <span className="text-[7px] text-slate-500 uppercase font-black tracking-wider leading-none">
                      {isPlaying ? (isHinglish ? "DHYAN CHALU" : "SADID HARI") : (isHinglish ? "STHIR SHABD" : "IDLE AMBIENT")}
                    </span>
                  </div>
                </motion.div>

                {/* Hand Gong Strike Trigger Button (always active!) */}
                <button
                  onClick={() => triggerTempleGong(true)}
                  className={`absolute bottom-0 right-1 p-2 rounded-full bg-neutral-950 border border-white/10 hover:border-gold hover:text-gold text-slate-400 transition-all cursor-pointer z-10 ${
                    ringingGong ? "scale-110 text-gold border-gold rotate-12" : ""
                  }`}
                  title={isHinglish ? "Mandir ka ghanta bajayein" : "Trigger temple bell gong"}
                >
                  <Bell size={14} className={ringingGong ? "animate-wiggle" : ""} />
                </button>
              </div>

              {/* Volume & Binaural Controls */}
              <div className="w-full max-w-[240px] space-y-4">
                {/* Volume Slider */}
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setVolume(volume === 0 ? 0.5 : 0)}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-gold focus:outline-none"
                  />
                  <span className="text-[9px] font-mono text-slate-500 w-6 text-right font-bold">
                    {Math.round(volume * 100)}%
                  </span>
                </div>

                {/* Binaural Entrainment Switch */}
                <div className="flex items-center justify-between p-2 bg-neutral-950 rounded-xl border border-white/5">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-200 font-bold font-mono">BINAURAL ENTRAINMENT</span>
                    <span className="text-[7px] text-slate-500 font-sans leading-none mt-0.5">
                      {isHinglish ? "4Hz Theta dhyan laherein" : "Injects 4Hz brainwave theta pulses"}
                    </span>
                  </div>
                  <button
                    onClick={() => setBinauralActive(!binauralActive)}
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-300 relative focus:outline-none cursor-pointer ${
                      binauralActive ? "bg-amber-500" : "bg-white/10"
                    }`}
                  >
                    <div 
                      className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 transform ${
                        binauralActive ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

            </div>

            {/* Chanting Companion & Instructions (md:col-span-6) */}
            <div className="md:col-span-6 space-y-5">
              
              {/* Sacred Mantra display card */}
              <div className="p-4 bg-neutral-950 border border-white/5 rounded-xl space-y-2.5 relative overflow-hidden">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono text-slate-400 uppercase font-black">
                    {isHinglish ? "Sacred Vedic Shloka" : "Vedic Graha Mantra"}
                  </span>
                  <span className="text-[8px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded font-mono font-bold uppercase">
                    {data.chakra}
                  </span>
                </div>

                <div className="text-center py-2">
                  <p className="text-lg font-serif font-black text-amber-300 tracking-wide select-all selection:bg-amber-500/25">
                    {data.mantra}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono tracking-wide mt-1.5 leading-normal">
                    "{data.translation}"
                  </p>
                </div>

                <p className="text-[10px] text-slate-300 leading-normal border-t border-white/5 pt-2.5 font-sans">
                  <span className="text-gold font-semibold uppercase text-[9px] font-mono block mb-0.5">
                    {isHinglish ? "Anuvad (Meaning)" : "Sadhana Meaning"}
                  </span>
                  {isHinglish ? data.hinglishTranslation : data.hinglishTranslation}
                </p>
              </div>

              {/* Custom controls row: Carrier mode and Timer */}
              <div className="grid grid-cols-2 gap-3">
                
                {/* Solfeggio carrier setting */}
                <div className="bg-neutral-950 border border-white/5 rounded-xl p-2.5 flex flex-col justify-between space-y-2">
                  <span className="text-[8px] font-mono text-slate-500 uppercase font-black">
                    {isHinglish ? "Carrier Sound" : "Hum Frequency"}
                  </span>
                  <div className="flex flex-col gap-1">
                    {(["planetary", "om", "spiritual"] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setSolfeggioMode(mode)}
                        className={`text-[9px] font-mono uppercase text-left px-2 py-1 rounded transition-colors cursor-pointer ${
                          solfeggioMode === mode
                            ? "bg-amber-500/15 text-gold font-bold border-l-2 border-gold"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {mode === "planetary" ? `${data.planet.split(" ")[0]}` : mode === "om" ? "Cosmic OM (136.1Hz)" : "Aura 432Hz"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration select */}
                <div className="bg-neutral-950 border border-white/5 rounded-xl p-2.5 flex flex-col justify-between space-y-2">
                  <span className="text-[8px] font-mono text-slate-500 uppercase font-black">
                    {isHinglish ? "Meditation Timer" : "Sadhana Timer"}
                  </span>
                  <div className="flex flex-col gap-1">
                    {([0, 5, 10, 20] as const).map((mins) => (
                      <button
                        key={mins}
                        onClick={() => setTimerMinutes(mins)}
                        className={`text-[9px] font-mono text-left px-2 py-1 rounded transition-colors cursor-pointer ${
                          timerMinutes === mins
                            ? "bg-amber-500/15 text-gold font-bold border-l-2 border-gold"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {mins === 0 ? (isHinglish ? "Unlimited" : "Infinite Play") : `${mins} ${isHinglish ? "Minut" : "Minutes"}`}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Japa Counting Bead widget */}
              <div className="bg-neutral-950 border border-white/5 p-3 rounded-xl flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-[8px] font-mono text-slate-500 uppercase font-black">
                    {isHinglish ? "Japa Sadhana Jap (108)" : "Interactive Japa Counter (108 Beads)"}
                  </span>
                  <p className="text-xs font-serif text-slate-300 font-semibold leading-normal">
                    {japaCount === 108 
                      ? (isHinglish ? "Sadhana Sampoorna! ✨" : "Vedic Cycle Complete! ✨") 
                      : (isHinglish ? `${japaCount} mantra poore hue` : `${japaCount} of 108 chants completed`)}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setJapaCount((prev) => (prev < 108 ? prev + 1 : 108));
                      // Subtly trigger a metallic confirmation click chime
                      if (audioCtxRef.current) {
                        const ctx = audioCtxRef.current;
                        const tickGain = ctx.createGain();
                        tickGain.gain.setValueAtTime(0.1, ctx.currentTime);
                        tickGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
                        tickGain.connect(ctx.destination);
                        
                        const tickOsc = ctx.createOscillator();
                        tickOsc.type = "sine";
                        tickOsc.frequency.setValueAtTime(japaCount === 107 ? 1200 : 880, ctx.currentTime);
                        tickOsc.connect(tickGain);
                        tickOsc.start();
                        tickOsc.stop(ctx.currentTime + 0.15);
                      }
                    }}
                    className="px-3.5 py-1.5 bg-gold hover:bg-yellow-500 text-black text-xs font-bold rounded-lg hover:scale-105 active:scale-95 transition-all cursor-pointer font-mono uppercase"
                  >
                    {isHinglish ? "+1 Mala Bead" : "Chant Bead"}
                  </button>
                  <button
                    onClick={() => setJapaCount(0)}
                    className="p-1.5 text-slate-500 hover:text-white rounded transition-colors cursor-pointer"
                    title="Reset Counter"
                  >
                    <RotateCcw size={13} />
                  </button>
                </div>
              </div>

            </div>

          </motion.div>
        ) : (
          <motion.div 
            key="philosophy-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Scientific explanation of the soundwaves and planet benefits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="p-4 bg-neutral-950/80 rounded-xl border border-white/5 space-y-2">
                <h5 className="text-xs font-bold text-gold font-mono uppercase tracking-wide flex items-center gap-1">
                  <Target size={13} />
                  {isHinglish ? "Grahic Sound Waves ka Vigyan" : "Planetary Acoustic Therapeutics"}
                </h5>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {isHinglish 
                    ? `Humne is player me aapke moolank graha ke shudh planetary coordinates ko frequency (${data.frequency}Hz) me transform kiya hai. Jab aap earphone lagakar binaural feature activate karte hain, to dono kaano me slight freq variation (4Hz) brain me powerful Theta waveforms create karta hai.`
                    : `In Vedic cosmology, sound represents the primary elemental manifestation (Shabda Brahman). This sanctuary maps your ruling planet to its corresponding cosmic frequency (${data.frequency}Hz). Enabling the binaural feature injects a steady 4Hz differential, guiding your neurology into the Theta band (deep meditation and sublimation status).`}
                </p>
              </div>

              <div className="p-4 bg-neutral-950/80 rounded-xl border border-white/5 space-y-2">
                <h5 className="text-xs font-bold text-cyan-400 font-mono uppercase tracking-wide flex items-center gap-1">
                  <UserCheck size={13} />
                  {isHinglish ? "Daily Meditation ke Labh" : "Metaphysical Sadhana Benefits"}
                </h5>
                <ul className="space-y-1.5">
                  {(isHinglish ? data.hinglishBenefits : data.benefits).map((benefit, idx) => (
                    <li key={idx} className="text-[11px] text-slate-300 flex items-start gap-1.5 leading-normal">
                      <span className="text-gold mt-0.5">✦</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl flex items-center gap-3">
              <span className="text-xl">🧘‍♂️</span>
              <p className="text-[10px] text-slate-300 leading-normal">
                {isHinglish 
                  ? "Sanyam nirdesh: Din me kam se kam 10-15 minute subah uday ke samay baithkar reedh ki haddi ko seedha rakhein aur mantra ke pavan shabd-shastra me dhyan lagayein."
                  : "Daily Sadhana Tip: Sit erect with your head, neck, and back completely aligned. Play the loops during sunrise or sandhya transitions to maximize planetary energy sublimation."}
              </p>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
