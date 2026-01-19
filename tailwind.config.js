/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          light: '#ffffff',
          dark: '#111827',
          DEFAULT: '#ffffff',
        },
        foreground: {
          light: '#111827',
          dark: '#f9fafb',
          DEFAULT: '#111827',
        },
        border: {
          light: '#e5e7eb',
          dark: '#374151',
          DEFAULT: '#e5e7eb',
        },
        input: {
          light: '#f3f4f6',
          dark: '#1f2937',
          DEFAULT: '#f3f4f6',
        },
        primary: {
          DEFAULT: '#3b82f6',
          foreground: '#ffffff',
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
