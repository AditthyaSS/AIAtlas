"use client";

import { CommandPalette } from "@/components/search/CommandPalette";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/providers/ThemeProvider";

const navLinks = [
    { href: "/", label: "Leaderboard" },
    { href: "/models", label: "Models" },
    { href: "/tools", label: "Tools" },
    { href: "/repos", label: "Repos" },
    { href: "/feed", label: "Feed" },
];

export function Navbar() {
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const [mobileOpen, setMobileOpen] = useState(false);
    const { theme, toggle } = useTheme();
    
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // Global ⌘K / Ctrl+K listener
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault(); 
                setIsSearchOpen((prev) => !prev);
            }
        };
        
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <header className="sticky top-0 z-50 w-full glass border-b border-atlas-border">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-14 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 shrink-0">
                        <span className="font-mono text-lg font-bold tracking-tight">
                            AI<span className="text-atlas-green">Atlas</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => {
                            const isActive =
                                link.href === "/"
                                    ? pathname === "/"
                                    : pathname.startsWith(link.href);
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                                        isActive
                                            ? "text-atlas-text-primary bg-atlas-bg-tertiary"
                                            : "text-atlas-text-secondary hover:text-atlas-text-primary hover:bg-atlas-bg-tertiary/50"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setIsSearchOpen(true)}
                            className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm text-atlas-text-muted bg-atlas-bg-secondary border border-atlas-border rounded-md hover:border-atlas-border-hover transition-colors"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.3-4.3" />
                            </svg>
                            <span>Search…</span>
                            <kbd className="ml-2 font-mono text-xs bg-atlas-bg-tertiary px-1.5 py-0.5 rounded">
                                ⌘K
                            </kbd>
                        </button>

                        {/* Contribute CTA */}
                        <Link
                            href="/contribute"
                            className="hidden sm:inline-flex px-3 py-1.5 text-sm font-medium bg-atlas-green/10 text-atlas-green border border-atlas-green/20 rounded-md hover:bg-atlas-green/20 transition-colors"
                        >
                            Contribute
                        </Link>

                        {/* Theme toggle */}
                        <button
                            onClick={toggle}
                            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                            className="p-1.5 rounded-md text-atlas-text-secondary hover:text-atlas-text-primary hover:bg-atlas-bg-tertiary transition-colors"
                        >
                            {theme === "dark" ? (
                                /* Sun icon */
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="4"/>
                                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
                                </svg>
                            ) : (
                                /* Moon icon */
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
                                </svg>
                            )}
                        </button>

                        {/* Auth button */}
                        {status === "loading" ? (
                            <div className="w-8 h-8 rounded-full bg-atlas-bg-tertiary animate-pulse" />
                        ) : session?.user ? (
                            <div className="relative group flex items-center gap-2">
                                {/* Avatar acts as Dropdown Trigger */}
                                <button className="focus:outline-none ring-2 ring-transparent hover:ring-atlas-border rounded-full transition-all">
                                    {session.user.image ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={session.user.image}
                                            alt={session.user.name ?? "User"}
                                            className="w-8 h-8 rounded-full border border-atlas-border object-cover"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-atlas-bg-tertiary border border-atlas-border flex items-center justify-center text-xs font-mono text-atlas-text-secondary">
                                            {session.user.name?.[0]?.toUpperCase() ?? "U"}
                                        </div>
                                    )}
                                </button>
                                
                                {/* Dropdown Menu (Hover to open) */}
                                <div className="absolute right-0 top-[120%] w-48 bg-atlas-bg-secondary border border-atlas-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden flex flex-col">
                                    <div className="px-4 py-3 border-b border-atlas-border/50">
                                        <p className="text-xs text-atlas-text-muted">Signed in as</p>
                                        <p className="text-sm font-medium text-atlas-text-primary truncate">
                                            {session.user.name} 
                                        </p>
                                    </div>
                                    
                                    <Link 
                                        href={`/u/${(session.user as any).githubUsername || 'developer'}`} 
                                        className="px-4 py-2.5 text-sm text-atlas-text-secondary hover:text-atlas-text-primary hover:bg-atlas-bg-tertiary transition-colors flex items-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                        My Profile
                                    </Link>
                                    
                                    <button
                                        onClick={() => signOut({ callbackUrl: "/" })}
                                        className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-2 border-t border-atlas-border/50"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => signIn("github")}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-atlas-text-secondary border border-atlas-border rounded-md hover:border-atlas-border-hover hover:text-atlas-text-primary transition-colors"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                                </svg>
                                Sign in
                            </button>
                        )}

                        {/* Mobile menu button */}
                        <button
                            className="md:hidden p-1.5 text-atlas-text-secondary hover:text-atlas-text-primary"
                            onClick={() => setMobileOpen((v) => !v)}
                            aria-label="Toggle menu"
                        >
                            {mobileOpen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="4" x2="20" y1="12" y2="12" />
                                    <line x1="4" x2="20" y1="6" y2="6" />
                                    <line x1="4" x2="20" y1="18" y2="18" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileOpen && (
                    <div className="md:hidden border-t border-atlas-border py-3 space-y-1">
                        {navLinks.map((link) => {
                            const isActive =
                                link.href === "/"
                                    ? pathname === "/"
                                    : pathname.startsWith(link.href);
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={cn(
                                        "block px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                        isActive
                                            ? "text-atlas-text-primary bg-atlas-bg-tertiary"
                                            : "text-atlas-text-secondary hover:text-atlas-text-primary hover:bg-atlas-bg-tertiary/50"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                        <div className="pt-2 border-t border-atlas-border flex flex-col gap-2">
                            <Link
                                href="/contribute"
                                onClick={() => setMobileOpen(false)}
                                className="block px-3 py-2 text-sm font-medium text-atlas-green"
                            >
                                Contribute
                            </Link>
                            <button
                                onClick={toggle}
                                className="text-left px-3 py-2 text-sm text-atlas-text-secondary flex items-center gap-2"
                            >
                                {theme === "dark" ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="4"/>
                                            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
                                        </svg>
                                        Switch to Light Mode
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
                                        </svg>
                                        Switch to Dark Mode
                                    </>
                                )}
                            </button>
                            {session?.user ? (
                                <button
                                    onClick={() => { setMobileOpen(false); signOut({ callbackUrl: "/" }); }}
                                    className="text-left px-3 py-2 text-sm text-atlas-text-muted"
                                >
                                    Sign out (@{session.user.name})
                                </button>
                            ) : (
                                <button
                                    onClick={() => { setMobileOpen(false); signIn("github"); }}
                                    className="text-left px-3 py-2 text-sm text-atlas-text-secondary"
                                >
                                    Sign in with GitHub
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <CommandPalette 
                isOpen={isSearchOpen} 
                onClose={() => setIsSearchOpen(false)} 
            />
        </header>
    );
}