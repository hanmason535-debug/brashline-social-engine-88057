import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Heart, MessageCircle, Share2, Bookmark, Play, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  type: "website" | "social";
  data: any;
  lang: "en" | "es";
}

export function Lightbox({ isOpen, onClose, type, data, lang }: LightboxProps) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastPosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
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

  // Reset zoom when lightbox opens/closes
  useEffect(() => {
    if (!isOpen) {
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    const newZoom = Math.min(Math.max(1, zoom + delta), 3);
    setZoom(newZoom);
    if (newZoom === 1) setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      isDragging.current = true;
      lastPosition.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current && zoom > 1) {
      setPosition({
        x: e.clientX - lastPosition.current.x,
        y: e.clientY - lastPosition.current.y,
      });
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
      lastPosition.current = { x: distance, y: zoom };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
      const scale = distance / lastPosition.current.x;
      const newZoom = Math.min(Math.max(1, lastPosition.current.y * scale), 3);
      setZoom(newZoom);
      if (newZoom === 1) setPosition({ x: 0, y: 0 });
    }
  };

  const handlePrevious = () => {
    // Navigation logic would go here
    console.log("Previous item");
  };

  const handleNext = () => {
    // Navigation logic would go here
    console.log("Next item");
  };

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
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-w-6xl max-h-[90vh] bg-background rounded-2xl shadow-2xl overflow-hidden">
              {/* Close Button */}
              <Button
                onClick={onClose}
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur-sm hover:bg-background"
              >
                <X className="w-5 h-5" />
              </Button>

              {/* Zoom Controls */}
              {type === "website" || type === "social" ? (
                <div className="absolute top-4 left-4 z-10 flex gap-2">
                  <Button
                    onClick={() => setZoom(Math.min(zoom + 0.25, 3))}
                    variant="ghost"
                    size="icon"
                    className="bg-background/80 backdrop-blur-sm hover:bg-background"
                    disabled={zoom >= 3}
                  >
                    <ZoomIn className="w-5 h-5" />
                  </Button>
                  <Button
                    onClick={() => {
                      setZoom(Math.max(zoom - 0.25, 1));
                      if (zoom <= 1.25) setPosition({ x: 0, y: 0 });
                    }}
                    variant="ghost"
                    size="icon"
                    className="bg-background/80 backdrop-blur-sm hover:bg-background"
                    disabled={zoom <= 1}
                  >
                    <ZoomOut className="w-5 h-5" />
                  </Button>
                  <span className="bg-background/80 backdrop-blur-sm px-3 py-2 rounded-md text-sm">
                    {Math.round(zoom * 100)}%
                  </span>
                </div>
              ) : null}

              <div className="overflow-y-auto max-h-[90vh]">
                {type === "website" && data && (
                  <div>
                    {/* Website Screenshot */}
                    <div 
                      ref={imageRef}
                      className="relative aspect-[16/9] bg-muted overflow-hidden cursor-move"
                      onWheel={handleWheel}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                    >
                      <img
                        src={data.thumbnail}
                        alt={data.title[lang]}
                        className="w-full h-full object-cover object-top transition-transform duration-200"
                        style={{
                          transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                        }}
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
                          <p className="text-sm text-muted-foreground">
                            {data.category[lang]}
                          </p>
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

                {type === "social" && data && (
                  <div>
                    {/* Social Post Image */}
                    <div 
                      ref={imageRef}
                      className="relative aspect-square bg-muted overflow-hidden cursor-move"
                      onWheel={handleWheel}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                    >
                      <img
                        src={data.image}
                        alt={data.caption[lang]}
                        className="w-full h-full object-cover transition-transform duration-200"
                        style={{
                          transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                        }}
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
