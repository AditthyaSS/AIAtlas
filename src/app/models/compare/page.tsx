"use client";

import { Suspense } from "react";
import { CompareDashboard } from "@/components/models/CompareDashboard";

export default function ComparePage() {
    return (
        <div className="min-h-screen font-sans bg-background text-foreground">
            <Suspense fallback={
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
                    <div className="h-8 w-64 bg-atlas-bg-tertiary rounded mb-4"></div>
                    <div className="h-4 w-96 bg-atlas-bg-tertiary rounded mb-8"></div>
                    <div className="h-[400px] w-full bg-atlas-bg-tertiary rounded"></div>
                </div>
            }>
                <CompareDashboard />
            </Suspense>
        </div>
    );
}
