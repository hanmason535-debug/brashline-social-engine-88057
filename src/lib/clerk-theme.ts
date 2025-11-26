/**
 * Clerk Theme Configuration
 * Customizes Clerk components to match Brashline brand styling
 */

export const clerkAppearance = {
  variables: {
    colorPrimary: "hsl(var(--coral))",
    colorBackground: "hsl(var(--background))",
    colorText: "hsl(var(--foreground))",
    colorTextSecondary: "hsl(var(--muted-foreground))",
    colorInputBackground: "hsl(var(--background))",
    colorInputText: "hsl(var(--foreground))",
    colorDanger: "hsl(var(--destructive))",
    borderRadius: "0.75rem",
    fontFamily: "inherit",
    fontSize: "0.875rem",
  },
  elements: {
    // Root container
    rootBox: "w-full",
    card: "bg-background/95 backdrop-blur-xl border-2 border-coral/20 shadow-coral-glow rounded-2xl overflow-hidden",
    
    // Header
    headerTitle: "text-foreground font-heading font-bold text-2xl",
    headerSubtitle: "text-muted-foreground text-base",
    
    // Form elements
    formButtonPrimary: 
      "bg-gradient-coral text-white hover:opacity-90 transition-all shadow-coral-glow hover:shadow-lg hover:scale-[1.02] font-semibold",
    formFieldLabel: "text-foreground font-medium text-sm",
    formFieldInput: 
      "bg-background border-2 border-border text-foreground placeholder:text-muted-foreground focus:border-coral focus:ring-2 focus:ring-coral/20 transition-all rounded-lg",
    formFieldInputShowPasswordButton: "text-muted-foreground hover:text-coral transition-colors",
    
    // Social buttons
    socialButtonsBlockButton: 
      "bg-background border-2 border-border text-foreground hover:border-coral/50 hover:bg-coral/5 transition-all rounded-lg shadow-sm hover:shadow-md",
    socialButtonsBlockButtonText: "text-foreground font-medium",
    socialButtonsProviderIcon: "filter brightness-110",
    
    // Dividers
    dividerLine: "bg-gradient-to-r from-transparent via-border to-transparent h-px",
    dividerText: "text-muted-foreground text-sm px-4",
    
    // Footer
    footerActionLink: "text-coral hover:text-coral-light transition-colors font-medium underline-offset-4 hover:underline",
    footerActionText: "text-muted-foreground",
    
    // User button
    userButtonBox: "focus:ring-2 focus:ring-ring rounded-full",
    userButtonTrigger: "focus:ring-2 focus:ring-ring rounded-full",
    userButtonAvatarBox: "w-9 h-9 rounded-full",
    userButtonPopoverCard: "bg-background border border-border shadow-lg",
    userButtonPopoverActionButton: "text-foreground hover:bg-muted",
    userButtonPopoverActionButtonText: "text-foreground",
    userButtonPopoverFooter: "border-t border-border",
    
    // User profile
    userPreviewMainIdentifier: "text-foreground font-medium",
    userPreviewSecondaryIdentifier: "text-muted-foreground",
    
    // Alerts
    alert: "bg-muted border border-border",
    alertText: "text-foreground",
    
    // Badges
    badge: "bg-primary/10 text-primary",
    
    // Identifiers
    identityPreviewText: "text-foreground",
    identityPreviewEditButton: "text-primary hover:text-primary/80",
    
    // Internal
    internal: "bg-background",
    
    // Modal overlay
    modalBackdrop: "bg-background/80 backdrop-blur-sm",
    modalContent: "bg-background border border-border shadow-xl",
  },
  layout: {
    socialButtonsPlacement: "bottom" as const,
    socialButtonsVariant: "blockButton" as const,
    termsPageUrl: "/terms",
    privacyPageUrl: "/privacy",
    helpPageUrl: "/contact",
  },
};
