import Link from 'next/link'

export default function HomePage() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="min-h-screen flex flex-col" suppressHydrationWarning>
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

        body { background: var(--vigil-cream); }

        .vigil-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 2.5rem;
          border-bottom: 1px solid var(--vigil-border);
          background: var(--vigil-cream);
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .vigil-logo {
          font-family: 'DM Serif Display', serif;
          font-size: 1.75rem;
          color: var(--vigil-text);
          letter-spacing: -0.02em;
          font-style: italic;
        }

        .vigil-logo span {
          display: inline-block;
          width: 8px;
          height: 8px;
          background: var(--vigil-green-mid);
          border-radius: 50%;
          margin-left: 3px;
          margin-bottom: 2px;
          vertical-align: middle;
        }

        .btn-primary {
          background: var(--vigil-green);
          color: #fff;
          padding: 0.5rem 1.25rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          text-decoration: none;
          transition: opacity 0.15s;
        }

        .btn-primary:hover { opacity: 0.88; }

        .btn-ghost {
          color: var(--vigil-muted);
          font-size: 0.875rem;
          text-decoration: none;
          transition: color 0.15s;
        }

        .btn-ghost:hover { color: var(--vigil-text); }

        .hero {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 6rem 1.5rem 4rem;
          background: 
            radial-gradient(ellipse 60% 40% at 50% -10%, rgba(82,183,136,0.12) 0%, transparent 70%),
            var(--vigil-cream);
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 0.3rem 0.85rem;
          border: 1px solid var(--vigil-border);
          border-radius: 100px;
          font-size: 0.75rem;
          color: var(--vigil-muted);
          margin-bottom: 2rem;
          background: white;
        }

        .pulse {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--vigil-green-mid);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.85); }
        }

        .hero h1 {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(2.5rem, 5vw, 4rem);
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: var(--vigil-text);
          max-width: 700px;
          margin: 0 0 1.25rem;
        }

        .hero h1 em {
          font-style: italic;
          color: var(--vigil-green);
        }

        .hero p {
          font-size: 1.05rem;
          color: var(--vigil-muted);
          max-width: 480px;
          line-height: 1.7;
          margin: 0 0 2.5rem;
          font-weight: 300;
        }

        .hero-cta {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .btn-hero {
          background: var(--vigil-green);
          color: #fff;
          padding: 0.75rem 1.75rem;
          border-radius: 10px;
          font-size: 0.95rem;
          font-weight: 500;
          text-decoration: none;
          transition: opacity 0.15s, transform 0.15s;
        }

        .btn-hero:hover { opacity: 0.88; transform: translateY(-1px); }

        .btn-outline {
          border: 1px solid var(--vigil-border);
          color: var(--vigil-text);
          padding: 0.75rem 1.75rem;
          border-radius: 10px;
          font-size: 0.95rem;
          text-decoration: none;
          background: white;
          transition: border-color 0.15s;
        }

        .btn-outline:hover { border-color: #999; }

        .features {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          max-width: 860px;
          width: 100%;
          margin: 5rem auto 0;
          background: var(--vigil-border);
          border: 1px solid var(--vigil-border);
          border-radius: 14px;
          overflow: hidden;
        }

        .feature {
          background: var(--vigil-cream);
          padding: 2rem 1.75rem;
          text-align: left;
        }

        .feature-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: var(--vigil-green-light);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
          color: var(--vigil-green);
          font-size: 1rem;
        }

        .feature h3 {
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--vigil-text);
          margin: 0 0 0.4rem;
        }

        .feature p {
          font-size: 0.85rem;
          color: var(--vigil-muted);
          line-height: 1.6;
          margin: 0;
          font-weight: 300;
        }

        .pricing-section {
          padding: 6rem 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .pricing-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--vigil-green);
          font-weight: 500;
          margin-bottom: 0.75rem;
        }

        .pricing-section h2 {
          font-family: 'DM Serif Display', serif;
          font-size: 2rem;
          color: var(--vigil-text);
          margin: 0 0 3rem;
        }

        .pricing-card {
          border: 1px solid var(--vigil-border);
          border-radius: 16px;
          padding: 2.5rem;
          max-width: 360px;
          width: 100%;
          background: white;
          text-align: left;
        }

        .price {
          display: flex;
          align-items: baseline;
          gap: 4px;
          margin-bottom: 0.25rem;
        }

        .price-num {
          font-family: 'DM Serif Display', serif;
          font-size: 3rem;
          color: var(--vigil-text);
          line-height: 1;
        }

        .price-desc {
          font-size: 0.8rem;
          color: var(--vigil-muted);
          margin-bottom: 1.75rem;
        }

        .pricing-divider {
          height: 1px;
          background: var(--vigil-border);
          margin: 1.5rem 0;
        }

        .pricing-features {
          list-style: none;
          padding: 0;
          margin: 0 0 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .pricing-features li {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.875rem;
          color: var(--vigil-text);
        }

        .check {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--vigil-green-light);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--vigil-green);
          font-size: 0.65rem;
          flex-shrink: 0;
        }

        .footer {
          border-top: 1px solid var(--vigil-border);
          padding: 1.5rem 2.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.8rem;
          color: var(--vigil-muted);
        }
      `}</style>

      <nav className="vigil-nav">
        <span className="vigil-logo">Vigil<span /></span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link href="/login" className="btn-ghost">Sign in</Link>
          <Link href="/login" className="btn-primary">Get started free</Link>
        </div>
      </nav>

      <main className="hero">
        <div className="badge">
          <span className="pulse" />
          Free to start — no credit card required
        </div>

        <h1>
          Know when your site goes down,<br />
          <em>before your users do</em>
        </h1>

        <p>
          Vigil watches your URLs every 5 minutes and sends an instant email alert the moment something goes down — and again when it recovers.
        </p>

        <div className="hero-cta">
          <Link href="/login" className="btn-hero">Start monitoring free</Link>
          <Link href="/login" className="btn-outline">Sign in</Link>
        </div>

        <div className="features">
          <div className="feature">
            <div className="feature-icon">⚡</div>
            <h3>5-minute checks</h3>
            <p>Your URLs are pinged every 5 minutes around the clock, every single day.</p>
          </div>
          <div className="feature">
            <div className="feature-icon">✉</div>
            <h3>Instant alerts</h3>
            <p>Get an email the moment something goes down, and again when it comes back up.</p>
          </div>
          <div className="feature">
            <div className="feature-icon">↗</div>
            <h3>Uptime dashboard</h3>
            <p>See uptime %, response times, and check history across all your monitors.</p>
          </div>
        </div>
      </main>

      <section className="pricing-section">
        <p className="pricing-label">Pricing</p>
        <h2>Simple and free to start</h2>
        <div className="pricing-card">
          <div className="price">
            <span className="price-num">$0</span>
          </div>
          <p className="price-desc">Free, forever. No credit card needed.</p>
          <div className="pricing-divider" />
          <ul className="pricing-features">
            <li><span className="check">✓</span> 3 monitors</li>
            <li><span className="check">✓</span> 5-minute check intervals</li>
            <li><span className="check">✓</span> Email alerts on down & recovery</li>
            <li><span className="check">✓</span> Uptime dashboard</li>
            <li><span className="check">✓</span> Incident history</li>
          </ul>
          <Link href="/login" className="btn-hero" style={{ display: 'block', textAlign: 'center' }}>
            Get started free
          </Link>
        </div>
      </section>

      <footer className="footer">
        <span style={{ fontFamily: "'DM Serif Display', serif" }}>Vigil</span>
        <span>© {new Date().getFullYear()} · Built in public</span>
      </footer>
    </div>
  )
}