import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    colors: {
      'primary': 'var(--primary)',
      'secondary': 'var(--secondary)',
      'tertiary': 'var(--tertiary)',
      'stress-primary': 'var(--stress-primary)',
      'stress-secondary': 'var(--stress-secondary)',
      'stress-tertiary': 'var(--stress-tertiary)',
      'action-primary': 'var(--action-primary)',
      'action-primary-hover': 'var(--action-primary-hover)',
      'action-secondary': 'var(--action-secondary)',
      'action-secondary-hover': 'var(--action-secondary-hover)',
    }
  },
  plugins: [require('@tailwindcss/forms')],
};
export default config;
