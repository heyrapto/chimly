"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  Flag, 
  Tag, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Edit3,
  MoreVertical,
  AlertTriangle,
  Sparkles,
  Copy,
  Share2,
  Archive
} from "lucide-react";
import Link from "next/link";
import type { JSX } from 'react';

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/login";
          return;
        }

        const response = await fetch(
          `https://chimlybackendmain.onrender.com/api/schedule/user`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
             taskId: id,
            }),
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
    setIsDeleting(true);
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
      setIsDeleting(false);
    }
  };

  const formatExplanation = (text: string) => {
    if (!text) return null;
    
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    let currentList: string[] = [];
    let currentSubList: string[] = [];
    
    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={elements.length} className="space-y-3 mb-6">
            {currentList.map((item, idx) => {
              const boldColonMatch = item.match(/\*\*(.*?)\*\*:(.+)/);
              const boldMatch = item.match(/\*\*(.*?)\*\*(.*)/)
              
              if (boldColonMatch) {
                return (
                  <li key={idx} className="flex items-start gap-3 group">
                    <span className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full mt-2.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="leading-relaxed">
                      <strong className="text-white font-semibold">{boldColonMatch[1]}:</strong>
                      <span className="text-zinc-300 ml-1">{boldColonMatch[2]}</span>
                    </span>
                  </li>
                );
              } else if (boldMatch) {
                return (
                  <li key={idx} className="flex items-start gap-3 group">
                    <span className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full mt-2.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="leading-relaxed">
                      <strong className="text-white font-semibold">{boldMatch[1]}</strong>
                      <span className="text-zinc-300">{boldMatch[2]}</span>
                    </span>
                  </li>
                );
              }
              return (
                <li key={idx} className="flex items-start gap-3 group">
                  <span className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full mt-2.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-zinc-300 leading-relaxed">{item}</span>
                </li>
              );
            })}
            {currentSubList.length > 0 && (
              <ul className="ml-8 space-y-2 mt-3">
                {currentSubList.map((item, idx) => (
                  <li key={idx} className="text-zinc-400 text-sm flex items-start gap-2">
                    <span className="w-1 h-1 bg-zinc-500 rounded-full mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </ul>
        );
        currentList = [];
        currentSubList = [];
      }
    };

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      if (!trimmedLine) {
        flushList();
        return;
      }

      if (trimmedLine.startsWith('# ')) {
        flushList();
        const [title, emoji] = trimmedLine.slice(2).split(/(\s*[^\w\s]\s*)$/).filter(Boolean);
        elements.push(
          <div key={elements.length} className="mb-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent flex items-center gap-3">
              {title.trim()}
              {emoji && <span className="text-3xl">{emoji.trim()}</span>}
            </h2>
          </div>
        );
        return;
      }

      if (trimmedLine.startsWith('## ')) {
        flushList();
        const content = trimmedLine.slice(3).trim();
        const emojiMatch = content.match(/\s*([^\w\s])$/);
        const emoji = emojiMatch ? emojiMatch[1] : undefined;
        const title = emojiMatch ? content.slice(0, -emojiMatch[0].length) : content;
        
        elements.push(
          <div key={elements.length} className="mb-6">
            <h3 className="text-lg font-semibold text-emerald-400 flex items-center gap-3">
              <span className="w-1.5 h-8 bg-gradient-to-b from-emerald-400 to-teal-400 rounded-full"></span>
              {title.trim()}
              {emoji && <span className="text-xl">{emoji.trim()}</span>}
            </h3>
          </div>
        );
        return;
      }

      if (trimmedLine.startsWith('* ')) {
        const content = trimmedLine.slice(2);
        if (trimmedLine.startsWith('    ')) {
          currentSubList.push(content);
        } else {
          currentList.push(content);
        }
        return;
      }

      flushList();
      const formattedText = trimmedLine
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="text-zinc-400 italic">$1</em>');
      
      elements.push(
        <p 
          key={elements.length} 
          className="text-zinc-300 leading-relaxed mb-6"
          dangerouslySetInnerHTML={{ __html: formattedText }}
        />
      );
    });

    flushList();
    return elements;
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDueDateStatus = (dueDate: string, completed: boolean) => {
    if (completed) return { text: "Completed", color: "text-emerald-500", bg: "bg-emerald-500/10", icon: CheckCircle };
    
    const daysUntil = getDaysUntilDue(dueDate);
    if (daysUntil < 0) return { text: `${Math.abs(daysUntil)} days overdue`, color: "text-red-500", bg: "bg-red-500/10", icon: AlertTriangle };
    if (daysUntil === 0) return { text: "Due today", color: "text-yellow-500", bg: "bg-yellow-500/10", icon: Clock };
    if (daysUntil === 1) return { text: "Due tomorrow", color: "text-yellow-500", bg: "bg-yellow-500/10", icon: Clock };
    return { text: `Due in ${daysUntil} days`, color: "text-zinc-400", bg: "bg-zinc-500/10", icon: Calendar };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Something went wrong</h2>
          <p className="text-zinc-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-zinc-700/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-zinc-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Task not found</h2>
          <p className="text-zinc-400 mb-6">This task might have been deleted or doesn't exist</p>
          <Link
            href="/dashboard/tasks"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tasks
          </Link>
        </div>
      </div>
    );
  }

  const getPriorityConfig = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return { 
          color: 'text-red-400', 
          bg: 'bg-red-500/10 border-red-500/20', 
          icon: '🔥',
          gradient: 'from-red-500 to-pink-500'
        };
      case 'medium':
        return { 
          color: 'text-yellow-400', 
          bg: 'bg-yellow-500/10 border-yellow-500/20', 
          icon: '⚡',
          gradient: 'from-yellow-500 to-orange-500'
        };
      case 'low':
        return { 
          color: 'text-emerald-400', 
          bg: 'bg-emerald-500/10 border-emerald-500/20', 
          icon: '🌱',
          gradient: 'from-emerald-500 to-teal-500'
        };
      default:
        return { 
          color: 'text-zinc-400', 
          bg: 'bg-zinc-500/10 border-zinc-500/20', 
          icon: '📋',
          gradient: 'from-zinc-500 to-slate-500'
        };
    }
  };

  const dueDateStatus = getDueDateStatus(task.dueDate, task.completed);
  const priorityConfig = getPriorityConfig(task.priority);
  const StatusIcon = dueDateStatus.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800">
      <div className="p-4 sm:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Enhanced Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/tasks"
                className="group inline-flex items-center justify-center p-3 text-zinc-400 hover:text-white hover:bg-zinc-800/80 rounded-xl transition-all duration-200 border border-zinc-800 hover:border-zinc-700"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
              </Link>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent">
                  Task Details
                </h1>
                <p className="text-zinc-400 mt-1">Manage your task and view AI insights</p>
              </div>
            </div>
            
            {/* Actions Menu */}
            <div className="relative">
              <button
                onClick={() => setShowActionsMenu(!showActionsMenu)}
                className="inline-flex items-center justify-center p-3 text-zinc-400 hover:text-white hover:bg-zinc-800/80 rounded-xl transition-all duration-200 border border-zinc-800 hover:border-zinc-700"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
              
              {showActionsMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-800/95 backdrop-blur-sm border border-zinc-700/50 rounded-xl shadow-2xl z-10">
                  <div className="p-2">
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-zinc-300 hover:text-white hover:bg-zinc-700/50 rounded-lg transition-colors text-left">
                      <Edit3 className="w-4 h-4" />
                      Edit Task
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-zinc-300 hover:text-white hover:bg-zinc-700/50 rounded-lg transition-colors text-left">
                      <Copy className="w-4 h-4" />
                      Duplicate
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-zinc-300 hover:text-white hover:bg-zinc-700/50 rounded-lg transition-colors text-left">
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-zinc-300 hover:text-white hover:bg-zinc-700/50 rounded-lg transition-colors text-left">
                      <Archive className="w-4 h-4" />
                      Archive
                    </button>
                    <div className="h-px bg-zinc-700/50 my-2"></div>
                    <button 
                      onClick={() => setShowDeleteConfirm(true)}
                      className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-left"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Task
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Left Column - Task Details */}
            <div className="xl:col-span-7 space-y-6">
              {/* Enhanced Task Header */}
              <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 backdrop-blur-sm rounded-2xl p-8 border border-zinc-700/30">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-4xl">{task.statusEmoji}</span>
                      <div>
                        <h2 className="text-2xl font-bold text-white leading-tight">{task.title}</h2>
                        <div className="flex items-center gap-2 mt-2">
                          <StatusIcon className={`w-4 h-4 ${dueDateStatus.color}`} />
                          <span className={`text-sm font-medium ${dueDateStatus.color}`}>
                            {dueDateStatus.text}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-zinc-300 leading-relaxed text-lg">{task.description}</p>
                  </div>
                </div>
                
                {/* Enhanced Status Pills */}
                <div className="flex flex-wrap gap-3">
                  <div className={`px-4 py-2 rounded-full text-sm font-medium border ${dueDateStatus.bg} ${dueDateStatus.color} border-current/20`}>
                    {task.completed ? '✅ Completed' : '🔄 In Progress'}
                  </div>
                  <div className={`px-4 py-2 rounded-full text-sm font-medium border ${priorityConfig.bg} ${priorityConfig.color}`}>
                    <span className="mr-2">{priorityConfig.icon}</span>
                    {task.priority} Priority
                  </div>
                  {task.category && (
                    <div className="px-4 py-2 rounded-full text-sm font-medium bg-zinc-700/30 text-zinc-300 border border-zinc-600/30">
                      <Tag className="w-3 h-3 inline mr-2" />
                      {task.category}
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Timeline */}
              <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 backdrop-blur-sm rounded-2xl p-8 border border-zinc-700/30">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                  <Clock className="w-5 h-5 text-emerald-400" />
                  Timeline & Dates
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-zinc-700/20 rounded-xl border border-zinc-600/20">
                    <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-zinc-400 text-sm">Due Date</p>
                      <p className="text-white font-semibold">{new Date(task.dueDate).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-zinc-700/20 rounded-xl border border-zinc-600/20">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-zinc-400 text-sm">Created</p>
                      <p className="text-white font-semibold">{new Date(task.createdAt).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-zinc-700/20 rounded-xl border border-zinc-600/20">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-zinc-400 text-sm">Last Updated</p>
                      <p className="text-white font-semibold">{new Date(task.updatedAt).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Enhanced AI Insights */}
            <div className="xl:col-span-5">
              <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 backdrop-blur-sm rounded-2xl p-8 border border-zinc-700/30 sticky top-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">AI Insights</h3>
                    <p className="text-zinc-400 text-sm">Smart analysis and recommendations</p>
                  </div>
                </div>
                
                <div className="prose prose-invert max-w-none">
                  {explanation ? (
                    <div className="space-y-4">
                      {formatExplanation(explanation)}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-zinc-700/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-8 h-8 text-zinc-400" />
                      </div>
                      <p className="text-zinc-400">No AI insights available for this task</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-800 rounded-2xl p-8 max-w-md w-full border border-zinc-700/50">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Delete Task</h3>
              <p className="text-zinc-400 mb-6">
                Are you sure you want to delete "{task.title}"? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-3 text-zinc-300 hover:text-white hover:bg-zinc-700/50 rounded-lg transition-colors font-medium"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteTask}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close actions menu */}
      {showActionsMenu && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowActionsMenu(false)}
        />
      )}
    </div>
  );
}