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
