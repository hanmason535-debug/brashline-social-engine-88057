import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, Bookmark, Play, Instagram, Facebook, Linkedin } from "lucide-react";

interface SocialPost {
  platform: "instagram" | "facebook" | "linkedin";
  type: "single" | "carousel" | "video" | "before-after";
  image: string;
  caption: { en: string; es: string };
  engagement: {
    likes?: number;
    comments?: number;
    shares?: number;
    saves?: number;
    views?: number;
  };
  timestamp: string;
}

interface SocialPostCardProps {
  post: SocialPost;
  lang: "en" | "es";
  index: number;
  onOpenLightbox: () => void;
}

const platformIcons = {
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
};

const platformColors = {
  instagram: "from-purple-600 via-pink-600 to-orange-500",
  facebook: "from-blue-600 to-blue-700",
  linkedin: "from-blue-700 to-blue-800",
};

export function SocialPostCard({ post, lang, index, onOpenLightbox }: SocialPostCardProps) {
  const PlatformIcon = platformIcons[post.platform];

  const handleClick = () => {
    onOpenLightbox();
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group relative cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative bg-card rounded-lg overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-2 border border-border">
        {/* Platform Badge */}
        <div className="absolute top-3 right-3 z-10">
          <div className={`bg-gradient-to-r ${platformColors[post.platform]} p-2 rounded-full shadow-lg`}>
            <PlatformIcon className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Post Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={post.image}
            alt={post.caption[lang]}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />

          {/* Video Play Button */}
          {post.type === "video" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/60 p-4 rounded-full">
                <Play className="w-8 h-8 text-white fill-white" />
              </div>
            </div>
          )}

          {/* Carousel Indicator */}
          {post.type === "carousel" && (
            <div className="absolute top-3 left-3 bg-black/70 px-2 py-1 rounded-full flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
            </div>
          )}

          {/* Before/After Badge */}
          {post.type === "before-after" && (
            <div className="absolute bottom-3 left-3 bg-black/70 px-3 py-1 rounded-full">
              <span className="text-xs font-semibold text-white">
                {lang === "en" ? "Before/After" : "Antes/Después"}
              </span>
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              className="text-center px-4"
            >
              <p className="text-white font-semibold mb-2">
                {lang === "en" ? "View on" : "Ver en"} {post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}
              </p>
              <div className="flex items-center justify-center gap-4 text-white text-sm">
                {post.engagement.likes && (
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4 fill-current" />
                    <span>{formatNumber(post.engagement.likes)}</span>
                  </div>
                )}
                {post.engagement.comments && (
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{formatNumber(post.engagement.comments)}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Post Info */}
        <div className="p-4">
          <p className="text-sm text-foreground line-clamp-2 mb-3">
            {post.caption[lang]}
          </p>

          {/* Engagement Stats */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              {post.engagement.likes && (
                <div className="flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5" />
                  <span>{formatNumber(post.engagement.likes)}</span>
                </div>
              )}
              {post.engagement.comments && (
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{formatNumber(post.engagement.comments)}</span>
                </div>
              )}
              {post.engagement.views && (
                <div className="flex items-center gap-1">
                  <Play className="w-3.5 h-3.5" />
                  <span>{formatNumber(post.engagement.views)}</span>
                </div>
              )}
              {post.engagement.saves && (
                <div className="flex items-center gap-1">
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{formatNumber(post.engagement.saves)}</span>
                </div>
              )}
            </div>
            <span>{post.timestamp}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
