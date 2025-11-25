/**
 * File overview: src/components/work/WebsiteProjectCard.tsx
 *
 * React component `WebsiteProjectCard` rendering a focused piece of UI.
 * Behavior:
 * - Receives props from parents and may read from hooks or context.
 * - Renders presentational markup and wires callbacks for user interaction.
 * Data flow:
 * - Follows a one-way data flow: parents own data, this component focuses on display.
 * Performance:
 * - Avoid expensive work during render and prefer memoized helpers for heavy subtrees.
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { BorderBeam } from "@/components/ui/border-beam";
import { Skeleton } from "@/components/ui/skeleton";

interface WebsiteProject {
  title: { en: string; es: string };
  description: { en: string; es: string };
  url: string;
  thumbnail: string;
  techStack: string[];
  category: { en: string; es: string };
}

interface WebsiteProjectCardProps {
  project: WebsiteProject;
  lang: "en" | "es";
  index: number;
  onOpenLightbox: () => void;
}

export function WebsiteProjectCard({ project, lang, index, onOpenLightbox }: WebsiteProjectCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenLightbox();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpenLightbox();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group relative cursor-pointer"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${project.title[lang]}`}
    >
      {/* Browser Mockup Frame */}
      <div className="relative bg-card rounded-lg overflow-hidden shadow-soft transition-all duration-300 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] hover:scale-[1.02] border border-border hover:ring-2 hover:ring-primary/50">
        {/* Browser Chrome */}
        <div className="bg-muted px-3 py-2 flex items-center gap-2 border-b border-border">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-destructive/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
          <div className="flex-1 bg-background rounded px-2 py-1 text-xs text-muted-foreground truncate">
            {project.url}
          </div>
        </div>

        {/* Website Screenshot */}
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          {!imageLoaded && !imageError && (
            <Skeleton className="absolute inset-0 w-full h-full" />
          )}
          {imageError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <div className="text-center p-6">
                <ExternalLink className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{project.title[lang]}</p>
              </div>
            </div>
          ) : (
            <img
              src={project.thumbnail}
              alt={project.title[lang]}
              className={`w-full h-full object-cover object-top transition-all duration-500 group-hover:scale-110 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              loading="lazy"
            />
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            <motion.span
              onClick={handleClick}
              initial={{ scale: 0.8, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold flex items-center gap-2 shadow-glow cursor-pointer"
              aria-hidden="true"
            >
              {lang === "en" ? "View Details" : "Ver Detalles"}
            </motion.span>
            <motion.span
              onClick={(e) => {
                e.stopPropagation();
                window.open(project.url, "_blank", "noopener,noreferrer");
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              className="bg-background text-foreground px-6 py-3 rounded-full font-semibold flex items-center gap-2 shadow-glow cursor-pointer"
              aria-hidden="true"
            >
              <ExternalLink className="w-4 h-4" />
              {lang === "en" ? "Visit Site" : "Visitar"}
            </motion.span>
          </div>
        </div>

        {/* Project Info */}
        <div className="p-4">
          <h3 className="font-heading font-bold text-lg mb-2 text-foreground">
            {project.title[lang]}
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            {project.description[lang]}
          </p>

          {/* Tech Stack Badges */}
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
}
