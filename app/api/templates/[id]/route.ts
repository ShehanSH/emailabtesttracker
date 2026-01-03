import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";

interface Context {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, context: Context) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = await context.params;
  const templateId = params.id;

  try {
    const templateDoc = await adminDb().collection("templates").doc(templateId).get();

    if (!templateDoc.exists) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    const templateData = templateDoc.data();

    if (templateData?.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Serialize dates
    const template = {
      id: templateDoc.id,
      name: templateData.name,
      campaignType: templateData.campaignType || null,
      metadata: templateData.metadata || {},
      createdAt: templateData.createdAt?.toDate?.()?.toISOString() || 
                 (templateData.createdAt instanceof Date ? templateData.createdAt.toISOString() : null),
      latestVersionId: templateData.latestVersionId || null,
    };

    return NextResponse.json(template);
  } catch (error) {
    console.error("[TEMPLATE_GET_ERROR]", error);
    return NextResponse.json(
      { error: "Unable to fetch template" },
      { status: 500 }
    );
  }
}

