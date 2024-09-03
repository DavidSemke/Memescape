import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    colors: {
      'color': 'var(--color)',
      'primary': 'var(--primary)',
      'secondary': 'var(--secondary)',
      'tertiary': 'var(--tertiary)',
      'action-primary': 'var(--action-primary)',
      'action-primary-hover': 'var(--action-primary-hover)',
      'action-secondary': 'var(--action-secondary)',
      'action-secondary-hover': 'var(--action-secondary-hover)',
      'action-tertiary': 'var(--action-tertiary)',
      'action-tertiary-hover': 'var(--action-tertiary-hover)',
      'error': 'var(--error)',
      'input-primary': 'var(--input-primary)',
      'input-secondary': 'var(--input-secondary)',
      'pending': 'var(--pending)',
      'stress-primary': 'var(--stress-primary)',
      'stress-secondary': 'var(--stress-secondary)',
      'stress-tertiary': 'var(--stress-tertiary)',
      'success': 'var(--success)',
      'overlay': 'var(--overlay)'
    },
    extend: {
      keyframes: {
        bounce: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
        },
        jump: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-0.5rem)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        }
      },
      animation: {
        bounce: 'bounce 1s ease-in-out',
        jump1: 'jump 0.6s ease-in-out infinite',
        jump2: 'jump 0.6s ease-in-out 0.2s infinite',
        jump3: 'jump 0.6s ease-in-out 0.4s infinite',
        fadeIn: 'fadeIn 0.5s forwards'
      },
    }
  },
  plugins: [require('@tailwindcss/forms')],
};
export default config;
