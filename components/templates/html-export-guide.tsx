"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Copy,
  Check,
  Mail,
  FileCode,
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
      "Paste it into the HTML Content field below",
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
      "Paste it into the HTML Content field below",
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
      "Paste it into the HTML Content field below",
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
      "Paste it into the HTML Content field below",
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
      "Paste it into the HTML Content field below",
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
      "Paste it into the HTML Content field below",
    ],
  },
];

export function HtmlExportGuide() {
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

  return (
    <Card className="p-6 bg-blue-50 border-blue-200">
      <div className="flex items-start gap-3 mb-4">
        <HelpCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-blue-900 mb-1">
            How to Get HTML from Your Email Marketing Tool
          </h3>
          <p className="text-sm text-blue-800">
            Don't know HTML? No problem! Most email marketing tools let you export or copy the HTML
            code. Follow the steps below for your tool.
          </p>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {toolGuides.map((tool) => (
          <div
            key={tool.name}
            className="border border-blue-200 rounded-lg bg-white overflow-hidden"
          >
            <button
              onClick={() =>
                setExpandedTool(expandedTool === tool.name ? null : tool.name)
              }
              className="w-full flex items-center justify-between p-3 hover:bg-blue-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-gray-900">{tool.name}</span>
                <Badge variant="default" className="text-xs">
                  {tool.exportMethod}
                </Badge>
              </div>
              {expandedTool === tool.name ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </button>

            {expandedTool === tool.name && (
              <div className="p-4 pt-0 border-t border-blue-200 bg-blue-50">
                <ol className="space-y-2 text-sm text-gray-700">
                  {tool.steps.map((step, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-semibold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="flex-1 pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
                {tool.link && (
                  <a
                    href={tool.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Official {tool.name} Guide
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-blue-200 pt-4">
        <div className="flex items-start gap-2 mb-3">
          <FileCode className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900 mb-1">
              Need a Starting Point?
            </p>
            <p className="text-xs text-blue-800 mb-2">
              Use this example HTML template to get started, then customize it:
            </p>
            <div className="bg-white border border-blue-200 rounded p-3 relative">
              <pre className="text-xs text-gray-700 overflow-x-auto max-h-32">
                {exampleHtml.substring(0, 200)}...
              </pre>
              <Button
                variant="secondary"
                size="sm"
                onClick={copyExample}
                className="mt-2 gap-2"
              >
                {copiedExample ? (
                  <>
                    <Check className="h-3 w-3" />
                    Copied!
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

      <div className="mt-4 p-3 bg-blue-100 rounded border border-blue-200">
        <p className="text-xs text-blue-900">
          <strong>💡 Tip:</strong> After pasting HTML, you can preview it below to make sure it
          looks correct before saving.
        </p>
      </div>
    </Card>
  );
}

