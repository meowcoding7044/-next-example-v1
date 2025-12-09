// Minimal ambient declarations for `vitest` to satisfy the TypeScript language server
// This avoids requiring the real `vitest` package to be installed in environments
// where dev dependencies can't be installed. If you install `vitest`, prefer its
// official types and remove this file.

declare module 'vitest' {
  export const describe: (...args: any[]) => any;
  export const it: (...args: any[]) => any;
  export const test: (...args: any[]) => any;
  export const expect: any;
  export const beforeEach: (...args: any[]) => any;
  export const afterEach: (...args: any[]) => any;
  export const beforeAll: (...args: any[]) => any;
  export const afterAll: (...args: any[]) => any;
  export const vi: any;
  export default {} as any;
}
