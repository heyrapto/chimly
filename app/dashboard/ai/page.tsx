"use client";

import { 
  Bot, 
  Send, 
  Clock, 
  Check, 
  CheckCheck, 
  Sparkles, 
  Smile, 
  ChevronUp, 
  ChevronDown,
  User,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Volume2,
  MessageSquare,
  Heart,
  Zap,
  ImageIcon,
  Mic,
  X,
  Loader2,
  Plus
} from "lucide-react";
import { useState, useEffect, useRef, ReactElement } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
  attachments?: {
    type: "image" | "audio";
    url: string;
  }[];
  typing?: boolean;
}

interface MessageElement {
  type: 'main-title' | 'section-title' | 'detail-item' | 'bullet' | 'text' | 'question' | 'divider';
  content: string;
  example?: string;
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

// Image Upload Component
const ImageUpload = ({ onUpload }: { onUpload: (file: File) => void }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onUpload(file);
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <button
        onClick={() => inputRef.current?.click()}
        className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
        title="Upload image"
      >
        <ImageIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

// Voice Recorder Component
const VoiceRecorder = ({ onRecordingComplete }: { onRecordingComplete: (blob: Blob) => void }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        onRecordingComplete(blob);
        stream.getTracks().forEach(track => track.stop());
        setRecordingTime(0);
      };

      mediaRecorder.start();
      setIsRecording(true);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={cn(
          "p-2 rounded-lg transition-colors flex items-center gap-2",
          isRecording 
            ? "text-red-500 hover:text-red-400 hover:bg-red-500/10" 
            : "text-zinc-400 hover:text-white hover:bg-zinc-800"
        )}
        title={isRecording ? "Stop recording" : "Start recording"}
      >
        {isRecording ? (
          <>
            <span className="animate-pulse">●</span>
            <span className="text-sm">{recordingTime}s</span>
          </>
        ) : (
          <Mic className="w-5 h-5" />
        )}
      </button>
    </div>
  );
};

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.button
      onClick={handleCopy}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="p-1.5 rounded-lg bg-zinc-700/50 hover:bg-zinc-600/50 transition-colors group"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-emerald-400" />
      ) : (
        <Copy className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white" />
      )}
    </motion.button>
  );
};

const MessageActions = ({ message, onRegenerate, onFeedback }: { 
  message: Message, 
  onRegenerate?: (message: Message) => void,
  onFeedback?: (type: 'positive' | 'negative') => void 
}) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div 
      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-center gap-1 mt-3">
        <CopyButton text={message.content} />
        
        {message.role === "assistant" && (
          <>
            <motion.button
              onClick={() => onRegenerate?.(message)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-1.5 rounded-lg bg-zinc-700/50 hover:bg-zinc-600/50 transition-colors group"
            >
              <RotateCcw className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-1.5 rounded-lg bg-zinc-700/50 hover:bg-zinc-600/50 transition-colors group"
            >
              <Volume2 className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white" />
            </motion.button>
            
            <div className="flex items-center gap-1 ml-2">
              <motion.button
                onClick={() => onFeedback?.('positive')}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-1.5 rounded-lg bg-zinc-700/50 hover:bg-emerald-600/20 transition-colors group"
              >
                <ThumbsUp className="w-3.5 h-3.5 text-zinc-400 group-hover:text-emerald-400" />
              </motion.button>
              
              <motion.button
                onClick={() => onFeedback?.('negative')}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-1.5 rounded-lg bg-zinc-700/50 hover:bg-red-600/20 transition-colors group"
              >
                <ThumbsDown className="w-3.5 h-3.5 text-zinc-400 group-hover:text-red-400" />
              </motion.button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center gap-2 text-emerald-400 text-sm"
  >
    <div className="flex gap-1">
      <motion.div
        className="w-2 h-2 bg-emerald-400 rounded-full"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
      />
      <motion.div
        className="w-2 h-2 bg-emerald-400 rounded-full"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
      />
      <motion.div
        className="w-2 h-2 bg-emerald-400 rounded-full"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
      />
    </div>
    <span>Chimly is thinking...</span>
  </motion.div>
);

const formatMessageContent = (content: string) => {
  // Split content by lines first to handle different formatting
  const lines = content.split('\n');
  const elements: MessageElement[][] = [];
  let currentSection: MessageElement[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines but use them as section breaks
    if (!line) {
      if (currentSection.length > 0) {
        elements.push([...currentSection]);
        currentSection = [];
      }
      continue;
    }
    
    // Handle horizontal rules
    if (line === '---') {
      if (currentSection.length > 0) {
        elements.push([...currentSection]);
        currentSection = [];
      }
      elements.push([{ type: 'divider', content: '' }]);
      continue;
    }
    
    // Handle main headings with emoji (# ✨)
    if (line.startsWith('# ')) {
      if (currentSection.length > 0) {
        elements.push([...currentSection]);
        currentSection = [];
      }
      elements.push([{ type: 'main-title', content: line.replace('# ', '').trim() }]);
      continue;
    }
    
    // Handle section headings (##)
    if (line.startsWith('## ')) {
      if (currentSection.length > 0) {
        elements.push([...currentSection]);
        currentSection = [];
      }
      currentSection.push({ type: 'section-title', content: line.replace('## ', '').trim() });
      continue;
    }
    
    // Handle bullet points with asterisks and examples in parentheses
    if (line.startsWith('* ')) {
      const content = line.slice(2);
      const match = content.match(/(.*?)\((.*?)\)/);
      
      if (match) {
        // Question with example
        currentSection.push({
          type: 'question',
          content: match[1].trim(),
          example: match[2].trim()
        });
      } else {
        // Regular bullet point
        currentSection.push({
          type: 'bullet',
          content: content
        });
      }
      continue;
    }
    
    // Handle bullet points with dashes and bold text
    if (line.startsWith('- **')) {
      currentSection.push({ type: 'detail-item', content: line.replace('- ', '').trim() });
      continue;
    }
    
    // Handle regular bullet points with dashes
    if (line.startsWith('- ')) {
      currentSection.push({ type: 'bullet', content: line.replace('- ', '').trim() });
      continue;
    }
    
    // Handle regular text
    currentSection.push({ type: 'text', content: line });
  }
  
  // Add the last section
  if (currentSection.length > 0) {
    elements.push([...currentSection]);
  }
  
  return elements.map((section, sectionIndex) => (
    <div key={sectionIndex} className="mb-4 last:mb-0">
      {section.map((element, elementIndex) => {
        switch (element.type) {
          case 'divider':
            return (
              <div key={elementIndex} className="my-6">
                <div className="h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
              </div>
            );
            
          case 'main-title':
            return (
              <div key={elementIndex} className="mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
                  {element.content}
                </h2>
              </div>
            );
            
          case 'section-title':
            return (
              <h3 key={elementIndex} className="text-lg font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-emerald-400 rounded-full"></span>
                {element.content.replace(':', '')}
              </h3>
            );
            
          case 'question':
            return (
              <div key={elementIndex} className="mb-4 pl-4 border-l-2 border-emerald-500/30">
                <p className="text-zinc-200 leading-relaxed">
                  {element.content}
                  {element.example && (
                    <span className="text-zinc-400 italic ml-1">
                      (e.g., "{element.example}")
                    </span>
                  )}
                </p>
              </div>
            );
            
          case 'detail-item':
            const detailText = element.content.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>');
            return (
              <div key={elementIndex} className="mb-2 pl-4 border-l-2 border-emerald-500/30">
                <p 
                  className="text-zinc-200 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: detailText }}
                />
              </div>
            );
            
          case 'bullet':
            return (
              <div key={elementIndex} className="flex items-start gap-3 mb-2">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 flex-shrink-0" />
                <span className="text-zinc-200 leading-relaxed">{element.content}</span>
              </div>
            );
            
          case 'text':
            const formattedText = element.content.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
            return (
              <p 
                key={elementIndex} 
                className="text-zinc-200 leading-relaxed mb-2"
                dangerouslySetInnerHTML={{ __html: formattedText }}
              />
            );
            
          default:
            return null;
        }
      })}
    </div>
  ));
};

const AssistantMessage = ({ message, onRegenerate, onFeedback }: { 
  message: Message, 
  onRegenerate?: (message: Message) => void,
  onFeedback?: (type: 'positive' | 'negative') => void 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className="flex justify-start group"
  >
    <div className="flex gap-2 sm:gap-3 w-full sm:w-auto sm:max-w-[85%]">
      {/* Avatar */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1 }}
        className="hidden sm:flex w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/20"
      >
        <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
      </motion.div>
      
      {/* Message Content */}
      <div className="flex-1 min-w-0">
        <div className="bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 backdrop-blur-sm rounded-2xl rounded-tl-lg p-3 sm:p-5 shadow-xl border border-zinc-700/30">
          <div className="space-y-1.5 sm:space-y-2">
            {message.typing ? (
              <TypingIndicator />
            ) : (
              <div className="prose prose-invert max-w-none break-words text-[13px] sm:text-base leading-relaxed">
                {formatMessageContent(message.content)}
              </div>
            )}
          </div>
          
          {!message.typing && (
            <div className="flex items-center justify-between mt-2 sm:mt-4 pt-2 sm:pt-3 border-t border-zinc-700/30">
              <span className="text-[10px] sm:text-xs text-zinc-400">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <div className="flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400" />
                <span className="text-[10px] sm:text-xs text-emerald-400">AI</span>
              </div>
            </div>
          )}
        </div>
        
        {!message.typing && (
          <div 
            className="opacity-0 group-hover:opacity-100 sm:group-hover:opacity-100 transition-opacity duration-200 mt-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-1 justify-end">
              <CopyButton text={message.content} />
              
              {message.role === "assistant" && (
                <>
                  <motion.button
                    onClick={() => onRegenerate?.(message)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 sm:p-1.5 rounded-lg bg-zinc-700/50 hover:bg-zinc-600/50 transition-colors group"
                  >
                    <RotateCcw className="w-4 sm:w-3.5 h-4 sm:h-3.5 text-zinc-400 group-hover:text-white" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 sm:p-1.5 rounded-lg bg-zinc-700/50 hover:bg-zinc-600/50 transition-colors group"
                  >
                    <Volume2 className="w-4 sm:w-3.5 h-4 sm:h-3.5 text-zinc-400 group-hover:text-white" />
                  </motion.button>
                  
                  <div className="flex items-center gap-1 ml-2">
                    <motion.button
                      onClick={() => onFeedback?.('positive')}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 sm:p-1.5 rounded-lg bg-zinc-700/50 hover:bg-emerald-600/20 transition-colors group"
                    >
                      <ThumbsUp className="w-4 sm:w-3.5 h-4 sm:h-3.5 text-zinc-400 group-hover:text-emerald-400" />
                    </motion.button>
                    
                    <motion.button
                      onClick={() => onFeedback?.('negative')}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 sm:p-1.5 rounded-lg bg-zinc-700/50 hover:bg-red-600/20 transition-colors group"
                    >
                      <ThumbsDown className="w-4 sm:w-3.5 h-4 sm:h-3.5 text-zinc-400 group-hover:text-red-400" />
                    </motion.button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  </motion.div>
);

const UserMessage = ({ message }: { message: Message }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className="flex justify-end group"
  >
    <div className="flex gap-2 sm:gap-3 w-fit sm:w-auto sm:max-w-[85%]">
      {/* Message Content */}
      <div className="flex-1 min-w-0">
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
          className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl rounded-tr-lg p-3 sm:p-5 shadow-xl shadow-emerald-500/20 border border-emerald-400/20"
        >
          <p className="text-white leading-relaxed whitespace-pre-wrap break-words text-[13px] sm:text-base">
            {message.content}
          </p>
          
          <div className="flex items-center gap-2 text-[10px] sm:text-xs text-white/70 mt-2">
            <span>
              {message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <span className="flex items-center gap-1">
              {message.status === "sending" && (
                <>
                  <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span>Sending</span>
                </>
              )}
              {message.status === "sent" && (
                <>
                  <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span>Sent</span>
                </>
              )}
              {message.status === "delivered" && (
                <>
                  <CheckCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span>Delivered</span>
                </>
              )}
            </span>
          </div>
        </motion.div>
      </div>
      
      {/* Avatar */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1 }}
        className="hidden sm:flex w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20"
      >
        <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
      </motion.div>
    </div>
  </motion.div>
);

export default function AIPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [activeCategory, setActiveCategory] = useState<keyof typeof quickReplies>("general");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
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

  const handleImageUpload = async (file: File) => {
    try {
      setUploadingImage(true);
      const imageUrl = URL.createObjectURL(file);
      
      const newMessage: Message = {
        role: "user",
        content: "",
        timestamp: new Date(),
        attachments: [{
          type: "image",
          url: imageUrl
        }]
      };
      
      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleVoiceRecording = async (blob: Blob) => {
    try {
      const audioUrl = URL.createObjectURL(blob);
      
      const newMessage: Message = {
        role: "user",
        content: "",
        timestamp: new Date(),
        attachments: [{
          type: "audio",
          url: audioUrl
        }]
      };
      
      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error('Error handling voice recording:', error);
    }
  };

  const handleRegenerate = async (messageToRegenerate: Message) => {
    // Find the index of the message to regenerate
    const index = messages.findIndex(msg => 
      msg.content === messageToRegenerate.content && 
      msg.timestamp === messageToRegenerate.timestamp
    );
    
    if (index === -1) return;

    // Get the user message that triggered this response
    const userMessage = messages[index - 1];
    if (!userMessage || userMessage.role !== "user") return;

    // Add typing indicator
    setMessages(prev => [
      ...prev.slice(0, index),
      { ...messageToRegenerate, typing: true }
    ]);

    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        router.push("/login");
        return;
      }

      const response = await fetch(
        "https://chimlybackendmain.onrender.com/api/schedule",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            input: userMessage.content,
            userId: userId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to regenerate response");
      }

      const data = await response.json();
      
      if (data.message) {
        setMessages(prev => [
          ...prev.slice(0, index),
          {
            role: "assistant",
            content: data.message,
            timestamp: new Date(),
          }
        ]);
      }
    } catch (error) {
      console.error("Error regenerating response:", error);
      setMessages(prev => [
        ...prev.slice(0, index),
        {
          role: "assistant",
          content: "Sorry, I had trouble regenerating the response. Please try again.",
          timestamp: new Date(),
        }
      ]);
    }
  };

  const handleFeedback = async (type: 'positive' | 'negative') => {
    // Implement feedback handling here
    console.log('Feedback:', type);
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      router.push("/login");
      return;
    }

    const newUserMessage: Message = {
      role: "user",
      content: message,
      timestamp: new Date(),
      status: "sending",
    };

    const typingMessage: Message = {
      role: "assistant",
      content: "",
      timestamp: new Date(),
      typing: true
    };

    setMessages((prev) => [...prev, newUserMessage, typingMessage]);
    setMessage("");

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
      
      // Update the user message status and replace typing indicator with actual response
      setMessages((prev) =>
        prev.map((msg, index) => {
          if (index === prev.length - 2) { // User message
            return { ...msg, status: "delivered" };
          }
          if (index === prev.length - 1) { // Replace typing indicator
            return {
              role: "assistant",
              content: data.message,
              timestamp: new Date(),
            };
          }
          return msg;
        })
      );
    } catch (error) {
      console.error("Error in conversation:", error);
      // Remove typing indicator and add error message
      setMessages((prev) => [
        ...prev.slice(0, -1), // Remove typing indicator
        {
          role: "assistant",
          content: "Sorry, I'm having trouble connecting right now. Please try again later.",
          timestamp: new Date(),
        }
      ]);
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b border-zinc-800 gap-4 sm:gap-2">
        <div className="md:flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h1 className="md:text-xl font-semibold text-white text-md">Chimly</h1>
            <p className="md:text-sm text-xs text-zinc-400">
              Chat with your AI powered task manager
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowQuickReplies(!showQuickReplies)}
            className="flex-1 sm:flex-none px-4 py-2 text-sm text-white bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2"
          >
            {showQuickReplies ? (
              <>
                <ChevronDown className="w-4 h-4" />
                <span className="hidden sm:inline text-xs">Hide Suggestions</span>
                <span className="sm:hidden text-xs">Suggestions</span>
              </>
            ) : (
              <>
                <ChevronUp className="w-4 h-4" />
                <span className="hidden sm:inline text-xs">Show Suggestions</span>
                <span className="sm:hidden text-xs">Suggestions</span>
              </>
            )}
          </button>
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="flex-1 sm:flex-none px-4 py-2 text-sm text-white bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline text-xs">Templates</span>
            <span className="sm:hidden text-xs">Quick Use</span>
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
            <div className="p-4 space-y-6">
              {Object.entries(messageTemplates).map(([category, templates]) => (
                <div key={category}>
                  <h3 className="text-sm font-medium text-zinc-400 mb-3 capitalize flex items-center gap-2">
                    <div className="w-1 h-4 bg-emerald-500 rounded-full"></div>
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {templates.map((template, index) => (
                      <button
                        key={index}
                        onClick={() => handleTemplateSelect(template)}
                        className="w-full px-4 py-3 text-sm text-left text-white bg-zinc-800/80 hover:bg-zinc-700/80 transition-colors rounded-xl border border-zinc-700/50 hover:border-emerald-500/50"
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
      <div className={`flex-1 overflow-y-auto px-4 pb-[180px] sm:pb-[140px] scrollbar-hide`}>
        <div className="w-full mx-auto flex flex-col min-h-full">
          <div className="space-y-4 py-4">
            {isLoadingHistory ? (
              <MessageSkeleton />
            ) : (
              messages.map((msg, index) => (
                <div key={index}>
                  {msg.role === "assistant" ? (
                    <AssistantMessage 
                      message={msg}
                      onRegenerate={handleRegenerate}
                      onFeedback={handleFeedback}
                    />
                  ) : (
                    <UserMessage message={msg} />
                  )}
                </div>
              ))
            )}
            {isLoading && <MessageSkeleton />}
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
            className="fixed bottom-[76px] sm:bottom-[84px] left-0 right-0 p-4 border-t border-zinc-800 bg-black/95 backdrop-blur-sm z-10 lg:left-20 data-[collapsed=false]:lg:left-64"
            data-collapsed={isSidebarCollapsed}
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
        className="fixed bottom-0 left-0 right-0 p-3 sm:p-4 border-t border-zinc-800 bg-black/95 backdrop-blur-sm z-20 lg:left-20 lg:right-0 data-[collapsed=false]:lg:left-64"
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
              className="w-full p-3 pr-[4.5rem] sm:pr-24 bg-zinc-800/50 backdrop-blur-sm text-white rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50 min-h-[44px] max-h-[120px] border border-zinc-700/50 text-sm sm:text-base"
              rows={1}
            />
            <div className="absolute right-2 sm:right-3 bottom-3 flex items-center gap-1 sm:gap-2">
              <div className="hidden sm:flex items-center gap-2">
                <ImageUpload onUpload={handleImageUpload} />
                <VoiceRecorder onRecordingComplete={handleVoiceRecording} />
              </div>
              {/* <button className="text-zinc-400 hover:text-emerald-500 transition-colors p-1.5">
                <Smile className="w-5 h-5" />
              </button> */}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex sm:hidden">
              <button
                onClick={() => document.getElementById('mobileActions')?.click()}
                className="h-[44px] w-[44px] flex items-center justify-center bg-zinc-800 text-white rounded-xl hover:bg-zinc-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
              <input
                type="file"
                id="mobileActions"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleImageUpload(e.target.files[0]);
                  }
                }}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!message.trim() && !uploadingImage || isLoading}
              className="h-[44px] w-[44px] flex items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}