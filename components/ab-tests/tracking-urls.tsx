"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link2, Copy, Check } from "lucide-react";
import { useState } from "react";

interface TrackingUrlsProps {
  testId: string;
  versionAId: string;
  versionBId: string;
}

export function TrackingUrls({ testId, versionAId, versionBId }: TrackingUrlsProps) {
  const [copiedA, setCopiedA] = useState(false);
  const [copiedB, setCopiedB] = useState(false);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
  const urlA = `${baseUrl}/t/${versionAId}/test/${testId}`;
  const urlB = `${baseUrl}/t/${versionBId}/test/${testId}`;

  const copyUrl = (url: string, setCopied: (val: boolean) => void) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Link2 className="h-5 w-5" />
        Tracking URLs
      </h3>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Version A Tracking URL
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={urlA}
              className="flex-1 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-mono"
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => copyUrl(urlA, setCopiedA)}
              className="gap-2"
            >
              {copiedA ? (
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
          <p className="text-xs text-gray-500 mt-1">
            Use this URL in your email links for Version A. Clicks are tracked automatically.
          </p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Version B Tracking URL
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={urlB}
              className="flex-1 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-mono"
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => copyUrl(urlB, setCopiedB)}
              className="gap-2"
            >
              {copiedB ? (
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
          <p className="text-xs text-gray-500 mt-1">
            Use this URL in your email links for Version B. Clicks are tracked automatically.
          </p>
        </div>
      </div>
    </Card>
  );
}

