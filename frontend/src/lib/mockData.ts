// ---------------------------------------------------------------------------
// mockData.ts — FairChain shared types & mock constants
// ---------------------------------------------------------------------------

import type { RiskTier } from "@/lib/utils";

// ── Interfaces ───────────────────────────────────────────────────────────────

export interface RouteSegment {
  segment_id: string;
  nh_identifier: string;
  start_node_latlon: [number, number];
  end_node_latlon: [number, number];
  base_distance_km: number;
  historical_delay_variance: number;
  /** GeoJSON LineString coords [lng, lat][] tracing the actual highway path */
  geometry?: { type: "LineString"; coordinates: [number, number][] };
}

export interface AnomalyScore {
  segment_id: string;
  current_timestamp_utc: string;
  isolation_forest_raw_score: number;
  normalized_risk_probability: number;
  dominant_anomalous_features: string[];
  model_confidence_interval: [number, number];
  risk_tier: RiskTier;
}

export interface Shipment {
  id: string;
  name: string;
  cargo: string;
  origin: string;
  destination: string;
  segment_id: string;
  progress: number;      // 0–1 along the segment
  eta_hours: number;
}

export interface AlternativeRoute {
  id: string;
  label: string;
  via: string;
  extra_distance_km: number;
  time_delta_hours: number;
  risk_score: number;    // 0–1
  toll_cost_inr: number;
  recommended: boolean;
}

export interface GeminiAlert {
  id: string;
  severity: "critical" | "high" | "moderate";
  nh_identifier: string;
  headline: string;
  body: string;
  created_at: string;    // ISO-8601 UTC
  resolved: boolean;
}

export interface SupplierRecord {
  id: string;
  name: string;
  region: string;
  category: "large-enterprise" | "sme" | "women-owned" | "developing-economy";
  actual_performance_score: number;   // 0–1
  ai_trust_score: number;             // 0–1
}

// ── Mock Segments (NH48, NH16, NH44, NH45, NH32, SH-Local) ────────────────────
// geometry coordinates are [lng, lat] (GeoJSON convention)

export const MOCK_SEGMENTS: RouteSegment[] = [
  // NH48 — Chennai → Bengaluru corridor (5 segments)
  {
    segment_id: "seg-nh48-01",
    nh_identifier: "NH48",
    start_node_latlon: [13.0827, 80.2707],
    end_node_latlon:   [12.7409, 79.9869],
    base_distance_km: 42.3,
    historical_delay_variance: 0.18,
    geometry: { type: "LineString", coordinates: [
      [80.2707, 13.0827], [80.1702, 13.0120], [80.0865, 12.9480],
      [80.0512, 12.8780], [79.9869, 12.7409],
    ]},
  },
  {
    segment_id: "seg-nh48-02",
    nh_identifier: "NH48",
    start_node_latlon: [12.7409, 79.9869],
    end_node_latlon:   [12.4244, 79.6937],
    base_distance_km: 38.7,
    historical_delay_variance: 0.22,
    geometry: { type: "LineString", coordinates: [
      [79.9869, 12.7409], [79.9420, 12.6810], [79.8753, 12.5880],
      [79.8120, 12.5240], [79.6937, 12.4244],
    ]},
  },
  {
    segment_id: "seg-nh48-03",
    nh_identifier: "NH48",
    start_node_latlon: [12.4244, 79.6937],
    end_node_latlon:   [12.1628, 79.3901],
    base_distance_km: 35.5,
    historical_delay_variance: 0.31,
    geometry: { type: "LineString", coordinates: [
      [79.6937, 12.4244], [79.6340, 12.3710], [79.5580, 12.3120],
      [79.4830, 12.2480], [79.3901, 12.1628],
    ]},
  },
  {
    segment_id: "seg-nh48-04",
    nh_identifier: "NH48",
    start_node_latlon: [12.1628, 79.3901],
    end_node_latlon:   [12.9716, 79.9592],
    base_distance_km: 62.0,
    historical_delay_variance: 0.185,
    geometry: { type: "LineString", coordinates: [
      [79.3901, 12.1628], [79.3240, 12.2540], [78.9960, 12.5210],
      [79.1580, 12.7350], [79.4920, 12.8690], [79.9592, 12.9716],
    ]},
  },
  {
    segment_id: "seg-nh48-05",
    nh_identifier: "NH48",
    start_node_latlon: [12.9716, 79.9592],
    end_node_latlon:   [12.9141, 77.6386],
    base_distance_km: 55.1,
    historical_delay_variance: 0.14,
    geometry: { type: "LineString", coordinates: [
      [79.9592, 12.9716], [79.4150, 12.9510], [78.7340, 12.9380],
      [78.1750, 12.9270], [77.8620, 12.9190], [77.6386, 12.9141],
    ]},
  },
  // NH16 — Kolkata → Visakhapatnam corridor (4 segments)
  {
    segment_id: "seg-nh16-01",
    nh_identifier: "NH16",
    start_node_latlon: [22.5726, 88.3639],
    end_node_latlon:   [21.4942, 86.9285],
    base_distance_km: 190.4,
    historical_delay_variance: 0.27,
    geometry: { type: "LineString", coordinates: [
      [88.3639, 22.5726], [88.0650, 22.3420], [87.7540, 22.1280],
      [87.3280, 21.8150], [86.9285, 21.4942],
    ]},
  },
  {
    segment_id: "seg-nh16-02",
    nh_identifier: "NH16",
    start_node_latlon: [21.4942, 86.9285],
    end_node_latlon:   [20.4625, 85.8829],
    base_distance_km: 148.2,
    historical_delay_variance: 0.33,
    geometry: { type: "LineString", coordinates: [
      [86.9285, 21.4942], [86.7260, 21.2480], [86.4940, 21.0520],
      [86.1530, 20.7310], [85.8829, 20.4625],
    ]},
  },
  {
    segment_id: "seg-nh16-03",
    nh_identifier: "NH16",
    start_node_latlon: [20.4625, 85.8829],
    end_node_latlon:   [19.3150, 84.7941],
    base_distance_km: 163.6,
    historical_delay_variance: 0.41,
    geometry: { type: "LineString", coordinates: [
      [85.8829, 20.4625], [85.5940, 20.1820], [85.2350, 19.8940],
      [84.9710, 19.5630], [84.7941, 19.3150],
    ]},
  },
  {
    segment_id: "seg-nh16-04",
    nh_identifier: "NH16",
    start_node_latlon: [19.3150, 84.7941],
    end_node_latlon:   [17.6868, 83.2185],
    base_distance_km: 211.8,
    historical_delay_variance: 0.19,
    geometry: { type: "LineString", coordinates: [
      [84.7941, 19.3150], [84.4850, 18.9520], [84.0130, 18.4380],
      [83.5870, 17.9840], [83.2185, 17.6868],
    ]},
  },
  // NH44 — Bengaluru → Hyderabad corridor (3 segments)
  {
    segment_id: "seg-nh44-01",
    nh_identifier: "NH44",
    start_node_latlon: [12.9716, 77.5946],
    end_node_latlon:   [14.0979, 77.5710],
    base_distance_km: 126.0,
    historical_delay_variance: 0.16,
    geometry: { type: "LineString", coordinates: [
      [77.5946, 12.9716], [77.5580, 13.1520], [77.5340, 13.3310],
      [77.5410, 13.6240], [77.5590, 13.8560], [77.5710, 14.0979],
    ]},
  },
  {
    segment_id: "seg-nh44-02",
    nh_identifier: "NH44",
    start_node_latlon: [14.0979, 77.5710],
    end_node_latlon:   [15.3518, 78.0396],
    base_distance_km: 143.8,
    historical_delay_variance: 0.24,
    geometry: { type: "LineString", coordinates: [
      [77.5710, 14.0979], [77.6050, 14.3410], [77.6320, 14.6820],
      [77.8140, 14.9540], [78.0396, 15.3518],
    ]},
  },
  {
    segment_id: "seg-nh44-03",
    nh_identifier: "NH44",
    start_node_latlon: [15.3518, 78.0396],
    end_node_latlon:   [17.3850, 78.4867],
    base_distance_km: 231.5,
    historical_delay_variance: 0.20,
    geometry: { type: "LineString", coordinates: [
      [78.0396, 15.3518], [78.0780, 15.8340], [78.1570, 16.2350],
      [78.2640, 16.7410], [78.3990, 17.0820], [78.4867, 17.3850],
    ]},
  },
  // NH45 — Bengaluru → Mysuru expressway (2 segments)
  {
    segment_id: "seg-nh45-01",
    nh_identifier: "NH45",
    start_node_latlon: [12.9716, 77.5946],
    end_node_latlon:   [12.6500, 76.9500],
    base_distance_km: 78.4,
    historical_delay_variance: 0.12,
    geometry: { type: "LineString", coordinates: [
      [77.5946, 12.9716], [77.4120, 12.9200], [77.2350, 12.8420],
      [77.0940, 12.7630], [76.9500, 12.6500],
    ]},
  },
  {
    segment_id: "seg-nh45-02",
    nh_identifier: "NH45",
    start_node_latlon: [12.6500, 76.9500],
    end_node_latlon:   [12.2958, 76.6394],
    base_distance_km: 42.7,
    historical_delay_variance: 0.10,
    geometry: { type: "LineString", coordinates: [
      [76.9500, 12.6500], [76.8420, 12.5580], [76.7540, 12.4310],
      [76.6394, 12.2958],
    ]},
  },
  // NH32 — Chennai → Pondicherry coastal (2 segments)
  {
    segment_id: "seg-nh32-01",
    nh_identifier: "NH32",
    start_node_latlon: [13.0827, 80.2707],
    end_node_latlon:   [12.8300, 80.1900],
    base_distance_km: 30.2,
    historical_delay_variance: 0.35,
    geometry: { type: "LineString", coordinates: [
      [80.2707, 13.0827], [80.2550, 13.0120], [80.2310, 12.9430],
      [80.2050, 12.8810], [80.1900, 12.8300],
    ]},
  },
  {
    segment_id: "seg-nh32-02",
    nh_identifier: "NH32",
    start_node_latlon: [12.8300, 80.1900],
    end_node_latlon:   [11.9416, 79.8083],
    base_distance_km: 110.3,
    historical_delay_variance: 0.28,
    geometry: { type: "LineString", coordinates: [
      [80.1900, 12.8300], [80.1740, 12.6190], [80.1520, 12.4280],
      [80.0580, 12.2340], [79.9310, 12.0520], [79.8083, 11.9416],
    ]},
  },
  // SH-Local — Chennai intra-city feeder
  {
    segment_id: "seg-sh-local-01",
    nh_identifier: "SH-Local",
    start_node_latlon: [13.0500, 80.2200],
    end_node_latlon:   [13.0100, 80.1800],
    base_distance_km: 5.2,
    historical_delay_variance: 0.48,
    geometry: { type: "LineString", coordinates: [
      [80.2200, 13.0500], [80.2080, 13.0380], [80.1950, 13.0250],
      [80.1800, 13.0100],
    ]},
  },
  // NH19 — Delhi → Agra → Kanpur (3 segments, Yamuna Expressway + GT Road)
  {
    segment_id: "seg-nh19-01",
    nh_identifier: "NH19",
    start_node_latlon: [28.6139, 77.2090],
    end_node_latlon:   [27.8974, 77.5855],
    base_distance_km: 105.0,
    historical_delay_variance: 0.21,
    geometry: { type: "LineString", coordinates: [
      [77.2090, 28.6139], [77.3250, 28.4520], [77.4310, 28.2740],
      [77.4890, 28.1050], [77.5855, 27.8974],
    ]},
  },
  {
    segment_id: "seg-nh19-02",
    nh_identifier: "NH19",
    start_node_latlon: [27.8974, 77.5855],
    end_node_latlon:   [27.1767, 78.0081],
    base_distance_km: 92.3,
    historical_delay_variance: 0.19,
    geometry: { type: "LineString", coordinates: [
      [77.5855, 27.8974], [77.6420, 27.7210], [77.7080, 27.5340],
      [77.8550, 27.3280], [78.0081, 27.1767],
    ]},
  },
  {
    segment_id: "seg-nh19-03",
    nh_identifier: "NH19",
    start_node_latlon: [27.1767, 78.0081],
    end_node_latlon:   [26.4499, 80.3319],
    base_distance_km: 278.5,
    historical_delay_variance: 0.38,
    geometry: { type: "LineString", coordinates: [
      [78.0081, 27.1767], [78.4250, 27.0120], [78.9630, 26.8520],
      [79.4180, 26.7320], [79.9510, 26.5880], [80.3319, 26.4499],
    ]},
  },
  // NH48-Delhi — Delhi → Jaipur (2 segments)
  {
    segment_id: "seg-nh48d-01",
    nh_identifier: "NH48",
    start_node_latlon: [28.6139, 77.2090],
    end_node_latlon:   [28.1930, 76.3190],
    base_distance_km: 104.0,
    historical_delay_variance: 0.17,
    geometry: { type: "LineString", coordinates: [
      [77.2090, 28.6139], [77.0330, 28.5680], [76.8520, 28.4830],
      [76.6410, 28.3620], [76.3190, 28.1930],
    ]},
  },
  {
    segment_id: "seg-nh48d-02",
    nh_identifier: "NH48",
    start_node_latlon: [28.1930, 76.3190],
    end_node_latlon:   [26.9124, 75.7873],
    base_distance_km: 164.5,
    historical_delay_variance: 0.15,
    geometry: { type: "LineString", coordinates: [
      [76.3190, 28.1930], [76.2240, 27.9210], [76.1180, 27.6540],
      [75.9350, 27.3620], [75.8410, 27.1180], [75.7873, 26.9124],
    ]},
  },
  // NH58 — Delhi → Meerut → Haridwar → Dehradun (3 segments)
  {
    segment_id: "seg-nh58-01",
    nh_identifier: "NH58",
    start_node_latlon: [28.6139, 77.2090],
    end_node_latlon:   [28.9845, 77.7064],
    base_distance_km: 68.0,
    historical_delay_variance: 0.25,
    geometry: { type: "LineString", coordinates: [
      [77.2090, 28.6139], [77.3120, 28.6580], [77.4340, 28.7240],
      [77.5560, 28.8120], [77.7064, 28.9845],
    ]},
  },
  {
    segment_id: "seg-nh58-02",
    nh_identifier: "NH58",
    start_node_latlon: [28.9845, 77.7064],
    end_node_latlon:   [29.9457, 78.1642],
    base_distance_km: 130.2,
    historical_delay_variance: 0.29,
    geometry: { type: "LineString", coordinates: [
      [77.7064, 28.9845], [77.7840, 29.1530], [77.8910, 29.3680],
      [77.9760, 29.5810], [78.0540, 29.7420], [78.1642, 29.9457],
    ]},
  },
  {
    segment_id: "seg-nh58-03",
    nh_identifier: "NH58",
    start_node_latlon: [29.9457, 78.1642],
    end_node_latlon:   [30.3165, 78.0322],
    base_distance_km: 52.8,
    historical_delay_variance: 0.34,
    geometry: { type: "LineString", coordinates: [
      [78.1642, 29.9457], [78.1420, 30.0340], [78.1130, 30.1280],
      [78.0810, 30.2210], [78.0322, 30.3165],
    ]},
  },
  // NH27 — Lucknow → Allahabad → Varanasi (3 segments)
  {
    segment_id: "seg-nh27-01",
    nh_identifier: "NH27",
    start_node_latlon: [26.8467, 80.9462],
    end_node_latlon:   [26.4318, 81.7787],
    base_distance_km: 102.4,
    historical_delay_variance: 0.26,
    geometry: { type: "LineString", coordinates: [
      [80.9462, 26.8467], [81.0820, 26.7910], [81.2340, 26.7050],
      [81.4580, 26.5930], [81.7787, 26.4318],
    ]},
  },
  {
    segment_id: "seg-nh27-02",
    nh_identifier: "NH27",
    start_node_latlon: [26.4318, 81.7787],
    end_node_latlon:   [25.4358, 81.8463],
    base_distance_km: 115.6,
    historical_delay_variance: 0.32,
    geometry: { type: "LineString", coordinates: [
      [81.7787, 26.4318], [81.7920, 26.2140], [81.8050, 25.9880],
      [81.8240, 25.7620], [81.8360, 25.5740], [81.8463, 25.4358],
    ]},
  },
  {
    segment_id: "seg-nh27-03",
    nh_identifier: "NH27",
    start_node_latlon: [25.4358, 81.8463],
    end_node_latlon:   [25.3176, 82.9739],
    base_distance_km: 128.3,
    historical_delay_variance: 0.30,
    geometry: { type: "LineString", coordinates: [
      [81.8463, 25.4358], [82.0340, 25.4120], [82.2510, 25.3890],
      [82.5280, 25.3650], [82.7410, 25.3420], [82.9739, 25.3176],
    ]},
  },
];

// ── Mock Anomaly Scores ────────────────────────────────────────────────────────

export const MOCK_ANOMALY_SCORES: AnomalyScore[] = [
  {
    segment_id: "seg-nh48-01",
    current_timestamp_utc: new Date().toISOString(),
    isolation_forest_raw_score: -0.083,
    normalized_risk_probability: 0.12,
    dominant_anomalous_features: [],
    model_confidence_interval: [0.08, 0.17],
    risk_tier: "GREEN",
  },
  {
    segment_id: "seg-nh48-02",
    current_timestamp_utc: new Date().toISOString(),
    isolation_forest_raw_score: -0.142,
    normalized_risk_probability: 0.38,
    dominant_anomalous_features: ["corridor_delay_freq"],
    model_confidence_interval: [0.31, 0.46],
    risk_tier: "YELLOW",
  },
  {
    segment_id: "seg-nh48-03",
    current_timestamp_utc: new Date().toISOString(),
    isolation_forest_raw_score: -0.271,
    normalized_risk_probability: 0.61,
    dominant_anomalous_features: ["rainfall_spike", "velocity_plunge"],
    model_confidence_interval: [0.54, 0.69],
    risk_tier: "ORANGE",
  },
  {
    segment_id: "seg-nh48-04",
    current_timestamp_utc: new Date().toISOString(),
    isolation_forest_raw_score: -0.384,
    normalized_risk_probability: 0.87,
    dominant_anomalous_features: ["rainfall_spike", "velocity_plunge", "transit_time_variance"],
    model_confidence_interval: [0.81, 0.93],
    risk_tier: "RED",
  },
  {
    segment_id: "seg-nh48-05",
    current_timestamp_utc: new Date().toISOString(),
    isolation_forest_raw_score: -0.071,
    normalized_risk_probability: 0.09,
    dominant_anomalous_features: [],
    model_confidence_interval: [0.05, 0.14],
    risk_tier: "GREEN",
  },
  {
    segment_id: "seg-nh16-01",
    current_timestamp_utc: new Date().toISOString(),
    isolation_forest_raw_score: -0.113,
    normalized_risk_probability: 0.24,
    dominant_anomalous_features: ["wind_speed"],
    model_confidence_interval: [0.17, 0.31],
    risk_tier: "GREEN",
  },
  {
    segment_id: "seg-nh16-02",
    current_timestamp_utc: new Date().toISOString(),
    isolation_forest_raw_score: -0.209,
    normalized_risk_probability: 0.53,
    dominant_anomalous_features: ["fuel_strike", "corridor_delay_freq"],
    model_confidence_interval: [0.45, 0.61],
    risk_tier: "ORANGE",
  },
  {
    segment_id: "seg-nh16-03",
    current_timestamp_utc: new Date().toISOString(),
    isolation_forest_raw_score: -0.317,
    normalized_risk_probability: 0.76,
    dominant_anomalous_features: ["rainfall_spike", "transit_time_variance", "fuel_strike"],
    model_confidence_interval: [0.69, 0.83],
    risk_tier: "RED",
  },
  {
    segment_id: "seg-nh16-04",
    current_timestamp_utc: new Date().toISOString(),
    isolation_forest_raw_score: -0.094,
    normalized_risk_probability: 0.17,
    dominant_anomalous_features: [],
    model_confidence_interval: [0.11, 0.24],
    risk_tier: "GREEN",
  },
  {
    segment_id: "seg-nh44-01",
    current_timestamp_utc: new Date().toISOString(),
    isolation_forest_raw_score: -0.065,
    normalized_risk_probability: 0.08,
    dominant_anomalous_features: [],
    model_confidence_interval: [0.04, 0.13],
    risk_tier: "GREEN",
  },
  {
    segment_id: "seg-nh44-02",
    current_timestamp_utc: new Date().toISOString(),
    isolation_forest_raw_score: -0.156,
    normalized_risk_probability: 0.42,
    dominant_anomalous_features: ["corridor_delay_freq", "wind_speed"],
    model_confidence_interval: [0.35, 0.50],
    risk_tier: "YELLOW",
  },
  {
    segment_id: "seg-nh44-03",
    current_timestamp_utc: new Date().toISOString(),
    isolation_forest_raw_score: -0.098,
    normalized_risk_probability: 0.19,
    dominant_anomalous_features: [],
    model_confidence_interval: [0.13, 0.26],
    risk_tier: "GREEN",
  },
  {
    segment_id: "seg-nh45-01",
    current_timestamp_utc: new Date().toISOString(),
    isolation_forest_raw_score: -0.052,
    normalized_risk_probability: 0.06,
    dominant_anomalous_features: [],
    model_confidence_interval: [0.02, 0.11],
    risk_tier: "GREEN",
  },
  {
    segment_id: "seg-nh45-02",
    current_timestamp_utc: new Date().toISOString(),
    isolation_forest_raw_score: -0.047,
    normalized_risk_probability: 0.05,
    dominant_anomalous_features: [],
    model_confidence_interval: [0.02, 0.09],
    risk_tier: "GREEN",
  },
  {
    segment_id: "seg-nh32-01",
    current_timestamp_utc: new Date().toISOString(),
    isolation_forest_raw_score: -0.241,
    normalized_risk_probability: 0.57,
    dominant_anomalous_features: ["rainfall_spike", "transit_time_variance"],
    model_confidence_interval: [0.49, 0.65],
    risk_tier: "ORANGE",
  },
  {
    segment_id: "seg-nh32-02",
    current_timestamp_utc: new Date().toISOString(),
    isolation_forest_raw_score: -0.128,
    normalized_risk_probability: 0.31,
    dominant_anomalous_features: ["velocity_plunge"],
    model_confidence_interval: [0.24, 0.38],
    risk_tier: "YELLOW",
  },
  {
    segment_id: "seg-sh-local-01",
    current_timestamp_utc: new Date().toISOString(),
    isolation_forest_raw_score: -0.289,
    normalized_risk_probability: 0.68,
    dominant_anomalous_features: ["corridor_delay_freq", "velocity_plunge"],
    model_confidence_interval: [0.61, 0.76],
    risk_tier: "ORANGE",
  },
  // NH19
  {
    segment_id: "seg-nh19-01",
    current_timestamp_utc: new Date().toISOString(),
    isolation_forest_raw_score: -0.078,
    normalized_risk_probability: 0.11,
    dominant_anomalous_features: [],
    model_confidence_interval: [0.06, 0.17],
    risk_tier: "GREEN",
  },
  {
    segment_id: "seg-nh19-02",
    current_timestamp_utc: new Date().toISOString(),
    isolation_forest_raw_score: -0.061,
    normalized_risk_probability: 0.07,
    dominant_anomalous_features: [],
    model_confidence_interval: [0.03, 0.12],
    risk_tier: "GREEN",
  },
  {
    segment_id: "seg-nh19-03",
    current_timestamp_utc: new Date().toISOString(),
    isolation_forest_raw_score: -0.198,
    normalized_risk_probability: 0.49,
    dominant_anomalous_features: ["corridor_delay_freq", "transit_time_variance"],
    model_confidence_interval: [0.41, 0.57],
    risk_tier: "YELLOW",
  },
  // NH48-Delhi
  {
    segment_id: "seg-nh48d-01",
    current_timestamp_utc: new Date().toISOString(),
    isolation_forest_raw_score: -0.088,
    normalized_risk_probability: 0.14,
    dominant_anomalous_features: [],
    model_confidence_interval: [0.08, 0.21],
    risk_tier: "GREEN",
  },
  {
    segment_id: "seg-nh48d-02",
    current_timestamp_utc: new Date().toISOString(),
    isolation_forest_raw_score: -0.072,
    normalized_risk_probability: 0.10,
    dominant_anomalous_features: [],
    model_confidence_interval: [0.05, 0.16],
    risk_tier: "GREEN",
  },
  // NH58
  {
    segment_id: "seg-nh58-01",
    current_timestamp_utc: new Date().toISOString(),
    isolation_forest_raw_score: -0.164,
    normalized_risk_probability: 0.39,
    dominant_anomalous_features: ["corridor_delay_freq"],
    model_confidence_interval: [0.31, 0.47],
    risk_tier: "YELLOW",
  },
  {
    segment_id: "seg-nh58-02",
    current_timestamp_utc: new Date().toISOString(),
    isolation_forest_raw_score: -0.213,
    normalized_risk_probability: 0.55,
    dominant_anomalous_features: ["velocity_plunge", "rainfall_spike"],
    model_confidence_interval: [0.47, 0.63],
    risk_tier: "ORANGE",
  },
  {
    segment_id: "seg-nh58-03",
    current_timestamp_utc: new Date().toISOString(),
    isolation_forest_raw_score: -0.342,
    normalized_risk_probability: 0.82,
    dominant_anomalous_features: ["rainfall_spike", "velocity_plunge", "water_level"],
    model_confidence_interval: [0.75, 0.89],
    risk_tier: "RED",
  },
  // NH27
  {
    segment_id: "seg-nh27-01",
    current_timestamp_utc: new Date().toISOString(),
    isolation_forest_raw_score: -0.115,
    normalized_risk_probability: 0.23,
    dominant_anomalous_features: ["wind_speed"],
    model_confidence_interval: [0.16, 0.31],
    risk_tier: "GREEN",
  },
  {
    segment_id: "seg-nh27-02",
    current_timestamp_utc: new Date().toISOString(),
    isolation_forest_raw_score: -0.187,
    normalized_risk_probability: 0.46,
    dominant_anomalous_features: ["transit_time_variance", "corridor_delay_freq"],
    model_confidence_interval: [0.38, 0.54],
    risk_tier: "YELLOW",
  },
  {
    segment_id: "seg-nh27-03",
    current_timestamp_utc: new Date().toISOString(),
    isolation_forest_raw_score: -0.138,
    normalized_risk_probability: 0.33,
    dominant_anomalous_features: ["velocity_plunge"],
    model_confidence_interval: [0.26, 0.41],
    risk_tier: "YELLOW",
  },
];

// ── Mock Shipments ─────────────────────────────────────────────────────────────

export const MOCK_SHIPMENTS: Shipment[] = [
  {
    id: "ship-001",
    name: "FC-TN-2401",
    cargo: "Automotive Components",
    origin: "Chennai",
    destination: "Bengaluru",
    segment_id: "seg-nh48-01",
    progress: 0.65,
    eta_hours: 3.2,
  },
  {
    id: "ship-002",
    name: "FC-TN-2402",
    cargo: "Pharmaceutical Supplies",
    origin: "Chennai",
    destination: "Vellore",
    segment_id: "seg-nh48-03",
    progress: 0.3,
    eta_hours: 7.5,
  },
  {
    id: "ship-003",
    name: "FC-WB-1801",
    cargo: "Steel Coils",
    origin: "Kolkata",
    destination: "Visakhapatnam",
    segment_id: "seg-nh16-02",
    progress: 0.55,
    eta_hours: 11.0,
  },
  {
    id: "ship-004",
    name: "FC-WB-1802",
    cargo: "FMCG Goods",
    origin: "Bhubaneswar",
    destination: "Visakhapatnam",
    segment_id: "seg-nh16-04",
    progress: 0.8,
    eta_hours: 2.1,
  },
  {
    id: "ship-005",
    name: "FC-KA-3201",
    cargo: "Electronics Components",
    origin: "Bengaluru",
    destination: "Hyderabad",
    segment_id: "seg-nh44-02",
    progress: 0.4,
    eta_hours: 5.8,
  },
  {
    id: "ship-006",
    name: "FC-KA-3202",
    cargo: "Textiles & Garments",
    origin: "Bengaluru",
    destination: "Mysuru",
    segment_id: "seg-nh45-01",
    progress: 0.7,
    eta_hours: 1.2,
  },
  {
    id: "ship-007",
    name: "FC-TN-2403",
    cargo: "Seafood (Perishable)",
    origin: "Chennai",
    destination: "Pondicherry",
    segment_id: "seg-nh32-01",
    progress: 0.45,
    eta_hours: 2.8,
  },
  {
    id: "ship-008",
    name: "FC-TN-2404",
    cargo: "Construction Material",
    origin: "Chennai Port",
    destination: "Tambaram",
    segment_id: "seg-sh-local-01",
    progress: 0.6,
    eta_hours: 0.5,
  },
  {
    id: "ship-009",
    name: "FC-DL-4401",
    cargo: "Marble & Granite",
    origin: "Delhi",
    destination: "Agra",
    segment_id: "seg-nh19-01",
    progress: 0.5,
    eta_hours: 1.8,
  },
  {
    id: "ship-010",
    name: "FC-DL-4402",
    cargo: "Handicrafts & Textiles",
    origin: "Delhi",
    destination: "Jaipur",
    segment_id: "seg-nh48d-01",
    progress: 0.35,
    eta_hours: 3.5,
  },
  {
    id: "ship-011",
    name: "FC-UK-5801",
    cargo: "Medical Equipment",
    origin: "Delhi",
    destination: "Dehradun",
    segment_id: "seg-nh58-02",
    progress: 0.6,
    eta_hours: 2.4,
  },
  {
    id: "ship-012",
    name: "FC-UP-2701",
    cargo: "Agricultural Produce",
    origin: "Lucknow",
    destination: "Varanasi",
    segment_id: "seg-nh27-02",
    progress: 0.45,
    eta_hours: 4.2,
  },
];

// ── Mock Alternative Routes ────────────────────────────────────────────────────

export const MOCK_ALTERNATIVE_ROUTES: AlternativeRoute[] = [
  {
    id: "alt-01",
    label: "Via NH44 (Krishnagiri Bypass)",
    via: "NH44 → SH104 → NH48 re-join at Hosur",
    extra_distance_km: 18,
    time_delta_hours: 0.8,
    risk_score: 0.11,
    toll_cost_inr: 340,
    recommended: true,
  },
  {
    id: "alt-02",
    label: "Via SH65 (Vellore Inland)",
    via: "SH65 through Ranipet → Ambur",
    extra_distance_km: 31,
    time_delta_hours: 1.5,
    risk_score: 0.19,
    toll_cost_inr: 180,
    recommended: false,
  },
  {
    id: "alt-03",
    label: "Via NH48 Coastal (Original)",
    via: "NH48 direct — disruption zone active",
    extra_distance_km: 0,
    time_delta_hours: 4.5,
    risk_score: 0.87,
    toll_cost_inr: 220,
    recommended: false,
  },
];

// ── Mock Gemini Alerts ─────────────────────────────────────────────────────────

export const MOCK_ALERTS: GeminiAlert[] = [
  {
    id: "alert-001",
    severity: "critical",
    nh_identifier: "NH48",
    headline: "Flood-induced closure risk — T-4h window",
    body: "IsolationForest flags seg-nh48-04 at 87% disruption probability. Rainfall_spike (114mm/6h) and velocity_plunge (8 km/h avg) are dominant signals, mirroring the Nov 2023 Chennai Floods precursor pattern. Recommend immediate reroute via NH44 Krishnagiri bypass to avoid 6–9h cascading delay.",
    created_at: new Date(Date.now() - 4 * 60000).toISOString(),
    resolved: false,
  },
  {
    id: "alert-002",
    severity: "high",
    nh_identifier: "NH16",
    headline: "Fuel strike disruption on Bhubaneswar–Vizag corridor",
    body: "seg-nh16-03 shows 76% risk driven by fuel_strike and transit_time_variance features. Three truckers' union checkpoints active near Berhampur. Prophet model forecasts 45% probability of full blockage within 12 hours. SME carrier re-allocation recommended via AIF360 fairness constraint.",
    created_at: new Date(Date.now() - 22 * 60000).toISOString(),
    resolved: false,
  },
  {
    id: "alert-003",
    severity: "moderate",
    nh_identifier: "NH48",
    headline: "Elevated delay variance — monitor seg-nh48-02",
    body: "corridor_delay_freq elevated at 38% risk on seg-nh48-02 (Chennai–Vellore). No immediate action required. Continue monitoring; Prophet 6h forecast shows 55% probability of escalation to HIGH if rainfall exceeds 30mm/h threshold.",
    created_at: new Date(Date.now() - 58 * 60000).toISOString(),
    resolved: false,
  },
  {
    id: "alert-004",
    severity: "high",
    nh_identifier: "NH16",
    headline: "Wind-speed anomaly near Bhadrak — seg-nh16-01",
    body: "Wind gusts recorded at 78 km/h on seg-nh16-01. Visibility reduced to 1.8 km. IsolationForest raw score: −0.113. Recommend speed advisory for heavy vehicles. Escalation probability: 31% within 4h based on IMD forecast.",
    created_at: new Date(Date.now() - 90 * 60000).toISOString(),
    resolved: true,
  },
];

// ── Mock Suppliers ─────────────────────────────────────────────────────────────

export const MOCK_SUPPLIERS: SupplierRecord[] = [
  // Large enterprises
  {
    id: "sup-le-01",
    name: "Mahindra Logistics Ltd.",
    region: "Mumbai, MH",
    category: "large-enterprise",
    actual_performance_score: 0.91,
    ai_trust_score: 0.89,
  },
  {
    id: "sup-le-02",
    name: "BlueDart Express Pvt. Ltd.",
    region: "Delhi, DL",
    category: "large-enterprise",
    actual_performance_score: 0.88,
    ai_trust_score: 0.87,
  },
  // SMEs
  {
    id: "sup-sme-01",
    name: "Ravi Road Carriers",
    region: "Coimbatore, TN",
    category: "sme",
    actual_performance_score: 0.82,
    ai_trust_score: 0.61,
  },
  {
    id: "sup-sme-02",
    name: "Krishna Transport Co.",
    region: "Visakhapatnam, AP",
    category: "sme",
    actual_performance_score: 0.79,
    ai_trust_score: 0.58,
  },
  {
    id: "sup-sme-03",
    name: "Deccan Freight Services",
    region: "Hyderabad, TS",
    category: "sme",
    actual_performance_score: 0.84,
    ai_trust_score: 0.63,
  },
  // Women-owned
  {
    id: "sup-wo-01",
    name: "Shakti Logistics (W)",
    region: "Pune, MH",
    category: "women-owned",
    actual_performance_score: 0.86,
    ai_trust_score: 0.64,
  },
  {
    id: "sup-wo-02",
    name: "Prerna Supply Chain (W)",
    region: "Chennai, TN",
    category: "women-owned",
    actual_performance_score: 0.80,
    ai_trust_score: 0.59,
  },
  // Developing-economy
  {
    id: "sup-de-01",
    name: "North-East Connect Carriers",
    region: "Guwahati, AS",
    category: "developing-economy",
    actual_performance_score: 0.74,
    ai_trust_score: 0.52,
  },
  {
    id: "sup-de-02",
    name: "Bastar Rural Logistics",
    region: "Jagdalpur, CG",
    category: "developing-economy",
    actual_performance_score: 0.71,
    ai_trust_score: 0.49,
  },
];
