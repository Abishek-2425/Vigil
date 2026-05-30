import { vi, describe, it, expect, beforeEach } from 'vitest'
import { GET } from './route'
import { adminSupabase } from '@/lib/supabase/admin'
import { ping } from '@/lib/ping'
import { sendDownAlert, sendRecoveryAlert } from '@/lib/email'

// Mock Supabase admin client with self-contained thenable query builder
vi.mock('@/lib/supabase/admin', () => {
  const mockQueryBuilder = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    then: vi.fn().mockImplementation((resolve) => resolve({ data: null, error: null })),
  }

  const mockAdminSupabase = {
    from: vi.fn().mockReturnValue(mockQueryBuilder),
    auth: {
      admin: {
        getUserById: vi.fn(),
      },
    },
    mockQueryBuilder, // Expose for easy access in tests
  }

  return {
    adminSupabase: mockAdminSupabase,
  }
})

// Mock other modules
vi.mock('@/lib/ping', () => ({
  ping: vi.fn(),
}))

vi.mock('@/lib/email', () => ({
  sendDownAlert: vi.fn(),
  sendRecoveryAlert: vi.fn(),
}))

describe('Cron API Route', () => {
  const CRON_SECRET = 'test-cron-secret'
  const mockQB = (adminSupabase as any).mockQueryBuilder

  beforeEach(() => {
    vi.clearAllMocks()
    process.env.CRON_SECRET = CRON_SECRET
    // Reset query builder mock's default then implementation
    mockQB.then.mockImplementation((resolve: any) => resolve({ data: null, error: null }))
  })

  it('Returns 401 if Authorization header is missing', async () => {
    const request = new Request('http://localhost/api/cron', {
      method: 'GET',
    })

    const response = await GET(request)
    expect(response.status).toBe(401)
    expect(await response.text()).toBe('Unauthorized')
  })

  it('Returns 401 if Authorization header is wrong', async () => {
    const request = new Request('http://localhost/api/cron', {
      method: 'GET',
      headers: {
        authorization: 'Bearer wrong-secret',
      },
    })

    const response = await GET(request)
    expect(response.status).toBe(401)
    expect(await response.text()).toBe('Unauthorized')
  })

  it('Returns 200 with "No monitors" if no active monitors exist', async () => {
    const request = new Request('http://localhost/api/cron', {
      method: 'GET',
      headers: {
        authorization: `Bearer ${CRON_SECRET}`,
      },
    })

    // Monitors query: resolves to empty active monitors
    vi.mocked(mockQB.then).mockImplementationOnce((resolve: any) => resolve({ data: [], error: null }))

    const response = await GET(request)
    expect(response.status).toBe(200)
    expect(await response.text()).toBe('No monitors')
  })

  it('Returns 200 and logs checks when monitors exist', async () => {
    const request = new Request('http://localhost/api/cron', {
      method: 'GET',
      headers: {
        authorization: `Bearer ${CRON_SECRET}`,
      },
    })

    const mockMonitors = [{ id: 'mon-1', url: 'https://test.com', user_id: 'user-1', name: 'Test' }]
    const mockPingResult = { is_up: true, status: 200, response_time_ms: 150 }

    // 1. Monitors query: returns active monitors list
    vi.mocked(mockQB.then).mockImplementationOnce((resolve: any) => resolve({ data: mockMonitors, error: null }))
    // 2. Insert check logging
    vi.mocked(mockQB.then).mockImplementationOnce((resolve: any) => resolve({ error: null }))
    // 3. Get prevChecks: returns is_up: true for both previous checks (no transition)
    vi.mocked(mockQB.then).mockImplementationOnce((resolve: any) => resolve({ data: [{ is_up: true }, { is_up: true }], error: null }))

    // Mock ping utility
    vi.mocked(ping).mockResolvedValueOnce(mockPingResult)

    // Mock getUserById
    vi.mocked(adminSupabase.auth.admin.getUserById).mockResolvedValueOnce({ data: { user: { email: 'user@test.com' } } } as any)

    const response = await GET(request)
    expect(response.status).toBe(200)
    expect(await response.text()).toBe('OK')
  })

  it('Correctly detects up->down transition and creates incident', async () => {
    const request = new Request('http://localhost/api/cron', {
      method: 'GET',
      headers: {
        authorization: `Bearer ${CRON_SECRET}`,
      },
    })

    const mockMonitors = [{ id: 'mon-1', url: 'https://test.com', user_id: 'user-1', name: 'Test' }]
    const mockPingResult = { is_up: false, status: 500, response_time_ms: 220 }

    // 1. Monitors query: returns active monitors list
    vi.mocked(mockQB.then).mockImplementationOnce((resolve: any) => resolve({ data: mockMonitors, error: null }))
    // 2. Insert check logging
    vi.mocked(mockQB.then).mockImplementationOnce((resolve: any) => resolve({ error: null }))
    // 3. Get prevChecks: previous check (index 1) was UP (true), current (index 0) is DOWN (false)
    vi.mocked(mockQB.then).mockImplementationOnce((resolve: any) => resolve({
      data: [{ is_up: false }, { is_up: true }],
      error: null
    }))
    // 4. Insert incident log
    vi.mocked(mockQB.then).mockImplementationOnce((resolve: any) => resolve({ error: null }))

    // Mock ping utility returning DOWN status (500)
    vi.mocked(ping).mockResolvedValueOnce(mockPingResult)

    // Mock getUserById returning user email
    vi.mocked(adminSupabase.auth.admin.getUserById).mockResolvedValueOnce({ data: { user: { email: 'user@test.com' } } } as any)

    const response = await GET(request)
    expect(response.status).toBe(200)

    // Verify email was sent
    expect(sendDownAlert).toHaveBeenCalledWith('user@test.com', 'Test', 'https://test.com')
    expect(sendRecoveryAlert).not.toHaveBeenCalled()
  })

  it('Correctly detects down->up transition and resolves incident', async () => {
    const request = new Request('http://localhost/api/cron', {
      method: 'GET',
      headers: {
        authorization: `Bearer ${CRON_SECRET}`,
      },
    })

    const mockMonitors = [{ id: 'mon-1', url: 'https://test.com', user_id: 'user-1', name: 'Test' }]
    const mockPingResult = { is_up: true, status: 200, response_time_ms: 90 }

    // 1. Monitors query: returns active monitors list
    vi.mocked(mockQB.then).mockImplementationOnce((resolve: any) => resolve({ data: mockMonitors, error: null }))
    // 2. Insert check logging
    vi.mocked(mockQB.then).mockImplementationOnce((resolve: any) => resolve({ error: null }))
    // 3. Get prevChecks: previous check (index 1) was DOWN (false), current (index 0) is UP (true)
    vi.mocked(mockQB.then).mockImplementationOnce((resolve: any) => resolve({
      data: [{ is_up: true }, { is_up: false }],
      error: null
    }))
    // 4. Update incident query
    vi.mocked(mockQB.then).mockImplementationOnce((resolve: any) => resolve({ error: null }))

    // Mock ping utility returning UP status
    vi.mocked(ping).mockResolvedValueOnce(mockPingResult)

    // Mock getUserById returning user email
    vi.mocked(adminSupabase.auth.admin.getUserById).mockResolvedValueOnce({ data: { user: { email: 'user@test.com' } } } as any)

    const response = await GET(request)
    expect(response.status).toBe(200)

    // Verify recovery email was sent
    expect(sendRecoveryAlert).toHaveBeenCalledWith('user@test.com', 'Test', 'https://test.com')
    expect(sendDownAlert).not.toHaveBeenCalled()
  })
})
