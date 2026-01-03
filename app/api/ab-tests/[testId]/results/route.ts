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

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const testDoc = await adminDb().collection("abTests").doc(testId).get();
    
    if (!testDoc.exists) {
      return NextResponse.json({ error: "A/B test not found" }, { status: 404 });
    }

    const testData = testDoc.data();
    
    // Verify ownership
    if (testData?.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get template versions for side-by-side comparison
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

    return NextResponse.json({
      test: {
        id: testDoc.id,
        ...testData,
      },
      versionA: versionA?.exists ? { id: versionA.id, ...versionA.data() } : null,
      versionB: versionB?.exists ? { id: versionB.id, ...versionB.data() } : null,
    });
  } catch (error) {
    console.error("[AB_TEST_RESULTS_ERROR]", error);
    return NextResponse.json(
      { error: "Unable to fetch test results" },
      { status: 500 }
    );
  }
}

