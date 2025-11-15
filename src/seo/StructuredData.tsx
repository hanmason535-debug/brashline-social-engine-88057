import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import {
  generateLocalBusinessSchema,
  generateOrganizationSchema,
  generateServicesItemList,
  generateBlogArticleSchema,
  generateFAQPageSchema,
} from "../seo/seo";
import { faqs } from "@/data/pricing.data";

/**
 * StructuredData Component
 * Injects JSON-LD structured data for LocalBusiness, Organization, and page-specific schemas
 * Helps search engines understand business information for rich snippets and local search
 */
const StructuredData = () => {
  const location = useLocation();
  const localBusinessSchema = generateLocalBusinessSchema();
  const organizationSchema = generateOrganizationSchema();

  // Page-specific structured data
  const pageSchemas: Array<Record<string, unknown>> = [];

  // Add Services schema on services page
  if (location.pathname.startsWith("/services")) {
    // Services data will be imported when needed
    // For now, we'll add it when SERVICES_DATA is available
  }

  // Add FAQ schema on pricing page
  if (location.pathname.startsWith("/pricing")) {
    pageSchemas.push(generateFAQPageSchema(faqs));
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      {pageSchemas.map((schema, idx) => (
        <script key={idx} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default StructuredData;
