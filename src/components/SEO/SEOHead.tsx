/**
 * File overview: src/components/SEO/SEOHead.tsx
 *
 * Compatibility wrapper that re-exports MetaManager as SEOHead.
 * This allows existing pages to continue using SEOHead while
 * the new MetaManager component handles all SEO functionality.
 */
import MetaManager from "./MetaManager";

// Re-export MetaManager as SEOHead for backward compatibility
export default MetaManager;
