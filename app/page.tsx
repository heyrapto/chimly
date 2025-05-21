"use client";

import Link from "next/link";
import { FloatingBackground } from "@/components/ui/floating-background";
import {
  Clock,
  Layers,
  Plus,
  ArrowRight,
  Sparkles,
  User2,
  MessageSquare,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [activeSection, setActiveSection] = useState<string>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const sections = ["home", "features", "how-it-works", "pricing", "faq"];
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 } // Adjust threshold as needed
    );

    sections.forEach((section) => {
      const element = document.getElementById(section);
      if (element) observer.observe(element);
    });

    return () => {
      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) observer.unobserve(element);
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-8">
              <Link href="/" className="relative group flex items-center">
                <div className="absolute -inset-2 bg-gradient-to-r from-zinc-100/5 via-zinc-500/10 to-zinc-100/5 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse"></div>
                <div className="relative flex items-center">
                  <div className="relative overflow-hidden">
                    <Image
                      src="/assets/logo.png"
                      alt="Chimly"
                      width={100}
                      height={100}
                      priority
                    />
                  </div>
                </div>
              </Link>
              
              <div className="hidden md:flex items-center space-x-8">
                <a 
                  href="#home" 
                  className={`text-sm font-medium relative group ${
                    activeSection === "home" ? "text-white" : "text-zinc-400 hover:text-white"
                  } transition-colors`}
                >
                  Home
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300 ${
                    activeSection === "home" ? "w-full" : "w-0 group-hover:w-full"
                  }`}></span>
                </a>
                <a 
                  href="#features" 
                  className={`text-sm font-medium relative group ${
                    activeSection === "features" ? "text-white" : "text-zinc-400 hover:text-white"
                  } transition-colors`}
                >
                  Features
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300 ${
                    activeSection === "features" ? "w-full" : "w-0 group-hover:w-full"
                  }`}></span>
                </a>
                <a 
                  href="#pricing" 
                  className={`text-sm font-medium relative group ${
                    activeSection === "pricing" ? "text-white" : "text-zinc-400 hover:text-white"
                  } transition-colors`}
                >
                  Pricing
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300 ${
                    activeSection === "pricing" ? "w-full" : "w-0 group-hover:w-full"
                  }`}></span>
                </a>
                <a 
                  href="#how-it-works" 
                  className={`text-sm font-medium relative group ${
                    activeSection === "how-it-works" ? "text-white" : "text-zinc-400 hover:text-white"
                  } transition-colors`}
                >
                  How It Works
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300 ${
                    activeSection === "how-it-works" ? "w-full" : "w-0 group-hover:w-full"
                  }`}></span>
                </a>
                <a 
                  href="#faq" 
                  className={`text-sm font-medium relative group ${
                    activeSection === "faq" ? "text-white" : "text-zinc-400 hover:text-white"
                  } transition-colors`}
                >
                  FAQ
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300 ${
                    activeSection === "faq" ? "w-full" : "w-0 group-hover:w-full"
                  }`}></span>
                </a>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <Link
                href="/login"
                className="hidden md:block text-zinc-300 hover:text-white transition-colors text-sm font-medium"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-zinc-200/20 to-zinc-600/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="relative px-6 py-2.5 bg-black rounded-full border border-zinc-700/50 text-white hover:border-zinc-500 transition-all duration-300">
                  <span className="relative z-10 font-medium text-sm">Get Started</span>
                </div>
              </Link>
              
              {/* Mobile menu button */}
              <button
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-zinc-900/80 border border-zinc-700/50"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open mobile menu"
              >
                <svg width="18" height="11" viewBox="0 0 18 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 0.5H18M0 5.5H18M0 10.5H18" stroke="white" strokeWidth="1.5"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur flex flex-col items-center justify-center transition-all">
          <button
            className="absolute top-6 right-6 text-white text-3xl"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close mobile menu"
          >
            &times;
          </button>
          <nav className="flex flex-col gap-8 text-center">
            <a
              href="#home"
              className={`text-2xl font-semibold ${activeSection === "home" ? "text-emerald-400" : "text-white"}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </a>
            <a
              href="#features"
              className={`text-2xl font-semibold ${activeSection === "features" ? "text-emerald-400" : "text-white"}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#pricing"
              className={`text-2xl font-semibold ${activeSection === "pricing" ? "text-emerald-400" : "text-white"}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </a>
            <a
              href="#how-it-works"
              className={`text-2xl font-semibold ${activeSection === "how-it-works" ? "text-emerald-400" : "text-white"}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </a>
            <a
              href="#faq"
              className={`text-2xl font-semibold ${activeSection === "faq" ? "text-emerald-400" : "text-white"}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </a>
            <a
              href="/login"
              className="text-2xl font-semibold text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              Log in
            </a>
            <a
              href="/signup"
              className="text-2xl font-semibold text-emerald-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started
            </a>
          </nav>
        </div>
      )}

      {/* Hero Section */}
      <div id="home" className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20">
        <FloatingBackground />

        {/* Available Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8">
          <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm text-white tracking-tight font-medium px-4 py-2 lg:px-6 lg:py-3 rounded-full text-sm lg:text-base border border-white/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Simplify your team&apos;s workflow now
          </div>
        </div>

        {/* Hero Content */}
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 tracking-tight z-10">
            Increase your Team&apos;s
            <br />
            Productivity,{" "}
            <span className="relative inline-block">
              <span className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-300 blur-2xl opacity-40 animate-gradient-x"></span>
              <span className="relative">Without the Burnout</span>
            </span>
          </h1>
          <p className="text-lg text-white/60 mb-8 max-w-2xl mx-auto">
            Take your team&apos;s productivity to the next level with Chimly.
            With our AI-powered tools, you can automate repetitive tasks,
            streamline workflows, and boost your team&apos;s efficiency.
          </p>

          {/* Get Started Button */}
          <Link
            href="/signup"
            className="inline-flex bg-white text-black px-8 py-3 rounded-full hover:bg-white/90 transition-colors font-medium"
          >
            Get Started
          </Link>

          {/* Feature Pills */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-2">
            <div className="flex items-center gap-2 bg-zinc-900/80 backdrop-blur-sm px-4 py-1.5 rounded-full border border-zinc-800 text-xs sm:text-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-white whitespace-nowrap">
                AI Productivity Agent
              </span>
            </div>

            <div className="flex items-center gap-2 bg-zinc-900/80 backdrop-blur-sm px-4 py-1.5 rounded-full border border-zinc-800 text-xs sm:text-sm">
              <User2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-white whitespace-nowrap">
                Prioritize Your Tasks
              </span>
            </div>

            <div className="flex items-center gap-2 bg-zinc-900/80 backdrop-blur-sm px-4 py-1.5 rounded-full border border-zinc-800 text-xs sm:text-sm">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-white whitespace-nowrap">
                Personalized Conversations
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Goals Section */}
      <section className="w-full py-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            These are Our Goals
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Goal Card 1 */}
            <div className="group relative overflow-hidden rounded-2xl bg-zinc-900/50 border border-zinc-800/50 p-8 hover:border-emerald-500/20 transition-colors">
              <div className="relative z-10 flex flex-col h-full">
                <h3 className="text-2xl font-bold text-white mb-4">
                  100% Remote Focus
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  Empower teams to achieve deep work and maintain peak
                  productivity from anywhere in the world.
                </p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Goal Card 2 */}
            <div className="group relative overflow-hidden rounded-2xl bg-zinc-900/50 border border-zinc-800/50 p-8 hover:border-emerald-500/20 transition-colors">
              <div className="relative z-10 flex flex-col h-full">
                <h3 className="text-2xl font-bold text-white mb-4">
                  More in Less Time
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  Optimize workflows and automate repetitive tasks to help teams
                  accomplish more with less effort.
                </p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Goal Card 3 */}
            <div className="group relative overflow-hidden rounded-2xl bg-zinc-900/50 border border-zinc-800/50 p-8 hover:border-emerald-500/20 transition-colors">
              <div className="relative z-10 flex flex-col h-full">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Smart Collaboration
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  Foster seamless team coordination with AI-powered tools that
                  enhance communication and productivity.
                </p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Vision Statement */}
          <div className="mt-16 text-center">
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Our vision is to build a world where{" "}
              <span className="text-emerald-400 font-semibold">
                Chimly becomes the intelligent backbone of human productivity.
              </span>{" "}
              Not just a tool but a transformative platform{" "}
              <span className="text-emerald-400 font-semibold">
                that understands and adapts to how people and organizations
              </span>{" "}
              truly work
            </p>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Key Features
            </h2>
            <p className="text-zinc-400 text-lg">
              Supercharge your productivity with AI-powered task management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI-Driven Task Tracking */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-zinc-800/50 to-zinc-900/50 border border-zinc-800/50 p-8 hover:border-emerald-500/20 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  AI-Driven Task Tracking
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  Intelligent task monitoring that automatically categorizes and
                  tracks your progress, making task management effortless.
                </p>
              </div>
            </div>

            {/* Smart Prioritization */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-zinc-800/50 to-zinc-900/50 border border-zinc-800/50 p-8 hover:border-emerald-500/20 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Smart Prioritization
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  AI-powered system that learns your work patterns and
                  automatically prioritizes tasks for maximum productivity.
                </p>
              </div>
            </div>

            {/* Real-Time Progress Tracking */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-zinc-800/50 to-zinc-900/50 border border-zinc-800/50 p-8 hover:border-emerald-500/20 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Real-Time Progress Tracking
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  Monitor your progress in real-time with detailed insights and
                  visual analytics to stay on top of your goals.
                </p>
              </div>
            </div>

            {/* Adaptive Learning */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-zinc-800/50 to-zinc-900/50 border border-zinc-800/50 p-8 hover:border-emerald-500/20 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Adaptive Learning
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  Our AI continuously learns from your work habits to provide
                  increasingly personalized and effective task management.
                </p>
              </div>
            </div>

            {/* Personalized Accountability */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-zinc-800/50 to-zinc-900/50 border border-zinc-800/50 p-8 hover:border-emerald-500/20 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Personalized Accountability
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  Smart nudges and reminders that keep you on track, tailored to
                  your working style and preferences.
                </p>
              </div>
            </div>

            {/* Cross-Platform Collaboration */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-zinc-800/50 to-zinc-900/50 border border-zinc-800/50 p-8 hover:border-emerald-500/20 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Cross-Platform Collaboration
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  Seamlessly work across all your devices with real-time syncing
                  and collaborative features built-in.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-4 bg-zinc-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Get Started in Minutes
            </h2>
            <p className="text-zinc-400 text-lg">
              Simple setup process to boost your productivity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative group">
              <div className="absolute inset-0.5 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-300" />
              <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 font-bold text-xl">
                    1
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Create Account
                  </h3>
                </div>
                <p className="text-zinc-400 leading-relaxed">
                  Sign up for Chimly using your email or connect with
                  Slack/GitHub. Set up your profile and preferences in just a
                  few clicks.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="absolute inset-0.5 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-300" />
              <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 font-bold text-xl">
                    2
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Connect Tools
                  </h3>
                </div>
                <p className="text-zinc-400 leading-relaxed">
                  Integrate your existing tools and platforms. Our AI will
                  automatically sync and organize your tasks across all
                  services.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group">
              <div className="absolute inset-0.5 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-300" />
              <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 font-bold text-xl">
                    3
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Start Working
                  </h3>
                </div>
                <p className="text-zinc-400 leading-relaxed">
                  Let Chimly handle task organization while you focus on what
                  matters. Our AI adapts to your work style for optimal
                  productivity.
                </p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Quick Setup */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
              <h4 className="text-lg font-semibold text-white mb-4">
                Quick Setup Guide
              </h4>
              <ul className="space-y-3 text-zinc-400">
                <li className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-emerald-500 mt-1 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Open your browser and go to chimly.ai
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-emerald-500 mt-1 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Sign up for Chimly using your email or connect with
                  Slack/GitHub.
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-emerald-500 mt-1 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Set up your profile and preferences
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-emerald-500 mt-1 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Set your work preferences and priorities
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-emerald-500 mt-1 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Let our AI analyze your workflow (24-48 hours)
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
              <h4 className="text-lg font-semibold text-white mb-4">
                24/7 Support
              </h4>
              <p className="text-zinc-400 mb-6">
                Our team is here to help you get the most out of Chimly. Get
                support through:
              </p>
              <ul className="space-y-3 text-zinc-400">
                <li className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-emerald-500 mt-1 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                  Live chat support
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-emerald-500 mt-1 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Email assistance
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-emerald-500 mt-1 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  Documentation
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Marquee */}
      <section className="w-full py-16 bg-zinc-900/50 border-t border-b border-zinc-800/50 overflow-hidden">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Trusted by Teams Worldwide
          </h2>
          <p className="text-zinc-400">
            See what our users have to say about Chimly
          </p>
        </div>

        {/* Marquee Container */}
        <div className="relative">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-black to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-black to-transparent z-10"></div>

          {/* Scrolling Content */}
          <motion.div
            className="flex"
            animate={{
              x: [0, -1035],
            }}
            transition={{
              duration: 20,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {/* First Set */}
            <div className="flex gap-6 px-6">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-[400px] flex-shrink-0">
                <p className="text-white/80 mb-4">
                  "Chimly has transformed how our team collaborates. The AI
                  features are incredibly intuitive."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <span className="text-emerald-500 font-semibold">JD</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">John Doe</p>
                    <p className="text-zinc-500 text-sm">
                      Product Manager, Tech Co
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-[400px] flex-shrink-0">
                <p className="text-white/80 mb-4">
                  "The automation features have saved us countless hours. It's
                  like having an extra team member."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <span className="text-emerald-500 font-semibold">AS</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Alice Smith</p>
                    <p className="text-zinc-500 text-sm">CEO, StartupX</p>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-[400px] flex-shrink-0">
                <p className="text-white/80 mb-4">
                  "Our productivity has increased by 40% since implementing
                  Chimly. The results speak for themselves."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <span className="text-emerald-500 font-semibold">RJ</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Robert Johnson</p>
                    <p className="text-zinc-500 text-sm">Team Lead, Agency Y</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Duplicate Set for Seamless Loop */}
            <div className="flex gap-6 px-6">
              {/* Same testimonials repeated */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-[400px] flex-shrink-0">
                <p className="text-white/80 mb-4">
                  "Chimly has transformed how our team collaborates. The AI
                  features are incredibly intuitive."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <span className="text-emerald-500 font-semibold">JD</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">John Doe</p>
                    <p className="text-zinc-500 text-sm">
                      Product Manager, Tech Co
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-[400px] flex-shrink-0">
                <p className="text-white/80 mb-4">
                  "The automation features have saved us countless hours. It's
                  like having an extra team member."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <span className="text-emerald-500 font-semibold">AS</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Alice Smith</p>
                    <p className="text-zinc-500 text-sm">CEO, StartupX</p>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-[400px] flex-shrink-0">
                <p className="text-white/80 mb-4">
                  "Our productivity has increased by 40% since implementing
                  Chimly. The results speak for themselves."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <span className="text-emerald-500 font-semibold">RJ</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Robert Johnson</p>
                    <p className="text-zinc-500 text-sm">Team Lead, Agency Y</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight text-white mb-4">
              Simplify Your Life, One Task at a Time
            </h2>
            <p className="text-zinc-400 text-lg">
              Choose the perfect plan for your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <div className="relative group">
              <div className="absolute inset-0.5 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-300" />
              <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-8 h-full">
                <div className="flex flex-col h-full">
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Individual
                    </h3>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-4xl font-bold text-white">$10</span>
                      <span className="text-zinc-400">/month</span>
                    </div>
                    <p className="text-zinc-400">
                      Perfect for individual users and small projects.
                    </p>
                  </div>

                  <ul className="space-y-4 mb-8 flex-grow">
                    <li className="flex items-center gap-3 text-zinc-300">
                      <svg
                        className="w-5 h-5 text-emerald-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      AI Task Tracking
                    </li>
                    <li className="flex items-center gap-3 text-zinc-300">
                      <svg
                        className="w-5 h-5 text-emerald-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Smart Scheduling
                    </li>
                    <li className="flex items-center gap-3 text-zinc-300">
                      <svg
                        className="w-5 h-5 text-emerald-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Personalized Accountability
                    </li>
                  </ul>

                  <button className="w-full bg-white/10 text-white py-2 rounded-lg hover:bg-white/20 transition-colors">
                    Get Started
                  </button>
                </div>
              </div>
            </div>

            {/* Pro Plan - Featured */}
            <div className="relative group">
              <div className="absolute inset-0.5 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-2xl blur opacity-30 group-hover:opacity-40 transition duration-300" />
              <div className="relative bg-zinc-900 border border-emerald-500/20 rounded-2xl p-8 h-full">
                <div className="absolute top-0 right-6 -translate-y-1/2">
                  <span className="bg-emerald-500 text-black text-sm font-medium px-3 py-1 rounded-full">
                    Popular
                  </span>
                </div>
                <div className="flex flex-col h-full">
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Team
                    </h3>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-4xl font-bold text-white">$20</span>
                      <span className="text-zinc-400">/month</span>
                    </div>
                    <p className="text-zinc-400">
                      Ideal for teams and growing businesses.
                    </p>
                  </div>

                  <ul className="space-y-4 mb-8 flex-grow">
                    <li className="flex items-center gap-3 text-zinc-300">
                      <svg
                        className="w-5 h-5 text-emerald-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Everything in Basic
                    </li>
                    <li className="flex items-center gap-3 text-zinc-300">
                      <svg
                        className="w-5 h-5 text-emerald-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Cross-Platform Collaboration
                    </li>
                    <li className="flex items-center gap-3 text-zinc-300">
                      <svg
                        className="w-5 h-5 text-emerald-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      AI Accountability Agemt
                    </li>
                    <li className="flex items-center gap-3 text-zinc-300">
                      <svg
                        className="w-5 h-5 text-emerald-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Smart Prioritization
                    </li>
                    <li className="flex items-center gap-3 text-zinc-300">
                      <svg
                        className="w-5 h-5 text-emerald-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Team Support
                    </li>
                  </ul>

                  <button className="w-full bg-emerald-500 text-black py-2 rounded-lg hover:bg-emerald-400 transition-colors font-medium">
                    Get Started
                  </button>
                </div>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="relative group">
              <div className="absolute inset-0.5 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-300" />
              <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-8 h-full">
                <div className="flex flex-col h-full">
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Enterprise
                    </h3>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-4xl font-bold text-white">$40</span>
                      <span className="text-zinc-400">/month</span>
                    </div>
                    <p className="text-zinc-400">
                      Advanced features for larger organizations.
                    </p>
                  </div>

                  <ul className="space-y-4 mb-8 flex-grow">
                    <li className="flex items-center gap-3 text-zinc-300">
                      <svg
                        className="w-5 h-5 text-emerald-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Everything in Pro
                    </li>
                    <li className="flex items-center gap-3 text-zinc-300">
                      <svg
                        className="w-5 h-5 text-emerald-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Comprehensive User Analytics
                    </li>
                    <li className="flex items-center gap-3 text-zinc-300">
                      <svg
                        className="w-5 h-5 text-emerald-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Unlimited AI Requests
                    </li>
                    <li className="flex items-center gap-3 text-zinc-300">
                      <svg
                        className="w-5 h-5 text-emerald-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Custom Workflow & Predictive Insights
                    </li>
                    <li className="flex items-center gap-3 text-zinc-300">
                      <svg
                        className="w-5 h-5 text-emerald-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Enterprise Grade Security
                    </li>
                    <li className="flex items-center gap-3 text-zinc-300">
                      <svg
                        className="w-5 h-5 text-emerald-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Dedicated Support
                    </li>
                  </ul>

                  <button className="w-full bg-white/10 text-white py-2 rounded-lg hover:bg-white/20 transition-colors">
                    Contact Sales
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* FAQs Section */}
      <section id="faq" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-zinc-400 text-lg">
              Everything you need to know about Chimly AI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* FAQ Item 1 */}
            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6 hover:border-emerald-500/20 transition-colors">
              <h3 className="text-xl font-semibold text-white mb-3">
                How does AI-driven task tracking work?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Our AI system automatically monitors your tasks, categorizes
                them based on priority and type, and provides intelligent
                insights about your work patterns. It learns from your behavior
                to make task management more efficient over time.
              </p>
            </div>

            {/* FAQ Item 2 */}
            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6 hover:border-emerald-500/20 transition-colors">
              <h3 className="text-xl font-semibold text-white mb-3">
                What makes the smart prioritization system unique?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Our smart prioritization uses machine learning to understand
                your work patterns, deadlines, and task importance. It
                automatically suggests the most optimal task order and adjusts
                in real-time based on changing priorities.
              </p>
            </div>

            {/* FAQ Item 3 */}
            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6 hover:border-emerald-500/20 transition-colors">
              <h3 className="text-xl font-semibold text-white mb-3">
                How does real-time progress tracking benefit me?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Real-time progress tracking provides instant visibility into
                your task completion rates, productivity patterns, and project
                milestones. This helps you stay on top of deadlines and identify
                areas for improvement.
              </p>
            </div>

            {/* FAQ Item 4 */}
            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6 hover:border-emerald-500/20 transition-colors">
              <h3 className="text-xl font-semibold text-white mb-3">
                What is adaptive learning in Chimly?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Adaptive learning means our AI continuously learns from your
                work habits, preferences, and successful patterns. It adapts its
                recommendations and automations to become more personalized and
                effective over time.
              </p>
            </div>

            {/* FAQ Item 5 */}
            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6 hover:border-emerald-500/20 transition-colors">
              <h3 className="text-xl font-semibold text-white mb-3">
                How do accountability nudges work?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Our accountability system sends smart, personalized reminders
                based on your work patterns and preferences. These gentle nudges
                help you stay on track without being intrusive, adapting to when
                you're most productive.
              </p>
            </div>

            {/* FAQ Item 6 */}
            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6 hover:border-emerald-500/20 transition-colors">
              <h3 className="text-xl font-semibold text-white mb-3">
                Can I collaborate across different platforms?
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Yes! Chimly supports cross-platform collaboration with real-time
                syncing across all devices. Whether you're on desktop, mobile,
                or web, your tasks and progress are always up-to-date and
                accessible to your team.
              </p>
            </div>
          </div>

          {/* Still Have Questions */}
          <div className="mt-12 text-center">
            <p className="text-zinc-400 mb-4">
              Still have questions? We're here to help.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Contact Support
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 border border-zinc-700/30 rounded-3xl p-8 md:p-16">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-30">
              <div className="absolute top-10 left-10 w-40 h-40 bg-white/5 rounded-full filter blur-3xl"></div>
              <div className="absolute bottom-10 right-10 w-60 h-60 bg-white/5 rounded-full filter blur-3xl"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full grid-pattern opacity-20"></div>
            </div>
            
            {/* Content */}
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="text-left max-w-2xl">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  Ready to Transform Your Workflow?
                </h2>
                <p className="text-zinc-300 text-lg mb-8 leading-relaxed">
                  Join thousands of teams who have already revolutionized their productivity with Chimly AI. Get started today and see the difference.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/waitlist"
                    className="inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-3.5 rounded-full hover:bg-white/90 transition-all duration-300 font-medium group"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <Link
                    href="#features"
                    className="inline-flex items-center justify-center gap-2 bg-transparent border border-zinc-600 text-white px-8 py-3.5 rounded-full hover:bg-white/5 transition-all duration-300"
                  >
                    <span>Learn More</span>
                  </Link>
                </div>
              </div>
              
              <div className="hidden lg:block relative">
                <div className="absolute inset-0 bg-white/5 rounded-full filter blur-xl"></div>
                <div className="relative bg-zinc-800/50 border border-zinc-700/30 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 rounded-full bg-zinc-600"></div>
                    <div className="w-3 h-3 rounded-full bg-zinc-600"></div>
                    <div className="w-3 h-3 rounded-full bg-zinc-600"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 w-40 bg-zinc-700/50 rounded-full"></div>
                    <div className="h-3 w-32 bg-zinc-700/50 rounded-full"></div>
                    <div className="h-3 w-36 bg-zinc-700/50 rounded-full"></div>
                    <div className="h-10 w-full bg-zinc-700/30 rounded-lg mt-4"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-16 pb-8 px-4 border-t border-zinc-800/50 bg-black/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
            {/* Company Info */}
            <div className="col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative overflow-hidden ">
                  <Image
                    src="/assets/logo.png"
                    alt="Chimly"
                    width={80}
                    height={80}
                    priority
                  />
                </div>
              </div>
              <p className="text-zinc-400 text-sm mb-6">
                Simplify your workflow with AI-powered productivity tools designed for modern teams.
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="text-white font-medium mb-4">Product</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#features" className="text-zinc-400 text-sm hover:text-white transition-colors">Features</a>
                </li>
                <li>
                  <a href="#pricing" className="text-zinc-400 text-sm hover:text-white transition-colors">Pricing</a>
                </li>
                <li>
                  <a href="#faq" className="text-zinc-400 text-sm hover:text-white transition-colors">FAQ</a>
                </li>
              </ul>
            </div>
            
            {/* Resources */}
            <div>
              <h3 className="text-white font-medium mb-4">Resources</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/help" className="text-zinc-400 text-sm hover:text-white transition-colors">Help Center</Link>
                </li>
                <li>
                  <Link href="/community" className="text-zinc-400 text-sm hover:text-white transition-colors">Community</Link>
                </li>
                <li>
                  <Link href="/blog" className="text-zinc-400 text-sm hover:text-white transition-colors">Blog</Link>
                </li>
              </ul>
            </div>
            
            {/* Legal */}
            <div>
              <h3 className="text-white font-medium mb-4">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/privacy" className="text-zinc-400 text-sm hover:text-white transition-colors">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/terms" className="text-zinc-400 text-sm hover:text-white transition-colors">Terms of Service</Link>
                </li>
                <li>
                  <Link href="/contact" className="text-zinc-400 text-sm hover:text-white transition-colors">Contact Us</Link>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="pt-8 border-t border-zinc-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-zinc-500 text-sm">
              © {new Date().getFullYear()} Chimly. All rights reserved.
            </div>
            
            <div className="flex items-center gap-6">
              <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
