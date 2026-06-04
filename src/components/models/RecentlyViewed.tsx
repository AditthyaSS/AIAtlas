// src/components/models/RecentlyViewed.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { RecentlyViewedModel } from '@/hooks/useRecentlyViewed';

const STORAGE_KEY = 'aiatlas_recently_viewed';

export default function RecentlyViewed() {
  const [models, setModels] = useState<RecentlyViewedModel[]>([]);
  const [mounted, setMounted] = useState(false);

  // Only run on client — prevents Next.js hydration mismatch
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setModels(JSON.parse(stored));
    } catch {}
    setMounted(true);
  }, []);

  if (!mounted || models.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Recently Viewed</h2>
      <div className="flex flex-wrap gap-3">
        {models.map(model => (
          <Link
            key={model.slug}
            href={`/models/${model.slug}`}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card hover:bg-accent transition-colors text-sm"
          >
            {model.avatar && (
              <Image
                src={model.avatar}
                alt={model.name}
                width={20}
                height={20}
                className="rounded-full"
              />
            )}
            <span className="text-foreground">{model.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}