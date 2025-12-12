/**
 * File overview: src/components/layout/Breadcrumbs.tsx
 *
 * This component will render the breadcrumbs for the current page
 * and will also generate the corresponding JSON-LD markup.
 */
import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { SEO_CONFIG } from "@/utils/seo";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const { siteUrl } = SEO_CONFIG;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      ...pathnames.map((name, index) => {
        const url = `${siteUrl}/${pathnames.slice(0, index + 1).join("/")}`;
        return {
          "@type": "ListItem",
          position: index + 2,
          name: name.charAt(0).toUpperCase() + name.slice(1),
          item: url,
        };
      }),
    ],
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>
      <nav aria-label="breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <Link to="/" className="hover:underline">
              Home
            </Link>
          </li>
          {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;
            return (
              <li key={name}>
                <span className="mx-2">/</span>
                {isLast ? (
                  <span className="font-semibold text-gray-700">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </span>
                ) : (
                  <Link to={routeTo} className="hover:underline">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumbs;
