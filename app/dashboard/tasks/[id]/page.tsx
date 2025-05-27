"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, Calendar, Flag, Tag, Trash2, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  statusEmoji: string;
  priority: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export default function TaskDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [explanation, setExplanation] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/login";
          return;
        }

        const response = await fetch(
          `https://chimlybackendmain.onrender.com/api/schedule/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch task details");
        }

        const data = await response.json();
        setTask(data.task);
        setExplanation(data.explanation);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, []);

  const handleDeleteTask = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const response = await fetch(
        `https://chimlybackendmain.onrender.com/api/schedule`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            taskId: id,
            userId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      router.push("/dashboard/tasks");
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold text-red-500 mb-2">Error</p>
          <p className="text-zinc-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold text-zinc-300 mb-2">Task not found</p>
          <p className="text-zinc-500">This task might have been deleted or doesn't exist</p>
          <Link
            href="/dashboard/tasks"
            className="mt-4 inline-flex items-center px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tasks
          </Link>
        </div>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'text-red-500 bg-red-500/10';
      case 'medium':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'low':
        return 'text-emerald-500 bg-emerald-500/10';
      default:
        return 'text-zinc-500 bg-zinc-500/10';
    }
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/tasks"
              className="inline-flex items-center justify-center p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Task Details</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDeleteTask}
              className="px-4 py-2 text-red-500 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Task
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Task Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Task Header */}
            <div className="bg-zinc-900 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-white mb-2">{task.title}</h2>
                  <p className="text-zinc-400">{task.description}</p>
                </div>
                <span className="text-2xl ml-4">{task.statusEmoji}</span>
              </div>
              
              <div className="flex flex-wrap gap-3 mt-4">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${task.completed ? 'bg-emerald-500/20 text-emerald-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                  {task.completed ? 'Completed' : 'In Progress'}
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </div>
                {task.category && (
                  <div className="px-3 py-1 rounded-full text-sm font-medium bg-zinc-700/30 text-zinc-300">
                    {task.category}
                  </div>
                )}
              </div>
            </div>

            {/* Task Timeline */}
            <div className="bg-zinc-900 rounded-xl p-6">
              <h3 className="text-lg font-medium text-white mb-4">Timeline</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-zinc-400" />
                  <span className="text-zinc-400">Due Date:</span>
                  <span className="text-white">{new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-zinc-400" />
                  <span className="text-zinc-400">Created:</span>
                  <span className="text-white">{new Date(task.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-zinc-400" />
                  <span className="text-zinc-400">Last Updated:</span>
                  <span className="text-white">{new Date(task.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - AI Explanation */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900 rounded-xl p-6">
              <h3 className="text-lg font-medium text-white mb-4">AI Insights</h3>
              <div className="prose prose-invert max-w-none">
                <p className="text-zinc-300 text-sm whitespace-pre-wrap">{explanation}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 