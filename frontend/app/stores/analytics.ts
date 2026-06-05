import { defineStore } from 'pinia'
import type { AnalyticsSummary, TrendPoint } from '~/types/api'

interface AnalyticsState {
  summary: AnalyticsSummary | null
  trend: TrendPoint[]
  trendDays: number
  loadingSummary: boolean
  loadingTrend: boolean
  error: string | null
}

export const useAnalyticsStore = defineStore('analytics', {
  state: (): AnalyticsState => ({
    summary: null,
    trend: [],
    trendDays: 14,
    loadingSummary: false,
    loadingTrend: false,
    error: null,
  }),

  actions: {
    async fetchSummary(boardId?: string) {
      const api = useApi()
      this.loadingSummary = true
      this.error = null
      try {
        const query = boardId ? `?boardId=${encodeURIComponent(boardId)}` : ''
        this.summary = await api.get<AnalyticsSummary>(`/analytics/summary${query}`)
        return this.summary
      } catch (err: unknown) {
        this.error = (err as { message?: string })?.message ?? 'Failed to load summary'
        throw err
      } finally {
        this.loadingSummary = false
      }
    },

    async fetchTrend(days = 14, boardId?: string) {
      const api = useApi()
      this.loadingTrend = true
      try {
        const params = new URLSearchParams({ days: String(days) })
        if (boardId) params.set('boardId', boardId)
        this.trend = await api.get<TrendPoint[]>(`/analytics/trend?${params.toString()}`)
        this.trendDays = days
        return this.trend
      } finally {
        this.loadingTrend = false
      }
    },
  },
})
