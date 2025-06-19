import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'wix-blue': '#0075ff',
        'wix-green': '#00ff88',
        'calendar-accent': '#fbbf24', // amber-400
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'], // Modern font similar to Wix Pro
      },
      keyframes: {
        borderFlip: {
          '0%, 100%': { transform: 'translateY(0) rotateX(0deg)' },
          '50%': { transform: 'translateY(-10px) rotateX(180deg)' },
        },
        growCircle: {
          '0%': { transform: 'scale(0)' },
          '100%': { transform: 'scale(1)' },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      },
      animation: {
        borderFlip: 'borderFlip 5s ease-in-out infinite',
        growCircle: 'growCircle 2s ease-in-out forwards',
        spin: 'spin 15s linear infinite',
        'parallax-spin': 'spin 20s linear infinite',
      },
      transitionTimingFunction: {
        'wix': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      zIndex: {
        '60': '60',
      }

    },


  },
  plugins: [],
  safelist: [
    'fc',
    'fc-theme-standard',
    'fc-toolbar',
    'fc-button',
    'fc-daygrid-day',
    'fc-day-other',
    'fc-day-today',
    'fc-event',
    'fc-event-main',
    'fc-event-time',
    'fc-event-title',
    // add any extra you see in your DOM
  ],
} satisfies Config;
