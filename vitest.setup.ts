// Try to load DOM testing matchers if available; ignore if not installed.
try {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	require('@testing-library/jest-dom');
} catch (e) {
	// jest-dom not installed in this environment — that's fine for node-only tests
}

// Polyfills or global mocks for Next.js can go here if needed later.
