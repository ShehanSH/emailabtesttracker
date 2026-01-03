export type Plan = "free" | "solo" | "agency" | "pro";

export interface UserProfile {
  id?: string;
  email: string;
  name?: string;
  plan: Plan;
  createdAt?: Date;
  subscription?: {
    stripeId?: string;
    status?: string;
    renewsAt?: Date | null;
  };
}

export interface Template {
  id?: string;
  userId: string;
  name: string;
  campaignType?: string;
  createdAt?: Date;
  isLatestVersion?: boolean;
  metadata?: {
    subject?: string;
    preview?: string;
    tags?: string[];
  };
}

export interface TemplateVersion {
  id?: string;
  templateId: string;
  versionNumber: string;
  htmlContent: string;
  createdAt?: Date;
  createdBy?: string;
  changes?: Array<{
    field: string;
    oldValue: string | null;
    newValue: string | null;
  }>;
  performanceMetrics?: {
    opens: number;
    clicks: number;
    ctr: number;
    conversions?: number;
    revenue?: number;
  };
}

export interface AbTestResult {
  opens: number;
  clicks: number;
  conversions?: number;
  revenue?: number;
  ctr: number;
}

export interface AbTest {
  id?: string;
  userId: string;
  templateVersionIdA: string;
  templateVersionIdB: string;
  campaignName: string;
  startDate: Date;
  endDate?: Date;
  audienceSize: number;
  status: "running" | "completed" | "archived";
  trackingUrls: {
    versionA: string;
    versionB: string;
  };
  results?: {
    versionA: AbTestResult;
    versionB: AbTestResult;
    winner: "versionA" | "versionB" | null;
    statisticalSignificance?: number;
  };
}

