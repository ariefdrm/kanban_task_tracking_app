<script setup lang="ts">
import { computed } from 'vue'
import { LogOut } from 'lucide-vue-next'
import { formatDate } from '~/utils/format'

definePageMeta({
  layout: false,
  middleware: 'auth',
})

useHead({ title: 'Profile — TaskFlow' })

const auth = useAuthStore()

const memberSince = computed(() => formatDate(auth.user?.createdAt))

async function onLogout() {
  await auth.logout()
}
</script>

<template>
  <NuxtLayout name="dashboard">
    <div class="space-y-8 max-w-3xl">
      <div class="border-b border-border dark:border-border-dark pb-5">
        <p class="eyebrow">Your corner</p>
        <h1 class="mt-2 font-display text-3xl sm:text-4xl font-normal leading-tight tracking-display-tight text-ink dark:text-ink-dark">
          {{ auth.user?.name || 'Account' }}
        </h1>
        <p class="mt-2 text-sm text-ink-muted">
          <span v-if="memberSince">Member since {{ memberSince }}.</span>
          <span v-else>Manage how you sign in and how your name appears.</span>
        </p>
      </div>

      <ProfileForm />
      <PasswordForm />

      <section class="rounded-card border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-6">
        <header>
          <p class="eyebrow">Sign out</p>
          <h2 class="mt-1 font-display text-xl text-ink dark:text-ink-dark tracking-display-tight">
            Close this session
          </h2>
          <p class="mt-1 text-sm text-ink-muted">
            You'll come back to a fresh sign-in screen. Your boards stay exactly where you left them.
          </p>
        </header>

        <div class="mt-5">
          <AppButton variant="secondary" size="sm" @click="onLogout">
            <LogOut class="h-4 w-4" />
            Sign out
          </AppButton>
        </div>
      </section>
    </div>
  </NuxtLayout>
</template>
