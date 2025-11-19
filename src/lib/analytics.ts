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
const DEBUG = true; // Set to false in production

/**
 * Initialize GA4 and verify it's loaded
 */
function initGA4() {
  if (typeof window === 'undefined') return false;
  
  // Check if gtag is available
  if (!window.gtag) {
    if (DEBUG) console.warn('GA4: gtag not available yet');
    return false;
  }
  
  // Check if dataLayer exists
  if (!window.dataLayer) {
    window.dataLayer = [];
    if (DEBUG) console.log('GA4: Initialized dataLayer');
  }
  
  if (DEBUG) console.log('GA4: Ready ✓');
  return true;
}

/**
 * Wait for GA4 to be ready
 */
function waitForGA4(callback: () => void, maxWait = 5000) {
  const startTime = Date.now();
  
  const checkGA4 = () => {
    if (initGA4()) {
      callback();
    } else if (Date.now() - startTime < maxWait) {
      setTimeout(checkGA4, 100);
    } else {
      if (DEBUG) console.error('GA4: Timeout waiting for gtag to load');
    }
  };
  
  checkGA4();
}

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
  if (typeof window !== 'undefined') {
    waitForGA4(() => {
      if (window.gtag) {
        window.gtag('event', eventName, {
          event_category: category,
          event_label: label,
          value,
        });
        
        if (DEBUG) {
          console.log('GA4 Event Sent:', {
            event: eventName,
            category,
            label,
            value,
          });
        }
      }
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
  // Initialize GA4 on first use
  init: () => {
    if (typeof window !== 'undefined') {
      waitForGA4(() => {
        if (DEBUG) console.log('GA4: Analytics initialized');
        // Send initial page_view event
        if (window.gtag) {
          window.gtag('event', 'page_view', {
            page_title: document.title,
            page_location: window.location.href,
            page_path: window.location.pathname,
          });
          if (DEBUG) console.log('GA4: Initial page_view sent');
        }
      });
    }
  },

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
