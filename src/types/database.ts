export type UUID = string;
export type ISODate = string;
export type ISODateTime = string;

export type OnboardingStatus = 'pending' | 'in_progress' | 'completed';
export type ProfileType = 'self' | 'family' | 'partner' | 'friend' | 'child' | 'client';
export type ConfidenceLevel = 'low' | 'medium' | 'high';
export type EvidenceClass =
  | 'traditional_wisdom'
  | 'behavioural_science'
  | 'reflective_practice'
  | 'internal_framework'
  | 'user_experience'
  | 'mixed';

export interface UserProfileRecord {
  id: UUID;
  authUserId: UUID;
  displayName: string | null;
  preferredName: string | null;
  languageCode: string;
  countryCode: string | null;
  timezone: string;
  onboardingStatus: OnboardingStatus;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface PersonalProfileRecord {
  id: UUID;
  ownerUserId: UUID;
  profileType: ProfileType;
  name: string;
  dateOfBirth: ISODate;
  birthTime: string | null;
  birthPlace: string | null;
  gender: string | null;
  languageCode: string;
  isPrimary: boolean;
  consentStatus: 'owner_confirmed' | 'pending' | 'granted' | 'revoked' | 'not_required';
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface BirthBlueprintRecord {
  id: UUID;
  profileId: UUID;
  calculationVersion: string;
  moolank: number;
  bhagyank: number;
  namank: number;
  namankCompound: number | null;
  birthDayCompound: number | null;
  lifePathCompound: number | null;
  calculatedName: string | null;
  calculatedAt: ISODateTime;
  isActive: boolean;
  createdAt: ISODateTime;
}

export interface DailyCheckinInput {
  profileId: UUID;
  checkinDate?: ISODate;
  moodScore: 1 | 2 | 3 | 4 | 5;
  energyScore: 1 | 2 | 3 | 4 | 5;
  stressScore: 1 | 2 | 3 | 4 | 5;
  focusScore: 1 | 2 | 3 | 4 | 5;
  sleepQuality: 1 | 2 | 3 | 4 | 5;
  sleepHours?: number | null;
  primaryChallenge?: string | null;
  notes?: string | null;
}

export interface HumanStateDimension {
  status: string;
  score: 1 | 2 | 3 | 4 | 5;
  confidence: ConfidenceLevel;
  basedOn: string[];
}

export interface HumanStateSnapshotRecord {
  id: UUID;
  profileId: UUID;
  snapshotDate: ISODate;
  stateVersion: string;
  overallState: Record<string, HumanStateDimension>;
  priorityNeeds: string[];
  supportiveStrengths: string[];
  riskFlags: string[];
  generatedBy: 'rules' | 'ai' | 'rules_plus_ai' | 'manual';
  userConfirmed: boolean;
  createdAt: ISODateTime;
}

export interface KnowledgeNodeRecord {
  id: UUID;
  nodeCode: string;
  nodeName: string;
  domainKey: string;
  moduleKey: string | null;
  nodeType: string;
  stabilityType: 'stable' | 'adaptive' | 'dynamic';
  definition: string;
  deepMeaning: string | null;
  whyItMatters: string | null;
  positiveExpression: string | null;
  shadowExpression: string | null;
  evidenceClass: EvidenceClass;
  confidenceLevel: ConfidenceLevel;
  status: 'draft' | 'review' | 'published' | 'archived';
  version: number;
  languageCode: string;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface GoalRecord {
  id: UUID;
  profileId: UUID;
  title: string;
  goalDomain: string;
  desiredIdentity: string | null;
  successDefinition: string | null;
  targetDate: ISODate | null;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'archived';
  priority: 1 | 2 | 3 | 4 | 5;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface TransformationPlanRecord {
  id: UUID;
  profileId: UUID;
  goalId: UUID | null;
  planType: '7_day' | '21_day' | '41_day' | '90_day' | '365_day' | 'custom';
  title: string;
  startDate: ISODate;
  endDate: ISODate;
  focusNodeIds: UUID[];
  planJson: Record<string, unknown>;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  generationSource: 'rules' | 'ai' | 'rules_plus_ai' | 'manual';
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface PracticeLogInput {
  profileId: UUID;
  transformationPlanId?: UUID | null;
  practiceCode: string;
  completedAt?: ISODateTime;
  durationMinutes?: number | null;
  preState?: Record<string, unknown> | null;
  postState?: Record<string, unknown> | null;
  difficultyScore?: 1 | 2 | 3 | 4 | 5 | null;
  benefitScore?: 1 | 2 | 3 | 4 | 5 | null;
  notes?: string | null;
}
