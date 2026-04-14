"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPosts, seedData } from "@/utils/storage";
import { getSession } from "@/utils/auth";

function formatDate(dateString) {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

function truncate(text, maxLength = 120) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

const features = [
  {
    icon: "✍️",
    title: "Distraction-Free Writing",
    description:
      "A clean, minimal editor that lets you focus on what matters most — your words.",
  },
  {
    icon: "💾",
    title: "Auto-Save to Browser",
    description:
      "Your work is automatically saved to localStorage. No accounts needed to get started.",
  },
  {
    icon: "🌗",
    title: "Beautiful & Responsive",
    description:
      "Crafted with Tailwind CSS for a seamless experience on desktop, tablet, and mobile.",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [latestPosts, setLatestPosts] = useState([]);
  const [session, setSession] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    seedData();
    const currentSession = getSession();
    setSession(currentSession);

    const allPosts = getPosts();
    const sorted = [...allPosts].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setLatestPosts(sorted.slice(0, 3));
    setMounted(true);
  }, []);

  function handlePostClick(postId) {
    if (session) {
      router.push(`/blog/${postId}`);
    } else {
      router.push("/login");
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-brand py-20 sm:py-28 lg:py-36">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15)_0%,_transparent_60%)]" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Your Space to{" "}
            <span className="text-brand-200">Write Freely</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80 sm:text-xl">
            A modern, distraction-free writing platform. Create, share, and
            discover stories — all saved right in your browser.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={() => router.push(session ? "/blogs" : "/register")}
              className="inline-flex items-center rounded-xl bg-white px-8 py-3 text-base font-semibold text-brand-700 shadow-brand-md transition-all hover:bg-brand-50 hover:shadow-brand-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-600"
            >
              {session ? "Go to Blog" : "Get Started"}
            </button>
            <button
              type="button"
              onClick={() => router.push(session ? "/blogs" : "/login")}
              className="inline-flex items-center rounded-xl border-2 border-white/30 px-8 py-3 text-base font-semibold text-white transition-all hover:border-white/60 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-600"
            >
              {session ? "Browse Posts" : "Sign In"}
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-surface-50 py-16 sm:py-20 dark:bg-surface-900">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-surface-900 dark:text-surface-50 sm:text-4xl">
              Why WriteSpace?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-surface-500 dark:text-surface-400">
              Everything you need for a seamless writing experience, right in
              your browser.
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-surface-200 bg-white p-6 shadow-brand-sm transition-all hover:shadow-brand-md hover:-translate-y-1 dark:border-surface-700 dark:bg-surface-800"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-subtle text-2xl dark:bg-brand-900/30">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-surface-900 dark:text-surface-50">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-surface-500 dark:text-surface-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="bg-white py-16 sm:py-20 dark:bg-surface-800">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-surface-900 dark:text-surface-50 sm:text-4xl">
              Latest Posts
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-surface-500 dark:text-surface-400">
              Discover what the community has been writing about.
            </p>
          </div>

          {mounted && latestPosts.length === 0 ? (
            <div className="mt-12 text-center">
              <p className="text-surface-400 dark:text-surface-500">
                No posts yet. Be the first to write something!
              </p>
            </div>
          ) : (
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {latestPosts.map((post) => (
                <button
                  key={post.id}
                  type="button"
                  onClick={() => handlePostClick(post.id)}
                  className="group rounded-xl border border-surface-200 bg-surface-50 p-6 text-left shadow-brand-sm transition-all hover:shadow-brand-md hover:-translate-y-1 dark:border-surface-700 dark:bg-surface-900"
                >
                  <h3 className="text-lg font-semibold text-surface-900 group-hover:text-brand-600 transition-colors dark:text-surface-50 dark:group-hover:text-brand-400 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-surface-500 dark:text-surface-400">
                    {truncate(post.content, 120)}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
                      {post.authorName || "Unknown"}
                    </span>
                    <span className="text-xs text-surface-400 dark:text-surface-500">
                      {formatDate(post.createdAt)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => router.push(session ? "/blogs" : "/login")}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-brand transition-all hover:bg-brand-700 hover:shadow-brand-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-surface-800"
            >
              View All Posts →
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-surface-200 bg-surface-50 py-10 dark:border-surface-700 dark:bg-surface-900">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-brand-600 dark:text-brand-400">
                ✍️ WriteSpace
              </span>
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-6">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="text-sm text-surface-500 transition-colors hover:text-brand-600 dark:text-surface-400 dark:hover:text-brand-400"
              >
                Home
              </button>
              <button
                type="button"
                onClick={() => router.push(session ? "/blogs" : "/login")}
                className="text-sm text-surface-500 transition-colors hover:text-brand-600 dark:text-surface-400 dark:hover:text-brand-400"
              >
                Blog
              </button>
              <button
                type="button"
                onClick={() => router.push(session ? "/blogs" : "/login")}
                className="text-sm text-surface-500 transition-colors hover:text-brand-600 dark:text-surface-400 dark:hover:text-brand-400"
              >
                Sign In
              </button>
            </nav>
          </div>
          <div className="mt-8 border-t border-surface-200 pt-6 text-center dark:border-surface-700">
            <p className="text-sm text-surface-400 dark:text-surface-500">
              © {new Date().getFullYear()} WriteSpace. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}