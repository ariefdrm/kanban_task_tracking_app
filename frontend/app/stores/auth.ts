import { defineStore } from 'pinia'
import type { User, AuthTokens } from '~/types/api'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  ready: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    ready: false,
  }),

  getters: {
    isAuthenticated: (s) => !!s.user || !!s.accessToken,
  },

  actions: {
    persistTokens(tokens: AuthTokens) {
      this.accessToken = tokens.accessToken
      this.refreshToken = tokens.refreshToken
      if (import.meta.client) {
        localStorage.setItem('accessToken', tokens.accessToken)
        localStorage.setItem('refreshToken', tokens.refreshToken)
      }
    },

    persistUser(user: User | null) {
      this.user = user
      if (import.meta.client) {
        if (user) localStorage.setItem('user', JSON.stringify(user))
        else localStorage.removeItem('user')
      }
    },

    loadFromStorage() {
      if (this.ready || !import.meta.client) return
      this.accessToken = localStorage.getItem('accessToken')
      this.refreshToken = localStorage.getItem('refreshToken')
      const raw = localStorage.getItem('user')
      this.user = raw ? (JSON.parse(raw) as User) : null
      this.ready = true
    },

    async login(email: string, password: string) {
      const api = useApi()
      const res = await api.post<{ data: AuthTokens }>('/auth/login', { email, password })
      this.persistTokens(res.data)
      await this.fetchMe()
    },

    async register(name: string, email: string, password: string) {
      const api = useApi()
      const res = await api.post<{
        data: { user: { id: string; name: string | null; email: string; tokens: AuthTokens } }
      }>('/auth/register', { name, email, password })
      const { tokens, ...user } = res.data.user
      this.persistTokens(tokens)
      this.persistUser(user)
    },

    async fetchMe() {
      const api = useApi()
      try {
        const user = await api.get<User>('/users/me')
        this.persistUser(user)
        return user
      } catch (err) {
        this.persistUser(null)
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
      await this.clearSession()
      await navigateTo('/login')
    },

    async clearSession() {
      this.user = null
      this.accessToken = null
      this.refreshToken = null
      if (import.meta.client) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
      }
    },
  },
})
