/**
 * Auth Loading Component
 * Shows loading state while Clerk is initializing
 */
import { useUser } from "@clerk/clerk-react";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

interface AuthLoadingProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Default loading fallback with spinner
 */
function DefaultLoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

/**
 * Full page loading state
 */
export function AuthLoadingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

/**
 * Auth loading wrapper
 * Shows children only after Clerk has finished loading
 */
export function AuthLoading({ children, fallback }: AuthLoadingProps) {
  const { isLoaded } = useUser();

  if (!isLoaded) {
    return <>{fallback || <DefaultLoadingFallback />}</>;
  }

  return <>{children}</>;
}

/**
 * Skeleton loader for user info
 */
export function UserSkeleton() {
  return (
    <div className="flex items-center gap-3 animate-pulse">
      <div className="w-10 h-10 bg-muted rounded-full" />
      <div className="space-y-2">
        <div className="h-4 w-24 bg-muted rounded" />
        <div className="h-3 w-32 bg-muted rounded" />
      </div>
    </div>
  );
}

/**
 * Skeleton loader for auth buttons
 */
export function AuthButtonsSkeleton() {
  return (
    <div className="flex items-center gap-2 animate-pulse">
      <div className="h-9 w-20 bg-muted rounded" />
    </div>
  );
}
