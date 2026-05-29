'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit() {
    setLoading(true)
    setError('')
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else router.push('/dashboard')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else router.push('/dashboard')
    }
    setLoading(false)
  }

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
        }

        .login-root {
          min-height: 100vh;
          background: var(--vigil-cream);
          display: flex;
          font-family: 'DM Sans', sans-serif;
        }

        .login-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 3rem;
        }

        .login-card {
          width: 100%;
          max-width: 400px;
        }

        .login-logo {
          font-family: 'DM Serif Display', serif;
          font-size: 2rem;
          color: var(--vigil-text);
          margin-bottom: 2.5rem;
          display: flex;
          align-items: center;
          gap: 6px;
          letter-spacing: -0.02em;
          font-style: italic;
}

        .login-logo-dot {
          width: 8px;
          height: 8px;
          background: var(--vigil-green-mid);
          border-radius: 50%;
        }

        .login-heading {
          font-family: 'DM Serif Display', serif;
          font-size: 1.75rem;
          color: var(--vigil-text);
          margin: 0 0 0.4rem;
          line-height: 1.2;
        }

        .login-sub {
          font-size: 0.875rem;
          color: var(--vigil-muted);
          margin: 0 0 2rem;
          font-weight: 300;
        }

        .field { margin-bottom: 1rem; }

        .field label {
          display: block;
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--vigil-text);
          margin-bottom: 0.4rem;
          letter-spacing: 0.01em;
        }

        .field input {
          width: 100%;
          padding: 0.65rem 0.875rem;
          border: 1px solid var(--vigil-border);
          border-radius: 8px;
          font-size: 0.875rem;
          background: white;
          color: var(--vigil-text);
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.15s, box-shadow 0.15s;
          box-sizing: border-box;
          outline: none;
        }

        .field input:focus {
          border-color: var(--vigil-green-mid);
          box-shadow: 0 0 0 3px rgba(82,183,136,0.12);
        }

        .field input::placeholder { color: #B0B0A8; }

        .error-msg {
          font-size: 0.8rem;
          color: #C0392B;
          margin-bottom: 1rem;
          padding: 0.6rem 0.875rem;
          background: #FDF0EE;
          border-radius: 8px;
          border: 1px solid #F5C6C0;
        }

        .btn-submit {
          width: 100%;
          padding: 0.7rem;
          background: var(--vigil-green);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: opacity 0.15s, transform 0.15s;
          margin-top: 0.5rem;
        }

        .btn-submit:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
        .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

        .toggle-text {
          text-align: center;
          font-size: 0.825rem;
          color: var(--vigil-muted);
          margin-top: 1.5rem;
        }

        .toggle-btn {
          background: none;
          border: none;
          color: var(--vigil-green);
          font-size: 0.825rem;
          font-weight: 500;
          cursor: pointer;
          padding: 0;
          font-family: 'DM Sans', sans-serif;
        }

        .toggle-btn:hover { text-decoration: underline; }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.8rem;
          color: var(--vigil-muted);
          text-decoration: none;
          margin-top: 2rem;
          transition: color 0.15s;
        }

        .back-link:hover { color: var(--vigil-text); }

        .login-right {
          width: 420px;
          background: var(--vigil-green);
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 3rem;
          position: relative;
          overflow: hidden;
        }

        @media (max-width: 768px) { .login-right { display: none; } }

        .login-right::before {
          content: '';
          position: absolute;
          top: -100px;
          right: -100px;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
        }

        .login-right::after {
          content: '';
          position: absolute;
          bottom: -80px;
          left: -60px;
          width: 240px;
          height: 240px;
          border-radius: 50%;
          background: rgba(255,255,255,0.04);
        }

        .right-quote {
          font-family: 'DM Serif Display', serif;
          font-size: 1.6rem;
          color: rgba(255,255,255,0.92);
          line-height: 1.3;
          margin-bottom: 3rem;
          position: relative;
          z-index: 1;
        }

        .right-quote em { color: rgba(255,255,255,0.6); font-style: italic; }

        .stat-row {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          position: relative;
          z-index: 1;
        }

        .stat { display: flex; align-items: center; gap: 0.75rem; }

        .stat-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255,255,255,0.5);
          flex-shrink: 0;
        }

        .stat-dot.active { background: #95D5B2; }

        .stat-text {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.7);
          font-weight: 300;
        }
      `}</style>

      <div className="login-root">
        <div className="login-left">
          <div className="login-card">
            <div className="login-logo">
              Vigil <span className="login-logo-dot" />
            </div>

            <h1 className="login-heading">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="login-sub">
              {isSignUp ? 'Start monitoring your sites for free.' : 'Sign in to your dashboard.'}
            </p>

            <div className="field">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
            </div>

            <div className="field">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
            </div>

            {error && <p className="error-msg">{error}</p>}

            <button onClick={handleSubmit} disabled={loading} className="btn-submit">
              {loading ? 'Please wait…' : isSignUp ? 'Create account' : 'Sign in'}
            </button>

            <p className="toggle-text">
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              <button onClick={() => setIsSignUp(!isSignUp)} className="toggle-btn">
                {isSignUp ? 'Sign in' : 'Sign up free'}
              </button>
            </p>

            <Link href="/" className="back-link">← Back to home</Link>
          </div>
        </div>

        <div className="login-right">
          <p className="right-quote">
            Know the moment your site goes down.<br />
            <em>Before anyone else does.</em>
          </p>
          <div className="stat-row">
            <div className="stat">
              <span className="stat-dot active" />
              <span className="stat-text">Checks every 5 minutes, around the clock</span>
            </div>
            <div className="stat">
              <span className="stat-dot active" />
              <span className="stat-text">Instant email alerts on down & recovery</span>
            </div>
            <div className="stat">
              <span className="stat-dot active" />
              <span className="stat-text">Free to start, no credit card required</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) 
}