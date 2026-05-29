'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Check = {
  is_up: boolean
  checked_at: string
  response_time_ms: number
}

type Monitor = {
  id: string
  name: string
  url: string
  is_active: boolean
  created_at: string
  checks: Check[]
}

function getUptimePercent(checks: Check[]) {
  if (!checks.length) return null
  const up = checks.filter(c => c.is_up).length
  return ((up / checks.length) * 100).toFixed(1)
}

function getLastChecked(checks: Check[]) {
  if (!checks.length) return 'Never'
  const latest = [...checks].sort((a, b) =>
    new Date(b.checked_at).getTime() - new Date(a.checked_at).getTime()
  )[0]
  return new Date(latest.checked_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function getStatus(checks: Check[]) {
  if (!checks.length) return null
  return [...checks].sort((a, b) =>
    new Date(b.checked_at).getTime() - new Date(a.checked_at).getTime()
  )[0].is_up
}

function getAvgResponse(checks: Check[]) {
  if (!checks.length) return null
  const up = checks.filter(c => c.is_up && c.response_time_ms)
  if (!up.length) return null
  return Math.round(up.reduce((s, c) => s + c.response_time_ms, 0) / up.length)
}

export default function DashboardPage() {
  const [monitors, setMonitors] = useState<Monitor[]>([])
  const [loading, setLoading] = useState(true)
  const [url, setUrl] = useState('')
  const [name, setName] = useState('')
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function fetchMonitors() {
    const res = await fetch('/api/monitors')
    const data = await res.json()
    setMonitors(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  async function handleAdd() {
    if (!url) return
    setAdding(true)
    setError('')
    const res = await fetch('/api/monitors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, name }),
    })
    const data = await res.json()
    if (data.error) setError(data.error)
    else { setUrl(''); setName(''); setShowForm(false); fetchMonitors() }
    setAdding(false)
  }

  async function handleDelete(id: string) {
    await fetch('/api/monitors', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    fetchMonitors()
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  useEffect(() => {
    let ignore = false
    async function load() {
      const res = await fetch('/api/monitors')
      const data = await res.json()
      if (!ignore) {
        setMonitors(Array.isArray(data) ? data : [])
        setLoading(false)
      }
    }
    load()
    return () => {
      ignore = true
    }
  }, [])

  const allUp = monitors.length > 0 && monitors.every(m => getStatus(m.checks) === true)
  const anyDown = monitors.some(m => getStatus(m.checks) === false)

  return (
    <div suppressHydrationWarning>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --vigil-green: #2D6A4F;
          --vigil-green-light: #D8F3DC;
          --vigil-green-mid: #52B788;
          --vigil-cream: #FAFAF7;
          --vigil-border: #E8E8E0;
          --vigil-text: #1A1A18;
          --vigil-muted: #6B6B60;
          --vigil-red: #C0392B;
          --vigil-red-light: #FDF0EE;
        }

        * { box-sizing: border-box; }

        .db-root {
          min-height: 100vh;
          background: var(--vigil-cream);
          font-family: 'DM Sans', sans-serif;
        }

        .db-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 2rem;
          border-bottom: 1px solid var(--vigil-border);
          background: white;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .db-logo {
          font-family: 'DM Serif Display', serif;
          font-size: 1.6rem;
          color: var(--vigil-text);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 5px;
          letter-spacing: -0.02em;
          font-style: italic;
}

        .db-logo-dot {
          width: 7px;
          height: 7px;
          background: var(--vigil-green-mid);
          border-radius: 50%;
        }

        .db-nav-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .btn-add {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 0.5rem 1rem;
          background: var(--vigil-green);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 0.825rem;
          font-weight: 500;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: opacity 0.15s;
        }

        .btn-add:hover { opacity: 0.88; }

        .btn-signout {
          padding: 0.5rem 1rem;
          border: 1px solid var(--vigil-border);
          border-radius: 8px;
          font-size: 0.825rem;
          background: white;
          color: var(--vigil-muted);
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.15s, color 0.15s;
        }

        .btn-signout:hover { border-color: #999; color: var(--vigil-text); }

        .db-body {
          max-width: 860px;
          margin: 0 auto;
          padding: 2.5rem 1.5rem;
        }

        .status-banner {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0.875rem 1.25rem;
          border-radius: 10px;
          margin-bottom: 2rem;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .status-banner.all-up {
          background: var(--vigil-green-light);
          color: var(--vigil-green);
          border: 1px solid rgba(45,106,79,0.15);
        }

        .status-banner.has-down {
          background: var(--vigil-red-light);
          color: var(--vigil-red);
          border: 1px solid rgba(192,57,43,0.15);
        }

        .status-banner.neutral {
          background: white;
          color: var(--vigil-muted);
          border: 1px solid var(--vigil-border);
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .status-dot.up { background: var(--vigil-green-mid); }
        .status-dot.down { background: var(--vigil-red); }
        .status-dot.neutral { background: #B0B0A8; }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .section-title {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--vigil-muted);
          font-weight: 500;
        }

        .tier-badge {
          font-size: 0.75rem;
          color: var(--vigil-muted);
        }

        .form-card {
          background: white;
          border: 1px solid var(--vigil-border);
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1rem;
        }

        .form-card h2 {
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--vigil-text);
          margin: 0 0 1.25rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .form-field label {
          display: block;
          font-size: 0.775rem;
          font-weight: 500;
          color: var(--vigil-text);
          margin-bottom: 0.35rem;
        }

        .form-field input {
          width: 100%;
          padding: 0.6rem 0.8rem;
          border: 1px solid var(--vigil-border);
          border-radius: 7px;
          font-size: 0.85rem;
          font-family: 'DM Sans', sans-serif;
          background: var(--vigil-cream);
          color: var(--vigil-text);
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }

        .form-field input:focus {
          border-color: var(--vigil-green-mid);
          box-shadow: 0 0 0 3px rgba(82,183,136,0.12);
          background: white;
        }

        .form-field input::placeholder { color: #B0B0A8; }

        .form-error {
          font-size: 0.8rem;
          color: var(--vigil-red);
          margin-bottom: 0.75rem;
        }

        .form-actions { display: flex; gap: 0.75rem; }

        .btn-confirm {
          padding: 0.5rem 1.25rem;
          background: var(--vigil-green);
          color: white;
          border: none;
          border-radius: 7px;
          font-size: 0.825rem;
          font-weight: 500;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: opacity 0.15s;
        }

        .btn-confirm:hover:not(:disabled) { opacity: 0.88; }
        .btn-confirm:disabled { opacity: 0.5; cursor: not-allowed; }

        .btn-cancel {
          padding: 0.5rem 1.25rem;
          border: 1px solid var(--vigil-border);
          border-radius: 7px;
          font-size: 0.825rem;
          background: white;
          color: var(--vigil-muted);
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.15s;
        }

        .btn-cancel:hover { border-color: #999; }

        .monitors-list { display: flex; flex-direction: column; gap: 0.75rem; }

        .monitor-card {
          background: white;
          border: 1px solid var(--vigil-border);
          border-radius: 12px;
          padding: 1.25rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: box-shadow 0.15s;
        }

        .monitor-card:hover { box-shadow: 0 2px 12px rgba(0,0,0,0.06); }

        .monitor-left { display: flex; align-items: center; gap: 1rem; }

        .monitor-indicator {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .monitor-indicator.up { background: var(--vigil-green-mid); box-shadow: 0 0 0 3px rgba(82,183,136,0.2); }
        .monitor-indicator.down { background: var(--vigil-red); box-shadow: 0 0 0 3px rgba(192,57,43,0.15); }
        .monitor-indicator.unknown { background: #D0D0C8; }

        .monitor-name {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--vigil-text);
          margin: 0 0 2px;
        }

        .monitor-url {
          font-size: 0.775rem;
          color: var(--vigil-muted);
          margin: 0;
          font-weight: 300;
        }

        .monitor-right {
          display: flex;
          align-items: center;
          gap: 2.5rem;
        }

        .monitor-stat { text-align: right; }

        .monitor-stat-val {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--vigil-text);
          display: block;
        }

        .monitor-stat-label {
          font-size: 0.72rem;
          color: var(--vigil-muted);
          font-weight: 300;
        }

        .uptime-good { color: var(--vigil-green) !important; }
        .uptime-bad { color: var(--vigil-red) !important; }

        .btn-delete {
          background: none;
          border: none;
          color: #C8C8C0;
          cursor: pointer;
          font-size: 0.8rem;
          padding: 0.25rem 0.5rem;
          border-radius: 5px;
          transition: color 0.15s, background 0.15s;
          font-family: 'DM Sans', sans-serif;
        }

        .btn-delete:hover { color: var(--vigil-red); background: var(--vigil-red-light); }

        .empty-state {
          text-align: center;
          padding: 4rem 1.5rem;
          border: 1px dashed var(--vigil-border);
          border-radius: 12px;
          background: white;
        }

        .empty-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: var(--vigil-green-light);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          font-size: 1.25rem;
        }

        .empty-state h3 {
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--vigil-text);
          margin: 0 0 0.4rem;
        }

        .empty-state p {
          font-size: 0.825rem;
          color: var(--vigil-muted);
          margin: 0;
          font-weight: 300;
        }

        .loading-text {
          font-size: 0.875rem;
          color: var(--vigil-muted);
          padding: 2rem 0;
        }
      `}</style>

      <div className="db-root">
        <nav className="db-nav">
          <Link href="/" className="db-logo">
            Vigil <span className="db-logo-dot" />
          </Link>
          <div className="db-nav-right">
            <button onClick={() => setShowForm(!showForm)} className="btn-add">
              + Add monitor
            </button>
            <button onClick={handleSignOut} className="btn-signout">
              Sign out
            </button>
          </div>
        </nav>

        <div className="db-body">
          {!loading && monitors.length > 0 && (
            <div className={`status-banner ${anyDown ? 'has-down' : allUp ? 'all-up' : 'neutral'}`}>
              <span className={`status-dot ${anyDown ? 'down' : allUp ? 'up' : 'neutral'}`} />
              {anyDown
                ? 'One or more monitors are currently down.'
                : allUp
                ? 'All monitors are operational.'
                : 'Monitors are being set up.'}
            </div>
          )}

          {showForm && (
            <div className="form-card">
              <h2>New monitor</h2>
              <div className="form-grid">
                <div className="form-field">
                  <label>Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="My Website"
                  />
                </div>
                <div className="form-field">
                  <label>URL</label>
                  <input
                    type="url"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    onKeyDown={e => e.key === 'Enter' && handleAdd()}
                  />
                </div>
              </div>
              {error && <p className="form-error">{error}</p>}
              <div className="form-actions">
                <button onClick={handleAdd} disabled={adding} className="btn-confirm">
                  {adding ? 'Adding…' : 'Add monitor'}
                </button>
                <button onClick={() => setShowForm(false)} className="btn-cancel">Cancel</button>
              </div>
            </div>
          )}

          <div className="section-header">
            <span className="section-title">Monitors</span>
            <span className="tier-badge">{monitors.length}/3 free</span>
          </div>

          {loading ? (
            <p className="loading-text">Loading…</p>
          ) : monitors.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">↗</div>
              <h3>No monitors yet</h3>
              <p>Add your first URL to start monitoring its uptime.</p>
            </div>
          ) : (
            <div className="monitors-list">
              {monitors.map(monitor => {
                const status = getStatus(monitor.checks)
                const uptime = getUptimePercent(monitor.checks)
                const avg = getAvgResponse(monitor.checks)
                return (
                  <div key={monitor.id} className="monitor-card">
                    <div className="monitor-left">
                      <span className={`monitor-indicator ${status === null ? 'unknown' : status ? 'up' : 'down'}`} />
                      <div>
                        <p className="monitor-name">{monitor.name || monitor.url}</p>
                        <p className="monitor-url">{monitor.url}</p>
                      </div>
                    </div>
                    <div className="monitor-right">
                      {uptime !== null && (
                        <div className="monitor-stat">
                          <span className={`monitor-stat-val ${parseFloat(uptime) >= 99 ? 'uptime-good' : parseFloat(uptime) < 90 ? 'uptime-bad' : ''}`}>
                            {uptime}%
                          </span>
                          <span className="monitor-stat-label">uptime</span>
                        </div>
                      )}
                      {avg !== null && (
                        <div className="monitor-stat">
                          <span className="monitor-stat-val">{avg}ms</span>
                          <span className="monitor-stat-label">avg response</span>
                        </div>
                      )}
                      <div className="monitor-stat">
                        <span className="monitor-stat-val">{getLastChecked(monitor.checks)}</span>
                        <span className="monitor-stat-label">last checked</span>
                      </div>
                      <button onClick={() => handleDelete(monitor.id)} className="btn-delete">
                        Delete
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}