import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ping } from './ping'

describe('ping helper function', () => {
  const originalFetch = globalThis.fetch

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('should return is_up: true on 200 OK', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
    })

    const res = await ping('https://example.com')
    expect(res.is_up).toBe(true)
    expect(res.status).toBe(200)
    expect(res.response_time_ms).toBeTypeOf('number')
  })

  it('should return is_up: false on invalid/unreachable URL', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('TypeError: Failed to fetch'))

    const res = await ping('https://invalid-url.xyz')
    expect(res.is_up).toBe(false)
    expect(res.status).toBeNull()
    expect(res.response_time_ms).toBeTypeOf('number')
  })

  it('should return is_up: false on 500 Internal Server Error', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    })

    const res = await ping('https://example.com')
    expect(res.is_up).toBe(false)
    expect(res.status).toBe(500)
    expect(res.response_time_ms).toBeTypeOf('number')
  })

  it('should return is_up: false if fetch times out after 10 seconds', async () => {
    globalThis.fetch = vi.fn().mockImplementation(() => {
      return new Promise((_, reject) => {
        setTimeout(() => {
          reject(new DOMException('The user aborted a request.', 'AbortError'))
        }, 10000)
      })
    })

    const pingPromise = ping('https://example.com')
    
    // Fast-forward time by 10 seconds
    await vi.advanceTimersByTimeAsync(10000)
    
    const res = await pingPromise
    expect(res.is_up).toBe(false)
    expect(res.status).toBeNull()
    expect(res.response_time_ms).toBeGreaterThanOrEqual(10000)
  })
})
