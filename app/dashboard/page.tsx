import Link from "next/link";
import { redirect } from "next/navigation";
import { BarChart3, FilePlus2, Link2, Rocket } from "lucide-react";
import { auth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { SubscriptionStatus } from "@/components/dashboard/subscription-status";
import { RecentTests } from "@/components/dashboard/recent-tests";
import { InsightsSection } from "@/components/dashboard/insights-section";
import { adminDb } from "@/lib/firebase/admin";
import { canUseFeature, type Plan } from "@/lib/plans";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const plan = (session.user.plan ?? "free") as Plan;
  const canCreateAbTest = canUseFeature(plan, "abTesting");

  // Fetch user subscription details
  let subscription = null;
  try {
    const userDoc = await adminDb().collection("users").doc(session.user.id).get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      const subData = userData?.subscription;
      
      if (subData) {
        // Convert Firestore Timestamp to ISO string for Client Component serialization
        let renewsAt: Date | string | null = null;
        if (subData.renewsAt) {
          if (subData.renewsAt.toDate) {
            // Firestore Timestamp
            renewsAt = subData.renewsAt.toDate().toISOString();
          } else if (subData.renewsAt instanceof Date) {
            // Already a Date object
            renewsAt = subData.renewsAt.toISOString();
          } else if (typeof subData.renewsAt === 'string') {
            // Already a string
            renewsAt = subData.renewsAt;
          }
        }
        
        subscription = {
          stripeId: subData.stripeId || null,
          status: subData.status || null,
          renewsAt,
        };
      }
    }
  } catch (error) {
    console.error("[DASHBOARD_USER_FETCH]", error);
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">Workspace</p>
          <h1 className="text-2xl font-semibold text-gray-900">
            {session.user.name ?? session.user.email}
          </h1>
          <p className="text-sm text-gray-600">
            Plan: {plan} • Firebase-backed, real-time updates
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/templates/new">
            <Button className="gap-2">
              <FilePlus2 className="h-4 w-4" />
              New template
            </Button>
          </Link>
          {canCreateAbTest ? (
            <Link href="/ab-tests/new">
              <Button variant="secondary" className="gap-2">
                <Link2 className="h-4 w-4" />
                New A/B test
              </Button>
            </Link>
          ) : (
            <Link href="/pricing">
              <Button variant="secondary" className="gap-2">
                <Link2 className="h-4 w-4" />
                Upgrade for A/B tests
              </Button>
            </Link>
          )}
        </div>
      </div>

      <DashboardStats />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          <RecentTests />
          <InsightsSection />
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Quick Actions</p>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Get started
                  </h2>
                </div>
                <Badge>New</Badge>
              </div>
              <ul className="space-y-3 text-sm text-gray-700">
                <li>• Create your first email template</li>
                <li>• Version templates with git-like tracking</li>
                <li>• Run A/B tests to find winners</li>
                <li>• Track performance in real-time</li>
              </ul>
              <Link href="/templates/new">
                <Button variant="secondary" className="gap-2 w-full">
                  Create Template <FilePlus2 className="h-4 w-4" />
                </Button>
              </Link>
            </Card>
            <Card className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">A/B Testing</p>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Ship tests fast
                  </h2>
                </div>
                {canCreateAbTest ? (
                  <Badge variant="success">Available</Badge>
                ) : (
                  <Badge variant="warning">Upgrade</Badge>
                )}
              </div>
              <ol className="space-y-2 text-sm text-gray-700">
                <li>1) Create template + v1.0</li>
                <li>2) Duplicate to v1.1 and tweak</li>
                <li>3) Generate tracking URLs</li>
                <li>4) Watch results in real time</li>
              </ol>
              {canCreateAbTest ? (
                <Link href="/ab-tests/new">
                  <Button className="gap-2 w-full">
                    Launch test <Rocket className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Link href="/pricing">
                  <Button className="gap-2 w-full">
                    Upgrade to unlock <Rocket className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </Card>
          </div>
        </div>
        <SubscriptionStatus plan={plan} subscription={subscription} />
      </div>
    </div>
  );
}

