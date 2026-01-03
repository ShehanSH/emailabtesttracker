import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const snapshot = await adminDb()
      .collection("abTests")
      .where("userId", "==", session.user.id)
      .orderBy("startDate", "desc")
      .get();

    const tests = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ tests });
  } catch (error) {
    console.error("[AB_TESTS_GET]", error);
    return NextResponse.json(
      { error: "Unable to load A/B tests" },
      { status: 500 }
    );
  }
}

