import { vitePlugin as remix } from '@remix-run/dev'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { webSocketServer } from './vite-ws-server-plugin'

export default defineConfig({
  plugins: [
    remix(),
    tsconfigPaths(),
    webSocketServer(),
  ],
  test: {
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    environment:
      './vitest-environment-with-websocket.ts',
  },
})
