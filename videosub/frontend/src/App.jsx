import { useEffect, useRef, useState } from 'react'
import './App.css'

const STAGE_LABELS = {
  queued: 'Queued',
  transcribing: 'Transcribing speech',
  translating: 'Translating to Hindi',
  rendering: 'Burning captions onto video',
  done: 'Done',
  error: 'Failed',
}

function App() {
  const [file, setFile] = useState(null)
  const [job, setJob] = useState(null)
  const [error, setError] = useState(null)
  const [uploading, setUploading] = useState(false)
  const pollRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => () => clearInterval(pollRef.current), [])

  const isProcessing =
    job && (job.status === 'queued' || job.status === 'processing')

  const pollStatus = (jobId) => {
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/jobs/${jobId}`)
        const data = await res.json()
        setJob(data)
        if (data.status === 'done' || data.status === 'error') {
          clearInterval(pollRef.current)
        }
      } catch {
        setError('Lost connection to the server.')
        clearInterval(pollRef.current)
      }
    }, 1500)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return
    setError(null)
    setJob(null)
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/jobs', { method: 'POST', body: formData })
      if (!res.ok) throw new Error('Upload failed')
      const data = await res.json()
      setJob({ ...data, stage: 'queued' })
      pollStatus(data.job_id)
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const reset = () => {
    clearInterval(pollRef.current)
    setJob(null)
    setFile(null)
    setError(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="page">
      <header className="hero">
        <h1>
          VideoSub <span role="img" aria-label="film">🎬</span>
        </h1>
        <p>Upload a video and get it back with burned-in Hindi captions.</p>
      </header>

      <main className="card">
        {!job && (
          <form onSubmit={handleSubmit} className="upload-form">
            <label className="dropzone">
              <input
                ref={inputRef}
                type="file"
                accept="video/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              <div className="dropzone-inner">
                <span className="upload-icon" role="img" aria-label="upload">⬆️</span>
                <p>{file ? file.name : 'Choose a video file'}</p>
                <small>MP4, MOV, WEBM, MKV…</small>
              </div>
            </label>
            <button type="submit" disabled={!file || uploading}>
              {uploading ? 'Uploading…' : 'Generate Hindi captions'}
            </button>
          </form>
        )}

        {job && (
          <section className="status">
            {isProcessing && (
              <>
                <div className="spinner" />
                <h2>{STAGE_LABELS[job.stage] || 'Working…'}</h2>
                <p className="muted">This can take a little while for longer clips.</p>
              </>
            )}

            {job.status === 'error' && (
              <>
                <h2 className="error-title">Something went wrong</h2>
                <p className="error-detail">{job.error}</p>
                <button onClick={reset}>Try again</button>
              </>
            )}

            {job.status === 'done' && (
              <>
                <h2 className="done-title">Hindi captions ready ✅</h2>
                {job.source_language && (
                  <p className="muted">
                    Detected source language: <strong>{job.source_language}</strong>
                  </p>
                )}
                <video
                  className="result-video"
                  src={job.video_url}
                  controls
                  autoPlay
                />
                <div className="actions">
                  <a className="button" href={job.video_url} download>
                    Download video
                  </a>
                  <a className="button ghost" href={job.subtitles_url} download>
                    Download .srt
                  </a>
                  <button className="ghost" onClick={reset}>
                    New video
                  </button>
                </div>

                {job.segments?.length > 0 && (
                  <details className="transcript">
                    <summary>Transcript ({job.segments.length} lines)</summary>
                    <ul>
                      {job.segments.map((seg, i) => (
                        <li key={i}>
                          <span className="ts">
                            {seg.start.toFixed(1)}s
                          </span>
                          <span className="hi">{seg.hindi_text}</span>
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </>
            )}
          </section>
        )}

        {error && <p className="error-detail">{error}</p>}
      </main>

      <footer className="foot">FastAPI + Whisper + ffmpeg · React + Vite</footer>
    </div>
  )
}

export default App
