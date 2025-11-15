/**
 * File overview: src/components/SEO/SEOHead.tsx
 *
 * React component `SEOHead` rendering a focused piece of UI.
 * Behavior:
 * - Receives props from parents and may read from hooks or context.
 * - Renders presentational markup and wires callbacks for user interaction.
 * Data flow:
 * - Follows a one-way data flow: parents own data, this component focuses on display.
 * Performance:
 * - Avoid expensive work during render and prefer memoized helpers for heavy subtrees.
 */
import { Helmet } from "react-helmet-async";
import { SEO_CONFIG, PageSEO } from "@/utils/seo";

interface SEOHeadProps {
  pageSEO: PageSEO;
  lang?: "en" | "es";
}

/**
 * SEOHead Component
 * Manages all meta tags, Open Graph, Twitter Cards, and canonical URLs
 * Usage: <SEOHead pageSEO={getPageSEO('home')} />
 */
const SEOHead = ({ pageSEO, lang = "en" }: SEOHeadProps) => {
  const { title, description, keywords, ogImage, canonical, noindex } = pageSEO;
  const fullOgImage = ogImage || SEO_CONFIG.ogImage;
  const fullOgImageUrl = fullOgImage.startsWith("http")
    ? fullOgImage
    : `${SEO_CONFIG.siteUrl}${fullOgImage}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <html lang={lang} />
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical || SEO_CONFIG.siteUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImageUrl} />
      <meta property="og:site_name" content={SEO_CONFIG.siteName} />
      <meta property="og:locale" content={SEO_CONFIG.locale} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonical || SEO_CONFIG.siteUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImageUrl} />
      {SEO_CONFIG.twitterHandle && (
        <meta name="twitter:site" content={SEO_CONFIG.twitterHandle} />
      )}

      {/* Additional SEO */}
      <meta name="author" content={SEO_CONFIG.siteName} />
      <meta name="geo.region" content="US-FL" />
      <meta name="geo.placename" content="Orlando" />
    </Helmet>
  );
};

export default SEOHead;
