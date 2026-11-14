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
          DEFAULT: '#0B0F14',
          subtle: '#111821',
          card: '#161F29',
          elevated: '#1C2733',
          border: '#2A3745',
        },
        cyan: {
          DEFAULT: '#35D6E7',
          light: '#8CEBF3',
          glow: 'rgba(53, 214, 231, 0.25)',
          deep: '#156b75',
        },
        status: {
          success: '#36C98F',
          warning: '#F4B942',
          danger: '#FF5C68',
        },
        titanium: {
          100: '#F1F5F9',
          200: '#CBD5E1',
          400: '#98A7B7',
          700: '#334155',
          800: '#1E293B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'cyan-sm': '0 0 10px rgba(53, 214, 231, 0.2)',
        'cyan-md': '0 0 20px rgba(53, 214, 231, 0.3)',
        'danger-glow': '0 0 25px rgba(255, 92, 104, 0.4)',
        'titanium': '0 4px 20px -2px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(42, 55, 69, 0.8)',
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
