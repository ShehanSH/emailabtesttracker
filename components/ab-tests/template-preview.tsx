"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface TemplatePreviewProps {
  templateName: string;
  versionNumber: string;
  htmlContent: string;
  campaignType?: string;
}

export function TemplatePreview({
  templateName,
  versionNumber,
  htmlContent,
  campaignType,
}: TemplatePreviewProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyHtml = () => {
    navigator.clipboard.writeText(htmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!htmlContent) {
    return null;
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-900">{templateName}</h4>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="default">{versionNumber}</Badge>
            {campaignType && <Badge variant="default">{campaignType}</Badge>}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={copyHtml}
            className="gap-1"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                Copy HTML
              </>
            )}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="gap-1"
          >
            <Eye className="h-3 w-3" />
            {showPreview ? "Hide" : "Preview"}
          </Button>
        </div>
      </div>

      {showPreview && (
        <div className="mt-3 border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 p-2 text-xs text-gray-600 border-b">
            HTML Preview
          </div>
          <div
            className="p-4 max-h-64 overflow-auto bg-white"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>
      )}
    </Card>
  );
}

