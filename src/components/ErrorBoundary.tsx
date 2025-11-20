/**
 * File overview: src/components/ErrorBoundary.tsx
 *
 * React component `ErrorBoundary` rendering a focused piece of UI.
 * Behavior:
 * - Receives props from parents and may read from hooks or context.
 * - Renders presentational markup and wires callbacks for user interaction.
 * Data flow:
 * - Follows a one-way data flow: parents own data, this component focuses on display.
 * Performance:
 * - Avoid expensive work during render and prefer memoized helpers for heavy subtrees.
 */
import React, { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details to console and external service (Sentry)
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    const maybeWindow = window as unknown as {
      Sentry?: { captureException?: (err: unknown, ctx?: unknown) => void };
    };
    if (maybeWindow.Sentry && typeof maybeWindow.Sentry.captureException === "function") {
      maybeWindow.Sentry.captureException(error, { contexts: { react: errorInfo } });
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-background">
          <div className="text-center max-w-md px-4">
            <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Oops! Something went wrong</h1>
            <p className="text-muted-foreground mb-4">
              We encountered an unexpected error. Please try refreshing the page or contact support
              if the problem persists.
            </p>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-4 p-4 bg-muted rounded text-left text-sm">
                <summary className="cursor-pointer font-mono font-bold mb-2">Error Details</summary>
                <pre className="overflow-auto text-xs">{this.state.error.toString()}</pre>
              </details>
            )}
            <div className="flex gap-2 justify-center mt-6">
              <Button onClick={this.handleReset} className="primary">
                Try Again
              </Button>
              <Button onClick={() => (window.location.href = "/")} variant="outline">
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
