'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import SiteRenderer from '@/Components/site/SiteRenderer';
import { getSiteById } from '@/lib/dataStore';
import type { StudioShapeSite } from '@/lib/types';

export default function PublicSitePage() {
  const params = useParams();
  const siteId = (params?.siteId as string) || '';
  const [site, setSite] = useState<StudioShapeSite | null>(null);

  useEffect(() => {
    const load = async () => {
      const data = siteId ? await getSiteById(siteId) : null;
      if (data?.config) {
        setSite(data.config);
      }
    };
    load();
  }, [siteId]);

  if (!site) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <p className="text-sm text-slate-400">Site not found</p>
      </div>
    );
  }

  return <SiteRenderer site={site} />;
}
