"use client";

import React, { useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Hero from "./Components/Sections/Hero";
import Features from "./Components/Sections/Features";
import Text from "./Components/Sections/Text";
import SiteRenderer from "./Components/site/SiteRenderer";
import {
  getSiteById,
  getSiteBySlug,
  listPages,
  listSections,
} from "./lib/dataStore";

const COMPONENT_MAP = {
  hero: Hero,
  features: Features,
  text: Text,
  default: () => null,
};

export default function View() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slugParam = params?.slug;
  const siteIdQuery = searchParams?.get("siteId");

  const { data: site, isLoading: isSiteLoading } = useQuery({
    queryKey: ["site", slugParam || siteIdQuery],
    queryFn: async () => {
      if (slugParam) return getSiteBySlug(slugParam);
      if (siteIdQuery) return getSiteById(siteIdQuery);
      return null;
    },
    enabled: Boolean(slugParam || siteIdQuery),
  });

  const { data: pages = [], isLoading: isPagesLoading } = useQuery({
    queryKey: ["pages", site?.id],
    queryFn: () => (site?.id ? listPages(site.id) : []),
    enabled: Boolean(site?.id),
  });

  const mainPage = useMemo(() => {
    if (!pages || pages.length === 0) return null;
    return pages.find((page) => page.path === "/") || pages[0];
  }, [pages]);

  const { data: sections = [], isLoading: isSectionsLoading } = useQuery({
    queryKey: ["sections", mainPage?.id],
    queryFn: () => (mainPage?.id ? listSections(mainPage.id) : []),
    enabled: Boolean(mainPage?.id),
  });

  if (isSiteLoading || isPagesLoading || isSectionsLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <Loader2 className="w-8 h-8 animate-spin text-brand-400" />
      </div>
    );
  }

  if (!site) {
    return <div className="h-screen flex items-center justify-center">Site not found</div>;
  }

  if (site.config) {
    return <SiteRenderer site={site.config} />;
  }

  return (
    <div
      className="min-h-screen bg-white font-sans"
      style={{ fontFamily: site.theme?.font || undefined }}
    >
      <nav className="py-4 px-6 md:px-12 lg:px-20 flex items-center justify-between border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="font-bold text-xl tracking-tight text-gray-900">{site.name}</div>
        <div className="hidden md:flex gap-8">
          {pages.map((page) => (
            <a
              key={page.id}
              href={`#${page.path.replace("/", "") || "home"}`}
              className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
            >
              {page.title}
            </a>
          ))}
        </div>
        <button
          className="px-5 py-2.5 rounded-full text-sm font-medium text-white transition-all hover:shadow-lg hover:-translate-y-0.5"
          style={{ backgroundColor: site.theme?.primaryColor || "#4f46e5" }}
        >
          Contact Us
        </button>
      </nav>

      <main>
        {sections.map((section) => {
          const Component = COMPONENT_MAP[section.type] || COMPONENT_MAP.default;
          return (
            <section key={section.id} id={section.type}>
              <Component content={section.content || {}} theme={site.theme} />
            </section>
          );
        })}
      </main>

      <footer className="bg-gray-900 text-white py-12 px-6 text-center">
        <div className="mb-6 font-bold text-2xl">{site.name}</div>
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} All rights reserved.
        </p>
      </footer>
    </div>
  );
}
