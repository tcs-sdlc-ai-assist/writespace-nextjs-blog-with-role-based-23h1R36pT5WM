"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Avatar from "@/components/Avatar";
import { logout } from "@/utils/auth";

export function Navbar({ session }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isAdmin = session && session.role === "admin";

  const navLinks = [
    { href: "/blogs", label: "All Blogs" },
    { href: "/write", label: "Write" },
  ];

  if (isAdmin) {
    navLinks.push({ href: "/users", label: "Users" });
  }

  function isActive(href) {
    if (href === "/blogs") {
      return pathname === "/blogs" || pathname.startsWith("/blog/");
    }
    return pathname === href || pathname.startsWith(href + "/");
  }

  function handleLogout() {
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    router.push("/");
  }

  function handleNavigate(href) {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
    router.push(href);
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-surface-200 bg-white/80 backdrop-blur-md dark:bg-surface-900/80 dark:border-surface-700">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <button
            type="button"
            onClick={() => handleNavigate("/blogs")}
            className="flex items-center gap-2 text-xl font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
          >
            <span className="text-2xl">✍️</span>
            <span>WriteSpace</span>
          </button>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                type="button"
                onClick={() => handleNavigate(link.href)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300"
                    : "text-surface-600 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-surface-100"
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop avatar + dropdown */}
          <div className="hidden md:flex items-center gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-full border border-surface-200 bg-surface-50 px-3 py-1.5 transition-colors hover:bg-surface-100 dark:border-surface-700 dark:bg-surface-800 dark:hover:bg-surface-700"
              >
                <Avatar role={isAdmin ? "admin" : "user"} />
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-surface-800 dark:text-surface-200">
                    {session?.displayName || session?.username || "User"}
                  </span>
                  <span className="text-xs text-surface-500 dark:text-surface-400">
                    {isAdmin ? "Admin" : "User"}
                  </span>
                </div>
                <svg
                  className={`h-4 w-4 text-surface-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 z-50 mt-2 w-48 rounded-xl border border-surface-200 bg-white py-1 shadow-brand-md animate-slide-down dark:border-surface-700 dark:bg-surface-800">
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => handleNavigate("/admin")}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-surface-700 hover:bg-surface-50 dark:text-surface-300 dark:hover:bg-surface-700"
                      >
                        <span>📊</span>
                        Dashboard
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      <span>🚪</span>
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              setDropdownOpen(false);
            }}
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-surface-600 hover:bg-surface-100 hover:text-surface-900 transition-colors dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-surface-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-surface-200 bg-white dark:border-surface-700 dark:bg-surface-900 animate-slide-down">
          <div className="space-y-1 px-4 py-3">
            {navLinks.map((link) => (
              <button
                key={link.href}
                type="button"
                onClick={() => handleNavigate(link.href)}
                className={`block w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300"
                    : "text-surface-600 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-surface-100"
                }`}
              >
                {link.label}
              </button>
            ))}
            {isAdmin && (
              <button
                type="button"
                onClick={() => handleNavigate("/admin")}
                className={`block w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                  isActive("/admin")
                    ? "bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300"
                    : "text-surface-600 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-surface-100"
                }`}
              >
                📊 Dashboard
              </button>
            )}
          </div>

          <div className="border-t border-surface-200 px-4 py-3 dark:border-surface-700">
            <div className="flex items-center gap-3 mb-3">
              <Avatar role={isAdmin ? "admin" : "user"} />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-surface-800 dark:text-surface-200">
                  {session?.displayName || session?.username || "User"}
                </span>
                <span className="text-xs text-surface-500 dark:text-surface-400">
                  {isAdmin ? "Admin" : "User"}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;