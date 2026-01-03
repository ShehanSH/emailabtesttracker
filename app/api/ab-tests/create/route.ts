import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { canUseFeature, checkAbTestLimit, type Plan } from "@/lib/plans";
import { z } from "zod";

const createAbTestSchema = z.object({
  templateVersionIdA: z.string().min(1),
  templateVersionIdB: z.string().min(1),
  campaignName: z.string().min(1),
  audienceSize: z.number().min(1),
});

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const plan = (session.user.plan ?? "free") as Plan;

    // Check if A/B testing is available for this plan
    if (!canUseFeature(plan, "abTesting")) {
      return NextResponse.json(
        {
          error: "A/B testing not available",
          message: "A/B testing is only available on Solo plan ($19/mo) or higher. Please upgrade.",
        },
        { status: 403 }
      );
    }

    // Check A/B test limit
    const currentTestsSnapshot = await adminDb()
      .collection("abTests")
      .where("userId", "==", session.user.id)
      .get();

    const limitCheck = checkAbTestLimit(plan, currentTestsSnapshot.size);

    if (!limitCheck.allowed) {
      return NextResponse.json(
        {
          error: "A/B test limit reached",
          message: `Your ${plan} plan allows ${limitCheck.limit} A/B tests. Please upgrade to create more.`,
          limit: limitCheck.limit,
          current: currentTestsSnapshot.size,
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = createAbTestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid A/B test payload", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Verify template versions belong to user
    const versionA = await adminDb()
      .collection("templateVersions")
      .doc(parsed.data.templateVersionIdA)
      .get();
    const versionB = await adminDb()
      .collection("templateVersions")
      .doc(parsed.data.templateVersionIdB)
      .get();

    if (!versionA.exists || !versionB.exists) {
      return NextResponse.json(
        { error: "Template versions not found" },
        { status: 404 }
      );
    }

    if (versionA.data()?.createdBy !== session.user.id ||
        versionB.data()?.createdBy !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized: Template versions must belong to you" },
        { status: 403 }
      );
    }

    // Generate tracking URLs
    const testId = adminDb().collection("abTests").doc().id;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const trackingUrls = {
      versionA: `${baseUrl}/t/${parsed.data.templateVersionIdA}/test/${testId}`,
      versionB: `${baseUrl}/t/${parsed.data.templateVersionIdB}/test/${testId}`,
    };

    const now = new Date();
    await adminDb().collection("abTests").doc(testId).set({
      userId: session.user.id,
      templateVersionIdA: parsed.data.templateVersionIdA,
      templateVersionIdB: parsed.data.templateVersionIdB,
      campaignName: parsed.data.campaignName,
      startDate: now,
      endDate: null,
      audienceSize: parsed.data.audienceSize,
      status: "running",
      trackingUrls,
      results: null,
    });

    return NextResponse.json(
      {
        id: testId,
        trackingUrls,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[AB_TEST_CREATE_ERROR]", error);
    return NextResponse.json(
      { error: "Unable to create A/B test" },
      { status: 500 }
    );
  }
}

