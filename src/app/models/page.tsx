"use client";

import { useState, useMemo, useEffect } from "react";
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
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-sans font-bold text-atlas-text-primary mb-1">
                        Models Directory
                    </h1>
                    <p className="text-sm text-atlas-text-muted">
                        Browse and compare {mockModels.length} AI models across {getUniqueProviders().length} providers
                    </p>
                </div>
                <div className="flex items-center gap-2">
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
                    <button
                        onClick={() => setView("cards")}
                        className={`p-1.5 rounded transition-colors ${view === "cards"
                                ? "text-atlas-text-primary bg-atlas-bg-tertiary"
                                : "text-atlas-text-muted hover:text-atlas-text-secondary"
                            }`}
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

            {/* Results */}
            <div className="mb-4">
                <p className="text-xs font-mono text-atlas-text-muted">
                    {filteredModels.length} of {mockModels.length} models
                </p>
            </div>

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
                        No models match your filters.
                    </p>
                </div>
            )}
        </div>
    );
}
