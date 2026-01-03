import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = session.user.id;

    // Fetch templates count
    const templatesSnapshot = await adminDb()
      .collection("templates")
      .where("userId", "==", userId)
      .get();

    const templatesCount = templatesSnapshot.size;

    // Fetch A/B tests
    const abTestsSnapshot = await adminDb()
      .collection("abTests")
      .where("userId", "==", userId)
      .get();

    const allTests = abTestsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const runningTests = allTests.filter((test) => test.status === "running");
    const completedTests = allTests.filter((test) => test.status === "completed");

    // Calculate average CTR lift from completed tests
    let avgCtrLift = 0;
    if (completedTests.length > 0) {
      const lifts = completedTests
        .map((test) => {
          if (test.results?.versionA && test.results?.versionB) {
            const ctrA = test.results.versionA.ctr || 0;
            const ctrB = test.results.versionB.ctr || 0;
            const winner = test.results.winner;
            if (winner === "versionA" && ctrB > 0) {
              return ((ctrA - ctrB) / ctrB) * 100;
            } else if (winner === "versionB" && ctrA > 0) {
              return ((ctrB - ctrA) / ctrA) * 100;
            }
          }
          return 0;
        })
        .filter((lift) => lift > 0);

      if (lifts.length > 0) {
        avgCtrLift =
          lifts.reduce((sum, lift) => sum + lift, 0) / lifts.length;
      }
    }

    // Get recent template versions
    const versionsSnapshot = await adminDb()
      .collection("templateVersions")
      .where("createdBy", "==", userId)
      .orderBy("createdAt", "desc")
      .limit(5)
      .get();

    const recentVersions = versionsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({
      stats: {
        templatesCount,
        runningTestsCount: runningTests.length,
        completedTestsCount: completedTests.length,
        avgCtrLift: Math.round(avgCtrLift * 10) / 10,
      },
      recentTests: runningTests.slice(0, 3),
      recentVersions: recentVersions.slice(0, 3),
    });
  } catch (error) {
    console.error("[DASHBOARD_STATS_ERROR]", error);
    return NextResponse.json(
      { error: "Unable to load dashboard stats" },
      { status: 500 }
    );
  }
}

