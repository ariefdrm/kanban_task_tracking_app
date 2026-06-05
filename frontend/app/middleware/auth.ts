export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()
  auth.loadFromStorage()

  if (!auth.isAuthenticated) {
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }

  if (!auth.user && import.meta.client) {
    try {
      await auth.fetchMe()
    } catch {
      return navigateTo('/login')
    }
  }
})
