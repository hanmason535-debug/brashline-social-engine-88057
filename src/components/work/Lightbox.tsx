/**
 * File overview: src/components/work/Lightbox.tsx
 *
 * React component `Lightbox` rendering a focused piece of UI.
 * Behavior:
 * - Receives props from parents and may read from hooks or context.
 * - Renders presentational markup and wires callbacks for user interaction.
 * Data flow:
 * - Follows a one-way data flow: parents own data, this component focuses on display.
 * Performance:
 * - Avoid expensive work during render and prefer memoized helpers for heavy subtrees.
 */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ExternalLink,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Play,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { WebsiteData, SocialData } from "@/types/work.types";
import { useSwipeable } from "react-swipeable";
import { analytics } from "@/lib/analytics";

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  type: "website" | "social";
  data: WebsiteData | SocialData | null;
  lang: "en" | "es";
  allItems?: (WebsiteData | SocialData)[];
  currentIndex?: number;
  onNavigate?: (direction: "prev" | "next") => void;
}

export function Lightbox({
  isOpen,
  onClose,
  type,
  data,
  lang,
  allItems,
  currentIndex,
  onNavigate,
}: LightboxProps) {
  const [showNavHint, setShowNavHint] = useState(true);

  useEffect(() => {
    if (isOpen && data) {
      const contentId = isWebsiteData(data)
        ? data.title
        : isSocialData(data)
          ? data.platform
          : "unknown";
      analytics.trackLightboxOpen(type, String(contentId));
    }
  }, [isOpen, data, type]);

  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && onNavigate) onNavigate("prev");
      if (e.key === "ArrowRight" && onNavigate) onNavigate("next");
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyboard);
      document.body.style.overflow = "hidden";

      // Focus trap - focus the close button when lightbox opens
      const closeButton = document.querySelector("[data-lightbox-close]") as HTMLElement;
      if (closeButton) {
        closeButton.focus();
      }

      // Hide nav hint after 3 seconds
      const timer = setTimeout(() => setShowNavHint(false), 3000);
      return () => {
        document.removeEventListener("keydown", handleKeyboard);
        document.body.style.overflow = "unset";
        clearTimeout(timer);
      };
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, onNavigate]);

  const handleClose = () => {
    analytics.trackLightboxClose(type);
    onClose();
  };

  const handleNavigate = (direction: "prev" | "next") => {
    analytics.trackLightboxNavigation(direction);
    onNavigate?.(direction);
  };

  // Swipe handlers for mobile
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleNavigate("next"),
    onSwipedRight: () => handleNavigate("prev"),
    trackMouse: false,
    trackTouch: true,
  });

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  // Type guards
  const isWebsiteData = (d: WebsiteData | SocialData | null): d is WebsiteData => {
    return d !== null && "thumbnail" in d && "url" in d && "techStack" in d;
  };

  const isSocialData = (d: WebsiteData | SocialData | null): d is SocialData => {
    return d !== null && "platform" in d && "engagement" in d;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50"
          />

          {/* Lightbox Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
            onClick={(e) => e.stopPropagation()}
            {...swipeHandlers}
          >
            <div className="relative w-full max-w-6xl max-h-[90vh] bg-background rounded-2xl shadow-2xl overflow-hidden">
              {/* Close Button */}
              <Button
                onClick={handleClose}
                variant="ghost"
                size="icon"
                data-lightbox-close
                aria-label="Close lightbox"
                className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur-sm hover:bg-background"
              >
                <X className="w-5 h-5" />
              </Button>

              {/* Navigation Arrows */}
              {onNavigate && allItems && allItems.length > 1 && (
                <>
                  <Button
                    onClick={() => handleNavigate("prev")}
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm hover:bg-background w-12 h-12 rounded-full"
                  >
                    <ChevronLeft
                      className={`w-6 h-6 transition-all ${showNavHint ? "animate-pulse" : ""}`}
                    />
                  </Button>
                  <Button
                    onClick={() => handleNavigate("next")}
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm hover:bg-background w-12 h-12 rounded-full"
                  >
                    <ChevronRight
                      className={`w-6 h-6 transition-all ${showNavHint ? "animate-pulse" : ""}`}
                    />
                  </Button>

                  {/* Item Counter */}
                  {currentIndex !== undefined && (
                    <div className="absolute top-4 left-4 z-10 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium">
                      {currentIndex + 1} / {allItems.length}
                    </div>
                  )}
                </>
              )}

              <div className="overflow-y-auto max-h-[90vh]">
                {type === "website" && data && isWebsiteData(data) && (
                  <div>
                    {/* Website Screenshot */}
                    <div className="relative max-h-[60vh] bg-muted overflow-hidden flex items-center justify-center">
                      <img
                        src={data.thumbnail}
                        alt={data.title[lang]}
                        className="max-h-[60vh] max-w-full w-auto h-auto object-contain"
                      />
                      {/* Browser Chrome Overlay */}
                      <div className="absolute top-0 left-0 right-0 bg-muted/95 backdrop-blur-sm px-4 py-3 flex items-center gap-3 border-b border-border">
                        <div className="flex gap-2">
                          <div className="w-3 h-3 rounded-full bg-destructive/70" />
                          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                          <div className="w-3 h-3 rounded-full bg-green-500/70" />
                        </div>
                        <div className="flex-1 bg-background rounded px-3 py-1.5 text-sm text-muted-foreground truncate">
                          {data.url}
                        </div>
                      </div>
                    </div>

                    {/* Website Info */}
                    <div className="p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h2 className="text-3xl font-heading font-bold text-foreground mb-2">
                            {data.title[lang]}
                          </h2>
                          <p className="text-lg text-muted-foreground mb-4">
                            {data.description[lang]}
                          </p>
                          <p className="text-sm text-muted-foreground">{data.category[lang]}</p>
                        </div>
                        <Button
                          onClick={() => window.open(data.url, "_blank", "noopener,noreferrer")}
                          className="flex items-center gap-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          {lang === "en" ? "Visit Live Site" : "Visitar Sitio"}
                        </Button>
                      </div>

                      {/* Tech Stack */}
                      <div>
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                          {lang === "en" ? "Tech Stack" : "Tecnologías"}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {data.techStack.map((tech: string) => (
                            <span
                              key={tech}
                              className="px-4 py-2 bg-muted text-foreground rounded-full font-medium text-sm"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {type === "social" && data && isSocialData(data) && (
                  <div>
                    {/* Social Post Image */}
                    <div className="relative max-h-[60vh] bg-muted overflow-hidden flex items-center justify-center">
                      <img
                        src={data.image}
                        alt={data.caption[lang]}
                        className="max-h-[60vh] max-w-full w-auto h-auto object-contain"
                      />
                      {data.type === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-black/60 p-6 rounded-full">
                            <Play className="w-12 h-12 text-white fill-white" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Social Post Info */}
                    <div className="p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-sm font-semibold text-foreground uppercase tracking-wide">
                              {data.platform.charAt(0).toUpperCase() + data.platform.slice(1)}
                            </span>
                            <span className="text-sm text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">{data.timestamp}</span>
                          </div>
                          <p className="text-lg text-foreground leading-relaxed">
                            {data.caption[lang]}
                          </p>
                        </div>
                      </div>

                      {/* Engagement Stats */}
                      <div className="border-t border-border pt-6">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                          {lang === "en" ? "Engagement" : "Interacción"}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                          {data.engagement.likes && (
                            <div className="flex items-center gap-3">
                              <div className="bg-muted p-3 rounded-full">
                                <Heart className="w-5 h-5 text-foreground" />
                              </div>
                              <div>
                                <div className="text-2xl font-bold text-foreground">
                                  {formatNumber(data.engagement.likes)}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {lang === "en" ? "Likes" : "Me gusta"}
                                </div>
                              </div>
                            </div>
                          )}
                          {data.engagement.comments && (
                            <div className="flex items-center gap-3">
                              <div className="bg-muted p-3 rounded-full">
                                <MessageCircle className="w-5 h-5 text-foreground" />
                              </div>
                              <div>
                                <div className="text-2xl font-bold text-foreground">
                                  {formatNumber(data.engagement.comments)}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {lang === "en" ? "Comments" : "Comentarios"}
                                </div>
                              </div>
                            </div>
                          )}
                          {data.engagement.shares && (
                            <div className="flex items-center gap-3">
                              <div className="bg-muted p-3 rounded-full">
                                <Share2 className="w-5 h-5 text-foreground" />
                              </div>
                              <div>
                                <div className="text-2xl font-bold text-foreground">
                                  {formatNumber(data.engagement.shares)}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {lang === "en" ? "Shares" : "Compartidos"}
                                </div>
                              </div>
                            </div>
                          )}
                          {data.engagement.saves && (
                            <div className="flex items-center gap-3">
                              <div className="bg-muted p-3 rounded-full">
                                <Bookmark className="w-5 h-5 text-foreground" />
                              </div>
                              <div>
                                <div className="text-2xl font-bold text-foreground">
                                  {formatNumber(data.engagement.saves)}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {lang === "en" ? "Saves" : "Guardados"}
                                </div>
                              </div>
                            </div>
                          )}
                          {data.engagement.views && (
                            <div className="flex items-center gap-3">
                              <div className="bg-muted p-3 rounded-full">
                                <Play className="w-5 h-5 text-foreground" />
                              </div>
                              <div>
                                <div className="text-2xl font-bold text-foreground">
                                  {formatNumber(data.engagement.views)}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {lang === "en" ? "Views" : "Vistas"}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
