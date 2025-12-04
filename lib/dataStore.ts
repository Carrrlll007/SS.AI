"use client";

import type {
  FeaturesContent,
  HeroContent,
  Page,
  Profile,
  Section,
  SectionType,
  Site,
  TextContent,
  Theme,
  LayoutPreset,
  StudioShapeSite,
  StudioShapeTheme,
} from "./types";

type StoreState = {
  sites: Site[];
  pages: Page[];
  sections: Section[];
  profile: Profile;
};

const STORAGE_KEY = "builder_data_store_v1";

const defaultProfile = (): Profile => ({
  id: "local-user",
  email: "user@example.com",
  fullName: "Local User",
  plan: "Free",
});

let memoryState: StoreState = {
  sites: [],
  pages: [],
  sections: [],
  profile: defaultProfile(),
};

const hasWindow = typeof window !== "undefined";

const parseState = (raw: string | null): StoreState | null => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return {
      sites: parsed.sites || [],
      pages: parsed.pages || [],
      sections: parsed.sections || [],
      profile: parsed.profile || defaultProfile(),
    };
  } catch (error) {
    console.warn("Failed to parse data store", error);
    return null;
  }
};

const readState = (): StoreState => {
  if (hasWindow) {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = parseState(raw);
    if (parsed) {
      memoryState = parsed;
      return parsed;
    }
  }
  return memoryState;
};

const writeState = (state: StoreState) => {
  memoryState = state;
  if (hasWindow) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn("Unable to persist data store", error);
    }
  }
};

const ensureState = (): StoreState => {
  const state = readState();
  if (!state.profile) {
    state.profile = defaultProfile();
  }
  if (!state.sites) state.sites = [];
  if (!state.pages) state.pages = [];
  if (!state.sections) state.sections = [];
  state.sites = state.sites.map((site) => {
    if (site.config) return site;
    return {
      ...site,
      config: defaultStudioShapeSite(site.id, site.name),
    };
  });
  return state;
};

const generateId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `id_${Math.random().toString(36).slice(2, 10)}`;
};

const slugify = (value: string) => {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .trim() || `site-${Math.random().toString(36).slice(2, 6)}`;
};

const defaultHeroContent = (): HeroContent => ({
  headline: "Design your next big idea",
  subheadline: "A simple builder to ship beautiful landing pages fast.",
  ctaText: "Get Started",
  secondaryCtaText: "Learn more",
});

const defaultFeaturesContent = (): FeaturesContent => ({
  title: "Everything you need",
  subtitle: "Craft polished pages without touching code.",
  items: [
    {
      title: "Drag & drop",
      description: "Assemble sections in seconds with a visual editor.",
      icon: "layout",
    },
    {
      title: "Modern themes",
      description: "Pick fonts and colors that match your brand instantly.",
      icon: "sparkles",
    },
    {
      title: "Fast publishing",
      description: "Publish to the web with a single click.",
      icon: "rocket",
    },
  ],
});

const defaultTextContent = (): TextContent => ({
  title: "Tell your story",
  body: "Use the text section to share details about your product, company values, or anything else your visitors should know.",
});

export const defaultStudioShapeTheme = (): StudioShapeTheme => ({
  primaryColor: "#8b5cf6",
  secondaryColor: "#0ea5e9",
  background: "#050914",
  textColor: "#e2e8f0",
  accentColor: "#22d3ee",
  fontFamily: "Space Grotesk, Inter, system-ui, sans-serif",
});

const defaultStudioShapeSite = (id: string, name: string): StudioShapeSite => ({
  id,
  name: name || "StudioShape Site",
  layoutPreset: "minimal",
  theme: defaultStudioShapeTheme(),
  sections: {
    hero: {
      title: "Shape your next website in minutes.",
      subtitle:
        "StudioShape lets you assemble clean, responsive pages from simple building blocks with a live preview and a consistent theme.",
      primaryCtaLabel: "Start shaping",
      secondaryCtaLabel: "See preview",
    },
    features: {
      items: [
        {
          title: "Reusable sections",
          description: "Mix heroes, features, stories, and stats without touching code.",
          icon: "layout",
        },
        {
          title: "Live preview",
          description: "See every change instantly with your theme applied.",
          icon: "sparkles",
        },
        {
          title: "Brand-safe",
          description: "Lock primary colors and typography so everything stays consistent.",
          icon: "shield",
        },
      ],
    },
    story: {
      heading: "Why StudioShape",
      paragraphs: [
        "StudioShape keeps you focused on content instead of CSS. Pick a layout preset, set your theme once, and reuse sections as building blocks.",
        "Perfect for quick launches, product updates, or portfolio refreshes — all while keeping the experience fast and cohesive.",
      ],
    },
    stats: {
      items: [
        { label: "Sections ready", value: "24+" },
        { label: "Publish time", value: "< 2 min" },
        { label: "Performance", value: "96+ score" },
      ],
    },
  },
});

const getDefaultContentForType = (type: SectionType) => {
  if (type === "hero") return defaultHeroContent();
  if (type === "features") return defaultFeaturesContent();
  return defaultTextContent();
};

export const buildDefaultStudioShapeSite = (id: string, name: string): StudioShapeSite =>
  defaultStudioShapeSite(id, name);

export async function listSites(): Promise<Site[]> {
  const state = ensureState();
  return [...state.sites];
}

export async function getSiteById(id: string): Promise<Site | undefined> {
  const state = ensureState();
  return state.sites.find((site) => site.id === id);
}

export async function getSiteBySlug(slug: string): Promise<Site | undefined> {
  const state = ensureState();
  return state.sites.find((site) => site.slug === slug);
}

export async function createSite(name: string): Promise<Site> {
  const state = ensureState();
  const now = new Date().toISOString();
  const baseSlug = slugify(name || "untitled");
  let slug = baseSlug;
  let counter = 1;
  while (state.sites.some((site) => site.slug === slug)) {
    slug = `${baseSlug}-${counter++}`;
  }

  const studioTheme = defaultStudioShapeTheme();
  const newId = generateId();
  const newSite: Site = {
    id: newId,
    ownerId: state.profile?.id || "local-user",
    name: name || "Untitled Site",
    slug,
    createdAt: now,
    theme: {
      primaryColor: studioTheme.primaryColor,
      font: "font-display",
    },
    config: defaultStudioShapeSite(newId, name || "Untitled Site"),
  };

  const homePage: Page = {
    id: generateId(),
    siteId: newSite.id,
    title: "Home",
    path: "/",
  };

  const heroSection: Section = {
    id: generateId(),
    pageId: homePage.id,
    type: "hero",
    content: defaultHeroContent(),
    orderIndex: 0,
    createdAt: now,
  };

  const updatedState: StoreState = {
    ...state,
    sites: [...state.sites, newSite],
    pages: [...state.pages, homePage],
    sections: [...state.sections, heroSection],
  };
  writeState(updatedState);
  return newSite;
}

export async function updateSite(
  siteId: string,
  updates: Partial<Site>
): Promise<Site | undefined> {
  const state = ensureState();
  const index = state.sites.findIndex((s) => s.id === siteId);
  if (index === -1) return undefined;
  const updatedSite = { ...state.sites[index], ...updates };
  const nextState = {
    ...state,
    sites: [
      ...state.sites.slice(0, index),
      updatedSite,
      ...state.sites.slice(index + 1),
    ],
  };
  writeState(nextState);
  return updatedSite;
}

export async function getSiteConfig(
  siteId: string
): Promise<StudioShapeSite | undefined> {
  const site = await getSiteById(siteId);
  return site?.config;
}

export async function updateSiteConfig(
  siteId: string,
  config: StudioShapeSite
): Promise<StudioShapeSite | undefined> {
  const updated = await updateSite(siteId, {
    config,
    theme: {
      primaryColor: config.theme.primaryColor,
      font: "font-display",
    },
  });
  return updated?.config;
}

export async function listPages(siteId: string): Promise<Page[]> {
  const state = ensureState();
  return state.pages.filter((page) => page.siteId === siteId);
}

export async function createPage(
  siteId: string,
  title: string,
  path: string
): Promise<Page> {
  const state = ensureState();
  const newPage: Page = {
    id: generateId(),
    siteId,
    title: title || "Untitled Page",
    path: path || "/",
  };
  const nextState = { ...state, pages: [...state.pages, newPage] };
  writeState(nextState);
  return newPage;
}

export async function listSections(pageId: string): Promise<Section[]> {
  const state = ensureState();
  return state.sections
    .filter((section) => section.pageId === pageId)
    .sort((a, b) => a.orderIndex - b.orderIndex);
}

export async function createSection(
  pageId: string,
  type: SectionType,
  initialContent?: HeroContent | FeaturesContent | TextContent
): Promise<Section | null> {
  const state = ensureState();
  const pageExists = state.pages.some((page) => page.id === pageId);
  if (!pageExists) {
    return null;
  }
  const content = initialContent || getDefaultContentForType(type);
  const orderIndex = state.sections.filter((section) => section.pageId === pageId).length;
  const newSection: Section = {
    id: generateId(),
    pageId,
    type,
    content,
    orderIndex,
    createdAt: new Date().toISOString(),
  };
  const nextState = { ...state, sections: [...state.sections, newSection] };
  writeState(nextState);
  return newSection;
}

export async function updateSection(
  sectionId: string,
  updates: Partial<Section>
): Promise<Section | undefined> {
  const state = ensureState();
  const index = state.sections.findIndex((section) => section.id === sectionId);
  if (index === -1) return undefined;
  const current = state.sections[index];
  const updatedSection: Section = {
    ...current,
    ...updates,
    content: updates.content ?? current.content,
  };
  const nextState = {
    ...state,
    sections: [
      ...state.sections.slice(0, index),
      updatedSection,
      ...state.sections.slice(index + 1),
    ],
  };
  writeState(nextState);
  return updatedSection;
}

export async function deleteSection(sectionId: string): Promise<void> {
  const state = ensureState();
  const nextState = {
    ...state,
    sections: state.sections.filter((section) => section.id !== sectionId),
  };
  writeState(nextState);
}

export async function getProfile(): Promise<Profile> {
  const state = ensureState();
  return state.profile || defaultProfile();
}

export async function updateProfile(
  updates: Partial<Profile>
): Promise<Profile> {
  const state = ensureState();
  const nextProfile = { ...state.profile, ...updates };
  const nextState = { ...state, profile: nextProfile };
  writeState(nextState);
  return nextProfile;
}


