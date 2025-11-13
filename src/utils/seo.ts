/**
 * SEO Utility Functions for Brashline
 * Centralized SEO configuration and helper functions
 */

export const SEO_CONFIG = {
  siteName: "Brashline",
  siteUrl: "https://brashline.com",
  defaultTitle: "Brashline | Social Media Management for Florida Businesses",
  defaultDescription:
    "Orlando-based social media management agency. Simple packages, consistent posts, clear reporting. Serving Florida businesses with affordable social media solutions.",
  defaultKeywords:
    "social media management Orlando, Florida social media agency, social media marketing Orlando, content creation Florida, Instagram management Orlando, Facebook management Florida, affordable social media packages",
  twitterHandle: "@Brashline",
  ogImage: "/logo.png", // TODO: Create custom 1200x630 og-image.jpg with brand visuals
  locale: "en_US",
  // NAP (Name, Address, Phone) for local SEO consistency
  business: {
    name: "Brashline",
    phone: "+1-929-446-8440",
    email: "Brashline@gmail.com",
    address: {
      city: "Orlando",
      state: "Florida",
      stateCode: "FL",
      country: "United States",
      countryCode: "US",
    },
    areaServed: "Florida",
    priceRange: "$$",
    hours: "Mon-Fri 9:00 AM - 6:00 PM ET",
  },
  social: {
    facebook: "https://www.facebook.com/profile.php?id=61583138566921",
    instagram: "https://www.instagram.com/brashlineofficial/",
    twitter: "https://x.com/brashlinex?s=11",
    linkedin: "https://www.linkedin.com/company/brashline",
  },
};

/**
 * Generate page-specific SEO metadata
 */
export interface PageSEO {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
  noindex?: boolean;
}

export const getPageSEO = (page: string): PageSEO => {
  const baseUrl = SEO_CONFIG.siteUrl;

  const pages: Record<string, PageSEO> = {
    home: {
      title: "Brashline | Social Media Management for Florida Businesses",
      description:
        "Orlando-based social media management agency. Simple packages, consistent posts, clear reporting. Serving Florida businesses with affordable social media solutions.",
      keywords:
        "social media management Orlando, Florida social media agency, social media marketing Orlando FL, Instagram management, Facebook ads Florida",
      canonical: baseUrl,
    },
    services: {
      title: "Social Media Services | Brashline Orlando",
      description:
        "Professional social media management services for Florida businesses. Content creation, community management, analytics, and strategic planning. Based in Orlando, FL.",
      keywords:
        "social media services Orlando, social media management packages Florida, content creation Orlando, community management services",
      canonical: `${baseUrl}/services`,
    },
    pricing: {
      title: "Social Media Management Pricing | Brashline",
      description:
        "Transparent, affordable social media management packages for Florida businesses. Simple monthly plans starting at competitive rates. No contracts, clear reporting.",
      keywords:
        "social media management pricing Orlando, affordable social media packages Florida, social media cost Orlando",
      canonical: `${baseUrl}/pricing`,
    },
    "case-studies": {
      title: "Case Studies & Portfolio | Brashline",
      description:
        "See how we've helped Florida businesses grow their social media presence. Real results from Orlando-based clients across multiple industries.",
      keywords:
        "social media case studies Orlando, portfolio Florida agency, social media results",
      canonical: `${baseUrl}/case-studies`,
    },
    about: {
      title: "About Brashline | Orlando Social Media Agency",
      description:
        "Meet the Orlando-based team behind Brashline. Two friends on a mission to make social media effortless for Florida businesses.",
      keywords:
        "about Brashline, Orlando social media team, Florida marketing agency, social media experts Orlando",
      canonical: `${baseUrl}/about`,
    },
    blog: {
      title: "Social Media Tips & Insights | Brashline Blog",
      description:
        "Expert social media tips, industry insights, and digital marketing advice for Florida businesses from the Brashline team in Orlando.",
      keywords:
        "social media blog, digital marketing tips Orlando, social media strategy Florida",
      canonical: `${baseUrl}/blog`,
    },
    contact: {
      title: "Contact Brashline | Orlando Social Media Agency",
      description:
        "Get in touch with Brashline for social media management services. Based in Orlando, serving Florida businesses. Call, email, or message us on WhatsApp.",
      keywords:
        "contact Brashline, Orlando social media agency contact, Florida marketing agency",
      canonical: `${baseUrl}/contact`,
    },
    terms: {
      title: "Terms of Service | Brashline",
      description: "Terms of Service for Brashline social media management services.",
      canonical: `${baseUrl}/terms`,
      noindex: true,
    },
    privacy: {
      title: "Privacy Policy | Brashline",
      description: "Privacy Policy for Brashline - how we handle your data and protect your privacy.",
      canonical: `${baseUrl}/privacy`,
      noindex: true,
    },
    cookies: {
      title: "Cookie Policy | Brashline",
      description: "Cookie Policy for Brashline - how we use cookies on our website.",
      canonical: `${baseUrl}/cookies`,
      noindex: true,
    },
    accessibility: {
      title: "Accessibility Statement | Brashline",
      description: "Brashline's commitment to web accessibility and inclusive design.",
      canonical: `${baseUrl}/accessibility`,
      noindex: true,
    },
  };

  return (
    pages[page] || {
      title: SEO_CONFIG.defaultTitle,
      description: SEO_CONFIG.defaultDescription,
      keywords: SEO_CONFIG.defaultKeywords,
      canonical: baseUrl,
    }
  );
};

/**
 * Format title for different contexts
 */
export const formatTitle = (pageTitle?: string): string => {
  if (!pageTitle) return SEO_CONFIG.defaultTitle;
  // Case-insensitive check to avoid duplicating site name
  return pageTitle.toLowerCase().includes(SEO_CONFIG.siteName.toLowerCase())
    ? pageTitle
    : `${pageTitle} | ${SEO_CONFIG.siteName}`;
};

/**
 * Generate LocalBusiness JSON-LD structured data
 */
export const generateLocalBusinessSchema = () => {
  const { business, social, siteUrl } = SEO_CONFIG;

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name,
    description: SEO_CONFIG.defaultDescription,
    url: siteUrl,
    telephone: business.phone,
    email: business.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: business.address.city,
      addressRegion: business.address.stateCode,
      addressCountry: business.address.countryCode,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "28.5383",
      longitude: "-81.3792",
    },
    areaServed: {
      "@type": "State",
      name: business.address.state,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    priceRange: business.priceRange,
    serviceType: "Social Media Management",
    knowsAbout: [
      "Social Media Management",
      "Content Creation",
      "Community Management",
      "Social Media Strategy",
      "Instagram Management",
      "Facebook Marketing",
    ],
    sameAs: [social.facebook, social.instagram, social.twitter, social.linkedin],
  };
};

/**
 * Generate Organization JSON-LD structured data
 */
export const generateOrganizationSchema = () => {
  const { business, social, siteUrl } = SEO_CONFIG;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: business.name,
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Sales",
      telephone: business.phone,
      email: business.email,
      areaServed: business.address.countryCode,
      availableLanguage: ["English", "Spanish"],
    },
    sameAs: [social.facebook, social.instagram, social.twitter, social.linkedin],
  };
};

/**
 * SEO Audit Reminder (dev mode only)
 */
export const logSEOAudit = () => {
  if (import.meta.env.DEV) {
    console.group("🔍 SEO Audit Checklist");
    console.log("✅ Meta description on all pages");
    console.log("✅ Unique H1 on each page");
    console.log("✅ Alt text on all images");
    console.log("✅ Canonical URLs set");
    console.log("✅ Open Graph tags");
    console.log("✅ LocalBusiness schema");
    console.log("✅ Sitemap.xml generated");
    console.log("📍 Remember: Submit sitemap to Google Search Console");
    console.groupEnd();
  }
};
