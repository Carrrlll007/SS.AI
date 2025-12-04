"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Layout as LayoutIcon,
  Plus,
  MoreVertical,
  ExternalLink,
  Edit3,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Input } from "@/Components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createSite, listSites } from "./lib/dataStore";
import type { Site } from "./lib/types";

type SiteCardProps = {
  site: Site;
};

const SiteCard = ({ site }: SiteCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Card className="group hover:shadow-lg transition-all duration-300 border-gray-200 overflow-hidden bg-white">
      <div className="h-40 bg-gray-100 relative overflow-hidden group-hover:bg-indigo-50 transition-colors">
        <div className="absolute inset-0 flex items-center justify-center text-gray-300 group-hover:text-indigo-200 transition-colors">
          <LayoutIcon className="w-16 h-16" />
        </div>
        <div className="absolute top-3 right-3">
          <Badge className="bg-gray-200 text-gray-700">Draft</Badge>
        </div>
      </div>

      <CardHeader className="p-5 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
              {site.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {site.slug || "unnamed-site"}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 -mr-2 text-gray-400 hover:text-gray-600"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link href={`/sites/${site.id}`} target="_blank" rel="noreferrer">
                <DropdownMenuItem>
                  <ExternalLink className="w-4 h-4 mr-2" /> View Live
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem className="text-red-600 focus:text-red-600">
                Delete Site
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardFooter className="p-5 pt-4 flex gap-3">
        <Link href={`/sites/${site.id}/edit`} className="w-full">
          <Button className="w-full bg-indigo-600 hover:bg-indigo-700 group-hover:translate-y-0 transition-all">
            <Edit3 className="w-4 h-4 mr-2" /> Edit Site
          </Button>
        </Link>
      </CardFooter>
    </Card>
  </motion.div>
);

type CreateSiteModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (name: string) => void;
  isGenerating?: boolean;
};

const CreateSiteModal = ({
  isOpen,
  onOpenChange,
  onCreate,
  isGenerating,
}: CreateSiteModalProps) => {
  const [name, setName] = React.useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate(name.trim());
  };

  React.useEffect(() => {
    if (!isOpen) {
      setName("");
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center pt-4">
            Create a new site
          </DialogTitle>
          <DialogDescription className="text-center">
            Give your project a name. You can adjust pages and sections after it is created.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Site name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Acme Landing Page"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-base bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-200"
            disabled={!name.trim() || isGenerating}
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
                Creating...
              </>
            ) : (
              <>
                Create site <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default function Dashboard() {
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const queryClient = useQueryClient();

  const { data: sites = [], isLoading } = useQuery<Site[]>({
    queryKey: ["sites"],
    queryFn: () => listSites(),
    initialData: [],
  });

  const createSiteMutation = useMutation<Site, unknown, string>({
    mutationFn: (name: string) => createSite(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sites"] });
      setIsCreateModalOpen(false);
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your websites and projects</p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5 mr-2" /> Create New Site
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full h-full min-h-[280px] border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all duration-300 group"
            >
              <div className="w-16 h-16 rounded-full bg-gray-100 group-hover:bg-white flex items-center justify-center mb-4 transition-colors shadow-sm">
                <Sparkles className="w-8 h-8" />
              </div>
              <span className="font-semibold text-lg">Create New Site</span>
              <span className="text-sm mt-1">Start from a clean canvas</span>
            </button>
          </motion.div>

          {sites.map((site) => (
            <SiteCard key={site.id} site={site} />
          ))}
        </div>
      )}

      <CreateSiteModal
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onCreate={createSiteMutation.mutate}
        isGenerating={createSiteMutation.isPending}
      />
    </div>
  );
}
