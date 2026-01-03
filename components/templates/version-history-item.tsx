"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye, Copy, Check, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";

interface VersionHistoryItemProps {
  version: {
    id: string;
    templateId?: string | null;
    versionNumber?: string | null;
    createdAt?: string | null; // ISO string, not Firestore Timestamp
    htmlContent?: string | null;
    changes?: Array<{ field: string; oldValue?: string; newValue?: string }> | null;
    createdBy?: string | null;
    performanceMetrics?: {
      opens?: number;
      clicks?: number;
      ctr?: number;
      conversions?: number;
    } | null;
  };
  isLatest: boolean;
  index: number;
  templateId: string;
}

export function VersionHistoryItem({
  version,
  isLatest,
  index,
  templateId,
}: VersionHistoryItemProps) {
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const copyHtml = () => {
    if (version.htmlContent) {
      navigator.clipboard.writeText(version.htmlContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatDate = (date: string | null | undefined) => {
    if (!date) return "Unknown date";
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return "Unknown date";
      return dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Unknown date";
    }
  };

  const useInAbTest = () => {
    router.push(`/ab-tests/new?versionId=${version.id}&templateId=${templateId}`);
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Badge variant={isLatest ? "success" : "default"}>
            {version.versionNumber || `v${index + 1}.0`}
          </Badge>
          {isLatest && (
            <Badge variant="default" className="text-xs">
              Latest
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <p className="text-xs text-gray-500">{formatDate(version.createdAt)}</p>
        </div>
      </div>

      {version.changes && version.changes.length > 0 && (
        <div className="mb-3 p-2 bg-blue-50 rounded border border-blue-200">
          <p className="text-xs font-medium text-blue-900 mb-1">Changes:</p>
          <ul className="text-xs text-blue-800 space-y-1">
            {version.changes.map((change, i) => (
              <li key={i} className="flex items-start gap-1">
                <span>•</span>
                <span>
                  <strong>{change.field}:</strong> {change.oldValue || "N/A"} →{" "}
                  {change.newValue || "N/A"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {version.performanceMetrics && (
        <div className="mb-3 grid grid-cols-4 gap-3 p-3 bg-gray-50 rounded">
          <div>
            <p className="text-xs text-gray-600 mb-1">Opens</p>
            <p className="text-sm font-semibold text-gray-900">
              {version.performanceMetrics.opens || 0}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Clicks</p>
            <p className="text-sm font-semibold text-gray-900">
              {version.performanceMetrics.clicks || 0}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">CTR</p>
            <p className="text-sm font-semibold text-gray-900">
              {(version.performanceMetrics.ctr || 0).toFixed(2)}%
            </p>
          </div>
          {version.performanceMetrics.conversions !== undefined &&
            version.performanceMetrics.conversions > 0 && (
              <div>
                <p className="text-xs text-gray-600 mb-1">Conversions</p>
                <p className="text-sm font-semibold text-gray-900">
                  {version.performanceMetrics.conversions}
                </p>
              </div>
            )}
        </div>
      )}

      {version.htmlContent && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-gray-700">HTML Content</p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={copyHtml}
                className="gap-1 text-xs h-7"
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
                onClick={() => setShowFullPreview(!showFullPreview)}
                className="gap-1 text-xs h-7"
              >
                <Eye className="h-3 w-3" />
                {showFullPreview ? "Hide" : "Preview"}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={useInAbTest}
                className="gap-1 text-xs h-7"
              >
                <ExternalLink className="h-3 w-3" />
                Use in A/B Test
              </Button>
            </div>
          </div>

          {showFullPreview ? (
            <div className="space-y-2">
              <div className="bg-white border border-gray-200 rounded p-4 max-h-96 overflow-auto">
                <div
                  dangerouslySetInnerHTML={{ __html: version.htmlContent }}
                  className="text-xs"
                />
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded p-3 max-h-32 overflow-auto">
                <pre className="text-xs text-gray-700 whitespace-pre-wrap break-words">
                  {version.htmlContent}
                </pre>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded p-3 max-h-32 overflow-auto">
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    version.htmlContent.length > 500
                      ? version.htmlContent.substring(0, 500) + "..."
                      : version.htmlContent,
                }}
                className="text-xs"
              />
              {version.htmlContent.length > 500 && (
                <p className="text-xs text-gray-500 mt-2">
                  {version.htmlContent.length} characters total. Click "Preview" to see full
                  content.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {!version.htmlContent && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 italic">No HTML content available</p>
        </div>
      )}
    </Card>
  );
}

