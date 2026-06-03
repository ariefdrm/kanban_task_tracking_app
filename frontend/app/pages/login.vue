<script setup lang="ts">
definePageMeta({ middleware: 'guest' })

const authStore = useAuthStore()
const config = useRuntimeConfig()
const { $socket } = useNuxtApp()

const form = reactive({ email: '', password: '', name: '' })
const loading = ref(false)
const error = ref('')
const showPass = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    const res = await fetch(`${config.public.apiBase}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Login failed')
    authStore.setAuth(data)
    ;($socket as any).connect()
    navigateTo('/dashboard')
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen grid grid-cols-1 md:grid-cols-2">

    <!-- LEFT PANEL -->
    <div class="hidden md:flex flex-col justify-between bg-ink p-12 relative overflow-hidden">
      <NuxtLink to="/" class="font-display text-2xl text-white">Taskademia</NuxtLink>

      <div>
        <p class="font-display text-3xl text-white/90 leading-snug italic mb-3">
          "The secret of getting ahead is getting started."
        </p>
        <span class="text-white/40 text-sm">— Mark Twain</span>
      </div>

      <!-- Decorative circles -->
      <div class="absolute -bottom-20 -right-20 w-72 h-72 rounded-full border-[60px] border-accent/20"></div>
      <div class="absolute top-24 -right-10 w-32 h-32 rounded-full border-[30px] border-white/5"></div>
    </div>

    <!-- RIGHT PANEL -->
    <div class="flex items-center justify-center p-8 bg-canvas">
      <div class="w-full max-w-sm">

        <!-- Mobile logo -->
        <NuxtLink to="/" class="font-display text-2xl text-ink block mb-10 md:hidden">Taskademia</NuxtLink>

        <div class="mb-8">
          <h2 class="font-display text-3xl text-ink mb-1">Welcome back</h2>
          <p class="text-ink-secondary text-sm">Sign in to your academic dashboard</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4" novalidate>
          <div>
            <label class="form-label">Email address</label>
            <input v-model="form.email" type="email" class="form-input" placeholder="you@university.edu" autocomplete="email" />
          </div>
          <div>
            <label class="form-label">Password</label>
            <div class="relative">
              <input v-model="form.password" :type="showPass ? 'text' : 'password'"
                class="form-input pr-10" placeholder="••••••••" autocomplete="current-password" />
              <button type="button" @click="showPass = !showPass"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink transition-colors text-sm">
                {{ showPass ? '🙈' : '👁' }}
              </button>
            </div>
          </div>

          <div v-if="error" class="form-error">{{ error }}</div>

          <button type="submit" class="btn-primary w-full justify-center py-3 rounded-xl mt-2" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            {{ loading ? 'Signing in…' : 'Sign in' }}
          </button>
        </form>

        <p class="text-center mt-6 text-sm text-ink-secondary">
          Don't have an account?
          <NuxtLink to="/register" class="text-accent font-medium hover:text-accent-light transition-colors ml-1">Create one</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

