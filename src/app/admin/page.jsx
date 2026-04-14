"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/utils/auth";
import { getPosts, getUsers, deletePost, seedData } from "@/utils/storage";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import StatCard from "@/components/StatCard";

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

function truncate(text, maxLength = 80) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

function AdminDashboardContent() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    seedData();
    const currentSession = getSession();
    setSession(currentSession);

    const allPosts = getPosts();
    const allUsers = getUsers();
    setPosts(allPosts);
    setUsers(allUsers);
    setMounted(true);
  }, []);

  function refreshData() {
    setPosts(getPosts());
    setUsers(getUsers());
  }

  function handleDeletePost(postId) {
    if (!postId) return;
    try {
      deletePost(postId);
      refreshData();
    } catch {
      // silently fail
    }
  }

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-50 dark:bg-surface-900">
        <div className="flex flex-col items-center gap-3 animate-fade-in">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
          <p className="text-sm text-surface-500 dark:text-surface-400">Loading…</p>
        </div>
      </div>
    );
  }

  const totalPosts = posts.length;
  const totalUsers = users.length + 1; // +1 for hard-coded admin
  const adminCount = users.filter((u) => u.role === "admin").length + 1; // +1 for hard-coded admin
  const userCount = users.filter((u) => u.role === "user").length;

  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      <Navbar session={session} />

      {/* Gradient Banner Header */}
      <div className="relative overflow-hidden bg-gradient-brand py-12 sm:py-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15)_0%,_transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-lg text-white/80">
            Welcome back, {session?.displayName || session?.username || "Admin"}. Here&apos;s an overview of your platform.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stat Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Posts" value={totalPosts} icon="📝" />
          <StatCard label="Total Users" value={totalUsers} icon="👥" />
          <StatCard label="Admins" value={adminCount} icon="👑" />
          <StatCard label="Users" value={userCount} icon="📖" />
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-50">
            Quick Actions
          </h2>
          <div className="mt-4 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => router.push("/write")}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-6 py-3 text-sm font-semibold text-white shadow-brand transition-all hover:bg-gradient-brand-hover hover:shadow-brand-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-surface-900"
            >
              ✍️ Write New Post
            </button>
            <button
              type="button"
              onClick={() => router.push("/users")}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-brand-500 px-6 py-3 text-sm font-semibold text-brand-600 transition-all hover:bg-brand-50 hover:shadow-brand focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:border-brand-400 dark:text-brand-400 dark:hover:bg-brand-900/20 dark:focus:ring-offset-surface-900"
            >
              👥 Manage Users
            </button>
          </div>
        </div>

        {/* Recent Posts */}
        <div className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-50">
              Recent Posts
            </h2>
            <button
              type="button"
              onClick={() => router.push("/blogs")}
              className="text-sm font-medium text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
            >
              View All →
            </button>
          </div>

          {recentPosts.length === 0 ? (
            <div className="mt-6 rounded-xl border border-surface-200 bg-white p-8 text-center dark:border-surface-700 dark:bg-surface-800">
              <p className="text-surface-400 dark:text-surface-500">
                No posts yet. Create your first post!
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-xl border border-surface-200 bg-white p-5 shadow-brand-sm transition-all hover:shadow-brand-md dark:border-surface-700 dark:bg-surface-800 animate-fade-in"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={() => router.push(`/blog/${post.id}`)}
                        className="text-left"
                      >
                        <h3 className="text-base font-semibold text-surface-900 transition-colors hover:text-brand-600 dark:text-surface-50 dark:hover:text-brand-400 line-clamp-1">
                          {post.title}
                        </h3>
                      </button>
                      <p className="mt-1 text-sm text-surface-500 dark:text-surface-400 line-clamp-1">
                        {truncate(post.content, 100)}
                      </p>
                      <div className="mt-2 flex items-center gap-3">
                        <span className="text-xs font-medium text-surface-600 dark:text-surface-300">
                          {post.authorName || "Unknown"}
                        </span>
                        <span className="text-xs text-surface-400 dark:text-surface-500">
                          {formatDate(post.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => router.push(`/edit/${post.id}`)}
                        className="inline-flex items-center gap-1 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700 transition-colors hover:bg-brand-100 dark:bg-brand-900/30 dark:text-brand-300 dark:hover:bg-brand-900/50"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePost(post.id)}
                        className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute adminOnly>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}