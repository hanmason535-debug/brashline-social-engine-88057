/**
 * Google Analytics 4 Event Tracking
 * Tracks custom events and stores them locally for dashboard
 */

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

export interface AnalyticsEvent {
  event_name: string;
  event_category: string;
  event_label?: string;
  value?: number;
  timestamp: number;
  utm?: UTMParams;
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
const UTM_STORAGE_KEY = 'brashline_utm_params';
const MAX_STORED_EVENTS = 1000;
const DEBUG = true; // Set to false in production

/**
 * Extract UTM parameters from URL
 */
function extractUTMParams(): UTMParams | null {
  if (typeof window === 'undefined') return null;
  
  const params = new URLSearchParams(window.location.search);
  const utmParams: UTMParams = {};
  
  const utmKeys: (keyof UTMParams)[] = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  let hasParams = false;
  
  utmKeys.forEach(key => {
    const value = params.get(key);
    if (value) {
      utmParams[key] = value;
      hasParams = true;
    }
  });
  
  return hasParams ? utmParams : null;
}

/**
 * Store UTM parameters in sessionStorage
 */
function storeUTMParams(params: UTMParams) {
  try {
    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(params));
    if (DEBUG) console.log('UTM Parameters Captured:', params);
  } catch (error) {
    console.error('Failed to store UTM parameters:', error);
  }
}

/**
 * Get stored UTM parameters
 */
function getStoredUTMParams(): UTMParams | null {
  try {
    const stored = sessionStorage.getItem(UTM_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to retrieve UTM parameters:', error);
    return null;
  }
}

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
  // Get UTM parameters
  const utmParams = getStoredUTMParams();
  
  const event: AnalyticsEvent = {
    event_name: eventName,
    event_category: category,
    event_label: label,
    value,
    timestamp: Date.now(),
    utm: utmParams || undefined,
  };

  // Send to GA4 with UTM parameters
  if (typeof window !== 'undefined') {
    waitForGA4(() => {
      if (window.gtag) {
        window.gtag('event', eventName, {
          event_category: category,
          event_label: label,
          value,
          ...utmParams, // Include UTM parameters in GA4 event
        });
        
        if (DEBUG) {
          console.log('GA4 Event Sent:', {
            event: eventName,
            category,
            label,
            value,
            utm: utmParams,
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
      // Capture UTM parameters on page load
      const utmParams = extractUTMParams();
      if (utmParams) {
        storeUTMParams(utmParams);
      }
      
      waitForGA4(() => {
        if (DEBUG) console.log('GA4: Analytics initialized');
        // Send initial page_view event with UTM parameters
        if (window.gtag) {
          const storedUTM = getStoredUTMParams();
          window.gtag('event', 'page_view', {
            page_title: document.title,
            page_location: window.location.href,
            page_path: window.location.pathname,
            ...storedUTM,
          });
          if (DEBUG) console.log('GA4: Initial page_view sent', storedUTM ? 'with UTM params' : '');
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
