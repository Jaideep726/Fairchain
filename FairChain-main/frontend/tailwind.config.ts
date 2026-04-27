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
        background: "var(--background)",
        foreground: "var(--foreground)",
        // FairChain brand surface palette (slate-950 base)
        fc: {
          950: "#020617",
          900: "#0f172a",
          800: "#1e293b",
          700: "#334155",
          600: "#475569",
          400: "#94a3b8",
          200: "#e2e8f0",
        },
        // Risk tier colours
        risk: {
          green:  "#22c55e",
          yellow: "#eab308",
          orange: "#f97316",
          red:    "#ef4444",
        },
        // Accent
        accent: {
          blue:   "#3b82f6",
          purple: "#8b5cf6",
          cyan:   "#06b6d4",
        },
      },
      fontFamily: {
        sans:   ["var(--font-inter)",      "system-ui", "sans-serif"],
        lexend: ["var(--font-lexend)",     "system-ui", "sans-serif"],
        mono:   ["var(--font-geist-mono)", "monospace"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        glass:         "0 4px 24px 0 rgba(0,0,0,0.45)",
        "glass-sm":    "0 2px 12px 0 rgba(0,0,0,0.35)",
        "risk-red":    "0 0 12px 2px rgba(239,68,68,0.45)",
        "risk-orange": "0 0 12px 2px rgba(249,115,22,0.35)",
        "risk-green":  "0 0 8px 1px rgba(34,197,94,0.30)",
        "accent-blue": "0 0 16px 2px rgba(59,130,246,0.40)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
        "fade-in":    "fadeIn 0.3s ease-out",
        "slide-up":   "slideUp 0.35s ease-out",
      },
      keyframes: {
        fadeIn:  { "0%": { opacity: "0" },                                    "100%": { opacity: "1" } },
        slideUp: { "0%": { opacity: "0", transform: "translateY(12px)" },     "100%": { opacity: "1", transform: "translateY(0)" } },
      },
    },
  },
  plugins: [],
};

export default config;
