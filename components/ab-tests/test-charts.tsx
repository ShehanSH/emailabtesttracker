"use client";

import { Card } from "@/components/ui/card";

interface TestChartsProps {
  resultA: {
    opens: number;
    clicks: number;
    ctr: number;
    conversions?: number;
    revenue?: number;
  };
  resultB: {
    opens: number;
    clicks: number;
    ctr: number;
    conversions?: number;
    revenue?: number;
  };
}

export function TestCharts({ resultA, resultB }: TestChartsProps) {
  const maxValue = Math.max(
    resultA.opens,
    resultB.opens,
    resultA.clicks,
    resultB.clicks,
    100
  );

  const opensPercentageA = maxValue > 0 ? (resultA.opens / maxValue) * 100 : 0;
  const opensPercentageB = maxValue > 0 ? (resultB.opens / maxValue) * 100 : 0;
  const clicksPercentageA = maxValue > 0 ? (resultA.clicks / maxValue) * 100 : 0;
  const clicksPercentageB = maxValue > 0 ? (resultB.clicks / maxValue) * 100 : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="p-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Opens Comparison</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Version A</span>
              <span>{resultA.opens}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-blue-600 h-4 rounded-full transition-all"
                style={{ width: `${opensPercentageA}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Version B</span>
              <span>{resultB.opens}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-purple-600 h-4 rounded-full transition-all"
                style={{ width: `${opensPercentageB}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Clicks Comparison</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Version A</span>
              <span>{resultA.clicks}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-blue-600 h-4 rounded-full transition-all"
                style={{ width: `${clicksPercentageA}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Version B</span>
              <span>{resultB.clicks}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-purple-600 h-4 rounded-full transition-all"
                style={{ width: `${clicksPercentageB}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">CTR Comparison</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-700">Version A</span>
              <span className="font-semibold text-gray-900">
                {resultA.ctr.toFixed(2)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all"
                style={{ width: `${Math.min(resultA.ctr, 100)}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-700">Version B</span>
              <span className="font-semibold text-gray-900">
                {resultB.ctr.toFixed(2)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-purple-600 h-3 rounded-full transition-all"
                style={{ width: `${Math.min(resultB.ctr, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Performance Summary</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Opens</span>
            <span className="font-semibold text-gray-900">
              {(resultA.opens + resultB.opens).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Clicks</span>
            <span className="font-semibold text-gray-900">
              {(resultA.clicks + resultB.clicks).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">CTR Difference</span>
            <span className="font-semibold text-gray-900">
              {Math.abs(resultA.ctr - resultB.ctr).toFixed(2)}%
            </span>
          </div>
          {resultA.conversions !== undefined && resultB.conversions !== undefined && (
            <div className="flex justify-between">
              <span className="text-gray-600">Total Conversions</span>
              <span className="font-semibold text-gray-900">
                {((resultA.conversions || 0) + (resultB.conversions || 0)).toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

