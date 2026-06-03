
import { defineStore } from 'pinia'

interface User { id: string; name: string; email: string }

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    accessToken: null as string | null,
    refreshToken: null as string | null,
  }),
  getters: {
    isAuthenticated: (s) => !!s.accessToken && !!s.user,
  },
  actions: {
    setAuth(data: { user: User; accessToken: string; refreshToken: string }) {
      this.user = data.user
      this.accessToken = data.accessToken
      this.refreshToken = data.refreshToken
      if (import.meta.client) {
        localStorage.setItem('refreshToken', data.refreshToken)
        localStorage.setItem('accessToken', data.accessToken)
        localStorage.setItem('user', JSON.stringify(data.user))
      }
    },
    loadFromStorage() {
      if (!import.meta.client) return
      this.accessToken = localStorage.getItem('accessToken')
      this.refreshToken = localStorage.getItem('refreshToken')
      const u = localStorage.getItem('user')
      this.user = u ? JSON.parse(u) : null
    },
    async refresh() {
      if (!this.refreshToken) { this.logout(); return }
      const config = useRuntimeConfig()
      const res = await fetch(`${config.public.apiBase}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      })
      if (!res.ok) { this.logout(); return }
      const data = await res.json()
      this.accessToken = data.accessToken
      this.refreshToken = data.refreshToken
      if (process.client) {
        localStorage.setItem('accessToken', data.accessToken)
        localStorage.setItem('refreshToken', data.refreshToken)
      }
    },
    async logout() {
      const config = useRuntimeConfig()
      if (this.refreshToken) {
        await fetch(`${config.public.apiBase}/auth/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: this.refreshToken }),
        }).catch(() => { })
      }
      this.user = null
      this.accessToken = null
      this.refreshToken = null
      if (process.client) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
      }
      navigateTo('/login')
    },
  },
})
