"""FastAPI app exposing the Hindi video-captioning pipeline."""
from __future__ import annotations

import shutil
import threading
from pathlib import Path

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from .config import OUTPUT_DIR, UPLOAD_DIR
from .jobs import run_job, store

app = FastAPI(title="VideoSub", description="Burn Hindi subtitles onto uploaded videos")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/api/jobs")
async def create_job(file: UploadFile = File(...)) -> dict:
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    job = store.create()
    suffix = Path(file.filename).suffix or ".mp4"
    input_path = UPLOAD_DIR / f"{job.id}{suffix}"
    with input_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    thread = threading.Thread(target=run_job, args=(job.id, input_path), daemon=True)
    thread.start()

    return {"job_id": job.id, "status": job.status}


@app.get("/api/jobs/{job_id}")
def job_status(job_id: str) -> dict:
    job = store.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return {
        "job_id": job.id,
        "status": job.status,
        "stage": job.stage,
        "source_language": job.source_language,
        "segments": job.segments,
        "error": job.error,
        "video_url": f"/api/jobs/{job.id}/video" if job.status == "done" else None,
        "subtitles_url": f"/api/jobs/{job.id}/subtitles" if job.status == "done" else None,
    }


@app.get("/api/jobs/{job_id}/video")
def job_video(job_id: str):
    job = store.get(job_id)
    if not job or not job.video_filename:
        raise HTTPException(status_code=404, detail="Video not ready")
    path = OUTPUT_DIR / job.video_filename
    if not path.exists():
        raise HTTPException(status_code=404, detail="Video file missing")
    return FileResponse(path, media_type="video/mp4", filename="captioned.mp4")


@app.get("/api/jobs/{job_id}/subtitles")
def job_subtitles(job_id: str):
    job = store.get(job_id)
    if not job or not job.srt_filename:
        raise HTTPException(status_code=404, detail="Subtitles not ready")
    path = OUTPUT_DIR / job.srt_filename
    if not path.exists():
        raise HTTPException(status_code=404, detail="Subtitle file missing")
    return FileResponse(path, media_type="application/x-subrip", filename="captions.srt")
