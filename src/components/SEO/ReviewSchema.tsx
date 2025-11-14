import { Helmet } from "react-helmet-async";
import { SEO_CONFIG } from "@/utils/seo";

interface Review {
  author: string;
  rating: number;
  reviewBody: string;
  datePublished: string;
}

interface ReviewSchemaProps {
  reviews?: Review[];
}

/**
 * ReviewSchema Component
 * Generates Review and AggregateRating structured data for SEO
 * 
 * Usage:
 * <ReviewSchema reviews={testimonials} />
 */
export const ReviewSchema = ({ reviews }: ReviewSchemaProps) => {
  const { siteUrl, business } = SEO_CONFIG;

  // Default reviews if none provided
  const defaultReviews: Review[] = [
    {
      author: "Maria Rodriguez",
      rating: 5,
      reviewBody: "Brashline transformed our social media presence! Their consistent posting and engaging content helped us grow our Instagram followers by 300% in just 3 months.",
      datePublished: "2024-10-15",
    },
    {
      author: "James Thompson",
      rating: 5,
      reviewBody: "Professional, affordable, and results-driven. The team at Brashline really understands Florida businesses and delivers quality content every single week.",
      datePublished: "2024-09-22",
    },
    {
      author: "Sofia Martinez",
      rating: 5,
      reviewBody: "Best investment we made for our business! Their social media management freed up so much of our time while significantly increasing our online engagement.",
      datePublished: "2024-11-03",
    },
    {
      author: "David Chen",
      rating: 4,
      reviewBody: "Great service with clear reporting. We've seen steady growth in our social media metrics and customer inquiries since partnering with Brashline.",
      datePublished: "2024-08-17",
    },
  ];

  const reviewList = reviews || defaultReviews;

  // Calculate aggregate rating
  const totalRating = reviewList.reduce((sum, review) => sum + review.rating, 0);
  const avgRating = (totalRating / reviewList.length).toFixed(1);

  // Individual review schemas
  const reviewSchemas = reviewList.map((review) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "LocalBusiness",
      name: business.name,
      image: `${siteUrl}/logo.png`,
      priceRange: business.priceRange,
      telephone: business.phone,
      address: {
        "@type": "PostalAddress",
        addressLocality: business.address.city,
        addressRegion: business.address.stateCode,
        addressCountry: business.address.countryCode,
      },
    },
    author: {
      "@type": "Person",
      name: review.author,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: review.rating,
      bestRating: 5,
      worstRating: 1,
    },
    reviewBody: review.reviewBody,
    datePublished: review.datePublished,
  }));

  // Aggregate rating schema
  const aggregateRatingSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: business.name,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: avgRating,
      reviewCount: reviewList.length,
      bestRating: 5,
      worstRating: 1,
    },
  };

  return (
    <Helmet>
      {/* Aggregate Rating */}
      <script type="application/ld+json">
        {JSON.stringify(aggregateRatingSchema)}
      </script>
      
      {/* Individual Reviews */}
      {reviewSchemas.map((schema, idx) => (
        <script key={idx} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default ReviewSchema;
