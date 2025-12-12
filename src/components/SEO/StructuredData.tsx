/**
 * File overview: src/components/SEO/StructuredData.tsx
 *
 * React component `StructuredData` rendering a focused piece of UI.
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
import {
  generateLocalBusinessSchema,
  generateOrganizationSchema,
  generateServicesSchemaList,
  generateBlogItemListSchema,
  generateArticleSchema,
  generateFAQPageSchema,
} from "@/utils/seo";
import { SERVICES_DATA } from "@/data/services.data";
import { BLOG_POSTS } from "@/data/blog.data";
import { faqs } from "@/data/pricing.data";
import ReviewSchema from "./ReviewSchema";

/**
 * StructuredData Component
 * Injects LocalBusiness, Organization, and page-specific JSON-LD structured data
 * This helps Google understand your business for local search and rich snippets
 */
const StructuredData = () => {
  const location = useLocation();
  const localBusinessSchema = generateLocalBusinessSchema();
  const organizationSchema = generateOrganizationSchema();

  // Page-specific structured data
  // JSON-LD schemas are plain objects; keep the type broad and compatible with JSON serialization
  const pageSchemas: Array<Record<string, unknown>> = [];
  const showReviews = location.pathname === "/" || location.pathname === "/about";

  if (location.pathname.startsWith("/services")) {
    pageSchemas.push(generateServicesSchemaList(SERVICES_DATA));
  }
  if (location.pathname.startsWith("/blog")) {
    pageSchemas.push(generateBlogItemListSchema(BLOG_POSTS));
    // This is a placeholder for individual blog posts. In a real app, you would
    // fetch the post data and generate the schema here.
    if (location.pathname !== "/blog") {
      const post = BLOG_POSTS[0];
      pageSchemas.push(generateArticleSchema(post));
    }
  }
  if (location.pathname.startsWith("/pricing")) {
    pageSchemas.push(generateFAQPageSchema(faqs));
  }

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
        {pageSchemas.filter(Boolean).map((schema, idx) => (
          <script key={idx} type="application/ld+json">
            {JSON.stringify(schema)}
          </script>
        ))}
      </Helmet>
      {showReviews && <ReviewSchema />}
    </>
  );
};

export default StructuredData;
