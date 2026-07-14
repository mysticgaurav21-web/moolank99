import impulseControl from "../../knowledge/canonical/moolank-1/ID-016-impulse-control.v1.2.json";

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

const knowledgeByMoolank: Readonly<Record<number, readonly CanonicalTrait[]>> = {
  1: [impulseControl as CanonicalTrait]
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
