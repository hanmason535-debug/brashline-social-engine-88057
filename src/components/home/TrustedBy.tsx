/**
 * File overview: src/components/home/TrustedBy.tsx
 *
 * React component for displaying a "Trusted By" section with client logos.
 * Renders a list of client logos in a visually appealing manner.
 */
import { memo } from "react";

const trustedLogos = [
  { src: "/clients/logo1.svg", alt: "Client Logo 1" },
  { src: "/clients/logo2.svg", alt: "Client Logo 2" },
  { src: "/clients/logo3.svg", alt: "Client Logo 3" },
  { src: "/clients/logo4.svg", alt: "Client Logo 4" },
  { src: "/clients/logo5.svg", alt: "Client Logo 5" },
];

const TrustedBy = memo(() => {
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto text-center">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-8">
          Trusted By The Best
        </h3>
        <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4">
          {trustedLogos.map((logo, index) => (
            <img
              key={index}
              src={logo.src}
              alt={logo.alt}
              className="h-10 w-auto object-contain text-foreground grayscale opacity-60 transition-all duration-300 hover:grayscale-0 hover:opacity-100"
            />
          ))}
        </div>
      </div>
    </section>
  );
});

TrustedBy.displayName = "TrustedBy";

export default TrustedBy;
