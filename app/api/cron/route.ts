import { adminSupabase } from '@/lib/supabase/admin'
import { ping } from '@/lib/ping'
import { sendDownAlert, sendRecoveryAlert } from '@/lib/email'

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

  const emailCache = new Map<string, string>()

  const checkPromises = monitors.map(async (monitor) => {
    try {
      const result = await ping(monitor.url)

      // Log the check
      await adminSupabase.from('checks').insert({
        monitor_id: monitor.id,
        ...result,
      })

      // Get previous check
      const { data: prevChecks } = await adminSupabase
        .from('checks')
        .select('is_up')
        .eq('monitor_id', monitor.id)
        .order('checked_at', { ascending: false })
        .limit(2)

      const previousCheck = prevChecks?.[1]

      // Get user email (optimized with caching)
      let userEmail = emailCache.get(monitor.user_id)
      if (userEmail === undefined) {
        const { data: userData } = await adminSupabase.auth.admin.getUserById(monitor.user_id)
        userEmail = userData?.user?.email || ''
        emailCache.set(monitor.user_id, userEmail)
      }

      if (!userEmail) return

      // Was up, now down → create incident + send alert
      if (previousCheck?.is_up === true && result.is_up === false) {
        await adminSupabase.from('incidents').insert({
          monitor_id: monitor.id,
        })
        await sendDownAlert(userEmail, monitor.name || monitor.url, monitor.url)
      }

      // Was down, now up → resolve incident + send recovery
      if (previousCheck?.is_up === false && result.is_up === true) {
        await adminSupabase
          .from('incidents')
          .update({ is_resolved: true, resolved_at: new Date().toISOString() })
          .eq('monitor_id', monitor.id)
          .eq('is_resolved', false)
        await sendRecoveryAlert(userEmail, monitor.name || monitor.url, monitor.url)
      }
    } catch (monitorError) {
      console.error(`Error processing monitor ${monitor.id}:`, monitorError)
    }
  })

  await Promise.allSettled(checkPromises)

  return new Response('OK', { status: 200 })
}