export type SiteSectionType =
  | 'hero'
  | 'features'
  | 'about'
  | 'pricing'
  | 'contact'
  | 'gallery'
  | 'blog'
  | 'faq'
  | 'testimonials';

export type SiteSection = {
  id: string;
  type: SiteSectionType;
  title?: string;
  subtitle?: string;
  text?: string;
  ctaLabel?: string;
  ctaHref?: string;
  items?: { id: string; title: string; text?: string }[];
};

export type SiteTheme = 'light' | 'dark' | 'colorful' | 'minimal' | 'playful' | 'premium';

export type SiteTemplate = {
  id: string;
  name: string;
  description: string;
  theme: SiteTheme;
  sections: SiteSection[];
};

export type AishapeChangeLogEntry = {
  id: string;
  description: string;
  timestamp: number;
};

export type AishapeSessionState = {
  currentTemplate: SiteTemplate | null;
  history: SiteTemplate[];
  changeLog: AishapeChangeLogEntry[];
};
