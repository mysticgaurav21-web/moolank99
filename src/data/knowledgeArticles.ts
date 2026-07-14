export interface KnowledgeArticle {
  id: string;
  category: "basics" | "planets" | "chakras" | "philosophy" | "habits";
  title: string;
  excerpt: string;
  content: string;
  readingTime: string;
}

export const knowledgeArticles: KnowledgeArticle[] = [
  {
    id: "basics-moolank-bhagyank-namank",
    category: "basics",
    title: "The Trinity of Numbers: Understanding Moolank, Bhagyank, and Namank",
    excerpt: "Your cosmic blueprint is written in three numbers. Learn how your birth date, destiny path, and full name merge to create your life's frequency.",
    readingTime: "5 min read",
    content: `In Vedic numerology (Sankhya Sastra), your energetic constitution is governed by three primary forces represented as numbers:

1. **Moolank (Root / Soul Number):**
Calculated solely from the day of your birth (reduced to a single digit, e.g., if you are born on the 28th, 2+8 = 10, 1+0 = 1). Moolank represents your core identity, soul personality, natural instincts, emotional makeup, and inner character. It dictates who you are when alone.

2. **Bhagyank (Destiny / Karma Number):**
Calculated by summing your entire date of birth and reducing it to a single digit. Bhagyank represents your destination, your life path, the lessons you must learn, and the career paths that align with your highest karma.

3. **Namank (Name Vibration Number):**
Calculated using the Chaldean alphanumeric system from the spelling of your full name. Namank acts as your public frequency, governing how people perceive you, your professional branding alignment, and your social interactions.

The app treats these descriptions as traditional numerology interpretations rather than scientifically established personality measurements.`
  },
  {
    id: "planets-governing-elements",
    category: "planets",
    title: "Cosmic Planets & Their Governing Elements",
    excerpt: "Explore the traditional planetary associations used for numbers 1 to 9.",
    readingTime: "6 min read",
    content: `Traditional numerology commonly associates the numbers with these planetary symbols:

- Number 1: Sun (Surya)
- Number 2: Moon (Chandra)
- Number 3: Jupiter (Guru)
- Number 4: Rahu
- Number 5: Mercury (Budha)
- Number 6: Venus (Shukra)
- Number 7: Ketu
- Number 8: Saturn (Shani)
- Number 9: Mars (Mangal)

These associations belong to numerology and astrological traditions. They should be presented as symbolic frameworks, not as scientific proof that planets determine personality.`
  },
  {
    id: "chakras-vibration-alignments",
    category: "chakras",
    title: "The Chakra System: A Traditional Overview",
    excerpt: "Learn how spiritual traditions describe seven symbolic energy centres.",
    readingTime: "7 min read",
    content: `Yoga and spiritual traditions describe seven major chakras: Muladhara, Svadhisthana, Manipura, Anahata, Vishuddha, Ajna, and Sahasrara.

They are often used as symbolic tools for reflection on grounding, emotion, confidence, compassion, communication, intuition, and spiritual meaning.

Chakra material in this app should not be used to diagnose illness or replace medical care.`
  },
  {
    id: "philosophy-karma-dharma",
    category: "philosophy",
    title: "Karma, Dharma, and Personal Evolution",
    excerpt: "Explore traditional ideas of duty, action, consequence, and purposeful living.",
    readingTime: "8 min read",
    content: `In Indian philosophical traditions, dharma broadly concerns duty, ethical order, and an appropriate way of living. Karma concerns action and consequence.

Numerology interpretations may use these concepts as reflective language for responsibility and personal development. The app should avoid presenting unverifiable past-life claims as objective fact.`
  },
  {
    id: "habits-breathwork-science",
    category: "habits",
    title: "Breathwork and Sustainable Habit Building",
    excerpt: "Use gentle breathing and realistic repetition to support self-regulation.",
    readingTime: "6 min read",
    content: `Slow, comfortable breathing can support relaxation for many people. Habit formation does not follow one universal 21-day rule; the time required varies by behaviour, environment, repetition, and the individual.

Build habits through small actions, consistent cues, tracking, and recovery after missed days. Stop breath practices that cause dizziness or discomfort and seek professional guidance when appropriate.`
  }
];
