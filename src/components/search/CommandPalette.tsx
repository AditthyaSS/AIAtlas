"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Model } from "@/types";
import { cn } from "@/lib/utils";

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Model[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setQuery("");
            setResults([]);
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 10);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const fetchResults = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/models?search=${encodeURIComponent(query)}`);
                const json = await res.json();
                setResults(json.data || []);
                setSelectedIndex(0); 
            } catch (err) {
                console.error("Search failed:", err);
            } finally {
                setIsLoading(false);
            }
        };

        const timer = setTimeout(fetchResults, 300); 
        return () => clearTimeout(timer);
    }, [query]);

    
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prev) => (prev + 1) % results.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (results[selectedIndex]) {
                router.push(`/models/${results[selectedIndex].slug}`);
                onClose();
            }
        } else if (e.key === "Escape") {
            e.preventDefault();
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] sm:pt-[20vh] bg-atlas-bg-primary/80 backdrop-blur-sm px-4"
            onClick={onClose} 
        >
            <div 
                className="w-full max-w-2xl bg-atlas-bg-card border border-atlas-border rounded-xl shadow-2xl overflow-hidden animate-fade-in"
                onClick={(e) => e.stopPropagation()} 
            >
                {/* Search Input */}
                <div className="flex items-center px-4 border-b border-atlas-border">
                    <svg className="w-5 h-5 text-atlas-text-muted mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search models by name, provider, or tag..."
                        className="w-full bg-transparent py-4 text-atlas-text-primary placeholder:text-atlas-text-muted focus:outline-none text-lg"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button 
                        onClick={onClose}
                        className="px-2 py-1 text-xs font-mono bg-atlas-bg-secondary text-atlas-text-muted rounded border border-atlas-border hover:text-atlas-text-primary"
                    >
                        ESC
                    </button>
                </div>

                {/* Search Results */}
                {query && (
                    <div className="max-h-[60vh] overflow-y-auto p-2">
                        {isLoading ? (
                            <div className="p-4 text-center text-sm text-atlas-text-muted font-mono">Searching...</div>
                        ) : results.length > 0 ? (
                            results.map((model, idx) => (
                                <div
                                    key={model.id}
                                    onClick={() => {
                                        router.push(`/models/${model.slug}`);
                                        onClose();
                                    }}
                                    onMouseEnter={() => setSelectedIndex(idx)}
                                    className={cn(
                                        "flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors",
                                        selectedIndex === idx 
                                            ? "bg-atlas-blue/10 border-atlas-blue/30 text-atlas-blue" 
                                            : "hover:bg-atlas-bg-secondary text-atlas-text-primary border border-transparent"
                                    )}
                                >
                                    <div>
                                        <div className="font-medium">{model.name}</div>
                                        <div className="text-xs text-atlas-text-muted mt-1">{model.provider?.name || "Unknown Provider"}</div>
                                    </div>
                                    <div className="flex gap-2">
                                        {model.tags.slice(0, 2).map(tag => (
                                            <span key={tag} className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded bg-atlas-bg-tertiary text-atlas-text-muted">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-center text-sm text-atlas-text-muted">
                                No models found for &quot;{query}&quot;
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}