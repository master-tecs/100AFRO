/**
 * Permission checking utilities for role-based access control
 */

export type UserRole = "USER" | "AUTHOR" | "ADMIN";

export interface User {
  id: string;
  role: UserRole;
}

/**
 * Check if user can manage users (admin only)
 */
export function canManageUsers(user: User | null): boolean {
  return user?.role === "ADMIN";
}

/**
 * Check if user can edit a specific article
 */
export function canEditArticle(user: User | null, articleAuthorId: string): boolean {
  if (!user) return false;
  if (user.role === "ADMIN") return true;
  if (user.role === "AUTHOR" && user.id === articleAuthorId) return true;
  return false;
}

/**
 * Check if user can delete an article
 */
export function canDeleteArticle(user: User | null, articleAuthorId: string): boolean {
  if (!user) return false;
  if (user.role === "ADMIN") return true;
  // Authors can only delete their own drafts
  if (user.role === "AUTHOR" && user.id === articleAuthorId) return true;
  return false;
}

/**
 * Check if user can create articles
 */
export function canCreateArticle(user: User | null): boolean {
  if (!user) return false;
  return user.role === "ADMIN" || user.role === "AUTHOR";
}

/**
 * Check if user can access admin dashboard
 */
export function canAccessAdminDashboard(user: User | null): boolean {
  return user?.role === "ADMIN";
}

/**
 * Check if user can access editor dashboard
 */
export function canAccessEditorDashboard(user: User | null): boolean {
  if (!user) return false;
  return user.role === "ADMIN" || user.role === "AUTHOR";
}

/**
 * Check if user can upload images
 */
export function canUploadImages(user: User | null): boolean {
  if (!user) return false;
  return user.role === "ADMIN" || user.role === "AUTHOR";
}
