"use client";

import { useRouter } from "next/navigation";
import Avatar from "@/components/Avatar";

function truncate(text, maxLength = 120) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

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

export function BlogCard({ post, session }) {
  const router = useRouter();

  if (!post) return null;

  const isOwner = session && session.userId === post.authorId;
  const isAdmin = session && session.role === "admin";
  const canEdit = isOwner || isAdmin;

  const authorRole = post.authorId === "admin" ? "admin" : "user";

  return (
    <div className="group rounded-xl border-l-4 border-brand-500 bg-white shadow-brand-sm transition-all hover:shadow-brand-md dark:bg-surface-800 dark:border-brand-400">
      <div className="p-5 sm:p-6">
        <button
          type="button"
          onClick={() => router.push(`/blog/${post.id}`)}
          className="block w-full text-left"
        >
          <h3 className="text-lg font-semibold text-surface-900 group-hover:text-brand-600 transition-colors dark:text-surface-50 dark:group-hover:text-brand-400 line-clamp-2">
            {post.title}
          </h3>
          <p className="mt-2 text-sm text-surface-500 dark:text-surface-400 leading-relaxed">
            {truncate(post.content, 150)}
          </p>
        </button>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
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

          <div className="flex items-center gap-2">
            {canEdit && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/edit/${post.id}`);
                }}
                className="inline-flex items-center gap-1 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700 transition-colors hover:bg-brand-100 dark:bg-brand-900/30 dark:text-brand-300 dark:hover:bg-brand-900/50"
              >
                ✏️ Edit
              </button>
            )}
            <button
              type="button"
              onClick={() => router.push(`/blog/${post.id}`)}
              className="inline-flex items-center gap-1 rounded-lg bg-accent-50 px-3 py-1.5 text-xs font-medium text-accent-700 transition-colors hover:bg-accent-100 dark:bg-accent-900/30 dark:text-accent-300 dark:hover:bg-accent-900/50"
            >
              Read →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogCard;