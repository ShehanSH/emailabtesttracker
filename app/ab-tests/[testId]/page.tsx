import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, Award, Download } from "lucide-react";
import Link from "next/link";
import { TestCharts } from "@/components/ab-tests/test-charts";
import { WebhookInfo } from "@/components/ab-tests/webhook-info";
import { TrackingUrls } from "@/components/ab-tests/tracking-urls";

interface Context {
  params: Promise<{ testId: string }>;
}

export default async function AbTestDetailPage(context: Context) {
  const session = await auth();
  const params = await context.params;
  const { testId } = params;

  if (!session?.user) {
    redirect("/login");
  }

  try {
    const testDoc = await adminDb().collection("abTests").doc(testId).get();
    
    if (!testDoc.exists) {
      return (
        <div className="mx-auto max-w-5xl px-4 py-10">
          <Card className="p-6">
            <p className="text-red-600">A/B test not found</p>
          </Card>
        </div>
      );
    }

    const testData = testDoc.data();
    
    if (testData?.userId !== session.user.id) {
      return (
        <div className="mx-auto max-w-5xl px-4 py-10">
          <Card className="p-6">
            <p className="text-red-600">You don't have access to this test</p>
          </Card>
        </div>
      );
    }

    // Get template versions
    const versionA = testData?.templateVersionIdA
      ? await adminDb()
          .collection("templateVersions")
          .doc(testData.templateVersionIdA)
          .get()
      : null;
    
    const versionB = testData?.templateVersionIdB
      ? await adminDb()
          .collection("templateVersions")
          .doc(testData.templateVersionIdB)
          .get()
      : null;

    const results = testData?.results || {};
    const resultA = results.versionA || { opens: 0, clicks: 0, ctr: 0, conversions: 0, revenue: 0 };
    const resultB = results.versionB || { opens: 0, clicks: 0, ctr: 0, conversions: 0, revenue: 0 };
    const winner = results.winner;
    const significance = results.statisticalSignificance;

    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <Link href="/ab-tests">
          <Button variant="secondary" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to A/B Tests
          </Button>
        </Link>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-semibold text-gray-900">
                {testData?.campaignName || "A/B Test"}
              </h1>
              <Badge
                variant={
                  testData?.status === "running"
                    ? "success"
                    : testData?.status === "completed"
                    ? "default"
                    : "warning"
                }
              >
                {testData?.status || "running"}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Link href={`/api/ab-tests/${testId}/export?format=csv`} target="_blank">
                <Button variant="secondary" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
              </Link>
              <Link href={`/api/ab-tests/${testId}/export?format=json`} target="_blank">
                <Button variant="secondary" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export JSON
                </Button>
              </Link>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Started:{" "}
            {testData?.startDate
              ? testData.startDate.toDate
                ? testData.startDate.toDate().toLocaleDateString()
                : new Date(testData.startDate).toLocaleDateString()
              : "Unknown"}
            {testData?.endDate &&
              ` • Ended: ${
                testData.endDate.toDate
                  ? testData.endDate.toDate().toLocaleDateString()
                  : new Date(testData.endDate).toLocaleDateString()
              }`}
          </p>
        </div>

        {winner && (
          <Card className="mb-6 p-4 bg-green-50 border-green-200">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-semibold text-green-900">
                  Winner: {winner === "versionA" ? "Version A" : "Version B"}
                </p>
                {significance && (
                  <p className="text-sm text-green-700">
                    {significance}% statistical significance
                  </p>
                )}
              </div>
            </div>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Version A */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Version A</h2>
              {winner === "versionA" && (
                <Badge variant="success" className="gap-1">
                  <Award className="h-3 w-3" />
                  Winner
                </Badge>
              )}
            </div>
            
            {versionA?.exists && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Version: {versionA.data()?.versionNumber || "v1.0"}
                </p>
                <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-auto">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: versionA.data()?.htmlContent || "",
                    }}
                    className="text-xs"
                  />
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Opens:</span>
                <span className="font-semibold text-gray-900">{resultA.opens}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Clicks:</span>
                <span className="font-semibold text-gray-900">{resultA.clicks}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">CTR:</span>
                <span className="font-semibold text-gray-900">
                  {resultA.ctr.toFixed(2)}%
                </span>
              </div>
              {resultA.conversions > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Conversions:</span>
                  <span className="font-semibold text-gray-900">{resultA.conversions}</span>
                </div>
              )}
              {resultA.revenue > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Revenue:</span>
                  <span className="font-semibold text-gray-900">
                    ${resultA.revenue.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </Card>

          {/* Version B */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Version B</h2>
              {winner === "versionB" && (
                <Badge variant="success" className="gap-1">
                  <Award className="h-3 w-3" />
                  Winner
                </Badge>
              )}
            </div>
            
            {versionB?.exists && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Version: {versionB.data()?.versionNumber || "v1.0"}
                </p>
                <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-auto">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: versionB.data()?.htmlContent || "",
                    }}
                    className="text-xs"
                  />
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Opens:</span>
                <span className="font-semibold text-gray-900">{resultB.opens}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Clicks:</span>
                <span className="font-semibold text-gray-900">{resultB.clicks}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">CTR:</span>
                <span className="font-semibold text-gray-900">
                  {resultB.ctr.toFixed(2)}%
                </span>
              </div>
              {resultB.conversions > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Conversions:</span>
                  <span className="font-semibold text-gray-900">{resultB.conversions}</span>
                </div>
              )}
              {resultB.revenue > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Revenue:</span>
                  <span className="font-semibold text-gray-900">
                    ${resultB.revenue.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="mt-6">
          <TestCharts resultA={resultA} resultB={resultB} />
        </div>

        {/* Comparison Stats */}
        <Card className="mt-6 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Performance Comparison
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-gray-600 mb-1">CTR Difference</p>
              <p className="text-2xl font-semibold text-gray-900">
                {Math.abs(resultA.ctr - resultB.ctr).toFixed(2)}%
              </p>
              <p className="text-xs text-gray-500">
                {resultA.ctr > resultB.ctr
                  ? "Version A leads"
                  : resultB.ctr > resultA.ctr
                  ? "Version B leads"
                  : "Tied"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Opens</p>
              <p className="text-2xl font-semibold text-gray-900">
                {(resultA.opens + resultB.opens).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Clicks</p>
              <p className="text-2xl font-semibold text-gray-900">
                {(resultA.clicks + resultB.clicks).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        {/* Tracking URLs */}
        <div className="mt-6">
          <TrackingUrls
            testId={testId}
            versionAId={testData?.templateVersionIdA || ""}
            versionBId={testData?.templateVersionIdB || ""}
          />
        </div>

        {/* Webhook Integration */}
        <div className="mt-6">
          <WebhookInfo testId={testId} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("[AB_TEST_DETAIL_ERROR]", error);
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <Card className="p-6">
          <p className="text-red-600">Error loading A/B test details</p>
        </Card>
      </div>
    );
  }
}

