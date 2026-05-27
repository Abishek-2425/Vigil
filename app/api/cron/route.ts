import { adminSupabase } from '@/lib/supabase/admin'
import { ping } from '@/lib/ping'

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { data: monitors, error } = await adminSupabase
    .from('monitors')
    .select('*')
    .eq('is_active', true)

  if (error) return new Response('DB error', { status: 500 })
  if (!monitors?.length) return new Response('No monitors', { status: 200 })

  for (const monitor of monitors) {
    const result = await ping(monitor.url)

    await adminSupabase.from('checks').insert({
      monitor_id: monitor.id,
      ...result,
    })

    console.log(`[${monitor.url}] → ${result.is_up ? 'UP' : 'DOWN'} (${result.response_time_ms}ms)`)
  }

  return new Response('OK', { status: 200 })
}