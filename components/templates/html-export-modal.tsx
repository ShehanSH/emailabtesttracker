"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  X,
  ExternalLink,
  Copy,
  Check,
  Mail,
  FileCode,
  HelpCircle,
} from "lucide-react";

interface ToolGuide {
  name: string;
  steps: string[];
  exportMethod: string;
  link?: string;
}

const toolGuides: ToolGuide[] = [
  {
    name: "Mailchimp",
    exportMethod: "Export HTML or View Source",
    link: "https://mailchimp.com/help/view-email-source-code/",
    steps: [
      "Open your email campaign in Mailchimp",
      "Click on the email to edit it",
      "Click the 'Code' button in the top toolbar (or press Ctrl+Shift+E)",
      "Copy all the HTML code from the code view",
      "Paste it into the HTML Content field",
    ],
  },
  {
    name: "ConvertKit",
    exportMethod: "Export HTML",
    link: "https://help.convertkit.com/en/articles/2502599-how-to-export-your-email-template",
    steps: [
      "Go to your email template in ConvertKit",
      "Click on the template to edit it",
      "Click the 'Settings' or 'Actions' menu",
      "Select 'Export HTML' or 'View Source'",
      "Copy the HTML code",
      "Paste it into the HTML Content field",
    ],
  },
  {
    name: "Constant Contact",
    exportMethod: "View Source Code",
    steps: [
      "Open your email in Constant Contact",
      "Click 'Edit' on your email",
      "Click the 'Code' tab at the top",
      "Copy all the HTML code",
      "Paste it into the HTML Content field",
    ],
  },
  {
    name: "Campaign Monitor",
    exportMethod: "Export HTML",
    steps: [
      "Open your email template in Campaign Monitor",
      "Click 'Edit' on your template",
      "Go to 'Settings' → 'Export'",
      "Select 'Export HTML'",
      "Copy the HTML code",
      "Paste it into the HTML Content field",
    ],
  },
  {
    name: "SendGrid",
    exportMethod: "Copy HTML from Editor",
    steps: [
      "Open your email template in SendGrid",
      "Click 'Edit' on your template",
      "Switch to 'Code' view (if available)",
      "Or use browser DevTools: Right-click → Inspect → Copy HTML",
      "Paste it into the HTML Content field",
    ],
  },
  {
    name: "Generic Method (Any Tool)",
    exportMethod: "Browser DevTools",
    steps: [
      "Open your email in your email marketing tool",
      "Right-click on the email preview",
      "Select 'Inspect' or 'Inspect Element'",
      "In the DevTools, find the main email container",
      "Right-click the HTML element → 'Copy' → 'Copy outerHTML'",
      "Paste it into the HTML Content field",
    ],
  },
];

interface HtmlExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HtmlExportModal({ isOpen, onClose }: HtmlExportModalProps) {
  const [expandedTool, setExpandedTool] = useState<string | null>(null);
  const [copiedExample, setCopiedExample] = useState(false);

  const exampleHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Template</title>
</head>
<body style="margin: 0; padding: 20px; font-family: Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <h1 style="color: #333333;">Hello World!</h1>
    <p style="color: #666666;">This is a sample email template.</p>
    <a href="#" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Click Here</a>
  </div>
</body>
</html>`;

  const copyExample = () => {
    navigator.clipboard.writeText(exampleHtml);
    setCopiedExample(true);
    setTimeout(() => setCopiedExample(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-50 w-full max-w-3xl max-h-[90vh] mx-4 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <HelpCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                How to Export HTML from Email Tools
              </h2>
              <p className="text-sm text-gray-600 mt-0.5">
                Step-by-step guides for popular email marketing platforms
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            className="rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {/* Tool Guides */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                Select Your Email Tool (Click to View Steps)
              </h3>
              <div className="grid gap-3 md:grid-cols-2">
                {toolGuides.map((tool) => {
                  const isExpanded = expandedTool === tool.name;
                  return (
                    <div
                      key={tool.name}
                      className={`rounded-xl border p-4 cursor-pointer transition-all select-none ${
                        isExpanded
                          ? "border-2 border-blue-500 bg-blue-50 shadow-md"
                          : "border border-gray-200 hover:border-blue-300 hover:shadow-md bg-white"
                      }`}
                      onClick={() => {
                        setExpandedTool(isExpanded ? null : tool.name);
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setExpandedTool(isExpanded ? null : tool.name);
                        }
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div
                            className={`p-2 rounded-lg transition-colors ${
                              isExpanded
                                ? "bg-blue-600"
                                : "bg-gray-100 group-hover:bg-blue-100"
                            }`}
                          >
                            <Mail
                              className={`h-4 w-4 transition-colors ${
                                isExpanded
                                  ? "text-white"
                                  : "text-gray-600"
                              }`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900">
                                {tool.name}
                              </h4>
                              {isExpanded && (
                                <span className="text-xs text-blue-600 font-medium">
                                  ✓ Selected
                                </span>
                              )}
                            </div>
                            <Badge
                              variant="default"
                              className="text-xs"
                            >
                              {tool.exportMethod}
                            </Badge>
                            {!isExpanded && (
                              <p className="text-xs text-gray-500 mt-2">
                                Click to view step-by-step instructions
                              </p>
                            )}
                          </div>
                        </div>
                        <div
                          className={`ml-2 transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        >
                          <svg
                            className="h-5 w-5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-blue-200 animate-in slide-in-from-top-2 duration-200">
                          <div className="mb-3 flex items-center gap-2">
                            <div className="h-px flex-1 bg-blue-200"></div>
                            <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                              Step-by-Step Instructions
                            </span>
                            <div className="h-px flex-1 bg-blue-200"></div>
                          </div>
                          <ol className="space-y-3">
                            {tool.steps.map((step, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-3 text-sm text-gray-700"
                              >
                                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mt-0.5 shadow-sm">
                                  {index + 1}
                                </span>
                                <span className="flex-1 pt-1 leading-relaxed">
                                  {step}
                                </span>
                              </li>
                            ))}
                          </ol>
                          {tool.link && (
                            <a
                              href={tool.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-4 inline-flex items-center gap-2 text-xs text-blue-600 hover:text-blue-800 font-medium px-3 py-2 rounded-md hover:bg-blue-100 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="h-3 w-3" />
                              View Official {tool.name} Guide
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Example HTML */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <FileCode className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Need a Starting Point?
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Use this example HTML template to get started, then customize
                    it:
                  </p>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 relative">
                    <pre className="text-xs text-gray-700 overflow-x-auto max-h-40 font-mono">
                      {exampleHtml.substring(0, 250)}...
                    </pre>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={copyExample}
                      className="mt-3 gap-2"
                    >
                      {copiedExample ? (
                        <>
                          <Check className="h-3 w-3" />
                          Copied to Clipboard!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          Copy Example HTML
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tip */}
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong className="font-semibold">💡 Pro Tip:</strong> After
                pasting HTML, use the "Show Preview" button below the HTML field
                to verify it looks correct before saving.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <Button onClick={onClose} className="w-full">
            Got it, Close Guide
          </Button>
        </div>
      </div>
    </div>
  );
}

