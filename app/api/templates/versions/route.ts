import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get all templates for the user (without orderBy to avoid index requirement)
    const templatesSnapshot = await adminDb()
      .collection("templates")
      .where("userId", "==", session.user.id)
      .get();

    const templates = await Promise.all(
      templatesSnapshot.docs.map(async (templateDoc) => {
        const templateData = templateDoc.data();
        
        // Get all versions for this template (without orderBy to avoid index requirement)
        let versionsSnapshot;
        try {
          versionsSnapshot = await adminDb()
            .collection("templateVersions")
            .where("templateId", "==", templateDoc.id)
            .get();
        } catch (error) {
          // If query fails, try without orderBy
          console.warn("[VERSIONS_QUERY_WARNING]", error);
          versionsSnapshot = await adminDb()
            .collection("templateVersions")
            .where("templateId", "==", templateDoc.id)
            .get();
        }

        // Sort versions manually by createdAt
        const versions = versionsSnapshot.docs
          .map((versionDoc) => {
            const versionData = versionDoc.data();
            return {
              id: versionDoc.id,
              versionNumber: versionData.versionNumber || "v1.0",
              createdAt: versionData.createdAt?.toDate?.()?.getTime() || 
                        (versionData.createdAt instanceof Date ? versionData.createdAt.getTime() : 0) ||
                        Date.now(),
              htmlContent: versionData.htmlContent || "",
              performanceMetrics: versionData.performanceMetrics || {
                opens: 0,
                clicks: 0,
                ctr: 0,
              },
            };
          })
          .sort((a, b) => b.createdAt - a.createdAt) // Sort descending
          .map(v => ({
            ...v,
            createdAt: new Date(v.createdAt).toISOString(),
          }));

        return {
          id: templateDoc.id,
          name: templateData.name,
          campaignType: templateData.campaignType,
          versions: versions.length > 0 ? versions : [
            // If no versions exist, create a placeholder
            {
              id: "no-version",
              versionNumber: "No versions",
              createdAt: new Date().toISOString(),
              htmlContent: "",
              performanceMetrics: { opens: 0, clicks: 0, ctr: 0 },
            }
          ],
        };
      })
    );

    // Sort templates manually by createdAt
    const sortedTemplates = templates.sort((a, b) => {
      const aDate = a.versions[0]?.createdAt ? new Date(a.versions[0].createdAt).getTime() : 0;
      const bDate = b.versions[0]?.createdAt ? new Date(b.versions[0].createdAt).getTime() : 0;
      return bDate - aDate;
    });

    return NextResponse.json({ templates: sortedTemplates });
  } catch (error) {
    console.error("[TEMPLATES_VERSIONS_GET]", error);
    return NextResponse.json(
      { 
        error: "Unable to load templates and versions",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

