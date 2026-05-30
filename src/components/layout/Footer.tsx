import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t border-atlas-border bg-atlas-bg-primary">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="font-mono text-lg font-bold tracking-tight">
                            AI<span className="text-atlas-green">Atlas</span>
                        </Link>
                        <p className="mt-2 text-sm text-atlas-text-muted max-w-xs">
                            The open, community-powered map of the AI ecosystem.
                        </p>
                    </div>

                    {/* Directory */}
                    <div>
                        <h3 className="font-sans font-semibold text-xs uppercase tracking-widest text-atlas-text-muted mb-3">
                            Directory
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/models" className="text-atlas-text-secondary hover:text-atlas-text-primary transition-colors">
                                    Models
                                </Link>
                            </li>
                            <li>
                                <Link href="/tools" className="text-atlas-text-secondary hover:text-atlas-text-primary transition-colors">
                                    Tools
                                </Link>
                            </li>
                            <li>
                                <Link href="/repos" className="text-atlas-text-secondary hover:text-atlas-text-primary transition-colors">
                                    Repos
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Community */}
                    <div>
                        <h3 className="font-sans font-semibold text-xs uppercase tracking-widest text-atlas-text-muted mb-3">
                            Community
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/feed" className="text-atlas-text-secondary hover:text-atlas-text-primary transition-colors">
                                    Live Feed
                                </Link>
                            </li>
                            <li>
                                <Link href="/contribute" className="text-atlas-text-secondary hover:text-atlas-text-primary transition-colors">
                                    Contribute
                                </Link>
                            </li>
                            <li>
                                <a
                                    href="https://github.com/aditthyass/aiatlas"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-atlas-text-secondary hover:text-atlas-text-primary transition-colors"
                                >
                                    GitHub
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="font-sans font-semibold text-xs uppercase tracking-widest text-atlas-text-muted mb-3">
                            Resources
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <span className="text-atlas-text-muted">API Docs (coming soon)</span>
                            </li>
                            <li>
                                <span className="text-atlas-text-muted">Embed Widget (v2)</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-8 pt-6 border-t border-atlas-border flex flex-col sm:flex-row justify-between items-center gap-2">
                    <p className="text-xs text-atlas-text-muted">
                        © {new Date().getFullYear()} AIAtlas — Open source · Community maintained
                    </p>
                    <p className="text-xs text-atlas-text-muted font-mono">
                        v1.0.0
                    </p>
                </div>
            </div>
        </footer>
    );
}
