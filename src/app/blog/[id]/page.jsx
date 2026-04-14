"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import Avatar from "@/components/Avatar";
import { getSession } from "@/utils/auth";
import { getPostById, deletePost } from "@/utils/storage";

function formatDate(dateString) {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

function BlogPostContent() {
  const router = useRouter();
  const params = useParams();
  const postId = params?.id;

  const [post, setPost] = useState(null);
  const [session, setSession] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const currentSession = getSession();
    setSession(currentSession);

    if (postId) {
      const found = getPostById(postId);
      if (found) {
        setPost(found);
      } else {
        setNotFound(true);
      }
    } else {
      setNotFound(true);
    }

    setMounted(true);
  }, [postId]);

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

  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
        <Navbar session={session} />
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <div className="animate-fade-in">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-surface-200 text-3xl dark:bg-surface-700">
              📄
            </div>
            <h1 className="mt-6 text-2xl font-bold text-surface-900 dark:text-surface-50">
              Post not found
            </h1>
            <p className="mt-2 text-surface-500 dark:text-surface-400">
              The post you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <button
              type="button"
              onClick={() => router.push("/blogs")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-brand transition-all hover:bg-brand-700 hover:shadow-brand-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-surface-900"
            >
              ← Back to Blogs
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isOwner = session && session.userId === post.authorId;
  const isAdmin = session && session.role === "admin";
  const canEdit = isOwner || isAdmin;
  const canDelete = isOwner || isAdmin;
  const authorRole = post.authorId === "admin" ? "admin" : "user";

  function handleDelete() {
    try {
      deletePost(post.id);
      router.push("/blogs");
    } catch {
      // Silently fail — post may already be deleted
      router.push("/blogs");
    }
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      <Navbar session={session} />

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="animate-fade-in">
          {/* Back link */}
          <button
            type="button"
            onClick={() => router.push("/blogs")}
            className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-surface-500 transition-colors hover:text-brand-600 dark:text-surface-400 dark:hover:text-brand-400"
          >
            ← Back to Blogs
          </button>

          {/* Post card */}
          <article className="rounded-2xl border border-surface-200 bg-white p-6 shadow-brand-sm sm:p-8 dark:border-surface-700 dark:bg-surface-800">
            {/* Title */}
            <h1 className="text-2xl font-bold leading-tight text-surface-900 sm:text-3xl dark:text-surface-50">
              {post.title}
            </h1>

            {/* Author & date */}
            <div className="mt-4 flex items-center gap-3 border-b border-surface-200 pb-4 dark:border-surface-700">
              <Avatar role={authorRole} />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
                  {post.authorName || "Unknown"}
                </span>
                <span className="text-xs text-surface-400 dark:text-surface-500">
                  {formatDate(post.createdAt)}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="mt-6 whitespace-pre-wrap text-base leading-relaxed text-surface-700 dark:text-surface-300">
              {post.content}
            </div>

            {/* Actions */}
            {(canEdit || canDelete) && (
              <div className="mt-8 flex items-center gap-3 border-t border-surface-200 pt-6 dark:border-surface-700">
                {canEdit && (
                  <button
                    type="button"
                    onClick={() => router.push(`/edit/${post.id}`)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-100 dark:bg-brand-900/30 dark:text-brand-300 dark:hover:bg-brand-900/50"
                  >
                    ✏️ Edit Post
                  </button>
                )}
                {canDelete && (
                  <button
                    type="button"
                    onClick={() => setShowConfirm(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                  >
                    🗑️ Delete Post
                  </button>
                )}
              </div>
            )}
          </article>
        </div>
      </main>

      {/* Delete confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm animate-fade-in rounded-2xl bg-white p-6 shadow-brand-lg dark:bg-surface-800">
            <h2 className="text-lg font-bold text-surface-900 dark:text-surface-50">
              Delete Post
            </h2>
            <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">
              Are you sure you want to delete &quot;{post.title}&quot;? This action cannot be undone.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="rounded-lg border border-surface-300 bg-white px-4 py-2 text-sm font-medium text-surface-700 transition-colors hover:bg-surface-50 dark:border-surface-600 dark:bg-surface-700 dark:text-surface-300 dark:hover:bg-surface-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-surface-800"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BlogPostPage() {
  return (
    <ProtectedRoute>
      <BlogPostContent />
    </ProtectedRoute>
  );
}