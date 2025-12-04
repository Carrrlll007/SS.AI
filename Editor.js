"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Layout,
  Type,
  Plus,
  Trash2,
  Eye,
  ChevronLeft,
  Monitor,
  Smartphone,
  Tablet,
  Save,
  Loader2,
  X,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Separator } from "@/Components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Hero from "./Components/Sections/Hero";
import Features from "./Components/Sections/Features";
import Text from "./Components/Sections/Text";
import {
  createSection,
  deleteSection,
  getSiteById,
  listPages,
  listSections,
  updateSection,
  updateSite,
} from "./lib/dataStore";

const COMPONENT_MAP = {
  hero: Hero,
  features: Features,
  text: Text,
  default: ({ content }) => (
    <div className="p-10 text-center border-2 border-dashed">
      Unknown Section Type
    </div>
  ),
};

export default function Editor() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const siteId = searchParams?.get("siteId") || "";

  const [activeTab, setActiveTab] = useState("sections");
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [previewMode, setPreviewMode] = useState("desktop");
  const [formState, setFormState] = useState({});
  const [saveStatus, setSaveStatus] = useState("idle");
  const [saveError, setSaveError] = useState("");

  const { data: site, isLoading: isSiteLoading } = useQuery({
    queryKey: ["site", siteId],
    queryFn: () => (siteId ? getSiteById(siteId) : null),
    enabled: Boolean(siteId),
  });

  const { data: pages = [], isLoading: isPagesLoading } = useQuery({
    queryKey: ["pages", siteId],
    queryFn: () => (siteId ? listPages(siteId) : []),
    enabled: Boolean(siteId),
  });

  const mainPage = useMemo(() => {
    if (!pages || pages.length === 0) return null;
    return pages.find((page) => page.path === "/") || pages[0];
  }, [pages]);

  const sectionsQuery = useQuery({
    queryKey: ["sections", mainPage?.id],
    queryFn: () => (mainPage?.id ? listSections(mainPage.id) : []),
    enabled: Boolean(mainPage?.id),
  });

  const sections = sectionsQuery.data || [];
  const isSectionsLoading = sectionsQuery.isLoading;

  const sectionsQueryKey = ["sections", mainPage?.id];

  useEffect(() => {
    if (sections.length > 0 && !selectedSectionId) {
      setSelectedSectionId(sections[0].id);
    }
    if (sections.length === 0) {
      setSelectedSectionId(null);
    }
  }, [sections, selectedSectionId]);

  const activeSection = useMemo(
    () => sections.find((section) => section.id === selectedSectionId),
    [sections, selectedSectionId]
  );

  useEffect(() => {
    setFormState(activeSection?.content || {});
    setSaveStatus("idle");
    setSaveError("");
  }, [activeSection?.id]);

  const updateSectionMutation = useMutation({
    mutationFn: ({ id, content }) => updateSection(id, { content }),
    onSuccess: () => queryClient.invalidateQueries(sectionsQueryKey),
  });

  const addSectionMutation = useMutation({
    mutationFn: (type) =>
      mainPage?.id ? createSection(mainPage.id, type) : Promise.resolve(null),
    onSuccess: () => queryClient.invalidateQueries(sectionsQueryKey),
  });

  const deleteSectionMutation = useMutation({
    mutationFn: (id) => deleteSection(id),
    onSuccess: (_, id) => {
      if (selectedSectionId === id) setSelectedSectionId(null);
      queryClient.invalidateQueries(sectionsQueryKey);
    },
  });

  const updateSiteThemeMutation = useMutation({
    mutationFn: (theme) =>
      updateSite(siteId, { theme: { ...(site?.theme || {}), ...theme } }),
    onSuccess: () => queryClient.invalidateQueries(["site", siteId]),
  });

  const handleContentChange = (key, value) => {
    setFormState((prev) => ({ ...(prev || {}), [key]: value }));
    setSaveStatus("idle");
  };

  const handleFeatureItemChange = (idx, field, value) => {
    setFormState((prev) => {
      const nextItems = Array.isArray(prev?.items) ? [...prev.items] : [];
      nextItems[idx] = { ...(nextItems[idx] || {}), [field]: value };
      return { ...(prev || {}), items: nextItems };
    });
    setSaveStatus("idle");
  };

  const handleSave = async () => {
    if (!activeSection) return;
    setSaveStatus("saving");
    setSaveError("");
    try {
      const result = await updateSectionMutation.mutateAsync({
        id: activeSection.id,
        content: formState || {},
      });
      if (!result) {
        throw new Error("Unable to update section");
      }
      setSaveStatus("saved");
      queryClient.invalidateQueries(sectionsQueryKey);
    } catch (error) {
      setSaveStatus("error");
      setSaveError(error?.message || "Failed to save changes");
    }
  };

  if (isSiteLoading || isPagesLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!site || !siteId) return <div className="p-8">Site not found</div>;

  const viewHref = site.slug ? `/view/${site.slug}` : "#";
  const featureItems = Array.isArray(formState?.items) ? formState.items : [];

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Top Bar */}
      <header className="h-16 border-b border-gray-200 flex items-center justify-between px-4 bg-white z-10 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="font-semibold text-gray-900">{site.name}</h1>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">
                Draft
              </span>
              <span>•</span>
              <span>Last edited moments ago</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setPreviewMode("desktop")}
            className={`p-2 rounded-md transition-all ${
              previewMode === "desktop"
                ? "bg-white shadow text-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setPreviewMode("tablet")}
            className={`p-2 rounded-md transition-all ${
              previewMode === "tablet"
                ? "bg-white shadow text-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setPreviewMode("mobile")}
            className={`p-2 rounded-md transition-all ${
              previewMode === "mobile"
                ? "bg-white shadow text-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <Link href={viewHref} target="_blank" rel="noreferrer">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" /> Preview
            </Button>
          </Link>
          <Button
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700"
            onClick={() => console.log("Publish site", site)}
          >
            Publish
          </Button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (Navigation / Add) */}
        <aside className="w-80 border-r border-gray-200 bg-white flex flex-col shrink-0 z-10">
          <div className="p-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="sections">Sections</TabsTrigger>
                <TabsTrigger value="pages">Pages</TabsTrigger>
                <TabsTrigger value="theme">Theme</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <ScrollArea className="flex-1 p-4">
            {activeTab === "sections" && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-900">Add Section</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {["hero", "features", "text"].map((type) => (
                      <Button
                        key={type}
                        variant="outline"
                        className="justify-start h-auto py-3 flex-col items-center gap-2 hover:border-indigo-200 hover:bg-indigo-50"
                        onClick={() => addSectionMutation.mutate(type)}
                        disabled={!mainPage}
                      >
                        {type === "hero" && <Layout className="w-5 h-5 text-indigo-500" />}
                        {type === "features" && <Layout className="w-5 h-5 text-purple-500" />}
                        {type === "text" && <Type className="w-5 h-5 text-blue-500" />}
                        <span className="text-xs capitalize">{type}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Current Page Sections
                  </h3>
                  <div className="space-y-2">
                    {sections.map((section, index) => (
                      <div
                        key={section.id}
                        onClick={() => setSelectedSectionId(section.id)}
                        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all group ${
                          selectedSectionId === section.id
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-gray-200 hover:border-indigo-200 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-white rounded border border-gray-200 flex items-center justify-center text-xs font-medium text-gray-500">
                            {index + 1}
                          </div>
                          <span className="text-sm font-medium capitalize">
                            {section.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteSectionMutation.mutate(section.id);
                            }}
                          >
                            <Trash2 className="w-3 h-3 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {(!sections || sections.length === 0) && (
                      <div className="text-sm text-gray-500 text-center py-4">
                        No sections yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "pages" && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900">Pages</h3>
                <div className="space-y-2">
                  {pages.length === 0 && (
                    <div className="text-sm text-gray-500">No pages yet.</div>
                  )}
                  {pages.map((page) => (
                    <div
                      key={page.id}
                      className={`p-3 rounded-lg border ${
                        mainPage?.id === page.id ? "border-indigo-500 bg-indigo-50" : "border-gray-200"
                      }`}
                    >
                      <div className="text-sm font-medium text-gray-900">{page.title}</div>
                      <div className="text-xs text-gray-500">{page.path}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "theme" && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <div className="flex gap-2 flex-wrap">
                    {["#4f46e5", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#8b5cf6"].map(
                      (color) => (
                        <button
                          key={color}
                          onClick={() =>
                            updateSiteThemeMutation.mutate({
                              primaryColor: color,
                            })
                          }
                          className={`w-8 h-8 rounded-full border-2 transition-all ${
                            site?.theme?.primaryColor === color
                              ? "border-gray-900 scale-110"
                              : "border-transparent"
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      )
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Font Family</Label>
                  <Select
                    value={site?.theme?.font || "font-sans"}
                    onValueChange={(val) => updateSiteThemeMutation.mutate({ font: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="font-sans">Inter (Modern)</SelectItem>
                      <SelectItem value="font-serif">Playfair Display (Elegant)</SelectItem>
                      <SelectItem value="font-roboto">Roboto (Neutral)</SelectItem>
                      <SelectItem value="font-mono">Courier (Tech)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </ScrollArea>
        </aside>

        {/* Center Preview */}
        <main className="flex-1 bg-gray-100 p-8 overflow-auto flex items-start justify-center">
          <div
            className={`bg-white shadow-2xl transition-all duration-300 overflow-hidden ${
              previewMode === "mobile"
                ? "w-[375px] min-h-[667px] rounded-3xl border-8 border-gray-800"
                : previewMode === "tablet"
                ? "w-[768px] min-h-[1024px] rounded-xl border-4 border-gray-800"
                : "w-full min-h-screen max-w-6xl shadow-sm"
            }`}
          >
            {/* Render Sections */}
            <div className="w-full h-full bg-white min-h-[500px]">
              {isSectionsLoading && (
                <div className="flex items-center justify-center py-20 text-gray-500">
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Loading sections...
                </div>
              )}
              {!isSectionsLoading &&
                sections.map((section) => {
                  const Component = COMPONENT_MAP[section.type] || COMPONENT_MAP.default;
                  return (
                    <div
                      key={section.id}
                      onClick={() => setSelectedSectionId(section.id)}
                      className={`relative group hover:outline hover:outline-2 hover:outline-indigo-500 hover:z-10 ${
                        selectedSectionId === section.id
                          ? "outline outline-2 outline-indigo-500 z-10"
                          : ""
                      }`}
                    >
                      {selectedSectionId === section.id && (
                        <div className="absolute top-2 right-2 z-20 bg-indigo-600 text-white text-xs px-2 py-1 rounded shadow-md">
                          Editing
                        </div>
                      )}
                      <Component content={section.content || {}} theme={site.theme} />
                    </div>
                  );
                })}
              {!isSectionsLoading && sections.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center p-20 text-gray-400">
                  <Layout className="w-16 h-16 mb-4 opacity-20" />
                  <p>Start by adding a section from the sidebar</p>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Right Sidebar (Edit Content) */}
        {selectedSectionId && activeSection && (
          <aside className="w-80 border-l border-gray-200 bg-white flex flex-col shrink-0 z-10 animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">Edit {activeSection.type}</h3>
              <Button variant="ghost" size="icon" onClick={() => setSelectedSectionId(null)}>
                <X className="w-4 h-4 text-gray-500" />
              </Button>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {activeSection.type === "hero" && (
                  <>
                    <div className="space-y-2">
                      <Label>Headline</Label>
                      <Input
                        value={formState?.headline || ""}
                        onChange={(e) => handleContentChange("headline", e.target.value)}
                        placeholder="Hero headline"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Subheadline</Label>
                      <Textarea
                        value={formState?.subheadline || ""}
                        onChange={(e) => handleContentChange("subheadline", e.target.value)}
                        placeholder="A short supporting sentence"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Primary CTA Text</Label>
                      <Input
                        value={formState?.ctaText || ""}
                        onChange={(e) => handleContentChange("ctaText", e.target.value)}
                        placeholder="Get started"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Secondary CTA Text</Label>
                      <Input
                        value={formState?.secondaryCtaText || ""}
                        onChange={(e) =>
                          handleContentChange("secondaryCtaText", e.target.value)
                        }
                        placeholder="Learn more"
                      />
                    </div>
                  </>
                )}

                {activeSection.type === "text" && (
                  <>
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={formState?.title || ""}
                        onChange={(e) => handleContentChange("title", e.target.value)}
                        placeholder="Section title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Body Text</Label>
                      <Textarea
                        className="min-h-[200px]"
                        value={formState?.body || ""}
                        onChange={(e) => handleContentChange("body", e.target.value)}
                        placeholder="Write your copy here"
                      />
                    </div>
                  </>
                )}

                {activeSection.type === "features" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Section Title</Label>
                      <Input
                        value={formState?.title || ""}
                        onChange={(e) => handleContentChange("title", e.target.value)}
                        placeholder="Features title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Subtitle</Label>
                      <Input
                        value={formState?.subtitle || ""}
                        onChange={(e) => handleContentChange("subtitle", e.target.value)}
                        placeholder="Short description"
                      />
                    </div>
                    <Separator />
                    <Label>Feature Items</Label>
                    {featureItems.map((item, idx) => (
                      <div key={idx} className="p-3 border rounded-lg space-y-2 bg-gray-50">
                        <div className="text-xs font-medium text-gray-500">Item {idx + 1}</div>
                        <Input
                          placeholder="Title"
                          value={item?.title || ""}
                          onChange={(e) =>
                            handleFeatureItemChange(idx, "title", e.target.value)
                          }
                        />
                        <Textarea
                          placeholder="Description"
                          className="h-16 text-sm"
                          value={item?.description || ""}
                          onChange={(e) =>
                            handleFeatureItemChange(idx, "description", e.target.value)
                          }
                        />
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        const nextItems = featureItems.length ? featureItems : [];
                        setFormState((prev) => ({
                          ...(prev || {}),
                          items: [
                            ...nextItems,
                            { title: "New Feature", description: "Description" },
                          ],
                        }));
                        setSaveStatus("idle");
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add Feature
                    </Button>
                  </div>
                )}

                {!["hero", "text", "features"].includes(activeSection.type) && (
                  <div className="text-sm text-gray-500 italic">
                    No specific edit fields for this section type yet.
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="p-4 border-t border-gray-200 space-y-2">
              <Button
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                onClick={handleSave}
                disabled={saveStatus === "saving"}
              >
                <Save className="w-4 h-4 mr-2" />
                {saveStatus === "saving"
                  ? "Saving..."
                  : saveStatus === "saved"
                  ? "Saved"
                  : "Save changes"}
              </Button>
              {saveStatus === "error" && (
                <div className="text-xs text-red-500">{saveError}</div>
              )}
              {saveStatus === "saved" && (
                <div className="text-xs text-green-600">Saved successfully</div>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
