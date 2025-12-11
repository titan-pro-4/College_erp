/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0B5FFF',
        accent: {
          success: '#0BDF8A',
          warning: '#FFB74D',
        },
        neutral: {
          50: '#F6F8FA',
          100: '#FFFFFF',
          900: '#1F2937',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'card': '12px',
      },
      scale: {
        '98': '0.98',
      },
      transitionDuration: {
        '120': '120ms',
        '150': '150ms',
      },
      animation: {
        'fade-in': 'fadeIn 160ms ease-out',
        'scale-in': 'scaleIn 160ms ease-out',
        'slide-up': 'slideUp 200ms ease-out',
        'button-press': 'buttonPress 120ms ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.98)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        buttonPress: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.98)' },
        },
      },
    },
  },
  plugins: [],
}
