import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { createVersionSchema } from "@/lib/validators/templates";

interface Context {
  params: Promise<{ id: string }>;
}

export async function POST(req: Request, context: Context) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = await context.params;
  const templateId = params.id;
  try {
    const templateDoc = await adminDb()
      .collection("templates")
      .doc(templateId)
      .get();
    if (!templateDoc.exists) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    const template = templateDoc.data();
    if (!template) {
      return NextResponse.json({ error: "Template data missing" }, { status: 404 });
    }
    if (template.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = createVersionSchema.safeParse({ ...body, templateId });
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid version payload", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const versionsSnapshot = await adminDb()
      .collection("templateVersions")
      .where("templateId", "==", templateId)
      .get();

    const nextVersion = versionsSnapshot.size + 1;
    const versionNumber = parsed.data.versionNumber ?? `v${nextVersion}.0`;

    const now = new Date();
    const versionRef = adminDb().collection("templateVersions").doc();

    await versionRef.set({
      templateId,
      versionNumber,
      htmlContent: parsed.data.htmlContent,
      changes: parsed.data.changes ?? [],
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

    await templateDoc.ref.update({
      isLatestVersion: true,
      latestVersionId: versionRef.id,
    });

    return NextResponse.json(
      { id: versionRef.id, versionNumber },
      { status: 201 }
    );
  } catch (error) {
    console.error("[TEMPLATE_VERSION_POST]", error);
    return NextResponse.json(
      { error: "Unable to create version" },
      { status: 500 }
    );
  }
}

