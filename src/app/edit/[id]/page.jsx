"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getSession } from "@/utils/auth";
import { getPostById, updatePost, seedData } from "@/utils/storage";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";

function EditPostContent() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id;

  const [session, setSession] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    seedData();
    const currentSession = getSession();
    setSession(currentSession);

    if (!currentSession) {
      router.replace("/login");
      return;
    }

    const post = getPostById(postId);

    if (!post) {
      router.replace("/blogs");
      return;
    }

    const isOwner = currentSession.userId === post.authorId;
    const isAdmin = currentSession.role === "admin";

    if (!isOwner && !isAdmin) {
      router.replace("/blogs");
      return;
    }

    setTitle(post.title);
    setContent(post.content);
    setLoading(false);
  }, [postId, router]);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (!content.trim()) {
      setError("Content is required");
      return;
    }

    setSaving(true);

    try {
      updatePost({
        id: postId,
        title: title.trim(),
        content: content.trim(),
      });
      router.push(`/blog/${postId}`);
    } catch (err) {
      setError(err.message || "Failed to update post");
      setSaving(false);
    }
  }

  function handleCancel() {
    router.back();
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-surface-50 dark:bg-surface-900">
        <Navbar session={session} />
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-3 animate-fade-in">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
            <p className="text-sm text-surface-500 dark:text-surface-400">Loading post…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface-50 dark:bg-surface-900">
      <Navbar session={session} />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-fade-in">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50 sm:text-3xl">
              Edit Post
            </h1>
            <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
              Update your blog post below.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-surface-700 dark:text-surface-300"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Post title"
                className="mt-1 block w-full rounded-lg border border-surface-300 bg-white px-4 py-2.5 text-sm text-surface-900 placeholder-surface-400 shadow-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-surface-600 dark:bg-surface-700 dark:text-surface-50 dark:placeholder-surface-500 dark:focus:border-brand-400 dark:focus:ring-brand-400/20"
              />
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-surface-700 dark:text-surface-300"
              >
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your post content here…"
                rows={14}
                className="mt-1 block w-full rounded-lg border border-surface-300 bg-white px-4 py-2.5 text-sm text-surface-900 placeholder-surface-400 shadow-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-surface-600 dark:bg-surface-700 dark:text-surface-50 dark:placeholder-surface-500 dark:focus:border-brand-400 dark:focus:ring-brand-400/20"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-lg border border-surface-300 bg-white px-5 py-2.5 text-sm font-medium text-surface-700 shadow-sm transition-colors hover:bg-surface-50 focus:outline-none focus:ring-2 focus:ring-surface-300 focus:ring-offset-2 dark:border-surface-600 dark:bg-surface-800 dark:text-surface-300 dark:hover:bg-surface-700 dark:focus:ring-offset-surface-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-white shadow-brand transition-all hover:bg-gradient-brand-hover hover:shadow-brand-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-surface-900"
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function EditPostPage() {
  return (
    <ProtectedRoute>
      <EditPostContent />
    </ProtectedRoute>
  );
}