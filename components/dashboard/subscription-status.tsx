"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getPlanLimits, PLAN_PRICING, type Plan } from "@/lib/plans";
import { Crown, Zap } from "lucide-react";

interface SubscriptionStatusProps {
  plan: Plan;
  subscription?: {
    stripeId?: string | null;
    status?: string | null;
    renewsAt?: Date | string | null;
  } | null;
}

export function SubscriptionStatus({
  plan,
  subscription,
}: SubscriptionStatusProps) {
  const limits = getPlanLimits(plan);
  const pricing = PLAN_PRICING[plan];

  const isPaid = plan !== "free";
  const isActive =
    isPaid &&
    subscription?.status === "active" &&
    (!subscription.renewsAt || 
     (subscription.renewsAt && new Date(subscription.renewsAt) > new Date()));

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Current Plan
            </h3>
            <Badge variant={isPaid ? "success" : "default"}>
              {plan.charAt(0).toUpperCase() + plan.slice(1)}
            </Badge>
          </div>
          <p className="text-sm text-gray-600">
            {isPaid
              ? `$${pricing.monthly}/month`
              : "Free tier - Upgrade for more features"}
          </p>
        </div>
        {isPaid && isActive && subscription?.renewsAt && (
          <div className="text-right">
            <p className="text-xs text-gray-500">Renews on</p>
            <p className="text-sm font-medium text-gray-900">
              {new Date(subscription.renewsAt).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Templates</span>
          <span className="font-medium text-gray-900">
            {limits.maxTemplates === -1 ? "Unlimited" : limits.maxTemplates}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">A/B Tests</span>
          <span className="font-medium text-gray-900">
            {limits.maxAbTests === -1
              ? "Unlimited"
              : limits.maxAbTests === 0
              ? "Not available"
              : limits.maxAbTests}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Team Members</span>
          <span className="font-medium text-gray-900">
            {limits.maxTeamMembers === -1
              ? "Unlimited"
              : limits.maxTeamMembers}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {limits.features.abTesting && (
          <Badge variant="success" className="gap-1">
            <Zap className="h-3 w-3" />
            A/B Testing
          </Badge>
        )}
        {limits.features.advancedAnalytics && (
          <Badge variant="success" className="gap-1">
            <Crown className="h-3 w-3" />
            Advanced Analytics
          </Badge>
        )}
        {limits.features.apiAccess && (
          <Badge variant="success" className="gap-1">
            API Access
          </Badge>
        )}
        {limits.features.teamCollaboration && (
          <Badge variant="success" className="gap-1">
            Team Collaboration
          </Badge>
        )}
      </div>

      {plan === "free" && (
        <Link href="/pricing">
          <Button className="w-full">Upgrade Plan</Button>
        </Link>
      )}

      {isPaid && !isActive && (
        <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
          Your subscription has expired. Please renew to continue using premium
          features.
        </div>
      )}
    </Card>
  );
}

