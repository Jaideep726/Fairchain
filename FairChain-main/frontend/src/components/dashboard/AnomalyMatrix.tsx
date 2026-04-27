"use client";

import { cn, riskColor, riskLabel, riskTextClass, pct } from "@/lib/utils";
import type { AnomalyScore, RouteSegment } from "@/lib/mockData";
import { TrendingUp, Activity } from "lucide-react";

interface AnomalyMatrixProps {
  segments: RouteSegment[];
  scores: AnomalyScore[];
  onSegmentSelect: (id: string) => void;
  selectedId: string | null;
}

export default function AnomalyMatrix({
  segments,
  scores,
  onSegmentSelect,
  selectedId,
}: AnomalyMatrixProps) {
  const scoreMap = new Map(scores.map((s) => [s.segment_id, s]));

  const rows = segments
    .map((seg) => ({ seg, score: scoreMap.get(seg.segment_id) }))
    .sort((a, b) =>
      (b.score?.normalized_risk_probability ?? 0) - (a.score?.normalized_risk_probability ?? 0)
    );

  return (
    <div className="flex flex-col h-full" id="anomaly-matrix">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-fc-700 flex-shrink-0">
        <Activity className="w-4 h-4 text-accent-cyan" />
        <span className="font-lexend font-semibold text-sm text-fc-200">Anomaly Detection Matrix</span>
        <span className="ml-auto text-xs text-muted font-mono">4–8h window</span>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-xs" id="anomaly-table">
          <thead className="sticky top-0 bg-fc-900/90 backdrop-blur-sm">
            <tr className="border-b border-fc-700">
              <th className="text-left px-4 py-2.5 text-muted font-semibold uppercase tracking-wide">Highway</th>
              <th className="text-left px-4 py-2.5 text-muted font-semibold uppercase tracking-wide">Risk</th>
              <th className="text-left px-4 py-2.5 text-muted font-semibold uppercase tracking-wide hidden sm:table-cell">Signals</th>
              <th className="text-left px-4 py-2.5 text-muted font-semibold uppercase tracking-wide hidden md:table-cell">IF Score</th>
              <th className="text-left px-4 py-2.5 text-muted font-semibold uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ seg, score }) => {
              const risk = score?.normalized_risk_probability ?? 0;
              const color = riskColor(risk);
              const label = riskLabel(risk);
              const textClass = riskTextClass(risk);
              const isSelected = selectedId === seg.segment_id;

              return (
                <tr
                  key={seg.segment_id}
                  id={`anomaly-row-${seg.segment_id}`}
                  onClick={() => onSegmentSelect(seg.segment_id)}
                  className={cn(
                    "border-b border-fc-700/50 cursor-pointer transition-colors",
                    isSelected
                      ? "bg-accent-blue/10"
                      : "hover:bg-fc-800/50"
                  )}
                >
                  <td className="px-4 py-3 font-semibold text-fc-200 font-mono">
                    {seg.nh_identifier}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {/* Mini bar */}
                      <div className="w-16 h-1.5 bg-fc-800 rounded-full overflow-hidden flex-shrink-0">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${risk * 100}%`, background: color }}
                        />
                      </div>
                      <span className={cn("font-mono font-bold", textClass)}>
                        {pct(risk)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted hidden sm:table-cell max-w-[140px]">
                    {score?.dominant_anomalous_features.length ? (
                      <div className="flex flex-wrap gap-1">
                        {score.dominant_anomalous_features.map((f) => (
                          <span
                            key={f}
                            className="px-1.5 py-0.5 rounded text-xs"
                            style={{ background: `${color}22`, color }}
                          >
                            {f.replace("_", " ")}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-fc-600">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-muted hidden md:table-cell">
                    {score?.isolation_forest_raw_score.toFixed(3) ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{
                        background: `${color}1a`,
                        color,
                        border: `1px solid ${color}44`,
                      }}
                    >
                      {label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer summary */}
      <div className="flex items-center gap-4 px-4 py-2.5 border-t border-fc-700 flex-shrink-0 text-xs text-muted">
        <div className="flex items-center gap-1.5">
          <TrendingUp className="w-3 h-3 text-risk-red" />
          <span>
            {scores.filter((s) => s.normalized_risk_probability >= 0.75).length} critical
          </span>
        </div>
        <div>
          {scores.filter((s) => s.normalized_risk_probability >= 0.5 && s.normalized_risk_probability < 0.75).length} high
        </div>
        <div className="ml-auto text-fc-600">
          Isolation Forest · Prophet · ARIMA
        </div>
      </div>
    </div>
  );
}
