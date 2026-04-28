"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useCallback } from "react";
import { useSupabaseRealtime, useAlertManager } from "@/hooks/useSupabaseRealtime";
import { predictBatch } from "@/lib/api";
import TopNav from "@/components/dashboard/TopNav";
import AnomalyMatrix from "@/components/dashboard/AnomalyMatrix";
import GeminiPanel from "@/components/dashboard/GeminiPanel";
import SegmentDrawer from "@/components/map/SegmentDrawer";
import RerouteModal from "@/components/map/RerouteModal";
import ScorecardModal from "@/components/fairness/ScorecardModal";
import {
  MOCK_SEGMENTS,
  MOCK_SHIPMENTS,
  MOCK_ALTERNATIVE_ROUTES,
} from "@/lib/mockData";

// Mapbox must be client-only (uses browser APIs)
const RouteVisualizer = dynamic(
  () => import("@/components/map/RouteVisualizer"),
  { ssr: false, loading: () => <MapSkeleton /> }
);

function MapSkeleton() {
  return (
    <div className="w-full h-full rounded-2xl bg-fc-900/60 flex items-center justify-center animate-pulse">
      <div className="text-muted text-sm">Loading map…</div>
    </div>
  );
}

export default function DashboardPage() {
  // ── Realtime state (Supabase live → mock fallback) ─────────────────────
  const { anomalyScores, alerts: realtimeAlerts, connectionState, lastUpdated } =
    useSupabaseRealtime();
  const { unresolved, alerts, resolveAlert } = useAlertManager(realtimeAlerts);

  // ── Local UI state ────────────────────────────────────────────────────────
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null);
  const [rerouteOpen, setRerouteOpen] = useState(false);
  const [fairnessOpen, setFairnessOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"map" | "matrix">("map");

  // ── Live prediction scoring via backend ───────────────────────────────────
  // On mount, attempt to score all segments via POST /disruptions/predict/batch.
  // Results flow through Supabase realtime (backend writes to segment_states),
  // but we also merge them directly as an optimistic update.
  const fetchPredictions = useCallback(async () => {
    try {
      await predictBatch(MOCK_SEGMENTS);
      // Results will arrive via Supabase realtime subscription
      // or were already merged into anomalyScores by the batch call
    } catch {
      // Non-blocking — realtime hook already has mock fallback
    }
  }, []);

  useEffect(() => {
    fetchPredictions();
    // Re-score every 60s
    const interval = setInterval(fetchPredictions, 60000);
    return () => clearInterval(interval);
  }, [fetchPredictions]);

  // ── Derived data ──────────────────────────────────────────────────────────
  const selectedSegment = MOCK_SEGMENTS.find((s) => s.segment_id === selectedSegmentId) ?? null;
  const selectedScore = anomalyScores.find((s) => s.segment_id === selectedSegmentId) ?? null;
  const selectedNH = selectedSegment?.nh_identifier ?? "NH48";

  const handleSegmentClick = (id: string) => {
    setSelectedSegmentId((prev) => (prev === id ? null : id));
  };

  const handleReroute = () => {
    setRerouteOpen(true);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-fc-950">
      {/* ── Top Navigation ─────────────────────────────────────────────── */}
      <TopNav
        connectionState={connectionState}
        lastUpdated={lastUpdated}
        activeShipments={MOCK_SHIPMENTS.length}
        activeAlerts={unresolved.length}
        onFairnessClick={() => setFairnessOpen(true)}
      />

      {/* ── Main Content ───────────────────────────────────────────────── */}
      <main className="flex-1 flex overflow-hidden min-h-0 p-3 gap-3">
        {/* Left column — Map + Tabs */}
        <div className="flex flex-col flex-1 min-w-0 gap-3">
          {/* Tab bar */}
          <div className="flex items-center gap-2">
            <TabBtn
              id="tab-map"
              active={activeTab === "map"}
              onClick={() => setActiveTab("map")}
              label="🗺 Live Route Viewport"
            />
            <TabBtn
              id="tab-matrix"
              active={activeTab === "matrix"}
              onClick={() => setActiveTab("matrix")}
              label="📊 Anomaly Matrix"
            />
          </div>

          {/* Tab panels */}
          <div className="flex-1 min-h-0 relative">
            {activeTab === "map" ? (
              <div className="h-full relative">
                <RouteVisualizer
                  segments={MOCK_SEGMENTS}
                  anomalyScores={anomalyScores}
                  shipments={MOCK_SHIPMENTS}
                  selectedSegmentId={selectedSegmentId}
                  onSegmentClick={handleSegmentClick}
                />
                {/* Segment info drawer overlaid on map */}
                {selectedSegmentId && (
                  <SegmentDrawer
                    segment={selectedSegment}
                    score={selectedScore}
                    onClose={() => setSelectedSegmentId(null)}
                    onReroute={handleReroute}
                  />
                )}
              </div>
            ) : (
              <div className="h-full glass overflow-hidden">
                <AnomalyMatrix
                  segments={MOCK_SEGMENTS}
                  scores={anomalyScores}
                  onSegmentSelect={handleSegmentClick}
                  selectedId={selectedSegmentId}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right panel — Gemini AI Insights */}
        <aside className="w-80 flex-shrink-0 glass overflow-hidden flex flex-col">
          <GeminiPanel alerts={alerts} onResolve={resolveAlert} />
        </aside>
      </main>

      {/* ── Modals ─────────────────────────────────────────────────────── */}
      <RerouteModal
        open={rerouteOpen}
        onClose={() => setRerouteOpen(false)}
        segmentId={selectedSegmentId}
        nhIdentifier={selectedNH}
        alternatives={MOCK_ALTERNATIVE_ROUTES}
      />

      <ScorecardModal open={fairnessOpen} onClose={() => setFairnessOpen(false)} />
    </div>
  );
}

function TabBtn({
  id, active, onClick, label,
}: {
  id: string;
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      id={id}
      onClick={onClick}
      className={
        active
          ? "px-4 py-1.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-accent-blue to-accent-purple shadow-accent-blue"
          : "px-4 py-1.5 rounded-xl text-sm font-semibold text-muted bg-fc-800/60 hover:text-fc-200 hover:bg-fc-700/60 border border-fc-700 transition-colors"
      }
    >
      {label}
    </button>
  );
}
