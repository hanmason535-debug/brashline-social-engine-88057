/**
 * Clerk Test Mocks
 * Provides mock implementations of Clerk hooks and components for testing
 */
import React, { ReactNode } from "react";
import { vi } from "vitest";

// Mock user data
export const mockClerkUser = {
  id: "user_test123",
  primaryEmailAddress: {
    emailAddress: "test@example.com",
  },
  firstName: "Test",
  lastName: "User",
  fullName: "Test User",
  imageUrl: "https://via.placeholder.com/150",
  createdAt: new Date("2024-01-01"),
  publicMetadata: {},
};

// Mock sign out function
export const mockSignOut = vi.fn();

// Mock get token function
export const mockGetToken = vi.fn().mockResolvedValue("mock-token-123");

// Create configurable mock state
let mockIsSignedIn = false;
let mockIsLoaded = true;

/**
 * Configure mock auth state for tests
 */
export const setMockAuthState = (config: {
  isSignedIn?: boolean;
  isLoaded?: boolean;
}) => {
  if (config.isSignedIn !== undefined) mockIsSignedIn = config.isSignedIn;
  if (config.isLoaded !== undefined) mockIsLoaded = config.isLoaded;
};

/**
 * Reset mock auth state to defaults
 */
export const resetMockAuthState = () => {
  mockIsSignedIn = false;
  mockIsLoaded = true;
  mockSignOut.mockClear();
  mockGetToken.mockClear();
};

/**
 * Clerk mock implementations
 */
export const clerkMocks = {
  // Hooks
  useUser: () => ({
    isSignedIn: mockIsSignedIn,
    user: mockIsSignedIn ? mockClerkUser : null,
    isLoaded: mockIsLoaded,
  }),

  useAuth: () => ({
    isSignedIn: mockIsSignedIn,
    isLoaded: mockIsLoaded,
    userId: mockIsSignedIn ? mockClerkUser.id : null,
    signOut: mockSignOut,
    getToken: mockGetToken,
  }),

  useClerk: () => ({
    signOut: mockSignOut,
    openSignIn: vi.fn(),
    openSignUp: vi.fn(),
    openUserProfile: vi.fn(),
  }),

  // Components
  ClerkProvider: ({ children }: { children: ReactNode }) => 
    React.createElement(React.Fragment, null, children),

  SignedIn: ({ children }: { children: ReactNode }) =>
    mockIsSignedIn ? React.createElement(React.Fragment, null, children) : null,

  SignedOut: ({ children }: { children: ReactNode }) =>
    !mockIsSignedIn ? React.createElement(React.Fragment, null, children) : null,

  SignInButton: ({ children, mode }: { children?: ReactNode; mode?: string }) =>
    React.createElement(
      "button",
      { "data-testid": "clerk-sign-in-button", "data-mode": mode },
      children || "Sign In"
    ),

  SignUpButton: ({ children, mode }: { children?: ReactNode; mode?: string }) =>
    React.createElement(
      "button",
      { "data-testid": "clerk-sign-up-button", "data-mode": mode },
      children || "Sign Up"
    ),

  UserButton: ({ afterSignOutUrl }: { afterSignOutUrl?: string }) =>
    React.createElement("div", {
      "data-testid": "clerk-user-button",
      "data-after-sign-out-url": afterSignOutUrl,
    }),

  SignIn: ({ routing, path, signUpUrl, forceRedirectUrl }: {
    routing?: string;
    path?: string;
    signUpUrl?: string;
    forceRedirectUrl?: string;
  }) =>
    React.createElement("div", {
      "data-testid": "clerk-sign-in",
      "data-routing": routing,
      "data-path": path,
      "data-sign-up-url": signUpUrl,
      "data-force-redirect-url": forceRedirectUrl,
    }),

  SignUp: ({ routing, path, signInUrl, forceRedirectUrl }: {
    routing?: string;
    path?: string;
    signInUrl?: string;
    forceRedirectUrl?: string;
  }) =>
    React.createElement("div", {
      "data-testid": "clerk-sign-up",
      "data-routing": routing,
      "data-path": path,
      "data-sign-in-url": signInUrl,
      "data-force-redirect-url": forceRedirectUrl,
    }),

  UserProfile: ({ routing, path }: { routing?: string; path?: string }) =>
    React.createElement("div", {
      "data-testid": "clerk-user-profile",
      "data-routing": routing,
      "data-path": path,
    }),

  RedirectToSignIn: ({ redirectUrl }: { redirectUrl?: string }) =>
    React.createElement("div", {
      "data-testid": "clerk-redirect-to-sign-in",
      "data-redirect-url": redirectUrl,
    }),
};

/**
 * Default export for vi.mock usage
 */
export default clerkMocks;
