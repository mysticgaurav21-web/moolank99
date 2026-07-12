import { convertToHinglish } from "./hinglish";

// Exact lookups for UI labels and key terminology to ensure a deeply emotional yet professional tone
const terminologyMap: Record<string, string> = {
  // Tabs & Navigation
  "Cosmic Dashboard": "Cosmic Dashboard (Aapka Grah-Chakra)",
  "Daily Weather": "Daily Weather (Aaj Ka Grah-Chakra)",
  "Compatibility Matcher": "Compatibility Matcher (Kundali Milaap)",
  "AI Cosmic Guide": "AI Cosmic Guide (AI Kundali Coach)",
  "Knowledge Library": "Knowledge Library (Gyaan Ka Bhandar)",
  "Transformation Tracker": "Transformation Tracker (Daily Sadhana)",
  "Reference Matrix": "Reference Matrix (Grahon Ki Sarni)",

  // Input & Forms
  "Enter your full name": "Apna poora naam enter karein",
  "Select birth date": "Apni Janm Tithi (Date of Birth) select karein",
  "Generate Full Analysis": "Poora Cosmic Report Generate Karein",
  "Analyzing your cosmic energy...": "Srishti ki shaktiyon se aapki kundali connect ho rahi hai...",
  "Calculating...": "Ganna (Calculation) ho rahi hai...",
  "Privacy First": "Privacy First (Aapka data bilkul safe hai)",
  "Your data is safe with us": "Aapki details bilkul secure aur private hain",
  "Calculate Compatibility": "Compatibility Check Karein",

  // Profile Components
  "Moolank (Root Count)": "Moolank (Aapka Core Number)",
  "Bhagyank (Destiny Count)": "Bhagyank (Aapka Bhagya Number)",
  "Namank (Name Count)": "Namank (Aapka Naam Number)",
  "Ruling Deity": "Ruling Deity (Aapke Devta)",
  "Gemstone": "Shubh Ratna (Gemstone)",
  "Lucky Days": "Shubh Din (Lucky Days)",
  "Lucky Numbers": "Shubh Numbers",
  "The Radical Remedy (Radical Sadhana)": "The Radical Remedy (Aapka Maha Upay)",
  "Category Insight": "Category Insight (Aapke Sitare)",

  // Main Insights Tabs
  "Personality Insight": "Personality Insight (Aapka Swabhav)",
  "Destiny & Purpose": "Destiny & Purpose (Bhagya aur Maksad)",
  "Aura, Health & Somatics": "Aura, Health & Somatics (Urja aur Swasthya)",
  "Divine Sadhana & Growth": "Divine Sadhana & Growth (Upay aur Adhyatmikta)",
  "Daily Cosmic Forecast": "Daily Cosmic Forecast (Aaj Ka Rashifal)",
};

/**
 * Robust wrapper function to translate text from English to Hinglish
 * if Hinglish mode is active. Uses high-resonance lookup maps first,
 * then falls back to conversational line/word conversion.
 */
export function translateText(text: string | undefined, language: string): string {
  if (!text) return "";
  if (language !== "hinglish") return text;

  const trimmed = text.trim();
  // 1. Check exact match in terminology map
  if (terminologyMap[trimmed]) {
    return terminologyMap[trimmed];
  }

  // 2. Perform inline key replacements
  let result = text;
  for (const [key, value] of Object.entries(terminologyMap)) {
    // Avoid double-replacing or replacing short fragments out of context
    if (key.length < 4) continue;
    
    // Simple escape for regex special chars
    const escapedKey = key.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    const regex = new RegExp(`\\b${escapedKey}\\b`, "gi");
    if (regex.test(result)) {
      result = result.replace(regex, value);
    }
  }

  // 3. Apply standard conversational rules for sentence-level & word-level translations
  return convertToHinglish(result);
}
