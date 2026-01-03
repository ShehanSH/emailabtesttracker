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
    
    if (testData?.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const webhookUrl = `${baseUrl}/api/ab-tests/${testId}/webhook`;

    return NextResponse.json({
      webhookUrl,
      instructions: {
        zapier: {
          title: "Zapier Integration",
          steps: [
            "1. Go to Zapier and create a new Zap",
            "2. Choose your email platform (Mailchimp, ConvertKit, etc.) as the trigger",
            "3. Select 'Webhooks by Zapier' as the action",
            "4. Choose 'POST' method",
            "5. Enter the webhook URL above",
            "6. Map the event data:",
            "   - eventType: 'open' or 'click'",
            "   - templateVersionId: The version ID (A or B)",
            "   - recipientEmail: (optional, will be hashed)",
            "7. Test and activate your Zap",
          ],
        },
        manual: {
          title: "Manual Webhook",
          description: "Send POST requests to the webhook URL with this payload:",
          payload: {
            eventType: "open" | "click",
            templateVersionId: "version-id-here",
            recipientEmail: "user@example.com",
            metadata: {},
          },
        },
      },
    });
  } catch (error) {
    console.error("[WEBHOOK_INFO_ERROR]", error);
    return NextResponse.json(
      { error: "Unable to fetch webhook info" },
      { status: 500 }
    );
  }
}

