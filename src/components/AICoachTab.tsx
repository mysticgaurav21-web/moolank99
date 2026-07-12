import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Send, 
  Sparkles, 
  User, 
  Bot, 
  RefreshCw, 
  HelpCircle,
  MessageSquare,
  ShieldCheck,
  Compass
} from "lucide-react";
import { getTransformationProfile } from "../data/transformationData";
import { convertToHinglish } from "../utils/hinglish";

interface Message {
  sender: "user" | "coach";
  text: string;
  timestamp: Date;
}

interface AICoachTabProps {
  moolank: number;
  bhagyank: number;
  name: string;
  language: string;
  currentTier?: "sutra" | "chakra" | "brahmanda";
  onUpgradeClick?: () => void;
}

export default function AICoachTab({ moolank, bhagyank, name, language, currentTier = "sutra", onUpgradeClick }: AICoachTabProps) {
  const profile = getTransformationProfile(moolank);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userMessageCount = messages.filter(m => m.sender === "user").length;
  const isLimitReached = currentTier === "sutra" && userMessageCount >= 2;

  // Initialize and dynamically update the coaching welcome message when language changes
  useEffect(() => {
    const welcomeText = language === "hinglish"
      ? `Namaste ${name}! Main aapka Vedic Life Coach aur Mentor hoon, jo aapke ruling planet ${profile.identity.dominantPlanet} ki cosmic vibration par tuned hai. Main aapke cosmic blueprints ko decode karne, life blockages door karne aur daily 7/21/90-day transformation plans me help karne ke liye taiyaar hoon. Aaj aap apne life ke kis part ke baare me discuss karna chahte hain?`
      : `Greetings, ${name}. I am your Vedic Life Coach and Mentor, tuned to your ruling planetary vibration of the ${profile.identity.dominantPlanet}. I am here to help you unpack your cosmic blueprints, remove obstacles, and navigate your 7/21/90-day transformation plans. What element of your life shall we explore today?`;

    setMessages([
      {
        sender: "coach",
        text: welcomeText,
        timestamp: new Date()
      }
    ]);
  }, [language, name, profile.identity.dominantPlanet]);

  const quickPrompts = [
    "How can I balance my ruling planet energy?",
    "What are my main financial blockages & spending habits?",
    "Can you explain my 21-day transformation plan?",
    "What is my ultimate Bhagyank destination calling?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      sender: "user",
      text: textToSend,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setLoading(true);

    try {
      const response = await fetch("/api/moolank/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moolank,
          bhagyank,
          name,
          message: textToSend,
          language,
          history: messages.map(m => ({ role: m.sender === "user" ? "user" : "model", parts: [{ text: m.text }] }))
        })
      });

      if (!response.ok) {
        throw new Error("Coach API failed");
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          sender: "coach",
          text: data.isFallback ? `[Cosmic Alignment Mode] ${data.reply}` : data.reply,
          timestamp: new Date()
        }
      ]);
    } catch (err) {
      // Wise local fallback response tuned specifically to the user's Moolank!
      setTimeout(() => {
        let fallbackText = "";
        const lowerText = textToSend.toLowerCase();

        if (lowerText.includes("planet") || lowerText.includes("balance") || lowerText.includes("energy")) {
          fallbackText = `To align with your dominant planet, ${profile.identity.dominantPlanet}, you must balance your ${profile.identity.dominantElement} element. Daily recitation of the mantra "${profile.spiritualProfile.dailyMantra}" and performing the morning routine ("${profile.healthProfile.morningRoutine}") will help ground your field. Keep your solar plexus aligned and remember that you are built for ${profile.identity.leadershipStyle.split(".")[0]}.`;
        } else if (lowerText.includes("financial") || lowerText.includes("money") || lowerText.includes("wealth") || lowerText.includes("spend")) {
          fallbackText = `Let's talk about your money energy. Your wealth profile is "${profile.moneyProfile.moneyPersonality}". Your typical spending is "${profile.moneyProfile.spendingStyle}". To clear blockages, start by implementing these 3 practices: 1) ${profile.moneyProfile.moneyMindsetImprovement[0]} 2) Avoid the wealth blockers of ${profile.moneyProfile.wealthBlockers.join(", ")} 3) Recite your abundance affirmations daily: "✨ ${profile.spiritualProfile.affirmations[2]}".`;
        } else if (lowerText.includes("21") || lowerText.includes("day") || lowerText.includes("plan") || lowerText.includes("transformation") || lowerText.includes("roadmap")) {
          fallbackText = `Your 21-Day Habit Deepener is designed for neural rewiring. Here are the phases:
Phase 1: ${profile.roadmap.twentyOneDayPlan[0]}
Phase 2: ${profile.roadmap.twentyOneDayPlan[1]}
Phase 3: ${profile.roadmap.twentyOneDayPlan[2]}

Begin today with Day 1 of your Fast-Track plan: "${profile.roadmap.sevenDayPlan[0]}" and observe how your nervous system shifts.`;
        } else if (lowerText.includes("destiny") || lowerText.includes("purpose") || lowerText.includes("bhagyank")) {
          fallbackText = `Your Bhagyank destiny count is ${bhagyank}. This represents your ultimate path of service and growth. Combined with your Moolank ${moolank} (${profile.identity.energyType}), your soul is learning ${profile.weaknessesProfile.biggestLifeLessons[0]} Your ultimate destiny demands that you align your analytical power with compassionate service.`;
        } else {
          fallbackText = `As a Moolank ${moolank} seeker governed by ${profile.identity.dominantPlanet}, your mind is naturally wired towards being ${profile.identity.thinkingPattern.toLowerCase()} In this moment, whatever challenge you are facing is a catalyst for your karma cycle. Integrate your main strength ("${profile.strengthsProfile.strengths[0]}") and remember to release your core self-sabotaging habit of "${profile.weaknessesProfile.selfSabotagingHabits[0]}". Breathe deeply through your nose, repeat "${profile.spiritualProfile.dailyMantra}", and trust your path.`;
        }

        const formattedReply = language === "hinglish" 
          ? convertToHinglish(fallbackText) 
          : fallbackText;

        setMessages((prev) => [
          ...prev,
          {
            sender: "coach",
            text: `[Cosmic Alignment Mode] ${formattedReply}`,
            timestamp: new Date()
          }
        ]);
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="ai-coach-container" className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 backdrop-blur-md glow-purple">
      
      {/* Intro & Suggestion sidebar */}
      <div className="lg:col-span-4 space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/25 text-gold px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
            <Bot size={12} className="animate-pulse" />
            <span>Spiritual Guidance</span>
          </div>
          <h3 className="text-xl md:text-2xl font-serif font-light text-white tracking-tight">
            Consult the <span className="text-gold italic font-medium">Cosmic Mentor</span>
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your personalized AI coach interprets your Vedic elements and planets. Ask anything about career shifts, relationship compatibility, money flows, or daily routines.
          </p>
        </div>

        {/* Suggestion Chips */}
        <div className="space-y-3">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono font-bold flex items-center gap-1.5">
            <HelpCircle size={12} className="text-gold" /> Suggested Inquiry Topics
          </span>
          <div className="flex flex-col gap-2">
            {quickPrompts.map((prompt, i) => (
              <motion.button
                key={i}
                id={`coach-suggested-prompt-${i}`}
                onClick={() => handleSendMessage(prompt)}
                disabled={loading || isLimitReached}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 100, damping: 15 }}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="text-left bg-white/[0.02] hover:bg-amber-500/10 border border-white/5 hover:border-gold/30 p-3 rounded-xl text-xs text-slate-300 hover:text-gold transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-sans"
              >
                {prompt}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Info card */}
        <div className="p-4 bg-white/[0.01] border border-white/5 rounded-xl flex items-start gap-2.5">
          <ShieldCheck size={16} className="text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <span className="text-slate-300 font-bold block">100% Confidential</span>
            <p className="text-slate-500 font-sans leading-relaxed">
              Your conversations are private, non-commercialized, and wiped after session refresh. Speak freely from the heart.
            </p>
          </div>
        </div>
      </div>

      {/* Main chat box */}
      <div className="lg:col-span-8 flex flex-col h-[500px] bg-neutral-950/45 border border-white/5 rounded-2xl overflow-hidden relative shadow-2xl">
        
        {/* Chat box header */}
        <div className="bg-white/[0.02] border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9.5 h-9.5 rounded-full bg-gradient-to-br from-gold-dark to-gold-light flex items-center justify-center text-cosmic-bg shadow-sm shadow-gold/30">
              <Bot size={16} />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Vedic Astrological Mentor</span>
              <span className="text-[9px] text-gold font-bold font-mono tracking-wider flex items-center gap-1 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active Planet Alignment
              </span>
            </div>
          </div>

          <button
            onClick={() => setMessages([
              {
                sender: "coach",
                text: `Greetings, ${name}. I am your Vedic Life Coach and Mentor, tuned to your ruling planetary vibration of the ${profile.identity.dominantPlanet}. What element of your life shall we explore today?`,
                timestamp: new Date()
              }
            ])}
            className="text-slate-500 hover:text-white text-xs flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
          >
            <RefreshCw size={12} />
            <span>Reset Guidance</span>
          </button>
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-thin">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => {
              const isCoach = msg.sender === "coach";
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: isCoach ? -20 : 20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 120, damping: 14 }}
                  className={`flex gap-3.5 max-w-[85%] ${isCoach ? "self-start" : "ml-auto flex-row-reverse"}`}
                >
                  <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs ${
                    isCoach 
                      ? "bg-amber-500/10 border border-gold/25 text-gold" 
                      : "bg-white/5 border border-white/10 text-white"
                  }`}>
                    {isCoach ? <Bot size={14} /> : <User size={14} />}
                  </div>

                  <div className={`p-4 rounded-2xl text-xs leading-relaxed font-sans ${
                    isCoach 
                      ? "bg-white/[0.03] border border-white/5 text-slate-300" 
                      : "bg-gradient-to-r from-gold-dark/45 to-gold-light/45 border border-gold/30 text-white"
                  }`}>
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <span className="text-[8px] text-slate-500 mt-1.5 block text-right font-mono">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {loading && (
            <div className="flex gap-3.5 max-w-[80%] self-start">
              <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center bg-amber-500/10 border border-gold/25 text-gold animate-spin">
                <RefreshCw size={14} />
              </div>
              <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Chat input form or Paywall limit */}
        {isLimitReached ? (
          <div className="bg-gradient-to-r from-amber-500/10 to-purple-500/10 border-t border-gold/20 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-left">
              <span className="text-[10px] text-gold font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles size={12} className="animate-pulse" /> {language === "hinglish" ? "Free Limit Khatam" : "Free Limit Reached"}
              </span>
              <p className="text-[11px] text-slate-300 max-w-md font-sans leading-relaxed">
                {language === "hinglish" 
                  ? "Aapne Sutra plan par 2 free sawal pooch liye hain. Unlimited answers aur detailed tips ke liye Chakra plan par upgrade karein."
                  : "You've asked your 2 free questions on the Sutra plan. Upgrade to the Chakra Premium plan for unlimited chats with your Cosmic Mentor."}
              </p>
            </div>
            <button
              type="button"
              onClick={onUpgradeClick}
              className="w-full sm:w-auto shrink-0 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-cosmic-bg font-bold text-xs py-2.5 px-5 rounded-xl cursor-pointer hover:brightness-110 transition-all shadow-lg glow-gold"
            >
              {language === "hinglish" ? "Premium Active Karein" : "Unlock Unlimited Chat"}
            </button>
          </div>
        ) : (
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="bg-white/[0.02] border-t border-white/5 p-4 flex gap-3"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={loading}
              placeholder={language === "hinglish" ? `Sawal poochein (Free bache hain: ${2 - userMessageCount})...` : `Ask about your ${profile.identity.dominantPlanet} cycle (Free left: ${2 - userMessageCount})...`}
              className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-gold transition-all placeholder-slate-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || loading}
              className="bg-gradient-to-r from-gold-dark via-gold to-gold-light text-cosmic-bg p-3.5 rounded-xl cursor-pointer hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-gold/25 flex items-center justify-center shrink-0"
            >
              <Send size={14} />
            </button>
          </form>
        )}

      </div>

    </div>
  );
}
