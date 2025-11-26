/**
 * Contact Form API hooks
 * Uses React Query for data fetching and mutations
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { apiClient, ContactSubmission, PaginatedResponse } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";

// Set up auth token getter when hook is used
export const useApiSetup = () => {
  const { getToken } = useAuth();
  
  useEffect(() => {
    apiClient.setTokenGetter(async () => {
      try {
        return await getToken();
      } catch {
        return null;
      }
    });
  }, [getToken]);
};

// Contact form submission hook
export const useContactForm = () => {
  const { toast } = useToast();
  useApiSetup();
  
  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      company?: string;
      message: string;
    }) => {
      const response = await apiClient.submitContact(data);
      if (!response.success) {
        throw new Error(response.error?.message || "Failed to submit contact form");
      }
      return response.data;
    },
    onSuccess: (data) => {
      toast({
        title: "Message Sent!",
        description: data?.message || "Thank you for contacting us. We'll get back to you soon!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });
};

// Get contact submissions (admin)
export const useContactSubmissions = (params?: {
  page?: number;
  limit?: number;
  status?: string;
}) => {
  useApiSetup();
  
  return useQuery({
    queryKey: ["contactSubmissions", params],
    queryFn: async () => {
      const response = await apiClient.getContactSubmissions(params);
      if (!response.success) {
        throw new Error(response.error?.message || "Failed to fetch submissions");
      }
      return response.data as PaginatedResponse<ContactSubmission>;
    },
    staleTime: 30000, // Consider data fresh for 30 seconds
  });
};

// Update contact status (admin)
export const useUpdateContactStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  useApiSetup();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiClient.updateContactStatus(id, status);
      if (!response.success) {
        throw new Error(response.error?.message || "Failed to update status");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contactSubmissions"] });
      toast({
        title: "Status Updated",
        description: "Contact submission status has been updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update status.",
        variant: "destructive",
      });
    },
  });
};
