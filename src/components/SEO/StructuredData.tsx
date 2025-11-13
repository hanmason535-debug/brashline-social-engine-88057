import { Helmet } from "react-helmet-async";
import { generateLocalBusinessSchema, generateOrganizationSchema } from "@/utils/seo";

/**
 * StructuredData Component
 * Injects LocalBusiness and Organization JSON-LD structured data
 * This helps Google understand your business for local search and rich snippets
 */
const StructuredData = () => {
  const localBusinessSchema = generateLocalBusinessSchema();
  const organizationSchema = generateOrganizationSchema();

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
    </Helmet>
  );
};

export default StructuredData;
