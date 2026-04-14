"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login, getSession } from "@/utils/auth";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    if (session) {
      if (session.role === "admin") {
        router.replace("/admin");
      } else {
        router.replace("/blogs");
      }
    } else {
      setLoading(false);
    }
  }, [router]);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const session = login(username, password);
      if (session.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/blogs");
      }
    } catch (err) {
      setError(err.message || "Login failed");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-50 dark:bg-surface-900">
        <div className="text-surface-400 dark:text-surface-500 text-sm">Loading…</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50 px-4 dark:bg-surface-900">
      <div className="w-full max-w-md animate-fade-in">
        <div className="rounded-2xl bg-white p-8 shadow-brand-md dark:bg-surface-800">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50">
              Welcome Back
            </h1>
            <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
              Sign in to your WriteSpace account
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-surface-700 dark:text-surface-300"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="mt-1 block w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 placeholder-surface-400 shadow-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-surface-600 dark:bg-surface-700 dark:text-surface-50 dark:placeholder-surface-500 dark:focus:border-brand-400 dark:focus:ring-brand-400/20"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-surface-700 dark:text-surface-300"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="mt-1 block w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 placeholder-surface-400 shadow-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-surface-600 dark:bg-surface-700 dark:text-surface-50 dark:placeholder-surface-500 dark:focus:border-brand-400 dark:focus:ring-brand-400/20"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-gradient-brand px-4 py-2.5 text-sm font-semibold text-white shadow-brand transition-all hover:bg-gradient-brand-hover hover:shadow-brand-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-surface-800"
            >
              Sign In
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-surface-500 dark:text-surface-400">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/register")}
              className="font-medium text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
            >
              Create one
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}