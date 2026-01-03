import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { checkTemplateLimit, type Plan } from "@/lib/plans";
import { FileText, Plus, Calendar } from "lucide-react";

export default async function TemplatesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const plan = (session.user.plan ?? "free") as Plan;

  try {
    const snapshot = await adminDb()
      .collection("templates")
      .where("userId", "==", session.user.id)
      .orderBy("createdAt", "desc")
      .get();

    const templates = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        campaignType: data.campaignType,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        metadata: data.metadata || {},
      };
    });

    const limitCheck = checkTemplateLimit(plan, templates.length);

    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Templates</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your email templates and versions
            </p>
          </div>
          <div className="flex items-center gap-3">
            {limitCheck.allowed ? (
              <Link href="/templates/new">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  New template
                </Button>
              </Link>
            ) : (
              <Link href="/pricing">
                <Button variant="secondary" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Upgrade to create more
                </Button>
              </Link>
            )}
          </div>
        </div>

        {limitCheck.limit !== -1 && (
          <Card className="mb-6 p-4 bg-muted">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Template Usage: {templates.length} / {limitCheck.limit}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {limitCheck.remaining > 0
                    ? `${limitCheck.remaining} templates remaining`
                    : "Limit reached - upgrade to create more"}
                </p>
              </div>
              {!limitCheck.allowed && (
                <Link href="/pricing">
                  <Button size="sm" variant="secondary">
                    Upgrade Plan
                  </Button>
                </Link>
              )}
            </div>
          </Card>
        )}

        {templates.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No templates yet
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Create your first email template to get started
            </p>
            {limitCheck.allowed ? (
              <Link href="/templates/new">
                <Button>Create Template</Button>
              </Link>
            ) : (
              <Link href="/pricing">
                <Button>Upgrade to Create Templates</Button>
              </Link>
            )}
          </Card>
        ) : (
          <div className="grid gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {template.name}
                      </h3>
                      {template.campaignType && (
                        <Badge variant="default">
                          {template.campaignType}
                        </Badge>
                      )}
                    </div>
                    {template.metadata.subject && (
                      <p className="text-sm text-muted-foreground mb-2">
                        Subject: {template.metadata.subject}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {template.createdAt
                          ? new Date(template.createdAt).toLocaleDateString()
                          : "Unknown date"}
                      </div>
                    </div>
                  </div>
                  <Link href={`/templates/${template.id}`}>
                    <Button variant="secondary" size="sm">
                      View History
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("[TEMPLATES_PAGE_ERROR]", error);
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <Card className="p-6">
          <p className="text-danger">Error loading templates. Please try again.</p>
        </Card>
      </div>
    );
  }
}
