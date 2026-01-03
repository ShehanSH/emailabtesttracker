import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, History, Plus } from "lucide-react";
import Link from "next/link";
import { VersionHistoryItem } from "@/components/templates/version-history-item";

interface Context {
  params: Promise<{ id: string }>;
}

export default async function TemplateDetailPage(context: Context) {
  const session = await auth();
  const params = await context.params;
  const { id } = params;

  if (!session?.user) {
    redirect("/login");
  }

  try {
    const templateDoc = await adminDb().collection("templates").doc(id).get();
    
    if (!templateDoc.exists) {
      return (
        <div className="mx-auto max-w-5xl px-4 py-10">
          <Card className="p-6">
            <p className="text-red-600">Template not found</p>
          </Card>
        </div>
      );
    }

    const templateData = templateDoc.data();
    
    if (templateData?.userId !== session.user.id) {
      return (
        <div className="mx-auto max-w-5xl px-4 py-10">
          <Card className="p-6">
            <p className="text-red-600">You don't have access to this template</p>
          </Card>
        </div>
      );
    }

    // Get all versions (without orderBy to avoid index requirement)
    const versionsSnapshot = await adminDb()
      .collection("templateVersions")
      .where("templateId", "==", id)
      .get();

    // Sort versions manually by createdAt (descending) and serialize for Client Component
    const versions = versionsSnapshot.docs
      .map((doc) => {
        const data = doc.data();
        const createdAt = data.createdAt;
        let createdAtTimestamp = 0;
        let createdAtString = null;
        
        // Convert Firestore Timestamp to string for serialization
        if (createdAt) {
          if (createdAt.toDate) {
            const date = createdAt.toDate();
            createdAtTimestamp = date.getTime();
            createdAtString = date.toISOString();
          } else if (createdAt instanceof Date) {
            createdAtTimestamp = createdAt.getTime();
            createdAtString = createdAt.toISOString();
          } else if (typeof createdAt === 'string') {
            createdAtTimestamp = new Date(createdAt).getTime();
            createdAtString = createdAt;
          }
        }
        
        // Serialize all data to plain objects (no Firestore Timestamps)
        return {
          id: doc.id,
          templateId: data.templateId || null,
          versionNumber: data.versionNumber || null,
          htmlContent: data.htmlContent || null,
          changes: data.changes || null,
          createdBy: data.createdBy || null,
          performanceMetrics: data.performanceMetrics || null,
          createdAt: createdAtString, // Use ISO string instead of Timestamp
          createdAtTimestamp: createdAtTimestamp || Date.now(),
        };
      })
      .sort((a, b) => b.createdAtTimestamp - a.createdAtTimestamp)
      .map(({ createdAtTimestamp, ...version }) => version); // Remove temporary timestamp

    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <Link href="/templates">
          <Button variant="secondary" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Templates
          </Button>
        </Link>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-semibold text-gray-900">
              {templateData?.name || "Template"}
            </h1>
            <Link href={`/templates/${id}/version`}>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create New Version
              </Button>
            </Link>
          </div>
          {templateData?.campaignType && (
            <Badge className="mb-2">{templateData.campaignType}</Badge>
          )}
          {templateData?.metadata?.subject && (
            <p className="text-sm text-gray-600">
              Subject: {templateData.metadata.subject}
            </p>
          )}
        </div>

        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <History className="h-5 w-5" />
              Version History
            </h2>
            <Badge variant="default" className="text-xs">
              {versions.length} {versions.length === 1 ? "version" : "versions"}
            </Badge>
          </div>
          
          {versions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-600 mb-4">No versions yet</p>
              <Link href={`/templates/${id}/version`}>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create First Version
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {versions.map((version, index) => (
                <VersionHistoryItem
                  key={version.id}
                  version={version}
                  isLatest={index === 0}
                  index={index}
                  templateId={id}
                />
              ))}
            </div>
          )}
        </Card>
      </div>
    );
  } catch (error) {
    console.error("[TEMPLATE_DETAIL_ERROR]", error);
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <Card className="p-6">
          <p className="text-red-600">Error loading template</p>
        </Card>
      </div>
    );
  }
}

