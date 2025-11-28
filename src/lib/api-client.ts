/**
 * API Client for Brashline Backend
 * Handles API requests with Clerk authentication
 */

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface ContactSubmissionData {
  id: string;
  createdAt: string;
  message: string;
}

// Newsletter subscription input type
export interface NewsletterSubscribeInput {
  email: string;
  name?: string;
  source?: string;
  metadata?: Record<string, unknown>;
}

export interface NewsletterSubscriptionData {
  id?: string;
  message: string;
  status: "subscribed" | "reactivated" | "existing" | "unsubscribed" | "already_unsubscribed";
  subscribedAt?: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  company?: string;
  message: string;
  status: "new" | "read" | "replied" | "archived";
  createdAt: string;
  user?: {
    id: string;
    firstName?: string;
    lastName?: string;
    imageUrl?: string;
  };
}

export interface PaginatedResponse<T> {
  submissions?: T[];
  subscribers?: T[];
  users?: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UserProfile {
  id: string;
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  metadata?: Record<string, unknown>;
  preferences: {
    theme: "light" | "dark" | "system";
    language: "en" | "es";
    emailNotifications: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

// Get API base URL
const getApiUrl = (): string => {
  // In production (Vercel), use relative URLs for same-origin API calls
  // In development, use the full URL from env variable
  const apiUrl = import.meta.env.VITE_API_URL;
  if (!apiUrl) {
    return ""; // Empty string for relative URLs in production
  }
  return apiUrl;
};

// Create API client
class ApiClient {
  private baseUrl: string;
  private getToken: (() => Promise<string | null>) | null = null;

  constructor() {
    this.baseUrl = getApiUrl();
  }

  /**
   * Set the token getter function (from Clerk)
   */
  setTokenGetter(getter: () => Promise<string | null>): void {
    this.getToken = getter;
  }

  /**
   * Make an API request
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    // Add auth token if available
    if (this.getToken) {
      const token = await this.getToken();
      if (token) {
        (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
      }
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || {
            code: "REQUEST_FAILED",
            message: `Request failed with status ${response.status}`,
          },
        };
      }

      return data as ApiResponse<T>;
    } catch (error) {
      return {
        success: false,
        error: {
          code: "NETWORK_ERROR",
          message: error instanceof Error ? error.message : "Network error occurred",
        },
      };
    }
  }

  // Health check
  async health(): Promise<ApiResponse<{ status: string; database: string }>> {
    return this.request("/health");
  }

  // Contact form
  async submitContact(data: {
    name: string;
    email: string;
    company?: string;
    phone?: string;
    serviceType?: string;
    message: string;
    source?: string;
    metadata?: Record<string, unknown>;
  }): Promise<ApiResponse<ContactSubmissionData>> {
    return this.request("/api/contact", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getContactSubmissions(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<ApiResponse<PaginatedResponse<ContactSubmission>>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.status) searchParams.set("status", params.status);
    
    const query = searchParams.toString();
    return this.request(`/api/contact${query ? `?${query}` : ""}`);
  }

  async updateContactStatus(
    id: string,
    status: string
  ): Promise<ApiResponse<{ id: string; status: string }>> {
    return this.request(`/api/contact/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  // Newsletter
  async subscribeNewsletter(data: NewsletterSubscribeInput): Promise<ApiResponse<NewsletterSubscriptionData>> {
    return this.request("/api/newsletter/subscribe", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async unsubscribeNewsletter(email: string): Promise<ApiResponse<NewsletterSubscriptionData>> {
    return this.request("/api/newsletter/unsubscribe", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  // User profile
  async getCurrentUser(): Promise<ApiResponse<UserProfile>> {
    return this.request("/api/auth/me");
  }

  async updatePreferences(preferences: {
    theme?: string;
    language?: string;
    emailNotifications?: boolean;
  }): Promise<ApiResponse<{ theme: string; language: string; emailNotifications: boolean }>> {
    return this.request("/api/auth/me/preferences", {
      method: "PATCH",
      body: JSON.stringify(preferences),
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export type for use in hooks
export type { ApiClient };
