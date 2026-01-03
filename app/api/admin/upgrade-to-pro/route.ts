import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";

/**
 * Admin route to upgrade a user to Pro plan for testing
 * Usage: GET /api/admin/upgrade-to-pro?email=user@example.com
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    // For security, you might want to check if user is admin
    // For now, allowing any authenticated user to upgrade themselves
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const email = searchParams.get("email") || session.user.email;

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter required" },
        { status: 400 }
      );
    }

    // Find user by email
    const usersSnapshot = await adminDb()
      .collection("users")
      .where("email", "==", email.toLowerCase())
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const userDoc = usersSnapshot.docs[0];
    const userData = userDoc.data();

    // Update to Pro plan
    await userDoc.ref.update({
      plan: "pro",
      subscription: {
        status: "active",
        renewsAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        stripeId: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "User upgraded to Pro plan",
      user: {
        id: userDoc.id,
        email: userData.email,
        name: userData.name,
        plan: "pro",
      },
    });
  } catch (error) {
    console.error("[UPGRADE_TO_PRO_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to upgrade user" },
      { status: 500 }
    );
  }
}


