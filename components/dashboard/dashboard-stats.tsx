"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

interface DashboardStats {
  templatesCount: number;
  runningTestsCount: number;
  completedTestsCount: number;
  avgCtrLift: number;
}

export function DashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/dashboard/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="space-y-2">
            <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
            <div className="h-8 w-16 animate-pulse rounded bg-gray-200" />
            <div className="h-3 w-32 animate-pulse rounded bg-gray-200" />
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="space-y-2">
          <p className="text-sm font-medium text-gray-600">Templates</p>
          <p className="text-3xl font-semibold text-gray-900">0</p>
          <p className="text-sm text-gray-500">No templates yet</p>
        </Card>
        <Card className="space-y-2">
          <p className="text-sm font-medium text-gray-600">Running A/B tests</p>
          <p className="text-3xl font-semibold text-gray-900">0</p>
          <p className="text-sm text-gray-500">No active tests</p>
        </Card>
        <Card className="space-y-2">
          <p className="text-sm font-medium text-gray-600">Avg CTR lift</p>
          <p className="text-3xl font-semibold text-gray-900">0%</p>
          <p className="text-sm text-gray-500">No data yet</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="space-y-2">
        <p className="text-sm font-medium text-gray-600">Templates</p>
        <p className="text-3xl font-semibold text-gray-900">
          {stats.templatesCount}
        </p>
        <p className="text-sm text-gray-500">Total templates created</p>
      </Card>
      <Card className="space-y-2">
        <p className="text-sm font-medium text-gray-600">Running A/B tests</p>
        <p className="text-3xl font-semibold text-gray-900">
          {stats.runningTestsCount}
        </p>
        <p className="text-sm text-gray-500">
          {stats.completedTestsCount} completed
        </p>
      </Card>
      <Card className="space-y-2">
        <p className="text-sm font-medium text-gray-600">Avg CTR lift</p>
        <p className="text-3xl font-semibold text-gray-900">
          {stats.avgCtrLift > 0 ? "+" : ""}
          {stats.avgCtrLift.toFixed(1)}%
        </p>
        <p className="text-sm text-gray-500">vs. previous period</p>
      </Card>
    </div>
  );
}

