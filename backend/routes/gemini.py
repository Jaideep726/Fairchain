"""
gemini.py — FairChain Gemini Explainability Route
===================================================
FastAPI router exposing the Gemini-powered explanation endpoint.

Endpoints
---------
POST /gemini/explain — generate human-impact & actionable-advice for a prediction
"""

from __future__ import annotations

import logging
from typing import List

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from services.gemini_explain import generate_explanation

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/gemini", tags=["gemini"])


# ---------------------------------------------------------------------------
# Request / Response schemas
# ---------------------------------------------------------------------------

class ExplainRequest(BaseModel):
    """Prediction result payload sent by the frontend."""
    ml_score: float = Field(..., ge=0, le=1, description="Normalized risk probability (0-1)")
    features: List[str] = Field(default_factory=list, description="Dominant anomalous features")
    weather_data: str = Field("No weather data provided", description="Free-text weather context")
    supplier_data: str = Field("No supplier data provided", description="Free-text supplier context")


class ExplainResponse(BaseModel):
    """Gemini explanation response."""
    human_impact: str
    actionable_advice: str


# ---------------------------------------------------------------------------
# Endpoint
# ---------------------------------------------------------------------------

@router.post(
    "/explain",
    response_model=ExplainResponse,
    summary="Generate a Gemini-powered explanation for a prediction result",
    description=(
        "Accepts a prediction payload (risk score, anomalous features, weather "
        "and supplier context) and returns a human-readable impact statement "
        "and actionable logistics advice via Google Gemini 1.5 Pro."
    ),
)
async def explain(body: ExplainRequest) -> ExplainResponse:
    try:
        result = generate_explanation(
            ml_score=body.ml_score,
            features=body.features,
            weather_data=body.weather_data,
            supplier_data=body.supplier_data,
        )
        return ExplainResponse(**result)
    except Exception as exc:
        logger.exception("Gemini explanation failed")
        raise HTTPException(status_code=500, detail=f"Gemini explanation error: {exc}") from exc
