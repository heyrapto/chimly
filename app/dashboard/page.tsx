"use client";

import { CheckSquare, Users, BarChart } from "lucide-react";
import { useEffect, useState } from "react";

interface DashboardStats {
  newTasks: number;
  totalTasks: number;
  teamMembers: number;
  completionRate: number;
  recentActivities: {
    description: string;
    timeAgo: string;
  }[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        
        const response = await fetch(
          `https://chimlybackendmain.onrender.com/api/dashboard/stats/${userId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              userId: userId,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard stats");
        }

        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        } else {
          throw new Error(data.message || "Failed to fetch dashboard stats");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce" />
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce delay-100" />
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce delay-200" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-red-500 text-center">
          <p className="text-lg font-semibold mb-2">Error Loading Dashboard</p>
          <p className="text-sm text-zinc-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <h1 className="text-2xl font-bold text-white text-right">Dashboard</h1>
        <button className="w-full sm:w-auto px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
          New Task
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        {/* Total Tasks Card */}
        <div className="p-4 sm:p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-lg">
              <CheckSquare className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Total Tasks</p>
              <p className="text-2xl font-bold text-white">{stats?.totalTasks || 0}</p>
            </div>
          </div>
        </div>

        {/* Team Members Card */}
        <div className="p-4 sm:p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Team Members</p>
              <p className="text-2xl font-bold text-white">{stats?.teamMembers || 0}</p>
            </div>
          </div>
        </div>

        {/* Completion Rate Card */}
        <div className="p-4 sm:p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <BarChart className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Completion Rate</p>
              <p className="text-2xl font-bold text-white">{stats?.completionRate || 0}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {stats?.recentActivities?.map((activity, index) => (
            <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <p className="text-sm text-zinc-400">
                {activity.description}
              </p>
              <span className="text-xs text-zinc-500 sm:ml-auto">{activity.timeAgo}</span>
            </div>
          ))}
          {(!stats?.recentActivities || stats.recentActivities.length === 0) && (
            <p className="text-sm text-zinc-400 text-center py-4">No recent activities</p>
          )}
        </div>
      </div>
    </>
  );
}
