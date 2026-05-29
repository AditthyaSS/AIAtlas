"use client";

import { FeedEvent } from "@/types";
import { timeAgo } from "@/lib/utils";

interface FeedTickerProps {
    events: FeedEvent[];
}

const eventIcons: Record<string, string> = {
    model_added: "✦",
    review_posted: "★",
    price_updated: "↻",
    tool_added: "⚡",
};

const eventLabels: Record<string, string> = {
    model_added: "added",
    review_posted: "reviewed",
    price_updated: "pricing updated",
    tool_added: "added",
};

export function FeedTicker({ events }: FeedTickerProps) {
    if (events.length === 0) return null;

    return (
        <div className="w-full overflow-hidden bg-atlas-bg-secondary/50 border-b border-atlas-border">
            <div className="max-w-[1400px] mx-auto px-4 py-2">
                <div className="flex items-center gap-6 overflow-x-auto scrollbar-none">
                    <span className="shrink-0 text-[10px] font-mono uppercase tracking-widest text-atlas-text-muted">
                        Activity
                    </span>
                    {events.map((event) => (
                        <div
                            key={event.id}
                            className="flex items-center gap-2 shrink-0 text-sm animate-fade-in"
                        >
                            {/* Pulse dot */}
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-pulse-dot absolute inline-flex h-full w-full rounded-full bg-atlas-green opacity-75" />
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-atlas-green" />
                            </span>

                            <span suppressHydrationWarning className="font-mono text-xs text-atlas-text-muted">
                                {timeAgo(event.createdAt)}
                            </span>

                            <span className="text-atlas-text-secondary text-xs">
                                <span className="text-atlas-text-primary font-medium">
                                    {event.entityName}
                                </span>
                                {" "}
                                {eventLabels[event.eventType] || event.eventType}
                                {event.user && (
                                    <>
                                        {" by "}
                                        <span className="text-atlas-purple font-medium">
                                            @{event.user.githubUsername}
                                        </span>
                                    </>
                                )}
                            </span>

                            <span className="text-atlas-border">·</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}