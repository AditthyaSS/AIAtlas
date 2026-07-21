"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // ✅ needed for navigation
import { Model, ModelSortField } from "@/types";
import { cn, formatPrice, formatContextWindow, formatBenchmark, getBenchmarkColor,getPriceChangeIndicator } from "@/lib/utils";
import { LiveBadge } from "./LiveBadge";
import { modalityIcons } from "@/lib/utils";
import { BookmarkButton } from "@/components/ui/BookmarkButton";

interface ModelTableProps {
  models: Model[];
  showRank?: boolean;
}

type SortConfig = {
  field: ModelSortField;
  direction: "asc" | "desc";
};

export function ModelTable({ models, showRank = true }: ModelTableProps) {
  const router = useRouter();

  // ✅ Hooks must be inside the component
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [sort, setSort] = useState<SortConfig>({
    field: "benchmarkGpqa",
    direction: "desc",
  });

  useEffect(() => {
    const handleNavigate = (e: CustomEvent) => {
      if (e.detail === "down") {
        setSelectedRow((prev) => (prev === null ? 0 : Math.min(prev + 1, models.length - 1)));
      } else if (e.detail === "up") {
        setSelectedRow((prev) => (prev === null ? 0 : Math.max(prev - 1, 0)));
      }
    };

    const handleOpen = () => {
      if (selectedRow !== null) {
        router.push(`/models/${models[selectedRow].slug}`);
      }
    };

    document.addEventListener("navigateRow", handleNavigate as EventListener);
    document.addEventListener("openSelectedRow", handleOpen);

    return () => {
      document.removeEventListener("navigateRow", handleNavigate as EventListener);
      document.removeEventListener("openSelectedRow", handleOpen);
    };
  }, [selectedRow, models, router]);

  // ✅ Sorting logic stays the same
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

  // ✅ Render table rows with highlight
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
  aria-selected={selectedRow === idx}
  className={cn(
    "border-b border-atlas-border/50 hover:bg-atlas-bg-tertiary transition-colors cursor-pointer group",
    idx % 2 === 0 ? "bg-atlas-bg-primary" : "bg-atlas-bg-secondary",
    selectedRow === idx ? "bg-atlas-bg-tertiary" : ""
  )}
>

                            {showRank && (
                                <td className="px-3 py-3 font-mono text-sm font-semibold text-atlas-green">
                                    {idx + 1}
                                </td>
                            )}
                            <td className="px-3 py-3">
                                <div className="flex items-center gap-3">
                                    <Link
                                        href={`/models/${model.slug}`}
                                        className="flex items-center gap-2 group-hover:text-atlas-green transition-colors"
                                    >
                                        <span className="font-sans font-medium text-atlas-text-primary group-hover:text-atlas-green">
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
                                    <BookmarkButton entityType="model" entityId={model.id} />
                                </div>
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
                                <div className="flex items-center gap-1.5">
                                    <span>{formatPrice(model.inputPricePerMtok)}</span>
                                    {(() => {
                                        const indicator = getPriceChangeIndicator(model.inputPricePerMtok, model.previousInputPrice, model.priceChangedAt);
                                        if (!indicator) return null;
                                        return (
                                            <span title={indicator.tooltip} className={cn("text-xs font-bold cursor-help transition-transform hover:scale-110", indicator.colorClass)}>
                                                {indicator.symbol}
                                            </span>
                                        );
                                    })()}
                                </div>
                            </td>
                            <td className="px-3 py-3 font-mono text-sm text-atlas-text-secondary">
                                <div className="flex items-center gap-1.5">
                                    <span>{formatPrice(model.outputPricePerMtok)}</span>
                                    {(() => {
                                        const indicator = getPriceChangeIndicator(model.outputPricePerMtok, model.previousOutputPrice, model.priceChangedAt);
                                        if (!indicator) return null;
                                        return (
                                            <span title={indicator.tooltip} className={cn("text-xs font-bold cursor-help transition-transform hover:scale-110", indicator.colorClass)}>
                                                {indicator.symbol}
                                            </span>
                                        );
                                    })()}
                                </div>
                            </td>
                            <td className={cn("px-3 py-3 font-mono text-sm font-medium", getBenchmarkColor(model.benchmarkGpqa))}>
                                {formatBenchmark(model.benchmarkGpqa)}
                            </td>
                            <td className="px-3 py-3 text-sm text-atlas-text-secondary">
                                <div className="flex gap-2">
                                    {model.modalities.map((modality: string) => (
                                        <span key={modality} className="flex items-center text-lg cursor-help" title={modality}>
                                            {modalityIcons[modality] || "❓"}
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
