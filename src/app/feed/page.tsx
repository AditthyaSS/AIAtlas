"use client";

import { useLiveFeed } from "@/hooks/useLiveFeed";
import { timeAgo } from "@/lib/utils";
import { FeedEvent } from "@/types";
import { FeedItemSkeleton } from "@/components/ui/Skeletons";

const eventTypeConfig: Record<string, { icon: string; color: string; label: string }> = {
    model_added: { icon: "✦", color: "text-atlas-green", label: "Model Added" },
    review_posted: { icon: "★", color: "text-atlas-amber", label: "Review Posted" },
    price_updated: { icon: "↻", color: "text-atlas-blue", label: "Price Updated" },
    tool_added: { icon: "⚡", color: "text-atlas-purple", label: "Tool Added" },
};

export default function FeedPage() {
    const { events, isLoading } = useLiveFeed();

    return (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-sans font-bold text-atlas-text-primary mb-1">
                        Live Feed
                    </h1>
                    <p className="text-sm text-atlas-text-muted">
                        Real-time activity across the AIAtlas community
                    </p>
                </div>
                {/* Live indicator */}
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-mono text-xs uppercase tracking-wider text-atlas-green bg-atlas-green/10 border border-atlas-green/20">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-atlas-green opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-atlas-green" />
                    </span>
                    Live
                </span>
            </div>

            {/* Feed Items */}
            <div className="space-y-2 max-w-3xl">
                {isLoading ? (
                    <FeedItemSkeleton count={4} />
                ) : (
                    events.map((event) => (
                        <FeedItem key={event.id} event={event} />
                    ))
                )}

                {!isLoading && events.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-atlas-text-muted text-sm">No activity yet.</p>
                    </div>
                )}

                {!isLoading && events.length > 0 && (
                    <div className="text-center py-8">
                        <p className="text-xs text-atlas-text-muted font-mono">
                            — {events.length} events shown —
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

function FeedItem({ event }: { event: FeedEvent }) {
    const config = eventTypeConfig[event.eventType] ?? {
        icon: "•",
        color: "text-atlas-text-secondary",
        label: event.eventType,
    };

    return (
        <div className="flex items-start gap-4 p-4 bg-atlas-bg-secondary border border-atlas-border rounded-lg hover:border-atlas-border-hover transition-colors animate-fade-in">
            {/* Pulse + Icon */}
            <div className="flex items-center gap-2 shrink-0 mt-0.5">
                <span className="relative flex h-2 w-2">
                    <span className="animate-pulse-dot absolute inline-flex h-full w-full rounded-full bg-atlas-green opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-atlas-green" />
                </span>
                <span className={`text-lg ${config.color}`}>{config.icon}</span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-atlas-bg-tertiary text-atlas-text-muted border border-atlas-border/50">
                        {config.label}
                    </span>
                    <span className="text-xs font-mono text-atlas-text-muted">
                        {timeAgo(event.createdAt)}
                    </span>
                </div>
                <p className="text-sm text-atlas-text-secondary">
                    <span className="font-medium text-atlas-text-primary">
                        {event.entityName}
                    </span>
                    {event.user && (
                        <>
                            {" "}by{" "}
                            <span className="text-atlas-purple font-medium">
                                @{event.user.githubUsername}
                            </span>
                        </>
                    )}
                    {event.metadata &&
                        (event.metadata as Record<string, unknown>).field === "inputPricePerMtok" && (
                            <span className="text-atlas-text-muted">
                                {" "}— input pricing changed from $
                                {String((event.metadata as Record<string, unknown>).oldValue)} to $
                                {String((event.metadata as Record<string, unknown>).newValue)}/M
                            </span>
                        )}
                </p>
            </div>
        </div>
    );
}
