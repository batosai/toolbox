import inertia from '@adonisjs/inertia/client'
import adonisjs from '@adonisjs/vite/client'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { getDirname } from '@adonisjs/core/helpers'

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

  /**
   * Define aliases for importing modules from
   * your frontend code
   */
  resolve: {
    alias: {
      '~/': `${getDirname(import.meta.url)}/src/diff/inertia/`,
    },
  },
})
