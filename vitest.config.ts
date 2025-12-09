// Plain object export to avoid importing `vitest/config` during transient npx runs.
export default {
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
};
