import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import {
  generateLocalBusinessSchema,
  generateOrganizationSchema,
  generateServicesSchemaList,
  generateBlogItemListSchema,
} from "@/utils/seo";
import { SERVICES_DATA } from "@/data/services.data";
import { BLOG_POSTS } from "@/data/blog.data";

/**
 * StructuredData Component
 * Injects LocalBusiness and Organization JSON-LD structured data
 * This helps Google understand your business for local search and rich snippets
 */
const StructuredData = () => {
  const location = useLocation();
  const localBusinessSchema = generateLocalBusinessSchema();
  const organizationSchema = generateOrganizationSchema();

  // Page-specific structured data
  const pageSchemas: any[] = [];
  if (location.pathname.startsWith("/services")) {
    pageSchemas.push(generateServicesSchemaList(SERVICES_DATA));
  }
  if (location.pathname.startsWith("/blog")) {
    pageSchemas.push(generateBlogItemListSchema(BLOG_POSTS));
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      {pageSchemas.filter(Boolean).map((schema, idx) => (
        <script key={idx} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default StructuredData;
