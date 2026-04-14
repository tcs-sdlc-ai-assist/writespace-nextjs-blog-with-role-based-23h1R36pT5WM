"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import UserRow from "@/components/UserRow";
import { getSession } from "@/utils/auth";
import { getUsers, addUser, deleteUser, seedData } from "@/utils/storage";

function generateId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function UsersPageContent() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [users, setUsers] = useState([]);
  const [mounted, setMounted] = useState(false);

  // Create user form state
  const [showForm, setShowForm] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // Delete confirmation state
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const loadUsers = useCallback(() => {
    const storedUsers = getUsers();
    // Prepend the hard-coded admin user for display
    const adminUser = {
      id: "admin",
      userId: "admin",
      displayName: "Carol Davis",
      username: "admin",
      role: "admin",
      createdAt: "2024-01-01T00:00:00Z",
    };
    setUsers([adminUser, ...storedUsers]);
  }, []);

  useEffect(() => {
    seedData();
    const currentSession = getSession();
    setSession(currentSession);
    loadUsers();
    setMounted(true);
  }, [loadUsers]);

  function resetForm() {
    setDisplayName("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setRole("user");
    setFormError("");
    setFormLoading(false);
  }

  function handleCreateUser(e) {
    e.preventDefault();
    setFormError("");

    if (!displayName.trim() || !username.trim() || !password || !confirmPassword) {
      setFormError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    if (username.trim().toLowerCase() === "admin") {
      setFormError("Username already exists");
      return;
    }

    setFormLoading(true);

    try {
      const newUser = {
        id: generateId(),
        displayName: displayName.trim(),
        username: username.trim(),
        password: password,
        role: role,
        createdAt: new Date().toISOString(),
      };
      addUser(newUser);
      loadUsers();
      resetForm();
      setShowForm(false);
    } catch (err) {
      setFormError(err.message || "Failed to create user");
      setFormLoading(false);
    }
  }

  function handleDeleteRequest(userId) {
    setDeleteError("");
    // Prevent deleting hard-coded admin
    if (userId === "admin") {
      setDeleteError("Cannot delete the admin account");
      return;
    }
    // Prevent deleting own account
    if (session && (userId === session.userId)) {
      setDeleteError("Cannot delete your own account");
      return;
    }
    setDeleteTargetId(userId);
  }

  function handleDeleteConfirm() {
    if (!deleteTargetId) return;
    setDeleteError("");

    try {
      deleteUser(deleteTargetId);
      loadUsers();
      setDeleteTargetId(null);
    } catch (err) {
      setDeleteError(err.message || "Failed to delete user");
      setDeleteTargetId(null);
    }
  }

  function handleDeleteCancel() {
    setDeleteTargetId(null);
    setDeleteError("");
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

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      <Navbar session={session} />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50 sm:text-3xl">
              User Management
            </h1>
            <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
              Manage all registered users and their roles
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-white shadow-brand transition-all hover:bg-gradient-brand-hover hover:shadow-brand-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-surface-900"
          >
            {showForm ? "✕ Cancel" : "＋ Add User"}
          </button>
        </div>

        {/* Delete Error */}
        {deleteError && (
          <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300 animate-fade-in">
            {deleteError}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteTargetId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-brand-lg animate-fade-in dark:bg-surface-800">
              <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-50">
                Confirm Delete
              </h3>
              <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">
                Are you sure you want to delete this user? This action cannot be undone.
              </p>
              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleDeleteCancel}
                  className="rounded-lg border border-surface-300 bg-white px-4 py-2 text-sm font-medium text-surface-700 transition-colors hover:bg-surface-50 dark:border-surface-600 dark:bg-surface-700 dark:text-surface-300 dark:hover:bg-surface-600"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-surface-800"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create User Form */}
        {showForm && (
          <div className="mt-6 rounded-xl border border-surface-200 bg-white p-6 shadow-brand-sm animate-slide-down dark:border-surface-700 dark:bg-surface-800">
            <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-50">
              Create New User
            </h2>

            {formError && (
              <div className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="mt-4 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="create-displayName"
                    className="mb-1 block text-sm font-medium text-surface-700 dark:text-surface-300"
                  >
                    Display Name
                  </label>
                  <input
                    id="create-displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Full name"
                    className="w-full rounded-lg border border-surface-300 bg-white px-4 py-2.5 text-sm text-surface-900 placeholder-surface-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-surface-600 dark:bg-surface-700 dark:text-surface-50 dark:placeholder-surface-500 dark:focus:border-brand-400"
                  />
                </div>
                <div>
                  <label
                    htmlFor="create-username"
                    className="mb-1 block text-sm font-medium text-surface-700 dark:text-surface-300"
                  >
                    Username
                  </label>
                  <input
                    id="create-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    className="w-full rounded-lg border border-surface-300 bg-white px-4 py-2.5 text-sm text-surface-900 placeholder-surface-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-surface-600 dark:bg-surface-700 dark:text-surface-50 dark:placeholder-surface-500 dark:focus:border-brand-400"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="create-password"
                    className="mb-1 block text-sm font-medium text-surface-700 dark:text-surface-300"
                  >
                    Password
                  </label>
                  <input
                    id="create-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full rounded-lg border border-surface-300 bg-white px-4 py-2.5 text-sm text-surface-900 placeholder-surface-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-surface-600 dark:bg-surface-700 dark:text-surface-50 dark:placeholder-surface-500 dark:focus:border-brand-400"
                  />
                </div>
                <div>
                  <label
                    htmlFor="create-confirmPassword"
                    className="mb-1 block text-sm font-medium text-surface-700 dark:text-surface-300"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="create-confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full rounded-lg border border-surface-300 bg-white px-4 py-2.5 text-sm text-surface-900 placeholder-surface-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-surface-600 dark:bg-surface-700 dark:text-surface-50 dark:placeholder-surface-500 dark:focus:border-brand-400"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="create-role"
                  className="mb-1 block text-sm font-medium text-surface-700 dark:text-surface-300"
                >
                  Role
                </label>
                <select
                  id="create-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-lg border border-surface-300 bg-white px-4 py-2.5 text-sm text-surface-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-surface-600 dark:bg-surface-700 dark:text-surface-50 dark:focus:border-brand-400 sm:w-auto"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                  className="rounded-lg border border-surface-300 bg-white px-4 py-2 text-sm font-medium text-surface-700 transition-colors hover:bg-surface-50 dark:border-surface-600 dark:bg-surface-700 dark:text-surface-300 dark:hover:bg-surface-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="rounded-lg bg-gradient-brand px-5 py-2 text-sm font-semibold text-white shadow-brand-sm transition-all hover:bg-gradient-brand-hover hover:shadow-brand-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-surface-800"
                >
                  {formLoading ? "Creating…" : "Create User"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Users Count */}
        <div className="mt-6 mb-4">
          <p className="text-sm text-surface-500 dark:text-surface-400">
            Total users: <span className="font-semibold text-surface-700 dark:text-surface-300">{users.length}</span>
          </p>
        </div>

        {/* Users Table (Desktop) */}
        <div className="hidden md:block rounded-xl border border-surface-200 bg-white shadow-brand-sm dark:border-surface-700 dark:bg-surface-800">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-200 dark:border-surface-700">
                <th className="px-4 py-3 text-left text-sm font-semibold text-surface-700 dark:text-surface-300">
                  User
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-surface-700 dark:text-surface-300">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-surface-700 dark:text-surface-300">
                  Joined
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-surface-700 dark:text-surface-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <UserRow
                  key={user.id || user.userId || user.username}
                  user={user}
                  currentUserId={session?.userId}
                  onDelete={handleDeleteRequest}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Users Cards (Mobile) */}
        <div className="md:hidden space-y-3">
          {users.map((user) => (
            <UserRow
              key={user.id || user.userId || user.username}
              user={user}
              currentUserId={session?.userId}
              onDelete={handleDeleteRequest}
            />
          ))}
        </div>

        {/* Empty State */}
        {users.length === 0 && (
          <div className="mt-12 text-center animate-fade-in">
            <p className="text-lg text-surface-400 dark:text-surface-500">
              No users found.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default function UsersPage() {
  return (
    <ProtectedRoute adminOnly>
      <UsersPageContent />
    </ProtectedRoute>
  );
}