"use client";

import { CheckSquare, Users, BarChart } from "lucide-react";

export default function DashboardPage() {
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
        {/* Stat Card */}
        <div className="p-4 sm:p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-lg">
              <CheckSquare className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Total Tasks</p>
              <p className="text-2xl font-bold text-white">248</p>
            </div>
          </div>
        </div>

        {/* Stat Card */}
        <div className="p-4 sm:p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Team Members</p>
              <p className="text-2xl font-bold text-white">12</p>
            </div>
          </div>
        </div>

        {/* Stat Card */}
        <div className="p-4 sm:p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <BarChart className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Completion Rate</p>
              <p className="text-2xl font-bold text-white">87%</p>
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
          {/* Activity Item */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <p className="text-sm text-zinc-400">
              <span className="text-white">Sarah</span> completed task{" "}
              <span className="text-white">Homepage Redesign</span>
            </p>
            <span className="text-xs text-zinc-500 sm:ml-auto">2h ago</span>
          </div>

          {/* Activity Item */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <p className="text-sm text-zinc-400">
              <span className="text-white">Mike</span> added new task{" "}
              <span className="text-white">API Integration</span>
            </p>
            <span className="text-xs text-zinc-500 sm:ml-auto">4h ago</span>
          </div>

          {/* Activity Item */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <div className="w-2 h-2 rounded-full bg-purple-500" />
            <p className="text-sm text-zinc-400">
              <span className="text-white">Anna</span> updated project{" "}
              <span className="text-white">Mobile App</span>
            </p>
            <span className="text-xs text-zinc-500 sm:ml-auto">6h ago</span>
          </div>
        </div>
      </div>
    </>
  );
}
