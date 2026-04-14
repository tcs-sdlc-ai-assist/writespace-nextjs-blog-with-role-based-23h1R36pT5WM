"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPosts, seedData } from "@/utils/storage";
import { getSession } from "@/utils/auth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import BlogCard from "@/components/BlogCard";

function BlogsContent() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
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
    setPosts(sorted);
    setMounted(true);
  }, []);

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

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      <Navbar session={session} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50 sm:text-3xl">
              All Blog Posts
            </h1>
            <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
              {posts.length === 0
                ? "No posts yet. Be the first to write something!"
                : `${posts.length} post${posts.length === 1 ? "" : "s"} published`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/write")}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-white shadow-brand transition-all hover:bg-gradient-brand-hover hover:shadow-brand-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-surface-900"
          >
            ✍️ Write New Post
          </button>
        </div>

        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-surface-300 bg-white px-6 py-16 text-center dark:border-surface-700 dark:bg-surface-800">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-3xl dark:bg-brand-900/30">
              📝
            </div>
            <h2 className="mt-4 text-lg font-semibold text-surface-900 dark:text-surface-50">
              No posts yet
            </h2>
            <p className="mt-2 max-w-sm text-sm text-surface-500 dark:text-surface-400">
              It looks like nobody has written anything yet. Be the first to share your thoughts!
            </p>
            <button
              type="button"
              onClick={() => router.push("/write")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-6 py-2.5 text-sm font-semibold text-white shadow-brand transition-all hover:bg-gradient-brand-hover hover:shadow-brand-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-surface-800"
            >
              ✍️ Write Your First Post
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} session={session} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function BlogsPage() {
  return (
    <ProtectedRoute>
      <BlogsContent />
    </ProtectedRoute>
  );
}