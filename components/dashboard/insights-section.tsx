"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { TrendingUp, Award, Lightbulb } from "lucide-react";

interface Insights {
  allTimeTests: number;
  winRate: {
    versionA: number;
    versionB: number;
  };
  averageCtrLift: number;
  patterns: Array<{
    pattern: string;
    winRate: number;
    description: string;
  }>;
}

export function InsightsSection() {
  const [insights, setInsights] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInsights() {
      try {
        const res = await fetch("/api/insights");
        if (res.ok) {
          const data = await res.json();
          setInsights(data.insights);
        }
      } catch (error) {
        console.error("Failed to fetch insights:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchInsights();
  }, []);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <Spinner className="h-6 w-6" />
        </div>
      </Card>
    );
  }

  if (!insights || insights.allTimeTests === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          <h3 className="text-lg font-semibold text-gray-900">Insights</h3>
        </div>
        <p className="text-sm text-gray-600">
          Complete A/B tests to see insights and patterns.
        </p>
      </Card>
    );
  }

  const totalWins = insights.winRate.versionA + insights.winRate.versionB;
  const versionAWinRate =
    totalWins > 0 ? (insights.winRate.versionA / totalWins) * 100 : 0;
  const versionBWinRate =
    totalWins > 0 ? (insights.winRate.versionB / totalWins) * 100 : 0;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="h-5 w-5 text-amber-500" />
        <h3 className="text-lg font-semibold text-gray-900">Insights</h3>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">All-Time Tests</p>
          <p className="text-2xl font-semibold text-gray-900">
            {insights.allTimeTests}
          </p>
        </div>

        {insights.averageCtrLift > 0 && (
          <div>
            <p className="text-sm text-gray-600 mb-1">Average CTR Lift</p>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <p className="text-2xl font-semibold text-gray-900">
                +{insights.averageCtrLift.toFixed(1)}%
              </p>
            </div>
          </div>
        )}

        {totalWins > 0 && (
          <div>
            <p className="text-sm text-gray-600 mb-2">Win Rate</p>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Version A</span>
                  <span>{versionAWinRate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${versionAWinRate}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Version B</span>
                  <span>{versionBWinRate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: `${versionBWinRate}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {insights.patterns.length > 0 && (
          <div>
            <p className="text-sm text-gray-600 mb-2">Patterns</p>
            <div className="space-y-2">
              {insights.patterns.map((pattern, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{pattern.pattern}</span>
                  <Badge variant="success">{pattern.winRate.toFixed(0)}%</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

