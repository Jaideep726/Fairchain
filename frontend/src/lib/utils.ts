import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// ---------------------------------------------------------------------------
// cn — classnames merger
// Combines clsx (conditional class logic) with tailwind-merge (deduplication)
// ---------------------------------------------------------------------------
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ---------------------------------------------------------------------------
// Risk tier types
// ---------------------------------------------------------------------------
export type RiskTier = "GREEN" | "YELLOW" | "ORANGE" | "RED";

// ---------------------------------------------------------------------------
// riskColor — maps a risk tier to its hex colour from the design system
// Source: tailwind.config.ts → theme.extend.colors.risk
// ---------------------------------------------------------------------------
const RISK_COLOR: Record<RiskTier, string> = {
  GREEN:  "#22c55e",
  YELLOW: "#eab308",
  ORANGE: "#f97316",
  RED:    "#ef4444",
};

export function riskColor(tier: RiskTier): string {
  return RISK_COLOR[tier] ?? RISK_COLOR.GREEN;
}

// ---------------------------------------------------------------------------
// riskLabel — maps a risk tier to a human-readable display string
// ---------------------------------------------------------------------------
const RISK_LABEL: Record<RiskTier, string> = {
  GREEN:  "Normal",
  YELLOW: "Elevated",
  ORANGE: "High Risk",
  RED:    "Critical",
};

export function riskLabel(tier: RiskTier): string {
  return RISK_LABEL[tier] ?? "Unknown";
}

// ---------------------------------------------------------------------------
// riskTextClass — maps a risk tier to a Tailwind text colour class
// Classes correspond to the risk.* colours defined in tailwind.config.ts
// ---------------------------------------------------------------------------
const RISK_TEXT_CLASS: Record<RiskTier, string> = {
  GREEN:  "text-risk-green",
  YELLOW: "text-risk-yellow",
  ORANGE: "text-risk-orange",
  RED:    "text-risk-red",
};

export function riskTextClass(tier: RiskTier): string {
  return RISK_TEXT_CLASS[tier] ?? "text-risk-green";
}

// ---------------------------------------------------------------------------
// pct — formats a float in [0, 1] as a percentage string
// Examples: 0.756 → "75.6%", 1.0 → "100.0%", 0 → "0.0%"
// ---------------------------------------------------------------------------
export function pct(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}
