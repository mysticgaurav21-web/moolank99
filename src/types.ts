export interface CategoryDetail {
  title: string;
  summary: string;
  deepInsight: string;
  strengths: string[];
  challenges: string[];
  actionableTips: string[];
}

export interface CanonicalTrait {
  traitId: string;
  moolank: number;
  traitName: string;
  slug: string;
  version: string;
  status: "canonical" | "draft" | "deprecated";
  classification: string;
  primaryDomain: string;
  canonicalDefinition: string;
  corePattern: {
    trigger: string;
    internalResponse: string;
    behaviour: string;
    possibleConsequence: string;
  };
  balancedExpression: string[];
  shadowExpression: string[];
  primaryTriggers: string[];
  internalDrivers: string[];
  protectiveFactors: string[];
  traitBoundaries: Record<string, string>;
  appCard: {
    strength: string;
    shadow: string;
    growthKey: string;
  };
  appSafeSummary: string;
  excludedClaims: string[];
  confidence: Record<string, string>;
  safetyNote: string;
}

export interface MoolankReading {
  success: boolean;
  moolank: number;
  bhagyank: number;
  namank: number;
  rulingPlanet: string;
  rulingPlanetDeity: string;
  gemstone: string;
  luckyColors: string[];
  luckyDays: string[];
  luckyNumbers: number[];
  friendlyNumbers: number[];
  neutralNumbers: number[];
  enemyNumbers: number[];
  radicalRemedy: string;
  canonicalTraits?: CanonicalTrait[];
  isFallback?: boolean;
  fallbackReason?: string;
  categories: {
    personality: CategoryDetail;
    relationships: CategoryDetail;
    career: CategoryDetail;
    money: CategoryDetail;
    growth: CategoryDetail;
    health: CategoryDetail;
    purpose: CategoryDetail;
    potential: CategoryDetail;
  };
}

export interface CompatibilityResult {
  success: boolean;
  person1: { moolank: number; bhagyank: number };
  person2: { moolank: number; bhagyank: number };
  loveScore: number;
  friendshipScore: number;
  businessScore: number;
  summary: string;
  mutualStrengths: string[];
  mutualChallenges: string[];
  cosmicAdvice: string;
  isFallback?: boolean;
  fallbackReason?: string;
}

export interface DailyForecast {
  success: boolean;
  moolank: number;
  targetDate: string;
  personalDayNumber: number;
  theme: string;
  forecast: string;
  dos: string[];
  donts: string[];
  luckyHours: string;
  isFallback?: boolean;
  fallbackReason?: string;
}
