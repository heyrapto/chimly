"use client";

import { Bot, Send, Clock, Check, CheckCheck, Sparkles, Smile, ChevronUp, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef, ReactElement } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

// Quick reply suggestions based on context
const quickReplies = {
  general: [
    "What's my next task?",
    "Show me my schedule",
    "Help me prioritize",
    "What's my progress?",
  ],
  task: [
    "Break this down into steps",
    "Set a deadline for this",
    "Add this to my schedule",
    "Mark this as complete",
  ],
  schedule: [
    "Show my calendar",
    "What's due today?",
    "Reschedule this task",
    "Add a reminder",
  ],
};

// Message templates by category
const messageTemplates = {
  task: [
    "I need help with this task",
    "Can you break this down for me?",
    "What's the best way to approach this?",
  ],
  schedule: [
    "Show me my upcoming tasks",
    "What's my schedule for today?",
    "Help me plan my week",
  ],
  productivity: [
    "How can I be more productive?",
    "What's my current focus?",
    "Help me stay on track",
  ],
};

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  status?: "sending" | "sent" | "delivered";
}

// Component to render structured AI messages
const StructuredMessage = ({ content }: { content: string }) => {
  const parseContent = (text: string) => {
    const lines = text.split('\n');
    const elements: ReactElement[] = [];
    let currentSection: ReactElement[] = [];
    let listItems: string[] = [];
    let inCodeBlock = false;
    let codeContent = '';
    let codeLanguage = '';

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={elements.length} className="list-disc list-inside space-y-2 mb-6 text-zinc-200">
            {listItems.map((item, idx) => (
              <li key={idx} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        );
        listItems = [];
      }
    };

    const flushSection = () => {
      if (currentSection.length > 0) {
        elements.push(
          <div key={elements.length} className="mb-6">
            {currentSection}
          </div>
        );
        currentSection = [];
      }
    };

    const formatText = (text: string) => {
      // First handle bold text with colon pattern (e.g., **Task Name:**)
      let formattedText = text.replace(/\*\*(.*?):\*\*/g, '<strong class="font-semibold text-white">$1:</strong>');
      
      // Then handle regular bold text **text** or __text__
      formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>');
      formattedText = formattedText.replace(/__(.*?)__/g, '<strong class="font-semibold text-white">$1</strong>');
      
      // Handle italic text *text* or _text_
      formattedText = formattedText.replace(/\*(.*?)\*/g, '<em class="italic text-zinc-200">$1</em>');
      formattedText = formattedText.replace(/_(.*?)_/g, '<em class="italic text-zinc-200">$1</em>');
      
      // Handle inline code `code`
      formattedText = formattedText.replace(/`(.*?)`/g, '<code class="bg-zinc-800 px-1.5 py-0.5 rounded text-sm font-mono text-emerald-400">$1</code>');
      
      return formattedText;
    };

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // Handle code blocks
      if (trimmedLine.startsWith('```')) {
        if (!inCodeBlock) {
          flushList();
          flushSection();
          inCodeBlock = true;
          codeLanguage = trimmedLine.slice(3).trim();
          codeContent = '';
        } else {
          inCodeBlock = false;
          elements.push(
            <div key={elements.length} className="mb-6">
              <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-700">
                {codeLanguage && (
                  <div className="text-xs text-zinc-400 mb-2 font-mono">{codeLanguage}</div>
                )}
                <pre className="text-sm text-zinc-200 font-mono overflow-x-auto">
                  <code>{codeContent}</code>
                </pre>
              </div>
            </div>
          );
        }
        return;
      }

      if (inCodeBlock) {
        codeContent += line + '\n';
        return;
      }

      // Handle headings
      if (trimmedLine.startsWith('# ')) {
        flushList();
        flushSection();
        elements.push(
          <h1 key={elements.length} className="text-2xl font-bold text-white mb-6 border-b border-zinc-700 pb-3">
            {trimmedLine.slice(2)}
          </h1>
        );
      } else if (trimmedLine.startsWith('## ')) {
        flushList();
        flushSection();
        elements.push(
          <h2 key={elements.length} className="text-xl font-semibold text-white mb-4 mt-8">
            {trimmedLine.slice(3)}
          </h2>
        );
      } else if (trimmedLine.startsWith('### ')) {
        flushList();
        flushSection();
        elements.push(
          <h3 key={elements.length} className="text-lg font-medium text-white mb-3 mt-6">
            {trimmedLine.slice(4)}
          </h3>
        );
      } else if (trimmedLine.startsWith('#### ')) {
        flushList();
        flushSection();
        elements.push(
          <h4 key={elements.length} className="text-base font-medium text-zinc-200 mb-3 mt-4">
            {trimmedLine.slice(5)}
          </h4>
        );
      }
      // Handle bullet points
      else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        flushSection();
        listItems.push(formatText(trimmedLine.slice(2)));
      }
      // Handle numbered lists
      else if (/^\d+\.\s/.test(trimmedLine)) {
        flushSection();
        if (listItems.length === 0) {
          // Start new numbered list
        }
        listItems.push(formatText(trimmedLine.replace(/^\d+\.\s/, '')));
      }
      // Handle regular text
      else if (trimmedLine) {
        flushList();
        currentSection.push(
          <p 
            key={currentSection.length} 
            className="text-zinc-200 leading-relaxed mb-4 last:mb-0"
            dangerouslySetInnerHTML={{ __html: formatText(trimmedLine) }}
          />
        );
      } else {
        // Empty line - flush current section
        flushList();
        flushSection();
      }
    });

    // Flush any remaining content
    flushList();
    flushSection();

    return elements;
  };

  return <div className="space-y-4">{parseContent(content)}</div>;
};

// Loading skeleton component for messages
const MessageSkeleton = () => {
  return (
    <div className="space-y-4">
      {/* AI Message Skeleton */}
      <div className="flex justify-start">
        <div className="max-w-[85%] rounded-2xl p-5 bg-zinc-800/50">
          <div className="space-y-3">
            <div className="h-4 bg-zinc-700/50 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-zinc-700/50 rounded w-1/2 animate-pulse" />
            <div className="h-4 bg-zinc-700/50 rounded w-2/3 animate-pulse" />
          </div>
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-zinc-700/50">
            <div className="h-3 bg-zinc-700/50 rounded w-16 animate-pulse" />
          </div>
        </div>
      </div>
      {/* User Message Skeleton */}
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl p-5 bg-emerald-500/10">
          <div className="space-y-3">
            <div className="h-4 bg-emerald-500/20 rounded w-2/3 animate-pulse" />
            <div className="h-4 bg-emerald-500/20 rounded w-1/2 animate-pulse" />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="h-3 bg-emerald-500/20 rounded w-16 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AIPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [activeCategory, setActiveCategory] = useState<keyof typeof quickReplies>("general");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  // Fetch conversation history on component mount
  useEffect(() => {
    const fetchConversationHistory = async () => {
      try {
        setIsLoadingHistory(true);
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!token || !userId) {
          router.push("/login");
          return;
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
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            router.push("/login");
            return;
          }
          throw new Error("Failed to fetch conversation history");
        }

        const data = await response.json();
        if (data.success && data.data.history) {
          // Convert timestamp strings to Date objects
          const formattedMessages = data.data.history.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }));
          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error("Error fetching conversation history:", error);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchConversationHistory();
  }, [router]);

  // Listen for sidebar state changes
  useEffect(() => {
    const handleResize = () => {
      const sidebar = document.querySelector('aside');
      if (sidebar) {
        setIsSidebarCollapsed(sidebar.classList.contains('lg:w-20'));
      }
    };

    // Initial check
    handleResize();

    // Create observer to watch for sidebar class changes
    const observer = new MutationObserver(handleResize);
    const sidebar = document.querySelector('aside');
    if (sidebar) {
      observer.observe(sidebar, { attributes: true, attributeFilter: ['class'] });
    }

    return () => observer.disconnect();
  }, []);

  // Update active category based on last message
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1].content.toLowerCase();
      if (lastMessage.includes("task") || lastMessage.includes("todo")) {
        setActiveCategory("task");
      } else if (lastMessage.includes("schedule") || lastMessage.includes("calendar")) {
        setActiveCategory("schedule");
      } else {
        setActiveCategory("general");
      }
    }
  }, [messages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleQuickReply = (reply: string) => {
    setMessage(reply);
    inputRef.current?.focus();
  };

  const handleTemplateSelect = (template: string) => {
    setMessage(template);
    setShowTemplates(false);
    inputRef.current?.focus();
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      router.push("/login");
      return;
    }

    const newMessage: Message = {
      role: "user",
      content: message,
      timestamp: new Date(),
      status: "sending",
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      // First, add the user message to the conversation
      const messageResponse = await fetch(
        `https://chimlybackendmain.onrender.com/api/conversations/${userId}/message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            role: "user",
            content: message,
          }),
        }
      );

      if (!messageResponse.ok) {
        throw new Error("Failed to save message");
      }

      // Then, get the AI response
      const aiResponse = await fetch(
        "https://chimlybackendmain.onrender.com/api/schedule",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            input: message,
            userId: userId,
          }),
        }
      );

      if (!aiResponse.ok) {
        throw new Error("Failed to get AI response");
      }

      const data = await aiResponse.json();
      
      // Update the user message status
      setMessages((prev) =>
        prev.map((msg) =>
          msg === newMessage ? { ...msg, status: "delivered" } : msg
        )
      );

      // Add the AI response
      if (data.message) {
        const aiMessage: Message = {
          role: "assistant",
          content: data.message,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error("Error in conversation:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="md:h-[calc(100vh-2rem)] h-screen flex flex-col bg-black overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">Chimly</h1>
            <p className="text-sm text-zinc-400">
              Chat with your AI powered task manager
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowQuickReplies(!showQuickReplies)}
            className="px-4 py-2 text-sm text-white bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors flex items-center gap-2"
          >
            {showQuickReplies ? (
              <>
                <ChevronDown className="w-4 h-4" />
                Hide Suggestions
              </>
            ) : (
              <>
                <ChevronUp className="w-4 h-4" />
                Show Suggestions
              </>
            )}
          </button>
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="px-4 py-2 text-sm text-white bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Templates
          </button>
        </div>
      </div>

      {/* Message Templates */}
      <AnimatePresence>
        {showTemplates && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-zinc-800 overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {Object.entries(messageTemplates).map(([category, templates]) => (
                <div key={category}>
                  <h3 className="text-sm font-medium text-zinc-400 mb-2 capitalize">
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {templates.map((template, index) => (
                      <button
                        key={index}
                        onClick={() => handleTemplateSelect(template)}
                        className="px-3 py-1.5 text-sm text-white bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors"
                      >
                        {template}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Container */}
      <div className={`flex-1 overflow-y-auto px-4 ${showQuickReplies ? 'pb-24' : 'pb-4'} scrollbar-hide`}>
        <div className="w-full mx-auto flex flex-col min-h-full">
          <div className="space-y-4 py-4">
            {isLoadingHistory ? (
              <MessageSkeleton />
            ) : (
              messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "assistant" ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-5 ${
                      msg.role === "assistant"
                        ? "bg-zinc-800 text-white"
                        : "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <StructuredMessage content={msg.content} />
                    ) : (
                      <div className="space-y-2">
                        <p className="whitespace-pre-wrap text-white/90 leading-relaxed">{msg.content}</p>
                        <div className="flex items-center gap-2 text-xs text-white/70">
                          <span>
                            {msg.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {msg.role === "user" && (
                            <span className="flex items-center gap-1">
                              {msg.status === "sending" && (
                                <>
                                  <Clock className="w-3 h-3" />
                                  <span>Sending</span>
                                </>
                              )}
                              {msg.status === "sent" && (
                                <>
                                  <Check className="w-3 h-3" />
                                  <span>Sent</span>
                                </>
                              )}
                              {msg.status === "delivered" && (
                                <>
                                  <CheckCheck className="w-3 h-3" />
                                  <span>Delivered</span>
                                </>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    {msg.role === "assistant" && (
                      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-zinc-700/50 text-xs opacity-70">
                        <span>
                          {msg.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-zinc-800 rounded-2xl p-4">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-zinc-600 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-zinc-600 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-zinc-600 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Quick Replies */}
      <AnimatePresence>
        {showQuickReplies && messages.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="p-4 border-t border-zinc-800 bg-black relative z-10"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full" />
              <h3 className="text-sm font-medium text-zinc-400">Quick Suggestions</h3>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {quickReplies[activeCategory].map((reply, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleQuickReply(reply)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-4 py-2.5 text-sm text-white bg-zinc-800/50 backdrop-blur-sm rounded-xl hover:bg-zinc-700/50 transition-all duration-300 whitespace-nowrap border border-zinc-700/50 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10"
                >
                  <span className="relative">
                    {reply}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-emerald-600 group-hover:w-full transition-all duration-300" />
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div 
        className="sticky bottom-0 left-0 right-0 p-4 border-t border-zinc-800 bg-black/95 backdrop-blur-sm transition-all duration-300 lg:left-20 lg:right-0 data-[collapsed=false]:lg:left-64"
        data-collapsed={isSidebarCollapsed}
      >
        <div className="flex gap-2 w-full mx-auto items-center">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              className="w-full p-3 pr-10 bg-zinc-800/50 backdrop-blur-sm text-white rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50 min-h-[44px] max-h-[120px] border border-zinc-700/50"
              rows={1}
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-emerald-500 transition-colors">
              <Smile className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={handleSend}
            disabled={!message.trim() || isLoading}
            className="h-[44px] w-[44px] flex items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}