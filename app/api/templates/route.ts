import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { createTemplateSchema } from "@/lib/validators/templates";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const snapshot = await adminDb()
      .collection("templates")
      .where("userId", "==", session.user.id)
      .orderBy("createdAt", "desc")
      .get();

    const templates = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ templates });
  } catch (error) {
    console.error("[TEMPLATES_GET]", error);
    return NextResponse.json(
      { error: "Unable to load templates" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Check plan limits
    const plan = (session.user.plan ?? "free") as import("@/types/firestore").Plan;
    const { checkTemplateLimit } = await import("@/lib/plans");
    
    // Get current template count
    const currentTemplatesSnapshot = await adminDb()
      .collection("templates")
      .where("userId", "==", session.user.id)
      .get();
    
    const limitCheck = checkTemplateLimit(plan, currentTemplatesSnapshot.size);
    
    if (!limitCheck.allowed) {
      return NextResponse.json(
        { 
          error: "Template limit reached",
          message: `Your ${plan} plan allows ${limitCheck.limit} templates. Please upgrade to create more.`,
          limit: limitCheck.limit,
          current: currentTemplatesSnapshot.size,
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = createTemplateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid template payload", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const now = new Date();
    const templateRef = adminDb().collection("templates").doc();
    const versionRef = adminDb().collection("templateVersions").doc();

    await templateRef.set({
      userId: session.user.id,
      name: parsed.data.name,
      campaignType: parsed.data.campaignType ?? null,
      createdAt: now,
      isLatestVersion: true,
      metadata: {
        subject: parsed.data.subject ?? "",
        preview: parsed.data.preview ?? "",
        tags: parsed.data.tags ?? [],
      },
      latestVersionId: versionRef.id,
    });

    await versionRef.set({
      templateId: templateRef.id,
      versionNumber: "v1.0",
      htmlContent: parsed.data.htmlContent,
      changes: [],
      createdAt: now,
      createdBy: session.user.id,
      performanceMetrics: {
        opens: 0,
        clicks: 0,
        ctr: 0,
        conversions: 0,
        revenue: 0,
      },
    });

    return NextResponse.json(
      {
        id: templateRef.id,
        versionId: versionRef.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[TEMPLATES_POST]", error);
    return NextResponse.json(
      { error: "Unable to create template" },
      { status: 500 }
    );
  }
}

