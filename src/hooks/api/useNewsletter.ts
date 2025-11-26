/**
 * Newsletter API hooks
 * Uses React Query for subscription mutations
 */
import { useMutation } from "@tanstack/react-query";
import { apiClient, NewsletterSubscribeInput } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { useApiSetup } from "./useContactForm";

// Newsletter subscribe hook
export const useNewsletterSubscribe = () => {
  const { toast } = useToast();
  useApiSetup();
  
  return useMutation({
    mutationFn: async (data: NewsletterSubscribeInput) => {
      const response = await apiClient.subscribeNewsletter(data);
      if (!response.success) {
        throw new Error(response.error?.message || "Failed to subscribe");
      }
      return response.data;
    },
    onSuccess: (data) => {
      toast({
        title: "Subscribed!",
        description: data?.message || "Thank you for subscribing to our newsletter!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    },
  });
};

// Newsletter unsubscribe hook
export const useNewsletterUnsubscribe = () => {
  const { toast } = useToast();
  useApiSetup();
  
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await apiClient.unsubscribeNewsletter(email);
      if (!response.success) {
        throw new Error(response.error?.message || "Failed to unsubscribe");
      }
      return response.data;
    },
    onSuccess: (data) => {
      toast({
        title: "Unsubscribed",
        description: data?.message || "You have been unsubscribed from our newsletter.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to unsubscribe. Please try again.",
        variant: "destructive",
      });
    },
  });
};
