import { defineNuxtConfig } from "nuxt/config";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@nuxt/eslint',
    '@morev/vue-transitions',
    '@pinia/nuxt',
  ],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'TaskFlow — Visual task tracking',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Personal task tracking with a clean, focused Kanban workflow.' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
      ],
      htmlAttrs: { lang: 'en' },
      script: [
        {
          innerHTML: `(()=>{try{const t=localStorage.getItem('tf:theme');const d=t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d)}catch(e){}})();`,
          tagPosition: 'head',
        },
      ],
    },
  },

  runtimeConfig: {
    // Server-side only — overridden by NUXT_API_BASE env var (used by useApi on SSR).
    // In Docker: points directly to backend service (no nginx hop).
    apiBase: 'http://localhost:8000',
    public: {
      // Browser — overridden by NUXT_PUBLIC_API_BASE env var.
      // In Docker: /api (nginx strips prefix and proxies to backend).
      apiBase: 'http://localhost:8000',
    },
  },
})
