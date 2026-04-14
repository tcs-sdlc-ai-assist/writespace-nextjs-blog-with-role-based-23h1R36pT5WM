"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/utils/auth";
import Avatar from "@/components/Avatar";

export function PublicNavbar() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const currentSession = getSession();
    setSession(currentSession);
    setHydrated(true);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-surface-200 bg-white/80 backdrop-blur-md dark:border-surface-700 dark:bg-surface-900/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-xl font-bold tracking-tight text-surface-900 transition-colors hover:text-brand-600 dark:text-surface-50 dark:hover:text-brand-400"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand text-sm text-white">
            W
          </span>
          <span>WriteSpace</span>
        </button>

        {hydrated && (
          <div className="flex items-center gap-3">
            {session ? (
              <>
                <button
                  type="button"
                  onClick={() => router.push("/blogs")}
                  className="hidden sm:inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-surface-600 transition-colors hover:bg-surface-100 hover:text-surface-900 dark:text-surface-300 dark:hover:bg-surface-800 dark:hover:text-surface-50"
                >
                  Blogs
                </button>

                {session.role === "admin" && (
                  <button
                    type="button"
                    onClick={() => router.push("/admin")}
                    className="hidden sm:inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-surface-600 transition-colors hover:bg-surface-100 hover:text-surface-900 dark:text-surface-300 dark:hover:bg-surface-800 dark:hover:text-surface-50"
                  >
                    Dashboard
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => router.push("/blogs")}
                  className="inline-flex items-center gap-2 rounded-full bg-surface-100 py-1 pl-1 pr-3 text-sm font-medium text-surface-700 transition-colors hover:bg-surface-200 dark:bg-surface-800 dark:text-surface-300 dark:hover:bg-surface-700"
                >
                  <Avatar role={session.role === "admin" ? "admin" : "user"} />
                  <span className="hidden sm:inline">{session.displayName || session.username}</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-surface-600 transition-colors hover:bg-surface-100 hover:text-surface-900 dark:text-surface-300 dark:hover:bg-surface-800 dark:hover:text-surface-50"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/register")}
                  className="rounded-lg bg-gradient-brand px-4 py-2 text-sm font-medium text-white shadow-brand-sm transition-all hover:shadow-brand-md hover:brightness-110"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default PublicNavbar;