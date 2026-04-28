"use client";

import { X, AlertTriangle, Wind, CloudRain, Gauge, Clock, TrendingDown } from "lucide-react";
import { cn, riskColor, riskLabel, riskTextClass, pct, type RiskTier } from "@/lib/utils";
import type { RouteSegment, AnomalyScore } from "@/lib/mockData";

interface SegmentDrawerProps {
  segment: RouteSegment | null;
  score: AnomalyScore | null;
  onClose: () => void;
  onReroute: () => void;
}

const FEATURE_META: Record<string, { icon: React.ReactNode; label: string }> = {
  rainfall_spike:        { icon: <CloudRain className="w-3.5 h-3.5" />, label: "Rainfall Spike" },
  velocity_plunge:       { icon: <TrendingDown className="w-3.5 h-3.5" />, label: "Velocity Plunge" },
  corridor_delay_freq:   { icon: <Clock className="w-3.5 h-3.5" />, label: "Corridor Delay Freq" },
  transit_time_variance: { icon: <Gauge className="w-3.5 h-3.5" />, label: "Transit Time Variance" },
  fuel_strike:           { icon: <AlertTriangle className="w-3.5 h-3.5" />, label: "Fuel Strike Activity" },
  wind_speed:            { icon: <Wind className="w-3.5 h-3.5" />, label: "High Wind Speed" },
};

function riskTierFromNumber(risk: number): RiskTier {
  if (risk >= 0.75) return "RED";
  if (risk >= 0.5) return "ORANGE";
  if (risk >= 0.25) return "YELLOW";
  return "GREEN";
}

export default function SegmentDrawer({ segment, score, onClose, onReroute }: SegmentDrawerProps) {
  if (!segment || !score) return null;

  const risk = score.normalized_risk_probability;
  const tier = riskTierFromNumber(risk);
  const label = riskLabel(tier);
  const color = riskColor(tier);
  const textClass = riskTextClass(tier);
  const isHigh = risk >= 0.75;

  return (
    <div
      className={cn(
        "absolute top-4 right-4 z-30 w-80 glass animate-slide-up",
        "flex flex-col gap-0 overflow-hidden"
      )}
      id="segment-drawer"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-fc-700">
        <div>
          <div className="text-xs text-muted uppercase tracking-widest font-semibold">Route Segment</div>
          <div className="text-xl font-lexend font-bold text-fc-200">{segment.nh_identifier}</div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={cn("risk-badge text-xs px-2.5 py-1 font-bold")}
            style={{ background: `${color}22`, color, border: `1px solid ${color}55` }}
          >
            {label}
          </span>
          <button
            onClick={onClose}
            className="text-muted hover:text-fc-200 transition-colors p-1 rounded-lg hover:bg-fc-700/40"
            id="segment-drawer-close"
            aria-label="Close segment drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Risk Meter */}
      <div className="px-5 py-4 border-b border-fc-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted font-semibold uppercase tracking-wide">Risk Probability</span>
          <span className={cn("text-lg font-bold font-mono", textClass)}>{pct(risk)}</span>
        </div>
        <div className="w-full h-2 bg-fc-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${risk * 100}%`, background: color, boxShadow: `0 0 8px 1px ${color}66` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted mt-1.5 font-mono">
          <span>CI low: {pct(score.model_confidence_interval[0])}</span>
          <span>CI high: {pct(score.model_confidence_interval[1])}</span>
        </div>
      </div>

      {/* Segment Stats */}
      <div className="px-5 py-4 border-b border-fc-700 grid grid-cols-2 gap-3">
        <Stat label="Distance" value={`${segment.base_distance_km.toLocaleString()} km`} />
        <Stat label="IF Raw Score" value={score.isolation_forest_raw_score.toFixed(3)} mono />
        <Stat label="Delay Variance" value={pct(segment.historical_delay_variance)} />
        <Stat label="Lead Time" value="4–8 hrs" />
      </div>

      {/* Contributing Factors */}
      <div className="px-5 py-4 border-b border-fc-700">
        <div className="text-xs text-muted uppercase tracking-widest font-semibold mb-2.5">
          Anomalous Signals
        </div>
        {score.dominant_anomalous_features.length === 0 ? (
          <div className="text-xs text-risk-green flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-risk-green inline-block" />
            All signals nominal
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            {score.dominant_anomalous_features.map((feat) => {
              const meta = FEATURE_META[feat];
              return (
                <div key={feat} className="flex items-center gap-2 text-xs text-risk-orange">
                  {meta?.icon ?? <AlertTriangle className="w-3.5 h-3.5" />}
                  <span className="font-medium">{meta?.label ?? feat}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Route Points */}
      <div className="px-5 py-4 border-b border-fc-700 text-xs text-muted space-y-1">
        <div className="flex justify-between">
          <span className="text-fc-400">Start</span>
          <span className="font-mono">{segment.start_node_latlon[0].toFixed(4)}, {segment.start_node_latlon[1].toFixed(4)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-fc-400">End</span>
          <span className="font-mono">{segment.end_node_latlon[0].toFixed(4)}, {segment.end_node_latlon[1].toFixed(4)}</span>
        </div>
      </div>

      {/* Action */}
      <div className="px-5 py-4">
        {isHigh ? (
          <button
            id="trigger-reroute-btn"
            onClick={onReroute}
            className="w-full py-2.5 rounded-xl font-semibold text-sm text-white transition-all duration-200 flex items-center justify-center gap-2"
            style={{
              background: `linear-gradient(135deg, #ef4444 0%, #f97316 100%)`,
              boxShadow: "0 0 20px rgba(239,68,68,0.35)",
            }}
          >
            <AlertTriangle className="w-4 h-4" />
            Initiate Reroute Protocol
          </button>
        ) : (
          <button
            id="trigger-reroute-btn"
            onClick={onReroute}
            className="w-full py-2.5 rounded-xl font-semibold text-sm text-fc-200 bg-fc-700/60 hover:bg-fc-700 transition-colors border border-fc-600 flex items-center justify-center gap-2"
          >
            View Alternative Routes
          </button>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="glass-sm px-3 py-2.5">
      <div className="text-xs text-muted mb-0.5">{label}</div>
      <div className={cn("text-sm font-semibold text-fc-200", mono && "font-mono")}>{value}</div>
    </div>
  );
}
