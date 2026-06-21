"""In-memory job store and the background worker that runs the pipeline."""
from __future__ import annotations

import threading
import traceback
import uuid
from dataclasses import dataclass, field
from pathlib import Path

from .config import OUTPUT_DIR
from .pipeline import build_srt, burn_subtitles, transcribe, translate_to_hindi


@dataclass
class Job:
    id: str
    status: str = "queued"  # queued | processing | done | error
    stage: str = "queued"
    source_language: str | None = None
    segments: list[dict] = field(default_factory=list)
    video_filename: str | None = None
    srt_filename: str | None = None
    error: str | None = None


class JobStore:
    def __init__(self) -> None:
        self._jobs: dict[str, Job] = {}
        self._lock = threading.Lock()

    def create(self) -> Job:
        job = Job(id=uuid.uuid4().hex)
        with self._lock:
            self._jobs[job.id] = job
        return job

    def get(self, job_id: str) -> Job | None:
        with self._lock:
            return self._jobs.get(job_id)

    def update(self, job_id: str, **fields) -> None:
        with self._lock:
            job = self._jobs.get(job_id)
            if job:
                for key, value in fields.items():
                    setattr(job, key, value)


store = JobStore()


def run_job(job_id: str, input_path: Path) -> None:
    """Execute the full pipeline for a job. Intended to run in a background thread."""
    try:
        store.update(job_id, status="processing", stage="transcribing")
        language, segments = transcribe(input_path)
        store.update(job_id, source_language=language)

        if not segments:
            store.update(
                job_id,
                status="error",
                stage="error",
                error="No speech could be detected in this video, so there is "
                "nothing to caption.",
            )
            return

        store.update(job_id, stage="translating")
        segments = translate_to_hindi(segments, language)

        store.update(job_id, stage="rendering")
        srt_path = OUTPUT_DIR / f"{job_id}.srt"
        build_srt(segments, srt_path)

        output_path = OUTPUT_DIR / f"{job_id}.mp4"
        burn_subtitles(input_path, srt_path, output_path)

        store.update(
            job_id,
            status="done",
            stage="done",
            video_filename=output_path.name,
            srt_filename=srt_path.name,
            segments=[
                {
                    "start": s.start,
                    "end": s.end,
                    "source_text": s.source_text,
                    "hindi_text": s.hindi_text,
                }
                for s in segments
            ],
        )
    except Exception as exc:  # noqa: BLE001
        traceback.print_exc()
        store.update(job_id, status="error", stage="error", error=str(exc))
