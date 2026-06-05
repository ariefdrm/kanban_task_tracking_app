/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './app/**/*.{vue,js,ts}',
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#F9F9F7',
          dark: '#121212',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#1E1E1E',
        },
        ink: {
          DEFAULT: '#1A1A1A',
          dark: '#E4E4E7',
          muted: '#8E8E93',
        },
        border: {
          DEFAULT: '#E5E5E2',
          dark: '#2A2A2A',
        },
        accent: {
          DEFAULT: '#6366F1',
          soft: '#EEF0FF',
          softDark: '#22243A',
        },
        success: {
          DEFAULT: '#4CAF50',
          soft: '#E8F5E9',
          softDark: '#1B2A1C',
        },
        warning: {
          DEFAULT: '#F4B942',
          soft: '#FEF6E1',
          softDark: '#2E2516',
        },
        danger: {
          DEFAULT: '#E57373',
          soft: '#FBECEC',
          softDark: '#2E1B1B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        button: '8px',
        input: '8px',
        card: '12px',
        modal: '16px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0, 0, 0, 0.08)',
        'card-dark': '0 1px 3px rgba(0, 0, 0, 0.25)',
        focus: '0 0 0 3px rgba(99, 102, 241, 0.25)',
      },
      transitionDuration: {
        DEFAULT: '180ms',
      },
    },
  },
  plugins: [],
}
