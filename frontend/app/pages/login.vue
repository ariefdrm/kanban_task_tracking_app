<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: 'guest',
})

useHead({ title: 'Sign in — TaskFlow' })

const route = useRoute()

function onSuccess() {
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/dashboard'
  navigateTo(redirect)
}
</script>

<template>
  <AuthCard
    title="Welcome back"
    description="Sign in to keep momentum on your work."
  >
    <LoginForm @success="onSuccess" />

    <template #footer>
      Don't have an account?
      <NuxtLink to="/register" class="text-accent font-medium hover:underline ml-1">
        Create one
      </NuxtLink>
    </template>
  </AuthCard>
</template>
