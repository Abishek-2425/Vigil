import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b">
        <span className="font-bold text-lg">Vigil</span>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">
            Sign in
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90"
          >
            Get started free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs text-muted-foreground mb-6">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Free to start — no credit card required
        </div>

        <h1 className="text-5xl font-bold tracking-tight max-w-2xl leading-tight">
          Know when your site goes down
          <span className="text-muted-foreground"> before your users do</span>
        </h1>

        <p className="mt-6 text-lg text-muted-foreground max-w-xl">
          Vigil monitors your URLs every 5 minutes and sends you an instant email alert when something goes down — and when it comes back up.
        </p>

        <div className="flex items-center gap-4 mt-10">
          <Link
            href="/login"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90"
          >
            Start monitoring free
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 border rounded-lg font-medium hover:bg-muted text-sm"
          >
            Sign in
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-6 mt-24 max-w-3xl w-full text-left">
          <div className="border rounded-xl p-6">
            <div className="text-2xl mb-3">⚡</div>
            <h3 className="font-semibold mb-1">5-minute checks</h3>
            <p className="text-sm text-muted-foreground">Your URLs are pinged every 5 minutes around the clock, every day.</p>
          </div>
          <div className="border rounded-xl p-6">
            <div className="text-2xl mb-3">📧</div>
            <h3 className="font-semibold mb-1">Instant alerts</h3>
            <p className="text-sm text-muted-foreground">Get an email the moment something goes down and when it recovers.</p>
          </div>
          <div className="border rounded-xl p-6">
            <div className="text-2xl mb-3">📊</div>
            <h3 className="font-semibold mb-1">Uptime dashboard</h3>
            <p className="text-sm text-muted-foreground">See uptime percentage, response times, and check history at a glance.</p>
          </div>
        </div>

        {/* Pricing */}
        <div className="mt-24 max-w-sm w-full">
          <div className="border rounded-xl p-8 text-left">
            <p className="text-sm font-medium text-muted-foreground mb-1">Free tier</p>
            <p className="text-4xl font-bold">$0</p>
            <p className="text-sm text-muted-foreground mt-1">forever</p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> 3 monitors
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> 5-minute check intervals
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Email alerts
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Uptime dashboard
              </li>
            </ul>
            <Link
              href="/login"
              className="mt-8 block text-center px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90"
            >
              Get started free
            </Link>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t px-8 py-5 text-center text-sm text-muted-foreground">
        Built by you · Vigil {new Date().getFullYear()}
      </footer>

    </div>
  )
}