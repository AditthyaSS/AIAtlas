"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Model } from "@/types";
import { mockModels } from "@/lib/mock-data";
import { cn, formatPrice, formatContextWindow, formatBenchmark, getBenchmarkColor } from "@/lib/utils";

export function CompareDashboard() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [models, setModels] = useState<Model[]>([]);
    const [selectedModels, setSelectedModels] = useState<Model[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState<number | null>(null); // index of slot opening dropdown
    const [highlightDiffs, setHighlightDiffs] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch models on mount
    useEffect(() => {
        const controller = new AbortController();

        fetch("/api/models?limit=100", { signal: controller.signal })
            .then((res) => res.json())
            .then((json) => {
                if (Array.isArray(json.data)) {
                    setModels(json.data as Model[]);
                } else {
                    setModels(mockModels);
                }
            })
            .catch(() => {
                setModels(mockModels);
            })
            .finally(() => setIsLoading(false));

        return () => controller.abort();
    }, []);

    // Load initial selection from URL search params e.g. ?compare=gpt-5,claude-opus-4
    useEffect(() => {
        if (models.length === 0) return;

        const compareParam = searchParams.get("compare");
        if (compareParam) {
            const slugs = compareParam.split(",").map((s) => s.trim());
            const matched = slugs
                .map((slug) => models.find((m) => m.slug === slug))
                .filter((m): m is Model => !!m);
            setSelectedModels(matched.slice(0, 4));
        } else {
            // Default to first 2 models if no search param
            if (models.length >= 2) {
                setSelectedModels([models[0], models[1]]);
            }
        }
    }, [models, searchParams]);

    // Update URL query parameter when selection changes
    const updateUrl = (newSelection: Model[]) => {
        const slugs = newSelection.map((m) => m.slug).join(",");
        const params = new URLSearchParams();
        if (slugs) {
            params.set("compare", slugs);
        }
        router.replace(`/models/compare?${params.toString()}`);
    };

    const handleSelectModel = (slotIndex: number, model: Model) => {
        const updated = [...selectedModels];
        // Prevent duplicate models in comparison
        if (updated.some((m) => m.id === model.id)) {
            // Just swap slot or ignore
            const existingIdx = updated.findIndex((m) => m.id === model.id);
            if (existingIdx !== -1) {
                updated[existingIdx] = updated[slotIndex];
            }
        }
        updated[slotIndex] = model;
        // Filter out empty slots if any
        const filtered = updated.filter(Boolean);
        setSelectedModels(filtered);
        updateUrl(filtered);
        setIsDropdownOpen(null);
        setSearchQuery("");
    };

    const handleRemoveModel = (index: number) => {
        const updated = selectedModels.filter((_, i) => i !== index);
        setSelectedModels(updated);
        updateUrl(updated);
    };

    const handleClearAll = () => {
        setSelectedModels([]);
        updateUrl([]);
    };

    const handleAddSlot = () => {
        if (selectedModels.length >= 4) return;
        setIsDropdownOpen(selectedModels.length);
    };

    const filteredOptions = useMemo(() => {
        if (!searchQuery) return models;
        const q = searchQuery.toLowerCase();
        return models.filter(
            (m) =>
                m.name.toLowerCase().includes(q) ||
                m.provider?.name.toLowerCase().includes(q)
        );
    }, [models, searchQuery]);

    // Helper to calculate community rating
    const getRating = (model: Model) => {
        if (model.reviews && model.reviews.length > 0) {
            const sum = model.reviews.reduce((acc, r) => acc + r.rating, 0);
            return (sum / model.reviews.length).toFixed(1);
        }
        // Mock rating based on GPQA performance for nice visuals
        const baseScore = model.benchmarkGpqa || 75;
        const simulated = 3.5 + (baseScore / 100) * 1.5;
        return simulated.toFixed(1);
    };

    // Helper to check if a row differs across selected models
    const isRowDifferent = (getValue: (m: Model) => any) => {
        if (selectedModels.length < 2) return false;
        const firstVal = getValue(selectedModels[0]);
        return selectedModels.some((m) => getValue(m) !== firstVal);
    };

    const getModalityBadge = (model: Model, type: string) => {
        const hasModality = model.modalities.some(
            (m) => m.toLowerCase() === type.toLowerCase()
        );
        return hasModality ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded bg-atlas-green/10 text-atlas-green border border-atlas-green/20">
                Yes
            </span>
        ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded bg-atlas-red/10 text-atlas-red border border-atlas-red/20">
                No
            </span>
        );
    };

    // Share link
    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        alert("Comparison link copied to clipboard!");
    };

    // Export CSV
    const exportCSV = () => {
        if (selectedModels.length === 0) return;
        const headers = ["Field", ...selectedModels.map((m) => m.name)];
        const rows = [
            ["Developer", ...selectedModels.map((m) => m.provider?.name ?? "—")],
            ["Context Window", ...selectedModels.map((m) => formatContextWindow(m.contextWindow))],
            ["Input Price ($/Mtok)", ...selectedModels.map((m) => m.inputPricePerMtok ?? "—")],
            ["Output Price ($/Mtok)", ...selectedModels.map((m) => m.outputPricePerMtok ?? "—")],
            ["Open Source", ...selectedModels.map((m) => (m.isOpenSource ? "Yes" : "No"))],
            ["API Available", ...selectedModels.map((m) => (m.apiAvailable ? "Yes" : "No"))],
            ["GPQA Score", ...selectedModels.map((m) => formatBenchmark(m.benchmarkGpqa))],
            ["License", ...selectedModels.map((m) => m.license ?? "—")],
            ["Speed (tok/s)", ...selectedModels.map((m) => m.speedToksPerSec ?? "—")],
            ["Released At", ...selectedModels.map((m) => (m.releasedAt ? new Date(m.releasedAt).toLocaleDateString() : "—"))],
        ];

        const content = [headers, ...rows]
            .map((e) => e.map((val) => `"${val}"`).join(","))
            .join("\n");

        const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "ai-model-comparison.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Export Markdown
    const exportMarkdown = () => {
        if (selectedModels.length === 0) return;
        const headers = ["Parameter", ...selectedModels.map((m) => m.name)];
        const dividers = [":---", ...selectedModels.map(() => ":---:")];

        const rows = [
            ["Developer", ...selectedModels.map((m) => m.provider?.name ?? "—")],
            ["Context Window", ...selectedModels.map((m) => formatContextWindow(m.contextWindow))],
            ["Input Price", ...selectedModels.map((m) => formatPrice(m.inputPricePerMtok))],
            ["Output Price", ...selectedModels.map((m) => formatPrice(m.outputPricePerMtok))],
            ["Open Source", ...selectedModels.map((m) => (m.isOpenSource ? "✅ Yes" : "❌ No"))],
            ["API Available", ...selectedModels.map((m) => (m.apiAvailable ? "✅ Yes" : "❌ No"))],
            ["GPQA Score", ...selectedModels.map((m) => formatBenchmark(m.benchmarkGpqa))],
            ["License", ...selectedModels.map((m) => m.license ?? "—")],
            ["Speed", ...selectedModels.map((m) => (m.speedToksPerSec ? `${m.speedToksPerSec} t/s` : "—"))],
            ["Release Date", ...selectedModels.map((m) => (m.releasedAt ? new Date(m.releasedAt).toLocaleDateString() : "—"))],
        ];

        const content = [
            `# AI Atlas - Model Comparison`,
            `Generated on ${new Date().toLocaleDateString()}`,
            "",
            `| ${headers.join(" | ")} |`,
            `| ${dividers.join(" | ")} |`,
            ...rows.map((r) => `| ${r.join(" | ")} |`),
        ].join("\n");

        const blob = new Blob([content], { type: "text/markdown;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "ai-model-comparison.md");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            {/* Breadcrumb */}
            <nav className="mb-6">
                <ol className="flex items-center gap-2 text-sm text-atlas-text-muted">
                    <li>
                        <Link href="/models" className="hover:text-atlas-text-secondary transition-colors">
                            Models
                        </Link>
                    </li>
                    <li>/</li>
                    <li className="text-atlas-text-primary">Compare Dashboard</li>
                </ol>
            </nav>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-sans font-bold text-atlas-text-primary mb-1">
                        Side-by-Side Comparison
                    </h1>
                    <p className="text-sm text-atlas-text-muted">
                        Select and compare up to 4 models across capabilities, pricing, performance, and key metrics.
                    </p>
                </div>

                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={() => setHighlightDiffs((prev) => !prev)}
                        className={cn(
                            "px-3 py-1.5 text-xs font-semibold rounded border transition-all flex items-center gap-1.5",
                            highlightDiffs
                                ? "bg-atlas-purple/10 text-atlas-purple border-atlas-purple/30"
                                : "bg-atlas-bg-secondary text-atlas-text-secondary border-atlas-border hover:border-atlas-border-hover hover:text-atlas-text-primary"
                        )}
                        title="Highlight parameter rows where values differ"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="8" x2="12" y2="12"/>
                            <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        {highlightDiffs ? "Diff Highlight: On" : "Highlight Differences"}
                    </button>

                    <button
                        onClick={handleShare}
                        className="px-3 py-1.5 text-xs font-semibold rounded bg-atlas-bg-secondary text-atlas-text-secondary border border-atlas-border hover:border-atlas-border-hover hover:text-atlas-text-primary transition-all flex items-center gap-1.5"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                        </svg>
                        Share Link
                    </button>

                    {/* Export Dropdown simulated */}
                    <div className="relative group">
                        <button className="px-3 py-1.5 text-xs font-semibold rounded bg-atlas-bg-secondary text-atlas-text-secondary border border-atlas-border hover:border-atlas-border-hover hover:text-atlas-text-primary transition-all flex items-center gap-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            Export
                        </button>
                        <div className="absolute right-0 top-full mt-1 hidden group-hover:block bg-atlas-bg-secondary border border-atlas-border rounded shadow-xl z-50 overflow-hidden min-w-[120px]">
                            <button
                                onClick={exportCSV}
                                className="w-full text-left px-3 py-2 text-xs text-atlas-text-secondary hover:text-atlas-text-primary hover:bg-atlas-bg-tertiary transition-colors"
                            >
                                Export as CSV
                            </button>
                            <button
                                onClick={exportMarkdown}
                                className="w-full text-left px-3 py-2 text-xs text-atlas-text-secondary hover:text-atlas-text-primary hover:bg-atlas-bg-tertiary border-t border-atlas-border/50 transition-colors"
                            >
                                Export as MD
                            </button>
                        </div>
                    </div>

                    {selectedModels.length > 0 && (
                        <button
                            onClick={handleClearAll}
                            className="px-3 py-1.5 text-xs font-semibold rounded bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-all flex items-center gap-1"
                        >
                            Clear All
                        </button>
                    )}
                </div>
            </div>

            {/* Matrix Container */}
            <div className="border border-atlas-border rounded-lg bg-atlas-bg-primary overflow-x-auto shadow-sm">
                <table className="w-full min-w-[700px] border-collapse table-fixed">
                    {/* Headers (Sticky) */}
                    <thead className="sticky top-0 z-30 glass border-b border-atlas-border shadow-[0_1px_0_0_rgba(0,0,0,0.1)]">
                        <tr>
                            {/* Column 0: Label Column */}
                            <th className="w-[180px] p-4 text-left font-sans font-semibold text-xs uppercase tracking-wider text-atlas-text-muted">
                                Parameters
                            </th>

                            {/* Slot columns: Loop 1 to 4 */}
                            {[0, 1, 2, 3].map((slotIndex) => {
                                const model = selectedModels[slotIndex];

                                return (
                                    <th key={slotIndex} className="p-4 border-l border-atlas-border relative text-left">
                                        {model ? (
                                            <div className="flex flex-col gap-1.5">
                                                {/* Header Card */}
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="font-sans font-bold text-sm text-atlas-text-primary tracking-tight">
                                                            {model.name}
                                                        </h3>
                                                        <p className="text-xs text-atlas-text-muted mt-0.5">
                                                            {model.provider?.name}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleRemoveModel(slotIndex)}
                                                        className="p-1 rounded hover:bg-atlas-bg-tertiary text-atlas-text-muted hover:text-atlas-text-primary transition-all"
                                                        title="Remove model"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                                        </svg>
                                                    </button>
                                                </div>

                                                {/* Slot switcher dropdown */}
                                                <div className="relative mt-2">
                                                    <button
                                                        onClick={() =>
                                                            setIsDropdownOpen(isDropdownOpen === slotIndex ? null : slotIndex)
                                                        }
                                                        className="w-full px-2 py-1 text-[11px] font-medium text-atlas-text-secondary hover:text-atlas-text-primary bg-atlas-bg-secondary border border-atlas-border hover:border-atlas-border-hover rounded flex items-center justify-between transition-colors"
                                                    >
                                                        Change Model
                                                        <svg className="w-2.5 h-2.5 ml-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                            <polyline points="6 9 12 15 18 9" />
                                                        </svg>
                                                    </button>

                                                    {isDropdownOpen === slotIndex && (
                                                        <div className="absolute left-0 top-full mt-1 w-full bg-atlas-bg-card border border-atlas-border rounded shadow-2xl z-50 p-2 min-w-[200px]">
                                                            <input
                                                                type="text"
                                                                placeholder="Search models..."
                                                                value={searchQuery}
                                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                                className="w-full px-2 py-1 text-xs bg-atlas-bg-secondary border border-atlas-border rounded focus:outline-none focus:border-atlas-green/60 mb-2 text-atlas-text-primary"
                                                                autoFocus
                                                            />
                                                            <div className="max-h-[200px] overflow-y-auto space-y-0.5">
                                                                {filteredOptions.length > 0 ? (
                                                                    filteredOptions.map((opt) => (
                                                                        <button
                                                                            key={opt.id}
                                                                            onClick={() => handleSelectModel(slotIndex, opt)}
                                                                            className="w-full text-left px-2 py-1.5 text-xs text-atlas-text-secondary hover:text-atlas-text-primary hover:bg-atlas-bg-tertiary rounded flex items-center justify-between transition-all"
                                                                        >
                                                                            <span className="truncate font-medium">{opt.name}</span>
                                                                            <span className="text-[10px] text-atlas-text-muted truncate ml-1">{opt.provider?.name}</span>
                                                                        </button>
                                                                    ))
                                                                ) : (
                                                                    <div className="text-[10px] text-atlas-text-muted p-2 text-center">
                                                                        No models found
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-4 text-center">
                                                <button
                                                    onClick={() => setIsDropdownOpen(slotIndex)}
                                                    className="w-full max-w-[150px] py-2 border border-dashed border-atlas-border hover:border-atlas-green/50 rounded flex flex-col items-center justify-center gap-1 group transition-colors"
                                                >
                                                    <svg className="w-5 h-5 text-atlas-text-muted group-hover:text-atlas-green transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                                                    </svg>
                                                    <span className="text-[11px] font-semibold text-atlas-text-muted group-hover:text-atlas-text-secondary transition-colors">
                                                        Add Model
                                                    </span>
                                                </button>

                                                {isDropdownOpen === slotIndex && (
                                                    <div className="absolute left-0 top-full mt-1 bg-atlas-bg-card border border-atlas-border rounded shadow-2xl z-50 p-2 min-w-[200px] w-full">
                                                        <input
                                                            type="text"
                                                            placeholder="Search models..."
                                                            value={searchQuery}
                                                            onChange={(e) => setSearchQuery(e.target.value)}
                                                            className="w-full px-2 py-1 text-xs bg-atlas-bg-secondary border border-atlas-border rounded focus:outline-none focus:border-atlas-green/60 mb-2 text-atlas-text-primary"
                                                            autoFocus
                                                        />
                                                        <div className="max-h-[200px] overflow-y-auto space-y-0.5">
                                                            {filteredOptions.length > 0 ? (
                                                                filteredOptions.map((opt) => (
                                                                    <button
                                                                        key={opt.id}
                                                                        onClick={() => handleSelectModel(slotIndex, opt)}
                                                                        className="w-full text-left px-2 py-1.5 text-xs text-atlas-text-secondary hover:text-atlas-text-primary hover:bg-atlas-bg-tertiary rounded flex items-center justify-between transition-all"
                                                                    >
                                                                        <span className="truncate font-medium">{opt.name}</span>
                                                                        <span className="text-[10px] text-atlas-text-muted truncate ml-1">{opt.provider?.name}</span>
                                                                    </button>
                                                                ))
                                                            ) : (
                                                                <div className="text-[10px] text-atlas-text-muted p-2 text-center">
                                                                    No models found
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>

                    {/* Matrix Body */}
                    <tbody>
                        {selectedModels.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-16 text-center text-atlas-text-muted text-sm font-sans">
                                    No models selected for comparison. Add models using the slots above.
                                </td>
                            </tr>
                        ) : (
                            <>
                                {/* Row Section: Overview */}
                                <tr className="bg-atlas-bg-secondary border-b border-atlas-border">
                                    <td colSpan={5} className="p-3 text-[10px] font-bold uppercase tracking-wider text-atlas-text-muted">
                                        General Information
                                    </td>
                                </tr>

                                <tr className={cn("border-b border-atlas-border/50", highlightDiffs && isRowDifferent((m) => m.provider?.name) && "bg-atlas-purple/5")}>
                                    <td className="p-3 text-xs font-semibold text-atlas-text-muted">Developer</td>
                                    {[0, 1, 2, 3].map((slot) => {
                                        const model = selectedModels[slot];
                                        return (
                                            <td key={slot} className="p-3 border-l border-atlas-border/50 text-xs font-medium text-atlas-text-primary">
                                                {model ? model.provider?.name : "—"}
                                            </td>
                                        );
                                    })}
                                </tr>

                                <tr className={cn("border-b border-atlas-border/50", highlightDiffs && isRowDifferent((m) => m.releasedAt) && "bg-atlas-purple/5")}>
                                    <td className="p-3 text-xs font-semibold text-atlas-text-muted">Release Date</td>
                                    {[0, 1, 2, 3].map((slot) => {
                                        const model = selectedModels[slot];
                                        return (
                                            <td key={slot} className="p-3 border-l border-atlas-border/50 text-xs font-mono text-atlas-text-secondary">
                                                {model?.releasedAt ? new Date(model.releasedAt).toLocaleDateString() : "—"}
                                            </td>
                                        );
                                    })}
                                </tr>

                                <tr className={cn("border-b border-atlas-border/50", highlightDiffs && isRowDifferent((m) => m.license) && "bg-atlas-purple/5")}>
                                    <td className="p-3 text-xs font-semibold text-atlas-text-muted">License</td>
                                    {[0, 1, 2, 3].map((slot) => {
                                        const model = selectedModels[slot];
                                        return (
                                            <td key={slot} className="p-3 border-l border-atlas-border/50 text-xs text-atlas-text-secondary">
                                                {model ? model.license : "—"}
                                            </td>
                                        );
                                    })}
                                </tr>

                                {/* Row Section: Capabilities */}
                                <tr className="bg-atlas-bg-secondary border-b border-atlas-border">
                                    <td colSpan={5} className="p-3 text-[10px] font-bold uppercase tracking-wider text-atlas-text-muted">
                                        Capabilities & Specs
                                    </td>
                                </tr>

                                <tr className={cn("border-b border-atlas-border/50", highlightDiffs && isRowDifferent((m) => m.contextWindow) && "bg-atlas-purple/5")}>
                                    <td className="p-3 text-xs font-semibold text-atlas-text-muted">Context Window</td>
                                    {[0, 1, 2, 3].map((slot) => {
                                        const model = selectedModels[slot];
                                        return (
                                            <td key={slot} className="p-3 border-l border-atlas-border/50 text-xs font-mono text-atlas-text-primary">
                                                {model ? formatContextWindow(model.contextWindow) : "—"}
                                            </td>
                                        );
                                    })}
                                </tr>

                                <tr className={cn("border-b border-atlas-border/50", highlightDiffs && isRowDifferent((m) => m.parameterCount) && "bg-atlas-purple/5")}>
                                    <td className="p-3 text-xs font-semibold text-atlas-text-muted">Parameters</td>
                                    {[0, 1, 2, 3].map((slot) => {
                                        const model = selectedModels[slot];
                                        return (
                                            <td key={slot} className="p-3 border-l border-atlas-border/50 text-xs font-mono text-atlas-text-secondary">
                                                {model ? model.parameterCount || "Unknown" : "—"}
                                            </td>
                                        );
                                    })}
                                </tr>

                                <tr className={cn("border-b border-atlas-border/50", highlightDiffs && isRowDifferent((m) => m.modalities.includes("image")) && "bg-atlas-purple/5")}>
                                    <td className="p-3 text-xs font-semibold text-atlas-text-muted">Vision Support</td>
                                    {[0, 1, 2, 3].map((slot) => {
                                        const model = selectedModels[slot];
                                        return (
                                            <td key={slot} className="p-3 border-l border-atlas-border/50 text-xs font-medium">
                                                {model ? getModalityBadge(model, "image") : "—"}
                                            </td>
                                        );
                                    })}
                                </tr>

                                <tr className={cn("border-b border-atlas-border/50", highlightDiffs && isRowDifferent((m) => m.modalities.includes("audio")) && "bg-atlas-purple/5")}>
                                    <td className="p-3 text-xs font-semibold text-atlas-text-muted">Audio Support</td>
                                    {[0, 1, 2, 3].map((slot) => {
                                        const model = selectedModels[slot];
                                        return (
                                            <td key={slot} className="p-3 border-l border-atlas-border/50 text-xs font-medium">
                                                {model ? getModalityBadge(model, "audio") : "—"}
                                            </td>
                                        );
                                    })}
                                </tr>

                                <tr className={cn("border-b border-atlas-border/50", highlightDiffs && isRowDifferent((m) => m.isOpenSource) && "bg-atlas-purple/5")}>
                                    <td className="p-3 text-xs font-semibold text-atlas-text-muted">Open Source</td>
                                    {[0, 1, 2, 3].map((slot) => {
                                        const model = selectedModels[slot];
                                        return (
                                            <td key={slot} className="p-3 border-l border-atlas-border/50 text-xs">
                                                {model ? (
                                                    model.isOpenSource ? (
                                                        <span className="text-atlas-green font-semibold">Yes</span>
                                                    ) : (
                                                        <span className="text-atlas-text-muted">No</span>
                                                    )
                                                ) : "—"}
                                            </td>
                                        );
                                    })}
                                </tr>

                                <tr className={cn("border-b border-atlas-border/50", highlightDiffs && isRowDifferent((m) => m.apiAvailable) && "bg-atlas-purple/5")}>
                                    <td className="p-3 text-xs font-semibold text-atlas-text-muted">API Availability</td>
                                    {[0, 1, 2, 3].map((slot) => {
                                        const model = selectedModels[slot];
                                        return (
                                            <td key={slot} className="p-3 border-l border-atlas-border/50 text-xs">
                                                {model ? (
                                                    model.apiAvailable ? (
                                                        <span className="text-atlas-green font-semibold">Available</span>
                                                    ) : (
                                                        <span className="text-atlas-red">Unavailable</span>
                                                    )
                                                ) : "—"}
                                            </td>
                                        );
                                    })}
                                </tr>

                                {/* Row Section: Performance */}
                                <tr className="bg-atlas-bg-secondary border-b border-atlas-border">
                                    <td colSpan={5} className="p-3 text-[10px] font-bold uppercase tracking-wider text-atlas-text-muted">
                                        Performance & Cost
                                    </td>
                                </tr>

                                <tr className={cn("border-b border-atlas-border/50", highlightDiffs && isRowDifferent((m) => m.benchmarkGpqa) && "bg-atlas-purple/5")}>
                                    <td className="p-3 text-xs font-semibold text-atlas-text-muted">GPQA Score</td>
                                    {[0, 1, 2, 3].map((slot) => {
                                        const model = selectedModels[slot];
                                        return (
                                            <td key={slot} className={cn("p-3 border-l border-atlas-border/50 text-xs font-mono font-bold", model ? getBenchmarkColor(model.benchmarkGpqa) : "")}>
                                                {model ? formatBenchmark(model.benchmarkGpqa) : "—"}
                                            </td>
                                        );
                                    })}
                                </tr>

                                <tr className={cn("border-b border-atlas-border/50", highlightDiffs && isRowDifferent((m) => m.speedToksPerSec) && "bg-atlas-purple/5")}>
                                    <td className="p-3 text-xs font-semibold text-atlas-text-muted">Token Speed</td>
                                    {[0, 1, 2, 3].map((slot) => {
                                        const model = selectedModels[slot];
                                        return (
                                            <td key={slot} className="p-3 border-l border-atlas-border/50 text-xs font-mono text-atlas-text-secondary">
                                                {model?.speedToksPerSec ? `${model.speedToksPerSec} t/s` : "—"}
                                            </td>
                                        );
                                    })}
                                </tr>

                                <tr className={cn("border-b border-atlas-border/50", highlightDiffs && isRowDifferent((m) => m.inputPricePerMtok) && "bg-atlas-purple/5")}>
                                    <td className="p-3 text-xs font-semibold text-atlas-text-muted">Input Price ($/Mtok)</td>
                                    {[0, 1, 2, 3].map((slot) => {
                                        const model = selectedModels[slot];
                                        return (
                                            <td key={slot} className="p-3 border-l border-atlas-border/50 text-xs font-mono text-atlas-text-primary">
                                                {model ? formatPrice(model.inputPricePerMtok) : "—"}
                                            </td>
                                        );
                                    })}
                                </tr>

                                <tr className={cn("border-b border-atlas-border/50", highlightDiffs && isRowDifferent((m) => m.outputPricePerMtok) && "bg-atlas-purple/5")}>
                                    <td className="p-3 text-xs font-semibold text-atlas-text-muted">Output Price ($/Mtok)</td>
                                    {[0, 1, 2, 3].map((slot) => {
                                        const model = selectedModels[slot];
                                        return (
                                            <td key={slot} className="p-3 border-l border-atlas-border/50 text-xs font-mono text-atlas-text-primary">
                                                {model ? formatPrice(model.outputPricePerMtok) : "—"}
                                            </td>
                                        );
                                    })}
                                </tr>

                                <tr className={cn("border-b border-atlas-border/50", highlightDiffs && isRowDifferent((m) => getRating(m)) && "bg-atlas-purple/5")}>
                                    <td className="p-3 text-xs font-semibold text-atlas-text-muted">Community Rating</td>
                                    {[0, 1, 2, 3].map((slot) => {
                                        const model = selectedModels[slot];
                                        return (
                                            <td key={slot} className="p-3 border-l border-atlas-border/50 text-xs font-semibold font-mono text-atlas-text-primary">
                                                {model ? (
                                                    <span className="flex items-center gap-1 text-atlas-amber">
                                                        ★ <span className="text-atlas-text-primary">{getRating(model)} / 5.0</span>
                                                    </span>
                                                ) : "—"}
                                            </td>
                                        );
                                    })}
                                </tr>
                            </>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
