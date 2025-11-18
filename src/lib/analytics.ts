/**
 * Google Analytics 4 Event Tracking
 * Tracks custom events and stores them locally for dashboard
 */

export interface AnalyticsEvent {
  event_name: string;
  event_category: string;
  event_label?: string;
  value?: number;
  timestamp: number;
}

declare global {
  interface Window {
    gtag?: (
      command: string,
      eventName: string,
      params?: Record<string, any>
    ) => void;
    dataLayer?: any[];
  }
}

const STORAGE_KEY = 'brashline_analytics_events';
const MAX_STORED_EVENTS = 1000;

/**
 * Store event locally for dashboard
 */
function storeEventLocally(event: AnalyticsEvent) {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const events: AnalyticsEvent[] = stored ? JSON.parse(stored) : [];
    
    events.push(event);
    
    // Keep only the most recent events
    if (events.length > MAX_STORED_EVENTS) {
      events.shift();
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (error) {
    console.error('Failed to store analytics event:', error);
  }
}

/**
 * Track custom GA4 event
 */
export function trackEvent(
  eventName: string,
  category: string,
  label?: string,
  value?: number
) {
  const event: AnalyticsEvent = {
    event_name: eventName,
    event_category: category,
    event_label: label,
    value,
    timestamp: Date.now(),
  };

  // Send to GA4
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      event_category: category,
      event_label: label,
      value,
    });
  }

  // Store locally for dashboard
  storeEventLocally(event);
}

/**
 * Get stored events for dashboard
 */
export function getStoredEvents(): AnalyticsEvent[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to retrieve analytics events:', error);
    return [];
  }
}

/**
 * Clear stored events
 */
export function clearStoredEvents() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear analytics events:', error);
  }
}

/**
 * Predefined event trackers
 */
export const analytics = {
  // CTA interactions
  trackCTA: (label: string, location: string) => {
    trackEvent('cta_click', 'engagement', `${label} - ${location}`);
  },

  // Contact form
  trackContactFormStart: () => {
    trackEvent('contact_form_start', 'contact', 'Form Started');
  },
  
  trackContactFormSubmit: (service?: string) => {
    trackEvent('contact_form_submit', 'contact', service || 'General', 1);
  },

  trackContactFormError: (error: string) => {
    trackEvent('contact_form_error', 'contact', error);
  },

  // Lightbox interactions
  trackLightboxOpen: (contentType: string, contentId: string) => {
    trackEvent('lightbox_open', 'engagement', `${contentType} - ${contentId}`);
  },

  trackLightboxClose: (contentType: string) => {
    trackEvent('lightbox_close', 'engagement', contentType);
  },

  trackLightboxNavigation: (direction: 'next' | 'prev') => {
    trackEvent('lightbox_navigation', 'engagement', direction);
  },

  // Navigation
  trackNavigation: (fromPage: string, toPage: string) => {
    trackEvent('page_navigation', 'navigation', `${fromPage} to ${toPage}`);
  },

  // Pricing interactions
  trackPricingView: (plan: string) => {
    trackEvent('pricing_view', 'pricing', plan);
  },

  trackPricingCTA: (plan: string, price: number) => {
    trackEvent('pricing_cta', 'pricing', plan, price);
  },

  // Language switching
  trackLanguageSwitch: (from: string, to: string) => {
    trackEvent('language_switch', 'settings', `${from} to ${to}`);
  },

  // Theme switching
  trackThemeSwitch: (theme: string) => {
    trackEvent('theme_switch', 'settings', theme);
  },
};
