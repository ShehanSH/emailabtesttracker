"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { TrendingUp, Calendar, Award } from "lucide-react";

interface AbTest {
  id: string;
  campaignName: string;
  status: string;
  startDate: string;
  results?: {
    winner: string | null;
    statisticalSignificance?: number;
    versionA?: { ctr: number; opens: number; clicks: number };
    versionB?: { ctr: number; opens: number; clicks: number };
  } | null;
}

export function RecentTests() {
  const [tests, setTests] = useState<AbTest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTests() {
      try {
        const res = await fetch("/api/ab-tests");
        if (res.ok) {
          const data = await res.json();
          const allTests = data.tests || [];
          // Show only running and recently completed tests
          const recentTests = allTests
            .filter((test: any) => test.status === "running" || test.status === "completed")
            .slice(0, 3);
          setTests(recentTests);
        }
      } catch (error) {
        console.error("Failed to fetch tests:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTests();
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

  if (tests.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent A/B Tests
        </h3>
        <p className="text-sm text-gray-600 text-center py-4">
          No active tests. Create your first A/B test to get started.
        </p>
        <Link href="/ab-tests/new">
          <Button className="w-full mt-4">Create A/B Test</Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent A/B Tests</h3>
        <Link href="/ab-tests">
          <Button variant="secondary" size="sm">
            View All
          </Button>
        </Link>
      </div>
      <div className="space-y-4">
        {tests.map((test) => (
          <Link
            key={test.id}
            href={`/ab-tests/${test.id}`}
            className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-gray-900">{test.campaignName}</h4>
                  <Badge
                    variant={
                      test.status === "running"
                        ? "success"
                        : test.status === "completed"
                        ? "default"
                        : "warning"
                    }
                  >
                    {test.status}
                  </Badge>
                </div>
                {test.results && (
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {test.results.winner && (
                      <div className="flex items-center gap-1">
                        <Award className="h-4 w-4 text-green-600" />
                        <span>Winner: {test.results.winner === "versionA" ? "A" : "B"}</span>
                      </div>
                    )}
                    {test.results.versionA && test.results.versionB && (
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        <span>
                          A: {test.results.versionA.ctr.toFixed(2)}% | B:{" "}
                          {test.results.versionB.ctr.toFixed(2)}%
                        </span>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                  <Calendar className="h-3 w-3" />
                  Started: {new Date(test.startDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}

