import type { Plan as FirestorePlan } from "@/types/firestore";

export type Plan = FirestorePlan;

export interface PlanLimits {
  maxTemplates: number;
  maxAbTests: number;
  maxTeamMembers: number;
  features: {
    abTesting: boolean;
    advancedAnalytics: boolean;
    apiAccess: boolean;
    whiteLabel: boolean;
    teamCollaboration: boolean;
    exportReports: boolean;
  };
}

export const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  free: {
    maxTemplates: 5,
    maxAbTests: 0, // No A/B testing on free plan
    maxTeamMembers: 1,
    features: {
      abTesting: false,
      advancedAnalytics: false,
      apiAccess: false,
      whiteLabel: false,
      teamCollaboration: false,
      exportReports: false,
    },
  },
  solo: {
    maxTemplates: -1, // Unlimited
    maxAbTests: -1, // Unlimited
    maxTeamMembers: 1,
    features: {
      abTesting: true,
      advancedAnalytics: false,
      apiAccess: false,
      whiteLabel: false,
      teamCollaboration: false,
      exportReports: true,
    },
  },
  agency: {
    maxTemplates: -1, // Unlimited
    maxAbTests: -1, // Unlimited
    maxTeamMembers: 10,
    features: {
      abTesting: true,
      advancedAnalytics: true,
      apiAccess: false,
      whiteLabel: false,
      teamCollaboration: true,
      exportReports: true,
    },
  },
  pro: {
    maxTemplates: -1, // Unlimited
    maxAbTests: -1, // Unlimited
    maxTeamMembers: -1, // Unlimited
    features: {
      abTesting: true,
      advancedAnalytics: true,
      apiAccess: true,
      whiteLabel: true,
      teamCollaboration: true,
      exportReports: true,
    },
  },
};

export const PLAN_PRICING: Record<Plan, { monthly: number; yearly?: number }> = {
  free: { monthly: 0 },
  solo: { monthly: 19, yearly: 190 }, // ~17% discount
  agency: { monthly: 49, yearly: 490 },
  pro: { monthly: 99, yearly: 990 },
};

export function getPlanLimits(plan: Plan): PlanLimits {
  return PLAN_LIMITS[plan] ?? PLAN_LIMITS.free;
}

export function canUseFeature(plan: Plan, feature: keyof PlanLimits["features"]): boolean {
  const limits = getPlanLimits(plan);
  return limits.features[feature];
}

export function checkTemplateLimit(plan: Plan, currentCount: number): {
  allowed: boolean;
  limit: number;
  remaining: number;
} {
  const limits = getPlanLimits(plan);
  const limit = limits.maxTemplates;
  
  if (limit === -1) {
    return { allowed: true, limit: -1, remaining: -1 };
  }
  
  return {
    allowed: currentCount < limit,
    limit,
    remaining: Math.max(0, limit - currentCount),
  };
}

export function checkAbTestLimit(plan: Plan, currentCount: number): {
  allowed: boolean;
  limit: number;
  remaining: number;
} {
  const limits = getPlanLimits(plan);
  const limit = limits.maxAbTests;
  
  if (limit === -1) {
    return { allowed: true, limit: -1, remaining: -1 };
  }
  
  return {
    allowed: currentCount < limit,
    limit,
    remaining: Math.max(0, limit - currentCount),
  };
}

