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
    }
  },
  plugins: [require('@tailwindcss/forms')],
};
export default config;
