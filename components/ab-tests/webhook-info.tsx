"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, ExternalLink, AlertCircle } from "lucide-react";

interface WebhookInfoProps {
  testId: string;
}

export function WebhookInfo({ testId }: WebhookInfoProps) {
  const [webhookInfo, setWebhookInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchWebhookInfo() {
      try {
        const res = await fetch(`/api/ab-tests/${testId}/webhook-info`);
        if (res.ok) {
          const data = await res.json();
          setWebhookInfo(data);
        }
      } catch (error) {
        console.error("Failed to fetch webhook info:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchWebhookInfo();
  }, [testId]);

  const copyWebhookUrl = () => {
    if (webhookInfo?.webhookUrl) {
      navigator.clipboard.writeText(webhookInfo.webhookUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return null;
  }

  if (!webhookInfo) {
    return null;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Webhook Integration</h3>
        <Badge>Zapier Ready</Badge>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Webhook URL
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={webhookInfo.webhookUrl}
              readOnly
              className="flex-1 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-mono"
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={copyWebhookUrl}
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
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-2 mb-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900 mb-2">
                Zapier Integration Steps
              </p>
              <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
                {webhookInfo.instructions?.zapier?.steps.map((step: string, i: number) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              window.open("https://zapier.com/apps/email-ab-tracker/integrations", "_blank")
            }
            className="gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Open Zapier
          </Button>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-700 mb-2">Manual Webhook Payload:</p>
          <pre className="text-xs bg-white p-3 rounded border border-gray-200 overflow-x-auto">
            {JSON.stringify(webhookInfo.instructions?.manual?.payload, null, 2)}
          </pre>
        </div>
      </div>
    </Card>
  );
}

