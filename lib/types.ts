"use client";

export type Theme = {
  font?: string;
  primaryColor?: string;
};

export type HeroContent = {
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  secondaryCtaText?: string;
  primaryHref?: string;
  secondaryHref?: string;
};

export type FeaturesItem = {
  title?: string;
  description?: string;
  icon?: string;
  href?: string;
};

export type FeaturesContent = {
  title?: string;
  subtitle?: string;
  items?: FeaturesItem[];
};

export type TextContent = {
  title?: string;
  body?: string;
};

export type SectionType = "hero" | "features" | "text";

export type SectionContentHero = HeroContent;
export type SectionContentFeatures = FeaturesContent;
export type SectionContentText = TextContent;

export type Site = {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  createdAt: string;
  theme?: Theme;
  config?: StudioShapeSite;
};

export type Page = {
  id: string;
  siteId: string;
  title: string;
  path: string;
};

export type Section = {
  id: string;
  pageId: string;
  type: SectionType;
  orderIndex: number;
  content: SectionContentHero | SectionContentFeatures | SectionContentText;
  createdAt: string;
};

export type Profile = {
  id: string;
  email?: string;
  fullName?: string;
  plan?: "Free" | "Pro" | "Enterprise";
};

export type LayoutPreset = "minimal" | "product" | "portfolio" | "dark";

export interface StudioShapeTheme {
  primaryColor: string;
  secondaryColor: string;
  background: string;
  textColor: string;
  accentColor: string;
  fontFamily: string;
}

export interface StudioShapeSite {
  id: string;
  name: string;
  layoutPreset: LayoutPreset;
  theme: StudioShapeTheme;
  sections: {
    hero: {
      title: string;
      subtitle: string;
      primaryCtaLabel: string;
      secondaryCtaLabel: string;
    };
    features: {
      items: {
        title: string;
        description: string;
        icon?: string;
      }[];
    };
    story: {
      heading: string;
      paragraphs: string[];
    };
    stats: {
      items: {
        label: string;
        value: string;
      }[];
    };
  };
}
