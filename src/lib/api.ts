/**
 * API Client with Clerk Authentication
 * Provides authenticated API calls with proper headers
 */

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface ApiRequestOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
}

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

/**
 * Base API URL - can be configured via environment variable
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || "";

/**
 * Creates an authenticated API client
 * @param getToken - Function to get the auth token from Clerk
 */
export function createApiClient(getToken: () => Promise<string | null>) {
  async function request<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { method = "GET", body, headers = {} } = options;

    try {
      // Get auth token
      const token = await getToken();

      const requestHeaders: Record<string, string> = {
        "Content-Type": "application/json",
        ...headers,
      };

      // Add auth header if token exists
      if (token) {
        requestHeaders["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        return {
          data: null,
          error: data?.message || `Request failed with status ${response.status}`,
          status: response.status,
        };
      }

      return {
        data,
        error: null,
        status: response.status,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : "Network error",
        status: 0,
      };
    }
  }

  return {
    get: <T>(endpoint: string, options?: Omit<ApiRequestOptions, "method" | "body">) =>
      request<T>(endpoint, { ...options, method: "GET" }),

    post: <T>(endpoint: string, body?: unknown, options?: Omit<ApiRequestOptions, "method">) =>
      request<T>(endpoint, { ...options, method: "POST", body }),

    put: <T>(endpoint: string, body?: unknown, options?: Omit<ApiRequestOptions, "method">) =>
      request<T>(endpoint, { ...options, method: "PUT", body }),

    patch: <T>(endpoint: string, body?: unknown, options?: Omit<ApiRequestOptions, "method">) =>
      request<T>(endpoint, { ...options, method: "PATCH", body }),

    delete: <T>(endpoint: string, options?: Omit<ApiRequestOptions, "method" | "body">) =>
      request<T>(endpoint, { ...options, method: "DELETE" }),
  };
}

/**
 * Hook to create an authenticated API client
 * Usage:
 * ```tsx
 * import { useAuth } from '@clerk/clerk-react';
 * import { createApiClient } from '@/lib/api';
 *
 * function MyComponent() {
 *   const { getToken } = useAuth();
 *   const api = createApiClient(getToken);
 *
 *   const fetchData = async () => {
 *     const { data, error } = await api.get('/api/data');
 *     if (error) {
 *       console.error(error);
 *       return;
 *     }
 *     // Use data
 *   };
 * }
 * ```
 */
export { createApiClient as useApiClient };
