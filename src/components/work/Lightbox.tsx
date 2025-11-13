import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Heart, MessageCircle, Share2, Bookmark, Play, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  type: "website" | "social";
  data: any;
  lang: "en" | "es";
}

export function Lightbox({ isOpen, onClose, type, data, lang }: LightboxProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
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
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50"
          />

          {/* Lightbox Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 grid place-items-center p-4 md:p-8"
            onClick={onClose}
          >
            <div
              className="relative w-full max-w-5xl max-h-[90vh] bg-background rounded-2xl shadow-2xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <Button
                onClick={onClose}
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 z-10 bg-background/80 backdrop-blur-sm hover:bg-background"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </Button>

              <div>
                {type === "website" && data && (
                  <div className="flex flex-col lg:flex-row">
                    {/* Website Screenshot */}
                    <div className="w-full lg:w-[65%] relative aspect-[16/9] bg-muted overflow-hidden lg:rounded-l-2xl">
                      <img
                        src={data.thumbnail}
                        alt={data.title[lang]}
                        className="w-full h-full object-cover object-top"
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
                    <div className="w-full lg:w-[35%] p-6 md:p-8 flex flex-col justify-center">
                      <div className="flex flex-col md:flex-row items-start justify-between gap-4 md:gap-6 mb-6">
                        <div className="flex-1">
                          <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
                            {data.title[lang]}
                          </h2>
                          <p className="text-base md:text-lg text-muted-foreground mb-4">
                            {data.description[lang]}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {data.category[lang]}
                          </p>
                        </div>
                      </div>

                      <Button
                        onClick={() => window.open(data.url, "_blank", "noopener,noreferrer")}
                        className="flex items-center gap-2 w-full md:w-auto mb-6"
                      >
                        <ExternalLink className="w-4 h-4" />
                        {lang === "en" ? "Visit Live Site" : "Visitar Sitio"}
                      </Button>

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

                {type === "social" && data && (
                  <div className="flex flex-col lg:flex-row">
                    {/* Social Post Image */}
                    <div className="w-full lg:w-[50%] relative aspect-square bg-muted overflow-hidden lg:rounded-l-2xl">
                      <img
                        src={data.image}
                        alt={data.caption[lang]}
                        className="w-full h-full object-cover"
                      />
                      {data.type === "video" && (
                        <div className="absolute inset-0 grid place-items-center">
                          <div className="bg-black/60 p-5 rounded-full">
                            <Play className="w-10 h-10 text-white fill-white" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Social Post Info */}
                    <div className="w-full lg:w-[50%] p-6 md:p-8 flex flex-col justify-center">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-sm font-semibold text-foreground uppercase tracking-wide">
                              {data.platform.charAt(0).toUpperCase() + data.platform.slice(1)}
                            </span>
                            <span className="text-sm text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">{data.timestamp}</span>
                          </div>
                          <p className="text-base md:text-lg text-foreground leading-relaxed">
                            {data.caption[lang]}
                          </p>
                        </div>
                      </div>

                      {/* Engagement Stats */}
                      <div className="border-t border-border pt-6">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                          {lang === "en" ? "Engagement" : "Interacción"}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                          {data.engagement.likes && (
                            <div className="flex items-center gap-3">
                              <div className="bg-muted p-3 rounded-full">
                                <Heart className="w-5 h-5 text-foreground" />
                              </div>
                              <div>
                                <div className="text-xl md:text-2xl font-bold text-foreground">
                                  {formatNumber(data.engagement.likes)}
                                </div>
                                <div className="text-xs md:text-sm text-muted-foreground">
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
                                <div className="text-xl md:text-2xl font-bold text-foreground">
                                  {formatNumber(data.engagement.comments)}
                                </div>
                                <div className="text-xs md:text-sm text-muted-foreground">
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
                                <div className="text-xl md:text-2xl font-bold text-foreground">
                                  {formatNumber(data.engagement.shares)}
                                </div>
                                <div className="text-xs md:text-sm text-muted-foreground">
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
                                <div className="text-xl md:text-2xl font-bold text-foreground">
                                  {formatNumber(data.engagement.saves)}
                                </div>
                                <div className="text-xs md:text-sm text-muted-foreground">
                                  {lang === "en" ? "Saves" : "Guardados"}
                                </div>
                              </div>
                            </div>
                          )}
                          {data.engagement.views && (
                            <div className="flex items-center gap-3">
                              <div className="bg-muted p-3 rounded-full">
                                <Eye className="w-5 h-5 text-foreground" />
                              </div>
                              <div>
                                <div className="text-xl md:text-2xl font-bold text-foreground">
                                  {formatNumber(data.engagement.views)}
                                </div>
                                <div className="text-xs md:text-sm text-muted-foreground">
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
