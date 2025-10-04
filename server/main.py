from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.predict import router as predict_router

app = FastAPI(
    title="Hy-Bieda Simulator API",
    description="Economic prediction API for Polish citizens",
    version="0.1.0"
)

# CORS — allows frontend (localhost:3000) to talk to backend (localhost:8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # later replace "*" with your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include /api routes
app.include_router(predict_router, prefix="/api")
