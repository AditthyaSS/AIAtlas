// src/hooks/useRecentlyViewed.ts
import { useState, useEffect } from 'react';

export interface RecentlyViewedModel {
  slug: string;
  name: string;
  avatar: string; // provider logo / avatar URL
}

const STORAGE_KEY = 'aiatlas_recently_viewed';
const MAX_ITEMS = 5;

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedModel[]>([]);

  // Load from localStorage on mount (client-only)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setRecentlyViewed(JSON.parse(stored));
    } catch {}
  }, []);

  const addModel = (model: RecentlyViewedModel) => {
    setRecentlyViewed(prev => {
      // Remove duplicate if it already exists
      const filtered = prev.filter(m => m.slug !== model.slug);
      // Prepend new item, cap at MAX_ITEMS
      const updated = [model, ...filtered].slice(0, MAX_ITEMS);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  return { recentlyViewed, addModel };
}