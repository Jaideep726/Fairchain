"use client";

import { useState } from "react";
import { X, CheckCircle, Clock, TrendingUp, Route, IndianRupee, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AlternativeRoute } from "@/lib/mockData";

interface RerouteModalProps {
  open: boolean;
  onClose: () => void;
  segmentId: string | null;
  nhIdentifier: string;
  alternatives: AlternativeRoute[];
}

export default function RerouteModal({
  open,
  onClose,
  nhIdentifier,
  alternatives,
}: RerouteModalProps) {
  const [selected, setSelected] = useState<string>(
    alternatives.find((r) => r.recommended)?.id ?? alternatives[0]?.id ?? ""
  );
  const [executed, setExecuted] = useState(false);
  const [executing, setExecuting] = useState(false);

  if (!open) return null;

  const selectedRoute = alternatives.find((r) => r.id === selected);

  const handleExecute = async () => {
    setExecuting(true);
    await new Promise((r) => setTimeout(r, 1800));
    setExecuting(false);
    setExecuted(true);
    setTimeout(() => {
      setExecuted(false);
      onClose();
    }, 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      id="reroute-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Dynamic Rerouting Modal"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-fc-950/75 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl glass animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-fc-700">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Route className="w-4 h-4 text-accent-blue" />
              <span className="text-xs text-muted uppercase tracking-widest font-semibold">
                Dynamic Rerouting Engine
              </span>
            </div>
            <h2 className="text-xl font-lexend font-bold text-fc-200">
              Alternative Paths — {nhIdentifier}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-fc-200 p-2 rounded-xl hover:bg-fc-700/40 transition-colors"
            id="reroute-modal-close"
            aria-label="Close reroute modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Route options */}
        <div className="px-6 py-5 space-y-3">
          {alternatives.map((route) => (
            <button
              key={route.id}
              id={`route-option-${route.id}`}
              onClick={() => setSelected(route.id)}
              className={cn(
                "w-full text-left rounded-2xl border transition-all duration-200 p-4",
                selected === route.id
                  ? "border-accent-blue bg-accent-blue/10 shadow-accent-blue"
                  : "border-fc-700 bg-fc-800/40 hover:border-fc-600"
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-fc-200">{route.label}</span>
                    {route.recommended && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-accent-blue/20 text-accent-blue border border-accent-blue/30">
                        RECOMMENDED
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted mt-0.5">{route.via}</div>
                </div>
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 transition-all",
                    selected === route.id
                      ? "border-accent-blue bg-accent-blue"
                      : "border-fc-600 bg-transparent"
                  )}
                />
              </div>

              <div className="grid grid-cols-4 gap-2">
                <MetricChip
                  icon={<Route className="w-3 h-3" />}
                  label="Extra dist."
                  value={`+${route.extra_distance_km} km`}
                  accent={false}
                />
                <MetricChip
                  icon={<Clock className="w-3 h-3" />}
                  label="Time delta"
                  value={`+${route.time_delta_hours}h`}
                  accent={false}
                />
                <MetricChip
                  icon={<TrendingUp className="w-3 h-3" />}
                  label="Risk"
                  value={`${(route.risk_score * 100).toFixed(0)}%`}
                  accent={route.risk_score < 0.15}
                  accentColor="#22c55e"
                />
                <MetricChip
                  icon={<IndianRupee className="w-3 h-3" />}
                  label="Toll"
                  value={`₹${route.toll_cost_inr}`}
                  accent={false}
                />
              </div>
            </button>
          ))}
        </div>

        {/* Summary bar */}
        {selectedRoute && (
          <div className="mx-6 mb-4 glass-sm px-4 py-3 flex items-center justify-between text-sm">
            <div className="flex items-center gap-4 text-muted">
              <span>
                ⏱ Saves{" "}
                <strong className="text-risk-green">
                  {(7.5 - selectedRoute.time_delta_hours).toFixed(1)}h
                </strong>{" "}
                vs current ETA impact
              </span>
              <span>
                📉 Risk reduction:{" "}
                <strong className="text-risk-green">
                  {((0.87 - selectedRoute.risk_score) * 100).toFixed(0)}%
                </strong>
              </span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-fc-700">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-muted hover:text-fc-200 hover:bg-fc-700/40 transition-colors border border-fc-700"
            id="reroute-cancel-btn"
          >
            Cancel
          </button>
          <button
            id="execute-reroute-btn"
            onClick={handleExecute}
            disabled={executing || executed}
            className={cn(
              "px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 flex items-center gap-2 min-w-[160px] justify-center",
              executed
                ? "bg-risk-green/80 shadow-risk-green"
                : "bg-gradient-to-r from-accent-blue to-accent-purple shadow-accent-blue hover:opacity-90"
            )}
          >
            {executing ? (
              <>
                <Zap className="w-4 h-4 animate-pulse" />
                Executing…
              </>
            ) : executed ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Rerouted!
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Execute Reroute
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function MetricChip({
  icon, label, value, accent, accentColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: boolean;
  accentColor?: string;
}) {
  return (
    <div className="bg-fc-900/60 rounded-xl px-2 py-2 text-center">
      <div className="flex items-center justify-center gap-0.5 text-muted mb-0.5">{icon}</div>
      <div
        className="text-sm font-bold font-mono"
        style={accent && accentColor ? { color: accentColor } : undefined}
      >
        {value}
      </div>
      <div className="text-xs text-muted">{label}</div>
    </div>
  );
}
