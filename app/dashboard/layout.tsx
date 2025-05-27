"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Home,
  CheckSquare,
  Calendar,
  Settings,
  Users,
  Bell,
  BarChart,
  LogOut,
  HelpCircle,
  Bot,
  Menu,
  ArrowLeft,
  Zap,
  BadgeCheck,
  Filter,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userInfo, setUserInfo] = useState<{ name: string; email: string } | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      window.location.href = "/login";
      return;
    }

    // Fetch user information
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(
          `https://chimlybackendmain.onrender.com/api/dashboard/user/${userId}`,
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
        console.log(data);
        if (data) {
          setUserInfo({
            name: data.data.username,
            email: data.data.email,
          });
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, [router]);

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-black">
      {/* Sidebar with Mobile Toggle */}
      <div className="relative z-50">
        {/* Mobile Menu Button - Always Visible */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-4 left-4 p-2 bg-zinc-800 rounded-lg z-50"
        >
          <Menu className="w-6 h-6 text-white" />
        </button>

        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed inset-y-0 left-0 h-full border-r border-zinc-800 p-4 bg-black transition-transform duration-300 ease-in-out ${
            isCollapsed ? "lg:w-20" : "lg:w-64"
          } w-64 z-50`}
        >
          {/* Back to Home Link */}
          <Link
            href="/"
            className={`mb-6 flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors ${
              isCollapsed ? "lg:justify-center" : ""
            }`}
          >
            <ArrowLeft
              className={`${isCollapsed ? "lg:w-8 lg:h-8" : "w-4 h-4"}`}
            />
            <span className={isCollapsed ? "lg:hidden" : ""}>Back to Home</span>
          </Link>

          {/* Logo */}
          <div className="mb-8 px-2 flex items-center justify-between">
            <Image
              src="/assets/logo.png"
              alt="Chimly"
              width={120}
              height={40}
              className={`transition-all duration-300 ${
                isCollapsed ? "hidden" : "block"
              }`}
            />
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:block p-2 hover:bg-zinc-800 rounded-lg"
            >
              <Menu
                className={`${
                  isCollapsed ? "lg:w-6 lg:h-6" : "w-4 h-4"
                } text-white`}
              />
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            <Link
              href="/dashboard"
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isCollapsed ? "lg:justify-center" : ""
              } ${
                isActive('/dashboard')
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              }`}
            >
              <Home
                className={`${isCollapsed ? "lg:w-8 lg:h-8" : "w-4 h-4"}`}
              />
              <span className={isCollapsed ? "lg:hidden" : ""}>Home</span>
            </Link>

            <Link
              href="/dashboard/ai"
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isCollapsed ? "lg:justify-center" : ""
              } ${
                isActive('/dashboard/ai')
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              }`}
            >
              <Bot className={`${isCollapsed ? "lg:w-8 lg:h-8" : "w-4 h-4"}`} />
              <span className={isCollapsed ? "lg:hidden" : ""}>AI</span>
            </Link>

            <Link
              href="/dashboard/tasks"
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isCollapsed ? "lg:justify-center" : ""
              } ${
                isActive('/dashboard/tasks')
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              }`}
            >
              <CheckSquare
                className={`${isCollapsed ? "lg:w-8 lg:h-8" : "w-4 h-4"}`}
              />
              <span className={isCollapsed ? "lg:hidden" : ""}>Tasks</span>
            </Link>

            {/* Disabled links with Coming Soon badges */}
            {[
              {
                href: "/dashboard/calendar",
                icon: Calendar,
                label: "Calendar",
              },
              {
                href: "/dashboard/analytics",
                icon: BarChart,
                label: "Analytics",
              },
              { href: "/dashboard/team", icon: Users, label: "Team" },
            ].map((item) => (
              <div
                key={item.href}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-500 rounded-lg ${
                  isCollapsed ? "lg:justify-center" : ""
                }`}
              >
                <item.icon
                  className={`${isCollapsed ? "lg:w-8 lg:h-8" : "w-4 h-4"}`}
                />
                {!isCollapsed && (
                  <div className="flex items-center justify-between w-full">
                    <span>{item.label}</span>
                    <div className="text-xs px-2 py-0.5 rounded-full bg-zinc-800/50">
                      Coming Soon
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Settings Section */}
          <div className="mt-8">
            <h3
              className={`px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 ${
                isCollapsed ? "lg:hidden" : ""
              }`}
            >
              Settings
            </h3>
            <nav className="space-y-1">
              {[
                {
                  href: "/dashboard/settings",
                  icon: Settings,
                  label: "Settings",
                },
                {
                  href: "/dashboard/notifications",
                  icon: Bell,
                  label: "Notifications",
                },
              ].map((item) => (
                <div
                  key={item.href}
                  className={`flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-500 rounded-lg ${
                    isCollapsed ? "lg:justify-center" : ""
                  }`}
                >
                  <item.icon
                    className={`${isCollapsed ? "lg:w-8 lg:h-8" : "w-4 h-4"}`}
                  />
                  {!isCollapsed && (
                    <div className="flex items-center justify-between w-full">
                      <span>{item.label}</span>
                      <div className="text-xs px-2 py-0.5 rounded-full bg-zinc-800/50">
                        Coming Soon
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* User Section */}
          <div
            className={`mt-auto pt-4 border-t border-zinc-800 ${
              isCollapsed ? "lg:hidden" : ""
            }`}
          >
            <div className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <span className="text-sm font-medium text-emerald-500">
                  {userInfo?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0" onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("userId");
                window.location.href = "/login";
              }}>
                <div className="flex items-center gap-1">
                  <p className="text-sm font-medium text-white truncate">
                    {userInfo?.name || 'Loading...'}
                  </p>
                  <BadgeCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                </div>
                <p className="text-xs text-zinc-500 truncate">
                  {userInfo?.email || 'Loading...'}
                </p>
              </div>
              <LogOut className="w-4 h-4 text-zinc-400"/>
            </div>
          </div>
        </aside>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
        !isCollapsed ? "lg:ml-64" : "lg:ml-20"
      }`}>
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-zinc-800 bg-black/50 backdrop-blur-xl">
          <div className="px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
            {/* Left side */}
            <div className="flex items-center gap-4">
              <div className="w-10 lg:hidden">
                {/* Spacer for mobile menu button */}
              </div>
              <h1 className="text-lg font-semibold text-white capitalize">
                {pathname === "/dashboard"
                  ? "Dashboard"
                  : pathname.split("/").pop()?.replace(/-/g, " ")}
              </h1>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Notifications */}
              <button className="relative p-1.5 sm:p-2 text-zinc-400 hover:text-white transition-colors">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full"></span>
              </button>

              {/* Help */}
              <button className="p-1.5 sm:p-2 text-zinc-400 hover:text-white transition-colors">
                <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* User Menu */}
              <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-zinc-800">
                <div className="hidden sm:flex flex-col items-end">
                  <p className="text-sm font-medium text-white">
                    {userInfo?.name || "Loading..."}
                  </p>
                  <p className="text-xs text-zinc-400">
                    {userInfo?.email || "Loading..."}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <span className="text-sm font-medium text-emerald-500">
                    {userInfo?.name?.[0]?.toUpperCase() || "?"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
