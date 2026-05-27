'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

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
  if (!checks.length) return 'No data'
  const up = checks.filter(c => c.is_up).length
  return ((up / checks.length) * 100).toFixed(1) + '%'
}

function getLastChecked(checks: Check[]) {
  if (!checks.length) return 'Never'
  const latest = checks.sort((a, b) =>
    new Date(b.checked_at).getTime() - new Date(a.checked_at).getTime()
  )[0]
  return new Date(latest.checked_at).toLocaleTimeString()
}

function getStatus(checks: Check[]) {
  if (!checks.length) return null
  const latest = checks.sort((a, b) =>
    new Date(b.checked_at).getTime() - new Date(a.checked_at).getTime()
  )[0]
  return latest.is_up
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
    setMonitors(data)
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
    if (data.error) {
      setError(data.error)
    } else {
      setUrl('')
      setName('')
      setShowForm(false)
      fetchMonitors()
    }
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

  useEffect(() => { fetchMonitors() }, [])

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Vigil</h1>
            <p className="text-muted-foreground text-sm">Your monitors</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90"
            >
              + Add Monitor
            </button>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 border rounded-lg text-sm hover:bg-muted"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Add Monitor Form */}
        {showForm && (
          <div className="border rounded-xl p-6 mb-6 space-y-4">
            <h2 className="font-semibold">New Monitor</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="My Website"
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium">URL</label>
                <input
                  type="url"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex gap-3">
              <button
                onClick={handleAdd}
                disabled={adding}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
              >
                {adding ? 'Adding...' : 'Add Monitor'}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border rounded-lg text-sm hover:bg-muted"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Monitors List */}
        {loading ? (
          <p className="text-muted-foreground text-sm">Loading...</p>
        ) : monitors.length === 0 ? (
          <div className="text-center py-16 border rounded-xl">
            <p className="text-muted-foreground">No monitors yet.</p>
            <p className="text-sm text-muted-foreground mt-1">Add your first URL to start monitoring.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {monitors.map(monitor => {
              const status = getStatus(monitor.checks)
              return (
                <div key={monitor.id} className="border rounded-xl p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${
                      status === null ? 'bg-gray-300' :
                      status ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <div>
                      <p className="font-medium">{monitor.name || monitor.url}</p>
                      <p className="text-sm text-muted-foreground">{monitor.url}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8 text-sm text-muted-foreground">
                    <div className="text-right">
                      <p className="font-medium text-foreground">{getUptimePercent(monitor.checks)}</p>
                      <p>uptime</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">{getLastChecked(monitor.checks)}</p>
                      <p>last checked</p>
                    </div>
                    <button
                      onClick={() => handleDelete(monitor.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-6">{monitors.length}/3 monitors used on free tier</p>
      </div>
    </div>
  )
}