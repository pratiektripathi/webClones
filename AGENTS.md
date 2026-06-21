# AGENTS.md

## Cursor Cloud specific instructions

`webClones` is a collection of independent practice web projects. Each project lives in its own folder and is installed/run separately — there is no root-level workspace tooling.

### Projects and how to run them (dev)

- `vsClone/` — static HTML/CSS VS Code clone. No build step; open `vsClone/index.html` directly or serve the folder with `python3 -m http.server`.
- `CowWallet/` — Vite + React (Solana wallet UI). `npm run dev` (Vite, port 5173), `npm run build`, `npm run lint`. Note: `npm run lint` reports pre-existing unused-var / prop-types errors in `src/` — these are existing, not introduced by setup.
- `codeStake/codestake/` — Next.js app. `npm run dev` (port 3000), `npm run build`, `npm run lint`. `mongoose` is a dependency but the current page does not actually connect to MongoDB, so no database is needed to run it.
- `todoApp/backend/` — Express server. Requires a `.env` file with `PORT` (e.g. `PORT=4000`); it is gitignored and read via `dotenv`. Start with `npm start` (nodemon). Caveat: the `/` route always redirects to `/signin` due to a hardcoded key mismatch in `index.js` (`key="pateek"` vs the check for `"prateek"`) — this is existing app behavior. The todo UI (`frontend/index.html`) is purely client-side and does not call the backend.
- `videosub/` — Hindi video-captioning app (see below).

### videosub (FastAPI + React)

Upload a video → transcribe (faster-whisper) → translate to Hindi (Google Translate via `deep-translator`) → burn Hindi `.srt` onto the video with `ffmpeg`.

- Backend: `cd videosub/backend && uv run uvicorn app.main:app --reload --port 8000`. It is a `uv`-managed project (`uv sync` installs into `.venv`).
- Frontend: `cd videosub/frontend && npm run dev` (port 5173; Vite proxies `/api` → `http://localhost:8000`). Start the backend first.
- `uv` is installed at `~/.local/bin/uv` (added to PATH in `~/.bashrc`).
- System requirements that must be present: `ffmpeg` (with libx264) and a Devanagari font (`fonts-noto` / "Noto Sans Devanagari") — without the font, Hindi captions render as boxes.
- The faster-whisper model downloads on first request (cached under `~/.cache/huggingface`); transcription and Google Translate both require internet access.
- Uploads and rendered videos are written to `videosub/backend/uploads` and `videosub/backend/outputs` (both gitignored).
- Expected behavior: a video with no detectable speech returns a clean "No speech could be detected" error (Whisper VAD yields zero segments) rather than crashing.
