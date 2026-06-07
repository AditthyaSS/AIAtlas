"use client";

import { ModelFilters as ModelFiltersType } from "@/types";
import { type RefObject } from "react";

interface ModelFiltersProps {
    filters: ModelFiltersType;
    onFiltersChange: (filters: ModelFiltersType) => void;
    providers: string[];
    modalities: string[];
    licenses: string[];
    searchInputRef?: RefObject<HTMLInputElement>;
}

export function ModelFilters({
    filters,
    onFiltersChange,
    providers,
    modalities,
    licenses,
    searchInputRef,
}: ModelFiltersProps) {
    const updateFilter = (key: keyof ModelFiltersType, value: unknown) => {
        onFiltersChange({ ...filters, [key]: value });
    };

    return (
        <div className="flex flex-wrap items-center gap-3 p-4 bg-atlas-bg-secondary border border-atlas-border rounded-lg">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
                <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-atlas-text-muted"
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search models... /"
                    value={filters.search || ""}
                    onChange={(e) => updateFilter("search", e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-atlas-bg-primary border border-atlas-border rounded-md text-atlas-text-primary placeholder:text-atlas-text-muted focus:outline-none focus:ring-1 focus:ring-atlas-green/50 focus:border-atlas-green/50 transition-colors"
                />
            </div>

            {/* Provider Filter */}
            <select
                value={filters.provider || ""}
                onChange={(e) => updateFilter("provider", e.target.value || undefined)}
                className="px-3 py-2 text-sm bg-atlas-bg-primary border border-atlas-border rounded-md text-atlas-text-secondary focus:outline-none focus:ring-1 focus:ring-atlas-green/50 cursor-pointer"
            >
                <option value="">All Providers</option>
                {providers.map((p) => (
                    <option key={p} value={p}>{p}</option>
                ))}
            </select>

            {/* Modality Filter */}
            <select
                value={filters.modality || ""}
                onChange={(e) => updateFilter("modality", e.target.value || undefined)}
                className="px-3 py-2 text-sm bg-atlas-bg-primary border border-atlas-border rounded-md text-atlas-text-secondary focus:outline-none focus:ring-1 focus:ring-atlas-green/50 cursor-pointer"
            >
                <option value="">All Modalities</option>
                {modalities.map((m) => (
                    <option key={m} value={m}>{m}</option>
                ))}
            </select>

            {/* License Filter */}
            <select
                value={filters.license || ""}
                onChange={(e) => updateFilter("license", e.target.value || undefined)}
                className="px-3 py-2 text-sm bg-atlas-bg-primary border border-atlas-border rounded-md text-atlas-text-secondary focus:outline-none focus:ring-1 focus:ring-atlas-green/50 cursor-pointer"
            >
                <option value="">All Licenses</option>
                {licenses.map((l) => (
                    <option key={l} value={l}>{l}</option>
                ))}
            </select>

            {/* Open Source Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
                <div className="relative w-8 h-4">
                    <input
                        type="checkbox"
                        checked={filters.isOpenSource || false}
                        onChange={(e) => updateFilter("isOpenSource", e.target.checked || undefined)}
                        className="sr-only peer"
                    />
                    {/* Track */}
                    <div className="w-full h-full bg-atlas-bg-tertiary border border-atlas-border rounded-full peer-checked:bg-atlas-green/30 peer-checked:border-atlas-green/50 transition-colors" />
                    {/* Knob */}
                    <div className="absolute top-0.5 left-0.5 w-3 h-3 bg-atlas-text-muted rounded-full peer-checked:translate-x-4 transition-transform peer-checked:bg-atlas-green" />
                </div>
                <span className="text-xs font-mono uppercase tracking-wider text-atlas-text-secondary">
                    OSS Only
                </span>
            </label>

            {/* Sort */}
            <select
                value={filters.sort || "benchmarkGpqa"}
                onChange={(e) => updateFilter("sort", e.target.value)}
                className="px-3 py-2 text-sm bg-atlas-bg-primary border border-atlas-border rounded-md text-atlas-text-secondary focus:outline-none focus:ring-1 focus:ring-atlas-green/50 cursor-pointer"
            >
                <option value="benchmarkGpqa">Sort: GPQA Score</option>
                <option value="name">Sort: Name</option>
                <option value="contextWindow">Sort: Context</option>
                <option value="inputPricePerMtok">Sort: Price (Input)</option>
                <option value="outputPricePerMtok">Sort: Price (Output)</option>
                <option value="speedToksPerSec">Sort: Speed</option>
            </select>
        </div>
    );
}
