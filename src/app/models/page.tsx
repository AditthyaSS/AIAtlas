"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { mockModels, getUniqueProviders, getUniqueModalities, getUniqueLicenses } from "@/lib/mock-data";
import { ModelFilters as ModelFiltersType, Model } from "@/types";
import { ModelTable } from "@/components/models/ModelTable";
import { ModelCard } from "@/components/models/ModelCard";
import { ModelFilters } from "@/components/models/ModelFilters";
import { ModelTableSkeleton, ModelCardSkeleton } from "@/components/ui/Skeletons";

export default function ModelsPage() {
    const [filters, setFilters] = useState<ModelFiltersType>({});
    const [view, setView] = useState<"table" | "cards">("table");
    
    const [models, setModels] = useState<Model[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFetchingNext, setIsFetchingNext] = useState(false);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [totalModels, setTotalModels] = useState(0);

    const { ref, inView } = useInView({
        threshold: 0.1,
        rootMargin: "200px", 
    });

    const buildQueryString = useCallback((cursorStr?: string | null) => {
        const params = new URLSearchParams();
        params.set("limit", "12");
        if (cursorStr) params.set("cursor", cursorStr);
        if (filters.search) params.set("search", filters.search);
        if (filters.provider) params.set("provider", filters.provider);
        if (filters.modality) params.set("modality", filters.modality);
        if (filters.license) params.set("license", filters.license);
        return params.toString();
    }, [filters]);

    useEffect(() => {
        const controller = new AbortController();
        setIsLoading(true);
        setNextCursor(null);

        fetch(`/api/models?${buildQueryString()}`, { signal: controller.signal })
            .then((res) => res.json())
            .then((json) => {
                if (Array.isArray(json.data)) {
                    setModels(json.data);
                    setNextCursor(json.nextCursor || null);
                    setTotalModels(json.total || 0);
                }
            })
            .catch(() => setModels(mockModels.slice(0, 12)))
            .finally(() => setIsLoading(false));

        return () => controller.abort();
    }, [buildQueryString]);

    useEffect(() => {
        if (inView && nextCursor && !isFetchingNext && !isLoading) {
            setIsFetchingNext(true);
            fetch(`/api/models?${buildQueryString(nextCursor)}`)
                .then((res) => res.json())
                .then((json) => {
                    if (Array.isArray(json.data)) {
                        setModels((prev) => [...prev, ...json.data]);
                        setNextCursor(json.nextCursor || null);
                    }
                })
                .finally(() => setIsFetchingNext(false));
        }
    }, [inView, nextCursor, isFetchingNext, isLoading, buildQueryString]);

    const displayedModels = filters.isOpenSource ? models.filter(m => m.isOpenSource) : models;

    return (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-sans font-bold text-atlas-text-primary mb-1">Models Directory</h1>
                    <p className="text-sm text-atlas-text-muted">Browse and compare AI models</p>
                </div>
                <div className="flex items-center gap-2">
<Link
                        href="/models/compare"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-atlas-green/10 text-atlas-green border border-atlas-green/20 rounded hover:bg-atlas-green/20 transition-all font-sans mr-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="20" x2="18" y2="10"/>
                            <line x1="12" y1="20" x2="12" y2="4"/>
                            <line x1="6" y1="20" x2="6" y2="14"/>
                        </svg>
                        Compare Models
                    </Link>
                    <button
                        onClick={() => setView("table")}
                        className={`p-1.5 rounded transition-colors ${view === "table"
                                ? "text-atlas-text-primary bg-atlas-bg-tertiary"
                                : "text-atlas-text-muted hover:text-atlas-text-secondary"
                            }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                            <line x1="3" x2="21" y1="9" y2="9" />
                            <line x1="3" x2="21" y1="15" y2="15" />
                            <line x1="9" x2="9" y1="3" y2="21" />
                        </svg>
                    </button>
                    </button>
                    <button onClick={() => setView("cards")} className={`p-1.5 rounded transition-colors ${view === "cards" ? "text-atlas-text-primary bg-atlas-bg-tertiary" : "text-atlas-text-muted hover:text-atlas-text-secondary"}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>
                    </button>
                </div>
            </div>

            <div className="mb-6">
                <ModelFilters filters={filters} onFiltersChange={setFilters} providers={getUniqueProviders()} modalities={getUniqueModalities()} licenses={getUniqueLicenses()} />
            </div>

            {isLoading ? (
                view === "table" ? <ModelTableSkeleton /> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"><ModelCardSkeleton count={8} /></div>
            ) : view === "table" ? (
                <ModelTable models={displayedModels} />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {displayedModels.map((model, idx) => <ModelCard key={model.id} model={model} rank={idx + 1} />)}
                </div>
            )}

            {!isLoading && displayedModels.length > 0 && (
                <div ref={ref} className="w-full py-8 flex justify-center items-center">
                    {isFetchingNext ? (
                        <div className="flex items-center gap-2 text-atlas-text-muted text-sm font-mono">Loading more...</div>
                    ) : !nextCursor ? (
                        <p className="text-xs text-atlas-text-muted/50 font-mono">End of directory</p>
                    ) : null}
                </div>
            )}
        </div>
    );
}