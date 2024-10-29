import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  prefix: "tw-",
  theme: {
    extend: {}
  },

  plugins: []
} satisfies Config;
