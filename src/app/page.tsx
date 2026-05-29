"use client";

import { useState, useMemo, useEffect } from "react";
import { mockModels, mockFeedEvents, getUniqueProviders, getUniqueModalities, getUniqueLicenses } from "@/lib/mock-data";
import { ModelFilters as ModelFiltersType, Model } from "@/types";
import { ModelTable } from "@/components/models/ModelTable";
import { ModelCard } from "@/components/models/ModelCard";
import { ModelFilters } from "@/components/models/ModelFilters";
import { FeedTicker } from "@/components/feed/FeedTicker";
import { useLiveFeed } from "@/hooks/useLiveFeed";
import { ModelTableSkeleton, ModelCardSkeleton } from "@/components/ui/Skeletons";

export default function HomePage() {
    const [filters, setFilters] = useState<ModelFiltersType>({});
    const [view, setView] = useState<"table" | "cards">("table");
    const [models, setModels] = useState<Model[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { events: feedEvents } = useLiveFeed(mockFeedEvents);

    useEffect(() => {
        const controller = new AbortController();

        fetch("/api/models?limit=100", { signal: controller.signal })
            .then((res) => res.json())
            .then((json) => {
                if (Array.isArray(json.data)) {
                    setModels(json.data as Model[]);
                }
            })
            .catch(() => {
                setModels(mockModels);
            })
            .finally(() => setIsLoading(false));

        return () => controller.abort();
    }, []);

    const filteredModels = useMemo(() => {
        let result = [...models];

        if (filters.search) {
            const q = filters.search.toLowerCase();
            result = result.filter(
                (m) =>
                    m.name.toLowerCase().includes(q) ||
                    m.provider?.name.toLowerCase().includes(q) ||
                    m.tags.some((t) => t.toLowerCase().includes(q))
            );
        }
        if (filters.provider) {
            result = result.filter((m) => m.provider?.name === filters.provider);
        }
        if (filters.modality) {
            result = result.filter((m) => m.modalities.includes(filters.modality!));
        }
        if (filters.license) {
            result = result.filter((m) => m.license === filters.license);
        }
        if (filters.isOpenSource) {
            result = result.filter((m) => m.isOpenSource);
        }

        return result;
    }, [filters, models]);

    return (
        <div className="min-h-screen">
            {/* Feed Ticker */}
            <FeedTicker events={feedEvents} />

            {/* Hero Section */}
            <section className="relative overflow-hidden border-b border-atlas-border">
                <div className="grid-pattern absolute inset-0" />
                <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl sm:text-5xl font-sans font-bold tracking-tight text-atlas-text-primary mb-4">
                            The Open Map of the{" "}
                            <span className="text-gradient">AI Ecosystem</span>
                        </h1>
                        <p className="text-lg text-atlas-text-secondary mb-8 max-w-2xl">
                            Real-time, community-maintained directory of every AI model, tool,
                            and repo. Search, compare, and contribute.
                        </p>
                        <div className="flex flex-wrap gap-6 font-mono text-sm">
                            <div>
                                <span className="text-2xl font-bold text-atlas-green">{mockModels.length}</span>
                                <span className="text-atlas-text-muted ml-2">Models tracked</span>
                            </div>
                            <div>
                                <span className="text-2xl font-bold text-atlas-blue">{getUniqueProviders().length}</span>
                                <span className="text-atlas-text-muted ml-2">Providers</span>
                            </div>
                            <div>
                                <span className="text-2xl font-bold text-atlas-purple">∞</span>
                                <span className="text-atlas-text-muted ml-2">Contributors</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-sans font-semibold text-sm uppercase tracking-widest text-atlas-text-muted">
                        Model Leaderboard
                    </h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setView("table")}
                            className={`p-1.5 rounded transition-colors ${view === "table"
                                    ? "text-atlas-text-primary bg-atlas-bg-tertiary"
                                    : "text-atlas-text-muted hover:text-atlas-text-secondary"
                                }`}
                            title="Table view"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                                <line x1="3" x2="21" y1="9" y2="9" />
                                <line x1="3" x2="21" y1="15" y2="15" />
                                <line x1="9" x2="9" y1="3" y2="21" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setView("cards")}
                            className={`p-1.5 rounded transition-colors ${view === "cards"
                                    ? "text-atlas-text-primary bg-atlas-bg-tertiary"
                                    : "text-atlas-text-muted hover:text-atlas-text-secondary"
                                }`}
                            title="Card view"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="7" height="7" x="3" y="3" rx="1" />
                                <rect width="7" height="7" x="14" y="3" rx="1" />
                                <rect width="7" height="7" x="14" y="14" rx="1" />
                                <rect width="7" height="7" x="3" y="14" rx="1" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-6">
                    <ModelFilters
                        filters={filters}
                        onFiltersChange={setFilters}
                        providers={getUniqueProviders()}
                        modalities={getUniqueModalities()}
                        licenses={getUniqueLicenses()}
                    />
                </div>

                {/* Results count */}
                <div className="mb-4">
                    <p className="text-xs font-mono text-atlas-text-muted">
                        {filteredModels.length} models
                    </p>
                </div>

                {/* Table or Card View */}
                {isLoading ? (
                    view === "table" ? (
                        <ModelTableSkeleton />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            <ModelCardSkeleton count={8} />
                        </div>
                    )
                ) : view === "table" ? (
                    <ModelTable models={filteredModels} />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredModels.map((model, idx) => (
                            <ModelCard key={model.id} model={model} rank={idx + 1} />
                        ))}
                    </div>
                )}

                {!isLoading && filteredModels.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-atlas-text-muted text-sm">
                            No models match your filters. Try adjusting your search.
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
}
