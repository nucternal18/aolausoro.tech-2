/**
 * @description an array of public routes that do not require authentication
 * @type {string[]}
 */
export const publicRoutes: string[] = [
  "/",
  "/about",
  "/contact",
  "/portfolio",
  "/blog",
  "/blog/[slug]",
  "/api/projects",
  "/api/contact/send-mail",
  "/api/contact/create-message",
];

/**
 * @description an array of routes that are used for authentication.
 * @description these routes will redirect logged in users to the admin dashboard
 * @type {string[]}
 */
export const authRoutes: string[] = ["/auth/login"];

/**
 * @description an array of routes that require authentication
 * @type {string[]}
 */
export const privateRoutes: string[] = [
  "/auth/user-profile",
  "/auth/logout",
  "/admin",
  "/admin/jobs",
  "/admin/jobs/[id]",
  "/admin/messages",
  "/admin/projects",
  "/admin/projects/[id]",
  "/api/jobs/stats",
];

/**
 * @description The prefix for the API authentication routes
 * @description routes that start with this prefix are used for API authentication purposes
 * @type {string[]}
 */
export const apiAuthPrefix: string = "/api/auth";

/**
 * @description The default redirect path after a successful login
 */
export const DEFAULT_LOGIN_REDIRECT_URL: string = "/admin";
