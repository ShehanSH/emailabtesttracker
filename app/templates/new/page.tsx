"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createTemplateSchema } from "@/lib/validators/templates";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { HtmlExportModal } from "@/components/templates/html-export-modal";
import { Eye, EyeOff, HelpCircle } from "lucide-react";

type TemplateInput = z.infer<typeof createTemplateSchema>;

export default function NewTemplatePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<TemplateInput>({
    resolver: zodResolver(createTemplateSchema),
    defaultValues: {
      name: "",
      campaignType: "",
      subject: "",
      preview: "",
      htmlContent: "",
    },
  });

  const htmlContent = watch("htmlContent");

  const onSubmit = async (values: TemplateInput) => {
    setError(null);
    const res = await fetch("/api/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      setError(body?.error ?? "Unable to save template.");
      return;
    }

    router.push("/templates");
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Card className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-500">Template</p>
              <h1 className="text-2xl font-semibold text-gray-900">New template</h1>
              <p className="text-sm text-gray-600 mt-1">
                Create a new email template. Export HTML from your email marketing tool and paste it below.
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Template name</Label>
              <Input id="name" placeholder="Welcome series v1" {...register("name")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="campaignType">Campaign type</Label>
              <Input
                id="campaignType"
                placeholder="product_launch | nurture | promo"
                {...register("campaignType")}
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject line</Label>
              <Input id="subject" placeholder="A/B subject line" {...register("subject")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preview">Preview text</Label>
              <Input id="preview" placeholder="Quick preview copy" {...register("preview")} />
            </div>
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
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
          <Button type="submit" isLoading={isSubmitting}>
            {isSubmitting ? <Spinner className="h-4 w-4" /> : "Save template"}
          </Button>
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

