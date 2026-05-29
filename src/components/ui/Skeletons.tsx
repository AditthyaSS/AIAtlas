export function ModelTableSkeleton({ rows = 6 }: { rows?: number }) {
    return (
        <div className="w-full overflow-x-auto border border-atlas-border rounded-lg bg-atlas-bg-primary">
            <div className="flex items-center justify-between px-4 py-2 border-b border-atlas-border bg-atlas-bg-secondary">
                <div className="h-4 w-48 rounded bg-atlas-bg-tertiary animate-pulse motion-reduce:animate-none" />
                <div className="h-4 w-20 rounded bg-atlas-bg-tertiary animate-pulse motion-reduce:animate-none" />
            </div>
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-atlas-border">
                        <th className="px-3 py-3 text-left text-xs uppercase tracking-widest text-atlas-text-muted w-12">
                            #
                        </th>
                        <th className="px-3 py-3 text-left text-xs uppercase tracking-widest text-atlas-text-muted min-w-[180px]">
                            Model
                        </th>
                        <th className="px-3 py-3 text-left text-xs uppercase tracking-widest text-atlas-text-muted">
                            Provider
                        </th>
                        <th className="px-3 py-3 text-left text-xs uppercase tracking-widest text-atlas-text-muted">
                            Context
                        </th>
                        <th className="px-3 py-3 text-left text-xs uppercase tracking-widest text-atlas-text-muted">
                            Speed
                        </th>
                        <th className="px-3 py-3 text-left text-xs uppercase tracking-widest text-atlas-text-muted">
                            Input $/M
                        </th>
                        <th className="px-3 py-3 text-left text-xs uppercase tracking-widest text-atlas-text-muted">
                            Output $/M
                        </th>
                        <th className="px-3 py-3 text-left text-xs uppercase tracking-widest text-atlas-text-muted">
                            GPQA
                        </th>
                        <th className="px-3 py-3 text-left text-xs uppercase tracking-widest text-atlas-text-muted">
                            License
                        </th>
                        <th className="px-3 py-3 text-left text-xs uppercase tracking-widest text-atlas-text-muted">
                            Tags
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: rows }).map((_, idx) => (
                        <tr key={idx} className="border-b border-atlas-border/50 bg-atlas-bg-secondary">
                            <td className="px-3 py-3">
                                <span className="h-4 w-6 rounded bg-atlas-bg-tertiary animate-pulse motion-reduce:animate-none inline-block" />
                            </td>
                            <td className="px-3 py-3">
                                <span className="h-4 w-32 rounded bg-atlas-bg-tertiary animate-pulse motion-reduce:animate-none inline-block" />
                            </td>
                            <td className="px-3 py-3">
                                <span className="h-4 w-20 rounded bg-atlas-bg-tertiary animate-pulse motion-reduce:animate-none inline-block" />
                            </td>
                            <td className="px-3 py-3">
                                <span className="h-4 w-16 rounded bg-atlas-bg-tertiary animate-pulse motion-reduce:animate-none inline-block" />
                            </td>
                            <td className="px-3 py-3">
                                <span className="h-4 w-16 rounded bg-atlas-bg-tertiary animate-pulse motion-reduce:animate-none inline-block" />
                            </td>
                            <td className="px-3 py-3">
                                <span className="h-4 w-20 rounded bg-atlas-bg-tertiary animate-pulse motion-reduce:animate-none inline-block" />
                            </td>
                            <td className="px-3 py-3">
                                <span className="h-4 w-20 rounded bg-atlas-bg-tertiary animate-pulse motion-reduce:animate-none inline-block" />
                            </td>
                            <td className="px-3 py-3">
                                <span className="h-4 w-12 rounded bg-atlas-bg-tertiary animate-pulse motion-reduce:animate-none inline-block" />
                            </td>
                            <td className="px-3 py-3">
                                <span className="h-4 w-14 rounded bg-atlas-bg-tertiary animate-pulse motion-reduce:animate-none inline-block" />
                            </td>
                            <td className="px-3 py-3">
                                <div className="flex flex-wrap gap-1">
                                    <span className="h-4 w-14 rounded bg-atlas-bg-tertiary animate-pulse motion-reduce:animate-none inline-block" />
                                    <span className="h-4 w-10 rounded bg-atlas-bg-tertiary animate-pulse motion-reduce:animate-none inline-block" />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export function ModelCardSkeleton({ count = 8 }: { count?: number }) {
    return (
        <>
            {Array.from({ length: count }).map((_, idx) => (
                <div
                    key={idx}
                    className="p-4 bg-atlas-bg-card border border-atlas-border rounded-lg animate-pulse motion-reduce:animate-none"
                >
                    <div className="flex items-center justify-between gap-3 mb-4">
                        <div className="space-y-2 flex-1">
                            <div className="h-5 w-40 rounded bg-atlas-bg-tertiary" />
                            <div className="h-4 w-24 rounded bg-atlas-bg-tertiary" />
                        </div>
                        <div className="h-6 w-14 rounded bg-atlas-bg-tertiary" />
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="space-y-2">
                            <div className="h-3 w-20 rounded bg-atlas-bg-tertiary" />
                            <div className="h-4 w-16 rounded bg-atlas-bg-tertiary" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-3 w-20 rounded bg-atlas-bg-tertiary" />
                            <div className="h-4 w-16 rounded bg-atlas-bg-tertiary" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-3 w-20 rounded bg-atlas-bg-tertiary" />
                            <div className="h-4 w-16 rounded bg-atlas-bg-tertiary" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-3 w-20 rounded bg-atlas-bg-tertiary" />
                            <div className="h-4 w-16 rounded bg-atlas-bg-tertiary" />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <span className="h-6 w-20 rounded bg-atlas-bg-tertiary" />
                        <span className="h-6 w-16 rounded bg-atlas-bg-tertiary" />
                        <span className="h-6 w-12 rounded bg-atlas-bg-tertiary" />
                    </div>
                </div>
            ))}
        </>
    );
}

export function FeedItemSkeleton({ count = 4 }: { count?: number }) {
    return (
        <>
            {Array.from({ length: count }).map((_, idx) => (
                <div
                    key={idx}
                    className="flex items-start gap-4 p-4 bg-atlas-bg-secondary border border-atlas-border rounded-lg animate-pulse motion-reduce:animate-none"
                >
                    <div className="flex items-center gap-2 shrink-0 mt-0.5">
                        <span className="h-2 w-2 rounded-full bg-atlas-bg-tertiary" />
                        <span className="h-6 w-6 rounded-full bg-atlas-bg-tertiary" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-3 py-1">
                        <div className="h-4 w-24 rounded bg-atlas-bg-tertiary" />
                        <div className="h-4 w-full rounded bg-atlas-bg-tertiary" />
                        <div className="h-4 w-3/4 rounded bg-atlas-bg-tertiary" />
                    </div>
                </div>
            ))}
        </>
    );
}

export function ModelDetailSkeleton() {
    return (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div className="space-y-4 animate-pulse motion-reduce:animate-none">
                <div className="h-10 w-1/4 rounded bg-atlas-bg-tertiary" />
                <div className="h-12 w-3/4 rounded bg-atlas-bg-tertiary" />
                <div className="h-4 w-2/5 rounded bg-atlas-bg-tertiary" />
                <div className="h-4 w-full max-w-2xl rounded bg-atlas-bg-tertiary" />
                <div className="h-4 w-5/6 rounded bg-atlas-bg-tertiary" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {Array.from({ length: 6 }).map((_, idx) => (
                    <div key={idx} className="p-3 bg-atlas-bg-card border border-atlas-border rounded-lg">
                        <div className="h-3 w-24 rounded bg-atlas-bg-tertiary mb-3" />
                        <div className="h-6 w-16 rounded bg-atlas-bg-tertiary" />
                    </div>
                ))}
            </div>

            <div className="space-y-3 max-w-xl">
                {Array.from({ length: 3 }).map((_, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                        <span className="w-12 h-4 rounded bg-atlas-bg-tertiary" />
                        <div className="flex-1 h-6 bg-atlas-bg-tertiary rounded-full" />
                        <span className="w-12 h-4 rounded bg-atlas-bg-tertiary" />
                    </div>
                ))}
            </div>
        </div>
    );
}
