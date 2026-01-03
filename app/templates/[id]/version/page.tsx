"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft, Copy, Eye, Check, EyeOff, HelpCircle } from "lucide-react";
import Link from "next/link";
import { HtmlExportModal } from "@/components/templates/html-export-modal";

const createVersionSchema = z.object({
  htmlContent: z.string().min(1, "HTML content is required"),
  versionNumber: z.string().optional(),
  changes: z
    .array(
      z.object({
        field: z.string(),
        oldValue: z.string().nullable(),
        newValue: z.string().nullable(),
      })
    )
    .optional(),
});

type VersionInput = z.infer<typeof createVersionSchema>;

interface TemplateVersion {
  id: string;
  versionNumber: string;
  htmlContent: string;
  createdAt: string;
}

interface Template {
  id: string;
  name: string;
  campaignType?: string;
  latestVersion?: TemplateVersion;
}

export default function NewVersionPage() {
  const router = useRouter();
  const params = useParams();
  const templateId = params.id as string;

  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<VersionInput>({
    resolver: zodResolver(createVersionSchema),
    defaultValues: {
      htmlContent: "",
      versionNumber: "",
    },
  });

  const htmlContent = watch("htmlContent");

  useEffect(() => {
    async function fetchTemplate() {
      try {
        // Fetch template details
        const templateRes = await fetch(`/api/templates/${templateId}`);
        if (!templateRes.ok) {
          setError("Template not found");
          setLoading(false);
          return;
        }
        const templateData = await templateRes.json();

        // Fetch latest version
        const versionsRes = await fetch(`/api/templates/versions`);
        if (versionsRes.ok) {
          const versionsData = await versionsRes.json();
          const templateWithVersions = versionsData.templates?.find(
            (t: any) => t.id === templateId
          );

          if (templateWithVersions?.versions?.length > 0) {
            const latestVersion = templateWithVersions.versions[0];
            setTemplate({
              id: templateId,
              name: templateData.name || "Template",
              campaignType: templateData.campaignType,
              latestVersion: {
                id: latestVersion.id,
                versionNumber: latestVersion.versionNumber,
                htmlContent: latestVersion.htmlContent || "",
                createdAt: latestVersion.createdAt,
              },
            });
            // Pre-fill with latest version's HTML
            setValue("htmlContent", latestVersion.htmlContent || "");
          } else {
            setTemplate({
              id: templateId,
              name: templateData.name || "Template",
              campaignType: templateData.campaignType,
            });
          }
        } else {
          setTemplate({
            id: templateId,
            name: templateData.name || "Template",
            campaignType: templateData.campaignType,
          });
        }
      } catch (err) {
        console.error("Failed to fetch template:", err);
        setError("Failed to load template");
      } finally {
        setLoading(false);
      }
    }

    if (templateId) {
      fetchTemplate();
    }
  }, [templateId, setValue]);

  const copyLatestHtml = () => {
    if (template?.latestVersion?.htmlContent) {
      setValue("htmlContent", template.latestVersion.htmlContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const onSubmit = async (values: VersionInput) => {
    setError(null);
    const res = await fetch(`/api/templates/${templateId}/version`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        htmlContent: values.htmlContent,
        versionNumber: values.versionNumber || undefined,
        changes: values.changes || [],
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      setError(body?.error ?? "Unable to create version.");
      return;
    }

    router.push(`/templates/${templateId}`);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <Card className="p-6">
          <div className="flex items-center justify-center py-8">
            <Spinner className="h-6 w-6" />
          </div>
        </Card>
      </div>
    );
  }

  if (error && !template) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <Card className="p-6">
          <p className="text-red-600">{error}</p>
          <Link href="/templates">
            <Button variant="secondary" className="mt-4">
              Back to Templates
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link href={`/templates/${templateId}`}>
        <Button variant="secondary" className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Template
        </Button>
      </Link>

      <Card className="p-6">
        <div className="space-y-2 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Create New Version
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {template?.name && `Template: ${template.name}`}
                {template?.latestVersion && (
                  <> • Based on {template.latestVersion.versionNumber}</>
                )}
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowHelpModal(true)}
              className="gap-2"
            >
              <HelpCircle className="h-4 w-4" />
              How to Get HTML
            </Button>
          </div>
        </div>

        {template?.latestVersion && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Latest Version: {template.latestVersion.versionNumber}
                </p>
                <p className="text-xs text-blue-700">
                  Created: {new Date(template.latestVersion.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={copyLatestHtml}
                className="gap-2"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Use Latest HTML
                  </>
                )}
              </Button>
            </div>
            {showPreview && (
              <div className="mt-3 border border-blue-200 rounded bg-white p-3 max-h-48 overflow-auto">
                <div
                  dangerouslySetInnerHTML={{
                    __html: template.latestVersion.htmlContent,
                  }}
                  className="text-xs"
                />
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="versionNumber">Version Number (Optional)</Label>
            <Input
              id="versionNumber"
              placeholder="e.g., v2.0, v1.1 (auto-generated if empty)"
              {...register("versionNumber")}
            />
            <p className="text-xs text-gray-500">
              Leave empty to auto-generate based on version count
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label htmlFor="htmlContent">HTML Content *</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHelpModal(true)}
                  className="h-auto p-0 text-xs text-blue-600 hover:text-blue-800"
                >
                  <HelpCircle className="h-3 w-3 mr-1" />
                  Need help?
                </Button>
              </div>
              {htmlContent && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                  className="gap-2"
                >
                  {showPreview ? (
                    <>
                      <EyeOff className="h-4 w-4" />
                      Hide Preview
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4" />
                      Show Preview
                    </>
                  )}
                </Button>
              )}
            </div>
            <textarea
              id="htmlContent"
              className="min-h-[300px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-mono shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-200"
              placeholder="Paste your HTML here. Click 'How to Get HTML' button above for step-by-step instructions."
              {...register("htmlContent")}
            />
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <HelpCircle className="h-3 w-3" />
              Don't know how to get HTML?{" "}
              <button
                type="button"
                onClick={() => setShowHelpModal(true)}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Click here for instructions
              </button>
            </p>
            {showPreview && htmlContent && (
              <div className="mt-3 border border-gray-200 rounded-lg bg-white p-4 max-h-96 overflow-auto">
                <div className="mb-2 text-xs text-gray-500 border-b pb-2 font-medium">
                  HTML Preview:
                </div>
                <div
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                  className="text-xs"
                />
              </div>
            )}
          </div>

          {error && (
            <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Button type="submit" isLoading={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner className="h-4 w-4 mr-2" />
                  Creating...
                </>
              ) : (
                "Create Version"
              )}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push(`/templates/${templateId}`)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>

      {/* HTML Export Help Modal */}
      <HtmlExportModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />
    </div>
  );
}

