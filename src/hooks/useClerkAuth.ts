/**
 * Custom Authentication Hook
 * Wraps Clerk hooks to provide a unified auth interface
 */
import { useUser, useAuth as useClerkAuth, useClerk } from "@clerk/clerk-react";

export interface AuthUser {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  imageUrl: string;
  createdAt: Date | null;
}

export function useAuth() {
  const { isSignedIn, user, isLoaded } = useUser();
  const { signOut, getToken } = useClerkAuth();
  const { openSignIn, openSignUp, openUserProfile } = useClerk();

  // Transform Clerk user to our app's user format
  const appUser: AuthUser | null = user
    ? {
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress || null,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        imageUrl: user.imageUrl,
        createdAt: user.createdAt,
      }
    : null;

  return {
    // Auth state
    isSignedIn: isSignedIn ?? false,
    isLoaded,
    user: appUser,
    
    // Auth actions
    signOut,
    getToken,
    
    // Clerk UI helpers
    openSignIn,
    openSignUp,
    openUserProfile,
  };
}

/**
 * Hook to get auth token for API calls
 */
export function useAuthToken() {
  const { getToken } = useClerkAuth();
  
  const getAuthHeaders = async () => {
    const token = await getToken();
    return token
      ? { Authorization: `Bearer ${token}` }
      : {};
  };

  return { getToken, getAuthHeaders };
}

/**
 * Hook to check if user has required role/permission
 * Placeholder for future role-based access control
 */
export function useAuthRole() {
  const { user, isLoaded } = useUser();
  
  const hasRole = (role: string): boolean => {
    if (!user) return false;
    // Check public metadata for roles
    const roles = (user.publicMetadata?.roles as string[]) || [];
    return roles.includes(role);
  };

  const isAdmin = (): boolean => hasRole("admin");
  
  return {
    isLoaded,
    hasRole,
    isAdmin,
  };
}
