/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#0B0D13',
          subtle: '#10141D',
          card: '#151923',
          elevated: '#1B212E',
          border: '#232A3B',
          'border-light': 'rgba(255, 255, 255, 0.12)',
        },
        primary: {
          DEFAULT: '#0EA5E9',
          hover: '#0284C7',
          subtle: 'rgba(14, 165, 233, 0.08)',
          glow: 'rgba(14, 165, 233, 0.2)',
        },
        cyan: {
          DEFAULT: '#06B6D4',
          light: '#67E8F9',
          glow: 'rgba(6, 182, 212, 0.18)',
          deep: '#083344',
        },
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#F43F5E',
          info: '#3B82F6',
        },
        titanium: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'cyan-sm': '0 0 12px rgba(6, 182, 212, 0.18)',
        'cyan-md': '0 0 24px rgba(6, 182, 212, 0.22)',
        'primary-glow': '0 0 20px rgba(14, 165, 233, 0.25)',
        'danger-glow': '0 0 20px rgba(244, 63, 94, 0.25)',
        'titanium': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(35, 42, 59, 0.8)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.3), 0 12px 28px -6px rgba(0, 0, 0, 0.45)',
        'card-hover': '0 8px 30px -4px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(6, 182, 212, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radar 4s linear infinite',
        'sonar-ping': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        radar: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}