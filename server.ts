import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { convertToHinglish } from "./src/utils/hinglish";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialization of Gemini SDK client
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    aiClient = new GoogleGenAI({
      apiKey: key || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Robust retry wrapper for Gemini generateContent to handle 503 / 429 transient overloads gracefully
async function generateContentWithRetry(params: any, retries = 3, delay = 1000): Promise<any> {
  let attempt = 0;
  while (attempt <= retries) {
    try {
      const ai = getAiClient();
      const response = await ai.models.generateContent(params);
      return response;
    } catch (error: any) {
      attempt++;
      const errorMessage = error?.message || String(error);
      const statusCode = error?.status || error?.statusCode || error?.code;
      const isTransient = errorMessage.includes("503") || 
                          errorMessage.includes("429") || 
                          errorMessage.includes("UNAVAILABLE") || 
                          errorMessage.includes("RESOURCE_EXHAUSTED") ||
                          errorMessage.includes("high demand") ||
                          statusCode === 503 ||
                          statusCode === 429;
      
      if (isTransient && attempt <= retries) {
        console.warn(`Gemini API transient error (attempt ${attempt}/${retries}): ${errorMessage}. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // exponential backoff
      } else {
        throw error;
      }
    }
  }
}

// Programmatic Numerology Calculations
function reduceToSingleDigit(num: number): number {
  while (num > 9) {
    num = num.toString().split('').reduce((sum, d) => sum + parseInt(d, 10), 0);
  }
  return num;
}

function calculateMoolank(dob: string): number {
  // dob: YYYY-MM-DD
  const parts = dob.split('-');
  const day = parseInt(parts[2], 10);
  return reduceToSingleDigit(day);
}

function calculateBhagyank(dob: string): number {
  // dob: YYYY-MM-DD
  const cleanStr = dob.replace(/-/g, '');
  let sum = 0;
  for (let i = 0; i < cleanStr.length; i++) {
    const digit = parseInt(cleanStr[i], 10);
    if (!isNaN(digit)) {
      sum += digit;
    }
  }
  return reduceToSingleDigit(sum);
}

function calculateNamank(name: string): number {
  // Chaldean Letter Values
  const chaldeanValues: Record<string, number> = {
    a: 1, i: 1, j: 1, q: 1, y: 1,
    b: 2, k: 2, r: 2,
    c: 3, g: 3, l: 3, s: 3,
    d: 4, m: 4, t: 4,
    e: 5, h: 5, n: 5, x: 5,
    u: 6, v: 6, w: 6,
    o: 7, z: 7,
    p: 8, f: 8
  };
  
  let sum = 0;
  const lowerName = name.toLowerCase();
  for (let i = 0; i < lowerName.length; i++) {
    const char = lowerName[i];
    if (chaldeanValues[char] !== undefined) {
      sum += chaldeanValues[char];
    }
  }
  return reduceToSingleDigit(sum);
}

// Astrological Database for programmatically computed profiles (Failback/Mock generator)
interface ProfileTemplate {
  planet: string;
  deity: string;
  gem: string;
  colors: string[];
  days: string[];
  luckyNums: number[];
  friendly: number[];
  neutral: number[];
  enemy: number[];
  remedy: string;
  personality: { summary: string; deep: string; strengths: string[]; challenges: string[]; tips: string[] };
  relationships: { summary: string; deep: string; strengths: string[]; challenges: string[]; tips: string[] };
  career: { summary: string; deep: string; strengths: string[]; challenges: string[]; tips: string[] };
  money: { summary: string; deep: string; strengths: string[]; challenges: string[]; tips: string[] };
  growth: { summary: string; deep: string; strengths: string[]; challenges: string[]; tips: string[] };
  health: { summary: string; deep: string; strengths: string[]; challenges: string[]; tips: string[] };
  purpose: { summary: string; deep: string; strengths: string[]; challenges: string[]; tips: string[] };
  potential: { summary: string; deep: string; strengths: string[]; challenges: string[]; tips: string[] };
}

const templates: Record<number, ProfileTemplate> = {
  1: {
    planet: "Sun (Surya)", deity: "Lord Rama / Lord Surya", gem: "Ruby (Manikya)",
    colors: ["Gold", "Orange", "Yellow", "Red"], days: ["Sunday", "Monday"], luckyNums: [1, 10, 19, 28],
    friendly: [1, 2, 3, 9], neutral: [5, 6], enemy: [4, 7, 8],
    remedy: "Offer water (Arghya) to the rising Sun daily and recite the Gayatri Mantra.",
    personality: {
      summary: "Inherent leaders, pioneering spirits, ambitious and fiercely independent.",
      deep: "As a Moolank 1 ruled by the Sun, you radiate warmth, authority, and creative life force. You naturally command respect and enjoy taking charge. You prefer creating your own paths rather than following others, and possess high determination. However, you must keep ego and impatience in check.",
      strengths: ["Strong leadership", "Pioneering spirit", "High confidence", "Self-reliance"],
      challenges: ["Authoritative nature", "Impatience with others", "Ego struggles", "Difficulty taking feedback"],
      tips: ["Practice humility daily", "Listen fully before deciding", "Collaborate rather than command"]
    },
    relationships: {
      summary: "Passionate partners who value loyalty but demand high mutual respect.",
      deep: "You look for strong, equal connections, but you need your independence respected. You protect your loved ones fiercely and express love through active encouragement. You vibe best with supportive numbers like 2, 3, and 9.",
      strengths: ["Deep loyalty", "Highly protective", "Encouraging partner"],
      challenges: ["Dominating tendencies", "Fearing vulnerability", "Expects constant validation"],
      tips: ["Let your partner take the lead sometimes", "Communicate your inner soft side openly"]
    },
    career: {
      summary: "Thrives in leadership, entrepreneurial, or high-initiative executive roles.",
      deep: "You are not suited to subordinate positions where your creativity is micro-managed. You shine in entrepreneurship, governmental authority, political roles, active management, or any sector requiring innovative foresight.",
      strengths: ["Visionary planning", "Decisive execution", "Inspires teams"],
      challenges: ["Stubbornness under pressure", "Dislike of repetitive tasks", "Friction with authority"],
      tips: ["Delegate minor details", "Build patience for slow, long-term regulatory pipelines"]
    },
    money: {
      summary: "Generous spenders with high earning capacity and affinity for luxury.",
      deep: "Money is a tool of empowerment and prestige for you. You are capable of attracting substantial wealth, but you are also prone to lavish spending on status-affirming items. You have a good appetite for calculated investment risks.",
      strengths: ["Wealth attraction", "Generous spirit", "Risk management"],
      challenges: ["Status-driven spending", "Impulsive investments", "Overconfidence in financial recoveries"],
      tips: ["Maintain a conservative emergency reserve", "Avoid speculative trading to feed excitement"]
    },
    growth: {
      summary: "Evolving past self-centered habits into empathetic stewardship.",
      deep: "Your growth pathway lies in recognizing that strength is not about dominating, but elevating others. Cultivating true empathy, active listening, and mental flexibility will unlock your highest cosmic evolution.",
      strengths: ["High resilience", "Driven to excel", "Purity of intention"],
      challenges: ["Rigidity of views", "Arrogance under stress", "Defensiveness"],
      tips: ["Start a daily meditation focusing on the heart chakra", "Accept that others can be right"]
    },
    health: {
      summary: "Prone to heart, eye, and high-energy burnout challenges.",
      deep: "You possess robust constitution, but you run hot. High stress can lead to heart rate elevation, blood pressure issues, and strain on the eyesight. Balance fire with cooling lifestyle choices.",
      strengths: ["High physical vitality", "Rapid healing", "Strong endurance"],
      challenges: ["Adrenal fatigue", "Overheating", "Cardiovascular strain"],
      tips: ["Stay hydrated with cooling herbs", "Incorporate relaxing walks in nature", "Avoid heavy, hot meals late at night"]
    },
    purpose: {
      summary: "To shine your unique light and empower humanity through visionary leadership.",
      deep: "Your cosmic blueprint is to become a guiding beacon. You are here to demonstrate courage, break old barriers, and build structures that inspire others to discover their own inner divinity.",
      strengths: ["Pure clarity of vision", "Unwavering resolve", "Transformational power"],
      challenges: ["Getting lost in superficial praise", "Fear of failure"],
      tips: ["Measure your success by how many leaders you create", "Dedicate your achievements to a higher purpose"]
    },
    potential: {
      summary: "A reservoir of creative brilliance, waiting for silent focus.",
      deep: "Beneath your active persona lies an extraordinary power of visualization and manifestation. When you quiet your busy mind, you can literally project and create complex realities with precision.",
      strengths: ["Intuitive visualization", "High energetic impact", "Magnetic charisma"],
      challenges: ["Scattering energy on too many projects", "Lack of follow-through"],
      tips: ["Focus intensely on one major vision at a time", "Write down your flashes of brilliance immediately"]
    }
  },
  2: {
    planet: "Moon (Chandra)", deity: "Lord Shiva / Goddess Parvati", gem: "Pearl (Moti)",
    colors: ["White", "Silver", "Cream", "Sea Green"], days: ["Monday", "Friday"], luckyNums: [2, 11, 20, 29],
    friendly: [1, 2, 3, 5], neutral: [6, 8, 9], enemy: [4, 7],
    remedy: "Keep a bowl of water near your bed at night and pour it on a plant in the morning. Fast on Mondays.",
    personality: {
      summary: "Gentle, highly intuitive, diplomatic, and deeply artistic peace-makers.",
      deep: "Ruled by the Moon, you are sensitive, empathetic, and highly cooperative. You have a natural gift for understanding others' emotions and are a superb mediator. However, your mood and energy can wax and wane like the tides, making emotional balance your primary life challenge.",
      strengths: ["Deep empathy", "Diplomatic skill", "Rich artistic imagination", "Gentle demeanor"],
      challenges: ["Over-sensitivity", "Mood fluctuations", "Lack of assertiveness", "Easily influenced"],
      tips: ["Set clear emotional boundaries", "Learn to say 'No' without guilt", "Engage in grounding routines"]
    },
    relationships: {
      summary: "Devoted, loving partners who seek deep emotional harmony.",
      deep: "You crave mutual trust and security in relationships. You love deeply and are extremely nurturing, but you can become dependent or easily hurt if your affection is not returned with equal emotional intensity.",
      strengths: ["Deeply supportive", "Excellent listener", "Highly romantic"],
      challenges: ["Fear of rejection", "Overthinking partner's signals", "Passive-aggressive reactions"],
      tips: ["Communicate your needs clearly", "Cultivate self-love independent of others' opinions"]
    },
    career: {
      summary: "Thrives in creative, counseling, research, or collaborative professions.",
      deep: "You excel where diplomacy, intuition, and creativity are valued. Highly suited to counseling, writing, performing arts, human resources, medicine, import-export of liquids, or working in partnership.",
      strengths: ["Excellent team worker", "Intuitive problem solver", "Empathetic communication"],
      challenges: ["Difficulty handling harsh criticism", "Reluctance to compete directly", "Anxiety over stability"],
      tips: ["Keep business decisions separate from personal emotions", "Partner with a strong executionist (Moolank 1 or 8)"]
    },
    money: {
      summary: "Fluctuating financial patterns, requiring cautious budgeting and stability.",
      deep: "Your relationship with wealth mirrors your emotional state. You can earn through creative endeavors or partnerships, but your spending can be impulsive during emotional highs or lows. Focus on systematic, non-emotional savings.",
      strengths: ["Attracts support easily", "Valuable ideas", "Good financial negotiation skills"],
      challenges: ["Financial anxiety", "Vague planning", "Lending money based on sentiment"],
      tips: ["Automate your monthly investments", "Consult professionals rather than relying purely on impulse"]
    },
    growth: {
      summary: "Building robust self-worth and mastering the emotional tides.",
      deep: "Your growth occurs as you anchor your emotions and build a solid center of self-confidence. Recognizing that you are whole on your own releases you from seeking constant outside validation.",
      strengths: ["Emotional intelligence", "Adaptability", "Spiritual inclination"],
      challenges: ["Self-doubt", "Worrying about future scenarios", "Vulnerability to harsh environments"],
      tips: ["Practice daily breathing exercises (Pranayama)", "Surround yourself with positive, grounding people"]
    },
    health: {
      summary: "Vulnerable to digestive issues, anxiety, and fluid imbalances.",
      deep: "Since you are closely linked to the water element and moon phases, you are sensitive to digestive disorders, chest congestion, cold-cough, and psychosomatic tension. Grounding is key.",
      strengths: ["Responsive nervous system", "Strong emotional recovery", "Graceful physical presence"],
      challenges: ["Anxiety-driven gut issues", "Fluid retention", "Frequent colds"],
      tips: ["Drink warm water and avoid heavy, damp foods", "Walk under moonlight on full moon nights", "Keep your feet warm and grounded"]
    },
    purpose: {
      summary: "To bring peace, emotional healing, and artistic beauty to the world.",
      deep: "Your soul is here to heal divides, teach empathy, and channel exquisite cosmic creativity. You are the gentle glue that holds families, groups, and projects together through your harmonizing vibration.",
      strengths: ["Natural peacemaker", "Channeller of beauty", "Deep intuition"],
      challenges: ["Sacrificing your own truth for superficial peace", "Hesitation to step into power"],
      tips: ["Express your deep feelings through art or journaling", "Trust that peaceful resolution often requires speaking uncomfortable truths"]
    },
    potential: {
      summary: "Unmatched intuitive and psychic capabilities.",
      deep: "You have an active third-eye energy. Your gut feelings, dreams, and sudden insights are highly accurate. When you learn to trust your inner compass completely, you can read rooms and predict trends effortlessly.",
      strengths: ["Lucid dreaming", "Telepathic sensitivity", "Rich symbolic understanding"],
      challenges: ["Absorbing negative energies from environments", "Overactive worry cycle"],
      tips: ["Shield your energy daily with white light meditation", "Write down your dreams every morning"]
    }
  },
  3: {
    planet: "Jupiter (Guru)", deity: "Lord Vishnu / Shiva", gem: "Yellow Sapphire (Pukhraj)",
    colors: ["Yellow", "Golden", "Saffron", "Pink"], days: ["Thursday", "Tuesday"], luckyNums: [3, 12, 21, 30],
    friendly: [1, 2, 3, 9], neutral: [5, 7], enemy: [4, 6, 8],
    remedy: "Wear yellow on Thursdays, honor teachers/elders, and offer chana dal to a temple.",
    personality: {
      summary: "Vibrant, creative, expressive, intellectual, and naturally lucky seekers.",
      deep: "Ruled by the guru planet Jupiter, you are highly intellectual, expressive, wise, and optimistic. You are a natural teacher, counselor, and creative enthusiast. You love gaining knowledge, traveling, and sharing philosophical or witty insights with others. Be mindful not to get too preachy or over-ambitious.",
      strengths: ["Optimism", "High intellect", "Expressive creativity", "Warm charisma"],
      challenges: ["Over-expansion", "Scattering energies", "Impatient with trivialities", "Extravagance"],
      tips: ["Set realistic daily targets", "Finish what you start before moving on", "Avoid lecturing those who didn't ask"]
    },
    relationships: {
      summary: "Intellectual companions who seek joy, growth, and rich sharing.",
      deep: "In relationships, you require mental compatibility and open communication. You enjoy sharing deep philosophical discussions, traveling together, and encouraging your partner's growth. You can occasionally be too blunt or demand too much space.",
      strengths: ["Inspirational partner", "Highly generous", "Joyful outlook"],
      challenges: ["Fear of being restricted", "Unrealistic standards", "Can be intellectually dismissive"],
      tips: ["Appreciate small, quiet moments of silence together", "Give your partner space to disagree without debating"]
    },
    career: {
      summary: "Succeeds in teaching, lecturing, law, counseling, or creative arts.",
      deep: "Your stellar communication and wisdom make you an amazing teacher, lawyer, author, public speaker, religious leader, financial advisor, or creative professional. You thrive in roles that involve expansion and learning.",
      strengths: ["Intellectual authority", "Inspirational voice", "Master organizer of ideas"],
      challenges: ["Boredom with routine chores", "Over-committing to multiple tasks", "Dislike of subordinate setups"],
      tips: ["Use structured planners to keep project timelines real", "Focus on single major publications or teachings"]
    },
    money: {
      summary: "Highly abundant, with occasional reckless extravagance or high risk.",
      deep: "Jupiter brings positive luck with resources. You have a high capacity to generate wealth because of your vast knowledge base. However, you can be highly extravagant or invest with blind optimism. Plan with safety rails.",
      strengths: ["Natural prosperity flow", "High earning intellect", "Generous giver"],
      challenges: ["Wasting money on grand schemes", "Neglecting small expenses", "Overconfidence in luck"],
      tips: ["Separate your speculative investments from core retirement assets", "Work with structured accountants"]
    },
    growth: {
      summary: "Focusing scattered knowledge into unified, humble wisdom.",
      deep: "Your expansion relies on grounding your grand visions. When you combine your high intellect with emotional humility and consistent daily follow-through, you evolve into a master of your domain.",
      strengths: ["Continuous learner", "High ethical framework", "Inspirational"],
      challenges: ["Arrogance of knowledge", "Restlessness", "Stretching your limits too thin"],
      tips: ["Practice silence (Mauna) for 1 hour daily", "Learn skills that require highly structured hands-on patience"]
    },
    health: {
      summary: "Prone to liver issues, weight gain, and nervous exhaustion.",
      deep: "Jupiter rules the liver, arterial circulation, and hips. You are prone to excessive fat accumulation, diabetes, cholesterol issues, and throat/respiratory sensitivities. Keep a light diet and exercise consistently.",
      strengths: ["Generally strong recovery", "High vital energy", "Healthy respiratory base"],
      challenges: ["Over-indulgence in sweets or rich food", "Liver congestion", "Stress on the nervous system"],
      tips: ["Incorporate bitter herbs and turmeric into your diet", "Avoid late night sugary snacks", "Regular walking or active yoga is essential"]
    },
    purpose: {
      summary: "To expand human consciousness through wisdom, teaching, and joy.",
      deep: "You are here to lift others up, clear darkness through knowledge, and spread divine wisdom. Your voice and mind are meant to illuminate paths, inspire seeker spirits, and promote optimistic values.",
      strengths: ["Illuminating wisdom", "Charismatic mentorship", "Broad mindset"],
      challenges: ["Slipping into dogmatic behavior", "Becoming cynical when expectations are dashed"],
      tips: ["Share your wisdom through writing, podcasts, or active classes", "Remember that a true guru learns from everything"]
    },
    potential: {
      summary: "Manifesting abundance and divine protection.",
      deep: "You possess a powerful 'Jupiterian protective shield.' Often, in crises, you are saved at the very last moment. Your capacity to formulate progressive ideas is immense. When aligned, your positive intent acts as a physical magnet for prosperity.",
      strengths: ["Powerful positive manifestation", "Broad cosmic perspective", "Natural fortune"],
      challenges: ["Relying too much on 'good luck' without hard work", "Arrogance"],
      tips: ["Pair your optimistic visions with concrete action items", "Be grateful for everyday small miracles"]
    }
  },
  // We can populate basic generic template profiles for 4,5,6,7,8,9 as well so the fallback is complete.
  4: {
    planet: "Rahu (North Node)", deity: "Lord Ganesha / Goddess Durga", gem: "Hessonite (Gomed)",
    colors: ["Blue", "Grey", "Black", "Brown"], days: ["Saturday", "Wednesday"], luckyNums: [4, 13, 22],
    friendly: [5, 6, 8], neutral: [7, 3], enemy: [1, 2, 9],
    remedy: "Keep a silver coin in your pocket. Feed black stray dogs on Saturdays.",
    personality: {
      summary: "Analytical, revolutionary, highly organized, and uniquely unconventional.",
      deep: "Ruled by Rahu, you are a deep thinker who views the world through a completely unique lens. You challenge conventions and love breaking outdated paradigms. You are highly organized, logical, and hardworking, though you often feel misunderstood and face sudden shifts in life.",
      strengths: ["Original thinker", "Highly organized", "Strong work ethic", "Resilient"],
      challenges: ["Feeling isolated", "Prone to sudden anger", "Highly skeptical", "Restless mind"],
      tips: ["Practice grounding meditation", "Avoid arguments over minor details", "Cultivate flexibility"]
    },
    relationships: {
      summary: "Intense, unconventional connections requiring high mental compatibility.",
      deep: "You seek unique partnerships where you can share intellectual depth. You are loyal but can be unpredictable or argumentative. You vibe best with understanding numbers who respect your rebellious nature.",
      strengths: ["Unique loyalty", "Highly protective", "Deep thinker"],
      challenges: ["Argumentative attitude", "Fear of betrayal", "Emotional distance"],
      tips: ["Express appreciation gently", "Avoid overanalyzing your partner's words"]
    },
    career: {
      summary: "Excels in technology, research, architecture, law, or alternative sciences.",
      deep: "You are a natural problem-solver. You shine in software development, research fields, engineering, journalism, activism, or consulting where out-of-the-box thinking is crucial.",
      strengths: ["Brilliant troubleshooter", "Attention to system structures", "Unconventional ideas"],
      challenges: ["Sudden job changes", "Friction with conservative bosses", "Overworking"],
      tips: ["Take regular breaks from digital screens", "Focus on long-term project stability"]
    },
    money: {
      summary: "Unpredictable wealth flows with sudden gains and unexpected expenses.",
      deep: "Rahu brings suddenness. You may experience dramatic financial windfalls followed by abrupt outlays. Creating high-quality security systems and avoiding speculative, quick-rich schemes is vital for your financial peace.",
      strengths: ["Sudden massive opportunities", "Resourcefulness", "Sharp business tactics"],
      challenges: ["Impulsive spec trading", "Hidden expenses", "Anxiety over future security"],
      tips: ["Stick to traditional, secure long-term investments", "Have strict monthly budget limits"]
    },
    growth: {
      summary: "Transforming restlessness into master-builder capability.",
      deep: "Your growth occurs when you channel your intense mental electricity into organized, physical output. Overcoming skepticism and building faith in divine timing releases you from inner friction.",
      strengths: ["Highly structured", "Persistent", "Unconventional wisdom"],
      challenges: ["Chronic doubt", "Rebelliousness for its own sake", "Secretiveness"],
      tips: ["Start a daily yoga or pranayama practice", "Practice forgiveness of past regrets"]
    },
    health: {
      summary: "Prone to nervous system sensitivities, skin issues, and mental anxiety.",
      deep: "You have a highly active nervous system. Under stress, you can suffer from insomnia, chronic gas or bloating, physical restlessness, or minor skin sensitivities. Grounding nutrition is essential.",
      strengths: ["Strong muscular endurance", "Quick reflexes", "High mental alerts"],
      challenges: ["Insomnia", "Anxiety", "Difficult-to-diagnose symptoms"],
      tips: ["Establish a fixed, soothing sleeping routine", "Massage your feet with sesame oil at night", "Minimize processed stimulants"]
    },
    purpose: {
      summary: "To bring revolutionary reform, unique order, and systemic change.",
      deep: "You are here to pave the way for the future. Your purpose is to challenge the status quo, build secure systems where there is chaos, and demonstrate resilience under intense trials.",
      strengths: ["System builder", "Social reformer", "Relentless execution"],
      challenges: ["Cynicism", "Feeling perpetually alienated"],
      tips: ["Dedicate your engineering or creative talents to public benefit", "Celebrate minor local wins"]
    },
    potential: {
      summary: "Mastery over technology, structures, and alternative logic.",
      deep: "Your mind can grasp highly complex patterns and system codes that others miss. You have a profound potential for technical invention, deep coding, and master architectural planning.",
      strengths: ["Macro logic comprehension", "Unconventional foresight", "Extreme focus"],
      challenges: ["Mental exhaustion", "Hyper-fixation"],
      tips: ["Practice silent offline retreats once in a while", "Delegate execution tasks early"]
    }
  },
  5: {
    planet: "Mercury (Budha)", deity: "Lord Vishnu / Budha", gem: "Emerald (Panna)",
    colors: ["Green", "Light Green", "Turquoise", "Grey"], days: ["Wednesday", "Friday"], luckyNums: [5, 14, 23],
    friendly: [1, 2, 4, 6, 8], neutral: [3, 7, 9], enemy: [],
    remedy: "Feed green grass or spinach to cows on Wednesdays. Help students or donate books.",
    personality: {
      summary: "Versatile, highly communicative, rapid learners with a stellar business mind.",
      deep: "Ruled by Mercury, the messenger of gods, you are lively, highly adaptable, quick-witted, and an exceptional communicator. You hate stagnation and love travel, networking, and dynamic change. Your mind is constantly active with new ideas and commercial possibilities.",
      strengths: ["Superb communication", "Business acumen", "Extreme adaptability", "Youthful energy"],
      challenges: ["Easily bored", "Nervous restlessness", "Inability to commit to slow routines", "Superficiality"],
      tips: ["Incorporate deep-breathing exercises", "Limit multitasking to 2 things", "Develop persistence"]
    },
    relationships: {
      summary: "Lively, sociable partners who value wit, mental agility, and freedom.",
      deep: "You love meeting new people and thrive in relationships built on friendship and witty conversation. You need a partner who can match your quick intellect and keep life interesting. You are highly charming but can sometimes struggle with deep, heavy emotional commitments.",
      strengths: ["Charming conversationalist", "Fun-loving", "Flexible"],
      challenges: ["Restlessness", "Avid flirtatiousness", "Avoiding heavy conversations"],
      tips: ["Learn to sit with your and your partner's deep feelings", "Commit to regular high-quality quality time"]
    },
    career: {
      summary: "Thrives in sales, marketing, journalism, trading, or public relations.",
      deep: "You excel where speech, writing, calculation, and rapid transaction are needed. Phenomenally suited to trading, brokerage, tech ventures, marketing, public speaking, writing, or traveling assignments.",
      strengths: ["Persuasive negotiator", "Rapid networking", "Strategic marketing minds"],
      challenges: ["Boredom with static desk jobs", "Slipping details", "Impatience with slow learners"],
      tips: ["Automate recurring tasks", "Collaborate with structured managers for delivery verification"]
    },
    money: {
      summary: "Excellent financial acumen, highly skilled in multiple income streams.",
      deep: "Mercury rules trade, and you have an innate talent for financial dealing. You can easily spot wealth-generation trends and often enjoy building multiple parallel streams of income. However, keep a check on speculative trading.",
      strengths: ["Commercial vision", "Attracting money easily", "Quick recovery from loss"],
      challenges: ["Impulsive stock trading", "Unplanned travel costs", "Scattering investments"],
      tips: ["Keep a locked long-term retirement account", "Invest in solid knowledge assets"]
    },
    growth: {
      summary: "Anchoring your rapid intellect and cultivating mental stillness.",
      deep: "Your evolution is directly tied to mastering your mental speeds. When you learn to sit silently, focus on one path, and finish deep intellectual systems, your potential becomes infinite.",
      strengths: ["Highly versatile", "Open-minded", "Joyful learning spirit"],
      challenges: ["Mental dispersion", "Fidgety behavior", "Avoiding deep commitments"],
      tips: ["Spend time in quiet forests or gardens daily", "Practice writing long-form books or programs"]
    },
    health: {
      summary: "Vulnerable to nervous stress, sleep difficulties, and respiratory fatigue.",
      deep: "Mercury rules the nervous system, brain, and vocal cords. You can exhaust your adrenal systems through constant mental activity and lack of rest. Ensure consistent sleep hygiene.",
      strengths: ["Highly active physical energy", "Youthful cellular recovery", "Excellent voice base"],
      challenges: ["Insomnia", "Adrenal burnout", "Nervous tics or tremors"],
      tips: ["Unplug all digital devices 1 hour before bed", "Consume grounding foods like warm milk, grains, and root veggies", "Practice slow, rhythmic breathing"]
    },
    purpose: {
      summary: "To bridge divides, communicate high wisdom, and spark joyful commerce.",
      deep: "Your cosmic goal is to serve as a catalyst. You are here to bring people together, share knowledge in highly engaging ways, and stimulate dynamic exchanges of ideas, resources, and joy.",
      strengths: ["Master connector", "Inspiring public face", "Intellectual translator"],
      challenges: ["Getting caught in gossip", "Chasing shallow trends"],
      tips: ["Write, publish, or speak extensively", "Use your network to promote ethical causes"]
    },
    potential: {
      summary: "Infinite adaptability and strategic commercial foresight.",
      deep: "You can learn any system or language in record time. Your mind operates like a highly optimized computer processing data speeds. When focused, you can strategize massive campaigns with ease.",
      strengths: ["Rapid comprehension", "Superb negotiation instinct", "High strategic wit"],
      challenges: ["Over-thinking scenarios", "Losing interest halfway"],
      tips: ["Take notes on your rapid ideas", "Partner with deep, slow implementers (Number 8 or 4)"]
    }
  },
  6: {
    planet: "Venus (Shukra)", deity: "Goddess Lakshmi / Lord Kartikeya", gem: "Diamond (Heera)",
    colors: ["Pink", "White", "Light Blue", "Cream"], days: ["Friday", "Wednesday"], luckyNums: [6, 15, 24],
    friendly: [5, 8, 9], neutral: [1, 2, 3, 7], enemy: [4],
    remedy: "Be respectful to your spouse/women. Donate white items (rice, sugar, milk) on Fridays.",
    personality: {
      summary: "Charming, artistic, nurturing, magnetic, and deeply aesthetic souls.",
      deep: "Ruled by Venus, you possess deep charisma, a highly refined aesthetic sense, and a loving, nurturing disposition. You love harmony, beautiful surroundings, and luxury. You are incredibly loyal to family and friends, but can be highly stubborn or overly protective at times.",
      strengths: ["Magnetic charm", "Aesthetic refined taste", "Nurturing empathy", "Artistic talents"],
      challenges: ["Stubbornness", "Materialistic attachment", "Sacrificing yourself for others' comfort", "Avoiding conflicts"],
      tips: ["Practice saying no", "Create beautiful art without expecting commercial validation", "Set realistic expectations for others"]
    },
    relationships: {
      summary: "Devoted, romantic, and highly family-oriented companions.",
      deep: "You are the ultimate partner, offering unparalleled warmth, luxury, and care. You dream of a beautiful, peaceful home filled with laughter. However, your high expectations can make you overcritical of your partner's minor habits.",
      strengths: ["Deep romance", "Unrivaled support", "Family-centric care"],
      challenges: ["Possessiveness", "Over-dependency on partner's approval", "Suppressed resentment"],
      tips: ["Give your partner room to make mistakes", "Settle differences with calm, honest dialogues instead of silent treatments"]
    },
    career: {
      summary: "Excels in fashion, interior design, luxury retail, hospitality, or performing arts.",
      deep: "Your natural sense of style, beauty, and public warmth makes you amazing in luxury industries, film/theater, jewelry design, hospitality, interior decoration, wellness or counseling, and culinary arts.",
      strengths: ["Exquisite presentation", "Magnetic public relations", "Creative eye"],
      challenges: ["Difficulty in harsh, competitive dry setups", "Financial wastage on visual office assets", "Dislike of conflicts"],
      tips: ["Focus on creating visual-heavy products or setups", "Work in harmonious, beautiful environments"]
    },
    money: {
      summary: "Attracts financial comfort and luxury easily, prone to premium spending.",
      deep: "Venus represents luxury. You are blessed with an innate ability to attract comfort and wealth. You enjoy spending money on premium luxury items, fashion, home decor, and fine dining. Ensuring a balanced budget saves you from cash flow strain.",
      strengths: ["Financial manifestation", "Appreciation of value", "Excellent asset preservation"],
      challenges: ["Indulgence spending", "Buying things for social prestige", "Lending to support friends' luxuries"],
      tips: ["Establish a strict budget for designer purchases", "Consult neutral financial planners before large outlays"]
    },
    growth: {
      summary: "Transcending outward attachment to find beautiful inner harmony.",
      deep: "Your growth occurs when you direct your loving care inward and cultivate a deep, independent self-worth. Evolving past superficial appearances and emotional codependency unlocks your magnificent wisdom.",
      strengths: ["Deep compassion", "Harmonious creator", "Unconditional support"],
      challenges: ["Approval seeking", "Fear of visual aging", "Rigid expectations"],
      tips: ["Engage in silent, introspective spiritual practices", "Pamper your mind as much as your body"]
    },
    health: {
      summary: "Prone to throat, kidney, and sugar/metabolic imbalances.",
      deep: "Venus rules the kidneys, throat, skin, and reproductive organs. You are prone to thyroid sensitivities, throat infections, sugar imbalances, and skin reactions. Moderation in sweets and rich foods is highly advised.",
      strengths: ["Beautiful skin constitution", "Graceful physical alignment", "Good muscular ease"],
      challenges: ["Metabolic congestion", "Excess water retention", "Sore throat issues"],
      tips: ["Drink plenty of structured pure water", "Limit high-glycemic treats", "Incorporate daily lymphatic massage"]
    },
    purpose: {
      summary: "To establish harmony, aesthetic beauty, and deep unconditional love.",
      deep: "You are here to heal the world through beauty and nurture. Your purpose is to build loving spaces, guide others with your magnetic warmth, and remind humanity of the divine light in creativity and connection.",
      strengths: ["Illuminating harmony", "Creative beauty channels", "Empathetic teaching"],
      challenges: ["Over-protectiveness", "Sinking into physical vanity"],
      tips: ["Mentor younger artists or creators", "Volunteer in community healing or decoration projects"]
    },
    potential: {
      summary: "Magnificent visual creation and community magnet powers.",
      deep: "You have a divine gift of 'Sringar' – the ability to elevate the aesthetic and vibrational energy of any place or person. Your home and office can literally soothe people's souls through their harmonious setting.",
      strengths: ["Visual spatial mastery", "Incredible magnetic charm", "Natural hospitality talent"],
      challenges: ["Fear of chaotic setups", "Sensory overload"],
      tips: ["Keep your immediate bedroom completely decluttered and peaceful", "Infuse your projects with soft, natural fragrances"]
    }
  },
  7: {
    planet: "Ketu (South Node)", deity: "Lord Shiva / Lord Ganesha", gem: "Cat's Eye (Lahsuniya)",
    colors: ["Light Yellow", "White", "Pastel Grey", "Brown"], days: ["Thursday", "Monday"], luckyNums: [7, 16, 25],
    friendly: [1, 2, 3, 5], neutral: [6, 9], enemy: [4, 8],
    remedy: "Feed stray dogs on Thursdays. Practice silent introspective yoga. Help the physically challenged.",
    personality: {
      summary: "Philosophical, highly intuitive, spiritual, deep researchers and independent thinkers.",
      deep: "Ruled by Ketu, the planet of liberation, you are a spiritual seeker, analytical researcher, and a quiet observer. You have deep intuition, rich dreams, and a dislike for superficiality. You love solving complex mysteries and spending time in solitude, though you are prone to overthinking, detachment, or anxiety.",
      strengths: ["Profound intuition", "Analytical genius", "Spiritual wisdom", "Independent nature"],
      challenges: ["Solitude bordering on isolation", "Chronic anxiety", "Skepticism", "Difficulty expressing feelings"],
      tips: ["Stay connected with friends", "Ground your active mind through physical walks", "Write down your spiritual insights"]
    },
    relationships: {
      summary: "Deep, quiet unions based on soul connection rather than social show.",
      deep: "You look for deep spiritual and mental bonds in relationships. You are fiercely loyal and protective, but you require silent spaces and respect for your privacy. You can occasionally appear distant, cold, or hard to read.",
      strengths: ["Unmatched soul support", "Extremely loyal", "Non-judgmental"],
      challenges: ["Emotional withdrawal", "Overthinking your partner's intentions", "Difficulty communicating affection"],
      tips: ["Express your love through simple, warm physical gestures", "Explain your need for solitude so your partner doesn't feel rejected"]
    },
    career: {
      summary: "Excels in scientific research, philosophy, occult sciences, coding, or teaching.",
      deep: "You are brilliant in roles that require deep solo analysis, coding, spiritual teaching, psychology, writing, scientific research, metaphysics, or alternative healing practices.",
      strengths: ["Penetrative focus", "Uncover hidden truths", "Intuitive troubleshooting"],
      challenges: ["Dislike of superficial corporate politics", "Exhaustion in loud environments", "Reluctance to market yourself"],
      tips: ["Take a specialized niche where your deep knowledge is irreplaceable", "Work in quiet, spacious research labs"]
    },
    money: {
      summary: "Detached financial patterns, wealth comes as a byproduct of expertise.",
      deep: "You are inherently detached from materialistic shows. Money comes to you through your specialized knowledge, books, patents, or spiritual work, but you are prone to ignoring your finances or giving resources away too easily.",
      strengths: ["Lack of greed", "Resourceful minimum needs", "Sudden intellectual wealth flow"],
      challenges: ["Neglecting accounting", "Unplanned spending on books or research", "Vulnerability to scams"],
      tips: ["Hire trusted specialists to manage your tax/investments", "Develop structured tracking of bank assets"]
    },
    growth: {
      summary: "Translating silent spiritual downloads into practical human love.",
      deep: "Your path is to bridge heaven and earth. Rather than withdrawing from life's chaotic events, your true growth lies in remaining peaceful, sharing your deep insights, and healing others through your serene vibration.",
      strengths: ["True detachment", "Vast inner wisdom", "Prophetic intuition"],
      challenges: ["Depressive isolation", "Hyper-critical skepticism", "Cynicism"],
      tips: ["Keep a daily gratitude journal", "Practice heart-centered compassion meditations"]
    },
    health: {
      summary: "Prone to nervous tension, sleeplessness, and skin sensitivities.",
      deep: "Ketu rules the brain, nervous system, and fine energy channels. You can suffer from mental over-exhaustion, sleep disturbances, allergies, or unexplained muscle stiffness. Rhythmic, slow somatic movement is highly healing.",
      strengths: ["Strong mental resilience", "Intuitive self-healing", "Low toxin accumulation"],
      challenges: ["Overactive sleep mind", "Allergies", "Tension headaches"],
      tips: ["Practice yoga nidra or guided sound baths", "Apply lavender oil to temples before bed", "Consume clean, organic, unprocessed meals"]
    },
    purpose: {
      summary: "To serve as an intuitive guide, research master, and spiritual anchor.",
      deep: "Your soul took birth to seek and express absolute Truth. You are here to look beneath the surface of things, demystify life's secrets, and guide others with your quiet, spiritual depth.",
      strengths: ["Mystical comprehension", "Penetrative research", "Calm presence"],
      challenges: ["Becoming too detached to care about daily worldly duties"],
      tips: ["Share your philosophical findings through books, code, or classes", "Establish simple, grounding daily duties"]
    },
    potential: {
      summary: "Preternatural dream insights and deep coding/logic capacities.",
      deep: "Your dream life is a portal for cosmic messages. Your mind is like an antenna receiving high-frequency insights. When quiet, you can decode ancient systems, solve hard mathematics, or write deep, elegant algorithms.",
      strengths: ["Prophetic dreams", "Laser research comprehension", "Spiritual manifestation"],
      challenges: ["Sensory overload in malls or crowds"],
      tips: ["Keep a notebook directly next to your bed", "Take solo walks in pure, natural environments"]
    }
  },
  8: {
    planet: "Saturn (Shani)", deity: "Lord Hanuman / Lord Shiva", gem: "Blue Sapphire (Neelam)",
    colors: ["Dark Blue", "Black", "Dark Grey", "Purple"], days: ["Saturday", "Wednesday"], luckyNums: [8, 17, 26],
    friendly: [5, 6], neutral: [3, 7], enemy: [1, 2, 4, 9],
    remedy: "Feed crows on Saturdays. Be fair to laborers. Recite Shani Chalisa and light a mustard oil lamp under a Peepal tree.",
    personality: {
      summary: "Highly disciplined, hardworking, patient, mature, and philosophical builders.",
      deep: "Ruled by Saturn, you are a soul built for durability, discipline, and profound long-term achievements. You often face challenges or struggle early in life, which builds unmatched strength, wisdom, and character. You are highly organized, realistic, and protective of your duties. Avoid skepticism or holding grudges.",
      strengths: ["Unyielding persistence", "Maturity", "Deep responsibility", "Philosophical realism"],
      challenges: ["Early delays", "Skeptical or pessimistic outlook", "Rigid self-criticism", "Workaholism"],
      tips: ["Celebrate minor achievements", "Develop lighthearted hobbies", "Avoid taking life's struggles too personally"]
    },
    relationships: {
      summary: "Rock-solid, highly dependable, and profoundly loyal companions.",
      deep: "You do not open up easily, but when you commit, it is for a lifetime. You show love through solid actions, protection, and duty rather than poetic words. You need a partner who understands your quiet strength and values your integrity.",
      strengths: ["Unshakeable loyalty", "Protective shield", "Deep emotional depth"],
      challenges: ["Difficulty expressing romantic feelings", "Slipping into parenting roles", "Pessimistic testing of partner's trust"],
      tips: ["Surprise your partner with playful, unplanned gifts", "Communicate words of appreciation daily"]
    },
    career: {
      summary: "Succeeds in long-term engineering, heavy industry, law, politics, or corporate leadership.",
      deep: "You are the ultimate executor of long-term systems. Highly suited to law, civil service, construction/real estate, heavy machinery, research, corporate organization, or social structures that require high integrity and endurance.",
      strengths: ["Long-term stamina", "High administrative skills", "Ethical leadership style"],
      challenges: ["Delays in promotions", "Over-burdening yourself with duties", "Friction with rapid, shallow setups"],
      tips: ["Stay patient; your golden period begins after age 35", "Delegate execution tasks to maintain physical energy"]
    },
    money: {
      summary: "Slow, systematic wealth building leading to massive stable abundance.",
      deep: "Saturn builds slow, secure foundations. Your early years may feature financial lessons or tight budgets, but your systematic savings and hard-earned business tactics ensure massive, unshakeable wealth and land holdings in later life.",
      strengths: ["Excellent asset building", "Conservative budget mastery", "Frugal resilience"],
      challenges: ["Extreme fear of poverty", "Hesitation to enjoy your own wealth", "Over-cautious investments"],
      tips: ["Indulge in comforts you have earned", "Invest in reliable blue-chip assets early"]
    },
    growth: {
      summary: "Evolving past bitter memories into warm, wise stewardship.",
      deep: "Your master blueprint is of the 'Wise Elder.' As you let go of old hurts, celebrate the flow of life, and practice lighter joy, you naturally radiate an inspirational authority that guides thousands.",
      strengths: ["Extreme integrity", "Spiritual maturity", "Relentless patience"],
      challenges: ["Resentment", "Emotional coldness", "Stubborn rigidity"],
      tips: ["Incorporate laughter therapy or comedy clubs", "Mentor younger souls with encouraging warmth"]
    },
    health: {
      summary: "Vulnerable to joint, bone, teeth, and chronic digestive sensitivities.",
      deep: "Saturn rules the bones, joints, teeth, knees, and structural systems. You are prone to joint pain, calcium variations, digestive delay, or minor skin dryness. Consistent stretching is vital.",
      strengths: ["Highly durable skeletal base", "Endurance capacity", "Resilience under pain"],
      challenges: ["Joint stiffness", "Digestive sluggishness", "Calf/ankle fatigue"],
      tips: ["Incorporate daily warm oil joint massage", "Maintain adequate calcium and vitamin D", "Consume easily digestible, warm cooked food"]
    },
    purpose: {
      summary: "To build secure, ethical, and long-lasting foundations for society.",
      deep: "Your life is a masterclass in resilience and justice. Your purpose is to set a high standard of duty, manifest structural order in chaotic systems, and serve as a reliable, protective pillar for many.",
      strengths: ["Integrity guidance", "Massive systemic impact", "Durable creation"],
      challenges: ["Pessimistic stagnation"],
      tips: ["Write down your master plans for the next 10 years", "Engage actively in charity for elderly or labor groups"]
    },
    potential: {
      summary: "Profound cosmic wisdom and unshakeable project focus.",
      deep: "You have a stellar capability to work with immense data, execute heavy-duty physical operations, or anchor complex projects over decades. Your quiet focus can pierce through any temporary distraction.",
      strengths: ["Durable focus capacity", "Absolute reliable timing", "Spiritual grit"],
      challenges: ["Mental fatigue under heavy duties"],
      tips: ["Cultivate a lighthearted creative hobby", "Take structured weekends off"]
    }
  },
  9: {
    planet: "Mars (Mangal)", deity: "Lord Hanuman / Lord Kartikeya", gem: "Red Coral (Moonga)",
    colors: ["Red", "Bright Red", "Orange", "White"], days: ["Tuesday", "Friday"], luckyNums: [9, 18, 27],
    friendly: [1, 2, 3, 6], neutral: [5, 7], enemy: [4, 8],
    remedy: "Chant Hanuman Chalisa. Help your siblings and donate blood. Wear red on Tuesdays.",
    personality: {
      summary: "Courageous, highly energetic, protective, humanitarian, and natural warriors.",
      deep: "Ruled by Mars, you are a dynamo of pure energy, bravery, and action. You are deeply patriotic, humanitarian, and protective of the weak. You prefer direct solutions and possess immense courage. Your primary challenge is to redirect your fiery anger and impatience into constructive pathways.",
      strengths: ["Exceptional courage", "Protective heart", "High vital energy", "Action-oriented leadership"],
      challenges: ["Short temper", "Impatience", "Prone to minor accidents", "Rigid opinionated nature"],
      tips: ["Engage in active physical sports", "Count to 10 before reacting to stress", "Channel energy into selfless service"]
    },
    relationships: {
      summary: "Passionate, protective, and intensely loyal partners.",
      deep: "You love with absolute passion and protect your partner with fierce devotion. You are direct and expect absolute honesty and energetic response. However, your short temper or demanding nature can cause minor ego clashes.",
      strengths: ["Fierce protection", "Intense passion", "Absolute honesty"],
      challenges: ["Dominating behavior", "Impulsive arguments", "High expectations of active response"],
      tips: ["Practice gentle words of appreciation", "Give your partner space to cool down during friction"]
    },
    career: {
      summary: "Succeeds in army, police, sports, engineering, fire services, or surgery.",
      deep: "Your high energy, bravery, and commanding nature make you amazing in military or law enforcement, athletic sports, surgical medicine, mechanical engineering, real estate development, or fire-safety services.",
      strengths: ["Commanding presence", "Fearless execution under crisis", "Physical dynamism"],
      challenges: ["Friction with restrictive rules", "Impulsive decisions", "Impatient communication"],
      tips: ["Develop high strategic foresight before launch", "Seek advisory partners who are calm and grounded"]
    },
    money: {
      summary: "Dynamic financial flows, capable of attracting wealth through high initiative.",
      deep: "Money comes to you through active ventures, land, and pioneering projects. You are highly generous and prone to spending impulsively to support siblings or direct friends in need. Build stable financial guards.",
      strengths: ["High wealth-generation drive", "Real estate affinity", "Generous supportive spending"],
      challenges: ["Lending money on impulsive promise", "Unplanned luxury spending", "Speculative risks"],
      tips: ["Secure your assets in real estate and gold", "Avoid signing guarantees for friends under high impulse"]
    },
    growth: {
      summary: "Transforming fire into a peaceful spiritual light of service.",
      deep: "Your ultimate growth lies in shifting your warrior spirit from outward fight to inner self-mastery. When you champion spiritual or charitable causes with your high energy, you evolve into a savior figure.",
      strengths: ["Dynamic selflessness", "Protective guardian", "Immense resilience"],
      challenges: ["Fiery impulsiveness", "Aggressive reaction to friction"],
      tips: ["Engage in cooling daily meditation or pranayama", "Volunteer in active disaster relief or support camps"]
    },
    health: {
      summary: "Vulnerable to high blood pressure, cuts, bruises, and inflammatory issues.",
      deep: "Mars rules the blood, muscles, and head. You are prone to high body temperature, blood pressure variations, minor physical cuts, bruises, or muscle sprains. Stay hydrated and calm.",
      strengths: ["Exceptional muscle recovery", "High stamina", "Strong structural immunity"],
      challenges: ["Cuts and physical bruises", "Inflammatory reactions", "Acidity"],
      tips: ["Avoid highly spicy, hot fried food", "Incorporate coconut water and fresh melons", "Take sufficient cooling breaks"]
    },
    purpose: {
      summary: "To champion causes, protect the vulnerable, and lead with courage.",
      deep: "You are here to fight for righteousness and build courage in others. Your soul took birth to dismantle oppression, lead active transformation, and protect the weak with your magnificent power.",
      strengths: ["Fearless protection", "Dynamic transformation guide", "Humanitarian action"],
      challenges: ["Getting caught in minor personal fights"],
      tips: ["Support social welfare or clean green energy initiatives", "Write or speak to boost community hope"]
    },
    potential: {
      summary: "Incredible physical manifestation and strategic athletic command.",
      deep: "Your energy can move physical or organizational structures with record speed. You possess a unique 'crisis survival instinct' that keeps you totally clear and sharp during extreme pressure conditions.",
      strengths: ["Crisis leadership master", "High athletic capacity", "Action manifestation"],
      challenges: ["Scattering fuel on minor irritants"],
      tips: ["Focus your fiery force on your primary life dreams", "Keep a humble, silent daily workout ritual"]
    }
  }
};

// GET reading endpoint
app.post("/api/moolank/reading", async (req, res) => {
  try {
    const { name, dob, gender, focusArea, language } = req.body;
    if (!name || !dob) {
      return res.status(400).json({ error: "Name and Date of Birth (dob) are required." });
    }

    const moolank = calculateMoolank(dob);
    const bhagyank = calculateBhagyank(dob);
    const namank = calculateNamank(name);

    console.log(`Calculating report for Name: ${name}, DOB: ${dob}. Moolank: ${moolank}, Bhagyank: ${bhagyank}, Namank: ${namank}`);

    const hasApiKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY" && process.env.GEMINI_API_KEY.trim() !== "";
    
    let reportData;
    let isFallback = false;
    let fallbackReason = "";

    if (hasApiKey) {
      console.log("GEMINI_API_KEY is active. Requesting AI-Powered Self Discovery report...");
      const ai = getAiClient();
      
      const prompt = `
        Perform a deeply personalized, authentic, and sophisticated Vedic Numerology (Moolank & Bhagyank) self-discovery reading.
        User Details:
        - Name: ${name}
        - Date of Birth: ${dob} (Moolank calculated as ${moolank}, Bhagyank calculated as ${bhagyank}, Chaldean Namank calculated as ${namank})
        - Gender: ${gender || "Not specified"}
        - Current Primary Life Focus: ${focusArea || "Overall Balance"}
        ${language === "hinglish" ? "\n- Language: Hinglish (Hindi + English Mix, written in standard Latin/Roman script. e.g. 'Aapka Moolank 1 hai, iska matlab aap born leader hain. Lekin dhyan rakhein thoda patience rakhiye.'). Please write all text fields, summaries, deep insights, gemstone explanations, remedies, and actionable tips in highly conversational and engaging Hinglish using Roman script. Do NOT use Devnagari script." : ""}

        Calculate details and write high-quality, personalized readings for each of the 8 categories. Make the readings look extremely authentic, wise, encouraging, and rich (do not write generic templates). Each 'deepInsight' should be a comprehensive personalized reading (~2 paragraphs) with practical spiritual/professional details.

        Ensure the output strictly conforms to the JSON schema specified.
      `;

      try {
        const response = await generateContentWithRetry({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            systemInstruction: "You are a master Vedic Astrologer and Numerology expert with deep knowledge of planets, deities, gemstone recommendations, and lifestyle sadhana remedies. Speak with a tone of profound wisdom, empathy, and cosmic precision. Avoid generic predictions; tailor everything to the user's specific birth variables.",
            responseMimeType: "application/json",
            responseSchema: readingSchema,
            temperature: 0.85
          }
        });

        const rawText = response.text || "{}";
        reportData = JSON.parse(rawText);
        console.log("Successfully generated AI-Powered report from Gemini.");
      } catch (geminiError: any) {
        console.warn("Gemini API call failed (using fallback template):", geminiError.message || geminiError);
        reportData = generateLocalProfile(name, moolank, bhagyank, namank, focusArea, language);
        isFallback = true;
        fallbackReason = geminiError.message || "Quota exceeded or API error.";
      }
    } else {
      console.log("GEMINI_API_KEY not configured. Generating beautiful local database template...");
      reportData = generateLocalProfile(name, moolank, bhagyank, namank, focusArea, language);
      isFallback = true;
      fallbackReason = "No active Gemini API key configured.";
    }

    res.json({
      success: true,
      moolank,
      bhagyank,
      namank,
      isFallback,
      fallbackReason,
      ...reportData
    });

  } catch (error: any) {
    console.error("Error in /api/moolank/reading:", error);
    res.status(500).json({ error: error.message || "An error occurred while generating your reading." });
  }
});

// GET compatibility endpoint
app.post("/api/moolank/compatibility", async (req, res) => {
  try {
    const { name1, dob1, name2, dob2, moolank1: inputMoolank1, bhagyank1: inputBhagyank1, moolank2: inputMoolank2, bhagyank2: inputBhagyank2, language } = req.body;
    
    // Support either DOB or directly passed Moolank/Bhagyank
    const moolank1 = dob1 ? calculateMoolank(dob1) : Number(inputMoolank1 || 1);
    const bhagyank1 = dob1 ? calculateBhagyank(dob1) : Number(inputBhagyank1 || 1);
    const moolank2 = dob2 ? calculateMoolank(dob2) : Number(inputMoolank2 || 1);
    const bhagyank2 = dob2 ? calculateBhagyank(dob2) : Number(inputBhagyank2 || 1);

    console.log(`Calculating compatibility between Moolank ${moolank1} (Bhagyank ${bhagyank1}) and Moolank ${moolank2} (Bhagyank ${bhagyank2})`);

    const hasApiKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY" && process.env.GEMINI_API_KEY.trim() !== "";
    
    let compatibilityData;
    let isFallback = false;
    let fallbackReason = "";

    if (hasApiKey) {
      const ai = getAiClient();
      const prompt = `
        Perform a Vedic Numerology compatibility reading.
        Person 1: ${name1 || "Partner A"} (${dob1 ? `DOB: ${dob1}, ` : ""}Moolank: ${moolank1}, Bhagyank: ${bhagyank1})
        Person 2: ${name2 || "Partner B"} (${dob2 ? `DOB: ${dob2}, ` : ""}Moolank: ${moolank2}, Bhagyank: ${bhagyank2})
        ${language === "hinglish" ? "\n- Language: Hinglish (Hindi + English Mix, written in standard Latin/Roman script. e.g. 'Aap dono ki chemistry bohot achhi hai...'). Please write the 'summary', 'mutualStrengths', 'mutualChallenges', and 'cosmicAdvice' fully in conversational Hinglish using Roman/Latin script. Do NOT use Devnagari script." : ""}

        Calculate scores (0 to 100) for love, friendship, and business compatibility. Provide an elegant summary (~2-3 sentences), mutual strengths, mutual challenges, and personalized 'cosmicAdvice' on how to harmonize their relationship.
      `;

      try {
        const response = await generateContentWithRetry({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            systemInstruction: "You are an astrological relationship counselor. Use deep numerological compatibility principles. Speak in a constructive, warm, and highly insightful voice.",
            responseMimeType: "application/json",
            responseSchema: compatibilitySchema,
            temperature: 0.8
          }
        });

        const rawText = response.text || "{}";
        compatibilityData = JSON.parse(rawText);
      } catch (e: any) {
        console.warn("Gemini compatibility call failed (using fallback formulas):", e.message || e);
        compatibilityData = generateLocalCompatibility(moolank1, moolank2, language);
        isFallback = true;
        fallbackReason = e.message || "Quota exceeded or API error.";
      }
    } else {
      compatibilityData = generateLocalCompatibility(moolank1, moolank2, language);
      isFallback = true;
      fallbackReason = "No active Gemini API key configured.";
    }

    res.json({
      success: true,
      person1: { moolank: moolank1, bhagyank: bhagyank1 },
      person2: { moolank: moolank2, bhagyank: bhagyank2 },
      isFallback,
      fallbackReason,
      ...compatibilityData
    });

  } catch (error: any) {
    console.error("Error in /api/moolank/compatibility:", error);
    res.status(500).json({ error: error.message || "An error occurred while calculating compatibility." });
  }
});

// GET daily forecast endpoint
app.post("/api/moolank/daily-forecast", async (req, res) => {
  try {
    const { dob, date, language } = req.body;
    if (!dob) {
      return res.status(400).json({ error: "Date of Birth (dob) is required." });
    }

    const targetDate = date || new Date().toISOString().split('T')[0];
    const moolank = calculateMoolank(dob);
    
    // Calculate Personal Day Number: (Moolank + Target Date's Day & Month digits sum)
    const targetParts = targetDate.split('-');
    const dayDigitsSum = reduceToSingleDigit(parseInt(targetParts[2], 10));
    const monthDigitsSum = reduceToSingleDigit(parseInt(targetParts[1], 10));
    const personalDayNumber = reduceToSingleDigit(moolank + dayDigitsSum + monthDigitsSum);

    const hasApiKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY" && process.env.GEMINI_API_KEY.trim() !== "";
    
    let forecastData;
    let isFallback = false;
    let fallbackReason = "";

    if (hasApiKey) {
      const ai = getAiClient();
      const prompt = `
        Provide a daily numerology forecast for:
        - Moolank (Root Number): ${moolank}
        - Personal Day Number for today: ${personalDayNumber}
        - Current Date: ${targetDate}
        ${language === "hinglish" ? "\n- Language: Hinglish (Hindi + English Mix, written in standard Latin/Roman script. e.g. 'Aaj aapka din naye initiatives ke liye best hai...'). Please write 'theme', 'forecast', 'dos', and 'donts' fully in conversational Hinglish using Roman/Latin script. Do NOT use Devnagari script." : ""}

        Return a beautiful, encouraging theme, a personalized forecast paragraph, 3 Dos, 3 Don'ts, and some 'luckyHours' for this day.
      `;

      try {
        const response = await generateContentWithRetry({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            systemInstruction: "You are a daily cosmic astrologer. Provide a precise daily energetic weather report based on numerological day counts.",
            responseMimeType: "application/json",
            responseSchema: dailyForecastSchema,
            temperature: 0.75
          }
        });

        const rawText = response.text || "{}";
        forecastData = JSON.parse(rawText);
      } catch (e: any) {
        forecastData = generateLocalDailyForecast(moolank, personalDayNumber, targetDate, language);
        isFallback = true;
        fallbackReason = e.message || "Quota exceeded or API error.";
      }
    } else {
      forecastData = generateLocalDailyForecast(moolank, personalDayNumber, targetDate, language);
      isFallback = true;
      fallbackReason = "No active Gemini API key configured.";
    }

    res.json({
      success: true,
      moolank,
      targetDate,
      isFallback,
      fallbackReason,
      ...forecastData
    });

  } catch (error: any) {
    console.error("Error in /api/moolank/daily-forecast:", error);
    res.status(500).json({ error: error.message || "An error occurred while generating daily forecast." });
  }
});


// POST AI Coach Endpoint
app.post("/api/moolank/coach", async (req, res) => {
  try {
    const { moolank, bhagyank, name, message, history, language } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const hasApiKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY" && process.env.GEMINI_API_KEY.trim() !== "";

    if (hasApiKey) {
      const ai = getAiClient();
      let sysInstruction = `You are an elite, wise Vedic Astrological Mentor and Life Coach, styled after a spiritual guru and wellness strategist. 
The user is ${name}, with a Moolank (Root number) of ${moolank} and Bhagyank (Destiny path) of ${bhagyank}.
Provide highly personalized, deep, professional, book-like, spiritual answers to their life transformation questions.
Do NOT use sales-pitch wording, hype, or generic advice. Keep your response practical, empathetic, and grounded in Vedic numerology, chakra healing, element balance, and modern self-development psychology.`;

      if (language === "hinglish") {
        sysInstruction += `\n\nCRITICAL: The user has requested to converse in **Hinglish** (a blend of English and Hindi, written in standard Roman/Latin script, e.g. 'Aapka Moolank 1 hai, iska matlab aap born leader hain. Lekin dhyan rakhein thoda patience rakhiye.'). Respond fully in natural, conversational, wise, and empathetic Hinglish using Roman/Latin script. Do NOT use Devnagari script.`;
      }

      // Format previous history for Gemini
      const formattedContents = [
        ...(history || []).map((h: any) => ({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.parts?.[0]?.text || "" }]
        })).filter((h: any) => h.parts[0].text !== ""),
        { role: "user", parts: [{ text: message }] }
      ];

      try {
        const response = await generateContentWithRetry({
          model: "gemini-3.5-flash",
          contents: formattedContents,
          config: {
            systemInstruction: sysInstruction,
            temperature: 0.7
          }
        });

        res.json({ reply: response.text || "I am reflecting on your cosmic energies. Please focus your question on elemental and lifestyle alignments." });
      } catch (geminiError: any) {
        console.warn("Gemini coach call failed (using fallback coach reply):", geminiError.message || geminiError);
        const fallbackReply = generateLocalCoachReply(moolank, bhagyank, name, message, language);
        res.json({ 
          reply: fallbackReply, 
          isFallback: true, 
          fallbackReason: geminiError.message || "Quota exceeded or API error." 
        });
      }
    } else {
      console.log("No Gemini API key detected, using high-quality local coach reply.");
      const fallbackReply = generateLocalCoachReply(moolank, bhagyank, name, message, language);
      res.json({ 
        reply: fallbackReply, 
        isFallback: true, 
        fallbackReason: "No active Gemini API key configured." 
      });
    }
  } catch (error: any) {
    console.error("Error in /api/moolank/coach:", error);
    res.status(500).json({ error: error.message || "An error occurred with your coach session." });
  }
});


// Fallback generator helper functions
function generateLocalProfile(name: string, moolank: number, bhagyank: number, namank: number, focusArea: string, language?: string) {
  const temp = templates[moolank] || templates[1];
  
  const categoryTitles: Record<string, string> = {
    personality: "Personality Core Traits",
    relationships: "Relational Alignment & Harmony",
    career: "Highest Career & Business Callings",
    money: "Money & Abundance Manifestation",
    growth: "Growth, Obstacles & Karmic Sadhana",
    health: "Wellness, Vitality & Energy Flow",
    purpose: "Ultimate Soul Purpose & Destiny Pathway",
    potential: "Hidden Spiritual Talents & Superpowers"
  };

  const isHinglish = language === "hinglish";

  const getMappedCategory = (key: "personality" | "relationships" | "career" | "money" | "growth" | "health" | "purpose" | "potential", title: string, customDeep?: string) => {
    const source = temp[key];
    const deepInsightText = customDeep || source.deep || "";
    return {
      title: isHinglish ? convertToHinglish(title) : title,
      summary: isHinglish ? convertToHinglish(source.summary || "") : (source.summary || ""),
      deepInsight: isHinglish ? convertToHinglish(deepInsightText) : deepInsightText,
      strengths: isHinglish ? (source.strengths || []).map(s => convertToHinglish(s)) : (source.strengths || []),
      challenges: isHinglish ? (source.challenges || []).map(c => convertToHinglish(c)) : (source.challenges || []),
      actionableTips: isHinglish ? (source.tips || []).map(t => convertToHinglish(t)) : (source.tips || [])
    };
  };

  const personalizedCategories = {
    personality: getMappedCategory("personality", categoryTitles.personality, `Hello ${name}! ` + temp.personality.deep),
    relationships: getMappedCategory("relationships", categoryTitles.relationships),
    career: getMappedCategory("career", categoryTitles.career, `Regarding your current focus area (${focusArea || "Overall Balance"}), ` + temp.career.deep),
    money: getMappedCategory("money", categoryTitles.money),
    growth: getMappedCategory("growth", categoryTitles.growth),
    health: getMappedCategory("health", categoryTitles.health),
    purpose: getMappedCategory("purpose", categoryTitles.purpose, temp.purpose.deep + ` Your destiny pathway (Bhagyank: ${bhagyank}) guides this purpose.`),
    potential: getMappedCategory("potential", categoryTitles.potential, temp.potential.deep + ` Your name vibrations (Namank: ${namank}) support this potential.`)
  };

  return {
    rulingPlanet: temp.planet,
    rulingPlanetDeity: temp.deity,
    gemstone: temp.gem,
    luckyColors: temp.colors,
    luckyDays: temp.days,
    luckyNumbers: temp.luckyNums,
    friendlyNumbers: temp.friendly,
    neutralNumbers: temp.neutral,
    enemyNumbers: temp.enemy,
    radicalRemedy: isHinglish ? convertToHinglish(temp.remedy) : temp.remedy,
    categories: personalizedCategories
  };
}

function generateLocalCompatibility(m1: number, m2: number, language?: string) {
  // Let's create a predictable but authentic compatibility score
  const relationshipMatrix: Record<string, { love: number; friend: number; work: number; strengths: string[]; challenges: string[]; advice: string }> = {
    "6-6": {
      love: 92, friend: 88, work: 80,
      strengths: ["Deep mutual understanding", "Aesthetic alignment", "Loving domestic focus"],
      challenges: ["Possessiveness", "Over-stubbornness in decision making", "Avoiding critical conflicts"],
      advice: "Ensure you establish healthy physical/mental boundaries and speak about conflicts early."
    },
    "default": {
      love: 78, friend: 82, work: 85,
      strengths: ["Balanced communication style", "Complementary active skills", "Mutual respect for individuality"],
      challenges: ["Occasional minor ego clashes", "Varying reaction speeds under stress"],
      advice: "Practice active listening and celebrate each other's individual achievements regularly."
    }
  };

  const key = `${Math.min(m1, m2)}-${Math.max(m1, m2)}`;
  const match = relationshipMatrix[key] || relationshipMatrix["default"];

  const isHinglish = language === "hinglish";
  const rawSummary = `Your energies (Moolank ${m1} and Moolank ${m2}) create a highly harmonious blend of life frequencies. There is great capacity for deep companionship and shared creative growth.`;

  return {
    loveScore: match.love,
    friendshipScore: match.friend,
    businessScore: match.work,
    summary: isHinglish ? convertToHinglish(rawSummary) : rawSummary,
    mutualStrengths: isHinglish ? match.strengths.map(s => convertToHinglish(s)) : match.strengths,
    mutualChallenges: isHinglish ? match.challenges.map(c => convertToHinglish(c)) : match.challenges,
    cosmicAdvice: isHinglish ? convertToHinglish(match.advice) : match.advice
  };
}

function generateLocalDailyForecast(moolank: number, pDay: number, date: string, language?: string) {
  const themes: Record<number | string, { theme: string; forecast: string; dos: string[]; donts: string[]; hours: string }> = {
    1: {
      theme: "Self-Initiative & Brand New Begins",
      forecast: "Today radiates solar leadership vibes. You possess immense clarity to kickstart long-pending personal or professional assignments.",
      dos: ["Worship the rising Sun", "Start a health routine", "Draft your new idea summary"],
      donts: ["Enter futile debates", "Decline constructive support", "Oversleep"],
      hours: "07:30 AM to 09:00 AM"
    },
    default: {
      theme: "Harmonization, Creation & Introspective Wisdom",
      forecast: "Today focuses on structural order, balance, and fine-tuning your goals. It is a brilliant day for planning, organizing, and counseling.",
      dos: ["Drink adequate pure water", "Engage with supportive team-workers", "Practice silent breath observation"],
      donts: ["Overthink future options", "Spend heavily on vanity items", "Rush travel routines"],
      hours: "10:30 AM to 12:00 PM"
    }
  };

  const match = themes[pDay] || themes["default"];

  const isHinglish = language === "hinglish";
  return {
    personalDayNumber: pDay,
    theme: isHinglish ? convertToHinglish(match.theme) : match.theme,
    forecast: isHinglish ? convertToHinglish(match.forecast) : match.forecast,
    dos: isHinglish ? match.dos.map(d => convertToHinglish(d)) : match.dos,
    donts: isHinglish ? match.donts.map(d => convertToHinglish(d)) : match.donts,
    luckyHours: match.hours
  };
}

function generateLocalCoachReply(moolank: number, bhagyank: number, name: string, message: string, language?: string): string {
  const temp = templates[moolank] || templates[1];
  const query = message.toLowerCase();
  
  let sector: "personality" | "relationships" | "career" | "money" | "growth" | "health" | "purpose" | "potential" = "personality";
  let topicName = "spiritual life alignment";
  
  if (query.includes("career") || query.includes("job") || query.includes("business") || query.includes("work") || query.includes("boss") || query.includes("profession")) {
    sector = "career";
    topicName = "career path and professional sovereignty";
  } else if (query.includes("money") || query.includes("wealth") || query.includes("finance") || query.includes("gold") || query.includes("rich") || query.includes("income") || query.includes("salary")) {
    sector = "money";
    topicName = "abundance consciousness and financial harmony";
  } else if (query.includes("relationship") || query.includes("love") || query.includes("marriage") || query.includes("partner") || query.includes("spouse") || query.includes("friend") || query.includes("family")) {
    sector = "relationships";
    topicName = "relationship harmony and soul-tie alignments";
  } else if (query.includes("health") || query.includes("fit") || query.includes("energy") || query.includes("stress") || query.includes("disease") || query.includes("body") || query.includes("mental")) {
    sector = "health";
    topicName = "vitality, somatic energy flow, and wellness";
  } else if (query.includes("remedy") || query.includes("stone") || query.includes("gem") || query.includes("ritual") || query.includes("mantra") || query.includes("sadhana") || query.includes("chant")) {
    sector = "growth";
    topicName = "karmic sadhana, remedies, and spiritual acceleration";
  } else if (query.includes("purpose") || query.includes("destiny") || query.includes("life") || query.includes("soul")) {
    sector = "purpose";
    topicName = "soul contract, destiny, and higher cosmic purpose";
  } else if (query.includes("potential") || query.includes("talent") || query.includes("power") || query.includes("hidden") || query.includes("psychic")) {
    sector = "potential";
    topicName = "hidden spiritual powers and inner creative source";
  }

  const categoryData = temp[sector];
  
  const intro = `Namaste ${name}. I am tuning into your unique cosmic frequency (Moolank ${moolank}, Bhagyank ${bhagyank}, ruled by ${temp.planet}). 
 
Your question touches deeply upon your **${topicName}**. Let us examine this from a Vedic numerology and cosmic lifestyle perspective:`;

  const dynamicBody = `
### 🌌 The Planetary Influence
Your ruling planet is **${temp.planet}** (presided over by **${temp.deity}**). This celestial configuration means that you naturally process life through its unique vibrations. 
- **Core Cosmic Pattern:** ${categoryData.summary}
- **Vedic Insight:** ${categoryData.deep}

### ⚖️ Dual Forces: Strengths & Hurdles
To align with your highest timeline, you must consciously balance these opposing polarities in your daily ledger:
* **Your Celestial Strengths:** ${categoryData.strengths.join(", ")}
* **Karmic Hurdle (To watch out for):** ${categoryData.challenges.join(", ")}

### 🧘 Cosmic Sadhanas & Practical Steps
Here are the specific behavioral and spiritual steps aligned with your numbers:
1. **Planetary Remedy:** ${temp.remedy}
2. **Behavioral Calibration:** ${categoryData.tips[0] || "Cultivate active listening and self-acceptance."}
3. **Daily Action:** ${categoryData.tips[1] || "Practice conscious breathing and element alignment."}
4. **Lucky Days/Colors:** Focus your major intentions on **${temp.days.join(" or ")}** while surrounding yourself with **${temp.colors.slice(0, 2).join(" or ")}** energies. Your primary lucky numbers are **${temp.luckyNums.join(", ")}**.

### 🌟 Mentor's Blessings
Remember, your Moolank ${moolank} (Root) holds your structural foundations, while your Bhagyank ${bhagyank} (Destiny) guides your future evolutionary target. Practice the *Sadhana Tracker* tab daily to ground these frequencies in physical reality. Let your actions match your highest blueprint!`;

  const finalEnglish = `${intro}\n\n${dynamicBody}`;
  if (language === "hinglish") {
    return convertToHinglish(finalEnglish);
  }
  return finalEnglish;
}


// JSON Schema definitions for @google/genai structured responses
const readingSchema = {
  type: Type.OBJECT,
  properties: {
    rulingPlanet: { type: Type.STRING },
    rulingPlanetDeity: { type: Type.STRING },
    gemstone: { type: Type.STRING },
    luckyColors: { type: Type.ARRAY, items: { type: Type.STRING } },
    luckyDays: { type: Type.ARRAY, items: { type: Type.STRING } },
    luckyNumbers: { type: Type.ARRAY, items: { type: Type.INTEGER } },
    friendlyNumbers: { type: Type.ARRAY, items: { type: Type.INTEGER } },
    neutralNumbers: { type: Type.ARRAY, items: { type: Type.INTEGER } },
    enemyNumbers: { type: Type.ARRAY, items: { type: Type.INTEGER } },
    radicalRemedy: { type: Type.STRING },
    categories: {
      type: Type.OBJECT,
      properties: {
        personality: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            deepInsight: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            challenges: { type: Type.ARRAY, items: { type: Type.STRING } },
            actionableTips: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["title", "summary", "deepInsight", "strengths", "challenges", "actionableTips"]
        },
        relationships: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            deepInsight: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            challenges: { type: Type.ARRAY, items: { type: Type.STRING } },
            actionableTips: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["title", "summary", "deepInsight", "strengths", "challenges", "actionableTips"]
        },
        career: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            deepInsight: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            challenges: { type: Type.ARRAY, items: { type: Type.STRING } },
            actionableTips: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["title", "summary", "deepInsight", "strengths", "challenges", "actionableTips"]
        },
        money: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            deepInsight: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            challenges: { type: Type.ARRAY, items: { type: Type.STRING } },
            actionableTips: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["title", "summary", "deepInsight", "strengths", "challenges", "actionableTips"]
        },
        growth: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            deepInsight: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            challenges: { type: Type.ARRAY, items: { type: Type.STRING } },
            actionableTips: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["title", "summary", "deepInsight", "strengths", "challenges", "actionableTips"]
        },
        health: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            deepInsight: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            challenges: { type: Type.ARRAY, items: { type: Type.STRING } },
            actionableTips: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["title", "summary", "deepInsight", "strengths", "challenges", "actionableTips"]
        },
        purpose: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            deepInsight: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            challenges: { type: Type.ARRAY, items: { type: Type.STRING } },
            actionableTips: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["title", "summary", "deepInsight", "strengths", "challenges", "actionableTips"]
        },
        potential: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            deepInsight: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            challenges: { type: Type.ARRAY, items: { type: Type.STRING } },
            actionableTips: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["title", "summary", "deepInsight", "strengths", "challenges", "actionableTips"]
        }
      },
      required: ["personality", "relationships", "career", "money", "growth", "health", "purpose", "potential"]
    }
  },
  required: [
    "rulingPlanet", "rulingPlanetDeity", "gemstone", "luckyColors", "luckyDays", 
    "luckyNumbers", "friendlyNumbers", "neutralNumbers", "enemyNumbers", 
    "radicalRemedy", "categories"
  ]
};

const compatibilitySchema = {
  type: Type.OBJECT,
  properties: {
    loveScore: { type: Type.INTEGER },
    friendshipScore: { type: Type.INTEGER },
    businessScore: { type: Type.INTEGER },
    summary: { type: Type.STRING },
    mutualStrengths: { type: Type.ARRAY, items: { type: Type.STRING } },
    mutualChallenges: { type: Type.ARRAY, items: { type: Type.STRING } },
    cosmicAdvice: { type: Type.STRING }
  },
  required: ["loveScore", "friendshipScore", "businessScore", "summary", "mutualStrengths", "mutualChallenges", "cosmicAdvice"]
};

const dailyForecastSchema = {
  type: Type.OBJECT,
  properties: {
    personalDayNumber: { type: Type.INTEGER },
    theme: { type: Type.STRING },
    forecast: { type: Type.STRING },
    dos: { type: Type.ARRAY, items: { type: Type.STRING } },
    donts: { type: Type.ARRAY, items: { type: Type.STRING } },
    luckyHours: { type: Type.STRING }
  },
  required: ["personalDayNumber", "theme", "forecast", "dos", "donts", "luckyHours"]
};


// Vite integration and static asset serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Moolank App full-stack server running on http://localhost:${PORT}`);
  });
}

startServer();
