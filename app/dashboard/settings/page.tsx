"use client";

import { useState } from "react";
import {
  Bell,
  Key,
  Lock,
  User,
  Shield,
  Smartphone,
  Globe,
  Crown,
  BadgeCheck,
  Bot,
  Phone,
  Mail,
  Clock,
  Plus,
  Sparkles,
  Zap,
  Check,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SettingsPage() {
  const [currentPlan, setCurrentPlan] = useState("free");
  const [isVerified, setIsVerified] = useState(false);
  const [enableCalls, setEnableCalls] = useState(false);
  const [enableEmail, setEnableEmail] = useState(true);

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            Settings
            {isVerified && (
              <BadgeCheck className="w-6 h-6 text-emerald-500" />
            )}
          </h1>
          <p className="text-zinc-400 mt-1">Manage your preferences</p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Subscription Plans */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-white flex items-center gap-2">
                <Crown className="w-5 h-5 text-emerald-500" />
                Subscription
              </h2>
              {currentPlan === "pro" ? (
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-sm font-medium flex items-center gap-1">
                  <Sparkles className="w-4 h-4" />
                  Pro Plan
                </span>
              ) : (
                <span className="px-3 py-1 bg-zinc-800 text-zinc-400 rounded-full text-sm">
                  Free Plan
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Free Plan */}
              <div className="p-6 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                <h3 className="text-lg font-medium text-white mb-2">Free</h3>
                <p className="text-zinc-400 mb-4">Basic features for personal use</p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2 text-zinc-300">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <Check className="w-3 h-3 text-emerald-500" />
                    </div>
                    Basic task management
                  </li>
                  <li className="flex items-center gap-2 text-zinc-300">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <Check className="w-3 h-3 text-emerald-500" />
                    </div>
                    AI assistance
                  </li>
                  <li className="flex items-center gap-2 text-zinc-300">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <Check className="w-3 h-3 text-emerald-500" />
                    </div>
                    Email notifications
                  </li>
                </ul>
                <button 
                  className="w-full px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentPlan === "free"}
                >
                  Current Plan
                </button>
              </div>
              {/* Pro Plan */}
              <div className="p-6 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 rounded-xl border border-emerald-500/20">
                <h3 className="text-lg font-medium text-white mb-2 flex items-center gap-2">
                  Pro
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                </h3>
                <p className="text-zinc-400 mb-4">Advanced features for power users</p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2 text-zinc-300">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <Check className="w-3 h-3 text-emerald-500" />
                    </div>
                    Everything in Free
                  </li>
                  <li className="flex items-center gap-2 text-zinc-300">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <Check className="w-3 h-3 text-emerald-500" />
                    </div>
                    Custom LLM integration
                  </li>
                  <li className="flex items-center gap-2 text-zinc-300">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <Check className="w-3 h-3 text-emerald-500" />
                    </div>
                    Voice call notifications
                  </li>
                  <li className="flex items-center gap-2 text-zinc-300">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <Check className="w-3 h-3 text-emerald-500" />
                    </div>
                    Verified badge
                  </li>
                </ul>
                <button 
                  className="w-full px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentPlan === "pro"}
                >
                  {currentPlan === "pro" ? "Current Plan" : "Upgrade to Pro"}
                </button>
              </div>
            </div>
          </div>

          {/* AI Settings */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6">
            <h2 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
              <Bot className="w-5 h-5 text-emerald-500" />
              AI Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Custom LLM API Key</label>
                <div className="relative">
                  <input
                    type="password"
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 pr-24"
                    placeholder="Enter your API key"
                    disabled={currentPlan !== "pro"}
                  />
                  <button 
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-md text-sm hover:bg-emerald-500/20 transition-colors"
                    disabled={currentPlan !== "pro"}
                  >
                    Save
                  </button>
                </div>
                {currentPlan !== "pro" && (
                  <p className="text-xs text-zinc-500 mt-1">Upgrade to Pro to use custom LLM models</p>
                )}
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6">
            <h2 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
              <Bell className="w-5 h-5 text-emerald-500" />
              Notification Preferences
            </h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-zinc-400" />
                  <div>
                    <p className="text-white font-medium">Voice Call Notifications</p>
                    <p className="text-sm text-zinc-400">
                      Receive voice calls for important tasks
                    </p>
                  </div>
                </div>
                <button 
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    enableCalls ? "bg-emerald-600" : "bg-zinc-700"
                  } ${currentPlan !== "pro" ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => currentPlan === "pro" && setEnableCalls(!enableCalls)}
                >
                  <div className={`absolute w-4 h-4 rounded-full bg-white top-1 transition-all ${
                    enableCalls ? "right-1" : "left-1"
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-zinc-400" />
                  <div>
                    <p className="text-white font-medium">Email Notifications</p>
                    <p className="text-sm text-zinc-400">
                      Receive email updates for tasks
                    </p>
                  </div>
                </div>
                <button 
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    enableEmail ? "bg-emerald-600" : "bg-zinc-700"
                  }`}
                  onClick={() => setEnableEmail(!enableEmail)}
                >
                  <div className={`absolute w-4 h-4 rounded-full bg-white top-1 transition-all ${
                    enableEmail ? "right-1" : "left-1"
                  }`} />
                </button>
              </div>

              <div className="space-y-4">
                <h3 className="text-white font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-500" />
                  Reminder Timing
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">First Reminder</label>
                    <Select defaultValue="15">
                      <SelectTrigger className="w-full bg-zinc-800 border-zinc-700">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800">
                        <SelectItem value="5">5 minutes before</SelectItem>
                        <SelectItem value="10">10 minutes before</SelectItem>
                        <SelectItem value="15">15 minutes before</SelectItem>
                        <SelectItem value="30">30 minutes before</SelectItem>
                        <SelectItem value="60">1 hour before</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">Second Reminder</label>
                    <Select defaultValue="0">
                      <SelectTrigger className="w-full bg-zinc-800 border-zinc-700">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800">
                        <SelectItem value="0">At task time</SelectItem>
                        <SelectItem value="5">5 minutes before</SelectItem>
                        <SelectItem value="10">10 minutes before</SelectItem>
                        <SelectItem value="15">15 minutes before</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Request */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6">
            <h2 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-500" />
              Request a Feature
            </h2>
            <div className="space-y-4">
              <textarea
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none h-32"
                placeholder="Describe the feature you'd like to see..."
              />
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors w-full sm:w-auto">
                Submit Request
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
