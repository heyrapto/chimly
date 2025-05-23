"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Users,
  MessageSquare,
  Paperclip,
  Send,
} from "lucide-react";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useParams } from "next/navigation";

export default function TaskDetailsPage() {
  const params = useParams();
  const taskId = params.id as string;
  const [comment, setComment] = useState("");
  const [userName, setUserName] = useState("");
  const hour = new Date().getHours();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!token || !userId) return;

        const response = await fetch(
          `https://chimlybackendmain.onrender.com/api/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user info");
        }

        const data = await response.json();
        if (data.success) {
          setUserName(data.user.name || data.user.username);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  // Mock data - in a real app, fetch task details based on taskId
  const task = {
    id: taskId,
    title: "Backend Architecture Meeting",
    status: "In Progress",
    description:
      "Review and discuss the proposed backend architecture for the new feature implementation. Focus on scalability and performance optimizations.",
    time: "11am - 12am",
    date: "March 15, 2024",
    assignees: [
      { initials: "JD", color: "emerald" },
      { initials: "AM", color: "blue" },
    ],
    attachments: [
      { name: "Architecture-Diagram.pdf" },
      { name: "Meeting-Notes.md" },
    ],
  };

  // Greeting with appropriate icon
  const getGreeting = () => {
    if (hour < 12) {
      return { text: "Good morning", icon: "🌅" };
    } else if (hour < 18) {
      return { text: "Good afternoon", icon: "☀️" };
    } else {
      return { text: "Good evening", icon: "🌙" };
    }
  };

  const { text: greeting, icon } = getGreeting();

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-start gap-4 mb-8">
          <Link
            href="/dashboard/tasks"
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{icon}</span>
              <h1 className="text-2xl font-semibold text-white">
                {greeting} {userName || 'there'}
              </h1>
            </div>
            <p className="text-zinc-400 mt-1">Here's your task details</p>
          </div>
        </div>

        {/* Task Details */}
        <div className="space-y-6">
          {/* Main Task Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">{task.title}</h2>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-sm rounded-full">
                {task.status}
              </span>
            </div>

            <p className="text-zinc-400 mb-6">{task.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-2 text-zinc-400">
                <Clock className="w-4 h-4" />
                <span>{task.time}</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <Calendar className="w-4 h-4" />
                <span>{task.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-zinc-400" />
                <div className="flex -space-x-2">
                  {task.assignees.map((assignee) => (
                    <Avatar
                      className="w-6 h-6 border-2 border-black"
                      key={assignee.initials}
                    >
                      <AvatarFallback
                        className={`bg-${assignee.color}-500/10 text-${assignee.color}-500 text-xs`}
                      >
                        {assignee.initials}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-800 pt-6">
              <h3 className="text-white font-medium mb-4">Attachments</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {task.attachments.map((attachment) => (
                  <div
                    className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg"
                    key={attachment.name}
                  >
                    <Paperclip className="w-4 h-4 text-zinc-400" />
                    <span className="text-sm text-zinc-400">
                      {attachment.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-white font-medium mb-6 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Comments
            </h3>

            <div className="space-y-6 mb-6">
              {/* Comment */}
              <div className="flex gap-4">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-emerald-500/10 text-emerald-500">
                    JD
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-medium">John Doe</span>
                    <span className="text-xs text-zinc-500">2 hours ago</span>
                  </div>
                  <p className="text-zinc-400 text-sm">
                    Let's make sure we cover the caching strategy during the
                    meeting.
                  </p>
                </div>
              </div>
            </div>

            {/* Add Comment */}
            <div className="flex gap-4">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-emerald-500/10 text-emerald-500">
                  JD
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="Add a comment..."
                  className="min-h-[100px] bg-zinc-800 border-zinc-700 mb-3"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Send className="w-4 h-4 mr-2" />
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
