import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { canUseFeature, checkAbTestLimit, type Plan } from "@/lib/plans";
import { Link2, Plus, Calendar, TrendingUp } from "lucide-react";

export default async function AbTestsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const plan = (session.user.plan ?? "free") as Plan;
  const canCreateAbTest = canUseFeature(plan, "abTesting");

  try {
    const snapshot = await adminDb()
      .collection("abTests")
      .where("userId", "==", session.user.id)
      .orderBy("startDate", "desc")
      .get();

    const tests = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        campaignName: data.campaignName,
        status: data.status || "running",
        startDate: data.startDate?.toDate?.() || data.startDate,
        endDate: data.endDate?.toDate?.() || data.endDate,
        results: data.results || null,
        audienceSize: data.audienceSize || 0,
      };
    });

    const limitCheck = checkAbTestLimit(plan, tests.length);

    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">A/B Tests</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Track and compare email template performance
            </p>
          </div>
          <div className="flex items-center gap-3">
            {canCreateAbTest && limitCheck.allowed ? (
              <Link href="/ab-tests/new">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  New A/B test
                </Button>
              </Link>
            ) : (
              <Link href="/pricing">
                <Button variant="secondary" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Upgrade for A/B testing
                </Button>
              </Link>
            )}
          </div>
        </div>

        {!canCreateAbTest && (
          <Card className="mb-6 p-4 bg-warning-bg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">
                  A/B Testing not available on Free plan
                </p>
                <p className="text-xs text-warning mt-1">
                  Upgrade to Solo plan ($19/mo) or higher to unlock A/B testing
                </p>
              </div>
              <Link href="/pricing">
                <Button size="sm" variant="secondary">
                  View Plans
                </Button>
              </Link>
            </div>
          </Card>
        )}

        {tests.length === 0 ? (
          <Card className="p-12 text-center">
            <Link2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No A/B tests yet
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {canCreateAbTest
                ? "Create your first A/B test to compare template versions"
                : "Upgrade your plan to start running A/B tests"}
            </p>
            {canCreateAbTest ? (
              <Link href="/ab-tests/new">
                <Button>Create A/B Test</Button>
              </Link>
            ) : (
              <Link href="/pricing">
                <Button>Upgrade Plan</Button>
              </Link>
            )}
          </Card>
        ) : (
          <div className="grid gap-4">
            {tests.map((test) => (
              <Card key={test.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {test.campaignName}
                      </h3>
                      <Badge
                        variant={
                          test.status === "running"
                            ? "success"
                            : test.status === "completed"
                            ? "default"
                            : "warning"
                        }
                      >
                        {test.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Started:{" "}
                        {test.startDate
                          ? new Date(test.startDate).toLocaleDateString()
                          : "Unknown"}
                      </div>
                      <span>Audience: {test.audienceSize.toLocaleString()}</span>
                    </div>
                    {test.results && (
                      <div className="mt-3 flex items-center gap-4 text-sm">
                        {test.results.winner && (
                          <div className="flex items-center gap-1 text-success">
                            <TrendingUp className="h-4 w-4" />
                            Winner: {test.results.winner === "versionA" ? "Version A" : "Version B"}
                          </div>
                        )}
                        {test.results.statisticalSignificance && (
                          <Badge variant="success" className="text-xs">
                            {test.results.statisticalSignificance}% confidence
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  <Link href={`/ab-tests/${test.id}`}>
                    <Button variant="secondary" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("[AB_TESTS_PAGE_ERROR]", error);
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <Card className="p-6">
          <p className="text-danger">Error loading A/B tests. Please try again.</p>
        </Card>
      </div>
    );
  }
}

