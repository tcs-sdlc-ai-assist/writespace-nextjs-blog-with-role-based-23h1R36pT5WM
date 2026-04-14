/**
 * auth.js
 * Authentication and session management helpers.
 * Manages the writespace_session localStorage key.
 * Hard-coded admin credentials: username "admin", password "admin".
 */

import { getUsers, addUser } from './storage';

const SESSION_KEY = 'writespace_session';

/**
 * Safely read and parse a localStorage key.
 * @param {string} key
 * @returns {any|null}
 */
function readStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Safely write a value to localStorage.
 * @param {string} key
 * @param {any} value
 */
function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    throw new Error('localStorage unavailable');
  }
}

/**
 * Get the current session from localStorage.
 * @returns {{ userId: string, username: string, displayName: string, role: string } | null}
 */
export function getSession() {
  if (typeof window === 'undefined') return null;
  const session = readStorage(SESSION_KEY);
  if (!session || !session.userId || !session.username) return null;
  return session;
}

/**
 * Write a session object to localStorage.
 * @param {{ userId: string, username: string, displayName: string, role: string }} session
 */
export function setSession(session) {
  if (typeof window === 'undefined') return;
  writeStorage(SESSION_KEY, session);
}

/**
 * Log in a user with username and password.
 * Supports hard-coded admin credentials (admin/admin).
 * @param {string} username
 * @param {string} password
 * @returns {{ userId: string, username: string, displayName: string, role: string }}
 * @throws {Error} If credentials are invalid or fields are missing
 */
export function login(username, password) {
  if (!username || !password) {
    throw new Error('All fields required');
  }

  // Hard-coded admin check
  if (username === 'admin' && password === 'admin') {
    const adminSession = {
      userId: 'admin',
      username: 'admin',
      displayName: 'Carol Davis',
      role: 'admin',
    };
    setSession(adminSession);
    return adminSession;
  }

  const users = getUsers();
  const user = users.find((u) => u.username === username && u.password === password);

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const session = {
    userId: user.id,
    username: user.username,
    displayName: user.displayName,
    role: user.role || 'user',
  };
  setSession(session);
  return session;
}

/**
 * Register a new user and log them in.
 * @param {{ displayName: string, username: string, password: string, confirmPassword: string }} userData
 * @returns {{ userId: string, username: string, displayName: string, role: string }}
 * @throws {Error} If validation fails or username is taken
 */
export function register(userData) {
  if (!userData || !userData.displayName || !userData.username || !userData.password) {
    throw new Error('All fields required');
  }

  if (userData.password !== userData.confirmPassword) {
    throw new Error('Passwords do not match');
  }

  // addUser will throw if username already exists or is 'admin'
  const newUser = {
    displayName: userData.displayName,
    username: userData.username,
    password: userData.password,
    role: 'user',
    createdAt: new Date().toISOString(),
  };

  addUser(newUser);

  // Retrieve the created user to get the generated ID
  const users = getUsers();
  const created = users.find((u) => u.username === userData.username);

  const session = {
    userId: created ? created.id : userData.username,
    username: userData.username,
    displayName: userData.displayName,
    role: 'user',
  };
  setSession(session);
  return session;
}

/**
 * Log out the current user by clearing the session.
 */
export function logout() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

/**
 * Check if there is an active authenticated session.
 * @returns {boolean}
 */
export function isAuthenticated() {
  return getSession() !== null;
}

/**
 * Check if the current session user is an admin.
 * @returns {boolean}
 */
export function isAdmin() {
  const session = getSession();
  if (!session) return false;
  return session.role === 'admin';
}