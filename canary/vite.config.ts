import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { cloudflare } from '@cloudflare/vite-plugin'
import babel from '@rolldown/plugin-babel'
import path from 'path'

export default defineConfig({
  plugins: [
    cloudflare(),
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  resolve: {
    alias: {
      '@ui': path.resolve(__dirname, './src/lib/ui/components'),
      '@hooks': path.resolve(__dirname, './src/lib/ui/hooks'),
      '@server': path.resolve(__dirname, './src/lib/server'),
      '@pages': path.resolve(__dirname, './src/pages'),
    },
  },
})
