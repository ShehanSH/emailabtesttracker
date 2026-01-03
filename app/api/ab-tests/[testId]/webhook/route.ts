import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

interface Context {
  params: Promise<{ testId: string }>;
}

export async function POST(req: NextRequest, context: Context) {
  const params = await context.params;
  const { testId } = params;

  try {
    const body = await req.json();
    const { eventType, templateVersionId, recipientEmail, metadata } = body;

    // Validate event type
    if (!["open", "click"].includes(eventType)) {
      return NextResponse.json(
        { error: "Invalid event type. Must be 'open' or 'click'" },
        { status: 400 }
      );
    }

    // Get A/B test
    const testDoc = await adminDb().collection("abTests").doc(testId).get();
    
    if (!testDoc.exists) {
      return NextResponse.json({ error: "A/B test not found" }, { status: 404 });
    }

    const testData = testDoc.data();
    
    // Verify template version belongs to this test
    const isVersionA = testData?.templateVersionIdA === templateVersionId;
    const isVersionB = testData?.templateVersionIdB === templateVersionId;
    
    if (!isVersionA && !isVersionB) {
      return NextResponse.json(
        { error: "Template version does not belong to this test" },
        { status: 400 }
      );
    }

    // Record the event
    const eventRef = adminDb().collection("trackingEvents").doc();
    await eventRef.set({
      testId,
      templateVersionId,
      eventType,
      timestamp: new Date(),
      recipientEmail: recipientEmail ? Buffer.from(recipientEmail).toString("base64") : null, // Hash email
      userAgent: req.headers.get("user-agent") || "",
      metadata: metadata || {},
    });

    // Update A/B test results
    const versionKey = isVersionA ? "versionA" : "versionB";
    const currentResults = testData?.results || {};
    const currentVersionResults = currentResults[versionKey] || {
      opens: 0,
      clicks: 0,
      ctr: 0,
      conversions: 0,
      revenue: 0,
    };

    let updatedVersionResults = { ...currentVersionResults };

    if (eventType === "open") {
      updatedVersionResults.opens = (updatedVersionResults.opens || 0) + 1;
    } else if (eventType === "click") {
      updatedVersionResults.clicks = (updatedVersionResults.clicks || 0) + 1;
    }

    // Recalculate CTR
    if (updatedVersionResults.opens > 0) {
      updatedVersionResults.ctr = 
        (updatedVersionResults.clicks / updatedVersionResults.opens) * 100;
    }

    const updatedResults = {
      ...currentResults,
      [versionKey]: updatedVersionResults,
    };

    // Calculate winner with statistical significance
    let winner = currentResults.winner;
    let statisticalSignificance = currentResults.statisticalSignificance;

    if (updatedResults.versionA && updatedResults.versionB) {
      const resultA = updatedResults.versionA;
      const resultB = updatedResults.versionB;
      
      // Simple winner calculation (enhance with proper statistical test)
      const ctrA = resultA.ctr || 0;
      const ctrB = resultB.ctr || 0;
      const opensA = resultA.opens || 0;
      const opensB = resultB.opens || 0;
      const clicksA = resultA.clicks || 0;
      const clicksB = resultB.clicks || 0;

      // Minimum sample size for significance
      const minSample = 30;
      
      if (opensA >= minSample && opensB >= minSample) {
        // Calculate p-value using two-proportion z-test (simplified)
        const p1 = ctrA / 100;
        const p2 = ctrB / 100;
        const n1 = opensA;
        const n2 = opensB;
        
        const pooledP = (clicksA + clicksB) / (n1 + n2);
        const se = Math.sqrt(pooledP * (1 - pooledP) * (1/n1 + 1/n2));
        
        if (se > 0) {
          const z = (p1 - p2) / se;
          // Two-tailed test
          const pValue = 2 * (1 - normalCDF(Math.abs(z)));
          
          if (pValue < 0.05) {
            statisticalSignificance = 95;
          } else if (pValue < 0.01) {
            statisticalSignificance = 99;
          } else {
            statisticalSignificance = null;
          }

          // Determine winner
          if (Math.abs(ctrA - ctrB) > 1 && statisticalSignificance) {
            winner = ctrA > ctrB ? "versionA" : "versionB";
          }
        }
      }
    }

    await testDoc.ref.update({
      results: {
        ...updatedResults,
        winner,
        statisticalSignificance,
      },
    });

    return NextResponse.json({ success: true, eventType, version: versionKey });
  } catch (error) {
    console.error("[AB_TEST_WEBHOOK_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}

// Helper function for normal CDF approximation
function normalCDF(x: number): number {
  // Approximation using error function
  return 0.5 * (1 + erf(x / Math.sqrt(2)));
}

function erf(x: number): number {
  // Abramowitz and Stegun approximation
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);

  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return sign * y;
}

