"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { register, getSession } from "@/utils/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const session = getSession();
    if (session) {
      router.replace("/blogs");
    } else {
      setCheckingSession(false);
    }
  }, [router]);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!displayName.trim() || !username.trim() || !password || !confirmPassword) {
      setError("All fields required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      register({
        displayName: displayName.trim(),
        username: username.trim(),
        password,
        confirmPassword,
      });
      router.push("/blogs");
    } catch (err) {
      setError(err.message || "Registration failed");
      setLoading(false);
    }
  }

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-50 dark:bg-surface-900">
        <p className="text-surface-500 dark:text-surface-400">Loading…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50 px-4 dark:bg-surface-900">
      <div className="w-full max-w-md animate-fade-in">
        <div className="rounded-2xl bg-white p-8 shadow-brand-md dark:bg-surface-800">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50">
              Create Account
            </h1>
            <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
              Join WriteSpace and start writing
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
                htmlFor="displayName"
                className="mb-1 block text-sm font-medium text-surface-700 dark:text-surface-300"
              >
                Display Name
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your full name"
                className="w-full rounded-lg border border-surface-300 bg-white px-4 py-2.5 text-sm text-surface-900 placeholder-surface-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-surface-600 dark:bg-surface-700 dark:text-surface-50 dark:placeholder-surface-500 dark:focus:border-brand-400"
              />
            </div>

            <div>
              <label
                htmlFor="username"
                className="mb-1 block text-sm font-medium text-surface-700 dark:text-surface-300"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                className="w-full rounded-lg border border-surface-300 bg-white px-4 py-2.5 text-sm text-surface-900 placeholder-surface-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-surface-600 dark:bg-surface-700 dark:text-surface-50 dark:placeholder-surface-500 dark:focus:border-brand-400"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-surface-700 dark:text-surface-300"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="w-full rounded-lg border border-surface-300 bg-white px-4 py-2.5 text-sm text-surface-900 placeholder-surface-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-surface-600 dark:bg-surface-700 dark:text-surface-50 dark:placeholder-surface-500 dark:focus:border-brand-400"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1 block text-sm font-medium text-surface-700 dark:text-surface-300"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full rounded-lg border border-surface-300 bg-white px-4 py-2.5 text-sm text-surface-900 placeholder-surface-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-surface-600 dark:bg-surface-700 dark:text-surface-50 dark:placeholder-surface-500 dark:focus:border-brand-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-brand px-4 py-2.5 text-sm font-semibold text-white shadow-brand-sm transition-all hover:bg-gradient-brand-hover hover:shadow-brand-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-surface-500 dark:text-surface-400">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="font-medium text-brand-600 hover:text-brand-700 transition-colors dark:text-brand-400 dark:hover:text-brand-300"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}