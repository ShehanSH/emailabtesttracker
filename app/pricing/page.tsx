import { auth } from "@/lib/auth";
import { PLAN_PRICING, PLAN_LIMITS, type Plan } from "@/lib/plans";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckoutButton } from "@/components/pricing/checkout-button";
import { Check, Zap, Users, Crown, Rocket } from "lucide-react";
import Link from "next/link";

export default async function PricingPage() {
  const session = await auth();
  const currentPlan = (session?.user?.plan ?? "free") as Plan;
  const isStripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY);


  const plans: Plan[] = ["free", "solo", "agency", "pro"];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Simple, transparent pricing
        </h1>
        <p className="text-lg text-muted-foreground">
          Choose the plan that fits your needs. Upgrade or downgrade anytime.
        </p>
        {!isStripeConfigured && (
          <div className="mt-4 p-3 bg-warning-bg border border-border rounded-lg max-w-2xl mx-auto">
            <p className="text-sm text-warning">
              ⚠️ Stripe payment is not configured. You can use the free plan. Paid plans will be available once Stripe is set up.
            </p>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => {
          const limits = PLAN_LIMITS[plan];
          const pricing = PLAN_PRICING[plan];
          const isCurrentPlan = plan === currentPlan;
          const isPopular = plan === "solo";

          return (
            <Card
              key={plan}
              className={`relative space-y-6 ${
                isPopular ? "ring-2 ring-primary" : ""
              } ${isCurrentPlan ? "bg-muted" : ""}`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="success" className="px-3 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-semibold text-foreground capitalize">
                    {plan}
                  </h3>
                  {plan === "free" && <Zap className="h-5 w-5 text-muted-foreground" />}
                  {plan === "solo" && <Rocket className="h-5 w-5 text-primary" />}
                  {plan === "agency" && <Users className="h-5 w-5 text-accent" />}
                  {plan === "pro" && <Crown className="h-5 w-5 text-warning" />}
                </div>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-foreground">
                    ${pricing.monthly}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                  {pricing.yearly && (
                    <p className="text-sm text-muted-foreground mt-1">
                      ${pricing.yearly}/year (save 17%)
                    </p>
                  )}
                </div>
              </div>

              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm">
                  <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    {limits.maxTemplates === -1
                      ? "Unlimited templates"
                      : `${limits.maxTemplates} templates`}
                  </span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  {limits.features.abTesting ? (
                    <>
                      <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">
                        {limits.maxAbTests === -1
                          ? "Unlimited A/B tests"
                          : `${limits.maxAbTests} A/B tests`}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">No A/B testing</span>
                    </>
                  )}
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    {limits.maxTeamMembers === -1
                      ? "Unlimited team members"
                      : `${limits.maxTeamMembers} team member${limits.maxTeamMembers !== 1 ? "s" : ""}`}
                  </span>
                </li>
                {limits.features.advancedAnalytics && (
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Advanced analytics</span>
                  </li>
                )}
                {limits.features.teamCollaboration && (
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Team collaboration</span>
                  </li>
                )}
                {limits.features.apiAccess && (
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">API access</span>
                  </li>
                )}
                {limits.features.whiteLabel && (
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">White-label option</span>
                  </li>
                )}
                {limits.features.exportReports && (
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Export reports</span>
                  </li>
                )}
              </ul>

              {plan === "free" ? (
                <Link href="/signup">
                  <Button variant="secondary" className="w-full">
                    Get Started
                  </Button>
                </Link>
              ) : (
                <CheckoutButton plan={plan} currentPlan={currentPlan} />
              )}
            </Card>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground">
          All plans include email support. Need help?{" "}
          <Link href="mailto:support@example.com" className="text-primary hover:underline">
            Contact us
          </Link>
        </p>
      </div>
    </div>
  );
}

