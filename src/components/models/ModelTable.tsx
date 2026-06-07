"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Model, ModelSortField } from "@/types";
import { cn, formatPrice, formatContextWindow, formatBenchmark, getBenchmarkColor } from "@/lib/utils";
import { LiveBadge } from "./LiveBadge";
import { modalityIcons } from "@/lib/utils";

interface ModelTableProps {
    models: Model[];
    showRank?: boolean;
    selectedIndex?: number;
    onSelectedIndexChange?: (index: number) => void;
}

type SortConfig = {
    field: ModelSortField;
    direction: "asc" | "desc";
};

export function ModelTable({
    models,
    showRank = true,
    selectedIndex = 0,
    onSelectedIndexChange,
}: ModelTableProps) {
    const router = useRouter();
    const [sort, setSort] = useState<SortConfig>({
        field: "benchmarkGpqa",
        direction: "desc",
    });

    const handleSort = (field: ModelSortField) => {
        setSort((prev) =>
            prev.field === field
                ? { field, direction: prev.direction === "desc" ? "asc" : "desc" }
                : { field, direction: "desc" }
        );
    };

    const SortHeader = ({
        field,
        children,
        className,
    }: {
        field: ModelSortField;
        children: React.ReactNode;
        className?: string;
    }) => (
        <th
            className={cn(
                "px-3 py-3 text-left font-sans font-semibold text-xs uppercase tracking-widest text-atlas-text-muted cursor-pointer hover:text-atlas-text-secondary transition-colors select-none",
                className
            )}
            onClick={() => handleSort(field)}
        >
            <span className="inline-flex items-center gap-1">
                {children}
                {sort.field === field && (
                    <span className="text-atlas-green">
                        {sort.direction === "desc" ? "↓" : "↑"}
                    </span>
                )}
            </span>
        </th>
    );

    const sortedModels = useMemo(() => {
        return [...models].sort((a, b) => {
            const aVal = a[sort.field];
            const bVal = b[sort.field];
            if (aVal === undefined || aVal === null) return 1;
            if (bVal === undefined || bVal === null) return -1;
            const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
            return sort.direction === "desc" ? -cmp : cmp;
        });
    }, [models, sort]);

    const handleOpenModel = (model: Model) => {
        router.push(`/models/${model.slug}`);
    };

    return (
        <div className="w-full overflow-x-auto border border-atlas-border rounded-lg bg-atlas-bg-primary">
            {/* Table Header Bar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-atlas-border bg-atlas-bg-secondary">
                <span className="font-sans font-semibold text-xs uppercase tracking-widest text-atlas-text-muted">
                    AI Model Leaderboard
                </span>
                <LiveBadge />
            </div>

            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-atlas-border">
                        {showRank && (
                            <th className="px-3 py-3 text-left font-sans font-semibold text-xs uppercase tracking-widest text-atlas-text-muted w-12">
                                #
                            </th>
                        )}
                        <SortHeader field="name" className="min-w-[180px]">Model</SortHeader>
                        <th className="px-3 py-3 text-left font-sans font-semibold text-xs uppercase tracking-widest text-atlas-text-muted">
                            Provider
                        </th>
                        <SortHeader field="contextWindow">Context</SortHeader>
                        <SortHeader field="speedToksPerSec">Speed</SortHeader>
                        <SortHeader field="inputPricePerMtok">Input $/M</SortHeader>
                        <SortHeader field="outputPricePerMtok">Output $/M</SortHeader>
                        <SortHeader field="benchmarkGpqa">GPQA</SortHeader>
                        <th className="px-3 py-3 text-left font-sans font-semibold text-xs uppercase tracking-widest text-atlas-text-muted">
                            Modalities
                        </th>
                        <th className="px-3 py-3 text-left font-sans font-semibold text-xs uppercase tracking-widest text-atlas-text-muted">
                            License
                        </th>
                        <th className="px-3 py-3 text-left font-sans font-semibold text-xs uppercase tracking-widest text-atlas-text-muted">
                            Tags
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sortedModels.map((model, idx) => (
                        <tr
                            key={model.id}
                            className={cn(
                                "border-b border-atlas-border/50 hover:bg-atlas-bg-tertiary transition-colors cursor-pointer group",
                                idx % 2 === 0 ? "bg-atlas-bg-primary" : "bg-atlas-bg-secondary",
                                idx === selectedIndex && "ring-2 ring-atlas-blue/70 bg-atlas-blue/5"
                            )}
                            onMouseEnter={() => onSelectedIndexChange?.(idx)}
                            onClick={() => handleOpenModel(model)}
                        >
                            {showRank && (
                                <td className="px-3 py-3 font-mono text-sm font-semibold text-atlas-green">
                                    {idx + 1}
                                </td>
                            )}
                            <td className="px-3 py-3">
                                <Link
                                    href={`/models/${model.slug}`}
                                    tabIndex={-1}
                                    onClick={(event) => event.preventDefault()}
                                    className="flex items-center gap-2 group-hover:text-atlas-green transition-colors"
                                >
                                    <span className="font-sans font-medium text-atlas-text-primary">
                                        {model.name}
                                    </span>
                                    {model.isVerified && (
                                        <span className="text-atlas-green text-xs" title="Verified">✓</span>
                                    )}
                                    {model.isOpenSource && (
                                        <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-atlas-purple/10 text-atlas-purple border border-atlas-purple/20">
                                            OSS
                                        </span>
                                    )}
                                </Link>
                            </td>
                            <td className="px-3 py-3 text-atlas-text-secondary text-sm">
                                {model.provider?.name ?? "—"}
                            </td>
                            <td className="px-3 py-3 font-mono text-sm text-atlas-text-secondary">
                                {formatContextWindow(model.contextWindow)}
                            </td>
                            <td className="px-3 py-3 font-mono text-sm text-atlas-text-secondary">
                                {model.speedToksPerSec ? `${model.speedToksPerSec} t/s` : "—"}
                            </td>
                            <td className="px-3 py-3 font-mono text-sm text-atlas-text-secondary">
                                {formatPrice(model.inputPricePerMtok)}
                            </td>
                            <td className="px-3 py-3 font-mono text-sm text-atlas-text-secondary">
                                {formatPrice(model.outputPricePerMtok)}
                            </td>
                            <td className={cn("px-3 py-3 font-mono text-sm font-medium", getBenchmarkColor(model.benchmarkGpqa))}>
                                {formatBenchmark(model.benchmarkGpqa)}
                            </td>
                            <td className="px-3 py-3 text-sm text-atlas-text-secondary">
                                <div className="flex gap-2">
                                    {model.modalities.map((modality: string) => (
                                        <span key={modality} className="flex items-center gap-1">
                                            {modalityIcons[modality] || "❓"}
                                            <span className="hidden sm:inline">{modality}</span>
                                        </span>
                                    ))}
                                </div>
                            </td>
                            <td className="px-3 py-3 text-sm text-atlas-text-secondary">
                                {model.license ?? "—"}
                            </td>
                            <td className="px-3 py-3">
                                <div className="flex flex-wrap gap-1">
                                    {model.tags.slice(0, 2).map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded bg-atlas-bg-tertiary text-atlas-text-secondary border border-atlas-border/50"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
