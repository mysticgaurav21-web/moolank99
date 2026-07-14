import impulseControl from "../../knowledge/canonical/moolank-1/ID-016-impulse-control.v1.2.json";
import leadershipStyle from "../../knowledge/canonical/moolank-1/M1-R001-leadership-style.v1.0.json";
import initiativeAndProactivity from "../../knowledge/canonical/moolank-1/M1-R002-initiative-and-proactivity.v1.0.json";
import independenceAndAutonomy from "../../knowledge/canonical/moolank-1/M1-R003-independence-and-autonomy.v1.0.json";

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
  manifestationAreas: Record<string, string[]>;
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
  sourceReferences: Array<{
    sourceType: string;
    publisher: string;
    url: string;
    usage: string;
  }>;
  safetyNote: string;
  lastReviewed: string;
}

const knowledgeByMoolank: Readonly<Record<number, readonly CanonicalTrait[]>> = {
  1: [
    leadershipStyle as CanonicalTrait,
    initiativeAndProactivity as CanonicalTrait,
    independenceAndAutonomy as CanonicalTrait,
    impulseControl as CanonicalTrait
  ]
};

export function getCanonicalTraits(moolank: number): CanonicalTrait[] {
  return [...(knowledgeByMoolank[moolank] ?? [])];
}

export function getCanonicalTrait(
  moolank: number,
  traitId: string
): CanonicalTrait | undefined {
  return knowledgeByMoolank[moolank]?.find((trait) => trait.traitId === traitId);
}
