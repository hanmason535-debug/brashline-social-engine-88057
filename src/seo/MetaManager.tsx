import { Helmet } from "react-helmet-async";
import { SEO_CONFIG, PageSEO } from "../seo/seo";

interface MetaManagerProps {
  pageSEO: PageSEO;
  lang?: "en" | "es";
}

/**
 * MetaManager Component
 * Centralized SEO meta tag management using react-helmet-async
 * Handles title, description, Open Graph, Twitter Cards, canonical links, and font preloading
 */
const MetaManager = ({ pageSEO, lang = "en" }: MetaManagerProps) => {
  const { title, description, keywords, ogImage, canonical, noindex } = pageSEO;
  const fullOgImage = ogImage || SEO_CONFIG.ogImage;
  const fullOgImageUrl = fullOgImage.startsWith("http")
    ? fullOgImage
    : `${SEO_CONFIG.siteUrl}${fullOgImage}`;

  return (
    <Helmet>
      {/* Core meta tags */}
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* SEO */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      <link rel="canonical" href={canonical || window.location.href} />

      {/* Language */}
      <html lang={lang} />
      <link rel="alternate" href={`${SEO_CONFIG.siteUrl}/es`} hrefLang="es" />
      <link rel="alternate" href={SEO_CONFIG.siteUrl} hrefLang="en" />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical || window.location.href} />
      <meta property="og:image" content={fullOgImageUrl} />
      <meta property="og:image:alt" content={description} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={SEO_CONFIG.siteName} />
      <meta property="og:locale" content={lang === "en" ? "en_US" : "es_ES"} />
      <meta property="og:type" content="website" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImageUrl} />
      <meta name="twitter:image:alt" content={description} />
      {SEO_CONFIG.twitterHandle && <meta name="twitter:site" content={SEO_CONFIG.twitterHandle} />}

      {/* Icons */}
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.json" />

      {/* Performance - Font preloading with non-blocking pattern */}
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="preload"
        as="style"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
        media="print"
        onLoad={(e) => (e.currentTarget.media = "all")}
      />
    </Helmet>
  );
};

export default MetaManager;
