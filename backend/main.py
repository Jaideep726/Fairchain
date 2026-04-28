from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.disruptions import router as disruptions_router
from routes.fairness import router as fairness_router
from routes.gemini import router as gemini_router

app = FastAPI(title="FairChain API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

app.include_router(disruptions_router)
app.include_router(fairness_router)
app.include_router(gemini_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to FairChain API"}
