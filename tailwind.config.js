// tailwind.config.js
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      animation: {
        fadeIn: 'fadeIn 0.5s ease forwards',
        pulse: 'pulse 1s infinite',
        glow: 'glow 1.5s infinite',
        slideIn: 'slideIn 0.3s ease forwards',
        pop: 'pop 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
        confetti: 'confetti 3s linear forwards',
        float: 'float 15s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        pulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        glow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 4px currentColor)' },
          '50%': { filter: 'drop-shadow(0 0 12px currentColor)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        pop: {
          '0%': { transform: 'scale(0)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
        confetti: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
          '100%': { transform: 'translateY(100vh) rotate(360deg)', opacity: 0 },
        },
        float: {
          '0%': { transform: 'translateY(100vh) translateX(0)' },
          '100%': { transform: 'translateY(-100vh) translateX(100px)' },
        },
      },
    },
  },
}
