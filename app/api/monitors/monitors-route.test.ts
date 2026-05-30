import { vi, describe, it, expect, beforeEach } from 'vitest'
import { GET, POST, DELETE } from './route'
import { createClient } from '@/lib/supabase/server'

// Mock createClient from server
vi.mock('@/lib/supabase/server', () => {
  return {
    createClient: vi.fn(),
  }
})

describe('Monitors API Route', () => {
  let mockUser: any
  let mockQueryBuilder: any

  beforeEach(() => {
    vi.clearAllMocks()
    mockUser = null

    // Setup query builder thenable mock structure
    mockQueryBuilder = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      then: vi.fn().mockImplementation((resolve) => resolve({ data: null, error: null, count: null })),
    }

    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockImplementation(async () => ({ data: { user: mockUser } })),
      },
      from: vi.fn().mockReturnValue(mockQueryBuilder),
    }

    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)
  })

  describe('GET', () => {
    it('returns 401 if no auth', async () => {
      mockUser = null

      const response = await GET()
      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data.error).toBe('Unauthorized')
    })

    it('returns 200 and active monitors list on success', async () => {
      mockUser = { id: 'user-123' }
      const mockMonitors = [
        { id: 'mon-1', name: 'My Website', url: 'https://example.com' }
      ]
      mockQueryBuilder.then.mockImplementation((resolve) => resolve({ data: mockMonitors, error: null }))

      const response = await GET()
      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data).toEqual(mockMonitors)
    })
  })

  describe('POST', () => {
    it('returns 401 if no auth', async () => {
      mockUser = null
      const request = new Request('http://localhost/api/monitors', {
        method: 'POST',
        body: JSON.stringify({ url: 'https://example.com' }),
      })

      const response = await POST(request)
      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data.error).toBe('Unauthorized')
    })

    it('returns 400 if URL is missing', async () => {
      mockUser = { id: 'user-123' }
      const request = new Request('http://localhost/api/monitors', {
        method: 'POST',
        body: JSON.stringify({ name: 'My Web' }),
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toBe('URL is required')
    })

    it('returns 403 if user already has 3 monitors', async () => {
      mockUser = { id: 'user-123' }
      mockQueryBuilder.then.mockImplementation((resolve) => resolve({ count: 3, error: null }))

      const request = new Request('http://localhost/api/monitors', {
        method: 'POST',
        body: JSON.stringify({ url: 'https://example.com', name: 'My Web' }),
      })

      const response = await POST(request)
      expect(response.status).toBe(403)
      const data = await response.json()
      expect(data.error).toBe('Free tier limit reached (3 monitors)')
    })

    it('returns the new monitor on success', async () => {
      mockUser = { id: 'user-123' }
      // Mock the count query to return 1 (less than 3)
      mockQueryBuilder.then.mockImplementationOnce((resolve) => resolve({ count: 1, error: null }))
      
      const newMonitor = { id: 'mon-new', url: 'https://example.com', name: 'New' }
      // Mock the insert single query
      mockQueryBuilder.then.mockImplementationOnce((resolve) => resolve({ data: newMonitor, error: null }))

      const request = new Request('http://localhost/api/monitors', {
        method: 'POST',
        body: JSON.stringify({ url: 'https://example.com', name: 'New' }),
      })

      const response = await POST(request)
      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data).toEqual(newMonitor)
    })
  })

  describe('DELETE', () => {
    it('returns 401 if no auth', async () => {
      mockUser = null
      const request = new Request('http://localhost/api/monitors', {
        method: 'DELETE',
        body: JSON.stringify({ id: 'mon-1' }),
      })

      const response = await DELETE(request)
      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data.error).toBe('Unauthorized')
    })

    it('returns success on valid delete', async () => {
      mockUser = { id: 'user-123' }
      mockQueryBuilder.then.mockImplementation((resolve) => resolve({ error: null }))

      const request = new Request('http://localhost/api/monitors', {
        method: 'DELETE',
        body: JSON.stringify({ id: 'mon-1' }),
      })

      const response = await DELETE(request)
      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
    })
  })
})
