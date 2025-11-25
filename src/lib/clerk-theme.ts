/**
 * Clerk Theme Configuration
 * Customizes Clerk components to match Brashline brand styling
 */

export const clerkAppearance = {
  variables: {
    colorPrimary: "hsl(var(--primary))",
    colorBackground: "hsl(var(--background))",
    colorText: "hsl(var(--foreground))",
    colorTextSecondary: "hsl(var(--muted-foreground))",
    colorInputBackground: "hsl(var(--background))",
    colorInputText: "hsl(var(--foreground))",
    colorDanger: "hsl(var(--destructive))",
    borderRadius: "0.5rem",
    fontFamily: "inherit",
  },
  elements: {
    // Root container
    rootBox: "w-full",
    card: "bg-background border border-border shadow-lg rounded-lg",
    
    // Header
    headerTitle: "text-foreground font-heading font-bold",
    headerSubtitle: "text-muted-foreground",
    
    // Form elements
    formButtonPrimary: 
      "bg-primary text-primary-foreground hover:bg-primary/90 transition-colors",
    formFieldLabel: "text-foreground font-medium",
    formFieldInput: 
      "bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring",
    formFieldInputShowPasswordButton: "text-muted-foreground hover:text-foreground",
    
    // Social buttons
    socialButtonsBlockButton: 
      "bg-background border border-border text-foreground hover:bg-muted transition-colors",
    socialButtonsBlockButtonText: "text-foreground font-medium",
    
    // Dividers
    dividerLine: "bg-border",
    dividerText: "text-muted-foreground",
    
    // Footer
    footerActionLink: "text-primary hover:text-primary/80 transition-colors",
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
    socialButtonsPlacement: "bottom",
    socialButtonsVariant: "blockButton",
    termsPageUrl: "/terms",
    privacyPageUrl: "/privacy",
    helpPageUrl: "/contact",
  },
};
