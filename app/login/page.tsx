"use client";

import { GithubIcon, SlackIcon, Eye, EyeOff, Mail, Lock, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        "https://chimlybackendmain.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();
      console.log("Login response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store tokens
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);

      // Set cookie
      document.cookie = `token=${data.token}; path=/`;

      // Show success message
      setSuccess("Login successful!");
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10 w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          {/* <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl mb-6 shadow-lg shadow-emerald-500/25">
            <Sparkles className="w-8 h-8 text-white" />
          </div> */}
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-slate-400">Sign in to your Chimly Account</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl shadow-black/20">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}
            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                <p className="text-emerald-400 text-sm text-center">{success}</p>
              </div>
            )}

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-3 px-4 rounded-xl font-medium shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in to Chimly</span>
                  <Sparkles className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-800/50 text-slate-400">Or continue with</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center px-4 py-3 border border-slate-600 rounded-xl text-slate-300 hover:bg-slate-700/50 hover:border-slate-500 transition-all duration-200"
              >
                <GithubIcon className="w-5 h-5 mr-2" />
                GitHub
              </button>
              <button
                type="button"
                className="flex items-center justify-center px-4 py-3 border border-slate-600 rounded-xl text-slate-300 hover:bg-slate-700/50 hover:border-slate-500 transition-all duration-200"
              >
                <SlackIcon className="w-5 h-5 mr-2" />
                Slack
              </button>
            </div>
          </form>
        </div>

        {/* Sign Up Link */}
        <p className="mt-8 text-center text-slate-400">
          New to Chimly?{" "}
          <Link href="/signup" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
            Create an account
          </Link>
        </p>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-slate-500">
          <p>Powered by Chimly</p>
        </div>
      </div>
    </div>
  );
}