"use client";

import { useState, useEffect, useRef } from "react";
import { Sparkles, CheckCircle, AlertTriangle, Info, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GeminiAlert } from "@/lib/mockData";

interface GeminiPanelProps {
  alerts: GeminiAlert[];
  onResolve: (id: string) => void;
}

const SEVERITY_CONFIG = {
  critical: {
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
    label: "CRITICAL",
    color: "#ef4444",
    bg: "bg-risk-red/10",
    border: "border-risk-red/40",
    dot: "bg-risk-red",
  },
  high: {
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
    label: "HIGH",
    color: "#f97316",
    bg: "bg-risk-orange/10",
    border: "border-risk-orange/40",
    dot: "bg-risk-orange",
  },
  moderate: {
    icon: <Info className="w-3.5 h-3.5" />,
    label: "MODERATE",
    color: "#eab308",
    bg: "bg-risk-yellow/10",
    border: "border-risk-yellow/40",
    dot: "bg-risk-yellow",
  },
} as const;

function useTypingAnimation(text: string, running: boolean, speed = 18) {
  const [displayed, setDisplayed] = useState("");
  const idx = useRef(0);

  useEffect(() => {
    if (!running) {
      setDisplayed(text);
      return;
    }
    setDisplayed("");
    idx.current = 0;
    const timer = setInterval(() => {
      idx.current += 1;
      setDisplayed(text.slice(0, idx.current));
      if (idx.current >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, running, speed]);

  return { displayed, done: displayed.length >= text.length };
}

function AlertCard({
  alert,
  onResolve,
  autoType,
}: {
  alert: GeminiAlert;
  onResolve: (id: string) => void;
  autoType: boolean;
}) {
  const [expanded, setExpanded] = useState(autoType);
  const config = SEVERITY_CONFIG[alert.severity];
  const { displayed, done } = useTypingAnimation(alert.body, autoType && expanded);

  // Hydration-safe relative timestamp: render a stable placeholder on the
  // server, then compute the real value only on the client.
  const [timeAgoText, setTimeAgoText] = useState("");
  useEffect(() => {
    const update = () => {
      const diff = Math.floor((Date.now() - new Date(alert.created_at).getTime()) / 60000);
      setTimeAgoText(diff < 1 ? "just now" : `${diff}m ago`);
    };
    update();
    const id = setInterval(update, 30000); // refresh every 30s
    return () => clearInterval(id);
  }, [alert.created_at]);

  return (
    <div
      className={cn(
        "rounded-2xl border transition-all duration-200",
        config.bg,
        config.border,
        alert.resolved && "opacity-40"
      )}
      id={`alert-card-${alert.id}`}
    >
      {/* Alert header */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-start justify-between px-4 py-3 text-left"
        id={`alert-toggle-${alert.id}`}
        aria-expanded={expanded}
      >
        <div className="flex items-start gap-2.5 flex-1 min-w-0">
          <div className="flex flex-col items-center gap-1 pt-0.5 flex-shrink-0">
            <span style={{ color: config.color }}>{config.icon}</span>
            {!alert.resolved && (
              <span
                className={cn("w-1.5 h-1.5 rounded-full animate-pulse", config.dot)}
              />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-xs font-bold tracking-widest px-1.5 py-0.5 rounded"
                style={{ color: config.color, background: `${config.color}20` }}
              >
                {config.label}
              </span>
              <span className="text-xs text-muted">{alert.nh_identifier}</span>
              <span className="text-xs text-muted">{timeAgoText}</span>
            </div>
            <div className="text-sm font-semibold text-fc-200 mt-1 leading-tight">
              {alert.headline}
            </div>
          </div>
        </div>
        <div className="text-muted ml-2 flex-shrink-0 pt-1">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded body — typing animation */}
      {expanded && (
        <div className="px-4 pb-4 animate-fade-in">
          <div className="text-xs text-fc-400 leading-relaxed border-t border-fc-700/50 pt-3">
            <Sparkles className="w-3 h-3 inline mr-1 text-accent-purple" />
            <span className={cn(!done && "typing-cursor")}>{displayed}</span>
          </div>
          {!alert.resolved && (
            <div className="flex justify-end mt-3">
              <button
                id={`resolve-btn-${alert.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onResolve(alert.id);
                }}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-fc-600 text-muted hover:text-risk-green hover:border-risk-green transition-colors"
              >
                <CheckCircle className="w-3 h-3" />
                Mark Resolved
              </button>
            </div>
          )}
          {alert.resolved && (
            <div className="flex items-center gap-1.5 mt-3 text-xs text-risk-green">
              <CheckCircle className="w-3.5 h-3.5" />
              Resolved
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function GeminiPanel({ alerts, onResolve }: GeminiPanelProps) {
  const sorted = [...alerts].sort((a, b) => {
    const order = { critical: 0, high: 1, moderate: 2 };
    if (order[a.severity] !== order[b.severity]) return order[a.severity] - order[b.severity];
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const activeCount = sorted.filter((a) => !a.resolved).length;

  return (
    <div className="flex flex-col h-full" id="gemini-panel">
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-fc-700 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent-purple" />
          <span className="font-lexend font-semibold text-sm text-fc-200">AI Insight Console</span>
          <span className="text-xs text-muted font-mono">Gemini 1.5</span>
        </div>
        {activeCount > 0 && (
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-risk-red/20 text-risk-red border border-risk-red/30">
            {activeCount} active
          </span>
        )}
      </div>

      {/* Alerts list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted text-sm py-8">
            <CheckCircle className="w-8 h-8 text-risk-green mb-2" />
            All systems nominal
          </div>
        ) : (
          sorted.map((alert, idx) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onResolve={onResolve}
              autoType={idx === 0 && !alert.resolved}
            />
          ))
        )}
      </div>

      {/* Footer badge */}
      <div className="px-4 py-2.5 border-t border-fc-700 flex items-center gap-1.5 text-xs text-muted flex-shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-accent-purple animate-pulse" />
        Powered by Google Gemini · Isolation Forest · Prophet
      </div>
    </div>
  );
}
