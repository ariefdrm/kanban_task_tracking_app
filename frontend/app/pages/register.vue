<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: 'guest',
})

useHead({ title: 'Create account — TaskFlow' })

function onSuccess() {
  navigateTo('/dashboard')
}
</script>

<template>
  <AuthCard
    title="Create your account"
    description="Start tracking your tasks in a calm, focused workspace."
    quote="The way to get started is to quit talking and begin doing."
    quote-author="Walt Disney"
  >
    <RegisterForm @success="onSuccess" />

    <template #footer>
      Already have an account?
      <NuxtLink to="/login" class="text-accent font-medium hover:underline ml-1">
        Sign in
      </NuxtLink>
    </template>
  </AuthCard>
</template>
