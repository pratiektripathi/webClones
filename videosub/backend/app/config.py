import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"
OUTPUT_DIR = BASE_DIR / "outputs"
UPLOAD_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)

# Whisper model size: tiny | base | small | medium | large-v3.
# "base" is a good speed/accuracy tradeoff for CPU-only dev machines.
WHISPER_MODEL = os.getenv("VIDEOSUB_WHISPER_MODEL", "base")
WHISPER_DEVICE = os.getenv("VIDEOSUB_WHISPER_DEVICE", "cpu")
WHISPER_COMPUTE_TYPE = os.getenv("VIDEOSUB_WHISPER_COMPUTE_TYPE", "int8")

TARGET_LANGUAGE = "hi"  # Hindi

# Font used by libass when burning the captions. Noto Sans Devanagari ships
# with the Debian/Ubuntu `fonts-noto` package and renders Hindi correctly.
SUBTITLE_FONT = os.getenv("VIDEOSUB_SUBTITLE_FONT", "Noto Sans Devanagari")
