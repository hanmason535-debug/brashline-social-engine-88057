/**
 * Type definitions for Case Studies/Work page
 */

export interface WebsiteData {
  thumbnail: string;
  title: { en: string; es: string };
  url: string;
  description: { en: string; es: string };
  techStack: string[];
  category: { en: string; es: string };
}

export interface SocialData {
  platform: "instagram" | "facebook" | "linkedin";
  type: "single" | "carousel" | "video" | "before-after";
  image: string;
  caption: { en: string; es: string };
  engagement: {
    likes?: number;
    comments?: number;
    saves?: number;
    shares?: number;
    views?: number;
  };
  timestamp: string;
}
