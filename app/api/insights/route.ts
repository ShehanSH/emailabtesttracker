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

    // Get all completed A/B tests
    const completedTestsSnapshot = await adminDb()
      .collection("abTests")
      .where("userId", "==", userId)
      .where("status", "==", "completed")
      .get();

    const allTests = completedTestsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Array<{
      id: string;
      results?: {
        versionA?: { ctr?: number };
        versionB?: { ctr?: number };
        winner?: "versionA" | "versionB" | null;
      };
    }>;

    // Aggregate insights
    const insights = {
      allTimeTests: allTests.length,
      winRate: {
        versionA: 0,
        versionB: 0,
      },
      bestSubjectLinePatterns: [] as string[],
      bestSendTimes: [] as string[],
      averageCtrLift: 0,
      patterns: [] as Array<{
        pattern: string;
        winRate: number;
        description: string;
      }>,
    };

    if (allTests.length > 0) {
      // Calculate win rates
      allTests.forEach((test) => {
        if (test.results?.winner === "versionA") {
          insights.winRate.versionA++;
        } else if (test.results?.winner === "versionB") {
          insights.winRate.versionB++;
        }
      });

      // Calculate average CTR lift
      const lifts = allTests
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
        insights.averageCtrLift =
          lifts.reduce((sum, lift) => sum + lift, 0) / lifts.length;
      }

      // Simple pattern detection (can be enhanced)
      insights.patterns = [
        {
          pattern: "Higher CTR",
          winRate: insights.winRate.versionA + insights.winRate.versionB > 0
            ? ((insights.winRate.versionA + insights.winRate.versionB) / allTests.length) * 100
            : 0,
          description: `${allTests.length} tests completed with clear winners`,
        },
      ];
    }

    // Get or create insights document
    const insightsRef = adminDb().collection("insights").doc(userId);
    await insightsRef.set(
      {
        ...insights,
        lastUpdated: new Date(),
      },
      { merge: true }
    );

    return NextResponse.json({ insights });
  } catch (error) {
    console.error("[INSIGHTS_ERROR]", error);
    return NextResponse.json(
      { error: "Unable to fetch insights" },
      { status: 500 }
    );
  }
}

