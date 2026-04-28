"use client";

import { Activity, Wifi, WifiOff, Radio, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type ConnectionState = "connecting" | "live" | "offline" | "demo";

interface TopNavProps {
  connectionState: ConnectionState;
  lastUpdated: Date | null;
  activeShipments: number;
  activeAlerts: number;
  onFairnessClick: () => void;
}

const CONNECTION_CONFIG: Record<ConnectionState, { icon: React.ReactNode; label: string; color: string }> = {
  connecting: { icon: <Radio className="w-3.5 h-3.5 animate-pulse" />, label: "Connecting…", color: "text-risk-yellow" },
  live:       { icon: <Wifi className="w-3.5 h-3.5" />,               label: "Live",         color: "text-risk-green" },
  offline:    { icon: <WifiOff className="w-3.5 h-3.5" />,            label: "Offline",      color: "text-risk-red" },
  demo:       { icon: <Activity className="w-3.5 h-3.5 animate-pulse" />, label: "Demo Mode",color: "text-accent-blue" },
};

export default function TopNav({
  connectionState,
  lastUpdated,
  activeShipments,
  activeAlerts,
  onFairnessClick,
}: TopNavProps) {
  const conn = CONNECTION_CONFIG[connectionState];

  const fmt = (d: Date) =>
    d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <header
      className="flex-shrink-0 flex items-center justify-between px-5 h-14 border-b border-fc-700 glass-sm rounded-none"
      id="top-nav"
    >
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black"
          style={{ background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)" }}
        >
          FC
        </div>
        <div>
          <div className="font-lexend font-bold text-fc-200 leading-none">FairChain</div>
          <div className="text-xs text-muted leading-none mt-0.5">Supply Chain Intelligence</div>
        </div>
      </div>

      {/* Status pills */}
      <div className="hidden md:flex items-center gap-3">
        <Pill label="Shipments" value={activeShipments.toString()} color="text-accent-blue" />
        <Pill
          label="Active Alerts"
          value={activeAlerts.toString()}
          color={activeAlerts > 0 ? "text-risk-red" : "text-risk-green"}
        />
        {lastUpdated && (
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <Clock className="w-3 h-3" />
            {fmt(lastUpdated)}
          </div>
        )}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {/* Connection badge */}
        <div className={cn("flex items-center gap-1.5 text-xs font-semibold", conn.color)}>
          {conn.icon}
          <span className="hidden sm:inline">{conn.label}</span>
        </div>

        {/* Fairness audit button */}
        <button
          id="open-fairness-btn"
          onClick={onFairnessClick}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-sm font-semibold border border-accent-purple/50 text-accent-purple hover:bg-accent-purple/10 transition-colors"
        >
          <span className="text-base leading-none">⚖️</span>
          <span className="hidden sm:inline">Fairness Audit</span>
        </button>
      </div>
    </header>
  );
}

function Pill({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-fc-800/60 border border-fc-700 text-xs">
      <span className="text-muted">{label}:</span>
      <span className={cn("font-bold font-mono", color)}>{value}</span>
    </div>
  );
}
