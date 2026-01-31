import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [
    svelte({
      hot: !process.env.VITEST,
      compilerOptions: {
        // Ensure we're in client mode for testing
        hydratable: true,
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,ts}', 'tests/**/*.{test,spec}.{js,ts}'],
    // Exclude Svelte component tests and E2E tests
    exclude: ['**/TypingAnimation.test.ts', 'node_modules/**', 'tests/e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '.astro/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/types.ts',
      ],
    },
    setupFiles: ['./tests/setup.ts'],
  },
  resolve: {
    conditions: ['browser'],
  },
});
