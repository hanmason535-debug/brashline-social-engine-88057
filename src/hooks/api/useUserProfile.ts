/**
 * User Profile API hooks
 * Uses React Query for user data fetching and preferences updates
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, UserProfile } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { useApiSetup } from "./useContactForm";

// Get current user profile
export const useUserProfile = () => {
  useApiSetup();
  
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const response = await apiClient.getCurrentUser();
      if (!response.success) {
        throw new Error(response.error?.message || "Failed to fetch profile");
      }
      return response.data as UserProfile;
    },
    staleTime: 60000, // Consider data fresh for 1 minute
    retry: false, // Don't retry if user is not authenticated
  });
};

// Update user preferences
export const useUpdatePreferences = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  useApiSetup();
  
  return useMutation({
    mutationFn: async (preferences: {
      theme?: string;
      language?: string;
      emailNotifications?: boolean;
    }) => {
      const response = await apiClient.updatePreferences(preferences);
      if (!response.success) {
        throw new Error(response.error?.message || "Failed to update preferences");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      toast({
        title: "Preferences Updated",
        description: "Your preferences have been saved.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update preferences.",
        variant: "destructive",
      });
    },
  });
};
