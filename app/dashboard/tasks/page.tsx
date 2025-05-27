"use client";

import {
  CheckSquare,
  Clock,
  Filter,
  Plus,
  Search,
  Tag,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Trash2,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Circle,
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
import { useRouter } from "next/navigation";
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
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 10;
  const router = useRouter();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        console.log("Token:", token);
        console.log("UserId:", userId);

        if (!token || !userId) {
          // Store the current path to redirect back after login
          const returnUrl = encodeURIComponent(window.location.pathname);
          router.push(`/login?from=${returnUrl}`);
          return;
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
          if (response.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            router.push("/login");
            return;
          }
          const errorText = await response.text();
          throw new Error(`Failed to fetch tasks: ${errorText}`);
        }

        const data = await response.json();
        console.log("API Response Data:", data);
        
        if (data.success && Array.isArray(data.tasks)) {
          console.log("Tasks found:", data.tasks.length);
          setTasks(data.tasks || []);
          setTotalCount(data.count || data.tasks.length);
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
  }, [router]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const handleDeleteTask = async (taskId: string) => {
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
            taskId,
            userId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      // Remove the task from the local state
      setTasks(tasks.filter(task => task._id !== taskId));
      setOpenMenuId(null);
    } catch (error) {
      console.error("Error deleting task:", error);
      // You might want to show an error message to the user here
    }
  };

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

  // Calculate pagination
  const totalFilteredTasks = filteredTasks.length;
  const totalPages = Math.max(1, Math.ceil(totalFilteredTasks / tasksPerPage));
  
  // Ensure current page is within valid range
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  
  // Get current page tasks
  const startIndex = (safeCurrentPage - 1) * tasksPerPage;
  const endIndex = Math.min(startIndex + tasksPerPage, totalFilteredTasks);
  const currentTasks = filteredTasks.slice(startIndex, endIndex);

  // Generate page numbers array for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages are less than max pages to show
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page
      pageNumbers.push(1);
      
      // Calculate start and end of page numbers to show
      let startPage = Math.max(2, safeCurrentPage - 1);
      let endPage = Math.min(totalPages - 1, safeCurrentPage + 1);
      
      // Adjust if at the beginning
      if (safeCurrentPage <= 3) {
        endPage = 4;
      }
      
      // Adjust if at the end
      if (safeCurrentPage >= totalPages - 2) {
        startPage = totalPages - 3;
      }
      
      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pageNumbers.push('...');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }
      
      // Always include last page if more than 1 page
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  // Add a helper function to get status icon
  const getStatusIcon = (task: Task) => {
    if (task.completed) {
      return <CheckCircle className="w-5 h-5 text-emerald-500" />;
    }
    
    // Check if task is overdue
    const dueDate = new Date(task.time);
    const now = new Date();
    if (dueDate < now) {
      return <AlertTriangle className="w-5 h-5 text-red-500" />;
    }
    
    // Pending task
    return <Clock className="w-5 h-5 text-yellow-500" />;
  };

  const formatTimeAndDuration = (time: string, duration: string) => {
    try {
      // Format time
      const timeDate = new Date(time);
      const formattedTime = timeDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });

      // Format duration
      const durationNum = parseInt(duration);
      if (isNaN(durationNum)) return formattedTime;

      let durationText;
      if (durationNum < 60) {
        durationText = `${durationNum}m`;
      } else {
        const hours = Math.floor(durationNum / 60);
        const minutes = durationNum % 60;
        durationText = minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
      }

      return `${formattedTime} • ${durationText}`;
    } catch (error) {
      console.error("Error formatting time and duration:", error);
      return "Invalid time";
    }
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Tasks</h1>
            <p className="text-zinc-400 mt-1">
              View and track your tasks ({totalFilteredTasks} {totalFilteredTasks === 1 ? 'task' : 'tasks'})
            </p>
          </div>
          <Link
            href="/dashboard/ai"
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
          {currentTasks.length === 0 ? (
            <div className="text-center text-zinc-400 py-12">
              <div className="mb-4">
                <CheckSquare className="w-12 h-12 mx-auto text-zinc-700" />
              </div>
              <h3 className="text-xl font-medium text-zinc-300 mb-2">No tasks found</h3>
              <p className="text-zinc-500">
                {filteredTasks.length === 0 
                  ? "You don't have any tasks yet. Create your first task to get started."
                  : "No tasks match your current filters."}
              </p>
            </div>
          ) : (
            currentTasks.map((task) => (
              <div
                key={task._id}
                className="group relative bg-zinc-900 rounded-lg p-4 hover:bg-zinc-800/50 transition-colors"
              >
                <Link href={`/dashboard/tasks/${task._id}`} className="block">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(task)}
                      <div>
                        <h3 className="text-white font-medium">{task.activity}</h3>
                        <p className="text-sm text-zinc-400">
                          {formatTimeAndDuration(task.time, task.duration)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-zinc-400">
                        {new Date(task.createdAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={(e) => {
                          e.preventDefault(); // Prevent navigation to detail page
                          setOpenMenuId(openMenuId === task._id ? null : task._id);
                        }}
                        className="p-1 hover:bg-zinc-700 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-zinc-400" />
                      </button>
                    </div>
                  </div>
                </Link>
                
                {openMenuId === task._id && (
                  <div className="absolute right-4 top-12 w-48 bg-zinc-800 rounded-lg shadow-lg py-1 z-10">
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="w-full px-4 py-2 text-left text-red-500 hover:bg-zinc-700 flex items-center"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Task
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Pagination - only show if we have tasks */}
        {filteredTasks.length > 0 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={safeCurrentPage === 1}
                className={`p-2 rounded-lg transition-colors flex items-center ${
                  safeCurrentPage === 1 
                    ? 'text-zinc-600 cursor-not-allowed' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="sr-only md:not-sr-only md:ml-2">Previous</span>
              </button>
              
              <div className="flex items-center gap-1">
                {getPageNumbers().map((page, index) => (
                  typeof page === 'number' ? (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-lg transition-colors ${
                        page === safeCurrentPage
                          ? "bg-emerald-600 text-white"
                          : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                      }`}
                    >
                      {page}
                    </button>
                  ) : (
                    <span key={index} className="px-1 text-zinc-600">
                      {page}
                    </span>
                  )
                ))}
              </div>
              
              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={safeCurrentPage === totalPages}
                className={`p-2 rounded-lg transition-colors flex items-center ${
                  safeCurrentPage === totalPages 
                    ? 'text-zinc-600 cursor-not-allowed' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <span className="sr-only md:not-sr-only md:mr-2">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </nav>
          </div>
        )}

        {/* Showing results summary */}
        {filteredTasks.length > 0 && (
          <div className="mt-4 text-center text-xs text-zinc-500">
            Showing {startIndex + 1}-{endIndex} of {totalFilteredTasks} tasks
          </div>
        )}
      </div>
    </div>
  );
}