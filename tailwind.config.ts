import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                atlas: {
                    bg: {
                        primary: "var(--atlas-bg-primary)",
                        secondary: "var(--atlas-bg-secondary)",
                        tertiary: "var(--atlas-bg-tertiary)",
                        card: "var(--atlas-bg-card)",
                    },
                    border: {
                        DEFAULT: "var(--atlas-border)",
                        hover: "var(--atlas-border-hover)",
                    },
                    text: {
                        primary: "var(--atlas-text-primary)",
                        secondary: "var(--atlas-text-secondary)",
                        muted: "var(--atlas-text-muted)",
                    },
                    green: "#22c55e",
                    blue: "#3b82f6",
                    amber: "#f59e0b",
                    red: "#ef4444",
                    purple: "#a855f7",
                },
            },
            fontFamily: {
                sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
                mono: ["var(--font-geist-mono)", "JetBrains Mono", "monospace"],
            },
            keyframes: {
                "pulse-dot": {
                    "0%, 100%": { opacity: "1" },
                    "50%": { opacity: "0.4" },
                },
                "feed-slide": {
                    "0%": { transform: "translateX(0)" },
                    "100%": { transform: "translateX(-50%)" },
                },
                "fade-in": {
                    "0%": { opacity: "0", transform: "translateY(8px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
            },
            animation: {
                "pulse-dot": "pulse-dot 2s ease-in-out infinite",
                "feed-slide": "feed-slide 30s linear infinite",
                "fade-in": "fade-in 0.3s ease-out",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};

export default config;
