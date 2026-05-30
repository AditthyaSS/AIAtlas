"use client";

import { useState } from "react";
import { FeedEvent } from "@/types";
import { timeAgo } from "@/lib/utils";

interface FeedTickerProps {
    events: FeedEvent[];
}

const eventLabels: Record<string, string> = {
    model_added: "added",
    review_posted: "reviewed",
    price_updated: "pricing updated",
    tool_added: "added",
};

function renderEventItem(event: FeedEvent, suffix = "") {
    return (
        <div
            key={`${event.id}${suffix}`}
            role="listitem"
            className="flex items-center gap-2 shrink-0 text-sm"
        >
            <span className="relative flex h-1.5 w-1.5">
                <span className="animate-pulse-dot absolute inline-flex h-full w-full rounded-full bg-atlas-green opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-atlas-green" />
            </span>

            <span className="font-mono text-xs text-atlas-text-muted">
                {timeAgo(event.createdAt)}
            </span>

            <span className="text-atlas-text-secondary text-xs">
                <span className="text-atlas-text-primary font-medium">
                    {event.entityName}
                </span>{" "}
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
    );
}

export function FeedTicker({ events }: FeedTickerProps) {
    const [isPaused, setIsPaused] = useState(false);

    if (events.length === 0) return null;

    return (
        <div className="w-full overflow-hidden bg-atlas-bg-secondary/50 border-b border-atlas-border">
            <div className="max-w-[1400px] mx-auto flex items-center gap-6 px-4 py-2">
                <span className="shrink-0 text-[10px] font-mono uppercase tracking-widest text-atlas-text-muted">
                    Activity
                </span>

                <div
                    className="flex-1 overflow-hidden"
                    aria-label="Live activity ticker"
                    tabIndex={0}
                    onPointerEnter={() => setIsPaused(true)}
                    onPointerLeave={() => setIsPaused(false)}
                    onFocus={() => setIsPaused(true)}
                    onBlur={() => setIsPaused(false)}
                >
                    <div
                        className="inline-flex min-w-full items-center gap-6 animate-feed-slide motion-reduce:animate-none"
                        style={{
                            animationPlayState: isPaused ? "paused" : "running",
                        }}
                    >
                        <div
                            role="list"
                            className="inline-flex items-center gap-6 shrink-0"
                        >
                            {events.map((event) => renderEventItem(event))}
                        </div>

                        <div
                            aria-hidden="true"
                            className="inline-flex items-center gap-6 shrink-0"
                        >
                            {events.map((event) =>
                                renderEventItem(event, "-clone")
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}