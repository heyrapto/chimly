"use client";

import { useEffect, useState, useRef } from "react";
import { Send } from "lucide-react";
import { useRouter } from "next/navigation";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ConversationData {
  history: Message[];
  context: {
    pendingFields: string[];
    lastTask: {
      activity: string;
      time: string;
      duration: string;
    } | null;
    summary: string;
  };
  pendingClarifications: {
    type: string;
    taskId: string;
    prompt: string;
  }[];
}

export default function ConversationHistory() {
  const [conversation, setConversation] = useState<ConversationData | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      router.push("/login"); 
      return;
    }

    fetchConversationHistory();
  }, [router]);

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.history]);

  const fetchConversationHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        `https://chimlybackendmain.onrender.com/api/conversations/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
        throw new Error("Failed to fetch conversation history");
      }

      const data = await response.json();
      if (data.success) {
        setConversation(data.data);
      } else {
        throw new Error(data.message || "Failed to fetch conversation history");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        `https://chimlybackendmain.onrender.com/api/conversations/${userId}/message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            role: "user",
            content: newMessage,
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
        throw new Error("Failed to send message");
      }

      const data = await response.json();
      if (data.success) {
        setConversation(data.data);
        setNewMessage("");
      } else {
        throw new Error(data.message || "Failed to send message");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-red-500 text-center">
          <p className="text-lg font-semibold mb-2">Error Loading Conversation</p>
          <p className="text-sm text-zinc-400">{error}</p>
          <button
            onClick={() => router.push("/login")}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] bg-zinc-900 border border-zinc-800 rounded-xl">
      {/* Conversation Header */}
      <div className="p-4 border-b border-zinc-800">
        <h2 className="text-lg font-semibold text-white">Conversation History</h2>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation?.history.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === "user"
                  ? "bg-emerald-600 text-white"
                  : "bg-zinc-800 text-zinc-200"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className="p-4 border-t border-zinc-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-zinc-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            className="bg-emerald-600 text-white rounded-lg px-4 py-2 hover:bg-emerald-700 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
} 