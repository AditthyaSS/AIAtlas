import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import BackToTop from "@/components/ui/BackToTop";

export const metadata: Metadata = {
    title: "AIAtlas — The Open Map of the AI Ecosystem",
    description:
        "A real-time, community-maintained directory of every AI model, tool, API, and GitHub repo. Search, compare, and contribute.",
    keywords: ["AI", "machine learning", "LLM", "models", "directory", "open source"],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                {/* Prevent flash of wrong theme — runs before React hydrates */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `(function(){try{var t=localStorage.getItem('atlas-theme');if(t==='light'){document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark')}}catch(e){}})()`,
                    }}
                />
            </head>
            <body
                className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased min-h-screen flex flex-col bg-[var(--atlas-bg-primary)] text-[var(--atlas-text-primary)]`}
            >
                <ThemeProvider>
                    <SessionProvider>
                        <Navbar />
                        <main className="flex-1">{children}</main>
                        <Footer />
                        <BottomNav />
                        <BackToTop />
                    </SessionProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
