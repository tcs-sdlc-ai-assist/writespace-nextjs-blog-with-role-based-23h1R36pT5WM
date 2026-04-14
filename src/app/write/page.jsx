"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/utils/auth";
import { addPost } from "@/utils/storage";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";

function WriteForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const session = getSession();

  const titleMaxLength = 150;
  const contentMaxLength = 10000;

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle) {
      setError("Title is required");
      return;
    }

    if (!trimmedContent) {
      setError("Content is required");
      return;
    }

    if (trimmedTitle.length > titleMaxLength) {
      setError(`Title must be ${titleMaxLength} characters or fewer`);
      return;
    }

    if (trimmedContent.length > contentMaxLength) {
      setError(`Content must be ${contentMaxLength} characters or fewer`);
      return;
    }

    setSubmitting(true);

    try {
      addPost({
        title: trimmedTitle,
        content: trimmedContent,
        authorId: session?.userId || "unknown",
        authorName: session?.displayName || session?.username || "Unknown",
        createdAt: new Date().toISOString(),
      });
      router.push("/blogs");
    } catch (err) {
      setError(err.message || "Failed to save post");
      setSubmitting(false);
    }
  }

  function handleCancel() {
    router.push("/blogs");
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      <Navbar session={session} />

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-fade-in">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-surface-900 dark:text-surface-50">
              Write a New Post
            </h1>
            <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">
              Share your thoughts with the WriteSpace community.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-surface-700 dark:text-surface-300"
                >
                  Title
                </label>
                <span
                  className={`text-xs ${
                    title.length > titleMaxLength
                      ? "text-red-500"
                      : "text-surface-400 dark:text-surface-500"
                  }`}
                >
                  {title.length}/{titleMaxLength}
                </span>
              </div>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your post title"
                className="mt-1 block w-full rounded-lg border border-surface-300 bg-white px-4 py-2.5 text-sm text-surface-900 placeholder-surface-400 shadow-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-surface-600 dark:bg-surface-700 dark:text-surface-50 dark:placeholder-surface-500 dark:focus:border-brand-400 dark:focus:ring-brand-400/20"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-surface-700 dark:text-surface-300"
                >
                  Content
                </label>
                <span
                  className={`text-xs ${
                    content.length > contentMaxLength
                      ? "text-red-500"
                      : "text-surface-400 dark:text-surface-500"
                  }`}
                >
                  {content.length}/{contentMaxLength}
                </span>
              </div>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your post content here…"
                rows={14}
                className="mt-1 block w-full resize-y rounded-lg border border-surface-300 bg-white px-4 py-2.5 text-sm text-surface-900 placeholder-surface-400 shadow-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-surface-600 dark:bg-surface-700 dark:text-surface-50 dark:placeholder-surface-500 dark:focus:border-brand-400 dark:focus:ring-brand-400/20"
              />
              <div className="mt-2 flex items-center gap-4 text-xs text-surface-400 dark:text-surface-500">
                <span>
                  {content.trim().length === 0
                    ? "0 words"
                    : `${content.trim().split(/\s+/).length} word${content.trim().split(/\s+/).length === 1 ? "" : "s"}`}
                </span>
                <span>
                  {content.length} character{content.length === 1 ? "" : "s"}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-surface-200 pt-6 dark:border-surface-700">
              <button
                type="button"
                onClick={handleCancel}
                disabled={submitting}
                className="rounded-lg border border-surface-300 bg-white px-5 py-2.5 text-sm font-medium text-surface-700 shadow-sm transition-colors hover:bg-surface-50 focus:outline-none focus:ring-2 focus:ring-surface-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-surface-600 dark:bg-surface-800 dark:text-surface-300 dark:hover:bg-surface-700 dark:focus:ring-offset-surface-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-white shadow-brand transition-all hover:bg-gradient-brand-hover hover:shadow-brand-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-surface-900"
              >
                {submitting ? "Publishing…" : "Publish Post"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function WritePage() {
  return (
    <ProtectedRoute>
      <WriteForm />
    </ProtectedRoute>
  );
}