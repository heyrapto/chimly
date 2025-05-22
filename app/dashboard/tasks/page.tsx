"use client";

import {
  CheckSquare,
  Clock,
  Filter,
  Plus,
  Search,
  Tag,
  MoreVertical,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Task {
  _id: string;
  activity: string;
  time: string;
  duration: string;
  completed: boolean;
  statusEmoji: string;
  createdAt: string;
  updatedAt: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        console.log("Token:", token);
        console.log("UserId:", userId);

        if (!token || !userId) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(
          `https://chimlybackendmain.onrender.com/api/schedules/user/${userId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: userId,
            }),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch tasks: ${errorText}`);
        }

        const data = await response.json();
        console.log("API Response Data:", data);
        
        if (data.success && Array.isArray(data.tasks)) {
          console.log("Tasks found:", data.tasks.length);
          setTasks(data.tasks || []);
        } else {
          console.error("Unexpected response format:", data);
          setTasks([]);
        }
      } catch (err: any) {
        console.error("Error fetching tasks:", err);
        setError(err.message || "Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-400">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // Filter tasks based on search query and status filter
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.activity?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    if (statusFilter === 'completed') return matchesSearch && task.completed;
    if (statusFilter === 'active') return matchesSearch && !task.completed;
    
    return matchesSearch;
  });

  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Tasks</h1>
            <p className="text-zinc-400 mt-1">View and track your tasks</p>
          </div>
          <Link
            href="/dashboard/tasks/new"
            className="w-full sm:w-auto px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Task
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-white rounded-lg hover:bg-zinc-800 transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] bg-zinc-900 border-zinc-800 text-white">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                <SelectItem value="all">All Tasks</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="text-center text-zinc-400">No tasks found</div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task._id}
                className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <span className="text-xl" role="img" aria-label="status">
                        {task.statusEmoji || "⏳"}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{task.activity}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center text-xs text-zinc-400">
                          <Clock className="w-3 h-3 mr-1" />
                          {task.duration} min
                        </span>
                        <span className="text-xs text-zinc-500">
                          Created {new Date(task.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      className={`px-2 py-1 rounded text-xs ${task.completed ? 'bg-emerald-500/20 text-emerald-500' : 'bg-zinc-700/20 text-zinc-400'}`}
                    >
                      {task.completed ? 'Completed' : 'In Progress'}
                    </button>
                    <button className="p-1 hover:bg-zinc-800 rounded">
                      <MoreVertical className="w-4 h-4 text-zinc-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination - only show if we have tasks */}
        {filteredTasks.length > 0 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center gap-2">
              <button className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
                Previous
              </button>
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((page) => (
                  <button
                    key={page}
                    className={`px-3 py-1 rounded-lg ${
                      page === 1
                        ? "bg-emerald-600 text-white"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                    } transition-colors`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
