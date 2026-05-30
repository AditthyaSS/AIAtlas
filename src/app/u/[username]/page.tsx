import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma"; 

export default async function UserProfilePage({ 
    params 
}: { 
    params: { username: string } 
}) {
    const user = await prisma.user.findUnique({
        where: { githubUsername: params.username },
        include: {
            reviews: {
                orderBy: { createdAt: 'desc' },
                take: 5, 
            },
            contributions: {
                orderBy: { createdAt: 'desc' },
                take: 5, 
            }
        }
    });

    if (!user) {
        notFound();
    }

    const avatar = user.avatarUrl || "https://avatars.githubusercontent.com/u/9919?v=4";

    return (
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
            
            {/* 👤 Profile Header (Clean & Minimal) */}
            <div className="pb-10 border-b border-atlas-border flex flex-col sm:flex-row items-start gap-6">
                <img
                    src={avatar}
                    alt={`${user.githubUsername}`}
                    className="w-24 h-24 rounded-full border border-atlas-border object-cover"
                />
                <div className="flex-1 mt-2 sm:mt-0">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold text-atlas-text-primary tracking-tight">
                            {user.githubUsername}
                        </h1>
                        <span className="px-2.5 py-0.5 rounded bg-atlas-bg-secondary border border-atlas-border/50 text-xs font-mono text-atlas-green">
                            {user.contributionScore} XP
                        </span>
                    </div>
                    <p className="text-sm text-atlas-text-secondary mt-3 max-w-2xl leading-relaxed">
                        {user.bio || "No bio provided."}
                    </p>
                    <p className="text-xs font-mono text-atlas-text-muted mt-5">
                        Member since {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                    </p>
                </div>
            </div>

            {/* 📊 Activity Section (Flat Layout) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-12">
                
                {/* Recent Reviews List */}
                <div>
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-atlas-text-muted mb-6">
                        Recent Reviews
                    </h2>
                    {user.reviews.length > 0 ? (
                        <div className="space-y-8">
                            {user.reviews.map((review) => (
                                <div key={review.id} className="group">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-sm font-medium text-atlas-text-primary capitalize">
                                            {review.entityId}
                                        </span>
                                        <div className="flex gap-0.5">
                                            {/* Minimalist CSS Stars */}
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <span key={i} className={`text-xs ${i < review.rating ? 'text-atlas-green' : 'text-atlas-border/50'}`}>
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-sm text-atlas-text-secondary leading-relaxed">
                                        {review.comment || "No comment provided."}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-atlas-text-muted">No reviews yet.</p>
                    )}
                </div>

                {/* Contributions List */}
                <div>
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-atlas-text-muted mb-6">
                        Contributions
                    </h2>
                    {user.contributions.length > 0 ? (
                        <div className="space-y-2">
                            {user.contributions.map((contribution) => (
                                <div key={contribution.id} className="flex items-center justify-between py-3 border-b border-atlas-border/40 last:border-0">
                                    <div>
                                        <p className="text-sm font-medium text-atlas-text-primary capitalize">
                                            {contribution.action} {contribution.entityType}
                                        </p>
                                        <p className="text-[11px] font-mono text-atlas-text-muted mt-1.5">
                                            {new Date(contribution.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </p>
                                    </div>
                                    <span className={`text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-sm border ${
                                        contribution.status === 'approved'
                                            ? 'bg-atlas-green/10 text-atlas-green border-atlas-green/20'
                                            : 'bg-atlas-bg-secondary text-atlas-text-secondary border-atlas-border'
                                    }`}>
                                        {contribution.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-atlas-text-muted">No contributions yet.</p>
                    )}
                </div>
            </div>

        </div>
    );
}