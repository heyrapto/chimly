"use client";

import { GithubIcon, SlackIcon, Eye, EyeOff, Mail, Lock, User, Phone, Sparkles, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Password strength validation
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);
  const strengthColors = ['bg-gray-300', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        "https://chimlybackendmain.onrender.com/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password,
            phone,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess("Account created successfully! Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        throw new Error(data.message || "Sign up failed");
      }
    } catch (err: any) {
      console.error("Error during signup:", err);
      setError(err.message || "Sign up failed. Please try again.");
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
          <h1 className="text-3xl font-bold text-white mb-2">Join Chimly</h1>
          <p className="text-slate-400">Create your Chimly Account</p>
        </div>

        {/* Sign Up Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl shadow-black/20">
          <form onSubmit={handleSignUp} className="space-y-6">
            {/* Full Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-slate-300">
                Full name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="name"
                  type="text"
                  value={username}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200"
                  required
                />
              </div>
            </div>

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
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-slate-300">
                Phone number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200"
                  required
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
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full pl-10 pr-12 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2">
                  <div className="flex space-x-1 mb-2">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          level <= passwordStrength ? strengthColors[passwordStrength] : 'bg-slate-600'
                        }`}
                      ></div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400">
                    Password strength: <span className={passwordStrength >= 3 ? 'text-green-400' : 'text-orange-400'}>{strengthLabels[passwordStrength]}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}
            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 flex items-center justify-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <p className="text-emerald-400 text-sm">{success}</p>
              </div>
            )}

            {/* Create Account Button */}
            <button
              type="submit"
              disabled={loading || passwordStrength < 2}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-3 px-4 rounded-xl font-medium shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
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

            {/* Social Sign Up Buttons */}
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

          {/* Terms and Privacy */}
          <div className="mt-6 text-center text-xs text-slate-400">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="text-emerald-400 hover:text-emerald-300 underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-emerald-400 hover:text-emerald-300 underline">
              Privacy Policy
            </Link>
          </div>
        </div>

        {/* Sign In Link */}
        <p className="mt-8 text-center text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
            Sign in instead
          </Link>
        </p>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-slate-500">
          <p>Join thousands of users leveraging Chimly</p>
        </div>
      </div>
    </div>
  );
}