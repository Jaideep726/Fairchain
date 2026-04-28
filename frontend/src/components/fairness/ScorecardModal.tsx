"use client";

import { useState } from "react";
import { X, Scale, ToggleLeft, ToggleRight, TrendingDown } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  RadialBarChart,
  RadialBar,
  Legend,
} from "recharts";
import { cn, pct } from "@/lib/utils";
import { MOCK_SUPPLIERS, type SupplierRecord } from "@/lib/mockData";

interface ScorecardModalProps {
  open: boolean;
  onClose: () => void;
}

const CATEGORY_COLORS: Record<SupplierRecord["category"], string> = {
  "large-enterprise": "#3b82f6",
  "sme": "#f97316",
  "women-owned": "#8b5cf6",
  "developing-economy": "#ef4444",
};

const CATEGORY_LABELS: Record<SupplierRecord["category"], string> = {
  "large-enterprise": "Large Enterprise",
  "sme": "SME",
  "women-owned": "Women-Owned",
  "developing-economy": "Dev. Economy",
};

// Aggregate data by category
function aggregateByCategory(suppliers: SupplierRecord[], mitigated: boolean) {
  const groups: Record<string, { actual: number[]; ai: number[] }> = {};
  for (const s of suppliers) {
    if (!groups[s.category]) groups[s.category] = { actual: [], ai: [] };
    groups[s.category].actual.push(s.actual_performance_score);
    const aiScore = mitigated
      ? s.actual_performance_score * 0.95 + s.ai_trust_score * 0.05
      : s.ai_trust_score;
    groups[s.category].ai.push(aiScore);
  }
  return Object.entries(groups).map(([cat, data]) => ({
    name: CATEGORY_LABELS[cat as SupplierRecord["category"]],
    category: cat as SupplierRecord["category"]  ,
    actual: parseFloat((data.actual.reduce((a, b) => a + b, 0) / data.actual.length).toFixed(3)),
    ai: parseFloat((data.ai.reduce((a, b) => a + b, 0) / data.ai.length).toFixed(3)),
    disparateImpact: 0,
  })).map((row) => ({
    ...row,
    disparateImpact: parseFloat((row.ai / row.actual).toFixed(3)),
    gap: parseFloat((row.actual - row.ai).toFixed(3)),
  }));
}

// Disparate Impact gauge data for radial chart
function buildGaugeData(aggregated: ReturnType<typeof aggregateByCategory>) {
  return aggregated.map((row) => ({
    name: row.name,
    value: parseFloat((row.disparateImpact * 100).toFixed(1)),
    fill: CATEGORY_COLORS[row.category],
  }));
}

// Custom tooltip for bar chart
function CustomBarTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-sm px-3 py-2 text-xs">
      <div className="font-bold text-fc-200 mb-1">{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.fill }} />
          <span className="text-muted capitalize">{p.name}:</span>
          <span className="font-mono font-semibold" style={{ color: p.fill }}>
            {pct(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function ScorecardModal({ open, onClose }: ScorecardModalProps) {
  const [mitigated, setMitigated] = useState(false);

  if (!open) return null;

  const aggregated = aggregateByCategory(MOCK_SUPPLIERS, mitigated);
  const gaugeData = buildGaugeData(aggregated);

  // Overall stats
  const avgGap = aggregated
    .filter((r) => r.category !== "large-enterprise")
    .reduce((s, r) => s + r.gap, 0) / 3;

  const fairnessScore = mitigated
    ? 94
    : Math.round(100 - avgGap * 200);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      id="scorecard-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Algorithmic Fairness Scorecard"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-fc-950/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] glass animate-slide-up overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-fc-700 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Scale className="w-4 h-4 text-accent-purple" />
              <span className="text-xs text-muted uppercase tracking-widest font-semibold">
                AI Fairness 360 + Fairlearn
              </span>
            </div>
            <h2 className="text-xl font-lexend font-bold text-fc-200">
              Algorithmic Supplier Fairness Scorecard
            </h2>
          </div>
          <div className="flex items-center gap-4">
            {/* Mitigation toggle */}
            <button
              id="mitigation-toggle"
              onClick={() => setMitigated((m) => !m)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-semibold transition-all duration-300",
                mitigated
                  ? "border-risk-green bg-risk-green/10 text-risk-green"
                  : "border-fc-700 bg-fc-800/60 text-muted hover:text-fc-200"
              )}
              aria-pressed={mitigated}
            >
              {mitigated ? (
                <ToggleRight className="w-4 h-4" />
              ) : (
                <ToggleLeft className="w-4 h-4" />
              )}
              {mitigated ? "Mitigation ON" : "Simulate Mitigation"}
            </button>
            <button
              onClick={onClose}
              className="text-muted hover:text-fc-200 p-2 rounded-xl hover:bg-fc-700/40 transition-colors"
              id="scorecard-modal-close"
              aria-label="Close fairness scorecard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">
          {/* KPI strip */}
          <div className="grid grid-cols-4 gap-3">
            <KpiCard
              label="Fairness Score"
              value={`${fairnessScore}/100`}
              sub={mitigated ? "Post-mitigation" : "Biased baseline"}
              accent={fairnessScore >= 90 ? "#22c55e" : fairnessScore >= 70 ? "#f97316" : "#ef4444"}
            />
            <KpiCard
              label="Avg Bias Gap"
              value={pct(mitigated ? avgGap * 0.05 : avgGap)}
              sub="Actual vs AI score"
              accent="#ef4444"
            />
            <KpiCard
              label="Suppliers Audited"
              value={`${MOCK_SUPPLIERS.length}`}
              sub="Across 4 categories"
              accent="#3b82f6"
            />
            <KpiCard
              label="Parity Violations"
              value={mitigated ? "0" : `${aggregated.filter((r) => r.disparateImpact < 0.8).length}`}
              sub="DI < 0.8 threshold"
              accent={mitigated ? "#22c55e" : "#ef4444"}
            />
          </div>

          {/* Bar chart — Actual vs AI */}
          <div className="glass-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-semibold text-sm text-fc-200">Actual Performance vs AI Trust Score</div>
                <div className="text-xs text-muted mt-0.5">
                  Statistical parity analysis by supplier category
                </div>
              </div>
              {!mitigated && (
                <div className="flex items-center gap-1.5 text-xs text-risk-orange">
                  <TrendingDown className="w-3.5 h-3.5" />
                  Systematic underscoring detected
                </div>
              )}
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={aggregated} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis
                  tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 1]}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar dataKey="actual" name="Actual Performance" radius={[4, 4, 0, 0]} maxBarSize={32}>
                  {aggregated.map((entry) => (
                    <Cell
                      key={entry.category}
                      fill={CATEGORY_COLORS[entry.category]}
                      fillOpacity={0.9}
                    />
                  ))}
                </Bar>
                <Bar dataKey="ai" name="AI Trust Score" radius={[4, 4, 0, 0]} maxBarSize={32} fill="#475569" fillOpacity={0.7} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted justify-center">
              <LegendDot color="#3b82f6" label="Actual Performance (ground truth)" />
              <LegendDot color="#475569" label="AI Trust Score (model output)" />
            </div>
          </div>

          {/* Disparate Impact gauge */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-sm p-4">
              <div className="font-semibold text-sm text-fc-200 mb-1">Disparate Impact Ratio</div>
              <div className="text-xs text-muted mb-3">
                80% rule: DI &lt; 0.8 = discriminatory. 1.0 = perfect parity.
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="30%"
                  outerRadius="90%"
                  data={gaugeData}
                  startAngle={90}
                  endAngle={-270}
                >
                  <RadialBar
                    dataKey="value"
                    cornerRadius={4}
                    background={{ fill: "#1e293b" }}
                    label={{ position: "insideStart", fill: "#e2e8f0", fontSize: 10 }}
                  />
                  <Legend
                    iconSize={8}
                    iconType="circle"
                    wrapperStyle={{ fontSize: 11, color: "#94a3b8" }}
                  />
                  <Tooltip
                    formatter={(v: number) => [`${v.toFixed(1)}%`, "DI Ratio"]}
                    contentStyle={{
                      background: "rgba(15,23,42,0.95)",
                      border: "1px solid #334155",
                      borderRadius: 10,
                      color: "#e2e8f0",
                      fontSize: 12,
                    }}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>

            {/* Supplier table */}
            <div className="glass-sm p-4">
              <div className="font-semibold text-sm text-fc-200 mb-3">Supplier Detail Audit</div>
              <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                {MOCK_SUPPLIERS.map((sup) => {
                  const aiScore = mitigated
                    ? sup.actual_performance_score * 0.95 + sup.ai_trust_score * 0.05
                    : sup.ai_trust_score;
                  const gap = sup.actual_performance_score - aiScore;
                  const isFlagged = !mitigated && gap > 0.18;
                  return (
                    <div
                      key={sup.id}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 rounded-xl text-xs",
                        isFlagged ? "bg-risk-red/10 border border-risk-red/30" : "bg-fc-900/60"
                      )}
                    >
                      <div>
                        <div className="font-semibold text-fc-200">{sup.name}</div>
                        <div className="text-muted">{CATEGORY_LABELS[sup.category]} · {sup.region}</div>
                      </div>
                      <div className="text-right">
                        <div
                          className="font-bold font-mono"
                          style={{ color: gap > 0.15 && !mitigated ? "#ef4444" : "#22c55e" }}
                        >
                          {isFlagged ? `−${pct(gap)}` : "✓"}
                        </div>
                        <div className="text-muted">bias gap</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  label, value, sub, accent,
}: {
  label: string; value: string; sub: string; accent: string;
}) {
  return (
    <div className="glass-sm px-4 py-3 text-center">
      <div className="text-xs text-muted mb-1">{label}</div>
      <div className="text-2xl font-bold font-lexend" style={{ color: accent }}>{value}</div>
      <div className="text-xs text-muted mt-1">{sub}</div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: color }} />
      {label}
    </div>
  );
}
