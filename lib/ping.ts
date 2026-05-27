export async function ping(url: string) {
  const start = Date.now()
  try {
    const res = await fetch(url, {
      method: 'GET',
      signal: AbortSignal.timeout(10000),
    })
    const response_time_ms = Date.now() - start
    return {
      is_up: res.ok,
      status: res.status,
      response_time_ms,
    }
  } catch {
    return {
      is_up: false,
      status: null,
      response_time_ms: Date.now() - start,
    }
  }
}