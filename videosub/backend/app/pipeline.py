"""Core pipeline: transcribe -> translate to Hindi -> burn captions onto video."""
from __future__ import annotations

import subprocess
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path

from deep_translator import GoogleTranslator
from faster_whisper import WhisperModel

from .config import (
    SUBTITLE_FONT,
    TARGET_LANGUAGE,
    WHISPER_COMPUTE_TYPE,
    WHISPER_DEVICE,
    WHISPER_MODEL,
)


@dataclass
class Segment:
    start: float
    end: float
    source_text: str
    hindi_text: str = ""


@lru_cache(maxsize=1)
def _get_model() -> WhisperModel:
    """Load the Whisper model once and cache it for the process lifetime."""
    return WhisperModel(
        WHISPER_MODEL, device=WHISPER_DEVICE, compute_type=WHISPER_COMPUTE_TYPE
    )


def transcribe(video_path: Path) -> tuple[str, list[Segment]]:
    """Transcribe speech from a media file into timestamped segments."""
    model = _get_model()
    segments_iter, info = model.transcribe(str(video_path), vad_filter=True)
    segments = [
        Segment(start=s.start, end=s.end, source_text=s.text.strip())
        for s in segments_iter
        if s.text.strip()
    ]
    return info.language, segments


def translate_to_hindi(segments: list[Segment], source_language: str) -> list[Segment]:
    """Translate each segment's text into Hindi using Google Translate."""
    if not segments:
        return segments
    # Skip translation if the source is already Hindi.
    if source_language == TARGET_LANGUAGE:
        for seg in segments:
            seg.hindi_text = seg.source_text
        return segments

    translator = GoogleTranslator(source="auto", target=TARGET_LANGUAGE)
    texts = [seg.source_text for seg in segments]
    try:
        translated = translator.translate_batch(texts)
    except Exception:
        # Fall back to per-segment translation if batch fails.
        translated = []
        for text in texts:
            try:
                translated.append(translator.translate(text))
            except Exception:
                translated.append(text)

    for seg, hi in zip(segments, translated):
        seg.hindi_text = (hi or seg.source_text).strip()
    return segments


def _format_timestamp(seconds: float) -> str:
    millis = int(round(seconds * 1000))
    hours, millis = divmod(millis, 3_600_000)
    minutes, millis = divmod(millis, 60_000)
    secs, millis = divmod(millis, 1000)
    return f"{hours:02d}:{minutes:02d}:{secs:02d},{millis:03d}"


def build_srt(segments: list[Segment], srt_path: Path) -> Path:
    """Write Hindi segments to an SRT subtitle file."""
    lines: list[str] = []
    for idx, seg in enumerate(segments, start=1):
        text = seg.hindi_text or seg.source_text
        lines.append(str(idx))
        lines.append(f"{_format_timestamp(seg.start)} --> {_format_timestamp(seg.end)}")
        lines.append(text)
        lines.append("")
    srt_path.write_text("\n".join(lines), encoding="utf-8")
    return srt_path


def _escape_for_filter(path: Path) -> str:
    """Escape a path for use inside ffmpeg's subtitles filter argument."""
    text = str(path)
    text = text.replace("\\", "\\\\")
    text = text.replace(":", r"\:")
    text = text.replace("'", r"\'")
    return text


def burn_subtitles(video_path: Path, srt_path: Path, output_path: Path) -> Path:
    """Burn the SRT captions onto the video as hard subtitles via ffmpeg."""
    style = (
        f"FontName={SUBTITLE_FONT},FontSize=20,PrimaryColour=&H00FFFFFF,"
        "OutlineColour=&H80000000,BorderStyle=3,Outline=2,Shadow=0,MarginV=30"
    )
    sub_filter = f"subtitles='{_escape_for_filter(srt_path)}':force_style='{style}'"
    cmd = [
        "ffmpeg",
        "-y",
        "-i",
        str(video_path),
        "-vf",
        sub_filter,
        "-c:v",
        "libx264",
        "-preset",
        "veryfast",
        "-c:a",
        "aac",
        "-movflags",
        "+faststart",
        str(output_path),
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(f"ffmpeg failed: {result.stderr[-2000:]}")
    return output_path
