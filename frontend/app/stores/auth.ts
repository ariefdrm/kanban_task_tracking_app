import { defineStore } from 'pinia'
import type { User } from '~/types/api'

interface AuthState {
  user: User | null
  ready: boolean
  initInflight: Promise<void> | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    ready: false,
    initInflight: null,
  }),

  getters: {
    isAuthenticated: (s) => !!s.user,
  },

  actions: {
    async init(force = false) {
      if (!import.meta.client) return
      if (this.ready && !force) return
      if (this.initInflight) return this.initInflight

      clearLegacyStorage()

      this.initInflight = (async () => {
        const api = useApi()
        try {
          const user = await api.get<User>('/users/me')
          this.user = user
        } catch {
          this.user = null
        } finally {
          this.ready = true
          this.initInflight = null
        }
      })()

      return this.initInflight
    },

    async login(email: string, password: string) {
      const api = useApi()
      await api.post('/auth/login', { email, password })
      await this.fetchMe()
    },

    async register(name: string, email: string, password: string) {
      const api = useApi()
      await api.post('/auth/register', { name, email, password })
      await this.fetchMe()
    },

    async fetchMe() {
      const api = useApi()
      try {
        const user = await api.get<User>('/users/me')
        this.user = user
        this.ready = true
        return user
      } catch (err) {
        this.user = null
        this.ready = true
        throw err
      }
    },

    async logout() {
      const api = useApi()
      try {
        await api.post('/auth/logout')
      } catch {
        // ignore — clear session locally regardless
      }
      this.clearSession()
      await navigateTo('/login')
    },

    clearSession() {
      this.user = null
      this.ready = true
      clearLegacyStorage()
    },
  },
})

function clearLegacyStorage() {
  if (!import.meta.client) return
  try {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  } catch {
    // localStorage may be unavailable in some environments — ignore
  }
}
