import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";

interface Context {
  params: Promise<{ testId: string }>;
}

export async function GET(req: Request, context: Context) {
  const session = await auth();
  const params = await context.params;
  const { testId } = params;
  const format = new URL(req.url).searchParams.get("format") || "csv";

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const testDoc = await adminDb().collection("abTests").doc(testId).get();
    
    if (!testDoc.exists) {
      return NextResponse.json({ error: "A/B test not found" }, { status: 404 });
    }

    const testData = testDoc.data();
    
    if (testData?.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const results = testData?.results || {};
    const resultA = results.versionA || { opens: 0, clicks: 0, ctr: 0, conversions: 0, revenue: 0 };
    const resultB = results.versionB || { opens: 0, clicks: 0, ctr: 0, conversions: 0, revenue: 0 };

    if (format === "csv") {
      const csv = [
        "Metric,Version A,Version B,Difference",
        `Opens,${resultA.opens},${resultB.opens},${Math.abs(resultA.opens - resultB.opens)}`,
        `Clicks,${resultA.clicks},${resultB.clicks},${Math.abs(resultA.clicks - resultB.clicks)}`,
        `CTR (%),${resultA.ctr.toFixed(2)},${resultB.ctr.toFixed(2)},${Math.abs(resultA.ctr - resultB.ctr).toFixed(2)}`,
        `Conversions,${resultA.conversions || 0},${resultB.conversions || 0},${Math.abs((resultA.conversions || 0) - (resultB.conversions || 0))}`,
        `Revenue,${resultA.revenue || 0},${resultB.revenue || 0},${Math.abs((resultA.revenue || 0) - (resultB.revenue || 0))}`,
        `Winner,${results.winner === "versionA" ? "Version A" : results.winner === "versionB" ? "Version B" : "TBD"}`,
        `Statistical Significance,${results.statisticalSignificance || "N/A"}%`,
      ].join("\n");

      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="ab-test-${testId}.csv"`,
        },
      });
    }

    // JSON format
    return NextResponse.json({
      testId,
      campaignName: testData?.campaignName,
      status: testData?.status,
      startDate: testData?.startDate?.toDate?.()?.toISOString(),
      endDate: testData?.endDate?.toDate?.()?.toISOString(),
      results: {
        versionA: resultA,
        versionB: resultB,
        winner: results.winner,
        statisticalSignificance: results.statisticalSignificance,
      },
    });
  } catch (error) {
    console.error("[EXPORT_ERROR]", error);
    return NextResponse.json(
      { error: "Unable to export test data" },
      { status: 500 }
    );
  }
}

