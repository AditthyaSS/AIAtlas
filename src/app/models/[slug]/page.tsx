"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { formatPrice, formatContextWindow, formatBenchmark, getBenchmarkColor, cn } from "@/lib/utils";
import { ReviewSection } from "@/components/models/ReviewSection";
import { ModelDetailSkeleton } from "@/components/ui/Skeletons";
import { Model } from "@/types";

export default function ModelDetailPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [model, setModel] = useState<Model | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        setIsLoading(true);
        setNotFound(false);

        fetch(`/api/models/${encodeURIComponent(slug)}`, { signal: controller.signal })
            .then((res) => {
                if (res.status === 404) {
                    setNotFound(true);
                    return null;
                }
                return res.json();
            })
            .then((json) => {
                if (json?.data) {
                    setModel(json.data as Model);
                }
            })
            .catch((err) => {
                if ((err as Error).name === "AbortError") return;
            })
            .finally(() => setIsLoading(false));

        return () => controller.abort();
    }, [slug]);

    if (isLoading) {
        return <ModelDetailSkeleton />;
    }

    if (!model || notFound) {
        return (
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <h1 className="text-2xl font-bold text-atlas-text-primary mb-2">Model not found</h1>
                <p className="text-atlas-text-muted mb-6">
                    The model &quot;{slug}&quot; doesn&apos;t exist in our directory.
                </p>
                <Link href="/models" className="text-atlas-blue hover:underline text-sm">
                    ← Back to Models
                </Link>
            </div>
        );
    }

    const benchmarks = [
        { label: "GPQA", value: model.benchmarkGpqa, max: 100 },
        { label: "MMLU", value: model.benchmarkMmlu, max: 100 },
        { label: "HLE", value: model.benchmarkHle, max: 100 },
    ].filter((b) => b.value !== undefined && b.value !== null);

    return (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <nav className="mb-6">
                <ol className="flex items-center gap-2 text-sm text-atlas-text-muted">
                    <li>
                        <Link href="/models" className="hover:text-atlas-text-secondary transition-colors">
                            Models
                        </Link>
                    </li>
                    <li>/</li>
                    <li className="text-atlas-text-primary">{model.name}</li>
                </ol>
            </nav>

            {/* Hero */}
            <div className="mb-8 pb-8 border-b border-atlas-border">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-sans font-bold text-atlas-text-primary">
                                {model.name}
                            </h1>
                            {model.isVerified && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono uppercase tracking-wider bg-atlas-green/10 text-atlas-green border border-atlas-green/20 rounded">
                                    ✓ Verified
                                </span>
                            )}
                            {model.isOpenSource && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono uppercase tracking-wider bg-atlas-purple/10 text-atlas-purple border border-atlas-purple/20 rounded">
                                    Open Source
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-atlas-text-secondary mb-3">
                            by{" "}
                            <span className="text-atlas-text-primary font-medium">
                                {model.provider?.name}
                            </span>
                        </p>
                        {model.description && (
                            <p className="text-atlas-text-secondary max-w-2xl">
                                {model.description}
                            </p>
                        )}
                    </div>

                    {/* Modality badges */}
                    <div className="flex flex-wrap gap-2">
                        {model.modalities.map((mod) => (
                            <span
                                key={mod}
                                className="px-2 py-1 text-xs font-mono uppercase tracking-wider rounded bg-atlas-blue/10 text-atlas-blue border border-atlas-blue/20"
                            >
                                {mod}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                <SpecCard label="Context Window" value={formatContextWindow(model.contextWindow)} />
                <SpecCard label="Speed" value={model.speedToksPerSec ? `${model.speedToksPerSec} t/s` : "—"} />
                <SpecCard label="Input Price" value={`${formatPrice(model.inputPricePerMtok)}/M`} />
                <SpecCard label="Output Price" value={`${formatPrice(model.outputPricePerMtok)}/M`} />
                <SpecCard label="Parameters" value={model.parameterCount || "—"} />
                <SpecCard label="License" value={model.license || "—"} />
            </div>

            {/* Benchmark Scores */}
            {benchmarks.length > 0 && (
                <div className="mb-8">
                    <h2 className="font-sans font-semibold text-sm uppercase tracking-widest text-atlas-text-muted mb-4">
                        Benchmark Scores
                    </h2>
                    <div className="space-y-3 max-w-xl">
                        {benchmarks.map((b) => (
                            <div key={b.label} className="flex items-center gap-4">
                                <span className="w-12 text-xs font-mono text-atlas-text-muted text-right">
                                    {b.label}
                                </span>
                                <div className="flex-1 h-6 bg-atlas-bg-secondary rounded-full overflow-hidden border border-atlas-border/50">
                                    <div
                                        className={cn(
                                            "h-full rounded-full transition-all duration-500",
                                            b.value! >= 85
                                                ? "bg-atlas-green/30"
                                                : b.value! >= 70
                                                    ? "bg-atlas-amber/30"
                                                    : "bg-atlas-red/30"
                                        )}
                                        style={{ width: `${(b.value! / b.max) * 100}%` }}
                                    />
                                </div>
                                <span
                                    className={cn(
                                        "w-12 text-sm font-mono font-medium text-right",
                                        getBenchmarkColor(b.value)
                                    )}
                                >
                                    {formatBenchmark(b.value)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tags */}
            {model.tags.length > 0 && (
                <div className="mb-8">
                    <h2 className="font-sans font-semibold text-sm uppercase tracking-widest text-atlas-text-muted mb-4">
                        Tags
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {model.tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-2 py-1 text-xs font-mono uppercase tracking-wider rounded bg-atlas-bg-tertiary text-atlas-text-secondary border border-atlas-border"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Community Reviews */}
            <ReviewSection
                modelId={model.id}
                modelName={model.name}
                initialReviews={model.reviews ?? []}
            />

            {/* Back link */}
            <Link
                href="/models"
                className="inline-flex items-center gap-1 text-sm text-atlas-text-muted hover:text-atlas-text-secondary transition-colors"
            >
                ← Back to Models
            </Link>
        </div>
    );
}

function SpecCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="p-3 bg-atlas-bg-card border border-atlas-border rounded-lg">
            <p className="text-[10px] font-mono uppercase tracking-wider text-atlas-text-muted mb-1">
                {label}
            </p>
            <p className="font-mono text-sm font-medium text-atlas-text-primary">
                {value}
            </p>
        </div>
    );
}
