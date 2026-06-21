# VideoSub backend

FastAPI service that transcribes an uploaded video, translates the speech to
Hindi, and burns the Hindi text onto the video as captions.

See the [project README](../README.md) for the full overview and API reference.

## Run (dev)

```bash
uv sync
uv run uvicorn app.main:app --reload --port 8000
```
