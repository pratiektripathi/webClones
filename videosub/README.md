# VideoSub

Upload a video and get it back with **burned-in Hindi captions**.

The pipeline:

1. **Transcribe** the spoken audio with [faster-whisper](https://github.com/SYSTRAN/faster-whisper) (timestamped segments, auto language detection).
2. **Translate** each segment to Hindi with Google Translate (via `deep-translator`).
3. **Render** the Hindi text into an `.srt` file and **burn** it onto the video with `ffmpeg` using the Noto Sans Devanagari font.

## Project layout

```
videosub/
├── backend/    # Python FastAPI app (uv-managed virtualenv)
│   └── app/    # main.py (API), pipeline.py (transcribe/translate/burn), jobs.py
└── frontend/   # Vite + React upload UI
```

## Prerequisites

- `ffmpeg` (with libx264) and a Devanagari font (`fonts-noto`) on the system.
- [`uv`](https://docs.astral.sh/uv/) for the Python backend.
- Node.js for the frontend.
- Internet access (the Whisper model is downloaded on first run, and Google Translate is called for translation).

## Backend

```bash
cd backend
uv sync                                   # install deps into .venv
uv run uvicorn app.main:app --reload --port 8000
```

Environment variables (all optional):

| Variable | Default | Description |
| --- | --- | --- |
| `VIDEOSUB_WHISPER_MODEL` | `base` | Whisper model size (`tiny`/`base`/`small`/`medium`/`large-v3`). |
| `VIDEOSUB_WHISPER_DEVICE` | `cpu` | `cpu` or `cuda`. |
| `VIDEOSUB_WHISPER_COMPUTE_TYPE` | `int8` | CTranslate2 compute type. |
| `VIDEOSUB_SUBTITLE_FONT` | `Noto Sans Devanagari` | Font used by libass for burned captions. |

### API

- `POST /api/jobs` — multipart `file` upload, returns `{ job_id }`.
- `GET /api/jobs/{job_id}` — job status, stage, transcript, and result URLs.
- `GET /api/jobs/{job_id}/video` — the captioned MP4.
- `GET /api/jobs/{job_id}/subtitles` — the generated `.srt`.

## Frontend

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173  (proxies /api -> :8000)
```
