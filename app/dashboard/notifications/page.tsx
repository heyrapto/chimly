"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  Check,
  CheckCheck,
  Trash2,
  RotateCcw,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Task {
  _id: string;
  activity: string;
  time: string;
  duration: number;
}

interface Notification {
  _id: string;
  type: "upcoming" | "missed" | "reminder";
  message: string;
  read: boolean;
  createdAt: string;
  task?: Task;
  actionTaken?: boolean;
}

interface NotificationResponse {
  notifications: Notification[];
  currentPage: number;
  totalPages: number;
  totalNotifications: number;
  unreadCount: number;
}

interface NotificationSummary {
  _id: string;
  count: number;
  unreadCount: number;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [unreadCount, setUnreadCount] = useState(0);
  const [summary, setSummary] = useState<NotificationSummary[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rescheduleModal, setRescheduleModal] = useState<{
    show: boolean;
    notificationId: string;
    newTime: string;
  }>({
    show: false,
    notificationId: "",
    newTime: "",
  });

  const fetchNotifications = async (page = 1) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch(
        `https://chimlybackendmain.onrender.com/api/notifications?page=${page}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data: NotificationResponse = await response.json();
      setNotifications(data.notifications);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(
        `https://chimlybackendmain.onrender.com/api/notifications/summary`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSummary(data.summary);
      }
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchSummary();
  }, []);

  const markAsRead = async (notificationId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(
        `https://chimlybackendmain.onrender.com/api/notifications/${notificationId}/read`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notification) =>
            notification._id === notificationId
              ? { ...notification, read: true }
              : notification
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(
        `https://chimlybackendmain.onrender.com/api/notifications/mark-all-read`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notification) => ({ ...notification, read: true }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(
        `https://chimlybackendmain.onrender.com/api/notifications/${notificationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setNotifications((prev) =>
          prev.filter((notification) => notification._id !== notificationId)
        );
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const takeAction = async (notificationId: string, action: string, newTime?: string) => {
    try {
      setActionLoading(notificationId);
      const token = localStorage.getItem("token");
      if (!token) return;

      const body: any = { action };
      if (newTime) body.newTime = newTime;

      const response = await fetch(
        `https://chimlybackendmain.onrender.com/api/notifications/${notificationId}/action`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notification) =>
            notification._id === notificationId
              ? { ...notification, actionTaken: true }
              : notification
          )
        );
        setRescheduleModal({ show: false, notificationId: "", newTime: "" });
      }
    } catch (error) {
      console.error("Error taking action:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread") return !notification.read;
    if (filter === "read") return notification.read;
    return true;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "upcoming":
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case "missed":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "reminder":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Bell className="w-5 h-5 text-zinc-500" />;
    }
  };

  const getNotificationBgColor = (type: string) => {
    switch (type) {
      case "upcoming":
        return "bg-blue-500/10";
      case "missed":
        return "bg-red-500/10";
      case "reminder":
        return "bg-yellow-500/10";
      default:
        return "bg-zinc-500/10";
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            Notifications
            {unreadCount > 0 && (
              <span className="bg-emerald-500 text-white text-sm px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </h1>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-lg text-sm hover:bg-emerald-500/20 transition-colors flex items-center gap-2"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all read
            </button>
          )}
        </div>
        <p className="text-zinc-400 mt-1">Stay updated with your tasks</p>
      </div>

      {/* Summary Cards */}
      {summary.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {summary.map((item) => (
            <div key={item._id} className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400 capitalize">{item._id}</p>
                  <p className="text-2xl font-bold text-white">{item.count}</p>
                </div>
                {item.unreadCount > 0 && (
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6">
        {["all", "unread", "read"].map((filterType) => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType as typeof filter)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === filterType
                ? "bg-emerald-500/10 text-emerald-500"
                : "bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700"
            }`}
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        <AnimatePresence>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
              <p className="text-zinc-400">No notifications to show</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <motion.div
                key={notification._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`p-4 rounded-xl border transition-colors ${
                  notification.read
                    ? "bg-zinc-900/50 border-zinc-800"
                    : "bg-zinc-900 border-emerald-500/20"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-2 rounded-lg ${getNotificationBgColor(notification.type)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{notification.message}</h3>
                      {notification.task && (
                        <div className="mt-2">
                          <p className="text-sm text-zinc-400">
                            Task: {notification.task.activity}
                          </p>
                          <p className="text-sm text-zinc-500">
                            Scheduled: {new Date(notification.task.time).toLocaleString()}
                          </p>
                          {notification.task.duration && (
                            <p className="text-sm text-zinc-500">
                              Duration: {notification.task.duration} minutes
                            </p>
                          )}
                        </div>
                      )}
                      <p className="text-xs text-zinc-500 mt-2">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* Action buttons for missed notifications */}
                    {notification.type === "missed" && !notification.actionTaken && (
                      <>
                        <button
                          onClick={() =>
                            setRescheduleModal({
                              show: true,
                              notificationId: notification._id,
                              newTime: "",
                            })
                          }
                          disabled={actionLoading === notification._id}
                          className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-lg text-sm hover:bg-blue-500/20 transition-colors flex items-center gap-1"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Reschedule
                        </button>
                        <button
                          onClick={() => takeAction(notification._id, "dismiss")}
                          disabled={actionLoading === notification._id}
                          className="px-3 py-1 bg-zinc-500/10 text-zinc-400 rounded-lg text-sm hover:bg-zinc-500/20 transition-colors flex items-center gap-1"
                        >
                          <X className="w-4 h-4" />
                          Dismiss
                        </button>
                      </>
                    )}
                    
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification._id)}
                        className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-sm hover:bg-emerald-500/20 transition-colors flex items-center gap-1"
                      >
                        <Check className="w-4 h-4" />
                        Mark read
                      </button>
                    )}
                    
                    <button
                      onClick={() => deleteNotification(notification._id)}
                      className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => fetchNotifications(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-zinc-800 text-zinc-400 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-700 transition-colors"
          >
            Previous
          </button>
          <span className="text-zinc-400">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => fetchNotifications(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-zinc-800 text-zinc-400 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-700 transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Reschedule Modal */}
      <AnimatePresence>
        {rescheduleModal.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-white mb-4">Reschedule Task</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    New Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={rescheduleModal.newTime}
                    onChange={(e) =>
                      setRescheduleModal((prev) => ({ ...prev, newTime: e.target.value }))
                    }
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      takeAction(rescheduleModal.notificationId, "reschedule", rescheduleModal.newTime)
                    }
                    disabled={!rescheduleModal.newTime || actionLoading === rescheduleModal.notificationId}
                    className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading === rescheduleModal.notificationId ? "Rescheduling..." : "Reschedule"}
                  </button>
                  <button
                    onClick={() => setRescheduleModal({ show: false, notificationId: "", newTime: "" })}
                    className="flex-1 px-4 py-2 bg-zinc-800 text-zinc-400 rounded-lg hover:bg-zinc-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}