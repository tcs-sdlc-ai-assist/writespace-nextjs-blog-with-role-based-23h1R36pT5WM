/**
 * storage.js
 * Data persistence layer using localStorage.
 * Manages writespace_users and writespace_posts keys.
 * Hard-coded admin (Carol Davis) is never stored in localStorage.
 */

const USERS_KEY = 'writespace_users';
const POSTS_KEY = 'writespace_posts';

/**
 * Generate a simple UUID v4-like string.
 * @returns {string}
 */
function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

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
 * Get all users from localStorage.
 * @returns {Array<Object>}
 */
export function getUsers() {
  const users = readStorage(USERS_KEY);
  if (!Array.isArray(users)) return [];
  return users;
}

/**
 * Get a single user by ID.
 * @param {string} id
 * @returns {Object|null}
 */
export function getUserById(id) {
  if (!id) return null;
  const users = getUsers();
  return users.find((u) => u.id === id) || null;
}

/**
 * Add a new user to localStorage.
 * Validates uniqueness of username.
 * @param {Object} user
 */
export function addUser(user) {
  if (!user || !user.username) {
    throw new Error('All fields required');
  }
  const users = getUsers();
  if (users.some((u) => u.username === user.username)) {
    throw new Error('Username already exists');
  }
  if (user.username === 'admin') {
    throw new Error('Username already exists');
  }
  const newUser = {
    id: user.id || generateId(),
    displayName: user.displayName,
    username: user.username,
    password: user.password,
    role: user.role || 'user',
    createdAt: user.createdAt || new Date().toISOString(),
  };
  users.push(newUser);
  writeStorage(USERS_KEY, users);
}

/**
 * Delete a user by ID from localStorage.
 * @param {string} id
 */
export function deleteUser(id) {
  if (!id) throw new Error('User ID required');
  const users = getUsers();
  const filtered = users.filter((u) => u.id !== id);
  if (filtered.length === users.length) {
    throw new Error('User not found');
  }
  writeStorage(USERS_KEY, filtered);
}

/**
 * Get all posts from localStorage.
 * @returns {Array<Object>}
 */
export function getPosts() {
  const posts = readStorage(POSTS_KEY);
  if (!Array.isArray(posts)) return [];
  return posts;
}

/**
 * Get a single post by ID.
 * @param {string} id
 * @returns {Object|null}
 */
export function getPostById(id) {
  if (!id) return null;
  const posts = getPosts();
  return posts.find((p) => p.id === id) || null;
}

/**
 * Add a new post to localStorage.
 * @param {Object} post
 */
export function addPost(post) {
  if (!post || !post.title || !post.content) {
    throw new Error('Post title and content are required');
  }
  const posts = getPosts();
  const newPost = {
    id: post.id || generateId(),
    title: post.title,
    content: post.content,
    createdAt: post.createdAt || new Date().toISOString(),
    authorId: post.authorId,
    authorName: post.authorName,
  };
  posts.push(newPost);
  writeStorage(POSTS_KEY, posts);
}

/**
 * Update an existing post in localStorage.
 * @param {Object} post - Must include id, title, content
 */
export function updatePost(post) {
  if (!post || !post.id) {
    throw new Error('Post ID required');
  }
  if (!post.title || !post.content) {
    throw new Error('Post title and content are required');
  }
  const posts = getPosts();
  const index = posts.findIndex((p) => p.id === post.id);
  if (index === -1) {
    throw new Error('Post not found');
  }
  posts[index] = {
    ...posts[index],
    title: post.title,
    content: post.content,
  };
  writeStorage(POSTS_KEY, posts);
}

/**
 * Delete a post by ID from localStorage.
 * @param {string} id
 */
export function deletePost(id) {
  if (!id) throw new Error('Post ID required');
  const posts = getPosts();
  const filtered = posts.filter((p) => p.id !== id);
  if (filtered.length === posts.length) {
    throw new Error('Post not found');
  }
  writeStorage(POSTS_KEY, filtered);
}

/**
 * Seed initial data into localStorage if not already present.
 * Creates dummy users and sample posts. Admin is never stored.
 */
export function seedData() {
  if (typeof window === 'undefined') return;

  try {
    if (!localStorage.getItem(USERS_KEY)) {
      const seedUsers = [
        {
          id: 'user-alice-001',
          displayName: 'Alice Johnson',
          username: 'alice',
          password: 'password',
          role: 'user',
          createdAt: '2024-06-01T12:00:00Z',
        },
        {
          id: 'user-bob-002',
          displayName: 'Bob Smith',
          username: 'bob',
          password: 'password',
          role: 'user',
          createdAt: '2024-06-02T09:30:00Z',
        },
        {
          id: 'user-carol-003',
          displayName: 'Carol Davis',
          username: 'carol',
          password: 'password',
          role: 'user',
          createdAt: '2024-06-03T15:45:00Z',
        },
      ];
      writeStorage(USERS_KEY, seedUsers);
    }

    if (!localStorage.getItem(POSTS_KEY)) {
      const seedPosts = [
        {
          id: 'post-001',
          title: 'Getting Started with Next.js',
          content:
            'Next.js is a powerful React framework that makes building web applications a breeze. In this post, we explore the basics of setting up a Next.js project and creating your first pages.',
          createdAt: '2024-06-05T10:00:00Z',
          authorId: 'user-alice-001',
          authorName: 'Alice Johnson',
        },
        {
          id: 'post-002',
          title: 'Understanding Tailwind CSS',
          content:
            'Tailwind CSS is a utility-first CSS framework that allows you to build modern designs without leaving your HTML. Learn how to leverage its powerful class system for rapid UI development.',
          createdAt: '2024-06-06T14:30:00Z',
          authorId: 'user-bob-002',
          authorName: 'Bob Smith',
        },
        {
          id: 'post-003',
          title: 'JavaScript Best Practices in 2024',
          content:
            'Stay up to date with the latest JavaScript best practices. From modern ES modules to async/await patterns, this guide covers everything you need to write clean and maintainable code.',
          createdAt: '2024-06-07T08:15:00Z',
          authorId: 'user-alice-001',
          authorName: 'Alice Johnson',
        },
        {
          id: 'post-004',
          title: 'Building Accessible Web Applications',
          content:
            'Accessibility is not optional. Learn how to build web applications that are usable by everyone, including people with disabilities. We cover ARIA roles, semantic HTML, and keyboard navigation.',
          createdAt: '2024-06-08T11:45:00Z',
          authorId: 'user-carol-003',
          authorName: 'Carol Davis',
        },
        {
          id: 'post-005',
          title: 'The Power of localStorage',
          content:
            'localStorage provides a simple way to persist data in the browser. In this post, we explore its API, limitations, and best practices for using it in modern web applications.',
          createdAt: '2024-06-09T16:00:00Z',
          authorId: 'user-bob-002',
          authorName: 'Bob Smith',
        },
      ];
      writeStorage(POSTS_KEY, seedPosts);
    }
  } catch {
    // Silently fail if localStorage is unavailable during SSR or in restricted environments
  }
}