// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  i18n: {
    defaultLocale: 'da',
    locales: ['da', 'en'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: true
    }
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
