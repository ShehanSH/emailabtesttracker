/**
 * Script to upgrade a user to Pro plan for testing
 * Run with: npx tsx scripts/upgrade-user-to-pro.ts
 */

import { adminDb } from "../lib/firebase/admin";

const USER_EMAIL = "shehanhashen928@gmail.com";

async function upgradeUserToPro() {
  try {
    console.log(`Looking for user with email: ${USER_EMAIL}`);
    
    // Find user by email
    const usersSnapshot = await adminDb()
      .collection("users")
      .where("email", "==", USER_EMAIL.toLowerCase())
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      console.error("❌ User not found!");
      process.exit(1);
    }

    const userDoc = usersSnapshot.docs[0];
    const userId = userDoc.id;
    const userData = userDoc.data();

    console.log(`✅ Found user: ${userData.name || userData.email}`);
    console.log(`   Current plan: ${userData.plan || "free"}`);
    console.log(`   User ID: ${userId}`);

    // Update to Pro plan
    await userDoc.ref.update({
      plan: "pro",
      subscription: {
        status: "active",
        renewsAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        stripeId: null, // No Stripe ID needed for testing
      },
    });

    console.log("\n✅ Successfully upgraded user to PRO plan!");
    console.log("   Plan: pro");
    console.log("   Status: active");
    console.log("   All Pro features are now enabled!");
    console.log("\nYou can now test:");
    console.log("  - Unlimited templates");
    console.log("  - Unlimited A/B tests");
    console.log("  - Advanced analytics");
    console.log("  - Team collaboration");
    console.log("  - API access");
    console.log("  - White-label option");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error upgrading user:", error);
    process.exit(1);
  }
}

upgradeUserToPro();


