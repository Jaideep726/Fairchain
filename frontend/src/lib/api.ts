// ---------------------------------------------------------------------------
// api.ts — FairChain API client with mock fallback
// ---------------------------------------------------------------------------

import type { AnomalyScore, GeminiAlert, RouteSegment } from "@/lib/mockData";
import {
  MOCK_ANOMALY_SCORES,
  MOCK_ALERTS,
} from "@/lib/mockData";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

// ---------------------------------------------------------------------------
// Generic fetcher with timeout + mock fallback
// ---------------------------------------------------------------------------
async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  fallback: T,
  timeoutMs = 5000,
): Promise<{ data: T; live: boolean }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
    clearTimeout(timer);

    if (!res.ok) {
      console.warn(`[API] ${path} returned ${res.status} — using fallback`);
      return { data: fallback, live: false };
    }

    const data = (await res.json()) as T;
    return { data, live: true };
  } catch (err) {
    clearTimeout(timer);
    console.warn(`[API] ${path} unreachable — using mock fallback`, err);
    return { data: fallback, live: false };
  }
}

// ---------------------------------------------------------------------------
// POST /disruptions/predict — score a single segment
// ---------------------------------------------------------------------------
export interface PredictPayload {
  segment: {
    segment_id: string;
    nh_identifier: string;
    start_node_latlon: [number, number];
    end_node_latlon: [number, number];
    base_distance_km: number;
    historical_delay_variance: number;
  };
  signals?: Record<string, number | string | null>;
}

export async function predictSegment(
  segment: RouteSegment,
): Promise<{ data: AnomalyScore; live: boolean }> {
  const body: PredictPayload = {
    segment: {
      segment_id: segment.segment_id,
      nh_identifier: segment.nh_identifier,
      start_node_latlon: segment.start_node_latlon,
      end_node_latlon: segment.end_node_latlon,
      base_distance_km: segment.base_distance_km,
      historical_delay_variance: segment.historical_delay_variance,
    },
  };

  const fallback = MOCK_ANOMALY_SCORES.find(
    (s) => s.segment_id === segment.segment_id,
  ) ?? MOCK_ANOMALY_SCORES[0];

  return apiFetch<AnomalyScore>(
    "/disruptions/predict",
    { method: "POST", body: JSON.stringify(body) },
    fallback,
  );
}

// ---------------------------------------------------------------------------
// POST /disruptions/predict/batch — score multiple segments
// ---------------------------------------------------------------------------
export async function predictBatch(
  segments: RouteSegment[],
): Promise<{ data: AnomalyScore[]; live: boolean }> {
  const body = {
    items: segments.map((seg) => ({
      segment: {
        segment_id: seg.segment_id,
        nh_identifier: seg.nh_identifier,
        start_node_latlon: seg.start_node_latlon,
        end_node_latlon: seg.end_node_latlon,
        base_distance_km: seg.base_distance_km,
        historical_delay_variance: seg.historical_delay_variance,
      },
    })),
  };

  const res = await apiFetch<{ predictions: AnomalyScore[]; total: number }>(
    "/disruptions/predict/batch",
    { method: "POST", body: JSON.stringify(body) },
    { predictions: MOCK_ANOMALY_SCORES, total: MOCK_ANOMALY_SCORES.length },
    10000, // longer timeout for batch
  );

  return { data: res.data.predictions, live: res.live };
}

// ---------------------------------------------------------------------------
// POST /gemini/explain — get AI explanation for a prediction
// ---------------------------------------------------------------------------
export interface ExplainPayload {
  ml_score: number;
  features: string[];
  weather_data: string;
  supplier_data: string;
}

export interface ExplainResult {
  human_impact: string;
  actionable_advice: string;
}

export async function geminiExplain(
  payload: ExplainPayload,
): Promise<{ data: ExplainResult; live: boolean }> {
  return apiFetch<ExplainResult>(
    "/gemini/explain",
    { method: "POST", body: JSON.stringify(payload) },
    {
      human_impact: "Unable to reach AI explainability service.",
      actionable_advice: "Please consult the dashboard manually for routing decisions.",
    },
  );
}

// ---------------------------------------------------------------------------
// Fetch initial segment_states from Supabase REST (not realtime)
// ---------------------------------------------------------------------------
export async function fetchInitialScores(): Promise<{
  data: AnomalyScore[];
  live: boolean;
}> {
  const { supabase } = await import("@/lib/supabase");

  try {
    const { data, error } = await supabase
      .from("segment_states")
      .select("*")
      .order("current_timestamp_utc", { ascending: false });

    if (error || !data || data.length === 0) {
      return { data: MOCK_ANOMALY_SCORES, live: false };
    }

    return { data: data as AnomalyScore[], live: true };
  } catch {
    return { data: MOCK_ANOMALY_SCORES, live: false };
  }
}

// ---------------------------------------------------------------------------
// Fetch initial alerts from Supabase REST
// ---------------------------------------------------------------------------
export async function fetchInitialAlerts(): Promise<{
  data: GeminiAlert[];
  live: boolean;
}> {
  const { supabase } = await import("@/lib/supabase");

  try {
    const { data, error } = await supabase
      .from("alerts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error || !data || data.length === 0) {
      return { data: MOCK_ALERTS, live: false };
    }

    return { data: data as GeminiAlert[], live: true };
  } catch {
    return { data: MOCK_ALERTS, live: false };
  }
}
