import inertia from '@adonisjs/inertia/client'
import adonisjs from '@adonisjs/vite/client'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    inertia({ ssr: { enabled: false } }),
    vue(),
    adonisjs({
      entrypoints: ['src/diff/inertia/app/app.ts'],
      reload: [
        'src/**/resources/views/**/*.edge',
        'src/**/inertia/css/**/*.css',
        'src/**/inertia/**/*.vue',
      ],
    }),
  ],
})
