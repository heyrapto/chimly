"use client";

import { GithubIcon, SlackIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

      // Force a hard navigation
      window.location.href = "/dashboard";
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="mb-8">
        <Image
          src="/assets/logo.png"
          alt="Chimly"
          width={140}
          height={140}
        />
      </div>

      <div className="w-full max-w-md p-8 rounded-2xl bg-zinc-900 border border-zinc-800">
        <h1 className="text-2xl font-semibold text-white text-center mb-8">
          Sign in
        </h1>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm text-zinc-400">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm text-zinc-400">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black py-2 rounded-lg font-medium hover:bg-white/90 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Continue"}
          </button>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {success && (
            <p className="text-emerald-500 text-sm text-center">{success}</p>
          )}
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-white hover:text-emerald-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
