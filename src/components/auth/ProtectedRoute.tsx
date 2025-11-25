/**
 * Protected Route Component
 * Wraps content that requires authentication
 */
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from "@clerk/clerk-react";
import { ReactNode } from "react";
import { AuthLoadingPage } from "./AuthLoading";

interface ProtectedRouteProps {
  children: ReactNode;
  redirectUrl?: string;
}

/**
 * Protected route wrapper
 * Redirects to sign-in if user is not authenticated
 */
export function ProtectedRoute({ children, redirectUrl }: ProtectedRouteProps) {
  const { isLoaded } = useUser();

  // Show loading while Clerk is initializing
  if (!isLoaded) {
    return <AuthLoadingPage />;
  }

  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn redirectUrl={redirectUrl} />
      </SignedOut>
    </>
  );
}

/**
 * Shows content only when user is signed in
 * Does not redirect - just hides content
 */
export function AuthenticatedOnly({ children }: { children: ReactNode }) {
  return <SignedIn>{children}</SignedIn>;
}

/**
 * Shows content only when user is signed out
 */
export function UnauthenticatedOnly({ children }: { children: ReactNode }) {
  return <SignedOut>{children}</SignedOut>;
}
