import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { WebsiteProjectCard } from "@/components/work/WebsiteProjectCard";
import { SocialPostCard } from "@/components/work/SocialPostCard";
import { WebsiteData, SocialData } from "@/types/work.types";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) => (
      <div {...props}>{children}</div>
    ),
    button: ({
      children,
      ...props
    }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children?: React.ReactNode }) => (
      <button {...props}>{children}</button>
    ),
    span: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLSpanElement> & { children?: React.ReactNode }) => (
      <span {...props}>{children}</span>
    ),
  },
}));

// Mock BorderBeam and Skeleton
vi.mock("@/components/ui/border-beam", () => ({
  BorderBeam: () => <div data-testid="border-beam" />,
}));
vi.mock("@/components/ui/skeleton", () => ({
  Skeleton: () => <div data-testid="skeleton" />,
}));

describe("Project Cards Accessibility", () => {
  const mockWebsiteProject: WebsiteData = {
    title: { en: "Test Project", es: "Proyecto de Prueba" },
    description: { en: "Test Description", es: "Descripción de Prueba" },
    url: "https://example.com",
    thumbnail: "https://example.com/image.jpg",
    techStack: ["React"],
    category: { en: "Tech", es: "Tecnología" },
  };

  const mockSocialPost: SocialData = {
    platform: "instagram",
    type: "single",
    image: "https://example.com/post.jpg",
    caption: { en: "Test Caption", es: "Subtítulo de Prueba" },
    engagement: { likes: 100 },
    timestamp: "1d ago",
  };

  describe("WebsiteProjectCard", () => {
    it("should be accessible via keyboard", () => {
      const onOpenLightbox = vi.fn();
      render(
        <WebsiteProjectCard
          project={mockWebsiteProject}
          lang="en"
          index={0}
          onOpenLightbox={onOpenLightbox}
        />
      );

      const card = screen.getByRole("button", { name: /view details for test project/i });

      // Check tabindex
      expect(card).toHaveAttribute("tabIndex", "0");

      // Check Enter key
      fireEvent.keyDown(card, { key: "Enter" });
      expect(onOpenLightbox).toHaveBeenCalledTimes(1);

      // Check Space key
      fireEvent.keyDown(card, { key: " " });
      expect(onOpenLightbox).toHaveBeenCalledTimes(2);
    });
  });

  describe("SocialPostCard", () => {
    it("should be accessible via keyboard", () => {
      const onOpenLightbox = vi.fn();
      render(
        <SocialPostCard post={mockSocialPost} lang="en" index={0} onOpenLightbox={onOpenLightbox} />
      );

      const card = screen.getByRole("button", { name: /view instagram post/i });

      // Check tabindex
      expect(card).toHaveAttribute("tabIndex", "0");

      // Check Enter key
      fireEvent.keyDown(card, { key: "Enter" });
      expect(onOpenLightbox).toHaveBeenCalledTimes(1);

      // Check Space key
      fireEvent.keyDown(card, { key: " " });
      expect(onOpenLightbox).toHaveBeenCalledTimes(2);
    });
  });
});
