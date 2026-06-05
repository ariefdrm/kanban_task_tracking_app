<template>
  <section class="relative overflow-hidden">
    <div class="mx-auto max-w-6xl px-6 pt-20 pb-24 sm:pt-28 sm:pb-32">
      <div class="grid lg:grid-cols-[1.05fr_1fr] gap-12 items-center">
        <div>
          <span class="inline-flex items-center gap-2 rounded-full bg-accent-soft dark:bg-accent-softDark text-accent px-3 py-1 text-xs font-medium">
            <span class="h-1.5 w-1.5 rounded-full bg-accent" />
            Personal productivity, redesigned
          </span>

          <h1 class="mt-6 text-4xl sm:text-5xl font-semibold tracking-tight text-ink dark:text-ink-dark leading-[1.1]">
            Manage your tasks visually and stay productive.
          </h1>

          <p class="mt-5 text-base sm:text-lg text-ink-muted max-w-xl leading-relaxed">
            TaskFlow is a calm, focused Kanban workflow for the work that only you can do — your studies, your research, your side projects.
          </p>

          <div class="mt-8 flex flex-wrap items-center gap-3">
            <NuxtLink to="/register">
              <AppButton variant="primary" size="lg">Get started — it's free</AppButton>
            </NuxtLink>
            <NuxtLink to="/login">
              <AppButton variant="ghost" size="lg">I already have an account</AppButton>
            </NuxtLink>
          </div>

          <p class="mt-5 text-xs text-ink-muted">
            No team setup. No notifications. Just you and your work.
          </p>
        </div>

        <!-- Decorative kanban preview -->
        <div class="relative hidden lg:block" aria-hidden="true">
          <div class="absolute -inset-8 rounded-3xl bg-gradient-to-tr from-accent-soft via-transparent to-warning-soft opacity-60 dark:from-accent-softDark dark:to-warning-softDark dark:opacity-40 blur-2xl" />

          <div class="relative grid grid-cols-3 gap-3 p-3 rounded-modal bg-surface dark:bg-surface-dark border border-border dark:border-border-dark shadow-card">
            <HomeColumnPreview title="Todo" :tasks="['Outline thesis chapter', 'Read 3 papers', 'Sketch logo concept']" tone="neutral" />
            <HomeColumnPreview title="Doing" :tasks="['Draft section 2', 'Wireframe dashboard']" tone="warning" />
            <HomeColumnPreview title="Done" :tasks="['Setup repo', 'Pick MVP scope']" tone="success" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
