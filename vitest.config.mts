import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    // Integration specs exercise Payload server-side (DB, auth, JWT signing).
    // jsdom's cross-realm TextEncoder breaks jose's `instanceof Uint8Array` check
    // during login token signing — these must run in the node environment.
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
    include: ['tests/int/**/*.int.spec.ts'],
    // These specs hit a remote Atlas cluster; the default 5s is tight under
    // parallel connection contention. Run spec files serially to keep the
    // shared connection pool sane.
    testTimeout: 30_000,
    hookTimeout: 30_000,
    fileParallelism: false,
  },
})
