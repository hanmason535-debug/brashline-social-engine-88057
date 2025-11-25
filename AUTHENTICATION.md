# Authentication Guide

This guide explains how authentication works in the Brashline Social Engine application using [Clerk](https://clerk.com).

## Overview

Brashline uses Clerk for authentication, providing:
- 🔐 Secure sign-in and sign-up flows
- 👤 User profile management
- 🔄 Social login providers (Google, GitHub, etc.)
- 📱 Mobile-responsive authentication UI
- 🌐 Multi-language support (English/Spanish)
- 🌙 Dark mode compatibility

## Getting Started

### 1. Set Up Environment Variables

Create a `.env` file in the project root:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
```

Get your publishable key from [Clerk Dashboard](https://dashboard.clerk.com):
1. Sign in to Clerk Dashboard
2. Select your application (or create one)
3. Go to **API Keys**
4. Copy the **Publishable key**

### 2. Install Dependencies

The Clerk SDK is already installed. If you need to reinstall:

```bash
npm install @clerk/clerk-react
```

### 3. Run the Application

```bash
npm run dev
```

## Authentication Routes

| Route | Description | Access |
|-------|-------------|--------|
| `/sign-in` | Sign-in page | Public |
| `/sign-up` | Sign-up page | Public |
| `/dashboard` | User dashboard | Protected |
| `/profile` | User profile settings | Protected |

## Using Authentication in Components

### Check if User is Signed In

```tsx
import { useUser } from "@clerk/clerk-react";

function MyComponent() {
  const { isSignedIn, user, isLoaded } = useUser();

  if (!isLoaded) {
    return <LoadingSpinner />;
  }

  if (!isSignedIn) {
    return <p>Please sign in</p>;
  }

  return <p>Hello, {user.firstName}!</p>;
}
```

### Protect a Route

```tsx
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

function ProtectedPage() {
  return (
    <>
      <SignedIn>
        {/* Protected content */}
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
```

### Use Custom Auth Hook

```tsx
import { useAuth } from "@/hooks/useClerkAuth";

function MyComponent() {
  const { isSignedIn, user, signOut } = useAuth();

  return (
    <div>
      {isSignedIn ? (
        <button onClick={() => signOut()}>Sign Out</button>
      ) : (
        <p>Not signed in</p>
      )}
    </div>
  );
}
```

### Show Auth Buttons

```tsx
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

function AuthButtons() {
  return (
    <>
      <SignedOut>
        <SignInButton mode="modal">
          <button>Sign In</button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </>
  );
}
```

## Making Authenticated API Calls

```tsx
import { useAuth } from "@clerk/clerk-react";
import { createApiClient } from "@/lib/api";

function MyComponent() {
  const { getToken } = useAuth();
  const api = createApiClient(getToken);

  const fetchData = async () => {
    const { data, error } = await api.get("/api/protected-endpoint");
    if (error) {
      console.error(error);
      return;
    }
    // Use data
  };
}
```

## Components

### Auth Loading States

```tsx
import { AuthLoading, AuthLoadingPage } from "@/components/auth";

// Inline loading
<AuthLoading fallback={<CustomLoader />}>
  <ProtectedContent />
</AuthLoading>

// Full page loading
<AuthLoadingPage />
```

### Protected Route Wrapper

```tsx
import { ProtectedRoute } from "@/components/auth";

<ProtectedRoute>
  <DashboardContent />
</ProtectedRoute>
```

## Theming

Clerk components automatically match the application's theme (light/dark mode). Custom theme configuration is in `src/lib/clerk-theme.ts`.

To customize:

```tsx
// src/lib/clerk-theme.ts
export const clerkAppearance = {
  variables: {
    colorPrimary: "hsl(var(--primary))",
    colorBackground: "hsl(var(--background))",
    // ... more variables
  },
  elements: {
    // Custom element styles
  },
};
```

## Testing

### Unit Tests

Clerk is mocked in tests. Use the mock helpers:

```tsx
import { setMockAuthState, resetMockAuthState } from "@/tests/mocks/clerk";

beforeEach(() => {
  resetMockAuthState();
});

it("shows content for authenticated users", () => {
  setMockAuthState({ isSignedIn: true });
  // ... test authenticated state
});
```

### E2E Tests

E2E tests are in `e2e/auth.spec.ts`. Run them:

```bash
npm run test:e2e
```

## Security Considerations

1. **Never expose secret keys** - Only use the publishable key in frontend code
2. **Use HTTPS** - Always serve the app over HTTPS in production
3. **Validate tokens server-side** - If you have a backend, validate Clerk tokens
4. **Review Clerk security settings** - Configure session timeout, MFA, etc. in Clerk Dashboard

## Troubleshooting

### "Missing Clerk Publishable Key" Error

Make sure your `.env` file exists and contains:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
```

Restart the dev server after adding the key.

### Sign-in Not Working

1. Check Clerk Dashboard for any configuration issues
2. Verify the publishable key is correct
3. Check browser console for errors
4. Ensure your Clerk application has the correct allowed origins

### Redirect Issues

Configure redirect URLs in Clerk Dashboard:
- **Allowed redirect URLs**: Add your app's URLs
- **After sign-in URL**: `/dashboard`
- **After sign-up URL**: `/dashboard`

## Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk React SDK](https://clerk.com/docs/quickstarts/react)
- [Clerk Dashboard](https://dashboard.clerk.com)
- [Clerk Components](https://clerk.com/docs/components/overview)

## Support

For issues with Clerk integration:
1. Check [Clerk Status Page](https://status.clerk.com)
2. Review [Clerk Documentation](https://clerk.com/docs)
3. Open an issue in this repository

---

Last updated: November 2025
