import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

interface Context {
  params: Promise<{
    templateVersionId: string;
    testId: string;
  }>;
}

export async function GET(req: NextRequest, context: Context) {
  const params = await context.params;
  const { templateVersionId, testId } = params;

  try {
    // Get A/B test to find the tracking URL
    const testDoc = await adminDb().collection("abTests").doc(testId).get();
    
    if (!testDoc.exists) {
      return new NextResponse("Test not found", { status: 404 });
    }

    const testData = testDoc.data();
    
    // Determine which version this tracking URL is for
    const isVersionA = testData?.trackingUrls?.versionA?.includes(templateVersionId);
    const isVersionB = testData?.trackingUrls?.versionB?.includes(templateVersionId);
    
    if (!isVersionA && !isVersionB) {
      return new NextResponse("Invalid tracking URL", { status: 400 });
    }

    // Record the click event
    const eventRef = adminDb().collection("trackingEvents").doc();
    await eventRef.set({
      testId,
      templateVersionId,
      eventType: "click",
      timestamp: new Date(),
      userAgent: req.headers.get("user-agent") || "",
      metadata: {
        source: "tracking_url",
        campaign: testData?.campaignName || "",
      },
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

    const newClicks = currentVersionResults.clicks + 1;
    const newCtr = currentVersionResults.opens > 0 
      ? (newClicks / currentVersionResults.opens) * 100 
      : 0;

    const updatedResults = {
      ...currentResults,
      [versionKey]: {
        ...currentVersionResults,
        clicks: newClicks,
        ctr: newCtr,
      },
    };

    // Calculate winner if both versions have data
    let winner = currentResults.winner;
    if (updatedResults.versionA && updatedResults.versionB) {
      const ctrA = updatedResults.versionA.ctr || 0;
      const ctrB = updatedResults.versionB.ctr || 0;
      
      // Simple winner calculation (can be enhanced with statistical significance)
      if (Math.abs(ctrA - ctrB) > 1) { // At least 1% difference
        winner = ctrA > ctrB ? "versionA" : "versionB";
      }
    }

    await testDoc.ref.update({
      results: updatedResults,
      ...(winner && { "results.winner": winner }),
    });

    // Redirect to the actual destination
    // Priority: 1) Query parameter, 2) Test data redirectUrl, 3) Default
    const redirectParam = req.nextUrl.searchParams.get("redirect");
    const redirectUrl = redirectParam || testData?.redirectUrl || "https://example.com";
    
    // Validate URL to prevent open redirects
    try {
      const url = new URL(redirectUrl);
      // Only allow http/https protocols
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        return new NextResponse("Invalid redirect URL", { status: 400 });
      }
      return NextResponse.redirect(redirectUrl);
    } catch {
      // If URL is invalid, redirect to default
      return NextResponse.redirect("https://example.com");
    }
  } catch (error) {
    console.error("[TRACKING_URL_ERROR]", error);
    return new NextResponse("Tracking error", { status: 500 });
  }
}

