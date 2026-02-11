"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Link2, Copy, Check, ExternalLink, AlertCircle, Info } from "lucide-react";
import { TemplatePreview } from "@/components/ab-tests/template-preview";

interface Template {
  id: string;
  name: string;
  campaignType?: string;
  versions: Array<{
    id: string;
    versionNumber: string;
    htmlContent?: string;
    createdAt: string;
    performanceMetrics: {
      opens: number;
      clicks: number;
      ctr: number;
    };
  }>;
}

export default function NewAbTestPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [testData, setTestData] = useState<{
    id: string;
    trackingUrls: { versionA: string; versionB: string };
  } | null>(null);

  const [formData, setFormData] = useState({
    campaignName: "",
    templateIdA: "",
    versionIdA: "",
    templateIdB: "",
    versionIdB: "",
    audienceSize: 1000,
  });

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const res = await fetch("/api/templates/versions");
        const data = await res.json();
        
        if (res.ok) {
          const templatesList = data.templates || [];
          // Filter out templates with no valid versions
          const validTemplates = templatesList.filter((t: Template) => 
            t.versions && t.versions.length > 0 && t.versions[0].id !== "no-version"
          );
          setTemplates(validTemplates);
          
          // Check for URL parameters to pre-select version
          const urlParams = new URLSearchParams(window.location.search);
          const versionId = urlParams.get("versionId");
          const templateId = urlParams.get("templateId");
          
          if (versionId && templateId) {
            // Find the template and version
            const template = validTemplates.find((t: Template) => t.id === templateId);
            if (template) {
              const version = template.versions.find((v: any) => v.id === versionId);
              if (version) {
                setFormData(prev => ({
                  ...prev,
                  templateIdA: templateId,
                  versionIdA: versionId,
                }));
              }
            }
          }
          
          if (validTemplates.length === 0 && templatesList.length > 0) {
            setError("Templates found but no versions available. Please create template versions first.");
          }
        } else {
          setError(data.error || "Failed to load templates. Please refresh the page.");
          console.error("API Error:", data);
        }
      } catch (err) {
        console.error("Failed to fetch templates:", err);
        setError("Failed to connect to server. Please check your connection.");
      } finally {
        setLoading(false);
      }
    }

    fetchTemplates();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    if (!formData.versionIdA || !formData.versionIdB) {
      setError("Please select both template versions");
      setSubmitting(false);
      return;
    }

    if (formData.versionIdA === formData.versionIdB) {
      setError("Version A and Version B must be different");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/ab-tests/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateVersionIdA: formData.versionIdA,
          templateVersionIdB: formData.versionIdB,
          campaignName: formData.campaignName,
          audienceSize: formData.audienceSize,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || data.message || "Failed to create A/B test");
        setSubmitting(false);
        return;
      }

      setTestData(data);
      setSuccess(true);
    } catch (err) {
      setError("Failed to create A/B test. Please try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (success && testData) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <Card className="p-8">
          <div className="flex items-center gap-2 mb-4">
            <Check className="h-5 w-5 text-green-600" />
            <h1 className="text-2xl font-semibold text-gray-900">
              A/B Test Created Successfully!
            </h1>
          </div>

          <p className="text-sm text-gray-600 mb-6">
            Your A/B test is now running. Use the tracking URLs below in your email platform.
          </p>

          <div className="space-y-4 mb-6">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Version A Tracking URL
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  value={testData.trackingUrls.versionA}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => copyToClipboard(testData.trackingUrls.versionA)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Version B Tracking URL
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  value={testData.trackingUrls.versionB}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => copyToClipboard(testData.trackingUrls.versionB)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">How to use these URLs:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Copy the Version A URL and use it in your email platform for 50% of your audience</li>
                  <li>Copy the Version B URL and use it for the other 50%</li>
                  <li>Send your campaign and track results in real-time</li>
                  <li>View results on the A/B test detail page</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={() => router.push(`/ab-tests/${testData.id}`)}>
              View Test Details
            </Button>
            <Button variant="secondary" onClick={() => router.push("/ab-tests")}>
              Back to A/B Tests
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Badge className="mb-2">Beta</Badge>
          <h1 className="text-2xl font-semibold text-gray-900">
            Create A/B test
          </h1>
          <p className="text-sm text-gray-600">
            Select two template versions, set audience size, and generate tracking URLs.
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => window.open("https://zapier.com/apps/email-ab-tracker/integrations", "_blank")}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Connect ESP via Zapier
        </Button>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="campaignName">Campaign Name *</Label>
            <Input
              id="campaignName"
              placeholder="Black Friday 2025 Campaign"
              value={formData.campaignName}
              onChange={(e) =>
                setFormData({ ...formData, campaignName: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="audienceSize">Audience Size *</Label>
            <Input
              id="audienceSize"
              type="number"
              min="1"
              placeholder="1000"
              value={formData.audienceSize}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  audienceSize: parseInt(e.target.value) || 0,
                })
              }
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Total number of recipients for this A/B test
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Spinner className="h-6 w-6" />
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-600 mb-2">
                {error || "No templates with versions found."}
              </p>
              <p className="text-xs text-gray-500 mb-4">
                You need to create templates and at least one version for each template.
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.push("/templates/new")}
                >
                  Create Template
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.push("/templates")}
                >
                  View Templates
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Version A Selection */}
                  <div className="space-y-3">
                    <Label>Version A *</Label>
                    <div className="space-y-2">
                      <select
                        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.templateIdA}
                        onChange={(e) => {
                          const templateId = e.target.value;
                          setFormData({
                            ...formData,
                            templateIdA: templateId,
                            versionIdA: "",
                          });
                        }}
                        required
                      >
                        <option value="">Select Template</option>
                        {templates.map((template) => (
                          <option key={template.id} value={template.id}>
                            {template.name} {template.campaignType && `(${template.campaignType})`}
                          </option>
                        ))}
                      </select>

                      {formData.templateIdA && (
                        <select
                          className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={formData.versionIdA}
                          onChange={(e) =>
                            setFormData({ ...formData, versionIdA: e.target.value })
                          }
                          required
                        >
                          <option value="">Select Version</option>
                          {templates
                            .find((t) => t.id === formData.templateIdA)
                            ?.versions.map((version) => (
                              <option key={version.id} value={version.id}>
                                {version.versionNumber} (
                                {version.performanceMetrics.ctr.toFixed(2)}% CTR)
                              </option>
                            ))}
                        </select>
                      )}

                      {formData.versionIdA && (
                        <TemplatePreview
                          templateName={
                            templates.find((t) => t.id === formData.templateIdA)?.name || ""
                          }
                          versionNumber={
                            templates
                              .find((t) => t.id === formData.templateIdA)
                              ?.versions.find((v) => v.id === formData.versionIdA)
                              ?.versionNumber || ""
                          }
                          htmlContent={
                            templates
                              .find((t) => t.id === formData.templateIdA)
                              ?.versions.find((v) => v.id === formData.versionIdA)
                              ?.htmlContent || ""
                          }
                          campaignType={
                            templates.find((t) => t.id === formData.templateIdA)?.campaignType
                          }
                        />
                      )}
                    </div>
                  </div>

                  {/* Version B Selection */}
                  <div className="space-y-3">
                    <Label>Version B *</Label>
                    <div className="space-y-2">
                      <select
                        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.templateIdB}
                        onChange={(e) => {
                          const templateId = e.target.value;
                          setFormData({
                            ...formData,
                            templateIdB: templateId,
                            versionIdB: "",
                          });
                        }}
                        required
                      >
                        <option value="">Select Template</option>
                        {templates.map((template) => (
                          <option key={template.id} value={template.id}>
                            {template.name} {template.campaignType && `(${template.campaignType})`}
                          </option>
                        ))}
                      </select>

                      {formData.templateIdB && (
                        <select
                          className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={formData.versionIdB}
                          onChange={(e) =>
                            setFormData({ ...formData, versionIdB: e.target.value })
                          }
                          required
                        >
                          <option value="">Select Version</option>
                          {templates
                            .find((t) => t.id === formData.templateIdB)
                            ?.versions.map((version) => (
                              <option key={version.id} value={version.id}>
                                {version.versionNumber} (
                                {version.performanceMetrics.ctr.toFixed(2)}% CTR)
                              </option>
                            ))}
                        </select>
                      )}

                      {formData.versionIdB && (
                        <TemplatePreview
                          templateName={
                            templates.find((t) => t.id === formData.templateIdB)?.name || ""
                          }
                          versionNumber={
                            templates
                              .find((t) => t.id === formData.templateIdB)
                              ?.versions.find((v) => v.id === formData.versionIdB)
                              ?.versionNumber || ""
                          }
                          htmlContent={
                            templates
                              .find((t) => t.id === formData.templateIdB)
                              ?.versions.find((v) => v.id === formData.versionIdB)
                              ?.htmlContent || ""
                          }
                          campaignType={
                            templates.find((t) => t.id === formData.templateIdB)?.campaignType
                          }
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Info about using templates */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">How to use your templates:</p>
                      <ol className="list-decimal list-inside space-y-1 ml-2">
                        <li>Select templates and versions above</li>
                        <li>Click "Preview" to see the HTML content</li>
                        <li>Click "Copy HTML" to copy the template code</li>
                        <li>Paste into your email platform (Mailchimp, ConvertKit, etc.)</li>
                        <li>After creating the test, replace links with the tracking URLs</li>
                        <li>Send your campaign and track results automatically!</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <Button type="submit" disabled={submitting} className="gap-2">
                  {submitting ? (
                    <>
                      <Spinner className="h-4 w-4" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Link2 className="h-4 w-4" />
                      Create A/B Test
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.push("/ab-tests")}
                >
                  Cancel
                </Button>
              </div>
            </>
          )}
        </form>
      </Card>

      <div className="mt-6 space-y-4">
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">What is Zapier Integration?</p>
              <p className="mb-2">
                Zapier connects your email platform (Mailchimp, ConvertKit, etc.) to our app.
                When someone opens or clicks your email, Zapier automatically tells our app,
                so results update in real-time without manual work.
              </p>
              <p className="text-xs">
                <strong>You don't need Zapier to track clicks!</strong> The tracking URLs work automatically.
                Zapier is only needed if you want automatic open tracking.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-amber-50 border-amber-200">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-amber-600 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-1">How A/B Testing Works:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li><strong>Create templates</strong> in our app (you've done this!)</li>
                <li><strong>Select two versions</strong> to compare (above)</li>
                <li><strong>Get tracking URLs</strong> after creating the test</li>
                <li><strong>Copy HTML</strong> from our templates and paste into your email platform</li>
                <li><strong>Replace links</strong> in the email with tracking URLs</li>
                <li><strong>Send campaign</strong> - clicks are tracked automatically!</li>
                <li><strong>View results</strong> on the dashboard in real-time</li>
              </ol>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
