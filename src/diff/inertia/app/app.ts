/// <reference path="../../../../adonisrc.ts" />
/// <reference path="../../../../config/inertia.ts" />

import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import { createInertiaApp } from '@inertiajs/vue3'
import { createApp, h } from 'vue'
import type { DefineComponent } from 'vue'
import '../css/app.css'

const appName = import.meta.env.VITE_APP_NAME || 'AdonisJS'

createInertiaApp({
  progress: { color: '#5468FF' },

  title: (title: string) => `${title} - ${appName}`,

  resolve: (name: string) => {
    return resolvePageComponent(
      `../pages/${name}.vue`,
      import.meta.glob<DefineComponent>('../pages/**/*.vue')
    )
  },

  setup({ el, App, props, plugin }) {
    createApp({ render: () => h(App, props) })
      .use(plugin)
      .mount(el)
  },
})

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(() => console.log("Service Worker enregistré"))
    .catch((err) => console.error("Erreur Service Worker :", err))
}
