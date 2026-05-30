import { describe, it, expect } from 'vitest'
import {
  getUptimePercent,
  getLastChecked,
  getStatus,
  getAvgResponse,
} from './page'

describe('Dashboard Helpers', () => {
  const checkUp1 = { is_up: true, checked_at: '2026-05-29T10:00:00.000Z', response_time_ms: 100 }
  const checkUp2 = { is_up: true, checked_at: '2026-05-29T11:00:00.000Z', response_time_ms: 200 }
  const checkDown1 = { is_up: false, checked_at: '2026-05-29T12:00:00.000Z', response_time_ms: 500 }
  const checkUpLatest = { is_up: true, checked_at: '2026-05-29T13:00:00.000Z', response_time_ms: 150 }

  describe('getUptimePercent', () => {
    it('should return null for empty array', () => {
      expect(getUptimePercent([])).toBeNull()
    })

    it('should return 100.0 when all checks are up', () => {
      expect(getUptimePercent([checkUp1, checkUp2])).toBe('100.0')
    })

    it('should return 0.0 when all checks are down', () => {
      expect(getUptimePercent([checkDown1])).toBe('0.0')
    })

    it('should return accurate mixed percentage', () => {
      expect(getUptimePercent([checkUp1, checkUp2, checkDown1])).toBe('66.7')
    })
  })

  describe('getLastChecked', () => {
    it('should return "Never" for empty array', () => {
      expect(getLastChecked([])).toBe('Never')
    })

    it('should return correct time for single check', () => {
      const check = { is_up: true, checked_at: '2026-05-29T10:30:00.000Z', response_time_ms: 100 }
      const expectedTime = new Date(check.checked_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      expect(getLastChecked([check])).toBe(expectedTime)
    })

    it('should return correct time of latest check in sorting order', () => {
      const checks = [checkUp1, checkDown1, checkUp2]
      // checkDown1 is the latest among these three (12:00:00 vs 10:00:00 and 11:00:00)
      const expectedTime = new Date(checkDown1.checked_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      expect(getLastChecked(checks)).toBe(expectedTime)
    })
  })

  describe('getStatus', () => {
    it('should return null for empty array', () => {
      expect(getStatus([])).toBeNull()
    })

    it('should return true if the latest check is up', () => {
      // Latest is checkUpLatest (13:00)
      expect(getStatus([checkUp1, checkUpLatest, checkDown1])).toBe(true)
    })

    it('should return false if the latest check is down', () => {
      // Latest is checkDown1 (12:00)
      expect(getStatus([checkUp1, checkUp2, checkDown1])).toBe(false)
    })
  })

  describe('getAvgResponse', () => {
    it('should return null for empty array', () => {
      expect(getAvgResponse([])).toBeNull()
    })

    it('should calculate correct average response time of UP checks only', () => {
      // should average checkUp1 (100) and checkUp2 (200), ignoring checkDown1 (500) since is_up is false
      expect(getAvgResponse([checkUp1, checkUp2, checkDown1])).toBe(150)
    })

    it('should return null if there are no UP checks', () => {
      expect(getAvgResponse([checkDown1])).toBeNull()
    })
  })
})
