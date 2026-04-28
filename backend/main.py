import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.disruptions import router as disruptions_router
from routes.fairness import router as fairness_router
from routes.gemini import router as gemini_router

# ---------------------------------------------------------------------------
# Logging — structured for cloud (Render / Cloud Run)
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s  %(message)s",
)

# ---------------------------------------------------------------------------
# FastAPI app
# ---------------------------------------------------------------------------
app = FastAPI(
    title="FairChain API",
    description="Real-time supply chain disruption prediction, dynamic rerouting, and algorithmic fairness auditing.",
    version="1.0.0",
)

# ---------------------------------------------------------------------------
# CORS — allow Vercel frontend + local dev
# ---------------------------------------------------------------------------
# ALLOWED_ORIGINS env var lets you add custom origins at deploy time
# Format: comma-separated, e.g. "https://fairchain.vercel.app,https://custom.domain"
_extra_origins = [
    o.strip()
    for o in os.environ.get("ALLOWED_ORIGINS", "").split(",")
    if o.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        *_extra_origins,
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",  # All Vercel subdomains
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
app.include_router(disruptions_router)
app.include_router(fairness_router)
app.include_router(gemini_router)


@app.get("/", tags=["health"])
def read_root():
    return {"status": "ok", "service": "FairChain API", "version": "1.0.0"}


@app.get("/health", tags=["health"])
def health_check():
    """Simple health check for Render / load balancer probes."""
    return {"status": "ok"}
