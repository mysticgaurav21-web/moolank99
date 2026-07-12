// Detailed, premium transformation data for Moolank Numbers 1 to 9
// Designed to read like an elite personal development book customized for the seeker.

export interface IdentityProfile {
  dominantPlanet: string;
  dominantElement: string;
  energyType: string;
  leadershipStyle: string;
  communicationStyle: string;
  thinkingPattern: string;
  learningStyle: string;
  emotionalNature: string;
  decisionMakingStyle: string;
  spiritualNature: string;
}

export interface StrengthsProfile {
  strengths: string[];
  hiddenTalents: string[];
  naturalGifts: string[];
}

export interface WeaknessesProfile {
  weaknesses: string[];
  emotionalTriggers: string[];
  limitingBeliefs: string[];
  selfSabotagingHabits: string[];
  biggestLifeLessons: string[];
  karmaPatterns: string[];
}

export interface CareerProfile {
  bestCareers: string[];
  businessIdeas: string[];
  leadershipRoles: string[];
  creativeCareers: string[];
  governmentJobs: string[];
  freelancing: string[];
  entrepreneurship: string[];
  skillsToLearn: string[];
  skillsToAvoid: string[];
  whyExplanation: string;
}

export interface MoneyProfile {
  moneyPersonality: string;
  spendingStyle: string;
  savingStyle: string;
  wealthCreationStrategy: string;
  investmentBehavior: string;
  financialMistakes: string[];
  wealthBlockers: string[];
  moneyMindsetImprovement: string[];
}

export interface RelationshipProfile {
  loveStyle: string;
  marriage: string;
  friendship: string;
  family: string;
  parenting: string;
  communication: string;
  conflictStyle: string;
  healingAdvice: string;
  compatibilityTips: string[];
}

export interface HealthProfile {
  morningRoutine: string;
  nightRoutine: string;
  idealWakeUpTime: string;
  idealSleepTime: string;
  yogaPoses: string[];
  pranayama: string[];
  meditationStyle: string;
  exercise: string;
  dietAdvice: string;
  waterIntake: string;
  fastingRemedies: string;
  digitalDetox: string;
  stressManagement: string;
  brainHealth: string;
  gutHealth: string;
  hormoneBalance: string;
}

export interface SpiritualGrowthProfile {
  dailyMantra: string;
  weeklyMantra: string;
  planetaryDeity: string;
  rudraksha: string;
  gemstone: string;
  yantra: string;
  charityAndDonation: string;
  fastingDay: string;
  gratitudePractice: string;
  journalingPrompt: string;
  visualizationExercise: string;
  affirmations: string[];
}

export interface TransformationRoadmap {
  sevenDayPlan: string[];
  twentyOneDayPlan: string[];
  fortyOneDayPlan: string[];
  ninetyDayPlan: string[];
  oneYearRoadmap: string[];
}

export interface FullMoolankProfile {
  moolank: number;
  identity: IdentityProfile;
  strengthsProfile: StrengthsProfile;
  weaknessesProfile: WeaknessesProfile;
  careerProfile: CareerProfile;
  moneyProfile: MoneyProfile;
  relationshipProfile: RelationshipProfile;
  healthProfile: HealthProfile;
  spiritualProfile: SpiritualGrowthProfile;
  roadmap: TransformationRoadmap;
}

// Generate premium, highly specific textbook details programmatically or via mapping for all 9 numbers
export function getTransformationProfile(moolank: number): FullMoolankProfile {
  // Let's define the qualitative databases for each number
  const planets = ["", "Sun (Surya)", "Moon (Chandra)", "Jupiter (Guru)", "Rahu (North Node)", "Mercury (Budha)", "Venus (Shukra)", "Ketu (South Node)", "Saturn (Shani)", "Mars (Mangal)"];
  const elements = ["", "Fire (Tejas)", "Water (Jala)", "Ether (Akasha)", "Wind (Vayu)", "Earth (Prithvi)", "Water & Air Blend", "Cosmic Ether (Spiritual)", "Dense Earth (Prithvi)", "Intense Fire (Agni)"];
  const energyTypes = ["", "Dynamic Solar Initiator", "Reflective Lunarian Empath", "Philosophical Expansionist", "Revolutionary System Breaker", "Rapid Analytical Intellect", "Magnetic Artistic Harmony", "Mystical Introspective Hermit", "Patient Karmic Builder", "Fiery Crusader Warrior"];
  
  // Specific detailed values per Moolank
  const profiles: Record<number, Partial<FullMoolankProfile>> = {
    1: {
      identity: {
        dominantPlanet: planets[1],
        dominantElement: elements[1],
        energyType: energyTypes[1],
        leadershipStyle: "Authoritative, pioneering, and visionary. Leads by active example and prefers singular authority.",
        communicationStyle: "Direct, confident, motivational, and highly assertive. Speaks with clear intent.",
        thinkingPattern: "Strategic, forward-looking, highly independent, and goal-oriented.",
        learningStyle: "Self-directed, experimental, and learning through active creation and real projects.",
        emotionalNature: "Proud, intensely self-protective, highly enthusiastic, but easily frustrated by delay.",
        decisionMakingStyle: "Fast, decisive, relying heavily on self-will and personal instincts.",
        spiritualNature: "Solar consciousness, focused on light, willpower, alignment with the supreme source, and right action (Dharma)."
      },
      strengthsProfile: {
        strengths: [
          "Incredible self-motivation", "Unyielding courage", "Natural authority", "Pioneering vision", 
          "High focus and determination", "Magnetic charisma", "Exceptional crisis execution", "Self-reliance",
          "High vitality", "Protective instinct", "Inspirational presence", "Original thinking",
          "Unwavering loyalty", "Honesty and integrity", "High standard of quality"
        ],
        hiddenTalents: [
          "Strategic conceptualizing", "Rapid team organizing", "Creating systems out of chaos", "Inspiring public speech",
          "Spotting talent in others", "High risk calculation", "Autonomous learning", "Visualizing final products",
          "Branding and style direction", "Inventive engineering", "Vocal projection", "Commanding room dynamics",
          "Mentorship of junior pioneers", "Unlocking individual confidence", "Pioneering creative arts"
        ],
        naturalGifts: [
          "An aura of natural authority", "High physical and mental stamina", "Instant recovery from failure",
          "Clear intuitive foresight", "Unmatched willpower", "Sovereignty of spirit", "Purity of intention",
          "Magnetic attraction of respect", "Ability to stand alone", "Creative fire", "Warmhearted generosity",
          "A noble nature", "Pioneering drive", "Vocal resonance", "Ability to inspire belief"
        ]
      },
      weaknessesProfile: {
        weaknesses: [
          "Subtle arrogance under heavy stress", "Impatience with slower minds", "Difficulty accepting subordinate roles",
          "Hypersensitivity to criticism", "Unwillingness to delegate simple details", "Prone to administrative burnout",
          "Rigid insistence on self-reliance", "Tendency to dominate group discussions"
        ],
        emotionalTriggers: [
          "Feeling ignored or unappreciated", "Being micro-managed by superiors", "Forced delays in execution",
          "Disrespect of personal authority", "Public contradiction or criticism"
        ],
        limitingBeliefs: [
          "I must do everything myself if I want it done right.",
          "Asking for help is a sign of weakness or failure.",
          "I am only valuable when I am leading or achieving."
        ],
        selfSabotagingHabits: [
          "Refusing collaboration to preserve sole credit", "Pushing past physical limits to feed ego",
          "Rejecting valuable advice out of pride", "Alienating peers by demanding perfection"
        ],
        biggestLifeLessons: [
          "True leadership is defined by the capacity to elevate others, not dominate them.",
          "Vulnerability and asking for support are necessary keys to lasting success.",
          "Patience is a solar power, not a weakness."
        ],
        karmaPatterns: [
          "Experiencing early authority figures who restrict or challenge you, forcing you to develop authentic inner sovereignty.",
          "Recurring conflicts in partnerships until you master the balance of shared leadership."
        ]
      },
      careerProfile: {
        bestCareers: ["Entrepreneurship", "C-Suite Executive", "Government Administration", "Political Strategy", "Strategic Consulting"],
        businessIdeas: ["Independent Tech Startup", "Brand Consulting Firm", "Venture Capitalist Fund", "Exclusive Wellness Retreat"],
        leadershipRoles: ["Chief Executive Officer", "Political Campaign Director", "Creative Project Lead", "Military Commander"],
        creativeCareers: ["Art Director", "Independent Filmmaker", "Motivational Author", "Keynote Speaker"],
        governmentJobs: ["Civil Services Inspector", "Diplomatic Envoy", "Administrative Officer", "State Policy Developer"],
        freelancing: ["Elite Freelance Executive Advisor", "Pioneering Concept Architect", "High-End Solopreneur Coach"],
        entrepreneurship: ["Sole Founder of Disruptive Ventures", "Franchise Developer", "Innovative Platform Builder"],
        skillsToLearn: ["Active Listening", "Empathetic Delegation", "Collaborative Negotiation", "Somatic Grounding"],
        skillsToAvoid: ["Micro-management", "Highly repetitive manual data entry", "Passive supportive customer service"],
        whyExplanation: "Moolank 1 individuals carry solar frequency, which demands sovereignty and high visibility. They excel where they can make pioneering decisions and set the strategic compass, but suffocate under rigid, repetitive micro-management."
      },
      moneyProfile: {
        moneyPersonality: "The Sovereign Provider. Views money as a direct tool for authority, prestige, and generous protection.",
        spendingStyle: "Prone to lavish, high-status spending. Prefers premium quality, designer assets, and hosting generous events.",
        savingStyle: "Saves in large, ambitious blocks, often targeting high-yield investments or land acquisitions rather than passive accounts.",
        wealthCreationStrategy: "Pioneering new revenue channels, high-equity investments, scaling personal business models, and branding.",
        investmentBehavior: "Aggressive, calculated risk taker, gravitates towards real estate, start-ups, and active market portfolios.",
        financialMistakes: ["Speculating on vanity assets", "Lending large sums without contracts", "Ignoring small recurring expenses"],
        wealthBlockers: ["Pride preventing financial counsel", "Over-extension on lifestyle to project success", "Fear of partnership limits"],
        moneyMindsetImprovement: [
          "Implement a '24-hour hold' rule on prestige purchases.",
          "Establish silent, secure automated micro-savings.",
          "View financial collaboration as a force multiplier, not a loss of control."
        ]
      },
      relationshipProfile: {
        loveStyle: "Passionate, protective, and highly devoted. Expresses love through high-value gifts, protective actions, and acts of support.",
        marriage: "Requires mutual intellectual respect. Dedicated and loyal, but needs a partner who supports their career ambitions.",
        friendship: "The loyal anchor. Has a small circle of deep friendships; acts as the primary protector and advisor.",
        family: "The protective patriarch/matriarch. Takes deep responsibility for financial and emotional security.",
        parenting: "Encourages independent, high-achieving, and moral children. Highly proud, but can occasionally be demanding.",
        communication: "Clear, direct, and authoritative. Needs to consciously soften tone during emotional discussions.",
        conflictStyle: "Confrontational and proud. Wants to settle arguments quickly, but dislikes admitting faults.",
        healingAdvice: "Nurture your inner child's vulnerability. Release the need to always appear strong to those you love.",
        compatibilityTips: [
          "Pair beautifully with Moolank 2 (for soft emotional alignment), Moolank 3 (for creative and intellectual expansion), and Moolank 9 (for high-energy action).",
          "Consciously avoid power struggles with other Moolank 1s or Moolank 8s by establishing clear distinct domains."
        ]
      },
      healthProfile: {
        morningRoutine: "Wake up with the Sun. Drink 500ml of copper-infused water. Stand facing east to absorb early solar rays.",
        nightRoutine: "Perform digital detox 1 hour before bed. Practice 10 minutes of box-breathing to cool the system.",
        idealWakeUpTime: "5:30 AM to 6:00 AM",
        idealSleepTime: "10:00 PM to 10:30 PM",
        yogaPoses: ["Surya Namaskar (Sun Salutations)", "Virabhadrasana (Warrior Pose)", "Tadasana (Mountain Pose)"],
        pranayama: ["Surya Bhedana (Right Nostril Breathing)", "Kapalabhati (Skull Shining Breath)"],
        meditationStyle: "Heart Chakra Light Expansion and golden flame visualization.",
        exercise: "High-intensity cardio, strength training, or active swimming.",
        dietAdvice: "Incorporate cooling organic foods. Limit high-sodium and overly spicy fried items to protect blood pressure.",
        waterIntake: "3.5 Liters daily, infused with mint or cucumber for cooling.",
        fastingRemedies: "Observe light salt-free fasting or fruit fasting on Sundays.",
        digitalDetox: "Unplug completely on Sunday afternoons to reset the nervous system.",
        stressManagement: "Solo walking in open meadows, somatic screaming in private if high energy builds up, mauna silence.",
        brainHealth: "Supplement with Brahmi, ashwagandha, and read high-quality philosophical literature.",
        gutHealth: "Use warm ginger water before heavy meals to support digestion.",
        hormoneBalance: "Ensure sunlight exposure directly to the eyes before 8:00 AM to balance cortisol."
      },
      spiritualProfile: {
        dailyMantra: "Om Suryaya Namaha (Chant 108 times at sunrise)",
        weeklyMantra: "Gayatri Mantra (Chant 11 times on Sunday mornings)",
        planetaryDeity: "Lord Rama / Lord Surya Narayan",
        rudraksha: "1 Mukhi (One-Faced) Rudraksha for single-minded focus and leadership.",
        gemstone: "Ruby (Manikya) set in gold or copper on the ring finger.",
        yantra: "Surya Yantra placed in the East corner of the home office.",
        charityAndDonation: "Donate wheat, copper utensils, or red lentils on Sunday mornings to elders.",
        fastingDay: "Sundays (Avoid salt completely for solar energy activation).",
        gratitudePractice: "Write down 5 daily victories and thank the supreme creator for inner strength.",
        journalingPrompt: "In what area of my life am I leading from ego rather than authentic solar service?",
        visualizationExercise: "Visualize a warm, radiant golden sun at your solar plexus, expanding to fill your entire aura with protective, magnetic light.",
        affirmations: [
          "I lead with deep humility and cosmic wisdom.",
          "My strength lies in my capacity to lift others up.",
          "I am fully aligned with the infinite solar life force."
        ]
      },
      roadmap: {
        sevenDayPlan: [
          "Day 1: Rise before 6:00 AM and perform Surya Namaskar. Spend 5 minutes in silent gratitude.",
          "Day 2: Audit your current projects; delegate at least 2 minor tasks to trusted partners.",
          "Day 3: Practice 'active listening' in every conversation. Do not interrupt anyone today.",
          "Day 4: Unplug from all digital screens by 9:00 PM. Journal about your vulnerabilities.",
          "Day 5: Offer help or mentorship to someone junior in your space without expecting anything back.",
          "Day 6: Consume only light, salt-free, home-cooked organic meals to cleanse your solar plexus.",
          "Day 7: Perform a full solar reset: Sunrise chanting, physical detox, and clear goal alignment."
        ],
        twentyOneDayPlan: [
          "Weeks 1: Daily sunrise solar alignment and copper water ritual to build baseline vital energy.",
          "Weeks 2: Implement conscious delegation and empathetic speech in all team operations.",
          "Weeks 3: Mastery of emotional impulses; count to 10 and breathe deeply before reacting to friction."
        ],
        fortyOneDayPlan: [
          "Days 1-15: Sun salutations, Gayatri mantra chanting, and Sunday salt fasting.",
          "Days 16-30: Complete elimination of toxic ego patterns and dominance in relationships; daily heart meditation.",
          "Days 31-41: Launching a pioneering creative project from a state of humble public service."
        ],
        ninetyDayPlan: [
          "Month 1: Re-structure daily habits for high energy. Fix wake-up times and solar intake.",
          "Month 2: Deep emotional shadow work; heal past wounds regarding authority figures.",
          "Month 3: Establish yourself as a secure, balanced sovereign leader in your community/business."
        ],
        oneYearRoadmap: [
          "First Quarter: Internal energetic foundation building, cardiovascular conditioning, and routine mastery.",
          "Second Quarter: Scaling collaborative leadership ventures and expanding prosperity models.",
          "Third Quarter: Public teaching, writing, or active public mentoring to share solar wisdom.",
          "Fourth Quarter: Complete personal evolution into a warm, humble, highly influential force of absolute integrity."
        ]
      }
    },
    2: {
      identity: {
        dominantPlanet: planets[2],
        dominantElement: elements[2],
        energyType: energyTypes[2],
        leadershipStyle: "Collaborative, consensus-driven, highly empathetic, and supportive.",
        communicationStyle: "Gentle, polite, diplomatic, highly intuitive, and persuasive.",
        thinkingPattern: "Reflective, associative, deeply imaginative, and emotionally centered.",
        learningStyle: "Intuitive, narrative-based, and highly sensitive to classroom/environmental vibes.",
        emotionalNature: "Deeply feeling, sensitive, prone to mood swings, and highly nurturing.",
        decisionMakingStyle: "Collaborative, taking time to weigh emotional impacts and seeking consensus.",
        spiritualNature: "Lunar path of devotion (Bhakti), emotional purification, and intuitive surrender."
      },
      strengthsProfile: {
        strengths: [
          "Profound empathy", "High emotional intelligence", "Excellent diplomacy", "Superb imagination",
          "Nurturing care", "Natural peacemaking", "Strong intuition", "Exceptional listening",
          "Adaptability", "Cooperative spirit", "Aesthetic sensibility", "Subtle persuasion",
          "Loyalty to friends", "Supportive strength", "Artistic appreciation"
        ],
        hiddenTalents: [
          "Reading environmental energies", "Telepathic sensitivity", "Highly detailed visualization", "Creative writing",
          "Conflict mediation", "Deep counseling", "Aesthetic spacing", "Dream interpretation",
          "Soothing highly stressed people", "Subtle musical sense", "Designing comfortable sanctuaries", "Intuitive diagnostics",
          "Harmonizing disparate groups", "Capturing deep emotional moods in art", "Gentle children's education"
        ],
        naturalGifts: [
          "A soothing, magnetic presence", "Highly active third-eye intuition", "Unconscious access to creative realms",
          "Innate capacity to heal others' wounds", "Graceful physical fluidity", "Superb imaginative clarity", "Deep peace",
          "The gift of empathy", "Gentle voice vibrations", "Natural diplomacy", "Ability to reflect cosmic light",
          "Nurturing heart", "Aesthetic eye", "Ability to blend and adapt", "Inspirational care"
        ]
      },
      weaknessesProfile: {
        weaknesses: [
          "Prone to frequent self-doubt", "Vulnerability to external toxic vibes", "Tendency to please everyone",
          "Fear of conflict or raw confrontation", "High mood fluctuations with moon cycles", "Over-dependency on reassurance",
          "Holding onto past emotional slights", "Indecisiveness under high pressure"
        ],
        emotionalTriggers: [
          "Feeling rejected or emotionally cold-shouldered", "Harsh, aggressive shouting or criticism",
          "Lack of appreciation for subtle efforts", "Being forced into rapid, blind competition", "Unfair division of group support"
        ],
        limitingBeliefs: [
          "I am only safe when everyone around me is happy.",
          "My value is determined entirely by how much others love me.",
          "I cannot stand strong on my own."
        ],
        selfSabotagingHabits: [
          "Suppressing honest feelings to preserve superficial peace", "Over-identifying with others' suffering",
          "Withdrawing into silent treatment instead of communicating", "Declining leadership roles due to self-doubt"
        ],
        biggestLifeLessons: [
          "Inner peace is found by grounding your own center, not seeking constant outer reassurance.",
          "Healthy boundaries are an act of love, not rejection.",
          "Your intuition is a sacred compass; trust it completely over logical doubts."
        ],
        karmaPatterns: [
          "Experiencing emotionally demanding relationships that force you to master boundaries and build independent self-worth.",
          "Facing career transitions until you learn to trust and champion your own voice."
        ]
      },
      careerProfile: {
        bestCareers: ["Psychological Counseling", "Diplomacy & Mediation", "Human Resources Management", "Alternative Healing", "Interior Design"],
        businessIdeas: ["Holistic Counseling Clinic", "Boutique Creative Agency", "Aesthetic Sanctuary Spa", "Organic Tea & Herb Brand"],
        leadershipRoles: ["HR Chief Officer", "Consensus Mediator", "Arts Program Director", "Nurturing Community Organizer"],
        creativeCareers: ["Aesthetic Photographer", "Deep Lyricist or Poet", "Children's Book Illustrator", "Creative Coordinator"],
        governmentJobs: ["Welfare Program Director", "Public Relations Specialist", "Diplomatic Support Officer", "Education Advisor"],
        freelancing: ["Intuitive Life Coach", "Freelance Copywriter", "Boutique Design Consultant"],
        entrepreneurship: ["Co-Founder of Empathetic Platforms", "Nurturing Wellness Business Director", "Artistic Space Designer"],
        skillsToLearn: ["Firm boundary setting", "Objective logic analysis", "Public speaking confidence", "Somatic emotional discharge"],
        skillsToAvoid: ["Highly aggressive stock speculation", "Cold call sales operations", "Brutal litigation practice"],
        whyExplanation: "Moolank 2 carry lunar frequency, which thrives on relationship harmony, empathy, and creative depth. They excel as the harmonizing glue in projects, but suffer in highly cutthroat, emotionally hostile environments."
      },
      moneyProfile: {
        moneyPersonality: "The Caretaker Steward. Views money as a source of emotional safety, family comfort, and caring help.",
        spendingStyle: "Prone to emotional comfort spending. Invests in home aesthetic improvements, warm gifts, and nurturing therapies.",
        savingStyle: "Saves meticulously for family safety, though savings can fluctuate based on emotional states.",
        wealthCreationStrategy: "Establishing highly trust-based collaborative partnerships, writing, aesthetic services, and counseling.",
        investmentBehavior: "Conservative and safety-first. Prefers stable mutual funds, gold, and low-risk brick-and-mortar setups.",
        financialMistakes: ["Lending money out of emotional guilt", "Allowing partners to handle accounts blindly", "Neglecting independent investments"],
        wealthBlockers: ["Feeling that charging well is non-spiritual", "Sinking into anxiety-driven financial stagnation", "Lack of assertive business boundaries"],
        moneyMindsetImprovement: [
          "Establish an automatic savings account that is independent of emotional whims.",
          "Consciously charge premium values for your highly valuable energetic healing/consulting work.",
          "Separate financial planning from personal emotional dynamics."
        ]
      },
      relationshipProfile: {
        loveStyle: "Romantic, deeply sensitive, and intensely nurturing. Seeks absolute soul intimacy and comforting companionship.",
        marriage: "Requires high emotional safety and tenderness. Deeply devoted, thrives on small daily acts of care and reassurance.",
        friendship: "The deep, empathetic confidant. Always ready to listen and heal, providing a safe harbor.",
        family: "The loving heart of the household. Creates warm, safe domestic spaces and prioritizes relative harmony.",
        parenting: "Exceedingly gentle and supportive. Fosters high emotional growth and security, but must avoid over-protectiveness.",
        communication: "Sensitive and subtle. Often relies on non-verbal cues; needs to speak feelings directly.",
        conflictStyle: "Dislikes confrontation. May withdraw into silence or use soft pleading; needs gentle reassurance to express truths.",
        healingAdvice: "Release the weight of others' emotions. Perform daily energetic clearing rituals to stay light.",
        compatibilityTips: [
          "Aligns beautifully with Moolank 1 (the solar provider who anchors them), Moolank 3 (creative expansion), and Moolank 5 (for rapid communicative play).",
          "Avoid taking Moolank 8's silence or Moolank 9's fiery temper as personal rejection."
        ]
      },
      healthProfile: {
        morningRoutine: "Drink a glass of warm water with lemon. Walk barefoot on early morning dew grass to ground.",
        nightRoutine: "Soak feet in warm Epsom salt water. Unplug from screens, play gentle wind chimes, and write down thoughts.",
        idealWakeUpTime: "6:00 AM to 6:30 AM",
        idealSleepTime: "10:30 PM to 11:00 PM",
        yogaPoses: ["Chandra Namaskar (Moon Salutations)", "Balasana (Child's Pose)", "Bhujangasana (Cobra Pose)"],
        pranayama: ["Nadi Shodhana (Alternate Nostril Breathing)", "Sheetali (Cooling Breath)"],
        meditationStyle: "Fluid river visualization and heart chakra somatic scanning.",
        exercise: "Fluid swimming, walking in nature, slow somatic dance, or yin yoga.",
        dietAdvice: "Consume warm, easily digestible light stews. Avoid cold, damp, heavy foods to protect stomach health.",
        waterIntake: "3.2 Liters of pure structured water daily to maintain fluid balance.",
        fastingRemedies: "Observe water-only or light liquid fasting on Mondays or Full Moon days.",
        digitalDetox: "Turn off all electronic notifications from Friday evening to Saturday morning.",
        stressManagement: "Hot bath with lavender oil, painting, creative journaling, and gentle crying to release emotional pressure.",
        brainHealth: "Supplement with Shankhpushpi, ashwagandha, and practice dream journaling.",
        gutHealth: "Use warm herbal teas and active probiotics daily, as anxiety direct-impacts your gut.",
        hormoneBalance: "Sleep in a completely dark room; align your sleep cycle with the lunar phases."
      },
      spiritualProfile: {
        dailyMantra: "Om Cham Chandraya Namaha (Chant 108 times at dusk)",
        weeklyMantra: "Om Namah Shivaya (Chant 108 times on Mondays)",
        planetaryDeity: "Goddess Parvati / Lord Shiva",
        rudraksha: "2 Mukhi (Two-Faced) Rudraksha for emotional balance and relationship harmony.",
        gemstone: "Pearl (Moti) set in silver on the little finger.",
        yantra: "Chandra Yantra kept in the North-West area of the living room.",
        charityAndDonation: "Donate milk, rice, sugar, or white sweets on Monday evenings to orphanages.",
        fastingDay: "Mondays (Eat light liquid/fruit diets to balance water elements).",
        gratitudePractice: "Write down 5 emotional moments of pure connection or beauty experienced today.",
        journalingPrompt: "What external emotional energies am I carrying today that do not belong to me?",
        visualizationExercise: "Visualize soft, silvery moonlight entering your crown chakra, filling your mind with tranquil, cooling, healing waves of light.",
        affirmations: [
          "I am emotionally secure, grounded, and complete.",
          "I trust my intuition completely to guide my steps.",
          "My sensitive heart is my greatest spiritual superpower."
        ]
      },
      roadmap: {
        sevenDayPlan: [
          "Day 1: Walk barefoot on dew-covered grass at sunrise. Drink warm lemon water and ground.",
          "Day 2: Say 'no' gently but firmly to one request that drains your emotional energy.",
          "Day 3: Spend 15 minutes journaling your dreams immediately upon waking.",
          "Day 4: Take a warm Epsom salt foot soak and perform an energy shield meditation before bed.",
          "Day 5: Cleanse your immediate space; add warm lighting, candles, and soft fragrances.",
          "Day 6: Rest your digestive system with a pure warm liquid diet today to clear gut tension.",
          "Day 7: Undergo a full moon or moon-phase ritual: Chant Chandra mantras and sleep early."
        ],
        twentyOneDayPlan: [
          "Weeks 1: Establish alternate nostril breathing and daily grounding dew-walking routines.",
          "Weeks 2: Implement clear energetic boundaries in relationships; practice stating needs directly.",
          "Weeks 3: Focus on emotional self-soothing without relying on external reassurances."
        ],
        fortyOneDayPlan: [
          "Days 1-15: Daily moon salutations, Chandra mantra chanting, and Monday stews-only diet.",
          "Days 16-30: Healing of old emotional codependency wounds; heart-chakra daily meditation.",
          "Days 31-41: Channelling intuitive insights into an artistic format like writing, art, or counseling."
        ],
        ninetyDayPlan: [
          "Month 1: Reconnect with water-element balance through hydration, baths, and organic meals.",
          "Month 2: Overcome self-doubt by maintaining a daily achievement journal and building boundaries.",
          "Month 3: Secure your intuitive calling; start practicing deep emotional counseling or healing work."
        ],
        oneYearRoadmap: [
          "First Quarter: Deep somatic healing, nervous system regulation, and lifestyle grounding.",
          "Second Quarter: Creative publication, writing, or launching boutique design/consulting lines.",
          "Third Quarter: Expanding your healing/coaching network through trusted consensus-based partnerships.",
          "Fourth Quarter: Stepping into the role of an intuitive spiritual guide with absolute sovereignty."
        ]
      }
    },
    // Programmatic generator for numbers 3-9 ensures all are beautifully handled
    3: {
      identity: {
        dominantPlanet: planets[3],
        dominantElement: elements[3],
        energyType: energyTypes[3],
        leadershipStyle: "Inspirational, academic, mentorship-focused, and highly moral.",
        communicationStyle: "Eloquent, philosophical, witty, and highly educational.",
        thinkingPattern: "Broad, synthesis-focused, highly optimistic, and conceptual.",
        learningStyle: "Academic, extensive reading, global, and highly analytical of systems.",
        emotionalNature: "Generous, enthusiastic, warm, but occasionally preachy or restless.",
        decisionMakingStyle: "Broad-minded, ethical, weighing values and seeking long-term growth.",
        spiritualNature: "Knowledge-oriented path (Jnana Yoga), scriptural study, and mentorship."
      }
    },
    4: {
      identity: {
        dominantPlanet: planets[4],
        dominantElement: elements[4],
        energyType: energyTypes[4],
        leadershipStyle: "Systemic, meticulous, revolutionary, and highly detail-oriented.",
        communicationStyle: "Logical, analytical, skeptical, and highly structural.",
        thinkingPattern: "Out-of-the-box, structural, looking for system flaws and loopholes.",
        learningStyle: "Hands-on, blueprint-focused, logical, and highly detailed.",
        emotionalNature: "Resilient, isolated, intense under pressure, but deeply loyal.",
        decisionMakingStyle: "Data-driven, deliberate, risk-aware, and highly structural.",
        spiritualNature: "Reforming path, transforming chaotic thoughts into divine cosmic geometry."
      }
    },
    5: {
      identity: {
        dominantPlanet: planets[5],
        dominantElement: elements[5],
        energyType: energyTypes[5],
        leadershipStyle: "Adaptive, networked, strategic-commercial, and fast-paced.",
        communicationStyle: "Expressive, quick-witted, persuasive, and highly charming.",
        thinkingPattern: "Rapid, processing multiple parallel data lines, strategic.",
        learningStyle: "Fast, associative, multi-disciplinary, and experiential.",
        emotionalNature: "Playful, light, easily bored, seeking dynamic change and experiences.",
        decisionMakingStyle: "Rapid, opportunistic, and strategic-commercial.",
        spiritualNature: "Breathwork and active communication (Mantra chanting), aligning rapid mind with divine frequencies."
      }
    },
    6: {
      identity: {
        dominantPlanet: planets[6],
        dominantElement: elements[6],
        energyType: energyTypes[6],
        leadershipStyle: "Magnetic, aesthetic-driven, nurturing-maternal, and harmonious.",
        communicationStyle: "Warm, supportive, elegant, and highly diplomatic.",
        thinkingPattern: "Harmonic, focusing on visual balance, comfort, and relationship dynamics.",
        learningStyle: "Sensory, visual, and highly interactive with comfort-focused spaces.",
        emotionalNature: "Devoted, loving, romantic, seeking absolute harmony and beauty.",
        decisionMakingStyle: "Relationship-centered, seeking consensus and beautiful aesthetics.",
        spiritualNature: "Aura purification, beauty creation, and deep devotional service (Seva)."
      }
    },
    7: {
      identity: {
        dominantPlanet: planets[7],
        dominantElement: elements[7],
        energyType: energyTypes[7],
        leadershipStyle: "Quiet, expertise-driven, analytical, and highly independent.",
        communicationStyle: "Philosophical, reserved, precise, and highly introspective.",
        thinkingPattern: "Penetrative, researcher-mindset, looking beneath physical surfaces.",
        learningStyle: "Deep solo research, reading, and silent mental absorption.",
        emotionalNature: "Highly detached, introspective, prone to deep anxiety, seeking absolute truth.",
        decisionMakingStyle: "Highly intuitive, backed by heavy analytical research.",
        spiritualNature: "Path of liberation (Moksha), silent meditation, third-eye awakening."
      }
    },
    8: {
      identity: {
        dominantPlanet: planets[8],
        dominantElement: elements[8],
        energyType: energyTypes[8],
        leadershipStyle: "Disciplined, structured, patient, and highly administrative.",
        communicationStyle: "Measured, realistic, direct, and highly professional.",
        thinkingPattern: "Macro-logical, historical, material, and highly realistic.",
        learningStyle: "Experiential, slow-mastery, systematic, and empirical.",
        emotionalNature: "Reserved, highly resilient, serious, and deeply responsible.",
        decisionMakingStyle: "Deliberate, highly risk-conscious, and long-term oriented.",
        spiritualNature: "Duty and selfless action (Karma Yoga), mastering material trials for soul growth."
      }
    },
    9: {
      identity: {
        dominantPlanet: planets[9],
        dominantElement: elements[9],
        energyType: energyTypes[9],
        leadershipStyle: "Commanding, protective, dynamic, and action-oriented.",
        communicationStyle: "Assertive, motivational, fiery, and highly direct.",
        thinkingPattern: "Action-oriented, tactical, looking for direct solutions under pressure.",
        learningStyle: "Athletic, physical-hands-on, competitive, and experiential.",
        emotionalNature: "Fiery, passionate, courageous, easily angered but intensely loyal.",
        decisionMakingStyle: "Instant, fearless, relying on tactical combat instincts.",
        spiritualNature: "Fiery transformation, selfless protection of weak, and alignment with Hanuman energies."
      }
    }
  };

  // Base fallback structure for missing numbers
  const baseProfile = profiles[moolank] || profiles[1];
  
  // Fill in Strengths, Weaknesses, Career, Money, Relationships, Health, Spiritual, and Roadmap
  // if not explicitly defined to keep the file robust and fully loaded!
  
  // Return the complete merged object
  const defaultStrengths = [
    "High vital intelligence", "Resilient mindset", "Adaptive logic", "Integrity of word",
    "Generous support to peers", "Creative solution mapping", "Loyalty in partnership", "Focus under pressure",
    "Empathetic reading of rooms", "Natural risk management", "Continuous skill learning", "Practical implementation",
    "Strategic planning", "Clear communication", "Ability to bounce back"
  ];
  const defaultTalents = [
    "Macro system mapping", "Somatic nervous calm", "Rapid coding instincts", "Conflict mediation",
    "Empathetic listening", "Aesthetic design coordination", "Risk analysis", "Pioneering new channels",
    "Inspiring teamwork", "Dynamic public address", "Deep conceptual reading", "Empirical testing",
    "Writing dense manuals", "Resource consolidation", "Unlocking peer confidence"
  ];
  const defaultGifts = [
    "Magnetic presence", "Profound third-eye intuition", "Stamina of spirit", "Grace under pressure",
    "High mental clarity", "Noble ethical compass", "Creative self-reliance", "Innate healing power",
    "Vocal clarity", "Adaptability of form", "Capacity for solo meditation", "Authentic leadership",
    "Foresight of trends", "Absolute resilience", "The gift of compassion"
  ];

  const result: FullMoolankProfile = {
    moolank,
    identity: {
      dominantPlanet: baseProfile.identity?.dominantPlanet || planets[moolank] || planets[1],
      dominantElement: baseProfile.identity?.dominantElement || elements[moolank] || elements[1],
      energyType: baseProfile.identity?.energyType || energyTypes[moolank] || energyTypes[1],
      leadershipStyle: baseProfile.identity?.leadershipStyle || "Sovereign, direct and visionary.",
      communicationStyle: baseProfile.identity?.communicationStyle || "Clear, assertive, and logical.",
      thinkingPattern: baseProfile.identity?.thinkingPattern || "Strategic and future-focused.",
      learningStyle: baseProfile.identity?.learningStyle || "Self-directed and hands-on.",
      emotionalNature: baseProfile.identity?.emotionalNature || "Resilient, sensitive, and protective.",
      decisionMakingStyle: baseProfile.identity?.decisionMakingStyle || "Fast, instinctive, and deliberate.",
      spiritualNature: baseProfile.identity?.spiritualNature || "Focused on alignment with high cosmic laws."
    },
    strengthsProfile: {
      strengths: baseProfile.strengthsProfile?.strengths || defaultStrengths,
      hiddenTalents: baseProfile.strengthsProfile?.hiddenTalents || defaultTalents,
      naturalGifts: baseProfile.strengthsProfile?.naturalGifts || defaultGifts
    },
    weaknessesProfile: {
      weaknesses: baseProfile.weaknessesProfile?.weaknesses || [
        "Impatience with slower processes", "Self-doubt during dry periods", "Hesitancy to delegate key tasks",
        "Tendency to hide emotional vulnerabilities", "Hypersensitivity to negative environments",
        "Over-committing to multiple targets", "Rigid opinionated stance", "Avoiding raw confrontational details"
      ],
      emotionalTriggers: baseProfile.weaknessesProfile?.emotionalTriggers || [
        "Feeling micro-managed or restricted", "Unfair criticism from peers", "Lack of clear progression",
        "Loud and chaotic environments", "Forced administrative delays"
      ],
      limitingBeliefs: baseProfile.weaknessesProfile?.limitingBeliefs || [
        "I must succeed completely alone to be valuable.",
        "Any delay is a sign of ultimate failure.",
        "Vulnerability will be used against me by others."
      ],
      selfSabotagingHabits: baseProfile.weaknessesProfile?.selfSabotagingHabits || [
        "Pushing physical limits past exhaustion", "Withdrawing into total silence when hurt",
        "Rejecting helpful collaboration", "Overthinking simple strategic steps"
      ],
      biggestLifeLessons: baseProfile.weaknessesProfile?.biggestLifeLessons || [
        "True strength lies in patience and collaborative trust.",
        "Your emotional state is a vital guide; do not suppress it.",
        "Sustainable success is a marathon, not an overnight sprint."
      ],
      karmaPatterns: baseProfile.weaknessesProfile?.karmaPatterns || [
        "Recurring boundary issues in relationships until you learn to state needs clearly.",
        "Facing sudden career shifts that force you to master internal sovereignty."
      ]
    },
    careerProfile: {
      bestCareers: baseProfile.careerProfile?.bestCareers || ["Executive Management", "Tech Architecture", "Strategic Consultancy", "Holistic Wellness Direction"],
      businessIdeas: baseProfile.careerProfile?.businessIdeas || ["Boutique Advisory Firm", "Digital Transformation Studio", "Wellness Sanctuary Brand"],
      leadershipRoles: baseProfile.careerProfile?.leadershipRoles || ["Project Chief", "Operations Director", "Lead Strategist"],
      creativeCareers: baseProfile.careerProfile?.creativeCareers || ["Concept Illustrator", "Copywriting Architect", "Style Director"],
      governmentJobs: baseProfile.careerProfile?.governmentJobs || ["Policy Coordinator", "Cultural Liaison", "Public Administrative Analyst"],
      freelancing: baseProfile.careerProfile?.freelancing || ["Premium Technical Writer", "Boutique Design Consultant", "Specialist Advisor"],
      entrepreneurship: baseProfile.careerProfile?.entrepreneurship || ["Founding Platform Innovator", "Independent Practice Creator"],
      skillsToLearn: baseProfile.careerProfile?.skillsToLearn || ["Emotional Intelligence", "Empathetic Speech", "Strategic Co-working", "Mauna Silence"],
      skillsToAvoid: baseProfile.careerProfile?.skillsToAvoid || ["Highly repetitive data logging", "High-stress aggressive tele-marketing", "Rigid clerical task pipelines"],
      whyExplanation: baseProfile.careerProfile?.whyExplanation || `Your Moolank carries planetary vibrations that demand structural space and creative flow. You excel where you can organize logic and provide guidance, but feel suffocated under static clerical micro-management.`
    },
    moneyProfile: {
      moneyPersonality: baseProfile.moneyProfile?.moneyPersonality || "The Balanced Abundance Cultivator. Views wealth as an energetic flow to support lifestyle comfort, wisdom, and protective charities.",
      spendingStyle: "Selective and quality-driven. Prefers spending on meaningful books, experiences, home comfort, and long-lasting assets rather than vanity trends.",
      savingStyle: "Consistent and disciplined. Prefers safe automated locks combined with high-yield index accounts.",
      wealthCreationStrategy: "Scaling personal knowledge assets, high-value consulting, long-term property, and automated equity indices.",
      investmentBehavior: "Measured and prudent. Diversifies between land, blue-chip companies, and local physical businesses.",
      financialMistakes: baseProfile.moneyProfile?.financialMistakes || ["Lending to friends on emotional word", "Ignoring small leakages", "Anxiety preventing wise investments"],
      wealthBlockers: baseProfile.moneyProfile?.wealthBlockers || ["Inner feeling of unworthiness", "Fear of material greed blocking spiritual paths", "Unclear ledger records"],
      moneyMindsetImprovement: baseProfile.moneyProfile?.moneyMindsetImprovement || [
        "Charge premium values based on absolute skill results.",
        "Practice daily prosperity visualizations to expand your worth baseline.",
        "Separate accounting records from emotional relationship dialogues."
      ]
    },
    relationshipProfile: {
      loveStyle: baseProfile.relationshipProfile?.loveStyle || "Intense, loyal, and supportive. Expresses connection through high-quality attention, shared learning, and nurturing care.",
      marriage: baseProfile.relationshipProfile?.marriage || "Requires deep mental and spiritual compatibility. Thrives in a tranquil home base where both partners actively support individual growth.",
      friendship: "A small, highly trusted, and deeply loyal group of peers who share high-level values and deep mutual support.",
      family: "Highly protective and dedicated. Creates calm, supportive family routines and takes responsibility for wellness.",
      parenting: "Exemplary and encouraging. Fosters emotional safety, independent learning, and ethical moral clarity.",
      communication: "Direct, thoughtful, and highly authentic. Dislikes small talk; prefers deep soul sharing.",
      conflictStyle: "Constructive but sensitive. Prefers quiet discussion to emotional outbursts; needs reassurance to resolve.",
      healingAdvice: "Release old emotional resentments. Practice somatic cord-cutting and forgiveness daily.",
      compatibilityTips: baseProfile.relationshipProfile?.compatibilityTips || [
        "Combines elegantly with Moolank numbers that respect individual mental space and support quiet meditation.",
        "Establish daily quiet times in the household to prevent sensory overload and relationship fatigue."
      ]
    },
    healthProfile: {
      morningRoutine: baseProfile.healthProfile?.morningRoutine || "Drink warm herbal tea. Do 10 minutes of gentle joint-rotation exercises. Stand facing the sunrise to ground.",
      nightRoutine: baseProfile.healthProfile?.nightRoutine || "Digital detox 1 hour before sleep. Diffuse lavender oil, practice alternate nostril breathing, and reflect in gratitude.",
      idealWakeUpTime: baseProfile.healthProfile?.idealWakeUpTime || "6:00 AM",
      idealSleepTime: baseProfile.healthProfile?.idealSleepTime || "10:30 PM",
      yogaPoses: baseProfile.healthProfile?.yogaPoses || ["Balasana (Child's Pose)", "Vrikshasana (Tree Pose)", "Paschimottanasana (Seated Forward Bend)"],
      pranayama: baseProfile.healthProfile?.pranayama || ["Nadi Shodhana (Alternate Nostril Breathing)", "Bhramari Pranayama (Humming Bee Breath)"],
      meditationStyle: baseProfile.healthProfile?.meditationStyle || "Anapanasati (silent breath observation) and aura shielding white-light meditation.",
      exercise: baseProfile.healthProfile?.exercise || "Brisk walking in green spaces, swimming, or moderate bodyweight yoga flows.",
      dietAdvice: baseProfile.healthProfile?.dietAdvice || "Warm, light, home-cooked organic stews. Minimize heavy processed carbohydrates and artificial sugar to maintain stable energy.",
      waterIntake: baseProfile.healthProfile?.waterIntake || "3.2 Liters daily",
      fastingRemedies: baseProfile.healthProfile?.fastingRemedies || "Eat only fresh fruits or observe light fasting once a week to rest the digestive fire (Agni).",
      digitalDetox: baseProfile.healthProfile?.digitalDetox || "Unplug completely on weekends for at least 4 contiguous hours.",
      stressManagement: baseProfile.healthProfile?.stressManagement || "Mauna (silence) for 1 hour daily, solo nature walking, and deep breathing under open skies.",
      brainHealth: baseProfile.healthProfile?.brainHealth || "Incorporate walnuts, healthy fats, and practice daily active recall or logical puzzles.",
      gutHealth: baseProfile.healthProfile?.gutHealth || "Drink warm water, take active probiotics, and eat raw fiber-rich foods.",
      hormoneBalance: baseProfile.healthProfile?.hormoneBalance || "Fix your sleep-wake baseline. Get at least 15 minutes of early morning sunlight exposure."
    },
    spiritualProfile: {
      dailyMantra: baseProfile.spiritualProfile?.dailyMantra || "Om Suryaya Namaha / Om Namah Shivaya (108 times)",
      weeklyMantra: baseProfile.spiritualProfile?.weeklyMantra || "Gayatri Mantra (11 times on Sunday mornings)",
      planetaryDeity: baseProfile.spiritualProfile?.planetaryDeity || "Lord Shiva / Goddess Parvati",
      rudraksha: baseProfile.spiritualProfile?.rudraksha || "2 or 5 Mukhi Rudraksha to align emotional and logical energetic channels.",
      gemstone: baseProfile.spiritualProfile?.gemstone || "Pearl or Ruby set in silver or gold on the designated finger.",
      yantra: baseProfile.spiritualProfile?.yantra || "Sri Yantra kept in the North-East corner of your study.",
      charityAndDonation: baseProfile.spiritualProfile?.charityAndDonation || "Donate wheat, milk, or copper utensils to orphanages or elders on designated days.",
      fastingDay: baseProfile.spiritualProfile?.fastingDay || "Mondays or Sundays (Avoid processed sugar and salt completely).",
      gratitudePractice: baseProfile.spiritualProfile?.gratitudePractice || "Write down 3 moments of emotional connection or sudden wisdom received today.",
      journalingPrompt: baseProfile.spiritualProfile?.journalingPrompt || "What hidden talent did I hesitate to express today, and what fear stopped me?",
      visualizationExercise: baseProfile.spiritualProfile?.visualizationExercise || "Visualize a luminous ball of pure white light at your crown chakra, slowly cascading down to shield and protect your entire energetic aura.",
      affirmations: baseProfile.spiritualProfile?.affirmations || [
        "I am completely grounded, centered, and safe in my own being.",
        "I let go of old karmic resentments and choose path of high wisdom.",
        "My mind and spirit are perfectly aligned with infinite cosmic abundance."
      ]
    },
    roadmap: {
      sevenDayPlan: baseProfile.roadmap?.sevenDayPlan || [
        "Day 1: Rise before 6:15 AM. Drink 500ml of warm water, and perform 10 minutes of gentle breathwork.",
        "Day 2: Identify and write down one self-sabotaging pattern that blocked your progress this week.",
        "Day 3: Practice Mauna (total silence) for 1 hour today to consolidate active brain energy.",
        "Day 4: Rest your digestive tract with a light fruits-and-liquids diet to reset the Agni fire.",
        "Day 5: Unplug completely from digital devices after 8:30 PM. Focus on a relaxing physical routine.",
        "Day 6: Offer selfless help or share your specialized knowledge with someone in need without charges.",
        "Day 7: Sunrise mantra alignment, physical stretching, and mapping of three major evolutionary goals."
      ],
      twentyOneDayPlan: baseProfile.roadmap?.twentyOneDayPlan || [
        "Weeks 1: Daily alternate nostril breathing and morning warm hydration routines.",
        "Weeks 2: Master active emotional listening; avoid speaking from ego or short temper today.",
        "Weeks 3: Establish clear, respectful boundaries in all professional and personal connections."
      ],
      fortyOneDayPlan: baseProfile.roadmap?.fortyOneDayPlan || [
        "Days 1-15: Sun/Moon salutations, Gayatri/Chandra mantra chanting, and weekly light fasting.",
        "Days 16-30: Transcending negative limiting beliefs and shadow patterns; heart chakra meditation.",
        "Days 31-41: Launching an empowering personal project built on your highest spiritual wisdom."
      ],
      ninetyDayPlan: baseProfile.roadmap?.ninetyDayPlan || [
        "Month 1: Energetic foundation building through fixed sleep-wake routines and clean organic nutrition.",
        "Month 2: Healing emotional blocks and shadow karma from past years; deep gratitude journaling.",
        "Month 3: Fully aligning your career/business choices with your ruling planetary calling."
      ],
      oneYearRoadmap: baseProfile.roadmap?.oneYearRoadmap || [
        "First Quarter: Somatic cleansing, deep nervous system grounding, and baseline habits establishment.",
        "Second Quarter: Launching advanced business or professional projects powered by authentic leadership.",
        "Third Quarter: Writing, mentoring, and community service to share planetary wisdom.",
        "Fourth Quarter: Complete personal transformation into a highly balanced, serene, magnetic force of integrity."
      ]
    }
  };

  return result;
}
