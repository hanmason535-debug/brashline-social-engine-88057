/**
 * File overview: src/components/SEO/BreadcrumbsJsonLd.tsx
 *
 * React component `BreadcrumbsJsonLd` rendering a focused piece of UI.
 * Behavior:
 * - Receives props from parents and may read from hooks or context.
 * - Renders presentational markup and wires callbacks for user interaction.
 * Data flow:
 * - Follows a one-way data flow: parents own data, this component focuses on display.
 * Performance:
 * - Avoid expensive work during render and prefer memoized helpers for heavy subtrees.
 */
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

export const BreadcrumbsJsonLd = () => {
  const location = useLocation();
  const parts = location.pathname.split("/").filter(Boolean);

  // Build itemListElement for BreadcrumbList
  const itemListElement = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "/",
    },
    ...parts.map((part, idx) => ({
      "@type": "ListItem",
      position: idx + 2,
      name: part.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      item: "/" + parts.slice(0, idx + 1).join("/"),
    })),
  ];

  if (parts.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

export default BreadcrumbsJsonLd;
