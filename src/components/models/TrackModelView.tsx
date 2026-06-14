// src/components/models/TrackModelView.tsx
'use client';

import { useEffect } from 'react';
import { useRecentlyViewed, RecentlyViewedModel } from '@/hooks/useRecentlyViewed';

interface Props {
  model: RecentlyViewedModel;
}

export default function TrackModelView({ model }: Props) {
  const { addModel } = useRecentlyViewed();

  useEffect(() => {
    addModel(model);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model.slug]);

  return null; // renders nothing, just tracks
}