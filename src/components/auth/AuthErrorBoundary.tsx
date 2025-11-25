/**
 * Auth Error Boundary
 * Catches and handles authentication-related errors gracefully
 */
import React, { Component, ReactNode, ErrorInfo } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home, LogIn } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class AuthErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error for debugging
    console.error("Auth Error Boundary caught an error:", error);
    console.error("Error Info:", errorInfo);

    // Store error info for display
    this.setState({ errorInfo });

    // Report to error tracking service if available
    const maybeWindow = window as unknown as {
      Sentry?: { captureException?: (err: unknown, ctx?: unknown) => void };
    };
    if (maybeWindow.Sentry && typeof maybeWindow.Sentry.captureException === "function") {
      maybeWindow.Sentry.captureException(error, {
        contexts: {
          react: errorInfo,
          auth: { component: "AuthErrorBoundary" },
        },
      });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  handleSignIn = () => {
    window.location.href = "/sign-in";
  };

  render() {
    if (this.state.hasError) {
      // Check if this is an auth-specific error
      const isAuthError =
        this.state.error?.message?.toLowerCase().includes("clerk") ||
        this.state.error?.message?.toLowerCase().includes("auth") ||
        this.state.error?.message?.toLowerCase().includes("sign");

      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center min-h-[400px] p-8">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-2">
              {isAuthError ? "Authentication Error" : "Something went wrong"}
            </h2>

            <p className="text-muted-foreground mb-6">
              {isAuthError
                ? "There was a problem with authentication. Please try signing in again."
                : "An unexpected error occurred. Please try again."}
            </p>

            {import.meta.env.DEV && this.state.error && (
              <details className="mb-6 p-4 bg-muted rounded-lg text-left text-sm">
                <summary className="cursor-pointer font-mono font-medium mb-2">
                  Error Details
                </summary>
                <pre className="overflow-auto text-xs text-destructive whitespace-pre-wrap">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack && (
                    <>
                      {"\n\nComponent Stack:"}
                      {this.state.errorInfo.componentStack}
                    </>
                  )}
                </pre>
              </details>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={this.handleRetry} variant="default">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>

              {isAuthError && (
                <Button onClick={this.handleSignIn} variant="outline">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              )}

              <Button onClick={this.handleGoHome} variant="ghost">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AuthErrorBoundary;
